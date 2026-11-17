// load the variables from .env into process.env (must come first)
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";

// Activity 2, step 3: import our Book model
import Book from "./models/Book.js";

// Windows DNS fix - stops the "querySrv ECONNREFUSED" error when connecting to Atlas
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 4000;

// "middleware" = code that runs on every request before your routes.
// express.json() reads the JSON you type in Postman's Body tab
// and puts it in req.body. Without this, req.body is undefined.
app.use(express.json());

// ---------------- ROUTES (what Postman talks to) ----------------
// A "route" = an HTTP method (GET, POST...) + a URL path.
// Express matches the incoming request to one of these and runs that function.

// CREATE - POST http://localhost:4000/books
app.post("/books", async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook); // 201 = "Created"
  } catch (e) {
    res.status(400).json({ error: e.message }); // 400 = "you sent bad data"
  }
});

// READ ALL - GET http://localhost:4000/books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (e) {
    res.status(500).json({ error: e.message }); // 500 = "the server broke"
  }
});

// READ ONE - GET http://localhost:4000/books/<id>
// ":id" is a placeholder - whatever you put there shows up in req.params.id
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" }); // 404 = "not found"
    res.json(book);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// UPDATE - PUT http://localhost:4000/books/<id>
app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // send back the book AFTER the change
      runValidators: true, // still enforce "required" etc. on updates
    });
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(updatedBook);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE - DELETE http://localhost:4000/books/<id>
app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted", book: deletedBook });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Activity 2, step 5: experiment with the model in code (Create, Read, Update, Delete)
// (Not called anymore - Postman does this now. Un-comment the call in connect() to run it.)
async function experimentWithBooks() {
  const newBook = await Book.create({
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publicationYear: 1937,
    genres: ["Fantasy", "Adventure"],
  });
  console.log("Created:", newBook);

  const tolkienBooks = await Book.find({ author: "J.R.R. Tolkien" });
  console.log("Found", tolkienBooks.length, "book(s) by Tolkien");

  const updatedBook = await Book.findByIdAndUpdate(
    newBook._id,
    { inStock: false },
    { new: true },
  );
  console.log("Updated inStock to:", updatedBook.inStock);

  await Book.findByIdAndDelete(newBook._id);
  console.log("Deleted the book with id:", newBook._id.toString());
}

// Activity 2, step 2: connect to MongoDB Atlas
async function connect() {
  try {
    // MONGO_URI must match the name in your .env file EXACTLY (capital letters too)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    // Activity 2, step 4: only after the connection works
    console.log("Book model is ready to be used.");

    // await experimentWithBooks();
  } catch (e) {
    // print the real reason so we can debug it
    console.log("Not connected:", e.message);
  }
}

connect();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
