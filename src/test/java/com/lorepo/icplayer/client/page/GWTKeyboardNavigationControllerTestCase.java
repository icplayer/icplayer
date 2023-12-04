package com.lorepo.icplayer.client.page;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import static org.mockito.Mockito.spy;
import org.powermock.reflect.Whitebox;

import com.google.gwt.dom.client.Style.Visibility;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.RootPanel;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.utils.events.Browser;
import com.googlecode.gwt.test.utils.events.EventBuilder;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.PlayerEntryPoint;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.button.ButtonModule;
import com.lorepo.icplayer.client.module.button.ButtonModule.ButtonType;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import com.lorepo.icplayer.client.module.choice.ChoiceOption;
import com.lorepo.icplayer.client.page.KeyboardNavigationController.PresenterEntry;
import com.lorepo.icplayer.client.ui.PlayerView;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTKeyboardNavigationControllerTestCase extends GWTPowerMockitoTest {
	KeyboardNavigationController controller = null;
	PageController headerPageController = null;
	PageController mainPageController = null;
	PageController footerPageController = null;
	
	private static long idCounter = 0;

	PlayerController playerController = null;
	PlayerView playerViewMock = null;
	
	@Before
	public void setUp () throws Exception {
		GWTKeyboardNavigationControllerTestCase.idCounter = 0;
		Content content = new Content();
		PlayerEntryPoint playerEntryPoint = new PlayerEntryPoint();
		
		Page header = new Page("header", "header");
		Page main = new Page("main", "main");
		Page footer = new Page("footer", "footer");
		
		this.playerViewMock = Mockito.mock(PlayerView.class);
		this.playerController = new PlayerController(content, this.playerViewMock, false, playerEntryPoint);
		this.controller = Whitebox.getInternalState(this.playerController, "keyboardController");
		PlayerController pcSpy = spy(this.playerController);
		Whitebox.setInternalState(pcSpy, "playerView", this.playerViewMock);

		this.headerPageController = new PageController(this.playerController);
		this.mainPageController = new PageController(this.playerController);
		this.footerPageController = new PageController(this.playerController);
		
		PageView headerPageView = new PageView("header");
		PageView mainPageView = new PageView("main");
		PageView footerPageView = new PageView("footer");

		header.addModule(this.generateButton());
		header.addModule(this.generateButton());
		
		main.addModule(this.generateButton());
		main.addModule(this.generateButton());
		main.addModule(this.generateChoice());
		main.addModule(this.generateChoice());
		
		footer.addModule(this.generateButton());
		footer.addModule(this.generateButton());
		
		headerPageController.setView(headerPageView);
		
		// instead of pageController.setPage()
		Whitebox.setInternalState(headerPageController, "currentPage", header);
		headerPageView.setPage(header);
		Whitebox.invokeMethod(headerPageController, "initModules");
		
		
		mainPageController.setView(mainPageView);
		Whitebox.setInternalState(mainPageController, "currentPage", main);
		mainPageView.setPage(main);
		Whitebox.invokeMethod(mainPageController, "initModules");
		
		footerPageController.setView(footerPageView);
		Whitebox.setInternalState(footerPageController, "currentPage", footer);
		footerPageView.setPage(main);
		Whitebox.invokeMethod(footerPageController, "initModules");
		
		
		this.controller.addHeaderToNavigation(this.headerPageController);
		this.controller.addMainToNavigation(this.mainPageController);
		this.controller.addFooterToNavigation(this.footerPageController);
		
		
	}
	
	@Test
	public void onStartFirstVisibleElementWillBeSelected() {
		this.headerPageController.getWidgets().get("button1").getElement().getStyle().setVisibility(Visibility.HIDDEN);
		
		Event event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		assertTrue(this.headerPageController.getWidgets().get("button1").getElement().getClassName().indexOf("ic_selected_module") == -1);
		assertTrue(this.headerPageController.getWidgets().get("button2").getElement().getClassName().indexOf("ic_selected_module") > -1);
	}
	
	@Test
	public void onEnterSelectedElementWillBeActivated () {
		Event event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		Event eventActivate = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(false)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), eventActivate);
		
		assertTrue(this.headerPageController.getWidgets().get("button2").getElement().getClassName().indexOf("ic_active_module") == -1);
	}
	
	
	@Test
	public void ifShiftEnterWasClickedAgainThenModeWillBeTurnedOff () {
		Event event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		
		assertTrue(this.headerPageController.getWidgets().get("button1").getElement().getClassName().indexOf("ic_selected_module") == -1);
	}
	
	@Test
	public void tabWillMoveToNextModuleWhichReturnsTrueInCanSelect () {
		this.headerPageController.getWidgets().get("button2").getElement().getStyle().setVisibility(Visibility.HIDDEN);
		
		Event event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_TAB)
				.build();
		Browser.dispatchEvent(RootPanel.get(), event);
		
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_TAB)
				.build();
		Browser.dispatchEvent(RootPanel.get(), event);
		
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_TAB)
				.build();
		Browser.dispatchEvent(RootPanel.get(), event);
		
		assertTrue(this.mainPageController.getWidgets().get("choice5").getElement().getClassName().indexOf("ic_selected_module") > -1);
		
	}
	
	@Test
	public void shiftTabWillMoveToPreviousModule () {
		this.footerPageController.getWidgets().get("button8").getElement().getStyle().setVisibility(Visibility.HIDDEN);
		
		Event event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_TAB)
				.setShiftKey(true)
				.build();
		Browser.dispatchEvent(RootPanel.get(), event);
		
		assertTrue(this.footerPageController.getWidgets().get("button7").getElement().getClassName().indexOf("ic_selected_module") > -1);
		
	}
	
	@Test
	public void keyboardControllerWillManageProperlyKeyDown () {
		// Prepare
		List<PresenterEntry> presenters = new ArrayList<PresenterEntry>();
		PresenterEntry mock1 = this.controller.new PresenterEntry(Mockito.mock(IWCAGPresenter.class), "1", false);
		PresenterEntry mock2 = this.controller.new PresenterEntry(Mockito.mock(IWCAGPresenter.class), "2",false);
		PresenterEntry mock3 = this.controller.new PresenterEntry(Mockito.mock(IWCAGPresenter.class), "3", false);
		presenters.add(mock1);
		presenters.add(mock2);
		presenters.add(mock3);
		
		Mockito.when(mock1.presenter.getWCAGController())
			.thenReturn(Mockito.mock(IWCAG.class));
		
		Mockito.when(mock1.presenter.isSelectable(true)).thenReturn(true);
		Mockito.when(mock1.presenter.isSelectable(false)).thenReturn(true);
		
		Whitebox.setInternalState(this.controller, "presenters", presenters);
		Whitebox.setInternalState(this.controller, "presentersOriginalOrder", presenters);
		
		Event event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		//Do
		
		//Activate
		event = EventBuilder.create(Event.ONKEYDOWN)
		.setKeyCode(KeyCodes.KEY_ENTER)
		.setShiftKey(false)
		.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//Enter
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(false)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		
		//up
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_UP)
				.setShiftKey(false)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//down
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_DOWN)
				.setShiftKey(false)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//left
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_LEFT)
				.setShiftKey(false)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//right
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_RIGHT)
				.setShiftKey(false)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//tab
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_TAB)
				.setShiftKey(false)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//shiftTab
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_TAB)
				.setShiftKey(true)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//space
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(32)
				.setShiftKey(false)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		//custom
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(22)
				.setShiftKey(false)
				.build();
		
		Browser.dispatchEvent(RootPanel.get(), event);
		
		//escape
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ESCAPE)
				.setShiftKey(false)
				.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//Activate it one more time
		event = EventBuilder.create(Event.ONKEYDOWN)
		.setKeyCode(KeyCodes.KEY_ENTER)
		.setShiftKey(false)
		.build();

		Browser.dispatchEvent(RootPanel.get(), event);
		
		//exit - shift + enter
		event = EventBuilder.create(Event.ONKEYDOWN)
				.setKeyCode(KeyCodes.KEY_ENTER)
				.setShiftKey(true)
				.build();
		Browser.dispatchEvent(RootPanel.get(), event);
		
		//Then check: 
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).up(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).down(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).left(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).right(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).escape(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).tab(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).space(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(3)).enter(Mockito.any(KeyDownEvent.class), Mockito.eq(false));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).enter((Mockito.any(KeyDownEvent.class)), Mockito.eq(true));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).shiftTab(Mockito.any(KeyDownEvent.class));
		Mockito.verify(mock1.presenter.getWCAGController(), Mockito.times(1)).customKeyCode(Mockito.any(KeyDownEvent.class));
	}
	
	private ChoiceModel generateChoice() {
		ChoiceModel module = new ChoiceModel();
		module.setId("choice" + ++GWTKeyboardNavigationControllerTestCase.idCounter);
		module.removeAllOptions();
		module.addOption(new ChoiceOption("1", "A", 1));
		module.addOption(new ChoiceOption("2", "B", 0));
		return module;
	}
	
	private ButtonModule generateButton () {
		ButtonModule buttonModule = new ButtonModule();
		buttonModule.setId("button" + ++GWTKeyboardNavigationControllerTestCase.idCounter);
		buttonModule.setType(ButtonType.checkAnswers);
		
		return buttonModule;
	}
	
}
