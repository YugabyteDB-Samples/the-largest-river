const pg = require("pg");
const config = {
  user: "admin",
  database: "testing_tlr",
  host: "localhost",
  password: "password",
  port: 5008,
  // this object will be passed to the TLSSocket constructor
  ssl: {
    rejectUnauthorized: false,
  },
};

const sampleProducts = require("./sample-data/booksGeoPartitioned.json");

const seedDb = async () => {
  console.log("attempting to seed geo-partitioned db");
  try {
    var client = new pg.Client(config);
    console.log("client: ", client);
    const connection = await client.connect();
    console.log("connection: ", connection);

    for (let i = 0; i < sampleProducts.products.length; i++) {
      const product = sampleProducts.products[i];
      const values = [
        "geo_partition",
        "title",
        "country",
        "language",
        "author",
        "imageLink",
        "pages",
        "year",
        "price",
      ].map((key) => product[key]);
      await client.query(
        'INSERT INTO products (geo_partition, title, country, language, author, "imageLink", pages, year, price) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        values
      );
    }
    console.log("inserted products into db");
    process.exit(1);
  } catch (e) {
    console.log("error in creating database testing_tlr", e);
  }
};

seedDb();
