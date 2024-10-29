library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library work;
use work.MyClass.all;

package MySubClass is
  subtype MySubClass is (protected) MyClass

    procedure printTag;
    procedure loadMemory(index: natural; data: unsigned(3 downto 0));

    function add(operand1, operand2 :integer) return integer;

  end protected MySubClass;
end package MySubClass;

package body MySubClass is
  type MySubClass is protected body

    constant tag: string := "TAG"; --Just an example of using a constant
                              
    type memoryFormat is array(0 to 3) of unsigned(3 downto 0);
    variable memory: memoryFormat := (others => (others => '0'));
                      
    procedure printTag is
    begin
      report MySubClass'path_name & tag;
    end procedure;

    procedure loadMemory(index: natural; data: unsigned(3 downto 0)) is
    begin
      memory(index) := data;
    end procedure;

    function add(operand1, operand2 :integer) return integer is
    begin
      return operand1 + operand2;
    end function;
    
  end protected body MySubClass;
end package body MySubClass;
