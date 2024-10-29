from os.path import join, dirname
from vunit import VUnit

ui = VUnit.from_argv()

sourcePath = join(dirname(__file__), "source")

enabler = ui.add_library("EnablerLibrary")
enabler.add_source_files(join(sourcePath, "Enabler", "*.vhd"))

toggler = ui.add_library("TogglerLibrary")
toggler.add_source_files(join(sourcePath, "Toggler", "*.vhd"))



ui.main()
