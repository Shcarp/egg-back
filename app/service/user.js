'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async register(params) {
    const { app } = this;
    try {
      const res = app.mysql.insert('user', params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editUserInfo(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('user', {
        ...params,
      }, {
        id: params.id,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async geyUserInfoByID(id) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updatePwd(user_id, pwd) {
    const { app } = this;
    try {
      const sql = `UPDATE user SET password=${pwd} WHERE id=${user_id}`;
      const result = await app.mysql.query(sql);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
