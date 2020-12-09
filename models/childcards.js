"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChildCards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChildCards.belongsToMany(models.ParentCards, {
        as: "parent",
        through: {
          model: "cardRelations",
          as: "data",
        },
      });
    }
  }
  ChildCards.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      thumbnailChildCard: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ChildCards",
    }
  );
  return ChildCards;
};
