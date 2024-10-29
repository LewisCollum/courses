from os.path import join, dirname
from vunit import VUnit

ui = VUnit.from_argv()
ui.add_osvvm()
ui.add_verification_components()

sourcePath = join(dirname(__file__), "source")

library = {
    "Enabler": ui.add_library("Enabler")
}



library["Enabler"].add_source_files(join(sourcePath, "Enabler", ".vhd"))

#for name in library:
#    library[name].add_source_files(join(sourcePath, name, ".vhd"))

uart_lib = ui.add_library("uart_lib")
uart_lib.add_source_files(join(sourcePath, "*.vhd"))

tb_uart_lib = ui.add_library("tb_uart_lib")
tb_uart_lib.add_source_files(join(sourcePath, "test", "*.vhd"))

ui.main()
