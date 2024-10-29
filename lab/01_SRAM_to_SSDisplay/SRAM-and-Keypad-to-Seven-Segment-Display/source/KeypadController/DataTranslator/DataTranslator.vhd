Library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use work.KeyPadPackage.all;

entity DataTranslator is
		port(
			row: in unsigned(4 downto 0);
			column: in unsigned(3 downto 0);
			state: in std_logic;
			data: out unsigned(3 downto 0);
			address: out unsigned(1 downto 0)
		);
		
end DataTranslator;

architecture behavior of DataTranslator is
begin
	process(state)
	begin 
		if rising_edge(state) then
			for i in 0 to column'length-1 loop
				for j in 0 to row'length-1 loop
					if column(i) = '0' and row(j) = '0' then
						data <= keyPad(j, i);
					end if;
				end loop;
			end loop;
		end if;
	end process;

end behavior;
