DROP TABLE IF EXISTS users cascade;

CREATE TABLE users (
    id serial primary key,
    email varchar(30),
    passwordDigest varchar(80)
);