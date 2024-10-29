library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity SPI_master is
    generic (constant CntMax : integer:= 249);  -- (125 MHz/500 KHz) - 1 = 249
    Port ( clock             : in std_logic; -- board clock
           iData             : in std_logic_vector(7 downto 0); 
           iReset_n          : in std_logic;  
           iEna              : in std_logic;  
           oBusy             : out std_logic;         
           MOSI,SCK,SSN      : out std_logic
          );
end SPI_master;

architecture state_machine of SPI_master is

	type stateType is (Ready, Prepare, Write, Done, NotBusy);
    signal state    : stateType;	    
    signal cnt      : integer range 0 to 10; --use CntMax
    signal Bit_cnt  : integer;
	signal clock_en : std_logic;
    signal Data     : std_logic_vector(7 downto 0); -- byte to send to display

    
begin

Clock_Enable:
process(clock, iReset_n)
begin
  if iReset_n = '0' then 
	    cnt<=0;
	    clock_en<='0';
  elsif rising_edge(clock) then
	if cnt = 10 then      --Use CntMax 
		  clock_en <= '1';
		  cnt <=0;
	else
		  clock_en <= '0';
		  cnt <= cnt+1;
	end if;
end if;
end process;


SPI_state_machine:
process(clock, iReset_n, clock_en)
begin
if iReset_n ='0' then
    Bit_cnt  <= 7;
    MOSI      <= '1';
    SSN       <= '1';
    SCK       <= '0'; 
    oBusy     <= '0';
    state     <= Ready;        
elsif rising_edge(clock) and clock_en = '1' then 
    case state is 
        when Ready =>
          if iEna = '0' then
            state <= Ready;
          else 
            oBusy <= '1';
            SCK   <= '0';
            SSN   <= '0';  
            MOSI  <= iData(Bit_cnt);                                  
            state <= Prepare; 
          end if;  
        when Prepare =>        
            SCK   <= '1'; 
            Data  <= iData;  
            state <= Write;
        when Write =>
          if Bit_cnt /= 0 then 
            SCK      <= '0';
            Bit_cnt <= Bit_cnt - 1;
            MOSI     <= Data(Bit_cnt - 1);                                
            state    <= Prepare;                  
          else
            SCK      <= '0';                
            Bit_cnt <= 7;
            state    <= Done;                
          end if;
        when Done =>
            MOSI  <= '1';  
            oBusy <= '0'; 
            SSN  <= '1';
            state<= Ready;            
        when others =>
            state<= Ready;
    end case;             
end if;
   
end process;

end state_machine;
