const createSharedTaskConfig = require("../../shared/config/createSharedTaskConfig");
const pathConfig = require("./path-config.json");

const config = createSharedTaskConfig(__dirname, {
  images: true,
  icons: true,
  cloudinary: true,
  fonts: true,
  static: true,
  svgSprite: true,
  javascripts: true,
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
