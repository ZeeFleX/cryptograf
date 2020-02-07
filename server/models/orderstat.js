"use strict";
module.exports = (sequelize, DataTypes) => {
  const OrderStat = sequelize.define(
    "OrderStat",
    {
      orderId: DataTypes.INTEGER,
      time: DataTypes.DATE,
      price: DataTypes.FLOAT,
      priceChange: DataTypes.FLOAT,
      profitChange: DataTypes.FLOAT
    },
    {}
  );
  OrderStat.associate = function(models) {
    this.belongsTo(models.Order, { foreignKey: "orderId" });
    // associations can be defined here
  };
  return OrderStat;
};
