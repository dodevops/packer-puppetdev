require 'serverspec'
require 'net/ssh'

set :disable_sudo, false
set :env, :LANG => 'C', :LC_MESSAGES => 'C'
set :path, '/sbin:/usr/local/sbin:$PATH'