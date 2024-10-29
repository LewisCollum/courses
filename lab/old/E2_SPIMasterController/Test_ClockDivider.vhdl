library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity Test_ClockDivider is
end entity Test_ClockDivider;

architecture simulation of Test_ClockDivider is
	
	component ClockDivider is 
		generic(constant divideBy: integer);
		port(
			clock: in std_logic;
			resetActiveLow: in std_logic;
			dividedClock: out std_logic);
	end component ClockDivider;

	function frequencyToPeriod(frequency: integer) return time is
	begin
		return 1 sec / frequency;
	end function frequencyToPeriod;

	procedure generateClock(signal clock: out std_logic; frequency: integer) is
		constant period: time := 1 sec / frequency;
		constant halfPeriod: time := period / 2;
	begin
		loop
			clock <= '1';
			wait for halfPeriod;
			clock <= '0';
			wait for halfPeriod;
		end loop;
	end procedure generateClock;

	constant clockFrequency: integer := 250e3;
	constant clockPeriod: time := frequencyToPeriod(clockFrequency);
	signal clock: std_logic;
	signal resetActiveLow: std_logic;
	signal dividedClock: std_logic;

begin

	generateClock(clock, frequency => clockFrequency);

	uut: ClockDivider
		generic map(divideBy => 5)
		port map(
			clock => clock,
			resetActiveLow => resetActiveLow,
			dividedClock => dividedClock);

	test: process is
		procedure resetForTime(duration: time) is
		begin
			resetActiveLow <= '0';
			wait for duration;
			resetActiveLow <= '1';
		end procedure resetForTime;

	begin
		resetForTime(clockPeriod * 2);
		wait for clockPeriod * 20;
		resetForTime(clockPeriod * 3);
		wait for clockPeriod * 25;
		report "END OF TEST" severity failure;
	end process test;
end architecture simulation;
