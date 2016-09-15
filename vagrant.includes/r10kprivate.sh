#!/usr/bin/env bash

# Checks, if the vagrant directory includes an "r10k.provision" file and
# enable the r10k private feature if such. Additionally, a file called
# r10k.host must exist and hold the hostname of the private git host.

if [ -r /vagrant/r10k.provision -a -r /vagrant/r10k.host ]
then

    R10K_CUSTOM_HOST=`cat /vagrant/r10k.host`

    if [ ! -x /root/.ssh ]
    then
        mkdir /root/.ssh
        chmod 0700 /root/.ssh
    fi

    # Setting up connection to custom r10k module repository server

    cp /vagrant/r10k.provision /root/.ssh
    chmod 0600 /root/.ssh/r10k.provision

    # We're just disabling ssh host key checking here to avoid errors
    # with r10k

    grep ${R10K_CUSTOM_HOST} /root/.ssh/config &>/dev/null

    if [ $? -ne 0 ]
    then

        cat >> /root/.ssh/config <<EOL
Host ${R10K_CUSTOM_HOST}
    IdentityFile ~/.ssh/r10k.provision
    UserKnownHostsFile /dev/null
    StrictHostKeyChecking no
EOL

    fi

    chmod 0600 /root/.ssh/config

fi