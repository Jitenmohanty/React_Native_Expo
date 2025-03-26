
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.Routes.js";
import bookRoutes from "./routes/book.Routes.js";

dotenv.config({
    path: "./.env",
  });

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// Routes
app.use('/api/auth', authRoutes);

app.use('/api/books', bookRoutes);


app.listen(PORT, () => {
    // Connect to MongoDB
    console.log(`Server running on port ${PORT}`);
    connectDB()
});
