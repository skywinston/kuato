DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS decks cascade;
DROP TABLE IF EXISTS cards cascade;

CREATE TABLE users (
    id serial primary key,
    email varchar(30) UNIQUE,
    passwordDigest varchar(80)
);

CREATE TABLE decks (
    id serial primary key,
    owner varchar(30) references users(email),
    title varchar(80) UNIQUE
);

CREATE TABLE cards (
    id serial primary key,
    deck varchar(80) references decks(title),
    question varchar(5000),
    answer varchar(5000),
    rating int,
    studied varchar(100)
);

