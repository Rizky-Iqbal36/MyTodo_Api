"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ParentCards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ParentCards.belongsToMany(models.ChildCards, {
        as: "child",
        through: {
          model: "cardRelations",
          as: "data",
        },
      });
      ParentCards.belongsToMany(models.Users, {
        as: "users",
        through: {
          model: "cardRelations",
          as: "data",
        },
      });
    }
  }
  ParentCards.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      uploadBy: DataTypes.INTEGER,
      thumbnailParentCard: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ParentCards",
    }
  );
  return ParentCards;
};
