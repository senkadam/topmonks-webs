const createSharedTaskConfig = require("../../shared/config/createSharedTaskConfig");
const pathConfig = require("./path-config.json");

const config = createSharedTaskConfig(__dirname, {
  images: true,
  cloudinary: false,
  javascripts: false,
  fonts: true,
  static: true,
  svgSprite: false,
  stylesheets: true,
  workboxBuild: false,

  html: {
    collections: []
  },

  browserSync: {
    server: {
      baseDir: pathConfig.dest
    }
  },

  production: {
    rev: true
  }
});

module.exports = config;
