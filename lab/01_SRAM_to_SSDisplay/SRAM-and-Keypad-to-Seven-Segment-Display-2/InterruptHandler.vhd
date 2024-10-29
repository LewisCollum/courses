library ieee;
use ieee.std_logic_1164;

library work;
use work.StateBus;

package InterruptHandler is
  procedure handleReset;
  procedure handleAddressCounterDone;
end package;

package body InterruptHandler is
  procedure handleReset is
  begin
    StateBus.setState(major => StateBus.systemInitialize, minor => StateBus.initialize);
  end procedure;

  procedure handleAddressCounterDone is
  begin
    if StateBus.isMajorState(StateBus.loadRomToRam) then
      StateBus.setState(major => StateBus.run, minor => StateBus.countUp);      
    elsif StateBus.isState(major => StateBus.run, minor => StateBus.countUp) then
      StateBus.setState(major => StateBus.run, minor => StateBus.countUpReset);
    elsif StateBus.isState(major => StateBus.run, minor => StateBus.countDown) then
      StateBus.setState(major => StateBus.run, minor => StateBus.countDownReset);        
    end if;
  end procedure;
end package body;
