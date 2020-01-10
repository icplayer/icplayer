package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.powermock.reflect.Whitebox;

import com.google.gwt.dom.client.AnchorElement;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextViewTestCase extends GwtTest {
	TextView textView = null;
	TextModel model = null;
	GapWidget gapWidget1 = null;
	InlineChoiceWidget gapWidget2 = null;
	DraggableGapWidget gapWidget3 = null;
	
	@Before
	public void setUp() {
		Document doc = Document.get();
		AnchorElement a1 = Document.get().createAnchorElement();
		
		doc.appendChild(a1);
		
		DivElement div1 = doc.createDivElement();
		div1.setId("sddsf1");
		a1.appendChild(div1);
		
		DivElement div2 = doc.createDivElement();
		div2.setId("sddsf2");
		a1.appendChild(div2);
		
		DivElement div3 = doc.createDivElement();
		div3.setId("sddsf3");
		div3.addClassName("someName");
		a1.appendChild(div3);

		this.model = new TextModel();
		this.textView = new TextView(this.model, false);
		GapInfo gapInfo1 = new GapInfo("sddsf1", 12, false, true, 0, false);
		InlineChoiceInfo gapInfo2 = new InlineChoiceInfo("sddsf2", "12", 0);
		GapInfo gapInfo3 = new GapInfo("sddsf3", 12, false, true, 0, false);
		
		this.gapWidget1 = new GapWidget(gapInfo1, null);
		this.gapWidget2 = new InlineChoiceWidget(gapInfo2, null, this.textView);
		this.gapWidget3 = new DraggableGapWidget(gapInfo3, null);
		
		this.textView.addElement(this.gapWidget1);
		this.textView.addElement(this.gapWidget2);
		this.textView.addElement(this.gapWidget3);
	}
	
	@Test
	public void testRemoveAllSelectionsWillRemoveClassElementsFromAllElements() throws Exception {
		this.gapWidget1.select();
		this.gapWidget2.select();
		this.gapWidget3.select();
		
		assertTrue(this.gapWidget1.isSelected());
		assertTrue(this.gapWidget2.isSelected());
		assertTrue(this.gapWidget3.isSelected());
		
		Whitebox.invokeMethod(this.textView, "removeAllSelections");
		
		assertFalse(this.gapWidget1.isSelected());
		assertFalse(this.gapWidget2.isSelected());
		assertFalse(this.gapWidget3.isSelected());		
	}


}
