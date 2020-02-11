"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Candles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.STRING
      },
      period: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DATE
      },
      open: {
        type: Sequelize.FLOAT
      },
      high: {
        type: Sequelize.FLOAT
      },
      low: {
        type: Sequelize.FLOAT
      },
      close: {
        type: Sequelize.FLOAT
      },
      volume: {
        type: Sequelize.FLOAT
      },
      closeTime: {
        type: Sequelize.DATE
      },
      assetVolume: {
        type: Sequelize.FLOAT
      },
      trades: {
        type: Sequelize.INTEGER
      },
      buyBaseVolume: {
        type: Sequelize.FLOAT
      },
      buyAssetVolume: {
        type: Sequelize.FLOAT
      },
      ingored: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Candles");
  }
};
