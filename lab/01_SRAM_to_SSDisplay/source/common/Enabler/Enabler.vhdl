library ieee;
use ieee.std_logic_1164.all;

entity Enabler is
  port(
    input: in std_logic;
    enable: in std_logic;
    output: out std_logic);
end entity Enabler;

architecture behavioral of Enabler is
begin
  if enable = '1' then
    output <= input;
  else
    output <= 'Z';
  end if;
end architecture behavioral;
