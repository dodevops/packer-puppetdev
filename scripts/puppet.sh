#!/usr/bin/env bash

set -eux

CODENAME=$(lsb_release -cs)

# Install puppet

wget https://apt.puppetlabs.com/puppetlabs-release${PUPPET_RELEASE_SUFFIX}-${CODENAME}.deb -O /tmp/puppetlabs.deb
dpkg -i /tmp/puppetlabs.deb
apt-get update
rm /tmp/puppetlabs.deb

if [ ${PUPPET_VERSION} -eq 3 ]
then
    apt-get -y install puppet
    # Remove deprecated configuration from puppet

    sed -i -re "/^templatedir=/d" /etc/puppet/puppet.conf

elif [ ${PUPPET_VERSION} -eq 4 ]
then
    apt-get -y install puppet-agent
fi
