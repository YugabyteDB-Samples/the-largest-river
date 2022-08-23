const { Sequelize } = require("sequelize-yugabytedb");
const fs = require("fs");

async function addDatabaseConnection(url, username, password, certPath, index) {
  console.log(`Changing DB HOST TO: ${url}`);
  console.log(url, username, password, certPath);

  try {
    const cert = fs.readFileSync(certPath).toString();

    let config;
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);

    if (process.env.NODE_ENV === "development") {
      config = {
        host: "host.docker.internal", // host.docker.internal allows docker container to access the IP of the host machine
        port: `${5000 + (index || 0)}`,
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Error if set to true - reason: ConnectionError [SequelizeConnectionError]: Hostname/IP does not match certificate's altnames: Host: host.docker.internal. is not in the cert's altnames
            ca: cert,
          },
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
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
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        // logging: (msg) => logger(msg),
      };
    } else if (process.env.NODE_ENV === "seed") {
      config = {
        host: "localhost",
        port: `${5000 + (index || 0)}`,
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
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        // logging: (msg) => logger(msg),
      };
    }
    // console.log("DB Config", config);
    const connection = new Sequelize("testing_tlr", username, password, config);
    await connection.authenticate();
    console.log("CONNECTION TO DB VERIFIED");
    return connection;
  } catch (e) {
    console.log("DB CONNECTION COULD NOT BE ESTABLISHED", e);
    return Promise.reject(e);
  }
}

module.exports = { addDatabaseConnection };
