"use strict";
module.exports = (sequelize, DataTypes) => {
  const Candle = sequelize.define(
    "Candle",
    {
      symbol: DataTypes.STRING,
      time: DataTypes.DATE,
      open: DataTypes.FLOAT,
      high: DataTypes.FLOAT,
      low: DataTypes.FLOAT,
      close: DataTypes.FLOAT,
      volume: DataTypes.FLOAT,
      closeTime: DataTypes.DATE,
      assetVolume: DataTypes.FLOAT,
      trades: DataTypes.INTEGER,
      buyBaseVolume: DataTypes.FLOAT,
      buyAssetVolume: DataTypes.FLOAT,
      ingored: DataTypes.STRING
    },
    {
      timestamps: false
    }
  );
  Candle.associate = function(models) {
    // associations can be defined here
  };
  return Candle;
};
