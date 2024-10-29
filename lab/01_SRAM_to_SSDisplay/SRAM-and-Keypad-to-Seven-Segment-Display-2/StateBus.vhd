library ieee;
use ieee.std_logic_1164.all;

package StateBus is
  
  type majorType is (systemInitialize, loadRomToRam, run, edit);
  type minorType is (
    initialize, --run
    countUp, --run
    countDown, --run
    countUpReset, --run
    countDownReset, --run
    data, --edit
    address, --edit
    pause, --run, edit
    none --systemInitialize, loadRomToRam
  );

  type StateRecord is record
    major: majorType;
    minor: minorType;
  end record StateRecord;

  shared variable state: StateRecord := (
    major => systemInitialize,
    minor => none);
  
  procedure setState(major: majorType; minor: minorType);
  impure function isState(major: majorType; minor: minorType) return boolean;
  impure function isMajorState(major: majorType) return boolean;
  
end package StateBus;


package body StateBus is
  
  procedure setState(major: majorType; minor: minorType) is
  begin
    state.major := major;
    state.minor := minor;
  end procedure setState;

  impure function isState(major: majorType; minor: minorType) return boolean is
  begin
    return state.major = major and state.minor = minor;
  end function isState;

  impure function isMajorState(major: majorType) return boolean is
  begin
    return state.major = major;
  end function isMajorState;

end package body StateBus;
