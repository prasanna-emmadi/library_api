import express from "express";
const app = express();
app.use(express.json());

const port = 3000;

let books = [];
let bookId = 0;

const findBook = (id) => {
  const idInt = parseInt(id);
  return books.findIndex((book) => {
    return book.id === idInt;
  });
};

// GET /books?author=<author_name>

app.get("/books", (request, response) => {
  const author = request.query.author;
  if (author) {
    const filteredBooks = books.filter((book) => {
      return book.author === author;
    });
    response.send(filteredBooks);
  } else {
    response.send(books);
  }
});

app.get("/books/:id", (request, response) => {
  const id = request.params.id;
  const index = findBook(id);
  if (index !== -1) {
    response.send(books[index]);
  } else {
    response.sendStatus(404);
  }
});

app.put("/books/:id", (request, response) => {
  const id = request.params.id;
  const index = findBook(id);
  if (index !== -1) {
    const body = request.body;
    const book = books[index];
    const updatedbook = {
      ...book,
      ...body,
    };
    books[index] = updatedbook;
    response.sendStatus(202);
  } else {
    response.sendStatus(404);
  }
});

app.post("/books", (request, response) => {
  const body = request.body;
  bookId++;
  const book = {
    ...body,
    id: bookId,
  };
  books.push(book);
  response.sendStatus(200);
});

app.delete("/books/:id", (request, response) => {
  const id = request.params.id;
  const index = findBook(id);
  if (index !== -1) {
    const pre = books.slice(0, index);
    const post = books.slice(index + 1);
    books = [...pre, ...post];
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
