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
        if (error) return reject(error);
        resolve(result);
      }
    );

    file.pipe(uploadStream);
  });
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const companyName = formData.get('companyName');
    const projectIdea = formData.get('projectIdea');
    const businessPhase = formData.get('businessPhase');
    const imageFile = formData.get('image'); // The uploaded image
    const videoFile = formData.get('video'); // The uploaded video

    // Connect to the database
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Convert file to buffer and upload to Cloudinary
    let projectImage = null;
    let pitchVideo = null;

    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer()); // Convert to Buffer
      const imageStream = bufferToStream(imageBuffer);
      const imageUpload = await uploadToCloudinary(imageStream);
      projectImage = imageUpload.secure_url; // Cloudinary image URL
    }

    if (videoFile) {
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer()); // Convert to Buffer
      const videoStream = bufferToStream(videoBuffer);
      const videoUpload = await uploadToCloudinary(videoStream);
      pitchVideo = videoUpload.secure_url; // Cloudinary video URL
    }

    // Create a new pitch and save to MongoDB
    const newPitch = new Pitch({
      entrepreneurId: user._id,
      companyName,
      projectIdea,
      businessPhase,
      projectImage,  // URL from Cloudinary
      pitchVideo,    // URL from Cloudinary
    });

    await newPitch.save();

    return NextResponse.json({ message: 'Project posted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
