"use strict";
module.exports = (sequelize, DataTypes) => {
  const TestStat = sequelize.define(
    "TestStat",
    {
      testId: DataTypes.INTEGER,
      time: DataTypes.DATE,
      baseBalance: DataTypes.FLOAT,
      priceBalance: DataTypes.FLOAT,
      balance: DataTypes.FLOAT,
      orderId: DataTypes.INTEGER
    },
    {}
  );
  TestStat.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.Test, { foreignKey: "testId" });
  };
  return TestStat;
};
