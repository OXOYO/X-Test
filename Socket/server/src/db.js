/**
 * Created by OXOYO on 2017/10/23.
 */

import Sequelize from 'sequelize'
import { db as dbConfig } from './config'

// 环境
let env = process.env.NODE_ENV === 'development' ? 'development' : 'production'

const db = new Sequelize(
  dbConfig[env].database,
  dbConfig[env].username,
  dbConfig[env].password,
  {
    host: dbConfig[env].host,
    port: dbConfig[env].port,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8'
    },
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    },
    define: {
      timestamps: false
    }
  }
)

export default db
