Library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ColumnCounter is
		port (
		enable			: in std_logic;
		clock				: in std_logic;
		column			: out unsigned(3 downto 0));
end ColumnCounter;

architecture behavior of ColumnCounter is
	type stateType is (A,B,C,D);
	signal Counting : stateType;
	
begin 
	process(clock, enable)
	begin
		if rising_edge(clock) then
			if enable = '1' then
				counting <= A;
				case Counting is
					when A =>
						column <= "0111";
						if enable ='1' then
							Counting <= B;
						end if;
					when B =>
						column <= "1011";
						if enable ='1' then
							Counting <= C;
						end if;
					when C =>
						column <= "1101";
						if enable ='1' then
							Counting <= D;
						end if;
					when D =>
						column <= "1110";
						if enable ='1' then
							Counting <= A;
						end if;
				end case;
			end if;
		end if;
	end process;
end behavior;