Library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity KeyPressDetector is 
		port(
			row: in unsigned(4 downto 0);
			isReadyForKeyPress: in std_logic;
			isKeyPressed: out std_logic);
end KeyPressDetector;

architecture behavior of KeyPressDetector is
begin

	process(isReadyForKeyPress, row)
		impure function detectedKeyPress return boolean is
		begin
			if row /= "11111" then
				return true;
			else 
				return false;
			end if;
		end function detectedKeyPress;
		
		procedure updateIsKeyPressed is
		begin
			if detectedKeyPress then
				isKeyPressed <= '1';
			else
				isKeyPressed <= '0';
			end if;
		end procedure updateIsKeyPressed;
		
	begin
		if isReadyForKeyPress = '1' then 
			updateIsKeyPressed;
		end if;
	end process;

end behavior;