-- Automatically generated using the testbench_gen utility.

library IEEE;
use IEEE.std_logic_1164.all;
use IEEE.numeric_std.all;

entity LCD_Controller_testbench is
end LCD_Controller_testbench;

architecture behavioral of LCD_Controller_testbench is
	component LCD_Controller
		port(
			clk: in std_logic;
			clk_en: in std_logic;
			en: in std_logic;
			reset: in std_logic;
			RS: in std_logic;
			RW: in std_logic;
			data: in std_logic_vector(7 downto 0);
			LCD_RW: out std_logic;
			LCD_EN: out std_logic;
			LCD_RS: out std_logic;
			LCD_Data: out std_logic_vector(7 downto 0);
			busy: out std_logic
		);
	end component;

	signal clk: std_logic := '1';
	signal clk_en: std_logic;
	signal en: std_logic;
	signal reset: std_logic;
	signal RS: std_logic;
	signal RW: std_logic;
	signal data: std_logic_vector(7 downto 0);
	signal LCD_RW: std_logic;
	signal LCD_EN: std_logic;
	signal LCD_RS: std_logic;
	signal LCD_Data: std_logic_vector(7 downto 0);
	signal busy: std_logic;
begin
	UUT: LCD_Controller
		port map(
			clk => clk,
			clk_en => clk_en,
			en => en,
			reset => reset,
			RS => RS,
			RW => RW,
			data => data,
			LCD_RW => LCD_RW,
			LCD_EN => LCD_EN,
			LCD_RS => LCD_RS,
			LCD_Data => LCD_Data,
			busy => busy
		);

	clk <= not clk after 5 ns;

	process
	begin
		-- Only test write operations.
		RW <= '0';
		clk_en <= '1';
		-- Check reset.
		reset <= '1';
		en <= '1';
		RS <= '0';
		data <= X"00";
		wait for 90 ns;
		
		-- Check RS_Low write.
		reset <= '0';
		en <= '1';
		RS <= '0';
		data <= X"12";
		wait for 30 ns;

		-- Check RS_High write.
		reset <= '0';
		en <= '1';
		RS <= '1';
		data <= X"48";
		wait for 30 ns;

		-- Check en_low hold.
		reset <= '0';
		en <= '0';
		RS <= '0';
		data <= X"AA";
		wait for 1 ns;
		en <= '0';
		wait for 59 ns;
		wait;
	end process;
end behavioral;
