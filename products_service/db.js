const { Sequelize } = require("sequelize-yugabytedb");
const fs = require("fs");

async function changeDB(host, username, password, certPath) {
  console.log(`Changing DB HOST TO: ${host}`);
  // console.log(host, username, password, certPath);

  try {
    const cert = fs.readFileSync(certPath).toString();
    const connection = new Sequelize("testing_tlr", username, password, {
      host: host,
      port: "5433",
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
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
    });
    await connection.authenticate();
    console.log("CONNECTION TO DB VERIFIED");
    return connection;
  } catch (e) {
    console.log("DB CONNECTION COULD NOT BE ESTABLISHED", e);
    return Promise.reject(e);
  }
}

module.exports = { changeDB };
