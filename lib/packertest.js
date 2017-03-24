/**
 * Test the generated box
 */

var childProcess = require('child_process');

module.exports = function (grunt) {

    grunt.registerMultiTask(
        'packertest',
        'Test a generated box',
        function () {
            var options = this.options({
                boxPath: '',
                installedBoxName: 'test-puppetdev',
                testpath: 'test'
            });

            var done = this.async();

            grunt.log.ok('Preparing test start');

            // Do we need to remove the box?

            var boxes;

            grunt.log.ok('Checking, if old box exists');

            try {

                boxes = childProcess.execSync(
                    'vagrant box list'
                );

            } catch (e) {
                done(
                    new Error(
                        'Can not query vagrant boxes: ' + e.stderr
                    )
                );
                return;
            }

            if (boxes.indexOf(options.installedBoxName) !== -1) {

                grunt.log.ok('Removing old box');

                try {
                    childProcess.execSync(
                        'vagrant box remove -f ' + options.installedBoxName
                    );
                } catch (e) {
                    done(
                        new Error(
                            'Can not remove old box version: ' + e.stderr
                        )
                    );
                    return;
                }

            }

            grunt.log.ok('Adding box');

            // Add box

            try {
                childProcess.execSync(
                    'vagrant box add --name ' + options.installedBoxName +
                    ' ' + options.boxPath
                );
            } catch (e) {
                done(new Error(
                    'Can not add box ' + options.installedBoxName +
                    ' from ' + options.boxPath +
                    ': ' + e.stderr
                ));
                return;
            }

            // Check for orphaned vagrant machine

            grunt.log.ok('Checking, if old vagrant image exists');

            var vagrantStatus;

            try {
                vagrantStatus = childProcess.execSync(
                    'vagrant status',
                    {
                        cwd: options.testpath
                    }
                );
            } catch (e) {
                done(
                    new Error(
                        'Can not query vagrant status: ' + e.stderr
                    )
                );
                return;
            }

            if (vagrantStatus.indexOf('not created') === -1) {

                // Old vagrant machine seems to be running. Destroy it.

                grunt.log.ok('Destroying old vagrant image');

                try {
                    childProcess.execSync(
                        'vagrant destroy -f',
                        {
                            cwd: options.testpath
                        }
                    );
                } catch (e) {
                    done(
                        new Error(
                            'Can not destroy old vagrant machine: ' + e.stderr
                        )
                    );
                    return;
                }

            }

            // Run rake

            grunt.log.ok('Running rake');

            var vagrantProcess = childProcess.exec(
                'rake',
                {
                    cwd: options.testpath
                }
            );

            vagrantProcess.on('close', function (code) {
                if (code !== 0) {
                    done(
                        new Error(
                            'Vagrant process returned unsucessfully'
                        )
                    );
                } else {

                    grunt.log.ok('Cleaning up');

                    grunt.log.ok('Destroying vagrant machine');

                    // Destroy vagrant machine

                    try {
                        childProcess.execSync(
                            'vagrant destroy -f',
                            {
                                cwd: options.testpath
                            }
                        );
                    } catch (e) {
                        done(
                            new Error(
                                'Can not destroy vagrant machine: ' + e.stderr
                            )
                        );
                        return;
                    }

                    // Remove test box

                    grunt.log.ok('Removing test box');

                    try {
                        childProcess.execSync(
                            'vagrant box remove ' + options.installedBoxName
                        );
                    } catch (e) {
                        done(
                            new Error(
                                'Can not remove test box: ' + e.stderr
                            )
                        );
                        return;
                    }

                    done();
                }
            });

            vagrantProcess.stderr.on('data', function (data) {
                grunt.log.error(data);
            });

            vagrantProcess.stdout.on('data', function (data) {
                grunt.log.ok(data);
            });

        }
    );

};
