const sampleProducts = require("./sample-data/products.json");
const { Product, ProductRecommendation } = require("./models");
const { sequelize } = require("./db");
async function createTableAndInsert() {
  //creating a table "users"

  //   await Product.sync({ force: true });

  await sequelize.sync({ force: true });

  await Product.bulkCreate(sampleProducts.products, {
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

  await ProductRecommendation.bulkCreate(prodRecs, { ignoreDuplicates: true });

  //   await Promise.all(prodRecsPromises);

  // insert all products from json file
  // for (let i = 0; i < sampleProducts.products.length; i++) {
  //   const p = sampleProducts.products[i];
  //   try {
  //     await Product.create(p);
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

createTableAndInsert().then(function () {
  console.log("Created tables and records");
  //   fetchAllRows();
  process.exit(0);
});
