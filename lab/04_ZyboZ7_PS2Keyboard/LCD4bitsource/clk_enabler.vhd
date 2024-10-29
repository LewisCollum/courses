library ieee ;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

-- Produce a clk_enable signal at the specified output_frequency.
entity clk_enabler is
	GENERIC (
		CONSTANT in_freq : integer := 150000000; --  150 MHz 
		CONSTANT out_freq : integer := 1 --  1.0 Hz 
	);      
	port(	
		clk:		in std_logic;
		clk_en: 	out std_logic
	);
end clk_enabler;


architecture behv of clk_enabler is
	CONSTANT cnt_max : integer := in_freq/out_freq;
	signal clk_cnt: integer range 0 to cnt_max;
begin
	process(clk)
	begin
		if rising_edge(clk) then
			if (clk_cnt = cnt_max) then
				clk_cnt <= 0;
				clk_en <= '1';
			else
				clk_cnt <= clk_cnt + 1;
				clk_en <= '0';
			end if;
		end if;
	end process;
end behv;
