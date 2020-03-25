package com.lorepo.icplayer.client.module.choice;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTOptionViewTestCase extends GwtTest {
	
	@Test
	public void givenChoiceOptionWithoutParentIdSetWhenCreatingOptionViewThenElementIdIsNotSet()  {
		String expectedId = "";

		ChoiceOption module = new ChoiceOption("1", "", 1);
		OptionView view = new OptionView(module, false);

		String returnedId = view.getElement().getId();

		assertEquals(expectedId, returnedId);
	}

	@Test
	public void givenChoiceOptionWithParentIdSetWhenCreatingOptionViewThenElementIdIsSet()  {
		String expectedId = "parentID_ic_option_1";

		ChoiceOption module = new ChoiceOption("1","", 1);
		module.setParentId("parentID");
		OptionView view = new OptionView(module, false);

		String returnedId = view.getElement().getId();

		assertEquals(expectedId, returnedId);
	}
}
