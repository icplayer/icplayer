package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;
import com.google.gwt.dom.client.AnchorElement;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.module.text.mockup.TextViewMockupExtendFromOriginal;
import com.lorepo.icplayer.client.page.PageController;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextViewWCAGTestCase extends GwtTest {
	TextView textView = null;
	TextModel model = null;
	DraggableGapWidget gapWidget = null;
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
		
		DivElement div2 = doc.createDivElement();
		div2.setId("sddsf2");
		div2.addClassName("someOtherName");
		a1.appendChild(div2);

		this.model = new TextModel();
		this.textView = new TextViewMockupExtendFromOriginal(this.model, false);
		GapInfo gapInfo = new GapInfo("sddsf1", 12, false, true, 0);
		
		this.gapWidget = new DraggableGapWidget(gapInfo, null);
		
		listenerMock = mock(ITextViewListener.class);
		this.textView.addListener(listenerMock);
		pageControllerMock = mock(PageController.class);
		this.textView.setPageController(pageControllerMock);
		
		InlineChoiceInfo choiceInfo = new InlineChoiceInfo("sddsf2", "answer", 1);
		choiceInfo.addDistractor("option 2");
		choiceInfo.addDistractor("option 3");
		this.choiceWidget = new InlineChoiceWidget(choiceInfo, listenerMock, this.textView);
	}
	
	@Test
	public void testWCAGEnterPress() throws Exception {
		this.textView.addElement(this.gapWidget);
		
		this.textView.setWCAGStatus(true);
	
		this.textView.enter(mock(KeyDownEvent.class), false);
		
		verify(pageControllerMock, times(1)).speak(any(List.class));
	}
	
	@Test
	public void testWCAGTabPress() throws Exception {
		this.textView.addElement(this.gapWidget);
		
		this.textView.setWCAGStatus(true);
		KeyDownEvent eventMock = mock(KeyDownEvent.class); 
		
		this.textView.enter(mock(KeyDownEvent.class), false);
		this.textView.tab(eventMock);
		
		verify(pageControllerMock, times(2)).speak(any(List.class));
	}
	
	@Test
	public void testWCAGStatusFalse() throws Exception {
		this.textView.addElement(this.gapWidget);
		
		this.textView.setWCAGStatus(false);
		KeyDownEvent eventMock = mock(KeyDownEvent.class); 
		
		this.textView.enter(mock(KeyDownEvent.class), false);
		this.textView.tab(eventMock);
		
		verify(pageControllerMock, times(0)).speak(any(List.class));
	}
	
	@Test
	public void testWCAGDisableSpaceWhenNoGaps() throws Exception {
		this.model.setText("  ");
		
		this.textView.setWCAGStatus(true);
		KeyDownEvent eventMock = mock(KeyDownEvent.class); 
		
		this.textView.enter(mock(KeyDownEvent.class), false);
		this.textView.space(eventMock);
		
		verify(pageControllerMock, times(1)).speak(any(List.class));
	}
	
	@Test
	public void testDropdownKeyboardControlsInWCAG() throws Exception {
		InlineChoiceWidget choiceMock = mock(InlineChoiceWidget.class);
		when(choiceMock.getGapType()).thenReturn("dropdown");
		when(choiceMock.getWCAGTextValue()).thenReturn("content");
		this.textView.addElement(choiceMock);
		
		this.textView.setWCAGStatus(true);
		KeyDownEvent eventMock = mock(KeyDownEvent.class); 
		
		this.textView.enter(mock(KeyDownEvent.class), false);
		this.textView.tab(eventMock);
		this.textView.down(eventMock);
		this.textView.right(eventMock);
		
		verify(choiceMock, times(2)).changeSelected(true);
		verify(choiceMock, times(0)).changeSelected(false);
		
		this.textView.up(eventMock);
		this.textView.left(eventMock);
		
		verify(choiceMock, times(2)).changeSelected(true);
		verify(choiceMock, times(2)).changeSelected(false);
	}
	
}
