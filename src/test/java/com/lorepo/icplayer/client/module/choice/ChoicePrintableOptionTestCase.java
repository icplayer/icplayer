package com.lorepo.icplayer.client.module.choice;

import com.lorepo.icplayer.client.printable.Printable.PrintableStateMode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.powermock.reflect.Whitebox;

import java.util.Arrays;

@RunWith(PowerMockRunner.class)
public class ChoicePrintableOptionTestCase {

	@Test(expected = IllegalArgumentException.class)
	@PrepareForTest(PrintableStateMode.class)
	public void toPrintableDOMElementWhenNotSupportedPrintableStateMode()
			throws Exception {
		ChoiceOption choiceOption = Mockito.mock(ChoiceOption.class);
		ChoicePrintableOption printableOption
				= new ChoicePrintableOption(choiceOption);

		PrintableStateMode[] origModes = PrintableStateMode.values();

		PrintableStateMode notSupportedMode
				= PowerMockito.mock(PrintableStateMode.class);
		Whitebox.setInternalState(notSupportedMode, "name", "-");
		Whitebox.setInternalState(notSupportedMode, "ordinal", origModes.length);
		PrintableStateMode[] newModes = Arrays.copyOf(
				origModes, origModes.length+1);
		newModes[newModes.length-1] = notSupportedMode;

		PowerMockito.mockStatic(PrintableStateMode.class);
		PowerMockito.when(PrintableStateMode.values()).thenReturn(newModes);

		printableOption.toPrintableDOMElement(notSupportedMode);
	}

	@Test(expected = NullPointerException.class)
	public void toPrintableDOMElementWhenNullAsPrintableStateMode()
			throws Exception {
		ChoiceOption choiceOption = Mockito.mock(ChoiceOption.class);
		ChoicePrintableOption printableOption
				= new ChoicePrintableOption(choiceOption);
		printableOption.toPrintableDOMElement(null);
	}
}
