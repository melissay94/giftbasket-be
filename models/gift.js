'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class gift extends Model {
    static associate(models) {
      gift.belongsToMany(models.user, { through: "usergifts" });
      gift.belongsToMany(models.basket, { through: "giftbaskets" });
    }
  };
  gift.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: "Invalid length. Must be between 1 and 99 characters."
        },
      },
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 250],
          msg: "Invalid length. Must be less than 250 characters."
        }
      }
    },
    link:  {
      type:  DataTypes.STRING,
      validate: {
        isUrl: {
          msg: "Must be url format. Example: https://www.mywebsite.com ."
        }
      }},
    image: DataTypes.STRING,
    isPublic: {
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'gift',
  });
  return gift;
};
