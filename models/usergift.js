'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usergift extends Model {
    static associate(models) {}
  };
  usergift.init({
    giftId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usergift',
  });
  return usergift;
};
