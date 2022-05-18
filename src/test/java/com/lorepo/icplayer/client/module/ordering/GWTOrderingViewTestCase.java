package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.*;

import java.lang.reflect.Field;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.reflect.Whitebox;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.CellPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.module.text.AudioButtonWidget;

@PrepareForTest({OrderingView.class})
public class GWTOrderingViewTestCase extends GWTPowerMockitoTest {
	OrderingView orderingView = null;
	OrderingView orderingViewPMMock = null;
	OrderingModule model = null;
	CellPanel innerCellPanel = null;
	ItemWidget itemWidget1 = null, itemWidget2 = null, itemWidget3 = null;
	
	@Before
	public void beforeTest() throws Exception {
		this.model = Mockito.mock(OrderingModule.class);
		Mockito.when(this.model.getLangAttribute()).thenReturn("en");
		this.orderingView = Mockito.mock(OrderingView.class);
		Mockito.when(this.orderingView.getLang()).thenReturn("en");
		this.orderingViewPMMock = PowerMockito.spy(Whitebox.newInstance(OrderingView.class));
		innerCellPanel = new VerticalPanel();
		Whitebox.setInternalState(this.orderingViewPMMock, "innerCellPanel", this.innerCellPanel);
		Whitebox.setInternalState(this.orderingViewPMMock, "module", this.model);
		
		itemWidget1 = new ItemWidget(new OrderingItem(0, "string", "string", 0), this.model);
		itemWidget2 = new ItemWidget(new OrderingItem(1, "string", "string", 0), this.model);
		itemWidget3 = new ItemWidget(new OrderingItem(2, "\\audio{/file/serve/5698751586893824}", "string", 0), this.model);
		
		Whitebox.invokeMethod(this.orderingViewPMMock, "addWidget", itemWidget1);
		Whitebox.invokeMethod(this.orderingViewPMMock, "addWidget", itemWidget2);
		Whitebox.invokeMethod(this.orderingViewPMMock, "addWidget", itemWidget3);

	}
	
	@Test
	public void ifMathJaxIsNotRenderedShowCommandShouldSetAttribute () throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		Mockito.doCallRealMethod()
				.when(this.orderingView)
				.show();
		this.orderingView.show();
		
		Field shouldRefreshMathField = OrderingView.class.getDeclaredField("shouldRefreshMath");
		shouldRefreshMathField.setAccessible(true);
		
