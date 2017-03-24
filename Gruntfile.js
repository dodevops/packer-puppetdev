var packerbuild = require('./lib/packerbuild');

module.exports = function (grunt) {

    var commonInfo = grunt.file.readJSON('vars/common.json');

    var gruntConfig = {
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
                        'patches/common.patch.json'
                    ],
                    only: [
                        'virtualbox-iso'
                    ],
                    varFiles: [
                        'ubuntu1404.json',
                        '../vars/common.json',
                        '../vars/ubuntu.json'
                    ],
                    runPacker: true
                }
            },
            ubuntu1604: {
                options: {
                    template: 'ubuntu.json',
                    templatePath: 'base.ubuntu',
                    patches: [
                        'patches/common.patch.json'
                    ],
                    only: [
                        'virtualbox-iso'
                    ],
                    varFiles: [
                        'ubuntu1604.json',
                        '../vars/common.json',
                        '../vars/ubuntu1604.json'
                    ],
                    runPacker: true
                }
            },
            ubuntu1604puppet4: {
                options: {
                    template: 'ubuntu.json',
                    templatePath: 'base.ubuntu',
                    patches: [
                        'patches/common.patch.json'
                    ],
                    only: [
                        'virtualbox-iso'
                    ],
                    varFiles: [
                        'ubuntu1604.json',
                        '../vars/common.json',
                        '../vars/ubuntu1604puppet4.json'
                    ],
                    runPacker: true
                }
            },
            debian: {
                options: {
                    template: 'debian.json',
                    templatePath: 'base.debian',
                    patches: [
                        'patches/common.patch.json'
                    ],
                    only: [
                        'virtualbox-iso'
                    ],
                    varFiles: [
                        'debian85.json',
                        '../vars/common.json',
                        '../vars/debian.json'
                    ],
                    runPacker: true
                }
            }
        },
        packertest: {
            ubuntu: {
                options: {
                    boxPath: 'base.ubuntu/box/virtualbox/' +
                        commonInfo.base_vm_name +
                        '-ubuntu-' +
                        commonInfo.version +
                        '.box'
                }
            },
            ubuntu1604: {
                options: {
                    boxPath: 'base.ubuntu/box/virtualbox/' +
                    commonInfo.base_vm_name +
                    '-ubuntu1604-' +
                    commonInfo.version +
                    '.box'
                }
            },
            ubuntu1604puppet4: {
                options: {
                    boxPath: 'base.ubuntu/box/virtualbox/' +
                    commonInfo.base_vm_name +
                    '-ubuntu1604puppet4-' +
                    commonInfo.version +
                    '.box',
                    testpath: 'testpuppet4'
                }
            },
            debian: {
                options: {
                    boxPath: 'base.debian/box/virtualbox/' +
                    commonInfo.base_vm_name +
                    '-debian-' +
                    commonInfo.version +
                    '.box'
                }
            }
        }
    };

    if (grunt.file.exists('local/vars.json')) {
        var localVars = grunt.file.readJSON('local/vars.json');

        for (var key in localVars) {

            if (localVars.hasOwnProperty(key)) {

                var targets;

                if (key === '*') {
                    targets = Object.keys(gruntConfig.packerbuild);
                } else {
                    targets = [key];
                }

                for (var i = 0; i < targets.length; i++) {
                    var configPart = gruntConfig
                        .packerbuild[targets[i]].options;
                    if (!configPart.hasOwnProperty('varFiles')) {
                        configPart['varFiles'] = [];
                    }

                    for (var a = 0; a < localVars[key].length; a++) {
                        configPart['varFiles'].push(
                            '../local/vars/' + localVars[key][a]
                        );
                    }
                }

            }

        }
    }

    grunt.initConfig(gruntConfig);

    grunt.loadTasks('./lib');

    grunt.registerTask('ubuntu', ['packerbuild:ubuntu', 'packertest:ubuntu']);
    grunt.registerTask(
        'ubuntu1604',
        [
            'packerbuild:ubuntu1604',
            'packertest:ubuntu1604'
        ]
    );
    grunt.registerTask('debian', ['packerbuild:debian', 'packertest:debian']);
    grunt.registerTask(
        'ubuntu1604puppet4',
        [
            'packerbuild:ubuntu1604puppet4',
            'packertest:ubuntu1604puppet4'
        ]
    );

};
