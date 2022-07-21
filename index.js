import express from "express";
const app = express();
app.use(express.json());

const port = 3000;

let books = [];
let bookId = 0;

const findBook = (idInt) => {
  return books.find((book) => {
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
  const id = parseInt(request.params.id);
  const book = findBook(id);
  if (book !== undefined) {
    response.send(book);
  } else {
    response.sendStatus(404);
  }
});

app.put("/books/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const book = findBook(id);
  if (book !== undefined) {
    books = books.map((book) => {
      if (book.id === id) {
        return {
          ...book,
          ...body,
        };
      } else {
        return book;
      }
    });
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
    return books;
  }
});

app.post("/books", (request, response) => {
  const body = request.body;
  bookId++;
  const book = {
    ...body,
    id: bookId,
  };
  books = [...books, book];
  response.sendStatus(200);
});

app.delete("/books/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const index = findBook(id);
  if (index !== -1) {
    books = books.filter((book) => book.id !== id);
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
