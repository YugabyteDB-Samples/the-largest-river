// Creating database if it doesn't exist
require("dotenv").config();
// const Client = require("pg").Client;
// const fs = require("fs");
// const config = {
//   database: "yugabyte",
//   host: process.env.DATABASE_HOST_2,
//   user: process.env.DATABASE_USERNAME_2,
//   password: process.env.DATABASE_PASSWORD_2,
//   port: 5433,
//   // this object will be passed to the TLSSocket constructor
//   ssl: {
//     rejectUnauthorized: false,
//     ca: fs.readFileSync(process.env.DATABASE_SEED_CERT_PATH_2).toString(),
//   },
// };
// const client = new Client(config);
// client.connect(async (err) => {
//   if (err) {
//     console.error("error connecting", err.stack);
//   } else {
//     console.log("connected");
//     client.query(
//       `CREATE DATABASE "${process.env.DATABASE_NAME}"`,
//       (err, res) => {
//         console.log(err, res);
//         client.end();
//       }
//     );
//   }
// });

const sampleProducts = require("./sample-data/products.json");
const { Product, ProductRecommendation } = require("./models");
let { changeDB } = require("./db.js");
let models, setModels, sequelize;
changeDB(
  process.env.DATABASE_HOST_2,
  process.env.DATABASE_USERNAME_2,
  process.env.DATABASE_PASSWORD_2,
  process.env.DATABASE_SEED_CERT_PATH_2
)
  .then((sequelizeInstance) => {
    require("./models.js").setModels(sequelizeInstance);
    models = require("./models").models;
    // console.log("this is the sequelize instance", sequelizeInstance);
    sequelize = sequelizeInstance;
  })
  .then(() => {
    createTableAndInsert().then(function () {
      console.log("Created tables and records");
      //   fetchAllRows();
      process.exit(0);
    });
  });
async function createTableAndInsert() {
  //creating a table "users"

  //   await models.Product.sync({ force: true });

  await sequelize.sync({ force: true });

  await models.Product.bulkCreate(sampleProducts.products, {
    ignoreDuplicates: true,
  });

  // await ProductRecommendation.sync({ force: true });

  const prodRecs = [];
  const productsSet = new Set(sampleProducts.products.map((prod) => prod.id));
  for (let j = 0; j < sampleProducts.products.length; j++) {
    const prod = sampleProducts.products[j];
    if (prod?.related?.also_bought) {
      for (let i = 0; i < prod.related.also_bought.length; i++) {
        const alsoBoughtId = prod.related.also_bought[i];

        if (productsSet.has(alsoBoughtId)) {
          prodRecs.push({
            productId: prod.id,
            recommendationId: alsoBoughtId,
          });
        }
        // await ProductRecommendation.create({
        //   product_id: prod.id,
        //   recommended_product_id: alsoBoughtId,
        // });
      }
    }
  }

  await models.ProductRecommendation.bulkCreate(prodRecs, {
    ignoreDuplicates: true,
  });

  //   await Promise.all(prodRecsPromises);

  // insert all products from json file
  // for (let i = 0; i < sampleProducts.products.length; i++) {
  //   const p = sampleProducts.products[i];
  //   try {
  //     await models.Product.create(p);
  //   } catch (e) {
  //     console.error("ERROR IN CREATING PRODUCT: ", e);
  //   }
  // }

  //Insert 3 rows into the users table
  //   await User.create({ user_id: 1, username: "sam", country: "India" });
  //   await User.create({ user_id: 2, username: "bob", country: "USA" });
  //   await User.create({ user_id: 3, username: "jake", country: "Canada" });
}

// async function fetchAllRows() {
//   //fetching all the rows
//   const users = await User.findAll({ raw: true });
//   // console.log(users);
// }
