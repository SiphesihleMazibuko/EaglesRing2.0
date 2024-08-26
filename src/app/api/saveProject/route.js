import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import Pitch from '@/models/Pitch';
import connectMongoDB from "@/lib/mongodb";

export const config = {
  api: {
    bodyParser: false, // Disabling Next.js body parser, formidable will handle it
  },
};

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      uploadDir: './public/uploads', // Directory where files will be uploaded
      keepExtensions: true, // Keep file extensions
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'File parsing error' });
      }

      try {
        const { companyName, projectIdea } = fields;

        if (!companyName || !projectIdea) {
          return res.status(400).json({ success: false, message: 'Required fields are missing' });
        }

        const imagePath = files.image ? `/uploads/${path.basename(files.image.filepath)}` : null;
        const videoPath = files.video ? `/uploads/${path.basename(files.video.filepath)}` : null;

        const pitch = new Pitch({
          entrepreneurId: req.user._id, // Assuming you have user authentication set up
          companyName,
          projectIdea,
          projectImage: imagePath,
          pitchVideo: videoPath,
        });

        await pitch.save();

        res.status(201).json({ success: true, data: pitch });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
