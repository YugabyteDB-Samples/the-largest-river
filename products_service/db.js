const { Sequelize } = require("sequelize-yugabytedb");
const fs = require("fs");

async function addDatabaseConnection({
  url,
  username,
  password,
  certPath,
  port,
  type,
}) {
  console.log(`Changing DB HOST TO: ${url}`);
  // console.log(url, username, password, certPath);

  try {
    let config;
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);

    let cert;
    if (process.env.NODE_ENV != "gitpod")
      cert = fs.readFileSync(certPath).toString();

    if (process.env.NODE_ENV === "development") {
      config = {
        host: "host.docker.internal", // host.docker.internal allows docker container to access the IP of the host machine
        port: port,
        dialect: "postgres",
        // dialectOptions: {
        //   ssl: {
        //     require: true,
        //     rejectUnauthorized: false, // Error if set to true - reason: ConnectionError [SequelizeConnectionError]: Hostname/IP does not match certificate's altnames: Host: host.docker.internal. is not in the cert's altnames
        //     ca: cert,
        //   },
        // },
        pool: {
          max: 5,
          min: 1, // Set to one to keep a connection open
          acquire: 30000,
          idle: 10000,
        },
        hooks: {
          async afterConnect(connection) {
            if (type === "multi_region_with_read_replicas") {
              console.log("afterConnect hook called!");
              await connection.query("set yb_read_from_followers = true;");
              await connection.query(
                "set session characteristics as transaction read only;"
              );

              console.log("Setting session variables for follower reads");
            }
          },
        },
        // logging: (msg) => logger(msg),
      };
    } else if (process.env.NODE_ENV === "production") {
      config = {
        host: url,
        port: "5433",
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
            ca: cert,
          },
        },
        pool: {
          max: 5,
          min: 1, // Set to one to keep a connection open
          acquire: 30000,
          idle: 10000,
        },
        hooks: {
          async afterConnect(connection) {
            if (type === "multi_region_with_read_replicas") {
              console.log("afterConnect hook called!");
              await connection.query("set yb_read_from_followers = true;");
              await connection.query(
                "set session characteristics as transaction read only;"
              );

              console.log("Setting session variables for follower reads");
            }
          },
        },
      };
    } else if (process.env.NODE_ENV === "seed") {
      config = {
        host: url || "localhost",
        port: port,
        dialect: "postgres",
        // dialectOptions: {
        //   ssl: {
        //     require: false,
        //     rejectUnauthorized: false,
        //     ca: cert,
        //   },
        // },
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      };
    } else if (process.env.NODE_ENV === "gitpod") {
      config = {
        host: "localhost",
        port: 5433,
        dialect: "postgres",
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      };
    }
    const connection = new Sequelize(
      process.env.DATABASE_NAME || "yugabyte",
      username || "yugabyte",
      password || "yugabyte",
      config
    );
    await connection.authenticate();
    console.log("CONNECTION TO DB VERIFIED");
    return connection;
  } catch (e) {
    console.log("DB CONNECTION COULD NOT BE ESTABLISHED", e);
    return Promise.reject(e);
  }
}

module.exports = { addDatabaseConnection };
