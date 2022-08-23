const express = require("express");

if (process.env.NODE_ENV === "development") require("dotenv").config();

const config = require("config");
const app = express();
const cors = require("cors");

const DATABASE_COUNT = config.get("DATABASE_COUNT");
const PORT = config.get("PRODUCTS_SERVICE_PORT");

// ESM error without dynamic import
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
let { addDatabaseConnection } = require("./db.js");

// database connections are initialized on boot
const databases = {};
app.use(function (req, res, next) {
  // console.log("req.query.database: ", req.query.database);
  req.currentDatabase = databases[req.query.database || "multi_region"];
  // console.log("middleware setting req.currentDatabase: ", req.currentDatabase);
  //TODO: verify that connection to database is valid
  next();
});

const Databases = config.get("Databases");
console.log("DATABASES:", Databases);
const databaseConnections = [];
for (let i = 0; i < parseInt(DATABASE_COUNT); i++) {
  const { host, username, password, nodes } = Databases[i];
  const cert =
    process.env.NODE_ENV === "production"
      ? Databases[i].cert
      : Databases[i].dev_cert;
  const url = `${nodes[0].zone}.${host}`;
  console.log("url", url);
  databaseConnections.push(
    addDatabaseConnection(url, username, password, cert, i)
  );
}
Promise.allSettled(databaseConnections).then((connections) => {
  // console.log("Connections: ", connections);
  connections.forEach((connection, i) => {
    // console.log("Connection:", connection);
    const { id, label, sublabel, nodes } = Databases[i];
    databases[id] = {
      models:
        connection.status === "fulfilled"
          ? require("./models.js").setModels(connection.value)
          : null,
      sequelize: connection.value,

      tlr_properties: {
        label,
        sublabel,
        nodes,
        id,
      },
    };
  });
});

