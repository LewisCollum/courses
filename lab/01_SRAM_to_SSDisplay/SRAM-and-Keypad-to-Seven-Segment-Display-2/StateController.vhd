library ieee;
use ieee.std_logic_1164.all;

library work;
use work.StateBus;
use work.InterruptBus;
use work.InterruptHandler;

entity StateController is
  port(
    clock: in std_logic;
    interrupt: in InterruptBus.InterruptRecord;
    state: out StateBus.StateRecord);
end entity StateController;

architecture behavioral of StateController is
begin
  
  process(clock, interrupt)
  begin
    
    if falling_edge(interrupt.resetActiveLow) then
      InterruptHandler.handleReset;
    elsif rising_edge(interrupt.isAddressCounterDone) then
      InterruptHandler.handleAddressCounterDone;
    elsif rising_edge(clock)
      if StateBus.isState(major => StateBus.systemInitialize, minor => StateBus.none) then
        StateBus.setState(major => StateBus.loadRomToRam, minor => StateBus.initialize);
      end if;
    end if;
  end process;

  state <= StateBus.state;
end architecture behavioral;
