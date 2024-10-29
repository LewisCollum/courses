library ieee;
use ieee.std_logic_1164.all;

entity Toggler is
  port(
    data: in std_logic;
    load: in std_logic;
    toggle: in std_logic;
    output: out std_logic);
end entity Toggler;

architecture behavioral of Toggler is
  signal latchedValue: std_logic;
begin
  process(load, toggle)
  begin
    if load = '1' then
      latchedValue <= data;
    elsif toggle = '1' then
      latchedValue <= not latchedValue;
    end if;
  end process;

  output <= latchedValue;
  
end architecture behavioral;
    
