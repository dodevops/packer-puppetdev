var packerbuild = require('./lib/packerbuild');

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        eslint: {
            gruntfile: ['Gruntfile.js'],
            lib: ['lib/**/*.js'],
            test: ['test/**/*_test.js'],
            options: {
                configFile: '.eslintrc'
            }
        },
        packerbuild: {
            debian: {
                options: {
                    template: 'debian.json',
                    templatePath: 'base.debian',
                    patches: [
                        'patches/common.patch.json'
                    ],
                    only: [
                        'virtualbox-iso'
                    ]
                }
            }
        }
    });

    grunt.loadTasks('./lib');

};
