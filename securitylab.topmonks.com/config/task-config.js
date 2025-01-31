const createSharedTaskConfig = require("../../shared/config/createSharedTaskConfig");
const pathConfig = require("./path-config.json");

const config = createSharedTaskConfig(__dirname, {
  javascripts: false,
  images: true,
  cloudinary: true,
  fonts: true,
  static: true,
  svgSprite: true,
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
