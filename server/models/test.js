"use strict";
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    "Test",
    {
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      summaryProfit: DataTypes.FLOAT,
      symbol: DataTypes.STRING,
      params: {
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue("params")
            ? JSON.parse(this.getDataValue("params"))
            : [];
        },
        set(params) {
          this.setDataValue("params", JSON.stringify(params));
        }
      },
      initialBaseBalance: DataTypes.FLOAT,
      initialPriceBalance: DataTypes.FLOAT
    },
    {}
  );
  Test.associate = function(models) {
    this.hasMany(models.Order, {
      foreignKey: "testId"
    });
    this.hasMany(models.TestStat, {
      foreignKey: "testId"
    });
    // associations can be defined here
  };
  return Test;
};
