"use strict";
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    "Test",
    {
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      summaryProfit: DataTypes.FLOAT,
      params: DataTypes.TEXT
    },
    {}
  );
  Test.associate = function(models) {
    this.hasMany(models.Order, { foreignKey: "testId" });
    // associations can be defined here
  };
  return Test;
};
