import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/files.controller.js';

const router = Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadFile);

export default router;
