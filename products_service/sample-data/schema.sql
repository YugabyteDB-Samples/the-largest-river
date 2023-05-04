DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS orders;

CREATE TYPE product_type_enum AS ENUM ('book', 'technology');

CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    "imageLink" VARCHAR(255),
    price decimal(12, 2),
    product_type product_type_enum
);

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    total decimal(12, 2),
    products VARCHAR(255)
);