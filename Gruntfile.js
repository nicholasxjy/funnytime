module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: ['public/javascripts/main.js', 'public/javascripts/auth.js', 'public/javascripts/utility.js'],
                dest: 'public/javascripts/dist/custom.js'
            }
        },

        jshint: {
            files: ['public/javascripts/main.js', 'public/javascripts/auth.js', 'public/javascripts/utility.js', 'public/javascripts/dist/custom.js']
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - '
                + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: {
                    'public/javascripts/dist/custom.min.js': ['public/javascripts/dist/custom.js']
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                   'public/stylesheets/dist/custom.css': ['public/stylesheets/common.css','public/stylesheets/follow.css','public/stylesheets/index.css','public/stylesheets/joke-detail.css','public/stylesheets/notification.css','public/stylesheets/settings.css','public/stylesheets/user-index.css']
                }
            },
            add_banner: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - '
                + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'public/stylesheets/dist/custom.css': ['public/stylesheets/dist/custom.css']
                }
            },
            minify: {
                expand: true,
                cwd: 'public/stylesheets/dist/',
                src: ['public/stylesheets/dist/custom.css'],
                dest: 'public/stylesheets/dist/',
                ext: '.min.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'cssmin']);
}