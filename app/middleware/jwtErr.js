'use strict';

module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    // eslint-disable-next-line no-unused-vars
    let decode;
    if (token) {
      try {
        decode = ctx.app.jwt.verify(token, secret);
        await next();
      } catch (error) {
        console.log('error', error);
        ctx.status = 200;
        if (error.name === 'TokenExpiredError') {
          ctx.body = {
            msg: '登录已过期， 请重新登录',
            code: 401,
          };
          return;
        } else if (error.name === 'JsonWebTokenError') {
          ctx.body = {
            msg: '无效的token',
            code: 401,
          };
          return;
        }
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在',
      };
      return;
    }
  };
};

