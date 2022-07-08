const { DataTypes } = require("sequelize-yugabytedb");
//Defining a model 'user'

const models = { User: null, Product: null, ProductRecommendation: null };
// let User, Product, ProductRecommendation;

function setModels(sequelize) {
  models.User = sequelize.define("user", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
  });
  // {
  //   id: "0006923992",
  //   description:
  //     "Great granddaughter to Charles Dickens, Monica (1915-1992) was born into an upper middle class family. Disillusioned with the world in which she was brought up, she acted out - she was expelled from St Paul's Girls' School in London for throwing her school uniform over Hammersmith Bridge. Dickens then decided to go into service, despite coming from the privileged class; her experiences as a cook and general servant would form the nucleus of her first book, One Pair Of Hands, published in 1939. Dickens married an American Navy officer, Roy O. Stratton, and spent much of her adult life in Massachusetts and Washington D.C., but she continued to set the majority of her writing in Britain. No More Meadows, which she published in 1953, reflected her work with the NSPCC  - she later helped to found the American Samaritans in Massachusetts. Between 1970 and 1971 she wrote a series of children's books known as The Worlds End Series which dealt with rescuing animals and, to some extent, children. After the death of her husband in 1985, Dickens returned to England where she continued to write until her death aged 77.",
  //   title: "The Messenger (Armada)",
  //   price: 7.19,
  //   imUrl: "http://ecx.images-amazon.com/images/I/51-64G57Q4L.jpg",
  //   salesRank: { Books: 5162854 },
  //   categories: [["Books"]],
  // };
  //Defining a model 'user'
  models.Product = sequelize.define("product", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    imUrl: {
      type: DataTypes.STRING,
    },
  });

  models.ProductRecommendation = sequelize.define("product_recommendation", {});

  models.Product.belongsToMany(models.Product, {
    through: "product_recommendation",
    as: "recommendations",
  });

  return models;
}

module.exports = { models, setModels };
