import { CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {    folder: 'eagles_ring_projects', // Cloudinary folder to store uploads
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // File name in Cloudinary
  },
});

const upload = multer({ storage, limits:{
  fileSize: 10 * 1024 * 1024,
} });

export default upload;