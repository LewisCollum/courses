@echo off
set dependencies= TimingUtil.vhdl common.vhdl SPIAddressCounter.vhdl
set unit_file=SPIMaster.vhdl
set unit_file_test=Test_SPIMaster.vhdl
set unitUnderTest=Test_SPIMaster
set gtkwave_file=wave.ghw
set ghdlRunOptions=--wave=%gtkwave_file% --expect-failure

::set xml_file=xmlTest.xml

echo analyzing dependencies...
ghdl -a %dependencies%

echo analyzing unit...
ghdl -a %unit_file%

echo analyzing test...
ghdl -a %unit_file_test%

echo generating executable for test...
ghdl -e %unitUnderTest%

echo running test...
ghdl -r %unitUnderTest% %ghdlRunOptions%
::ghdl --file-to-xml > xmlTest.xml

echo COMPLETE! Opening waveform...
gtkwave %gtkwave_file%
