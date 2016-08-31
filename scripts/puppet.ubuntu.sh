#!/usr/bin/env bash

set -eux

CODENAME=$(lsb_release -cs)

# Install puppet

wget https://apt.puppetlabs.com/puppetlabs-release-${CODENAME}.deb -O /tmp/puppetlabs.deb
dpkg -i /tmp/puppetlabs.deb
apt-get update
rm /tmp/puppetlabs.deb

apt-get -y install puppet

# Remove deprecated configuration from puppet

sed -i -re "/^templatedir=/d" /etc/puppet/puppet.conf
