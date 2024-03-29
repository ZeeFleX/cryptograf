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
      profit: DataTypes.FLOAT,
      isTesting: DataTypes.BOOLEAN,
      trailingStop: DataTypes.FLOAT,
      stopLoss: DataTypes.FLOAT,
      takeProfit: DataTypes.FLOAT,
      status: DataTypes.STRING,
      baseFee: DataTypes.FLOAT,
      priceFee: DataTypes.FLOAT
    },
    {}
  );
  Order.associate = function(models) {
    this.hasOne(models.OrderStat, { foreignKey: "orderId" });
    this.belongsTo(models.Test, { foreignKey: "testId" });
  };
  return Order;
};
