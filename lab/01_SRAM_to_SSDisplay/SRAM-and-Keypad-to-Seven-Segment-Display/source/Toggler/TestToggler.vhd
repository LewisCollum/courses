library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library vunit_lib;
context vunit_lib.vunit_context;

library TogglerLibrary;

entity TestToggler is
  generic (runner_cfg : string);
end entity;

architecture testbench of TestToggler is

  signal data: std_logic;
  signal load: std_logic;
  signal toggle: std_logic;
  signal output: std_logic;
  
begin
  main : process
  begin
    test_runner_setup(runner, runner_cfg);

    while test_suite loop
      reset_checker_stat;
      if run("Test_DataLoadedIntoToggler") then
        
        data <= '1';
        load <= '1';
        wait for 1 ns;
        load <= '0';
        wait for 1 ns;

        if output /= '1' then
          assert false report "Toggler output is incorrect";
        end if;

      elsif run("Test_DataNotLoadedIntoToggler") then
        data <= '1';
        load <= '0';
        wait for 1 ns;

        if output = '1' then
          assert false report "Toggler output is incorrect";
        end if;

      elsif run("Test_LoadThenToggle") then
        data <= '1';
        wait for 1 ns;
        load <= '1';
        wait for 1 ns;
        load <= '0';
        wait for 1 ns;
        toggle <= '1';
        wait for 1 ns;
        toggle <= '0';
--        wait for 1 ns;
--        toggle <= '1';
        
        if output /= '0' then
          assert false report "Toggler output is incorrect";
        end if;
        
        
      end if;
    end loop;

    test_runner_cleanup(runner);
  end process;

  unit: entity TogglerLibrary.Toggler
    port map(
      data => data,
      load => load,
      toggle => toggle,
      output => output);
  
end architecture;
