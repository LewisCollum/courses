library IEEE;
use IEEE.std_logic_1164.all;
use ieee.numeric_std.all;

entity LCD_Controller is 
	port(
		clk, clk_en: in std_logic;
		en, reset: in std_logic;
		RS, RW: in std_logic;
		data:in std_logic_vector(7 downto 0);
		LCD_RW, LCD_EN, LCD_RS: out std_logic;
		LCD_Data: out std_logic_vector(7 downto 0);
		busy: out std_logic
	);
end LCD_Controller;
	
architecture behavioral of LCD_Controller is
	type state_t is (reset_s, start_s, en_s, write_s, hold_s);
	signal state: state_t;
	signal data_start: std_logic_vector(7 downto 0);
begin
	process(clk)
	begin
		if reset='1' then
			state <= reset_s;
			busy <= '1';
			LCD_RW <= '0';
			LCD_EN <= '0';
			LCD_RS <= '0';
			LCD_Data <= (others => '0');
		elsif rising_edge(clk) and clk_en='1' then
			case state is 
				when reset_s =>
					state <= start_s;
					busy <= '0';
					LCD_RW <= RW;
					LCD_EN <= '0';
					LCD_RS <= RS;
				when start_s =>
					LCD_RW <= RW;
					LCD_RS <= RS;
					
					if en = '1' then
						state <= en_s;
						busy <= '1';
						LCD_EN <= '1';
						data_start <= data;
					end if;
				when en_s =>
					state <= write_s;
					busy <= '1';
					LCD_EN <= '1';
					LCD_Data <= data_start;
				when write_s =>
					state <= hold_s;
					busy <= '1';
					LCD_EN <= '0';
					LCD_Data <= data_start;
				when hold_s =>
					state <= start_s;
					busy <= '0';
					LCD_EN <= '0';
					LCD_RW <= RW;
					LCD_RS <= RS;
			end case;
		end if;
	end process;
	
end behavioral;	