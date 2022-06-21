const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
let { changeDB } = require("./db.js");
let models, setModels, sequelize;
changeDB(
  process.env.DATABASE_HOST_1,
  process.env.DATABASE_USERNAME_1,
  process.env.DATABASE_PASSWORD_1,
  process.env.DATABASE_CERT_PATH_1
).then((sequelizeInstance) => {
  require("./models.js").setModels(sequelizeInstance);
  models = require("./models").models;
  // console.log("this is the sequelize instance", sequelizeInstance);
  sequelize = sequelizeInstance;
  setModels = require("./models").setModels;
});

app.get("/api/products", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let productsQuery = { limit, offset: (page - 1) * limit };
  let queryLogs;
  const products = await models.Product.findAndCountAll({
    ...productsQuery,
    logging: (msg) => {
      queryLogs = msg;
    },
  });

  const [results, metadata] = await sequelize.query(
    `EXPLAIN ANALYZE select * from products OFFSET $1`,
    {
      bind: [req.params.page || 0],
    }
  );
  console.log("EXPLAIN ANALYZE results: ", results);

  res.json({ page, limit, queryLogs, data: products });
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

  const [results, metadata] = await sequelize.query(
    `select * from products p where p.id in (select pr."recommendationId" from product_recommendations pr where pr."productId" = $1)`,
    {
      bind: [req.params.id],
      logging: (msg) => {
        queryLogs = msg;
      },
    }
  );
  console.log("product", results);

  res.json({ queryLogs, data: results });
});
app.post("/api/database-config", async (req, res) => {
  console.log(req.body);
  try {
    const dbresp = await changeDB(
      process.env[`DATABASE_HOST_${req.body.cluster}`],
      process.env[`DATABASE_USERNAME_${req.body.cluster}`],
      process.env[`DATABASE_PASSWORD_${req.body.cluster}`],
      process.env[`DATABASE_CERT_PATH_${req.body.cluster}`]
    );
    sequelize = dbresp;
    setModels(sequelize);
    res.status(200).send({ foo: "bar" });
  } catch (e) {
    console.log("Error in changing database config", e);
    res.status(404).json({ message: e });
  }
});

app.listen(process.env.PRODUCTS_SERVICE_PORT, () => {
  console.log(
    `Products Service listening on ${process.env.PRODUCTS_SERVICE_PORT}`
  );
});
