library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

--I will use the word "class" in place of the VHDL term, "protected type."

--The class must be nested inside a package (or an entity, but this makes your
--code disorganized).

--Choose any package name you like. I chose to keep the package name
--the same as the class name since there will only be a single class
--declaration in this file (personal choice).

--You should not include more than one class declaration per package.
--If you want many protected types under the same scope name, then make
--a library with packages for each class (see run.py for details about
--library creation)

package MyClass is
  type MyClass is protected
    
    --insert procedures or functions.
    
    --PUBLIC VARIABLE DECLARATION
    --Not allowed!
    --Use a data structure instead (in VHDL terms, a "record").
    --See MyDataStructure.vhd for more details.

    --PUBLIC METHODS DECLARATION
    
    --Procedures do not return a type.
    procedure printTag;
    procedure loadMemory(index: natural; data: unsigned(3 downto 0));

    --[Pure] functions can only read/write signals/variables in the
    --parameter list. (function with no "side effects")
    function add(operand1, operand2 :integer) return integer;

    --[Impure] functions can read/write signals in its
    --scope. (function with "side effects")

  end protected MyClass;
end package MyClass;

package body MyClass is
  type MyClass is protected body

    constant tag: string := "TAG"; --Just an example of using a constant
                              
    type memoryFormat is array(0 to 3) of unsigned(3 downto 0);
    variable memory: memoryFormat := (others => (others => '0'));
                      
    procedure printTag is
    begin
      report MyClass'path_name & tag;
    end procedure;

    procedure loadMemory(index: natural; data: unsigned(3 downto 0)) is
    begin
      memory(index) := data;
    end procedure;

    function add(operand1, operand2 :integer) return integer is
    begin
      return operand1 + operand2;
    end function;
    
  end protected body MyClass;
end package body MyClass;
