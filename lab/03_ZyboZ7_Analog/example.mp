input metauml;
beginfig(1);
  ySpace := 60;
  xSpace := 50;
  yStep := ySpace / 2;

  Class.StateController("StateController")()();

  Package.state("state")();
  Class.StateBus("StateBus")("#system: state.System")();
  Class.InterruptBus("InterruptBus")(
	  "#i2c: i2c.Interrupt",
	  "#lcd: lcd.Interrupt",
	  "#servo: servo.Interrupt")();
  Class.DataBus("DataBus")()();
  Package.system_bus("system_bus")(StateBus, InterruptBus, DataBus);
  leftToRight(10)(StateBus, InterruptBus, DataBus);

  Class.ICAdapter("I2CAdapter")()();
  Class.LCDAdapter("LCDAdapter")()();
  Package.adapter("adapter")(ICAdapter, LCDAdapter);
  leftToRight(10)(ICAdapter, LCDAdapter);
  
  
  Package.user("user")(StateController, state, system_bus, adapter);
  leftToRight(40)(state, StateController);
  topToBottom(40)(system_bus, StateController, adapter);

  drawObject(user);

  %link(dependency)(pathStepY(StateController.n, StateBus.s, yStep));
  %link(dependency)(pathStepY(StateController.n, InterruptBus.s, yStep));
endfig;
end
