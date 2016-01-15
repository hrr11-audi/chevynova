module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: ['client/**/*.js'],
        dest: 'client/dist/app.js'
      }
    },
    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'client/dist/app.min.js': ['client/dist/app.js']
        }
      }
    },
    jshint: {
      files: [
        'index.js',
        'server.js',
        // components folder
        'app/**/*.js',
        // services folder
        'services/**/*.js'
        // client folder
        // 'public/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: false,
        ignores: [
        'client/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files:[{
          src: ['client/style.css','!client/*.min.css'],
          dest: 'client/dist/style.css',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'client/**/*.js'
        ],
        tasks: [
        'concat',
        'uglify'
        ]
      },
      css: {
        files: 'client/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function(target){
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
    });

    grunt.registerTask('build', [
      'concat',
      'uglify',
      'cssmin',
      'jshint'
    ]);

    grunt.registerTask('upload', function(n) {
      if(grunt.option('prod')) {
        grunt.task.run(['shell:prodServer']);
      } else {
        grunt.task.run([ 'server-dev' ]);
      }
    });

    grunt.registerTask('deploy', [
      'build',
      'upload'
    ]);
    grunt.registerTask('default', [
      'deploy'
     ]);
};
