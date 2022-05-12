'use strict';
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://staineds.com:7001' : 'http://localhost:7001';
console.log(baseUrl);
const defaultAvatar = `${baseUrl}/public/image/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png`;
const Controller = require('egg').Controller;

class UserController extends Controller {
  // 判断用户名是否已存在
  async getUserByName() {
    const { ctx } = this;
    const { username } = ctx.request.body;
    if (!username) {
      return;
    }
    const uname = username.replace(/(^\s*)/g, '');
    const userInfo = await ctx.service.user.getUserByName(uname);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 409,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }
    ctx.body = {
      code: 200,
      msg: '可以使用当前账号',
      data: null,
    };
    return null;
  }
  // 注册
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = {
        code: 200,
        msg: '账号密码不能为空',
        data: null,
      };
      return;
    }
    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 409,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }
    const data = {
      username,
      password,
      avatar: defaultAvatar,
      signature: '世界和平。',
      ctime: +new Date(),
    };
    const result = await ctx.service.user.register(data);
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }
  // 登录
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '密码错误',
        data: null,
      };
      return;
    }
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      password: userInfo.password,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 设置token24小时过期
    }, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    };
  }
  async test() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    // 解析出token的值
    const decode = await app.jwt.verify(token, app.config.secret);
    ctx.body = {
      code: 200,
      message: 'success',
      data: {
        ...decode,
      },
    };
  }
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar || defaultAvatar,
      },
    };
  }
  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = '', avatar = '' } = ctx.request.body;
    try {
      // eslint-disable-next-line no-unused-vars
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.secret);
      if (!decode) return;
      // eslint-disable-next-line prefer-const
      user_id = decode.id;
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      await ctx.service.user.editUserInfo({ ...userInfo, signature, avatar });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: user_id,
          signature,
          username: userInfo.username,
          avatar,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
  async editPassword() {
    const { ctx, app } = this;
    const { old_pass, new_pass } = ctx.request.body;
    const token = ctx.request.header.authorization;
    try {
      const decode = await app.jwt.verify(token, app.config.secret);
      if (!decode) return;
      const user_id = decode.id;
      const Info = await ctx.service.user.geyUserInfoByID(user_id);
      console.log(Info);
      if (old_pass !== Info.password) {
        ctx.body = {
          code: 302,
          msg: '密码错误',
          data: null,
        };
        return;
      }
      await ctx.service.user.updatePwd(user_id, new_pass);
      ctx.body = {
        code: 200,
        msg: '成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}
module.exports = UserController;
