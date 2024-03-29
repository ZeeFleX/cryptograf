"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      summaryProfit: {
        type: Sequelize.FLOAT
      },
      symbol: {
        type: Sequelize.STRING
      },
      params: {
        type: Sequelize.TEXT
      },
      initialBaseBalance: {
        type: Sequelize.FLOAT
      },
      initialPriceBalance: {
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
    return queryInterface.dropTable("Tests");
  }
};
