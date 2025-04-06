import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.midileware.js";
import { createBook, deleteBook, getAllBooks, getBooksByUser, updateBook } from "../controllers/book.Controller.js";

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createBook);
router.get('/', getAllBooks);
router.get('/user', authMiddleware, getBooksByUser);
router.put('/:id', authMiddleware, upload.single('image'), updateBook);
router.delete('/:id', authMiddleware, deleteBook);

export default router;
