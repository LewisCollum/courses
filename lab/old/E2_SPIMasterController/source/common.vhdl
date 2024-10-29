library ieee;
use ieee.numeric_std.all;
use ieee.math_real.log;

package common is
	type stateType is (idle, selecting, fetching, receiving, done, stopping, disabled);
	subtype word is unsigned(15 downto 0);
	subtype counter is unsigned(integer(log((real(word'length)) / log(real(2)))-0.5) downto 0);
	--subtype counter is integer range word'high downto word'low;
	subtype validFrequencyRange is integer range 1 to 500e3;
end package common;
