library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library vunit_lib;
context vunit_lib.vunit_context;

library EnablerLibrary;

entity TestEnabler is
  generic (runner_cfg : string);
end entity;

architecture testbench of TestEnabler is

  signal input: std_logic;
  signal enable: std_logic;
  signal output: std_logic;
  
begin
  main : process
  begin
    test_runner_setup(runner, runner_cfg);

    while test_suite loop

      if run("Test_OutputIsInputWhenEnabled") then
        input <= '1';
        enable <= '1';

        wait for 1 ns;
        
        if output /= '1' then
          assert false report "Enabler output is incorrect";
        end if;
        

      elsif run("Test_OutputIsHighImpedanceWhenDisabled") then
        input <= '1';
        enable <= '0';

        if output /= 'Z' then
          assert false;
        end if;

      end if;
    end loop;

    test_runner_cleanup(runner);
  end process;

  unit: entity EnablerLibrary.Enabler
    port map(
      input => input,
      enable => enable,
      output => output);
  
end architecture;