app.get("/api/trafficLocations", async (req, res) => {
  const trafficLocations = config.get("TrafficLocations");
  res.json({
    data: trafficLocations,
  });
});
app.get("/api/clusters", async (req, res) => {
  try {
    const { YB_MANAGED_ACCOUNT_ID, YB_MANAGED_PROJECT_ID, YB_MANAGED_API_KEY } =
      config.get("YB_MANAGED_ACCOUNT");
    console.log("*** clusters request *** ");
    const url = `https://cloud.yugabyte.com/api/public/v1/accounts/${YB_MANAGED_ACCOUNT_ID}/projects/${YB_MANAGED_PROJECT_ID}/clusters`;
    console.log("Requesting clusters at: ", url);
    const clusters = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YB_MANAGED_API_KEY}`,
      },
    });

    const json = await clusters.json();

    res.json(json);
  } catch (e) {
    console.log("error in /api/cluster", e);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    console.log("req.currentdatabase", req.currentDatabase);
    if (!req?.currentDatabase?.sequelize)
      throw new Error("no database connection for products call");
    let { page = 1, limit = 10, showExecutionPlan = "false" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    showExecutionPlan = showExecutionPlan === "true";
    let productsQuery = { limit, offset: (page - 1) * limit };
    let queryLogs;

    let time = Date.now();
    const [products] = await req.currentDatabase.sequelize.query(
      `SELECT * from products LIMIT $1 OFFSET $2`,
      {
        bind: [productsQuery.limit, productsQuery.offset],
        logging: (msg) => {
          queryLogs = msg;
        },
      }
    );

    let explainAnalyzeResults = [],
      metadata;
    if (showExecutionPlan) {
      [explainAnalyzeResults, metadata] =
        await req.currentDatabase.sequelize.query(
          `EXPLAIN ANALYZE select * from products OFFSET $1`,
          {
            bind: [req.params.page || 0],
          }
        );
      time = Date.now() - time;
      explainAnalyzeResults =
        explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];
    } else {
      time = Date.now() - time;
    }

    res.json({
      page,
      limit,
      latency: time,
      queryLogs,
      explainAnalyzeResults,
      data: products,
    });
  } catch (e) {
    console.log("error in fetching products", e);
    res.status(400).send({ error: e, data: [] });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    if (!req?.currentDatabase?.sequelize)
      throw new Error("no database connection for product call");
    let queryLogs;
    const [product] = await req.currentDatabase.sequelize.query(
      `SELECT * from products where id = $1`,
      {
        bind: [req.params.id],
        logging: (msg) => {
          queryLogs = msg;
        },
      }
    );

    let [explainAnalyzeResults, metadata] =
      await req.currentDatabase.sequelize.query(
        `EXPLAIN ANALYZE select * from products where id = $1`,
        {
          bind: [req.params.id || 0],
        }
      );
    explainAnalyzeResults =
      explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];

    console.log("EXPLAIN ANALYZE results: ", explainAnalyzeResults);
    console.log("EXPLAIN ANALYZE metadata: ", metadata);

    res.json({ queryLogs, explainAnalyzeResults, data: product[0] });
  } catch (e) {
    console.log("error in fetching product", e);
    res.status(400).send({ error: e, data: {} });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    let queryLogs;
    console.log("CURRENTDB", req.currentDatabase);
    const dbRes = await req.currentDatabase.models.Order.create(
      {
        total: req.body.total,
        products: req.body.products.join(","),
      },
      {
        logging: (msg, a, b, c) => {
          queryLogs = msg;
          console.log("order queryLogs: ", queryLogs);
          console.log("order a: ", a);
          console.log("order b: ", b);
          console.log("order c: ", c);
        },
      }
    );

    res.status(201).json({ data: dbRes, queryLogs });
  } catch (e) {
    console.log("error in /api/orders", e);
    res.status(400);
  }
});

app.get("/api/databases", (req, res) => {
  try {
    const returnDBs = Object.keys(databases).map((key) => {
      console.log("Database: ", databases[key]);
      return databases[key].tlr_properties;
    });
    res.status(200).json({
      databases: returnDBs,
    });
  } catch (e) {
    console.log("error in fetching databases", e);
  }
});

app.get("/api/databases/:id/nodes", (req, res) => {
  try {
    const key = req.params.id;
    console.log("key:", key);
    console.log("databases:", databases);
    const database = databases[key];
    const nodes = database.tlr_properties.nodes;

    res.status(200).json({
      nodes: nodes,
    });
  } catch (e) {
    console.log("error in fetching databases", e);
  }
});

// app.get("/api/products/:id/recommendations", async (req, res) => {
//   let queryLogs;

//   //   const product = await Product.findAll({
//   //     // where: { id: req.params.id },
//   //     // order: [["id", "asc"]],
//   //     limit: 10,
//   //     include: ["recommendations"],
//   //     logging: (msg) => {
//   //       queryLogs = msg;
//   //     },
//   //   });

//   const [results, metadata] = await req.currentDatabase.sequelize.query(
//     `select * from products p where p.id in (select pr."recommendationId" from product_recommendations pr where pr."productId" = $1)`,
//     {
//       bind: [req.params.id],
//       logging: (msg) => {
//         queryLogs = msg;
//       },
//     }
//   );

//   let [explainAnalyzeResults, explainAnalyzeMetadata] =
//     await req.currentDatabase.sequelize.query(
//       `EXPLAIN ANALYZE select * from products p where p.id in (select pr."recommendationId" from product_recommendations pr where pr."productId" = $1)`,
//       {
//         bind: [req.params.id],
//       }
//     );

//   explainAnalyzeResults =
//     explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];

//   console.log("EXPLAIN ANALYZE results: ", explainAnalyzeResults);
//   console.log("EXPLAIN ANALYZE metadata: ", explainAnalyzeMetadata);

//   console.log("product", results);

//   res.json({ queryLogs, explainAnalyzeResults, data: results });
// });

// app.get("/api/database-config", (req, res) => {
//   const { database = 1 } = req.query;
//   try {
//     res.status(200).json({
//       id: parseInt(database),
//       label: process.env[`DATABASE_LABEL_${database}`],
//       coords: process.env[`DATABASE_LATLNG_${database}`],
//     });
//   } catch (e) {
//     console.log("error in fetching database config", e);
//   }
// });

app.listen(PORT, () => {
  console.log(`Products Service listening on ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); // mandatory (as per the Node.js docs)
});
