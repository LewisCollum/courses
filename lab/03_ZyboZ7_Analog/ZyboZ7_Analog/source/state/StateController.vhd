library ieee;
use ieee.std_logic_1164.all;

library system_bus;
use system_bus.InterruptBus.InterruptBus;
use system_bus.InterruptBus.peripheralsAreBusy;
use system_bus.StateBus.all;

entity StateController is
  port(
    clock : in std_logic;
    interrupt : in InterruptBus;
    state : buffer StateBus);
end entity StateController;

architecture behavioral of StateController is
begin  
  process(clock, interrupt)
  begin  
    if interrupt.button.reset = '1' then
      state.system <= initialize;
      
    elsif rising_edge(clock) then
      case state.system is
        when initialize =>
          if not peripheralsAreBusy(interrupt) then
            state.system <= fetch;
          end if;
          
        when fetch =>
          if interrupt.button.sensorIncrement = '1' then
            case state.sensor is
              when light =>
                state.sensor <= pot;
              when pot =>
                state.sensor <= heat;
              when heat =>
                state.sensor <= custom;
              when custom =>
                state.sensor <= light;
            end case;
          end if;
 
          case state.clock is            
            when disabled =>
              if interrupt.button.clockEnable = '1' then
                state.clock <= enabled;
              end if;
            when enabled =>
              if interrupt.button.clockEnable = '0' then
                state.clock <= disabled;
              end if;
          end case;
      end case;
    end if;
  end process;  
end architecture behavioral; 
  
