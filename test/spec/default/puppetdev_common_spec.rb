require_relative '../spec_helper'

describe file('/tmp/test') do
  it { should exist }
  it { should be_file }
end

describe file('/etc/puppet/environments/localdev/modules/stdlib') do
  it { should exist }
  it { should be_directory }
end

describe command('puppet --version') do
  its(:exit_status) { should eq 0 }
end