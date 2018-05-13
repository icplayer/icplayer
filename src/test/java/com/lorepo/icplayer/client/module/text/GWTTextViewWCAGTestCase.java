package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.any;

import com.google.gwt.dom.client.AnchorElement;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.page.PageController;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextViewWCAGTestCase extends GwtTest {
	TextView textView = null;
	TextModel model = null;
	DraggableGapWidget gapWidget = null;
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
		this.textView = new TextView(this.model, false);
		GapInfo gapInfo = new GapInfo("sddsf1", 12, false, true, 0);
		
		this.gapWidget = new DraggableGapWidget(gapInfo, null);
		
		listenerMock = mock(ITextViewListener.class);
		this.textView.addListener(listenerMock);
		pageControllerMock = mock(PageController.class);
		this.textView.setPageController(pageControllerMock);
	}
	
	@Test
	public void testWCAGEnterPress() throws Exception {
		this.textView.addElement(this.gapWidget);
		
		this.textView.setWCAGStatus(true);
	
		this.textView.enter(false);
		
		verify(pageControllerMock, times(1)).speak(any(List.class));
	}
	
	@Test
	public void testWCAGTabPress() throws Exception {
		this.textView.addElement(this.gapWidget);
		
		this.textView.setWCAGStatus(true);
		KeyDownEvent eventMock = mock(KeyDownEvent.class); 
		
		this.textView.enter(false);
		this.textView.tab(eventMock);
		
		verify(pageControllerMock, times(2)).speak(any(List.class));
	}
	
	@Test
	public void testWCAGStatusFalse() throws Exception {
		this.textView.addElement(this.gapWidget);
		
		this.textView.setWCAGStatus(false);
		KeyDownEvent eventMock = mock(KeyDownEvent.class); 
		
		this.textView.enter(false);
		this.textView.tab(eventMock);
		
		verify(pageControllerMock, times(0)).speak(any(List.class));
	}
	
	@Test
	public void testWCAGDisableSpaceWhenNoGaps() throws Exception {
		this.model.setText("  ");
		
		this.textView.setWCAGStatus(true);
		KeyDownEvent eventMock = mock(KeyDownEvent.class); 
		
		this.textView.enter(false);
		this.textView.space(eventMock);
		
		verify(pageControllerMock, times(1)).speak(any(List.class));
	}
	
}
