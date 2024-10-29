library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library work;
use work.TimingUtil.all;

entity Test_SPI_master is
end entity Test_SPI_master;

architecture simulation of Test_SPI_master is
	component SPI_master is
	generic (constant CntMax : integer);
		port ( 
			clock: in std_logic;
			iData: in std_logic_vector(7 downto 0); 
			iReset_n: in std_logic;  
			iEna: in std_logic;  
			oBusy: out std_logic;         
			MOSI,SCK,SSN: out std_logic);
	end component SPI_master;

	subtype byte is unsigned(7 downto 0);

	constant clockFrequency: integer := 250e3;
	constant clockPeriod: time := frequencyToPeriod(clockFrequency);
	
	signal clock: std_logic;
	signal dataToSend: byte;
	signal resetActiveLow: std_logic;
	signal enable: std_logic;
	signal isBusy: std_logic;
	signal masterOut, slaveClock, chipSelectActiveLow: std_logic;

begin

	generateClock(clock, frequency => clockFrequency);
	
	uut: SPI_master
		generic map(CntMax => 1) -- does not change clock frequency inside SPI_master
		port map(
			clock => clock,
			iData => std_logic_vector(dataToSend),
			iReset_n => resetActiveLow,
			iEna => enable,
			oBusy => isBusy,
			MOSI => masterOut,
			SCK => slaveClock,
			SSN => chipSelectActiveLow);

	test : process is
		constant testWord : unsigned := x"AB";

		procedure setup is
		begin
			enable <= '1';
			lowPulseForTime(resetActiveLow, clockPeriod*11);	
		end procedure setup;

		procedure testFetchWord is 
		begin
			setup;
			dataToSend <= testWord;
			wait for clockPeriod*260;
		end procedure testFetchWord;
		
		procedure testResetWhileFetching is
		begin
			setup;
			dataToSend <= testWord;
			wait for 6*clockPeriod*11; --10 because of SPI_master built-in clock divider (divide-by-10)
			lowPulseForTime(resetActiveLow, clockPeriod*11);
			wait for clockPeriod*260;
		end procedure testResetWhileFetching;

		procedure testDisableWhileFetching is
		begin
			setup;
			dataToSend <= testWord;
			wait for 6*clockPeriod*11;
			lowPulseForTime(enable, 4*clockPeriod*11);
			wait for 10*clockPeriod*11;
		end procedure testDisableWhileFetching;

	begin
		testDisableWhileFetching;
		
		report "END OF TEST" severity failure; --TODO figure out best practice to end a test properly.
	end process test;

end architecture simulation;


