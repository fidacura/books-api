-- db/init.sql

-- Books table
CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    pages INTEGER NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    publication_date DATE NOT NULL,
    read_state VARCHAR(20) NOT NULL,
    opening_line TEXT,
    language VARCHAR(50),
    edition VARCHAR(100),
    description TEXT,
    cover_image_url VARCHAR(255),
    series_name VARCHAR(255),
    series_number INTEGER,
    format VARCHAR(50),
    rating DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Book-Authors junction table
CREATE TABLE IF NOT EXISTS book_authors (
    book_id INTEGER REFERENCES books(book_id),
    author_id INTEGER REFERENCES authors(author_id),
    PRIMARY KEY (book_id, author_id)
);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Book-Genres junction table
CREATE TABLE IF NOT EXISTS book_genres (
    book_id INTEGER REFERENCES books(book_id),
    genre_id INTEGER REFERENCES genres(genre_id),
    PRIMARY KEY (book_id, genre_id)
);

-- Insert authors
INSERT INTO authors (name) VALUES 
('Hanya Yanagihara'),
('Gregory David Roberts'),
('Geoff Dyer'),
('Haruki Murakami'),
('William Gibson'),
('Neil Gaiman'),
('J.D. Salinger'),
('Aldous Huxley'),
('Oscar Wilde'),
('Philip K. Dick');

-- Insert genres
INSERT INTO genres (name) VALUES 
('Literary Fiction'),
('Adventure'),
('Contemporary Fiction'),
('Magical Realism'),
('Science Fiction'),
('Fantasy'),
('Philosophy'),
('Classic Literature'),
('Dystopian Fiction');

-- Start a transaction
BEGIN;

-- Insert books
INSERT INTO books (title, isbn, pages, publisher, publication_date, read_state, opening_line, language, edition, description, cover_image_url, series_name, series_number, format, rating) VALUES 
('A Little Life', '9780804172707', 720, 'Anchor', '2016-01-26', 'read', 'The elevator was slow and smelled of a mix of unwashed bodily fluids.', 'English', 'Paperback', 'A profound and stirring epic about four classmates from a small Massachusetts college who move to New York to make their way.', 'https://example.com/alittlelife.jpg', NULL, NULL, 'Paperback', 4.32),

('Shantaram', '9780312330538', 944, 'St. Martin''s Griffin', '2004-10-13', 'unread', 'It took me a long time and most of the world to learn what I know about love and fate and the choices we make, but the heart of it came to me in an instant, while I was chained to a wall and being tortured.', 'English', 'Paperback', 'A novel of high adventure, great storytelling and moral purpose, based on an extraordinary true story of eight years in the Bombay underworld.', 'https://example.com/shantaram.jpg', NULL, NULL, 'Paperback', 4.27),

('Jeff in Venice, Death in Varanasi', '9780307390301', 304, 'Vintage', '2010-04-06', 'in-progress', 'I''m not a big fan of the Biennale.', 'English', 'Paperback', 'A wildly original novel that presents two narratives, featuring two different protagonists, set in two different cities.', 'https://example.com/jeffinvenice.jpg', NULL, NULL, 'Paperback', 3.64),

('After Dark', '9780307278739', 256, 'Vintage', '2007-04-29', 'read', 'Eyes mark the shape of the city.', 'English', 'Paperback', 'A short, sleek novel of encounters set in Tokyo during the witching hours between midnight and dawn.', 'https://example.com/afterdark.jpg', NULL, NULL, 'Paperback', 3.88),

('Pattern Recognition', '9780425198681', 367, 'Berkley', '2004-02-03', 'unread', 'Five hours'' New York jet lag and Cayce Pollard wakes in Camden Town to the dire and ever-circling wolves of disrupted circadian rhythm.', 'English', 'Paperback', 'A contemporary novel set in the immediate present, exploring the hidden world of marketing and advertising.', 'https://example.com/patternrecognition.jpg', 'Blue Ant', 1, 'Paperback', 3.87),

('Neverwhere', '9780060557812', 400, 'William Morrow Paperbacks', '2003-09-02', 'read', 'The night before he went to London, Richard Mayhew was not enjoying himself.', 'English', 'Paperback', 'A fantasy novel about a man who becomes invisible and loses his identity in London.', 'https://example.com/neverwhere.jpg', NULL, NULL, 'Paperback', 4.17),

('Franny and Zooey', '9780316769495', 201, 'Little, Brown and Company', '1991-05-01', 'unread', 'Though brilliantly sunny, Saturday morning was overcoat weather again, not just topcoat weather, as it had been all week and as everyone had hoped it would stay for the big weekend - the weekend of the Yale game.', 'English', 'Paperback', 'The short story and novella that together form the book Franny and Zooey.', 'https://example.com/frannyandzooey.jpg', NULL, NULL, 'Paperback', 3.99),

('The Doors of Perception', '9780061729072', 124, 'Harper Perennial Modern Classics', '2009-07-28', 'read', 'To fathom Hell or soar angelic, just take a pinch of psychedelic.', 'English', 'Paperback', 'Huxley''s account of his experience taking mescaline in May 1953.', 'https://example.com/doorofperception.jpg', NULL, NULL, 'Paperback', 4.0),

('The Picture of Dorian Gray', '9780141439570', 254, 'Penguin Classics', '2003-02-04', 'read', 'The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.', 'English', 'Paperback', 'A philosophical novel by Oscar Wilde, first published complete in the July 1890 issue of Lippincott''s Monthly Magazine.', 'https://example.com/dorianngray.jpg', NULL, NULL, 'Paperback', 4.11),

('VALIS', '9780547572413', 271, 'Mariner Books', '2011-10-18', 'unread', 'Horselover Fat''s nervous breakdown began the day he got the letter from Gloria.', 'English', 'Paperback', 'A 1981 science fiction novel by American writer Philip K. Dick, the first book in Philip K. Dick''s VALIS trilogy.', 'https://example.com/valis.jpg', 'VALIS', 1, 'Paperback', 3.97);

-- Link books to authors
INSERT INTO book_authors (book_id, author_id) VALUES 
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10);

-- Link books to genres (some books may have multiple genres)
INSERT INTO book_genres (book_id, genre_id) VALUES 
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 1), (8, 7), (9, 8), (10, 9);

-- Commit the transaction
COMMIT;


-- Function to check if a book has at least one author
CREATE OR REPLACE FUNCTION check_author_exists() RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id = NEW.book_id) THEN
        RAISE EXCEPTION 'A book must have at least one author.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure each book has at least one author
CREATE CONSTRAINT TRIGGER trigger_check_author_exists
AFTER INSERT ON books
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_author_exists();

-- Indexes for improved query performance
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_authors_name ON authors(name);
CREATE INDEX idx_genres_name ON genres(name);
