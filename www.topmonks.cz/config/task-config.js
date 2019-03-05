const globImporter = require("node-sass-glob-importer");
const marked = require("marked");
const markdownToJSON = require("gulp-markdown-to-json");
const merge = require("gulp-merge-json");
const path = require("path");
const projectPath = require("@topmonks/blendid/gulpfile.js/lib/projectPath");
const pathConfig = require("./path-config.json");

module.exports = {
  images: true,
  fonts: true,
  static: true,
  svgSprite: true,

  javascripts: {
    entry: {
      app: ["./index.js"]
    }
  },

  stylesheets: {
    sass: {
      importer: globImporter()
    },
    autoprefixer: { browsers: ["> 5%", "last 4 versions", "IE 8"] }
  },

  html: {
    dataFile: "../data/team.json"
  },

  browserSync: {
    server: {
      // should match `dest` in
      // path-config.json
      baseDir: pathConfig.dest
    }
  },

  production: {
    rev: true
  },

  additionalTasks: {
    initialize({ task, src, dest, series, watch }, PATH_CONFIG, TASK_CONFIG) {
      const destPath = projectPath(PATH_CONFIG.src, PATH_CONFIG.data.dest);
      const teamSrc = projectPath(PATH_CONFIG.data.team, "**/*.md");

      const generateTeamDataTask = () =>
        src(teamSrc)
          .pipe(markdownToJSON(marked))
          .pipe(
            merge({
              fileName: "team.json",
              edit: json => ({ members: { [json.id]: json } })
            })
          )
          .pipe(dest(destPath));

      task("team-data", generateTeamDataTask);
      task("team:watch", cb => {
        watch(teamSrc, generateTeamDataTask);
        watch(path.resolve(destPath, "team.json"), series("html"));
        cb();
      });
    },
    development: {
      prebuild: ["team-data"],
      postbuild: ["team:watch"]
    },
    production: {
      prebuild: ["team-data"]
    }
  }
};
