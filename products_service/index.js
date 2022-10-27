const express = require("express");

if (process.env.NODE_ENV === "development") require("dotenv").config();

const config = require("config");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const DATABASE_COUNT = config.get("DATABASE_COUNT");
const PORT = config.get("PRODUCTS_SERVICE_PORT");
const NODE_APP_INSTANCE = process.env.NODE_APP_INSTANCE;

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
  req.databaseType = req.currentDatabase?.tlr_properties.type;

  if (req.databaseType === "geo_partitioned") {
    switch (NODE_APP_INSTANCE) {
      case "los-angeles":
        req.partition = "USA";
        break;
      case "washington-dc":
        req.partition = "USA";
        break;
      case "sao-paulo":
        req.partition = "BRA";
        break;
      case "london":
        req.partition = "LON";
        break;
      case "mumbai":
        req.partition = "MUM";
        break;
      case "sydney":
        req.partition = "SYD";
        break;
      default:
        req.partition = "USA";
        break;
    }
  }
  // console.log("middleware setting req.currentDatabase: ", req.currentDatabase);
  //TODO: verify that connection to database is valid
  next();
});

const Databases = config.get("Databases");
console.log("DATABASES:", Databases);
const databaseConnections = [];
for (let i = 0; i < parseInt(DATABASE_COUNT); i++) {
  const { host, username, password, nodes, id, type } = Databases[i];
  const certPath =
    process.env.NODE_ENV === "production"
      ? Databases[i].cert
      : Databases[i].dev_cert;

  const nodePreferences = config.get("node_preferences");
  console.log("NODE_APP_INSTANCE", NODE_APP_INSTANCE);
  const nodePreferenceIdx = nodePreferences[NODE_APP_INSTANCE][id][0];
  console.log("nodePreference", nodePreferenceIdx);
  const preferredNode = nodes[nodePreferenceIdx];
  const port = preferredNode.local_port;
  console.log("local port: ", port);
  const url = `${preferredNode.zone}.${host}`;
  console.log("url", url);
  const requiresTunnel = preferredNode.requires_tunnel;
  databaseConnections.push(
    addDatabaseConnection({
      url,
      username,
      password,
      certPath,
      port,
      type,
      requiresTunnel,
    })
  );
}
Promise.allSettled(databaseConnections).then((connections) => {
  // console.log("Connections: ", connections);
  connections.forEach((connection, i) => {
    // console.log("Connection:", connection);
    const { id, label, sublabel, nodes, type } = Databases[i];
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
        type,
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
    if (!req?.currentDatabase?.sequelize)
      throw new Error("no database connection for products call");
    let { page = 1, limit = 10, showExecutionPlan = "false" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    showExecutionPlan = showExecutionPlan === "true";
    let productsQuery = { limit, offset: (page - 1) * limit };
    let queryLogs;

    let time = Date.now();
    const dbType = req.databaseType;

    const [products] = await req.currentDatabase.sequelize.query(
      dbType === "geo_partitioned"
        ? `SELECT * from products WHERE geo_partition = $3 LIMIT $1 OFFSET $2`
        : `SELECT * from products LIMIT $1 OFFSET $2`,
      {
        bind:
          dbType === "geo_partitioned"
            ? [productsQuery.limit, productsQuery.offset, req.partition]
            : [productsQuery.limit, productsQuery.offset],
        logging: (msg) => {
          queryLogs = msg;
        },
        logQueryParameters: true,
      }
    );
    const latency = Date.now() - time;
    let explainAnalyzeResults = [],
      metadata;
    if (showExecutionPlan) {
      [explainAnalyzeResults, metadata] =
        await req.currentDatabase.sequelize.query(
          dbType === "geo_partitioned"
            ? `EXPLAIN ANALYZE SELECT * from products WHERE geo_partition = $3 LIMIT $1 OFFSET $2`
            : `EXPLAIN ANALYZE SELECT * from products LIMIT $1 OFFSET $2`,
          {
            bind:
              dbType === "geo_partitioned"
                ? [productsQuery.limit, productsQuery.offset, req.partition]
                : [productsQuery.limit, productsQuery.offset],
            logQueryParameters: true,
          }
        );

      explainAnalyzeResults =
        explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];
    }

    res.json({
      page,
      limit,
      latency,
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
    const dbType = req.databaseType;
    let queryLogs;
    let latency;

    const time = Date.now();
    const [product] = await req.currentDatabase.sequelize.query(
      dbType === "geo_partitioned"
        ? `SELECT * from products where id = $1 and geo_partition = $2`
        : `SELECT * from products where id = $1`,
      {
        bind:
          dbType === "geo_partitioned"
            ? [req.params.id, req.partition]
            : [req.params.id],
        logging: (msg) => {
          queryLogs = msg;
        },
        logQueryParameters: true,
      }
    );
    latency = Date.now() - time;
    let [explainAnalyzeResults, metadata] =
      await req.currentDatabase.sequelize.query(
        dbType === "geo_partitioned"
          ? `EXPLAIN ANALYZE SELECT * from products where id = $1 and geo_partition = $2`
          : `EXPLAIN ANALYZE SELECT * from products where id = $1`,
        {
          bind:
            dbType === "geo_partitioned"
              ? [req.params.id, req.partition]
              : [req.params.id],
          logQueryParameters: true,
        }
      );
    explainAnalyzeResults =
      explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];

    console.log("EXPLAIN ANALYZE results: ", explainAnalyzeResults);
    console.log("EXPLAIN ANALYZE metadata: ", metadata);

    res.json({ queryLogs, explainAnalyzeResults, latency, data: product[0] });
  } catch (e) {
    console.log("error in fetching product", e);
    res.status(400).send({ error: e, data: {} });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    let { showExecutionPlan = "false" } = req.query;
    showExecutionPlan = showExecutionPlan === "true";
    let queryLogs;
    let explainAnalyzeResults = [];
    const dbType = req.databaseType;

    if (dbType === "multi_region_with_read_replicas") {
      await req.currentDatabase.sequelize.query(
        "set session characteristics as transaction read write;"
      );
    }

    const time = Date.now();
    const [data, status] = await req.currentDatabase.sequelize.query(
      dbType === "geo_partitioned"
        ? `INSERT INTO orders (total, products, geo_partition, id) values ($1,$2,$3,$4) returning id`
        : `INSERT INTO orders (total, products) values ($1,$2) returning id`,
      {
        bind:
          dbType === "geo_partitioned"
            ? [
                req.body.total,
                req.body.products.join(","),
                req.partition,
                uuidv4(),
              ]
            : [req.body.total, req.body.products.join(",")],
        logging: (msg) => {
          queryLogs = msg;
        },
        logQueryParameters: true,
      }
    );
    const latency = Date.now() - time;
    if (showExecutionPlan) {
      [explainAnalyzeResults] = await req.currentDatabase.sequelize.query(
        dbType === "geo_partitioned"
          ? `EXPLAIN ANALYZE INSERT INTO orders (total, products, geo_partition, id) values ($1,$2,$3,$4)`
          : `EXPLAIN ANALYZE INSERT INTO orders (total, products) values ($1,$2)`,
        {
          bind:
            dbType === "geo_partitioned"
              ? [
                  req.body.total,
                  req.body.products.join(","),
                  req.partition,
                  uuidv4(),
                ] // uuid will not be the same as the query above
              : [req.body.total, req.body.products.join(",")],
          logQueryParameters: true,
        }
      );

      explainAnalyzeResults =
        explainAnalyzeResults?.map((res) => res["QUERY PLAN"]) || [];
    }

    res
      .status(201)
      .json({ data: data[0], queryLogs, explainAnalyzeResults, latency });
  } catch (e) {
    console.log("error in /api/orders", e);
    res.status(400).send({ error: e, data: {} });
  } finally {
    if (req.databaseType === "multi_region_with_read_replicas") {
      console.log(
        "Finally block: Setting session characteristics as transaction read only after write executed"
      );
      await req.currentDatabase.sequelize.query(
        "set session characteristics as transaction read only;"
      );
    }
  }
});

app.get("/api/databases", (req, res) => {
  try {
    const returnDBs = Object.keys(databases).map((key) => {
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
    const id = req.params.id;
    console.log("id:", id);
    console.log("databases:", databases);
    const database = databases[id];
    const nodes = database.tlr_properties.nodes;

    const nodePreferences = config.get("node_preferences");
    console.log("NODE_APP_INSTANCE for nodes:", NODE_APP_INSTANCE);
    const nodePreferenceIdx = nodePreferences[NODE_APP_INSTANCE][id][0];
    console.log("nodePreference", nodePreferenceIdx);

    res.status(200).json({
      nodes: nodes,
      connection_node_index: nodePreferenceIdx,
    });
  } catch (e) {
    console.log("error in fetching databases", e);
  }
});

app.listen(PORT, () => {
  console.log(`Products Service listening on ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); // mandatory (as per the Node.js docs)
});
