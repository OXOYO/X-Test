/**
 * Created by OXOYO on 2019/6/5.
 *
 *
 */

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index () {
    this.ctx.body = 'Hello World!'
  }
}

module.exports = HomeController
