library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

package LCD_Screen is 
	-- 32 ascii values (8bit) on LCD screen.
	type screen is array(31 downto 0) of std_logic_vector(7 downto 0);
end LCD_Screen;

library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;
use work.LCD_Screen.all;

entity LCD_Userlogic is
	generic (freq_in: integer := 50000000); -- The input clk frequency.
	port(	
		clk, en, reset: in std_logic;
		iData: in screen;
		LCD_RW,LCD_en,LCD_RS : out std_logic;
		LCD_data : out std_logic_vector(7 downto 0)
	);
end LCD_Userlogic;
			
architecture behavioral of LCD_Userlogic is
	component LCD_Controller is 
		port(
			clk, clk_en: in std_logic;
			en, reset: in std_logic;
			RS, RW: in std_logic;
			data:in std_logic_vector(7 downto 0);
			LCD_RW, LCD_EN, LCD_RS: out std_logic;
			LCD_Data: out std_logic_vector(7 downto 0);
			busy: out std_logic
		);
	end component;
	
	-- Produce a clk_enable signal at the specified output_frequency.
	component clk_enabler is
		GENERIC (
			CONSTANT in_freq : integer := 150000000; --  150 MHz 
			CONSTANT out_freq : integer := 1 --  1.0 Hz 
		);      
		port(	
			clk:		in std_logic;
			clk_en: 	out std_logic
		);
	end component;
	
	-- Produce a reset signal for MAX_COUNT cyles when system initializes.
	component ResetDelay is
		generic (MAX_COUNT: integer := 20);
		port (
        signal clk: in std_logic;	
        signal reset: out std_logic := '1'
		);
	end component;
	
	type state_t is (powerOn_s, initCmd_s, write_s, wait_s);
	signal state: state_t := powerOn_s;
	signal lcd_cntl_clk_en, lcd_cntl_en, lcd_cntl_busy: std_logic;
	signal powerOn_hold, initCmd_hold: std_logic; -- Hold the powerOn and initCmd states.
	signal data: std_logic_vector (8 downto 0); -- RS and 8bit ascii char.
	signal dataSel: integer range 0 to 39 := 0; -- Select the data to send to the LCD controller.
	
