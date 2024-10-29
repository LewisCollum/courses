from os.path import join, dirname
from vunit import VUnit

project = VUnit.from_argv()
library = project.add_library("lib")
library.add_source_files("*.vhd")
project.main()
