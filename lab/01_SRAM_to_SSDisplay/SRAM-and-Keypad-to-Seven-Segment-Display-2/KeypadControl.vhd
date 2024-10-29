library ieee;
use ieee.std_logic_1164.all;

package KeypadControl is

  type operationNames is (run, edit);
  type directionNames is (up, down);
  type memoryToEditNames is (address, data);

  type KeypadControlRecord is record
    operation: operationNames;
    direction: directionNames;
    memoryToEdit: memoryToEditNames;
    pause: std_logic;
    sending: std_logic;
  end record KeypadControlRecord;

  shared variable control: KeypadControlRecord;
  
end package KeypadControl;
