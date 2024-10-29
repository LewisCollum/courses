library ieee;
use ieee.std_logic_1164.all;

-----------------------------------------------

entity CommandTranslator is
port(
	row			: in unsigned(1 downto 0);
	column		: in unsigned(1 downto 0);
	direction	: out std_logic := '1'; -- 1 is forward (L key)
	pause			: out std_logic := '1'; -- 1 is paused (H key). SYSTEM SHOULD START OUT STOPPED
	run			: out std_logic := '0' -- 0 "operation" mode, 1 "edit" mode (SHIFT key)
);
end CommandTranslator;
------------------------------------------------

architecture behavior of CommandTranslator is
begin

	process(row)
	begin 
		if row = "01" and column = "10" then --Shift
			run <= not run;
		elsif row = "10" and column = "01" then --H
			pause <= not pause;
		elsif row = "10" and column = "10" then -- L
			direction <= not direction;
		end if;
	end process;
end behavior;