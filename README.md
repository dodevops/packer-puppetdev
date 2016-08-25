# Local testing of puppet

This repository contains scripts together with basic Packer templates for
generating Vagrant boxes, that can be used for local puppet testing.

## Structure

The building process relies on submodules for the platforms to build. These
submodules contain basic templates for the needed platforms and are charged
with additional custom scripts and variables.

  * scripts/ : custom scripts for each platform
  * vars/ : variable files in JSON format for each platform

## Building

To build the images, you'll need Packer. After installing, run the following
command:

    cd base.<platform> && packer build --var-file <platform><version>.json --var-file ../vars/<platform>.json <platform>.json

For example, to build a debian 8.4 image you would run:

    cd base.debian && packer build --var-file debian84.json --var-file ../vars/debian.json debian.json
