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
            ubuntu: {
                options: {
                    template: 'ubuntu.json',
                    templatePath: 'base.ubuntu',
                    patches: [
                        'patches/common.patch.json',
                        'patches/ubuntu.patch.json'
                    ],
                    only: [
                        'virtualbox-iso'
                    ],
                    runPacker: false
                }
            }
        }
    });

    grunt.loadTasks('./lib');

};
