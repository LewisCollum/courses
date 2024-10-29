-- Automatically generated using the testbench_gen utility.
library IEEE;
use IEEE.STD_LOGIC_1164.all;
use IEEE.NUMERIC_STD.all;
library system_bus;
use system_bus.StateBus.all;
library lcd;
use lcd.LCDInterrupt.LCDInterrupt;
use lcd.LCDCommunication.all;
use lcd.LCDASCII.all;

entity LCDUserLogicSimple_testbench is
end LCDUserLogicSimple_testbench;

architecture behavioral of LCDUserLogicSimple_testbench is
	component LCDUserLogicSimple
		port(
			iclock: in std_logic;
			state: in StateBus;
			Interrupt: out LCDInterrupt;
			Control: out LCDControl
		);
	end component;

	signal iclock: std_logic := '0';
	signal state: StateBus;
	signal Interrupt: LCDInterrupt;
	signal Control: LCDControl;
begin

     iclock <= not iclock after 8 ns;

	UUT: LCDUserLogicSimple
		port map(
			iclock => iclock,
			state => state,
			Interrupt => Interrupt,
			Control => Control
		);


	process
	begin
		-- User code here.
		state.System <= initialize;
        state.Sensor <= light;
        state.Clock <= disabled;
        wait for 500 ms;
        
        state.System <= fetch;
        state.Sensor <= light;
        state.Clock <= enabled;
        wait for 100 ms;

		wait;
	end process;
end behavioral;
