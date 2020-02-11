"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT
      },
      type: {
        type: Sequelize.STRING
      },
      openPrice: {
        type: Sequelize.FLOAT
      },
      openTime: {
        type: Sequelize.DATE
      },
      closePrice: {
        type: Sequelize.FLOAT
      },
      closeTime: {
        type: Sequelize.DATE
      },
      profit: {
        type: Sequelize.FLOAT
      },
      isTesting: {
        type: Sequelize.BOOLEAN
      },
      testId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      trailingStop: {
        type: Sequelize.FLOAT
      },
      stopLoss: {
        type: Sequelize.FLOAT
      },
      takeProfit: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Orders");
  }
};
