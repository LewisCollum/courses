library ieee;
use ieee.std_logic_1164.all;

entity ClockDivider is
  generic(constant divisor: integer);
  port(
    input: in std_logic;
    output: out std_logic);
end entity ClockDivider;

architecture behavioral of ClockDivider is
  
begin
  process is
    subtype counterRange is integer range 0 to divisor;
    variable counter: counterRange := 0;
  begin
    if counter = divisor then
      counter = 0;
      output <= 
    else
      counter := counter + 1;
    end if;
  end process;

  
end architecture behavioral;    
