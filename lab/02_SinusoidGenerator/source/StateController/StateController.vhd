library ieee;
use ieee.std_logic.all;

entity StateController is
  port(
    clock: in std_logic;
    interrupt: in InterruptBus;
    state: out StateBus);
end entity StateController;

architecture behavioral of StateController is
  
end architecture behavioral;
