package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doNothing;

import com.google.gwt.dom.client.AnchorElement;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.module.text.mockup.TextViewMockupExtendFromOriginal;
import com.lorepo.icplayer.client.page.PageController;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTInlineChoiceWCAGTestCase extends GwtTest {
	TextView textView = null;
	TextModel model = null;
	InlineChoiceWidget choiceWidget = null;
	ITextViewListener listenerMock = null;
	PageController pageControllerMock = null;
	
	@Before
	public void setUp() {
		Document doc = Document.get();
		AnchorElement a1 = doc.createAnchorElement();
		
		doc.appendChild(a1);
		
		DivElement div1 = doc.createDivElement();
		div1.setId("sddsf1");
		div1.addClassName("someName");
		a1.appendChild(div1);

		this.model = new TextModel();
		this.textView = new TextViewMockupExtendFromOriginal(this.model, false);
		
		listenerMock = mock(ITextViewListener.class);		
		this.textView.addListener(listenerMock);
		pageControllerMock = mock(PageController.class);
		this.textView.setPageController(pageControllerMock);
		InlineChoiceInfo choiceInfo = new InlineChoiceInfo("sddsf1", "answer", 1);
		choiceInfo.addDistractor("option 2");
		choiceInfo.addDistractor("option 3");
		this.choiceWidget = new InlineChoiceWidget(choiceInfo, listenerMock, this.textView);
	}
	
	@Test
	public void testDropdownChangeSelected() throws Exception {
		InlineChoiceWidget choiceSpy = spy(this.choiceWidget);
		doNothing().when(choiceSpy).fireChangeEvent();
		doReturn(0).when(choiceSpy).getSelectedIndex();
		doReturn(4).when(choiceSpy).getItemCount();
		doNothing().when(choiceSpy).setSelectedIndex(any(Integer.class));
		
		choiceSpy.setWorkMode();
		choiceSpy.select();
		
		choiceSpy.changeSelected(true);
		
		verify(choiceSpy, times(1)).fireChangeEvent();
		
		choiceSpy.deselect();
		
		choiceSpy.changeSelected(true);
		
		verify(choiceSpy, times(1)).fireChangeEvent();
	}
	
	@Test
	public void testDropdownChangeSelectedOutOfBounds() throws Exception {
		InlineChoiceWidget choiceSpy = spy(this.choiceWidget);
		doNothing().when(choiceSpy).fireChangeEvent();
		doReturn(0).when(choiceSpy).getSelectedIndex();
		doReturn(4).when(choiceSpy).getItemCount();
		doNothing().when(choiceSpy).setSelectedIndex(any(Integer.class));
		
		choiceSpy.setWorkMode();
		choiceSpy.select();
		
		choiceSpy.changeSelected(true);
		choiceSpy.changeSelected(false);
		
		verify(choiceSpy, times(1)).fireChangeEvent();
		
		doReturn(3).when(choiceSpy).getSelectedIndex();
		
		choiceSpy.changeSelected(true);
		choiceSpy.changeSelected(false);
		verify(choiceSpy, times(2)).fireChangeEvent();
	}

}
