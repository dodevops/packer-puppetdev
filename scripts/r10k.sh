#!/usr/bin/env bash

# Install and configure r10k

if [ ${FEATURE_R10K} == "true" ]
then

    # Install r10k

    gem install r10k

    cd ${PUPPET_CONFDIR}

    mkdir r10k

    cat > r10k/r10k.yaml <<EOL
sources:
    mysource:
        basedir: ${PUPPET_ENVDIR}
EOL

    if [ ${FEATURE_R10K_CUSTOM} == "true" ]
    then

        if [ ! -e /tmp/files/r10k.provision ]
        then
            echo "r10k.provision SSH private key file not found."
            exit 1
        fi

        # Setting up connection to custom r10k module repository server

        mv /tmp/files/r10k.provision ~/.ssh

        # We're just disabling ssh host key checking here to avoid errors
        # with r10k

        cat >> ~/.ssh/config <<EOL
Host ${R10K_CUSTOM_HOST}
    IdentityFile ~/.ssh/r10k.provision
    UserKnownHostsFile /dev/null
    StrictHostKeyChecking no
EOL

    fi

fi
