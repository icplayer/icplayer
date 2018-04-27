package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import com.google.gwt.dom.client.AnchorElement;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.OptionElement;
import com.google.gwt.dom.client.SelectElement;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextShowAnswersTestCase extends GwtTest {
	TextView textView = null;
	TextModel model = null;
	InlineChoiceWidget gapWidget1 = null;
	
	@Before
	public void setUp() {
		this.model = new TextModel();
		this.textView = new TextView(this.model, false);
		
		Document doc = Document.get();
		AnchorElement a1 = Document.get().createAnchorElement();
		
		doc.appendChild(a1);
		
		SelectElement select1 = doc.createSelectElement();
		
		OptionElement option1 = doc.createOptionElement();
		option1.setText("option1");
		
		OptionElement option2 = doc.createOptionElement();
		option1.setText("12");
		
		select1.add(option1, null);
		select1.add(option2, null);
		select1.setId("gap1");
		a1.appendChild(select1);
		
		InlineChoiceInfo gapInfo1 = new InlineChoiceInfo("gap1", "12", 0);
		
		this.gapWidget1 = new InlineChoiceWidget(gapInfo1, null, this.textView);
		
		this.textView.addElement(this.gapWidget1);
	}
	
	@Test
	public void testNoChoiceMade() {
		// user haven't chosen an option
		this.gapWidget1.setShowErrorsMode(true);
		
		boolean isDefaultClass = this.gapWidget1.getElement().getClassName().contains("default");
		
		assertTrue(isDefaultClass);
	}
	
	@Test
	public void testCorrectChoiceMade() {
		// user have chosen correct option
		this.gapWidget1.setItemSelected(1, true);
		
		System.out.println(this.gapWidget1.getTextValue() + " wartosc");
		System.out.println(this.gapWidget1.getValue(0)+ " " + this.gapWidget1.getValue(1));
		
		this.gapWidget1.setShowErrorsMode(true);
		
		boolean isDefaultClass = this.gapWidget1.getElement().getClassName().contains("correct");
		
		assertTrue(isDefaultClass);
	}

}
