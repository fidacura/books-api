# books-api

A simple RESTful API for managing a book collection.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Endpoints](#endpoints)
4. [Request & Response Examples](#request--response-examples)
5. [Error Handling](#error-handling)
6. [Docker Commands](#docker-commands)
7. [Happy Reading](#happy-reading)

## Overview

This API allows CRUD operations on a book collection. It's built with Node.js, Express, and PostgreSQL; Containerized with Docker.

## Setup

1. Clone the repository:

```bash
git clone https://github.com/fidacura/books-api.git
cd books-api
```

2. Create a `.env` file in the root directory with the following variables:

```bash
NODE_ENV=development
API_PORT=4242
POSTGRES_BOOKS_HOST=books-api
POSTGRES_BOOKS_DB=your_db_name
POSTGRES_BOOKS_USER=your_db_user
POSTGRES_BOOKS_PASSWORD=your_db_password
```

3. Build and start the Docker containers:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:4242`.

## Endpoints

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| GET    | /books                      | Get all books                 |
| GET    | /books/author/:author       | Get books by author           |
| GET    | /books/genre/:genre         | Get books by genre            |
| GET    | /books/publisher/:publisher | Get books by publisher        |
| GET    | /books/title/:title         | Get books by title            |
| GET    | /books/id/:id               | Get a book by ID              |
| GET    | /books/isbn/:isbn           | Get a book by ISBN            |
| POST   | /books                      | Create a new book             |
| PUT    | /books/:id                  | Update a book                 |
| DELETE | /books/:id                  | Delete a book                 |
| GET    | /health                     | Check API and database health |

## Request & Response Examples

### GET /books

Response:

```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "book_id": 1,
        "title": "Jeff in Venice, Death in Varanasi",
        "isbn": "9780307390301",
        "pages": 304,
        "publisher": "Vintage",
        "publication_date": "2010-04-06",
        "read_state": "in-progress",
        "opening_line": "I'm not a big fan of the Biennale.",
        "language": "English",
        "edition": "Paperback",
        "description": "A wildly original novel that presents two narratives, featuring two different protagonists, set in two different cities.",
        "cover_image_url": "/static/jeffinvenice.jpg",
        "series_name": null,
        "series_number": null,
        "format": "Paperback",
        "rating": 3.64,
        "authors": ["Geoff Dyer"],
        "genres": ["Contemporary Fiction"]
      }
      // ... more books
    ]
  }
}
```

### POST /books

Request:

```json
{
  "title": "New Book",
  "author": ["John Doe"],
  "isbn": "1234567890",
  "pages": 300,
  "publisher": "Example Publishing",
  "publication_date": "2023-07-23",
  "read_state": "unread"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "book": {
      "book_id": 11,
      "title": "New Book",
      "isbn": "1234567890",
      "pages": 300,
      "publisher": "Example Publishing",
      "publication_date": "2023-07-23",
      "read_state": "unread",
      "authors": ["John Doe"]
    }
  }
}
```

### Error Handling

The API uses custom error handling. Errors will be returned in the following format:

```json
{
  "status": "fail",
  "message": "Error message here"
}
```

## Happy Reading!

"I have always imagined that Paradise will be a kind of library." - Jorge Luis Borges

Happy coding, and happy reading! 📚✨

---

P.S. Found a bug? Think of a cool feature? Open an issue or submit a pull request.
