LIBRARY ieee;
USE ieee.std_logic_1164.all;

LIBRARY altera_mf;
USE altera_mf.all;

ENTITY Rom IS
	PORT
	(
		address		: IN STD_LOGIC_VECTOR (7 DOWNTO 0);
		clock		: IN STD_LOGIC  := '1';
		q		: OUT STD_LOGIC_VECTOR (15 DOWNTO 0)
	);
END Rom;


ARCHITECTURE SYN OF rom IS

	SIGNAL sub_wire0	: STD_LOGIC_VECTOR (15 DOWNTO 0);

	COMPONENT altsyncram
	GENERIC (
		clock_enable_input_a		: STRING;
		clock_enable_output_a		: STRING;
		init_file		: STRING;
		intended_device_family		: STRING;
		lpm_hint		: STRING;
		lpm_type		: STRING;
		numwords_a		: NATURAL;
		operation_mode		: STRING;
		outdata_aclr_a		: STRING;
		outdata_reg_a		: STRING;
		widthad_a		: NATURAL;
		width_a		: NATURAL;
		width_byteena_a		: NATURAL
	);
	PORT (
			address_a	: IN STD_LOGIC_VECTOR (7 DOWNTO 0);
			clock0	: IN STD_LOGIC ;
			q_a	: OUT STD_LOGIC_VECTOR (15 DOWNTO 0)
	);
	END COMPONENT;

BEGIN
	q    <= sub_wire0(15 DOWNTO 0);

	altsyncram_component : altsyncram
	GENERIC MAP (
		clock_enable_input_a => "BYPASS",
		clock_enable_output_a => "BYPASS",
		init_file => "rom.mif",
		intended_device_family => "Cyclone II",
		lpm_hint => "ENABLE_RUNTIME_MOD=NO",
		lpm_type => "altsyncram",
		numwords_a => 256,
		operation_mode => "ROM",
		outdata_aclr_a => "NONE",
		outdata_reg_a => "CLOCK0",
		widthad_a => 8,
		width_a => 16,
		width_byteena_a => 1
	)
	PORT MAP (
		address_a => address,
		clock0 => clock,
		q_a => sub_wire0
	);



END SYN;