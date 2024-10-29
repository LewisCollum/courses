Library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity Key_Press_Detector is 
		port(
			Rows				:in unsigned(4 downto 0);
			isKeyPressed	:out std_logic);
end Key_Press_Detector;

architecture behavior of Key_Press_Detector is

begin

process(Rows)
begin
	if Rows /= "1111" then
		isKeyPressed <= '1';
	else
		isKeyPressed <='0';
	end if;
end process;

end behavior;