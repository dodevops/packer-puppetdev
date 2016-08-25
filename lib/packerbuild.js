/**
 * Modify and build Packer templates
 */

var fs = require('fs'),
    path = require('path'),
    jsonpatch = require('jsonpatch'),
    childProcess = require('child_process');

module.exports = function packerbuild(grunt) {

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

            if (options.template === '') {
                grunt.warn('No template specified.');
                grunt.log.warn('No template specified. Continuing as --force' +
                    ' is specified.');
                return false;
            }

            var templateFile = path.join(
                options.templatePath,
                options.template
            );

            try {
                fs.accessSync(templateFile, fs.R_OK);
            } catch (error) {
                grunt.warn('Error accessing template: ' + error);
                grunt.log.warn(
                    'Error accessing template: '
                    + error
                    + '. Continuing as --force is specified'
                );
                return false;
            }

            var templateContent = fs.readFileSync(templateFile);

            var templateObject;

            try {
                templateObject = JSON.parse(templateContent);
            } catch (error) {
                grunt.warn('Error parsing template: ' + error);
                grunt.log.warn(
                    'Error parsing template: '
                    + error
                    + '. Continuing as --force is specified.'
                );
                return false;
            }

            options.patches.forEach(function (patch) {
                try {
                    fs.accessSync(patch);
                } catch (error) {
                    grunt.warn('Error accessing patch file: ' + error);
                    grunt.log.warn(
                        'Error accessing patch file: '
                        + error
                        + '. Continuing as --force is specified'
                    );
                    return false;
                }

                var patchContent = fs.readFileSync(patch);

                var patchObject;

                try {
                    patchObject = JSON.parse(patchContent);
                } catch (error) {
                    grunt.warn('Error parsing patch file: ' + error);
                    grunt.log.warn(
                        'Error parsing patch file: '
                        + error
                        + '. Continuing as --force is specified.'
                    );
                    return false;
                }

                templateObject = jsonpatch.apply_patch(
                    templateObject,
                    patchObject
                );

            });

            fs.writeFileSync(
                templateFile + '.processed',
                JSON.stringify(templateObject, null, 4)
            );

            // Run packer

            if (options.runPacker) {

                var command = options.packerCommand + ' build ';

                var varFilesCommand = [];

                options.varFiles.forEach(function (varFile) {
                    varFilesCommand.push('--var-file ' + varFile);
                });

                command = command + varFilesCommand.join(' ');

                if (options.only.length > 0) {
                    command = command + '--only ' + options.only.join(',');
                }

                command = command + ' ' + options.template + '.processed';

                try {

                    childProcess.execSync(
                        command,
                        {
                            cwd: options.templatePath
                        }
                    );

                } catch (error) {

                    var errMessage = 'Packer build did not suceed: '
                        + 'Command: ' + command
                        + 'Stdout: ' + error.stdout
                        + 'Stderr: ' + error.stderr;

                    grunt.warn(
                        errMessage
                    );

                    grunt.log.warn(
                        errMessage
                        + '. Continuing as --force is specified.'
                    );
                    return false;

                }

                fs.unlinkSync(
                    templateFile + '.processed'
                );

            }
        }
    );

};

