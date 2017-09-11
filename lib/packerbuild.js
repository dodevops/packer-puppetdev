/**
 * Modify and build Packer templates
 */

var fs = require('fs'),
    path = require('path'),
    jsonpatch = require('jsonpatch'),
    childProcess = require('child_process');

module.exports = function (grunt) {

    grunt.registerMultiTask(
        'packerbuild',
        'Modify and build Packer templates',
        function () {
            var options = this.options({
                templatePath: '',
                template: '',
                patches: [],
                varFiles: [],
                only: [],
                packerCommand: 'packer',
                runPacker: true
            });

            var done = this.async();

            if (options.template === '') {
                done(
                    new Error('No template specified.')
                );
            }

            var templateFile = path.join(
                options.templatePath,
                options.template
            );

            try {
                fs.accessSync(templateFile, fs.R_OK);
            } catch (error) {
                done(
                    new Error(
                        'Error accessing template: ' + error
                    )
                );
            }

            var templateContent = fs.readFileSync(templateFile);

            var templateObject;

            try {
                templateObject = JSON.parse(templateContent);
            } catch (error) {
                done(
                    new Error(
                        'Error parsing template: ' + error
                    )
                );
            }

            options.patches.forEach(function (patch) {
                try {
                    fs.accessSync(patch);
                } catch (error) {
                    done(
                        new Error(
                            'Error accessing patch file: ' + error
                        )
                    );
                }

                var patchContent = fs.readFileSync(patch);

                var patchObject;

                try {
                    patchObject = JSON.parse(patchContent);
                } catch (error) {
                    done(
                        new Error(
                            'Error parsing patch file: ' + error
                        )
                    );
                }

                try {

                    templateObject = jsonpatch.apply_patch(
                        templateObject,
                        patchObject
                    );

                } catch (e) {
                    done(
                        new Error(
                            'Error applying patch ' + patch + ': ' + e
                        )
                    );
                }

            });

            fs.writeFileSync(
                templateFile + '.processed',
                JSON.stringify(templateObject, null, 4)
            );

            // Run packer

            if (options.runPacker) {

                var command = options.packerCommand + ' build -on-error=abort ';

                var varFilesCommand = [];

                options.varFiles.forEach(function (varFile) {
                    varFilesCommand.push('--var-file ' + varFile);
                });

                command = command + varFilesCommand.join(' ') + ' ';

                if (options.only.length > 0) {
                    command = command + '--only ' + options.only.join(',');
                }

                command = command + ' ' + options.template + '.processed';

                var packer = childProcess.exec(
                    command,
                    {
                        cwd: options.templatePath
                    }
                );

                packer.on('close', function (code) {
                    if (code !== 0) {
                        done(
                            new Error(
                                'Packer build did not succeed with' +
                                ' command ' + command
                            )
                        );

                    } else {
                        fs.unlinkSync(
                            templateFile + '.processed'
                        );
                        done();
                    }
                });

                packer.stderr.on('data', function (data) {
                    grunt.log.error(data);
                });

                packer.stdout.on('data', function (data) {
                    grunt.log.ok(data);
                });

            }
        }
    );

};

