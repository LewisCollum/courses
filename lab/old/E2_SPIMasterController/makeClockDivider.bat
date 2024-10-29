@echo off
set dependencies=
set unit_file=ClockDivider.vhdl
set unit_file_test=Test_ClockDivider.vhdl
set unitUnderTest=Test_ClockDivider
set vcd_wave=output_wave.vcd

echo compilling dependencies...
ghdl -a %dependencies%

echo compilling unit...
ghdl -a %unit_file%

echo compilling test...
ghdl -a %unit_file_test%

echo generating executable for test...
ghdl -e %unitUnderTest%

ghdl -r %unitUnderTest% --vcd=%vcd_wave%
gtkwave %vcd_wave%
