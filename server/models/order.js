"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      symbol: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      type: DataTypes.STRING,
      openPrice: DataTypes.FLOAT,
      openTime: DataTypes.DATE,
      closePrice: DataTypes.FLOAT,
      closeTime: DataTypes.DATE,
      isTesting: DataTypes.BOOLEAN,
      trailingStop: DataTypes.FLOAT,
      stopLoss: DataTypes.FLOAT,
      takeProfit: DataTypes.FLOAT,
      status: DataTypes.STRING
    },
    {}
  );
  Order.associate = function(models) {
    this.hasOne(models.OrderStat, { foreignKey: "orderId" });
    this.belongsTo(models.Test, { foreignKey: "testId" });
    // associations can be defined here
  };
  return Order;
};
