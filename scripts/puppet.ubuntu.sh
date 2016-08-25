#!/usr/bin/env bash

# Install puppet

wget https://apt.puppetlabs.com/puppetlabs-release-trusty.deb -O /tmp/puppetlabs-release-trusty.deb 2>/dev/null
dpkg -i /tmp/puppetlabs-release-trusty.deb
rm /tmp/puppetlabs-release-trusty.deb
apt-get update && apt-get -y install puppet git

# Remove deprecated configuration from puppet

sed -i -re "/^templatedir=/d" /etc/puppet/puppet.conf
