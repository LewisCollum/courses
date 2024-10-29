library ieee;
use ieee.std_logic_1164.all;

library work;
use work.KeypadControl.KeypadControlRecord;

package InterruptBus is

  type InterruptRecord is record
    resetActiveLow: std_logic;
    isAddressCounterDone: std_logic;
    keypadControl: KeypadControlRecord;
  end record InterruptRecord;

  shared variable interrupt: InterruptRecord;

end package InterruptBus;
