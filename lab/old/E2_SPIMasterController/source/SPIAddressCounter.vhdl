library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library work;
use work.common.all;

entity SPIAddressCounter is
	port(
		state: in stateType;
		address: buffer counter;
		isDone: out std_logic);	
end SPIAddressCounter;

architecture countDown of SPIAddressCounter is
	signal isLastFetch: std_logic;
	signal isLastReceive: std_logic;
begin
	stateControl: process(state)
		procedure resetCounter is begin
			address <= to_unsigned(word'high, address'length);
		end procedure resetCounter;	

		procedure resetFlags is begin
			isLastFetch <= '0';
			isLastReceive <= '0';
		end procedure resetFlags;

		procedure decrementCounter is begin
			address <= address - 1;
		end procedure decrementCounter;	

		procedure updateOnFetch is begin
			if address = 0 then
				isLastFetch <= '1';
			end if;
		end procedure updateOnFetch;

		procedure updateOnReceive is begin
			if isLastFetch = '1' then
				isLastReceive <= '1';
			else
				decrementCounter;
			end if;
		end procedure updateOnReceive;

	begin	
		case state is
			when idle =>
				resetCounter; 
				resetFlags;
			when fetching =>
				updateOnFetch;
			when receiving =>
				updateOnReceive;
			when others =>
				null;			
		end case;
	end process stateControl;

	setIsDoneInterrupt: process(state)
	begin
		if isLastReceive = '1' then
			isDone <= '1';
		else
			isDone <= '0';
		end if;
	end process setIsDoneInterrupt;

end architecture countDown;
