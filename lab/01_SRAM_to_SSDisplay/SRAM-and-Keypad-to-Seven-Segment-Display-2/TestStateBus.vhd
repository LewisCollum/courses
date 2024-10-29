library work;
use work.StateBus;

entity TestStateBus is
end entity TestStateBus;

architecture test of TestStateBus is
begin
  
  
  process is
  begin
    StateBus.setState(StateBus.run, StateBus.pause);
    
    if StateBus.isState(StateBus.run, StateBus.countUp) then
      report "Pass";
    elsif StateBus.isState(StateBus.run, StateBus.pause) then
      report "Pass";
    end if;
    
  end process;
end architecture test;
