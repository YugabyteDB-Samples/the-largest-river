CREATE TABLESPACE us_west1_tablespace WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "us-west1-a", "region": "us-west1", "min_num_replicas": 1}]}'
);

CREATE TABLESPACE southamerica_east1_tablespace WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "southamerica-east1-a", "region": "southamerica-east1", "min_num_replicas": 1}]}'
);

CREATE TABLESPACE europe_west2_tablespace WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "europe-west2-c", "region": "europe-west2", "min_num_replicas": 1}]}'
);

CREATE TABLESPACE asia_south1_tablespace WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "asia-south1-c", "region": "asia-south1", "min_num_replicas": 1}]}'
);

CREATE TABLESPACE australia_southeast1_tablespace WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks": [{"cloud": "gcp", "zone": "australia-southeast1-c", "region": "australia-southeast1", "min_num_replicas": 1}]}'
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE product_type_enum AS ENUM ('book', 'technology');

CREATE TABLE products (
    id uuid DEFAULT gen_random_uuid(),
    geo_partition VARCHAR,
    title VARCHAR(255),
    author VARCHAR(255),
    "imageLink" VARCHAR(255),
    price decimal(12, 2),
    product_type product_type_enum
) PARTITION BY LIST (geo_partition);

CREATE TABLE products_usa PARTITION OF products (
    id,
    geo_partition,
    author,
    "imageLink",
    title,
    price,
    product_type,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('USA') TABLESPACE us_west1_tablespace;

CREATE TABLE products_bra PARTITION OF products (
    id,
    geo_partition,
    author,
    "imageLink",
    title,
    price,
    product_type,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('BRA') TABLESPACE southamerica_east1_tablespace;

CREATE TABLE products_lon PARTITION OF products (
    id,
    geo_partition,
    author,
    "imageLink",
    title,
    price,
    product_type,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('LON') TABLESPACE europe_west2_tablespace;

CREATE TABLE products_mum PARTITION OF products (
    id,
    geo_partition,
    author,
    "imageLink",
    title,
    price,
    product_type,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('MUM') TABLESPACE asia_south1_tablespace;

CREATE TABLE products_syd PARTITION OF products (
    id,
    geo_partition,
    author,
    "imageLink",
    title,
    price,
    product_type,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('SYD') TABLESPACE australia_southeast1_tablespace;

/* pgcrypto includes gen_random_uuid function */
CREATE TABLE orders (
    id uuid DEFAULT gen_random_uuid(),
    total DECIMAL(12, 2),
    products VARCHAR,
    geo_partition VARCHAR
) PARTITION BY LIST (geo_partition);

CREATE TABLE orders_usa PARTITION OF orders (
    id,
    total,
    products,
    geo_partition,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('USA') TABLESPACE us_west1_tablespace;

CREATE TABLE orders_bra PARTITION OF orders (
    id,
    total,
    products,
    geo_partition,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('BRA') TABLESPACE southamerica_east1_tablespace;

CREATE TABLE orders_lon PARTITION OF orders (
    id,
    total,
    products,
    geo_partition,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('LON') TABLESPACE europe_west2_tablespace;

CREATE TABLE orders_mum PARTITION OF orders (
    id,
    total,
    products,
    geo_partition,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('MUM') TABLESPACE asia_south1_tablespace;

CREATE TABLE orders_syd PARTITION OF orders (
    id,
    total,
    products,
    geo_partition,
    PRIMARY KEY(id, geo_partition)
) FOR
VALUES
    IN ('SYD') TABLESPACE australia_southeast1_tablespace;