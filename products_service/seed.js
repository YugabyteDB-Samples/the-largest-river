const config = require("config");
const sampleProducts = require("./sample-data/books.json");
// const { Product, ProductRecommendation } = require("./models");
let { addDatabaseConnection } = require("./db.js");
let models, setModels, sequelize;
const databases = config.get("Databases");
const index = 0;
const { username, password, seed_cert_path, type } = databases[index];
const url = "host.docker.internal";
const localPort = 5433;
addDatabaseConnection({
  url,
  username,
  password,
  // certPath: seed_cert_path,
  port: localPort,
  type,
})
  .then((sequelizeInstance) => {
    require("./models.js").setModels(sequelizeInstance);
    sequelize = sequelizeInstance;
  })
  .then(() => {
    createTableAndInsert().then(function () {
      console.log("Created tables and records");
      process.exit(0);
    });
  });
async function createTableAndInsert() {
  await sequelize.sync({ force: true });

  await sequelize.models.Product.bulkCreate(sampleProducts.products, {
    ignoreDuplicates: true,
  });
}
