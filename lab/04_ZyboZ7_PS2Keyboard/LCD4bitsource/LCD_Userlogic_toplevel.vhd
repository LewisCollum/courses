library IEEE;
use IEEE.std_logic_1164.all;
use IEEE.numeric_std.all;

entity LCD_Userlogic_toplevel is 
	port(
		sysclk: in std_logic;
		--LCD_RW: out std_logic;
		LCD_EN: out std_logic;
		LCD_RS: out std_logic;
		LCD_data: out std_logic_vector(7 downto 0)
		
	);
end entity;

architecture behavioral of LCD_Userlogic_toplevel is
	component LCD_Userlogic
		generic(
			freq_in: integer
		);
		port(
			clk: in std_logic;
			en: in std_logic;
			reset: in std_logic;
			clear: in std_logic;
			iData: in std_logic_vector;
			LCD_RW: out std_logic;
			LCD_EN: out std_logic;
			LCD_RS: out std_logic;
			LCD_data: out std_logic_vector(7 downto 0)
		);
	end component;

	-- Produce a clk_enable signal at the specified output_frequency.
	component clk_enabler is
		GENERIC (
			CONSTANT in_freq : integer := 125000000; --  150 MHz 
			CONSTANT out_freq : integer := 1 --  1.0 Hz 
		);      
		port(	
			clk:		in std_logic;
			clk_en: 	out std_logic
		);
	end component;

	
	
	
	
	signal clk_en: std_logic;
	signal LCD_RW_s, LCD_EN_s, LCD_RS_s: std_logic;
	signal LCD_data_s: std_logic_vector(7 downto 0);
	signal hex: std_logic_vector(1 downto 0);
	signal ascii: std_logic_vector(7 downto 0);
begin
	UUT: LCD_Userlogic
		generic map(
			freq_in => 125000000 --50 MHz
		)
		port map(
			clk => sysclk,
			en => '1',
			reset => '0',
			clear => '0',
			iData => x"43",
			LCD_RW => LCD_RW_s,
			LCD_en => LCD_en_s,
			LCD_RS => LCD_RS_s,
			LCD_data => LCD_data_s
		);
	
	
	
	cnter_clk_enabler: clk_enabler
		generic map (in_freq=>50000000, out_freq=>1)
		port map(clk=>sysclk, clk_en=>clk_en);

	-- s <= initializing when hex="00" else
			-- test_mode when hex="01" else
			-- pause_mode when hex="10" else
			-- iData;
	--s <= iData;
	
	
	
LCD_RW_S<= '0';
	LCD_en <= LCD_en_s;
	LCD_RS <= LCD_RS_s;
	LCD_Data <= LCD_data_s;
	
	
	
	
	
end behavioral;