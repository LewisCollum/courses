library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

package TimingUtil is
	function frequencyToPeriod(frequency: integer) return time;
	procedure generateClock(signal clock: out std_logic; frequency: integer);
	procedure highPulseForTime(signal output: out std_logic; duration: time);
	procedure lowPulseForTime(signal output: out std_logic; duration: time);
end package TimingUtil;

package body TimingUtil is

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

end package body TimingUtil;


