-- Automatically generated using the testbench_gen utility.

library IEEE;
use IEEE.std_logic_1164.all;
use IEEE.numeric_std.all;
use work.LCD_Screen.all;

entity LCD_Userlogic_testbench is
end LCD_Userlogic_testbench;

architecture behavioral of LCD_Userlogic_testbench is
	component LCD_Userlogic
		generic(
			freq_in: integer
		);
		port(
			clk: in std_logic;
			en: in std_logic;
			reset: in std_logic;
			iData: in screen;
			LCD_RW: out std_logic;
			LCD_EN: out std_logic;
			LCD_RS: out std_logic;
			LCD_data: out std_logic_vector(7 downto 0)
		);
	end component;

	signal clk: std_logic := '1';
	signal en: std_logic;
	signal reset: std_logic;
	signal iData: screen;
	signal LCD_RW: std_logic;
	signal LCD_en: std_logic;
	signal LCD_RS: std_logic;
	signal LCD_data: std_logic_vector(7 downto 0);
begin
	UUT: LCD_Userlogic
		generic map(
			freq_in => 100000000 --10 ns
		)
		port map(
			clk => clk,
			en => en,
			reset => reset,
			iData => iData,
			LCD_RW => LCD_RW,
			LCD_en => LCD_en,
			LCD_RS => LCD_RS,
			LCD_data => LCD_data
		);

	clk <= not clk after 5 ns;

	process
	begin
		en <= '1';
		reset <= '0';
		iData <= (
			X"1f", X"1e", X"1d", X"1c", X"1b", X"1a", X"19", X"18",
			X"17", X"16", X"15", X"14", X"13", X"12", X"11", X"10",
			X"0f", X"0e", X"0d", X"0c", X"0b", X"0a", X"09", X"08",
			X"07", X"06", X"05", X"04", X"03", X"02", X"01", X"00"
		);
		
		wait;
	end process;
end behavioral;
