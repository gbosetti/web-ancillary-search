module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-watch");

  const releaseRoot = "./build";

  grunt.initConfig({
    clean: {
      build: ["build"],
      webextension: ["build/web-ancillary-search"],
      release: {
        src: [releaseRoot],
        options: {
          force: true
        }
      }
    },
    watch: {
      files: ["Gruntfile.js", "src/background/**/*.js"],
      tasks: "watchTask"
    },
    compress: {
      webextension: {
        options: {
          archive: "build/web-ancillary-search.zip"
        },
        files: [{
          expand: true,
          cwd: "build/web-ancillary-search",
          src: ["src/*"],
          dest: "build"
        }]
      }
    }
  });

  grunt.registerTask("watchTask", function() {
    grunt.task.run("build");
  });

  grunt.registerTask("build:webextension", function() {
    grunt.file.recurse("src", function(abspath, rootdir, subdir, filename) {
      subdir = subdir ? subdir + "/" : "";
      grunt.file.copy(abspath, "build/web-ancillary-search/" + subdir + filename);
    });
    grunt.task.run("compress:webextension");
  });

  grunt.registerTask("build", ["clean", "build:webextension"]);

  grunt.registerTask("publish", ["clean:release", "build", "copy:release"]);

  grunt.registerTask("default", ["build"]);
};
