import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
}, { timestamps: true });

export const Book = mongoose.model('Book', BookSchema);
