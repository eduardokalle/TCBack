'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('entrada', 'palabras_clave', {
          type: Sequelize.JSON
        }, { transaction: t }),
        queryInterface.addColumn('banner', 'palabras_clave', {
          type: Sequelize.JSON
        }, { transaction: t }),
        queryInterface.update(Sequelize, 'entrada', { palabras_clave: "[]" }, { palabras_clave: null }, { transaction: t }),
        queryInterface.update(Sequelize, 'banner', { palabras_clave: "[]" }, { palabras_clave: null }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('entrada', 'palabras_clave', { transaction: t })
      ]);
    });
  }
};
