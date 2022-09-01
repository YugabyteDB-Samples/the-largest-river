const { DataTypes } = require("sequelize-yugabytedb");
//Defining a model 'user'

function setModels(sequelize) {
  if (!sequelize) return null;
  sequelize.models = {};
  // sequelize.models.User = sequelize.define("user", {
  //   user_id: {
  //     type: DataTypes.INTEGER,
  //     primaryKey: true,
  //   },
  //   username: {
  //     type: DataTypes.STRING,
  //   },
  //   country: {
  //     type: DataTypes.STRING,
  //   },
  // });
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
  sequelize.models.Product = sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      language: {
        type: DataTypes.STRING,
      },
      author: {
        type: DataTypes.STRING,
      },
      imageLink: {
        type: DataTypes.STRING,
      },
      pages: {
        type: DataTypes.INTEGER,
      },
      year: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: false,
    }
  );

  // "author": "Dante Alighieri",
  // "country": "Italy",
  // "imageLink": "images/the-divine-comedy.jpg",
  // "language": "Italian",
  // "link": "https://en.wikipedia.org/wiki/Divine_Comedy\n",
  // "pages": 928,
  // "title": "The Divine Comedy",
  // "year": 1315

  // sequelize.models.ProductRecommendation = sequelize.define("product_recommendation", {});

  // sequelize.models.Product.belongsToMany(sequelize.models.Product, {
  //   through: "product_recommendation",
  //   as: "recommendations",
  // });

  sequelize.models.Order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      total: {
        type: DataTypes.FLOAT,
      },
      products: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return sequelize.models;
}

module.exports = { setModels };
