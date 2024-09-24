import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import connectToDatabase from '@/lib/mongodb';
import Pitch from '@/models/pitch';
import User from '@/models/user';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { Readable } from 'stream';

// Helper function to convert a Blob into a stream
function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// Helper function to upload file stream to Cloudinary
async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'eagles_ring_projects', resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error); // Log the error and reject the promise
        resolve(result); // Resolve the promise with Cloudinary result
      }
    );
    file.pipe(uploadStream); // Pipe the file stream to Cloudinary
  });
}

export async function POST(req) {
  try {
    // Parse form data
    const formData = await req.formData();
    const companyName = formData.get('companyName');
    const projectIdea = formData.get('projectIdea');
    const businessPhase = formData.get('businessPhase');
    const imageFile = formData.get('image'); // The uploaded image
    const videoFile = formData.get('video'); // The uploaded video

    // Connect to the database
    await connectToDatabase();

    // Get the current session
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Initialize variables for Cloudinary URLs
    let projectImage = null;
    let pitchVideo = null;

    // Handle image upload
    if (imageFile) {
      try {
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer()); // Convert image to Buffer
        const imageStream = bufferToStream(imageBuffer); // Convert buffer to stream
        const imageUpload = await uploadToCloudinary(imageStream); // Upload to Cloudinary
        projectImage = imageUpload.secure_url; // Get the Cloudinary image URL
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ message: 'Image upload failed', error: error.message }, { status: 500 });
      }
    }

    // Handle video upload
    if (videoFile) {
      try {
        const videoBuffer = Buffer.from(await videoFile.arrayBuffer()); // Convert video to Buffer
        const videoStream = bufferToStream(videoBuffer); // Convert buffer to stream
        const videoUpload = await uploadToCloudinary(videoStream); // Upload to Cloudinary
        pitchVideo = videoUpload.secure_url; // Get the Cloudinary video URL
      } catch (error) {
        console.error('Error uploading video:', error);
        return NextResponse.json({ message: 'Video upload failed', error: error.message }, { status: 500 });
      }
    }

    // Create a new pitch and save it to MongoDB
    const newPitch = new Pitch({
      entrepreneurId: user._id,
      companyName,
      projectIdea,
      businessPhase,
      projectImage,  // Cloudinary image URL
      pitchVideo,    // Cloudinary video URL
    });

    // Save the pitch to the database
    await newPitch.save();

    return NextResponse.json({ message: 'Project posted successfully!' }, { status: 200 });
  } catch (error) {
    // Catch all errors and return a 500 response
    console.error('Error saving project:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
