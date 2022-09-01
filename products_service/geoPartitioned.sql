CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE products (
    id uuid DEFAULT gen_random_uuid(),
    geo_partition VARCHAR,
    title VARCHAR,
    country VARCHAR,
    language VARCHAR,
    author VARCHAR,
    "imageLink" VARCHAR,
    pages INTEGER,
    year INTEGER,
    price NUMERIC(5,2)
) PARTITION BY LIST (geo_partition);

CREATE TABLE products_usa
    PARTITION OF products
    (id, geo_partition, title, country, language, author, "imageLink", pages, year, price,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('USA') TABLESPACE us_west1_tablespace;
CREATE TABLE products_bra
    PARTITION OF products
    (id, geo_partition, title, country, language, author, "imageLink", pages, year, price,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('BRA') TABLESPACE southamerica_east1_tablespace;
CREATE TABLE products_lon
    PARTITION OF products
    (id, geo_partition, title, country, language, author, "imageLink", pages, year, price,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('LON') TABLESPACE europe_west2_tablespace;
CREATE TABLE products_mum
    PARTITION OF products
    (id, geo_partition, title, country, language, author, "imageLink", pages, year, price,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('MUM') TABLESPACE asia_south1_tablespace;
CREATE TABLE products_syd
    PARTITION OF products
    (id, geo_partition, title, country, language, author, "imageLink", pages, year, price,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('SYD') TABLESPACE australia_southeast1_tablespace;


/* pgcrypto includes gen_random_uuid function */

CREATE TABLE orders (
    id uuid DEFAULT gen_random_uuid(),
    total DECIMAL(12,2),
    products VARCHAR,
    geo_partition VARCHAR
) PARTITION BY LIST (geo_partition);

CREATE TABLE orders_usa
    PARTITION OF orders
    (id, total, products, geo_partition,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('USA') TABLESPACE us_west1_tablespace;
CREATE TABLE orders_bra
    PARTITION OF orders
    (id, total, products, geo_partition,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('BRA') TABLESPACE southamerica_east1_tablespace;
CREATE TABLE orders_lon
    PARTITION OF orders
    (id, total, products, geo_partition,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('LON') TABLESPACE us_west1_tablespace;
CREATE TABLE orders_mum
    PARTITION OF orders
    (id, total, products, geo_partition,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('MUM') TABLESPACE asia_south1_tablespace;
CREATE TABLE orders_syd
    PARTITION OF orders
    (id, total, products, geo_partition,
    PRIMARY KEY(id, geo_partition))
    FOR VALUES IN ('SYD') TABLESPACE australia_southeast1_tablespace;