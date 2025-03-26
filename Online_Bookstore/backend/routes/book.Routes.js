import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer.midileware";

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createBook);
router.get('/', getAllBooks);
router.get('/user', authMiddleware, getBooksByUser);
router.put('/:id', authMiddleware, upload.single('image'), updateBook);
router.delete('/:id', authMiddleware, deleteBook);

export default router;
