// bring in mongoose and pull out (destructure) the Schema class
import mongoose, { Schema } from "mongoose";

// Activity 1, step 3: the Schema is the "blueprint" -
// it describes what every book document in the books collection should look like
const bookSchema = new Schema({
  title: {
    type: String,
    required: true, // a book MUST have a title or Mongoose refuses to save it
  },
  author: {
    type: String,
    required: true,
  },
  publicationYear: Number,
  genres: [String], // square brackets = an array of strings
  inStock: {
    type: Boolean,
    default: true, // if you don't give a value, it becomes true automatically
  },
});

// Activity 1, step 4: "compile" the schema into a model.
// The model is the tool we actually use to create/find/update/delete books.
// Mongoose turns the name "Book" into a collection called "books".
const Book = mongoose.model("Book", bookSchema);

// Activity 1, step 5: export it so other files (like index.js) can import it
export default Book;
