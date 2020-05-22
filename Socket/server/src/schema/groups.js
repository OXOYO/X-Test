/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groups', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    room_id: {
      type: DataTypes.CHAR(100),
      allowNull: false,
      defaultValue: ''
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    create_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'groups'
  });
};
