'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class basket extends Model {
    static associate(models) {
      basket.belongsToMany(models.gift, { through: "giftbaskets" });
      basket.belongsTo(models.user, { foreignKey: "userId" });
    }
  };
  basket.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          message: "Invalid length. Name must be between 1 and 99 characters."
        },
        isAlpha: {
          message: "Names must be alphabetic characters only",
        },
      },
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.STRING,
      validate: {
        isDate: {
          message: "Invalid birthdate. Please make sure format is a valid date."
        },
      },
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'basket',
  });
  return basket;
};
