/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('msg_private', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    from_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    to_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'msg_private'
  });
};
