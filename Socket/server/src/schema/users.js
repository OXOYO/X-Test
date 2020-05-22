/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    socket_id: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
};