		assertTrue((Boolean)shouldRefreshMathField.get(this.orderingView));
		
	}
	
	@Test
	public void ifMathJaxCallRedneredCallbackThenMathJaxInAddonShouldBeRerendered() throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		Mockito.doCallRealMethod()
				.when(this.orderingView)
				.mathJaxIsLoadedCallback();
		Field shouldRefreshMathField = OrderingView.class.getDeclaredField("shouldRefreshMath");
		shouldRefreshMathField.setAccessible(true);
		shouldRefreshMathField.set(this.orderingView, true);
		
		this.orderingView.mathJaxIsLoadedCallback();
		
		Mockito.verify(this.orderingView, Mockito.times(1)).refreshMath();
		Field mathJaxIsLoadedField = OrderingView.class.getDeclaredField("mathJaxIsLoaded");
		mathJaxIsLoadedField.setAccessible(true);
		
		boolean mathJaxIsLoaded = (Boolean)mathJaxIsLoadedField.get(this.orderingView);
		
		assertTrue(mathJaxIsLoaded);
	}
	
	@Test
	public void ifMathJaxWasRenderedThenCallingShowShouldRerenderViewInstantly() throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		Mockito.doCallRealMethod()
			.when(this.orderingView)
			.show();
		Field mathJaxIsLoadedField = OrderingView.class.getDeclaredField("mathJaxIsLoaded");
		mathJaxIsLoadedField.setAccessible(true);
		mathJaxIsLoadedField.set(this.orderingView, true);
		
		this.orderingView.show();
		
		Mockito.verify(this.orderingView, Mockito.times(1)).refreshMath();
	}
	
	@Test
	public void escapeWillDeselectCurrentElement () throws Exception {
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);		
		Whitebox.invokeMethod(this.orderingViewPMMock, "escape", Mockito.mock(KeyDownEvent.class));
		
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
	}
	
	@Test
	public void ifIsExitingThenEnterWillDeselectCurrentElement () throws Exception {
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), true);
		
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
	}
	
	@Test 
	public void enterWithoutExitingWillSelectElement () throws Exception {
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter",  Mockito.mock(KeyDownEvent.class), false);
		
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
	}
	
	@Test
	public void spaceWillCallClickEventAndSelectNewItem() throws Exception {
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);	
		Whitebox.invokeMethod(this.orderingViewPMMock, "right", Mockito.mock(KeyDownEvent.class));
		
		assertTrue(this.itemWidget2.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
		class Clicked {
			boolean clicked = false;
			Clicked() {
				
			}
			
			public void click () throws Exception{
				Whitebox.invokeMethod(orderingViewPMMock, "moveWidget", 0, 1);
				this.clicked = true;
			}
			
			public boolean isClicked() {
				return clicked;
			}
		};
		
		final Clicked clicked = new Clicked();
		
		this.itemWidget2.addMouseUpHandler(new MouseUpHandler() {

			@Override
			public void onMouseUp(MouseUpEvent event) {
				try {
					clicked.click();
				} catch (Exception e){
					throw new RuntimeException();
				}
			}
		});
		
		Whitebox.invokeMethod(this.orderingViewPMMock, "space", Mockito.mock(KeyDownEvent.class));
		
		assertTrue(clicked.isClicked());
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
		assertTrue(this.itemWidget2.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
	}

	@Test
	public void spaceWillCallClickEventAndSelectNewItemWhenAudio() throws Exception {
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);
		Whitebox.invokeMethod(this.orderingViewPMMock, "right", Mockito.mock(KeyDownEvent.class));
		Whitebox.invokeMethod(this.orderingViewPMMock, "right", Mockito.mock(KeyDownEvent.class));

		assertTrue(this.itemWidget3.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
		class Clicked {
			boolean clicked = false;
			Clicked() {

			}

			public void click () throws Exception{
				Whitebox.invokeMethod(orderingViewPMMock, "moveWidget", 1, 2);
				this.clicked = true;
			}

			public boolean isClicked() {
				return clicked;
			}
		};

		final Clicked clicked = new Clicked();

		this.itemWidget3.addMouseUpHandler(new MouseUpHandler() {

			@Override
			public void onMouseUp(MouseUpEvent event) {
				try {
					clicked.click();
				} catch (Exception e){
					throw new RuntimeException();
				}
			}
		});

		Whitebox.invokeMethod(this.orderingViewPMMock, "space", Mockito.mock(KeyDownEvent.class));

		assertTrue(clicked.isClicked());
		assertTrue(this.itemWidget2.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
		assertTrue(this.itemWidget3.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
	}
	
	@Test
	public void moveWillSelectNextElement () throws Exception {
		Whitebox.setInternalState(this.orderingViewPMMock, "currentWCAGSelectedItemIndex", 1);
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);	
		Whitebox.invokeMethod(this.orderingViewPMMock, "move", 1);
		
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
		assertTrue(this.itemWidget2.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
		assertTrue(this.itemWidget3.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
		
	}
	
	@Test
	public void moveWillSelectElementBefore () throws Exception {
		Whitebox.setInternalState(this.orderingViewPMMock, "currentWCAGSelectedItemIndex", 1);
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);	
		Whitebox.invokeMethod(this.orderingViewPMMock, "move", -1);
		
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
		assertTrue(this.itemWidget2.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
		assertTrue(this.itemWidget3.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);		
	}
	
	@Test
	public void moveWillSelectFirstElementIfIsAboveElementsCount () throws Exception {
		Whitebox.setInternalState(this.orderingViewPMMock, "currentWCAGSelectedItemIndex", 2);
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);
		Whitebox.invokeMethod(this.orderingViewPMMock, "move", 1);
		
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
		assertTrue(this.itemWidget2.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
		assertTrue(this.itemWidget3.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
	}
	
	@Test 
	public void moveWillSelectLastElementIfIsBelowZero () throws Exception {
		Whitebox.setInternalState(this.orderingViewPMMock, "currentWCAGSelectedItemIndex", 0);
		Whitebox.invokeMethod(this.orderingViewPMMock, "enter", Mockito.mock(KeyDownEvent.class), false);
		Whitebox.invokeMethod(this.orderingViewPMMock, "move", -1);
		
		assertTrue(this.itemWidget1.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) > -1);
		assertTrue(this.itemWidget2.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
		assertTrue(this.itemWidget3.getStyleName().indexOf(OrderingView.WCAG_SELECTED_CLASS_NAME) == -1);
	}

}
