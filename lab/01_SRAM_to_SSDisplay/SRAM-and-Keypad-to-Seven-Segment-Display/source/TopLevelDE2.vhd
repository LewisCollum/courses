library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity main is
   port (	     
		CLOCK_27: in STD_LOGIC; -- On Board 27 MHz
      CLOCK_50: in STD_LOGIC; -- On Board 50 MHz	      
      KEY: in STD_LOGIC_VECTOR(3 downto 0); -- Pushbutton[3:0]      
      HEX0: out STD_LOGIC_VECTOR(6 downto 0); -- Seven Segment Digit 0
      HEX1: out STD_LOGIC_VECTOR(6 downto 0);	-- Seven Segment Digit 1
      HEX2: out STD_LOGIC_VECTOR(6 downto 0);	-- Seven Segment Digit 2
      HEX3: out STD_LOGIC_VECTOR(6 downto 0);	-- Seven Segment Digit 3
      HEX4: out STD_LOGIC_VECTOR(6 downto 0);	-- Seven Segment Digit 4
      HEX5: out STD_LOGIC_VECTOR(6 downto 0);	-- Seven Segment Digit 5	      
      LEDG: out STD_LOGIC_VECTOR(8 downto 0);	-- LED Green[8:0]
      LEDR: out STD_LOGIC_VECTOR(17 downto 0); -- LED Red[17:0]   
      SRAM_DQ: INOUT STD_LOGIC_VECTOR(15 downto 0);	-- SRAM Data bus 16 Bits
      SRAM_ADDR: out STD_LOGIC_VECTOR(17 downto 0); -- SRAM Address bus 18 Bits
      SRAM_UB_N: out STD_LOGIC; -- SRAM High-byte Data Mask
      SRAM_LB_N: out STD_LOGIC; -- SRAM Low-byte Data Mask
      SRAM_WE_N: out STD_LOGIC; -- SRAM Write Enable
      SRAM_CE_N: out STD_LOGIC; -- SRAM Chip Enable
      SRAM_OE_N: out STD_LOGIC; -- SRAM Output Enable 
      GPIO_0: INOUT STD_LOGIC_VECTOR(35 downto 0)); -- GPIO Connection 0                                                                                              
end main;

architecture structural of main is

component KeyPressDetector is
		port(
			row: in unsigned(4 downto 0);
			isReadyForKeyPress: in std_logic;
			isKeyPressed: out std_logic);
end component;

component ColumnCounter is
		port (
			enable: in std_logic;
			clock: in std_logic;
			column: out unsigned(3 downto 0));
end component;

component DataTranslator is
		port(
			row: in unsigned(4 downto 0);
			column: in unsigned(3 downto 0);
			state: in std_logic;
			data: out unsigned(3 downto 0);
			address: out unsigned(1 downto 0)
		);
end component;

	signal isKeyPressed: std_logic;
	signal column: unsigned(3 downto 0);
	signal row: unsigned(4 downto 0);
	signal data: unsigned(3 downto 0);
	signal slowClock: std_logic := '0';
	signal isReadyForKeyPress: std_logic := '1';

BEGIN
	
	process(CLOCK_50)
		subtype counterRange is integer range 0 to 1000000;
		variable counter: counterRange := 0;
	begin
		if rising_edge (CLOCK_50) then
			if counter = counterRange'high then
				counter := 0;
				slowClock <= not slowClock; 
				LEDR(17) <= slowClock;
			else
				counter := counter+1;
			end if;
		end if;		
	end process;

	stateHandler: process(isKeyPressed)
	begin
		isReadyForKeyPress <= not isReadyForKeyPress;
	end process stateHandler;
			
	buttonPress: KeyPressDetector
		port map(
			row => row,
			isReadyForKeyPress => isReadyForKeyPress,
			isKeyPressed => isKeyPressed
		);
		
	gpioColumnCounter: ColumnCounter
		port map(
			enable => not isKeyPressed,
			clock => slowClock,
			column => column);
		
	kepadDataTranslator: DataTranslator
		port map(
			row => row,
			column => column,
			state => isKeyPressed,
			data => data);
	
	row <= unsigned(GPIO_0(8 downto 4));
	GPIO_0(3 downto 0) <= std_logic_vector(column);
	LEDR(11 downto 8) <= std_logic_vector(data);
	
	LEDR(16 downto 13) <= std_logic_vector(column);
	LEDR(4 downto 0) <= GPIO_0(8 downto 4);
	LEDG(0) <= isKeyPressed;
	
end structural;



