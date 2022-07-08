const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
let { addDatabaseConnection } = require("./db.js");

// database connections are initialized on boot
app.use(function (req, res, next) {
  req.currentDatabase = databases[req.query.database || 1];
  //TODO: verify that connection to database is valid
  next();
});
const databases = {};

const databaseConnections = [];
for (let i = 1; i < parseInt(process.env.DATABASE_COUNT) + 1; i++) {
  const host = process.env[`DATABASE_HOST_${i}`];
  const username = process.env[`DATABASE_USERNAME_${i}`];
  const password = process.env[`DATABASE_PASSWORD_${i}`];
  const cert = process.env[`DATABASE_CERT_PATH_${i}`];
  databaseConnections.push(
    addDatabaseConnection(host, username, password, cert)
  );
}
Promise.all(databaseConnections).then((connections) => {
  connections.forEach((connection, i) => {
    databases[i + 1] = {
      models: require("./models.js").setModels(connection),
      sequelize: connection,
      label: process.env[`DATABASE_LABEL_${i + 1}`],
      coords: process.env[`DATABASE_LATLNG_${i + 1}`],
      id: i + 1,
    };
  });
  console.log("CONNECTIONS: ", connections.length);
});

app.get("/api/products", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let productsQuery = { limit, offset: (page - 1) * limit };
  let queryLogs;
  const products = await req.currentDatabase.models.Product.findAndCountAll({
    ...productsQuery,
    logging: (msg) => {
      queryLogs = msg;
    },
  });

  let [explainAnalyzeResults, metadata] =
    await req.currentDatabase.sequelize.query(
      `EXPLAIN ANALYZE select * from products OFFSET $1`,
      {
        bind: [req.params.page || 0],
      }
    );
  explainAnalyzeResults =
    explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];

  console.log("EXPLAIN ANALYZE results: ", explainAnalyzeResults);
  console.log("EXPLAIN ANALYZE metadata: ", metadata);

  res.json({ page, limit, queryLogs, explainAnalyzeResults, data: products });
});

app.get("/api/products/:id", async (req, res) => {
  let queryLogs;
  const products = await models.Product.findOne({
    where: { id: req.params.id },
    logging: (msg) => {
      queryLogs = msg;
    },
  });

  res.json({ queryLogs, data: products });
});

app.get("/api/products/:id/recommendations", async (req, res) => {
  let queryLogs;

  //   const product = await Product.findAll({
  //     // where: { id: req.params.id },
  //     // order: [["id", "asc"]],
  //     limit: 10,
  //     include: ["recommendations"],
  //     logging: (msg) => {
  //       queryLogs = msg;
  //     },
  //   });

  const [results, metadata] = await req.currentDatabase.sequelize.query(
    `select * from products p where p.id in (select pr."recommendationId" from product_recommendations pr where pr."productId" = $1)`,
    {
      bind: [req.params.id],
      logging: (msg) => {
        queryLogs = msg;
      },
    }
  );

  let [explainAnalyzeResults, explainAnalyzeMetadata] =
    await req.currentDatabase.sequelize.query(
      `EXPLAIN ANALYZE select * from products p where p.id in (select pr."recommendationId" from product_recommendations pr where pr."productId" = $1)`,
      {
        bind: [req.params.id],
      }
    );

  explainAnalyzeResults =
    explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];

  console.log("EXPLAIN ANALYZE results: ", explainAnalyzeResults);
  console.log("EXPLAIN ANALYZE metadata: ", explainAnalyzeMetadata);

  console.log("product", results);

  res.json({ queryLogs, explainAnalyzeResults, data: results });
});

app.get("/api/databases", (req, res) => {
  try {
    const returnDBs = Object.keys(databases).map((idx) => {
      const { id, label, coords } = databases[idx];
      console.log(id);
      return { id, label, coords };
    });
    res.status(200).json({
      databases: returnDBs,
    });
  } catch (e) {
    console.log("error in fetching databases", e);
  }
});
app.get("/api/database-config", (req, res) => {
  const { database = 1 } = req.query;
  try {
    res.status(200).json({
      id: parseInt(database),
      label: process.env[`DATABASE_LABEL_${database}`],
      coords: process.env[`DATABASE_LATLNG_${database}`],
    });
  } catch (e) {
    console.log("error in fetching database config", e);
  }
});

app.listen(process.env.PRODUCTS_SERVICE_PORT, () => {
  console.log(
    `Products Service listening on ${process.env.PRODUCTS_SERVICE_PORT}`
  );
});
