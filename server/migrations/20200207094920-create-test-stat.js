"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("TestStats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      testId: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.DATE
      },
      balance: {
        type: Sequelize.FLOAT
      },
      baseBalance: {
        type: Sequelize.FLOAT
      },
      priceBalance: {
        type: Sequelize.FLOAT
      },
      orderId: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable("TestStats");
  }
};
