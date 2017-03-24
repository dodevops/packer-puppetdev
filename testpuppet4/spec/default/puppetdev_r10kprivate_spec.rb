require_relative '../spec_helper'

describe file('/root/.ssh/r10k.provision') do
  it { should exist }
  it { should be_file }
  it { should contain 'testtesttest' }
  it { should be_mode 600 }
end

describe file('/root/.ssh/config') do
  it { should exist }
  it { should be_file }
  it { should contain 'Host testhost' }
  it { should be_mode 600 }
end

describe file('/root/.ssh') do
  it { should exist }
  it { should be_directory }
  it { should be_mode 700 }
end
