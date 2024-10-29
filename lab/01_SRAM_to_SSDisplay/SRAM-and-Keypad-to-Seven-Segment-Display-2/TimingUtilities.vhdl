library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

package TimingUtilities is
	function frequencyToPeriod(frequency: positive) return time;
	procedure generateClock(signal clock: out std_logic; frequency: positive);
	procedure highPulseForTime(signal output: out std_logic; duration: time);
	procedure lowPulseForTime(signal output: out std_logic; duration: time);
end package TimingUtilities;

package body TimingUtilities is

	function frequencyToPeriod(frequency: positive) return time is
	begin
		return 1 sec / frequency;
	end function frequencyToPeriod;

	procedure generateClock(signal clock: out std_logic; frequency: positive) is
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

	procedure highPulseForTime(signal output: out std_logic; duration: time) is
	begin
		output <= '1';
		wait for duration;
		output <= '0';
	end procedure highPulseForTime;

	procedure lowPulseForTime(signal output: out std_logic; duration: time) is
	begin
		output <= '0';
		wait for duration;
		output <= '1';
	end procedure lowPulseForTime;

end package body TimingUtilities;