begin 
	-- Hold for 15ms after power on.
	hold_PowerOn: ResetDelay
		generic map(MAX_COUNT => freq_in/66 - 1) -- 66Hz ~> 15ms
		port map(clk=>clk, reset=>powerOn_hold);
		
	-- Hold for 19.5ms (15ms + 4.5ms) after power on.
	hold_initCmd: ResetDelay
		generic map(MAX_COUNT => freq_in/50 - 1) -- 50Hz ~> 19.5ms
		port map(clk=>clk, reset=>initCmd_hold);

	lcd_cntl_clk_enabler: clk_enabler
		generic map (in_freq=>freq_in, out_freq=>5000) -- Must wait 100us between ops, 5kHz -> 200us
		port map(clk=>clk, clk_en=>lcd_cntl_clk_en);
		
	lcd: LCD_Controller
		port map(
			clk=>clk, clk_en=>lcd_cntl_clk_en,
			en=>lcd_cntl_en, reset=>'0', RS=>data(8), RW=>'0',
			data=>data(7 downto 0), LCD_RW=>LCD_RW, LCD_EN=>LCD_EN,
			LCD_RS=>LCD_RS, LCD_Data=>LCD_Data,	busy=>lcd_cntl_busy
		);
	
	process(clk)
	begin
		if powerOn_hold = '1' then
			state <= powerOn_s;
			lcd_cntl_en <= '0';
			dataSel <= 0;
		elsif rising_edge(clk) then
			case (state) is 
				-- Wait for Module to initialize.
				when powerOn_s =>
					lcd_cntl_en <= '0';
					dataSel <= 0;
					
					if powerOn_hold = '0' then
						state <= initCmd_s;
						
						-- Pulse one write of the first data.
						dataSel <= 0;
						lcd_cntl_en <= '1';
					end if;
					
				-- Send/Hold first command
				when initCmd_s =>
					if initCmd_hold = '0' then 
						state <= write_s;
					end if;
					
					-- Only perform one data write.
					if lcd_cntl_busy = '1' then
						lcd_cntl_en <= '0';
					end if;
					
				-- Write current data.
				when write_s =>
					lcd_cntl_en <= '1';
					
					-- The current write operation started.
					if lcd_cntl_busy = '1' then
						state <= wait_s;
						-- Run initialization sequence.
						if reset='1' then
							dataSel <= 0;
							
						-- reset to first screen value.
						elsif dataSel=39 then
							dataSel <= 6;
						
						-- Move to next data.
						else
							dataSel <= dataSel + 1;
						end if;
					end if;
				when wait_s =>
					lcd_cntl_en <= '1';
					
					-- The current write operation finished.
					if lcd_cntl_busy = '0' then
						state <= write_s;
					end if;
			end case;
		end if;
	end process;
	
	process(dataSel)
	begin
		case dataSel is
			when 0 => data <= '0' & X"30"; -- Function Set (interface=8bit, N=2 lines, F=8/5 dot font)
			when 1 => data <= '0' & X"30"; -- Function Set (interface=8bit, N=2 lines, F=8/5 dot font)
			when 2 => data <= '0' & X"38"; -- Function Set (interface=8bit, N=2 lines, F=8/5 dot font)
			when 3 => data <= '0' & X"0C"; -- Display Control (Display on, cursor and blinking off)
			when 4 => data <= '0' & X"01"; -- Clear Display
			when 5 => data <= '0' & X"07"; -- Entry Mode Set (Cursor move fwd and shift enable)
			when 6 => data <= '0' & X"02"; -- reset cursor to HOME.
				when 7 => data <= '1' & iData(0); -- User data 0.
				when 8 => data <= '1' & iData(1); -- User data 1.
				when 9 => data <= '1' & iData(2); -- User data 2.
				when 10 => data <= '1' & iData(3); -- User data 3.
				when 11 => data <= '1' & iData(4); -- User data 4.
				when 12 => data <= '1' & iData(5); -- User data 5.
				when 13 => data <= '1' & iData(6); -- User data 6.
				when 14 => data <= '1' & iData(7); -- User data 7.
				when 15 => data <= '1' & iData(8); -- User data 8.
				when 16 => data <= '1' & iData(9); -- User data 9.
				when 17 => data <= '1' & iData(10); -- User data 10.
				when 18 => data <= '1' & iData(11); -- User data 11.
				when 19 => data <= '1' & iData(12); -- User data 12.
				when 20 => data <= '1' & iData(13); -- User data 13.
				when 21 => data <= '1' & iData(14); -- User data 14.
				when 22 => data <= '1' & iData(15); -- User data 15.
			when 23 => data <= '0' & X"C0";
				when 24 => data <= '1' & iData(16); -- User data 16.
				when 25 => data <= '1' & iData(17); -- User data 17.
				when 26 => data <= '1' & iData(18); -- User data 18.
				when 27 => data <= '1' & iData(19); -- User data 19.
				when 28 => data <= '1' & iData(20); -- User data 20.
				when 29 => data <= '1' & iData(21); -- User data 21.
				when 30 => data <= '1' & iData(22); -- User data 22.
				when 31 => data <= '1' & iData(23); -- User data 23.
				when 32 => data <= '1' & iData(24); -- User data 24.
				when 33 => data <= '1' & iData(25); -- User data 25.
				when 34 => data <= '1' & iData(26); -- User data 26.
				when 35 => data <= '1' & iData(27); -- User data 27.
				when 36 => data <= '1' & iData(28); -- User data 28.
				when 37 => data <= '1' & iData(29); -- User data 29.
				when 38 => data <= '1' & iData(30); -- User data 30.
				when 39 => data <= '1' & iData(31); -- User data 31.
			when others=> data <= '0' & X"30";
		end case;
    end process;

end behavioral;
