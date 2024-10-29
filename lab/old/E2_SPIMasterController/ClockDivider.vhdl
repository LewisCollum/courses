library ieee;
use ieee.std_logic_1164.all;

entity ClockDivider is
	generic(constant divideBy: integer);
	port(
		clock: in std_logic;
		resetActiveLow: in std_logic;
		dividedClock: out std_logic);
end entity ClockDivider;

architecture behavior of ClockDivider is 
	subtype countRange is integer range 0 to divideBy - 1;
	signal clockRisingEdgeCount: countRange;
	signal clockFlipFlop: std_logic;

begin
	process(clock) is 
		procedure update;
		procedure reset;
		procedure flipDividedClock;
		procedure countRisingEdge;

		procedure update is
		begin
			if rising_edge(clock) then
				if resetActiveLow = '0' then
					reset;
				elsif clockRisingEdgeCount = countRange'right then
					flipDividedClock;
				else
					countRisingEdge;
				end if;
			end if;
		end procedure update;

		procedure reset is
		begin
			clockRisingEdgeCount <= 0;
			clockFlipFlop <= '1';
			dividedClock <= '0';
		end procedure reset;
		
		procedure flipDividedClock is
		begin
			clockFlipFlop <= not clockFlipFlop;
			dividedClock <= clockFlipFlop;
			clockRisingEdgeCount <= 0; 
		end procedure flipDividedClock;

		procedure countRisingEdge is
		begin
			clockRisingEdgeCount <= clockRisingEdgeCount + 1;
		end procedure countRisingEdge;
	
	begin
		update;
	end process;

end architecture behavior;

