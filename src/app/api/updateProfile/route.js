import nextConnect from 'next-connect';
import multer from 'multer';
import { getSession } from 'next-auth/react';
import connectMongoDB from '@/lib/mongodb'; 
import User from '@/models/user'; 

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).end(); 
  }

  const { email, id, company, tax } = req.body;

  if (!email || !id || !company || !tax) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await connectMongoDB();

    const fileData = req.file ? req.file.buffer.toString('base64') : null;

    const user = await User.findOneAndUpdate(
      { email: email },
      {
        id: id,
        company: company,
        tax: tax,
        file: fileData, 
      },
      { upsert: true, new: true }
    );

    if (user) {
      return res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to update profile' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default apiRoute;
