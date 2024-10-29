library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library work;
use work.common.all;
use work.timingUtil.all;


entity Test_SPIMaster is
end entity Test_SPIMaster;

architecture simulation of Test_SPIMaster is
	component SPIMaster is
		generic(
			constant slaveClockPolarity: std_logic);
		port( 
			clock: in std_logic;
			data: in word; 
			resetActiveLow: in std_logic;  
			enable: in std_logic;  
			isBusy: out std_logic;         
			masterOut: out std_logic;
			slaveClock: buffer std_logic;
			slaveSelectActiveLow: out std_logic);
	end component SPIMaster;

	constant clockFrequency: validFrequencyRange := 250e3;
	constant clockPeriod: time := frequencyToPeriod(clockFrequency);
	
	signal clock: std_logic;
	signal dataToSend: word;
	signal resetActiveLow: std_logic;
	signal enable: std_logic;
	signal isBusy: std_logic;
	signal masterOut, slaveClock, slaveSelectActiveLow: std_logic;

begin

	generateClock(clock, frequency => clockFrequency);
	
	uut: SPIMaster
		generic map(
			slaveClockPolarity => '0')
		port map( 
			clock => clock,
			data => dataToSend, 
			resetActiveLow => resetActiveLow,
			enable => enable,
			isBusy => isBusy,
			masterOut => masterOut,
			slaveClock => slaveClock,
			slaveSelectActiveLow => slaveSelectActiveLow);

	test : process is
		constant testWord: word := x"A4E1";

		procedure setup is
		begin
			enable <= '1';
			lowPulseForTime(resetActiveLow, clockPeriod/2);	
		end procedure setup;

		procedure testFetchWord is 
		begin
			setup;
			dataToSend <= testWord;
			wait for clockPeriod*2*19;
		end procedure testFetchWord;
		
		procedure testResetWhileFetching is
		begin
			setup;
			dataToSend <= testWord;
			wait for 6*clockPeriod;
			lowPulseForTime(resetActiveLow, clockPeriod);
			wait for clockPeriod*10;
		end procedure testResetWhileFetching;

		procedure testDisableWhileFetching is
		begin
			setup;
			dataToSend <= testWord;
			wait for 6*clockPeriod;
			lowPulseForTime(enable, 4*clockPeriod);
			wait for 8*clockPeriod;
		end procedure testDisableWhileFetching;
		
	begin
		testFetchWord;
		--wait for clockPeriod * 40;
		report "END OF TEST" severity failure; --TODO figure out best practice to end a test properly.
	end process test;

end architecture simulation;
