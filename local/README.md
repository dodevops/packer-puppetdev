# Local files

Just put files into the "files" subdirectory. They will be available in
the guest under /tmp/files.

# Local variables

To enable local variables, put a file "vars.json" into the "local"
and the var files into the "vars" folder.

Then, in the vars.json specify which files to use.

    {
        "*": [ "file1, "file2" ] <-- These will be included in all build configurations
        "ubuntu": ["file3"] <-- This will only be included in the ubuntu configuration
    }