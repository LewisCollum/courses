library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library work;
use work.common.all;

entity SPIMaster is
    generic(
		constant slaveClockPolarity: std_logic);
    port( 
	    clock: in std_logic;
	    data: in word; 
	    resetActiveLow: in std_logic;
	    enable: in std_logic;  
	    isBusy: out std_logic;         
	    masterOut: out std_logic;
	    slaveClock: buffer std_logic;
	    slaveSelectActiveLow: out std_logic);
end SPIMaster;

architecture CPHA0 of SPIMaster is
	component SPIAddressCounter is
		port(
			state: inout stateType;
			address: buffer counter;
			isDone: out std_logic);	
	end component SPIAddressCounter;
	
	signal dataBitAddress: counter;
    signal state: stateType;
	signal isCounterDone: std_logic;

begin
	stateControl : process(clock, isCounterDone)
		procedure handleCounterInterrupt;
		procedure updateAllStates;
		procedure updateCyclicalStates;
		impure function isReadyToSelect return boolean;
		impure function isReadyToFetch return boolean;
		impure function isReadyToReceive return boolean;
		impure function isReadyToIdle return boolean;
		impure function isLastBitOfData return boolean;

		procedure handleCounterInterrupt is begin
			state <= stopping;
		end procedure handleCounterInterrupt;

		procedure updateAllStates is begin
			if resetActiveLow = '0' then
				state <= idle;
			elsif enable = '1' then
				updateCyclicalStates;
			else
				state <= disabled;
			end if;
		end procedure updateAllStates;

		procedure updateCyclicalStates is begin
			if isReadyToIdle then
				state <= idle;		
			elsif isReadyToSelect then
				state <= selecting;
			elsif isReadyToFetch then
				state <= fetching;
			elsif isReadyToReceive then
				state <= receiving;
			end if;
		end procedure updateCyclicalStates;

		impure function isReadyToSelect return boolean is begin
			return state = idle;
		end function isReadyToSelect;

		impure function isReadyToFetch return boolean is begin 
			return state = receiving;
		end function isReadyToFetch;

		impure function isReadyToReceive return boolean is begin
			return state = fetching or state = selecting;
		end function isReadyToReceive;

		impure function isReadyToIdle return boolean is begin
			return state = stopping;
		end function isReadyToIdle;

		impure function isLastBitOfData return boolean is begin
			return dataBitAddress = dataBitAddress'low;
		end function isLastBitOfData;

	begin
		if rising_edge(isCounterDone) then
			handleCounterInterrupt;	
		elsif rising_edge(clock) then
			updateAllStates;
		end if;
	end process stateControl;

	
	slaveClock_StateMachine : process(state)
		procedure reset is begin
			slaveClock <= slaveClockPolarity;
		end procedure reset; 

		procedure trailingEdge is begin
			slaveClock <= slaveClockPolarity;
		end procedure trailingEdge;

		procedure leadingEdge is begin
			slaveClock <= not slaveClockPolarity;
		end procedure leadingEdge;
	
	begin
		case state is
			when idle | stopping =>
				reset;
			when fetching =>
				trailingEdge;
			when receiving =>
				leadingEdge;
			when others =>
				null;
		end case;
	end process slaveClock_StateMachine;


	slaveSelect_StateMachine : process(state)
		procedure deselectSlave is begin
			slaveSelectActiveLow <= '1';
		end procedure deselectSlave;

		procedure selectSlave is begin
			slaveSelectActiveLow <= '0';
		end procedure selectSlave;

	begin
		case state is
			when idle =>
				deselectSlave;	
			when selecting =>
				selectSlave;
			when others => 
				null;
		end case;
	end process slaveSelect_StateMachine;


	masterOut_StateMachine : process(state)
		procedure fetchBit is begin 
			masterOut <= data(to_integer(dataBitAddress));
		end procedure fetchBit;
		
		procedure releaseBit is begin
			masterOut <= '-';
		end procedure releaseBit;

	begin
		case state is
			when idle | stopping =>
				releaseBit;
			when fetching | selecting =>
				fetchBit;
			when others =>
				null;
		end case;
	end process masterOut_StateMachine;


	isBusy_StateMachine: process(state)
	begin
		case state is
			when idle =>
				isBusy <= '0';
			when selecting => 
				isBusy <= '1';
			when others =>
				null;
		end case;
	end process isBusy_StateMachine;

	dataBitAddressCounter: SPIAddressCounter
		port map(
			state => state,
			address => dataBitAddress,
			isDone => isCounterDone);	

end CPHA0;
