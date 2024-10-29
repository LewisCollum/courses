@echo off
set dependencies=TimingUtil.vhdl
set unit_file=SPI_master.vhdl
set unit_file_test=Test_SPI_master.vhdl
set unitUnderTest=Test_SPI_master
set gtkwave_file=wave.ghw
set ghdlRunOptions=--wave=%gtkwave_file% --psl-report=pslReport.json --expect-failure


echo compilling dependencies...
ghdl -a %dependencies%

echo compilling unit...
ghdl -a %unit_file%

echo compilling test...
ghdl -a %unit_file_test%

echo generating executable for test...
ghdl -e %unitUnderTest%

echo running test...
ghdl -r %unitUnderTest% %ghdlRunOptions%
::ghdl --file-to-xml > xmlTest.xml

echo COMPLETE! Opening waveform...
gtkwave %gtkwave_file%
