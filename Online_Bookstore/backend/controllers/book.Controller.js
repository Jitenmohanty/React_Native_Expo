import { Book } from "../models/bookSchema.js";

// Create a new book
export const createBook = async (req, res) => {
    try {
        const { title, description, image, rating } = req.body;
        const userId = req.user.id; // Assuming user is authenticated via middleware
        const imagePath = req.files?.image?.path;

        if (!imagePath) {
            throw new ApiError(400, "image not found is required!");
          }
        
          // upload them to cloudinary, avatar
          const imageUrl = await uploadCloudinary(imagePath);

        if (!title || !description) return res.status(400).json({ message: 'Title and description are required' });

        const book = new Book({ title, description, image:imageUrl?.url, rating, user: userId });
        await book.save();

        res.status(201).json({ message: 'Book created successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all books (with user details)
export const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10 books per page
        const skip = (page - 1) * limit;
        const books = await Book.find()
                    .sort({createdAt:-1})
                    .skip(page)
                    .limit(limit)
                    .populate("user","name profilePicture")

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get books by user
export const getBooksByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const books = await Book.find({ user: userId });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update book
export const updateBook = async (req, res) => {
    try {
        const { title, description, image, rating } = req.body;
        const bookId = req.params.id;
        const userId = req.user.id;

        let book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.user.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

        const imagePath = req.files?.image?.path;

        if (!imagePath) {
            throw new ApiError(400, "image not found is required!");
          }
        
          // upload them to cloudinary, avatar
          const imageUrl = await uploadCloudinary(imagePath);

        book.title = title || book.title;
        book.description = description || book.description;
        book.image = imageUrl.url || book.image;
        book.rating = rating !== undefined ? rating : book.rating;

        await book.save();
        res.json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete book
export const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.user.id;

        let book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.user.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

        await book.deleteOne();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
