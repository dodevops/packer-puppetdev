$execs = hiera_hash('execs', { })

if ($execs) {
  create_resources('exec', $execs)
}