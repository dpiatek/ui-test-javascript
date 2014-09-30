module.exports = function(grunt) {

  "use strict";

  var SOURCE_FILES = "src/*.js",
      SPEC_FILES = "test/*.js";

  grunt.initConfig({

    watch: {
      dev: {
        files: [SOURCE_FILES, SPEC_FILES],
        tasks: ["default"]
      }
    },

    jasmine: {
      src: [],
      options: {
        specs: "tmp/" + SPEC_FILES
      }
    },

    browserify: {
      source: {
        src: [ "src/app.js" ],
        dest: "dist/app.js"
      },
      test: {
        files: [{
          expand: true,
          cwd: "./",
          src: ["test/*"],
          dest: "tmp",
          ext: ".js"
        }]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-browserify");

  grunt.registerTask("default", ["browserify:test", "jasmine", "browserify:source"]);

};
