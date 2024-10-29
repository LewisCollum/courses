library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
library vunit_lib;
context vunit_lib.vunit_context;

library lib; --Defined by when run.py script is run (>> python run.py)
use lib.MyClass.all; --Includes MyClass protected type from package MyClass

entity TestMyClass is
  generic(runner_cfg: string); --VUnit boilerplate code (ignore)
end entity TestMyClass;

architecture test of TestMyClass is

  --Your protected type instance that can be used in this block
  --You can also declare this instance in a package to act as
  --global variable (if you dare).
  
  shared variable myClassObject: MyClass;
  
begin

  testRunner: process
  begin
    test_runner_setup(runner, runner_cfg); --VUnit boilerplate code (ignore)
    
    while test_suite loop
      
      --information that pertains to all unit tests can go here (for VUnit).
      
      if run("Test load memory") then
        myClassObject.loadMemory(0, "1010"); --Using a procedure from our instance of MyClass
      end if;
      
    end loop;

    test_runner_cleanup(runner); --VUnit boilerplate code (ignore)
  end process;
  
end architecture test;
