/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1628064890529_9870';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload',
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ], // 配置白名单
  };

  config.view = {
    mapping: { '.html': 'ejs' }, // 将.html后缀文化，识别为.ejs
  };
  config.mysql = {
    client: {
      host: '1.117.56.86',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'ball-book',
    },
    // 是否加载到app上
    app: true,
    // 默认加载到agent上
    agent: false,
  };
  config.jwt = {
    secret: 'ballBook',
  };
  config.multipart = {
    mode: 'file',
  };
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  return {
    ...config,
    ...userConfig,
  };
};
