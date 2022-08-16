# API

## User API

| Method | Path        | Description                                      |
| ------ | ----------- | ------------------------------------------------ |
| `POST` | `/register` | Registers a new user                             |
| `PUT`  | `/login`    | Logins the user based on request body parameters |
| `GET`  | `/refresh`  | Gets a new token                                 |

## Books API

| Method   | Path            | Description                                 |
| -------- | --------------- | ------------------------------------------- |
| `GET`    | `/books`        | Find all the books of the user              |
| `POST`   | `/books`        | Create a book for the user                  |
| `PUT`    | `/books`        | Modifies the book based on the request body |
| `DELETE` | `/books/:title` | Delete a book by title                      |
