library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.numeric_std.ALL;

-- Produce a reset signal for MAX_COUNT cyles when system initializes.
entity ResetDelay is
	generic (MAX_COUNT: integer := 20);
	port (
        signal clk: in std_logic;	
        signal reset: out std_logic := '1'
	);
end ResetDelay;

architecture behavioral OF ResetDelay IS
    signal cnt: integer range 0 to MAX_COUNT-1 := 0;
begin
	process(clk)
	begin
		if rising_edge(clk) then
			if cnt = MAX_COUNT-1 then
				reset <= '0';
			else 
				cnt <= cnt + 1;	
				reset <= '1';
			end if;
		end if;
	 end process;
end behavioral;