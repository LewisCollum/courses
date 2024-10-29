library ieee;
use ieee.std_logic_1164.all;

library work;
use work.TimingUtilities.all;
use work.StateBus;
use work.InterruptBus;

entity TestStateController is
end entity;

architecture test of TestStateController is
  constant clockFrequency: positive := 50000000;
  constant clockPeriod: time := frequencyToPeriod(clockFrequency);
  signal clock: std_logic;
  signal interrupt: InterruptBus.InterruptRecord;
  signal state: StateBus.StateRecord;

begin
  generateClock(clock => clock, frequency => clockFrequency);

  main: process is
  begin
    wait for 10*clockPeriod;
    report "END OF TEST" severity failure;
  end process;

  unit: entity work.StateController
    port map(
      clock => clock,
      interrupt => interrupt,
      state => state);
  
end architecture;
