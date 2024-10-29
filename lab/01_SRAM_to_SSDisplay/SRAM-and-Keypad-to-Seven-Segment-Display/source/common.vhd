library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

package common is

	type KeypadMatrix is array(0 to 4, 0 to 3) of unsigned(3 downto 0);

	type KeyNames is record
		a, b, c, d, e, f, zero, one, two, three, four, five, six, seven, eight, nine, none: unsigned(3 downto 0);
	end record KeyNames;
	
	constant key: KeyNames := (
	a => "1010",
	b => "1011",
	c => "1100",
	d => "1101",
	e => "1110",
	f => "1111",
	zero => "0000",
	one => "0001",
	two => "0010",
	three => "0011",
	four => "0100",
	five => "0101",
	six => "0110",
	seven => "0111",
	eight => "1000",
	nine => "1001",
	none => "ZZZZ");
	
	constant keypad : KeypadMatrix := 
	((key.a, key.b, key.c, key.d),
	(key.one, key.two, key.three, key.e),
	(key.four, key.five, key.six, key.f),
	(key.seven, key.eight, key.nine, key.none),
    (key.zero, key.none, key.none, key.none));

    constant clockFrequency: integer := 50000000;
	
end common;
