import multer from 'multer';
import { getToken } from 'next-auth/jwt';
import connectMongoDB from '@/lib/mongodb';
import Pitch from '@/models/pitch';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), '/tmp'));
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function POST(req) {
  try {
    // Use multer to parse form data (including non-file fields)
    await runMiddleware(req, {}, upload.none());

    console.log("Parsed form data:", req.body);

    // Check if the body contains the required fields
    if (!req.body.companyName || !req.body.projectIdea) {
      return new Response(JSON.stringify({ error: 'Company name and project idea are required' }), { status: 400 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await connectMongoDB();

    const newPitch = new Pitch({
      entrepreneurId: token.sub,
      companyName: req.body.companyName,
      projectIdea: req.body.projectIdea,
      projectImage: req.body.projectImage || null, // If image is not included, set as null
      pitchVideo: req.body.pitchVideo || null,     // If video is not included, set as null
      createdAt: new Date(),
      pitchId: uuidv4(),
    });

    await newPitch.save();

    return new Response(JSON.stringify({ message: 'Project saved successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error saving project:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to save project' }), { status: 500 });
  }
}
