"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn("Orders", "baseFee", Sequelize.FLOAT),
      queryInterface.addColumn("Orders", "priceFee", Sequelize.FLOAT)
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn("Orders", "baseFee"),
      queryInterface.removeColumn("Orders", "priceFee")
    ]);
  }
};
