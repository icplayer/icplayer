package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.ui.ResetButton;
import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icf.utils.NavigationModuleIndentifier;
import com.lorepo.icplayer.client.PlayerEntryPoint;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IEnterable;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.button.ButtonModule;
import com.lorepo.icplayer.client.module.button.ButtonView;
import com.lorepo.icplayer.client.module.button.ButtonModule.ButtonType;

/*
	Usage:
		Module:
			- Presenter must implement IWCAGPresenter interface and must return IWCAG element
		Addon:
			- Addon must have keyboardController(keyCode, isShiftDown) function in presenter
*/
public final class KeyboardNavigationController implements IKeyboardNavigationController {
	public static String SELECTED_CLASS = "ic_selected_module";
	public static String ACTIVE_CLASS = "ic_active_module";
	
	private boolean moduleIsActivated = false;
	private boolean isInitiated = false;
	private List<PresenterEntry> presentersOriginalOrder = new ArrayList<PresenterEntry>();
	private List<PresenterEntry> presenters = new ArrayList<PresenterEntry>();
	private boolean modeOn = false;
	private PlayerEntryPoint entryPoint;
	private PageController mainPageController;
	private JavaScriptObject invisibleInputForFocus = null;
	private int actualSelectedModuleIndex = 0;
	private HandlerRegistration keyDownHandler = null;
	private JavaScriptObject messageHandler = null;

	private PageController headerController = null;
	private PageController footerController = null;
	
	private boolean isWCAGSupportOn = false;
	private boolean isPresentersInit = false;
	
	private boolean receivedParentScrollAndOffset = false;
	private int parentScrollY = 0;
	private int iframeOffsetTop = 0;
	private int parentWindowHeight = 0;
	private boolean isNVDAActivate = false;

	//state
	private PresenterEntry savedEntry = null;

	private static final int KEY_SPACE_BAR = 32;
	
	class PresenterEntry {
		public IWCAGPresenter presenter = null;
		public String id;
		public boolean common = false;
		private String area = "main";  // header, main, footer TODO create ENUM

		PresenterEntry (IWCAGPresenter presenter, String id, boolean isCommon) {
			this.presenter = presenter;
			this.common = isCommon;
			this.id = id;
		}

		public boolean isCommon() {
			return this.common;
		}
		
		public void setArea (String area) {
			this.area = area;
		}
		
		public String getArea () {
			return this.area;
		}
	}
	
	public KeyboardNavigationController() {
		this.waitOnMessages(this);
	}

	private void callEnterPressEvent () {
		DomEvent.fireNativeEvent(Document.get().createKeyDownEvent(false, false, true, false, KeyCodes.KEY_ENTER), RootPanel.get());
	}

	private native void waitOnMessages (KeyboardNavigationController x) /*-{
		var receiveMessage = function (event) {
			try {
				var eventData = JSON.parse(event.data);
				if (eventData.type == "SCROLL_Y_AND_OFFSET") {
					x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::parentScrollY = eventData.scrollTop;
					x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::iframeOffsetTop = eventData.offsetTop;
					x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::parentWindowHeight = eventData.viewHeight;
					x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::receivedParentScrollAndOffset = true;
				};

				if (eventData.type !== "EXTERNAL_KEYDOWN_WATCHER") {
					return;
				}

				var keyCode = eventData.keyCode;
				var isShift = eventData.isShift;
				if (keyCode == 13 && isShift) {
					x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::callEnterPressEvent()();
				}
			} catch (e) {
			}
		}
		x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::messageHandler = receiveMessage;
		$wnd.addEventListener("message", receiveMessage);

	}-*/;

	private void initialSelect() {
		if (this.getPresenters().size() == 0 || this.actualSelectedModuleIndex == -1) {
			this.modeOn = false;
			this.actualSelectedModuleIndex = 0;
			return;
		}
		int currentSelectedModuleIndex = this.actualSelectedModuleIndex;
		if (!this.getPresenters().get(this.actualSelectedModuleIndex).presenter.isSelectable(this.isWCAGOn())) { //If first is not selectable
			this.setIndexToNextModule();
			if (this.actualSelectedModuleIndex == currentSelectedModuleIndex) { //And others modules too, then turn off navigation
				this.modeOn = false;
				return;
			}

		}
		selectCurrentModule();
		isInitiated = true;
	}
	
	// Sometimes modules can remove classes just activated or selected modules. We must restore them.
	private void restoreClasses() {
		if (!modeOn) {
			return;
		}
		this.selectCurrentModule();
	}

	private boolean isResetButton() {
		if (this.getPresenters().get(this.actualSelectedModuleIndex).presenter instanceof IButton) {
			try {
				PresenterEntry presenterEntry = this.getPresenters().get(this.actualSelectedModuleIndex);
				IPresenter iPresenter = (IPresenter) presenterEntry.presenter;
				ButtonModule buttonModule = (ButtonModule) iPresenter.getModel();
				ButtonType type = buttonModule.getType();
				
				return type == ButtonType.reset;
			} catch (Exception e) {
				return false;
			}
		}
		return false;
	}
	
	private boolean isModuleButton() {
		if (this.isResetButton()) {
			return false;
		}

		if (this.getPresenters().get(this.actualSelectedModuleIndex).presenter instanceof IButton) {
			return true;
		}
		
		if (this.getPresenters().get(this.actualSelectedModuleIndex).presenter instanceof AddonPresenter) {	//Addon can be button, so AddonPresenter contains list of buttons
			AddonPresenter presenter = (AddonPresenter) this.getPresenters().get(this.actualSelectedModuleIndex).presenter;
			return presenter.isButton();
		}
		
		return false;
	}
	
	private boolean isModuleEnterable() {
		if (this.getPresenters().get(this.actualSelectedModuleIndex).presenter instanceof IEnterable) {
			IEnterable presenter = (IEnterable) this.getPresenters().get(this.actualSelectedModuleIndex).presenter;
			return presenter.isEnterable();
		}
		
		if (this.getPresenters().get(this.actualSelectedModuleIndex).presenter instanceof AddonPresenter) {
			AddonPresenter presenter = (AddonPresenter) this.getPresenters().get(this.actualSelectedModuleIndex).presenter;
			return presenter.isEnterable();
		}
		
		return true;
	}
	
	private boolean isModuleDeactivationBlocked() {
		if (this.getPresenters().get(this.actualSelectedModuleIndex).presenter instanceof AddonPresenter) {
			AddonPresenter presenter = (AddonPresenter) this.getPresenters().get(this.actualSelectedModuleIndex).presenter;
			return presenter.isDeactivationBlocked();
		}
		
		return false;
	}
	
	private void setWCAGModulesStatus (boolean isOn) {
		for (PresenterEntry p: this.presenters) {
			p.presenter.getWCAGController();

			if (p.presenter.getWCAGController() instanceof IWCAGModuleView) {
				IWCAGModuleView view = (IWCAGModuleView) p.presenter.getWCAGController();
				view.setWCAGStatus(isOn);
			}
		}
	}

	private native void sendParentScrollAndOffsetRequest() /*-{
		$wnd.top.postMessage("REQUEST_SCROLL_Y_AND_OFFSET","*");
	}-*/;
	
	public void switchKeyboard(boolean enable) {
		this.modeOn = enable;
		if (this.modeOn) {
			this.setFocusOnInvisibleElement();
			if (!this.isInitiated) {
				this.initialSelect();
			} else {
				this.selectCurrentModule();
			}
		} else {
			this.deselectCurrentModule();
		}
	}

	private native void setRoleApplication(boolean isSet, boolean isNVDAActivated) /*-{
		var $_ = $wnd.$;
		if( isSet ) {
			$_('#_icplayer').attr("aria-hidden","true");

			if (!isNVDAActivated) {
				$_('[role]').each(function(){
					var $self = $_(this);
					var roleValue = $self.attr('role');
					$self.attr('ic_role_off',roleValue);
					$self.attr('role','presentation');
				});
			} else {
				$_('[ic_role_off]').each(function(){
					var $self = $_(this);
					$self.attr('role', 'presentation');
				});
			}

			$_('body').attr("role","application");
			if ($wnd.parent) { 
				$wnd.parent.postMessage("ic_disableAria","*"); 
			}
		} else {
			$_('#_icplayer').removeAttr("aria-hidden");

			if (!isNVDAActivated) {
				$_('[ic_role_off]').each(function(){
					var $self = $_(this);
					var roleValue = $self.attr('ic_role_off');
					$self.attr('role',roleValue);
					$self.removeAttr('ic_role_off');
				});
			} else {
				$_('[role]').each(function(){
					var $self = $_(this);
					var roleValue = $self.attr('ic_role_off');
					if (roleValue && roleValue !== 'application') {
						$self.attr('ic_role_off', roleValue);
						$self.removeAttr('role');
					}
				});
			}

			$_('body').removeAttr("role");
			if ($wnd.parent) { 
				$wnd.parent.postMessage("ic_enableAria","*"); 			
			}
		};
	}-*/;

	private native void setRolesForNVDA (boolean isNVDAActivated) /*-{
		var $_ = $wnd.$;
		if( isNVDAActivated ) {
			$_('[role]').each(function(){
				var $self = $_(this);
				var roleValue = $self.attr('role');

				if (roleValue !== 'application') {
					$self.attr('ic_role_off',roleValue);
					$self.removeAttr('role');
				}
			});
		} else {
			$_('[ic_role_off]').each(function(){
				var $self = $_(this);
				var roleValue = $self.attr('ic_role_off');
				$self.attr('role',roleValue);
				$self.removeAttr('ic_role_off');
			});
		};
	}-*/;

	private void changeKeyboardMode (KeyDownEvent event, boolean isWCAGSupportOn) {
		if (isWCAGSupportOn && !this.mainPageController.isTextToSpeechModuleEnable()) {
			return;
		}
		this.modeOn = !this.modeOn;
		final boolean isWCAGExit = !this.modeOn && this.isWCAGSupportOn;
		if (this.modeOn) {
			this.isWCAGSupportOn = isWCAGSupportOn;
			this.sendParentScrollAndOffsetRequest();
		}
		
		this.setWCAGModulesStatus(this.modeOn && this.isWCAGSupportOn);
		
		if (this.mainPageController != null) {
			final boolean isWCAGOn = this.modeOn && this.isWCAGSupportOn;
			this.mainPageController.setTextReading(isWCAGOn);

			if (isWCAGOn) {
				this.mainPageController.readStartText();
				this.setRoleApplication(true, this.isNVDAActivate);
			}
			
			if (isWCAGExit) {
				this.mainPageController.readExitText();
				this.setRoleApplication(false, this.isNVDAActivate);
			}
		}
		
		if (this.modeOn) {
			this.actualSelectedModuleIndex = getFirstSelectableElementIndex();
			this.setFocusOnInvisibleElement();
			if (this.isInitiated && this.actualSelectedModuleIndex != -1) {
				this.selectCurrentModule();
			} else {
				this.initialSelect();
			}
		} else {
			this.manageKey(event);
			this.deselectCurrentModule();
			this.deselectAllModules();
			this.actualSelectedModuleIndex = 0;
		}

	}

	private void changeCurrentModule(KeyDownEvent event) {
		if (!this.modeOn) {
			return;
		}
		
		this.deselectCurrentModule();
		if (event.isShiftKeyDown()) {
			this.setIndexToPreviousModule();
		} else {
			this.setIndexToNextModule();
		}
		this.selectCurrentModule();
		this.readTitle();
	}
	
	private void readTitle () {
		final PresenterEntry presenterEntry = this.getPresenters().get(this.actualSelectedModuleIndex);
		final String area = presenterEntry.getArea();
		final IPresenter iPresenter = (IPresenter) presenterEntry.presenter;
		final String id = iPresenter.getModel().getId();
		
		this.mainPageController.playTitle(area, id, "");
	}

	private native void dispatchEnterEvent(Element el) /*-{
		var e = new KeyboardEvent('keydown', {keyCode: 13, bubbles: true});
		el.dispatchEvent(e);
	}-*/;

	private void readNextSentence () {
		this.mainPageController.saveNextSentences();
		dispatchEnterEvent(RootPanel.get().getElement());
		this.mainPageController.readNextSentence();
	}

	private void readPrevSentence () {
		this.mainPageController.saveNextSentences();
		dispatchEnterEvent(RootPanel.get().getElement());
		this.mainPageController.readPrevSentence();
	}

	private int getNextElementIndex (int step) {
		int index = this.actualSelectedModuleIndex;
		boolean isSpeechTextOn = this.isWCAGSupportOn && this.modeOn;

		do {
			final int presentersSize = this.getPresenters().size();
			index += step;

			index = index % presentersSize;
			if (index < 0) {
				index = presentersSize - 1;
			}

			if (index == this.actualSelectedModuleIndex) break; // if all modules are hidden then break loop
		} while (!this.getPresenters().get(index).presenter.isSelectable(isSpeechTextOn));

		return index;
	}
	
	private int getFirstSelectableElementIndex(){
		for(int i=0; i<this.getPresenters().size();i++){
			if(this.getPresenters().get(i).presenter.isSelectable(this.isWCAGSupportOn && this.modeOn)){
				return i;
			}
		}
		return -1;
	}

	private void setIndexToNextModule() {
		this.actualSelectedModuleIndex = this.getNextElementIndex(1);
	}

	private void setIndexToPreviousModule () {
		this.actualSelectedModuleIndex = this.getNextElementIndex(-1);
	}

	private boolean isSpace (int key) {
		return key == 32;
	}
	
	public void run(PlayerEntryPoint entry) {
		entryPoint = entry;

		this.keyDownHandler = RootPanel.get().addDomHandler(new KeyDownHandler() {
			@Override
			public void onKeyDown(KeyDownEvent event) {
				if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER && event.isShiftKeyDown()) {
					event.preventDefault();
					changeKeyboardMode(event, false);
					return;
				}

				if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER && event.isControlKeyDown()) {
					event.preventDefault();
					changeKeyboardMode(event, true);
					return;
				}

				if (event.getNativeKeyCode() == KeyCodes.KEY_TAB && modeOn) { // Disable tab default action if eKeyboard is working
					event.preventDefault();
				}

				if (event.getNativeKeyCode() == KEY_SPACE_BAR && modeOn && !moduleIsActivated) { // Disable space default action if eKeyboard is working but a module has not yet been activated
					event.preventDefault();
				}

				if (event.getNativeKeyCode() == KeyCodes.KEY_TAB && (!moduleIsActivated || isModuleButton() || !isModuleEnterable())) {
					if (moduleIsActivated) { // If we was in button, and he was clicked then we want to disactivate that button
						deactivateModule();
						moduleIsActivated = false;
					}
					changeCurrentModule(event);
					return;
				}
				
				if (modeOn && event.getNativeKeyCode() == KeyCodes.KEY_ENTER && !event.isControlKeyDown() && !event.isShiftKeyDown()) {
					event.preventDefault();
					activateModule();
				}

				if (modeOn && (event.getNativeKeyCode() == KeyCodes.KEY_UP || event.getNativeKeyCode() == KeyCodes.KEY_LEFT)
						&& event.isAltKeyDown() && moduleIsActivated && !isModuleButton()) {
					event.preventDefault();
					readPrevSentence();
					return;
				}

				if (modeOn && (event.getNativeKeyCode() == KeyCodes.KEY_DOWN || event.getNativeKeyCode() == KeyCodes.KEY_RIGHT)
						&& event.isAltKeyDown() && moduleIsActivated && !isModuleButton()) {
					event.preventDefault();
					readNextSentence();
					return;
				}

	            if (modeOn && moduleIsActivated) {
	            	manageKey(event);
	            }

	            if (modeOn && event.getNativeKeyCode() == KeyCodes.KEY_RIGHT && event.isShiftKeyDown()) {
	            	event.preventDefault();
	            	mainPageController.getPlayerController().switchToNextPage();
	            }
	            
	            if (modeOn && event.getNativeKeyCode() == KeyCodes.KEY_LEFT && event.isShiftKeyDown()) {
	            	event.preventDefault();
	            	mainPageController.getPlayerController().switchToPrevPage();
	            }

	            if (modeOn && event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE && !isModuleDeactivationBlocked()) {
	            	event.preventDefault();
	            	deactivateModule();
	            }

	            restoreClasses();
	        }
		}, KeyDownEvent.getType());
	}
	
	private void setFocusOnInvisibleElement () {
		this.focusElement(this.getInputElement());
	} 
	
	private native String getActiveElementParentId() /*-{
		return $wnd.document.activeElement.parentElement.id;
	}-*/;
	
	private native String getPageTypeOfActiveElement() /*-{
		 var node = $wnd.document.activeElement;
		 
		 // start at the element and go up the page structure, looking for first parent element which is page container 
		 // the stop condition: window.parent == window for the top level element in DOM
		 while (node.parentElement != $wnd) {
		 	
		 	if (node.classList.contains('ic_page')) {
		 		return 'main';
		 	}
		 	
		 	if (node.classList.contains('ic_header')) {
		 		return 'header';
		 	}  
		 	
		 	if (node.classList.contains('ic_footer')) {
		 		return 'footer';
		 	}
		 	
		 	node = node.parentElement; 
		 }
		 return null; 
		 
	}-*/;
		
	private native JavaScriptObject	getInputElement() /*-{
		var input = $wnd.$("#input_element_for_focus_to_change_focused_element_by_browser").get(0);
		if (!input) {
			input = $wnd.$("<div/>");
			input.attr("id", "input_element_for_focus_to_change_focused_element_by_browser");
			input.attr("tabindex","0");
			input.attr("aria-hidden","true");
			input.css({
				"opacity": 0.0001,
				"pointer-events": "none",
				"position": "absolute",
				"top": "0px"
			});
			var body = $wnd.$("body");
			body.append(input);
			// the following line has been added for compatibility with NVDA, without it there are issues with AT intercepting Enter button
			input = $wnd.$("#input_element_for_focus_to_change_focused_element_by_browser").get(0);
		}
		
		return input;
	}-*/;
	
	private native void focusElement (JavaScriptObject element) /*-{
		element.focus();
	}-*/;

	private void manageKey (KeyDownEvent event) {
		IWCAG wcagWidget = this.getPresenters().get(this.actualSelectedModuleIndex).presenter.getWCAGController();
		if (wcagWidget == null) {
			return;
		}

		switch (event.getNativeEvent().getKeyCode()) {
			case KeyCodes.KEY_UP:
				wcagWidget.up(event);
				break;
			case KeyCodes.KEY_DOWN:
				wcagWidget.down(event);
				break;
			case KeyCodes.KEY_LEFT:
				wcagWidget.left(event);
				break;
			case KeyCodes.KEY_RIGHT:
				wcagWidget.right(event);
				break;
			case KeyCodes.KEY_ESCAPE:
				wcagWidget.escape(event);
				break;
			case KeyCodes.KEY_ENTER:
				wcagWidget.enter(event, event.isShiftKeyDown() || event.isControlKeyDown());
				break;
			case KeyCodes.KEY_TAB:
				if (event.isShiftKeyDown()) {
					wcagWidget.shiftTab(event);
				} else {
					wcagWidget.tab(event);
				}
				break;
			case KEY_SPACE_BAR:
				wcagWidget.space(event);
				break;
			default:
				wcagWidget.customKeyCode(event);
				break;
		};
	}

	private void activateModule () {
		if (!this.modeOn) {
			return;
		}
		
		this.getPresenters().get(this.actualSelectedModuleIndex).presenter.selectAsActive(ACTIVE_CLASS);
		
		if (this.isWCAGSupportOn) {
			IWCAGPresenter p = this.getPresenters().get(this.actualSelectedModuleIndex).presenter;
			playTextToSpeechContent(p);
		}
		
		this.moduleIsActivated = true;
	}
	
	private void deactivateModule () {
		this.getPresenters().get(this.actualSelectedModuleIndex).presenter.deselectAsActive(ACTIVE_CLASS);
		this.moduleIsActivated = false;
	}
	
	private void selectCurrentModule() {
		if (this.getPresenters().size() == 0) {
			return;
		}
		this.getPresenters().get(this.actualSelectedModuleIndex).presenter.selectAsActive(SELECTED_CLASS);
		scrollToCurrentModule(this);
	}

	private void deselectCurrentModule () {
		if (this.getPresenters().size() == 0) {
			return;
		}

		this.getPresenters().get(this.actualSelectedModuleIndex).presenter.deselectAsActive(SELECTED_CLASS);
	}
	
	private native void scrollToCurrentModule(KeyboardNavigationController x) /*-{
		
		function isWindowAccessible(window) {
			try{
				var doc = window.document;
				return doc != null;
			} catch (e) {
				return false;
			}
		}
		
		var $_ = $wnd.$;		
		var $selected = $_('.ic_selected_module');
		if ($selected.size() == 0) return;
		
		var frameOffset = 0;
		var padding = 50;
		
		var currentWindow = $wnd;
		while (currentWindow != currentWindow.top && isWindowAccessible(currentWindow.parent) && currentWindow.frameElement) {
			frameOffset += $_(currentWindow.frameElement).offset().top;
			currentWindow = currentWindow.parent;
		}	
		
		var $window = $_(currentWindow);
		var parentWindow = currentWindow.parent;
		var isTopWindowAccessible = currentWindow === $wnd.top;
		var receivedParentScrollAndOffset = x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::receivedParentScrollAndOffset;
		
		var windowTop = $window.scrollTop();
		var viewHeight = $window.height();
		var elementTop = $selected.offset().top + frameOffset;
		var elementHeight = $selected.outerHeight();
		
		if (!isTopWindowAccessible && receivedParentScrollAndOffset) {
			var parentScrollY = x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::parentScrollY;
			var iframeOffsetTop = x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::iframeOffsetTop;
			var parentWindowHeight = x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::parentWindowHeight;
			
			windowTop = parentScrollY;
			elementTop += iframeOffsetTop;
			viewHeight = parentWindowHeight;
		}
		
		var newScrollPosition = null;
		if ( windowTop > elementTop ) newScrollPosition = elementTop - padding;
		if ( elementTop + elementHeight > windowTop + viewHeight ) newScrollPosition = elementTop + elementHeight - viewHeight + padding;
		if (newScrollPosition != null) {
			if (isTopWindowAccessible) {
				$window.scrollTop(newScrollPosition);
			} else if (receivedParentScrollAndOffset) {
				parentWindow.postMessage("SCROLLTOP:" + newScrollPosition,"*");
				parentWindow.postMessage("REQUEST_SCROLL_Y_AND_OFFSET","*");
			}
		};
	}-*/;
	
	private void deselectAllModules () {
		if (this.getPresenters().size() == 0) {
			return;
		}
		this.moduleIsActivated = false;
		
		for (PresenterEntry ip: this.getPresenters()) {
			IWCAGPresenter presenter = ip.presenter;
			presenter.deselectAsActive(SELECTED_CLASS);
			presenter.deselectAsActive(ACTIVE_CLASS);
		}
	}
	
	public boolean isModuleActivated () {
		return moduleIsActivated;
	}
	
	public void reset () {
		if (this.presenters.size() == 0 && this.presentersOriginalOrder.size() == 0) {
			return;
		}
        	final boolean isCommonModuleActivatedOriginalNavigation = this.presentersOriginalOrder.size() > 0
            		? this.presentersOriginalOrder.get(this.actualSelectedModuleIndex).isCommon() && isModuleActivated()
            		: false;
		final boolean isCommonModuleActivatedWCAGNavigation = this.presenters.size() > 0 &&  ((this.presenters.size() - 1) >= this.actualSelectedModuleIndex)
            		? this.presenters.get(this.actualSelectedModuleIndex).isCommon() && isModuleActivated()
            		: false;
		
		if (!isCommonModuleActivatedOriginalNavigation && !isCommonModuleActivatedWCAGNavigation) {
			this.moduleIsActivated = false;
			this.isInitiated = false;
			this.actualSelectedModuleIndex = 0;
		}
		
		this.isPresentersInit = false;
		this.presenters.clear();
		this.presentersOriginalOrder.clear();
	}
	
	public void save () {
		if (this.getPresenters().size() == 0) {
			return;
		}

		if(!this.modeOn) {
			return;
		}

		this.savedEntry = this.getPresenters().get(this.actualSelectedModuleIndex);
	}

	public void restore () {
		if (this.savedEntry == null) {
			return;
		}
		if (this.modeOn && this.isWCAGSupportOn) {
			this.mainPageController.readPageTitle();
		}

		for (int i = 0; i < this.getPresenters().size(); i++) {
			IPresenter presenter = (IPresenter) this.getPresenters().get(i).presenter;
			IPresenter savedPresenter = (IPresenter) this.savedEntry.presenter;

			if (presenter.getModel() == savedPresenter.getModel()) {
				this.actualSelectedModuleIndex = i;
				this.initialSelect();
				this.activateModule();
				return;
			}
		}
		
		this.actualSelectedModuleIndex = 0;
		this.initialSelect();
	}
	
	private PresenterEntry getPresenterById (List<PresenterEntry> mainPagePresenters, String id) {
		for (PresenterEntry presenter: mainPagePresenters) {
			IPresenter iPresenter = (IPresenter) presenter.presenter;
			if (iPresenter.getModel().getId().equals(id)) {
				return presenter;
			}
		}
		
		return null;
	}
	
	private List<PresenterEntry> generatePresenters (PageController controller, boolean isCommonPage) {
		List<PresenterEntry> result = new ArrayList<PresenterEntry>();
		
		if (controller != null) {
			for (IPresenter presenter : controller.getPresenters()) {
				if (presenter instanceof IWCAGPresenter) {
					result.add(new PresenterEntry((IWCAGPresenter) presenter, presenter.getModel().getId(), isCommonPage));
				}
			}
		}
		
		return result;
	}
	
	private List<PresenterEntry> sortTextToSpeechModules (PageController main, PageController header, PageController footer) {
		List<PresenterEntry> mainPresenters = this.generatePresenters(main, false);
		List<PresenterEntry> headerPresenters = this.generatePresenters(header, true);
		List<PresenterEntry> footerPresenters = this.generatePresenters(footer, true);
		
		List<PresenterEntry> result = new ArrayList<PresenterEntry>();
		List<PresenterEntry> currentPresenter = new ArrayList<PresenterEntry>();
		
		List<NavigationModuleIndentifier> TTSModules = new ArrayList<NavigationModuleIndentifier>();
		if (main != null && main.isTextToSpeechModuleEnable()) {
			TTSModules = main.getModulesOrder();
		}
		
		for (NavigationModuleIndentifier module: TTSModules) {
			if (module.getArea().equals("main")) {
				currentPresenter = mainPresenters;
			}
			
			if (module.getArea().equals("header")) {
				currentPresenter = headerPresenters;
			}
			
			if (module.getArea().equals("footer")) {
				currentPresenter = footerPresenters;
			}
			
			PresenterEntry localPresenter = getPresenterById(currentPresenter, module.getId());
			if (localPresenter != null) {
				localPresenter.setArea(module.getArea());
				result.add(localPresenter);
			}
		}
		
		return result;
	}

	private void addToNavigation (PageController controller, boolean isCommon) {
		if (controller == null || controller.getWidgets() == null) {
			return;
		}
		
		this.presentersOriginalOrder.addAll(this.generatePresenters(controller, isCommon));
	}
	
	private void playTextToSpeechContent (IWCAGPresenter iWCAGPresenter) {
		if (iWCAGPresenter.getWCAGController() instanceof IWCAGModuleView) {
			IWCAGModuleView view = (IWCAGModuleView) iWCAGPresenter.getWCAGController();
			view.setPageController(mainPageController);
		}
	}
	
	public void addHeaderToNavigation (PageController controller) {
		this.headerController = controller;
		addToNavigation(controller, true);
	}
	
	public void addFooterToNavigation (PageController controller) {
		this.footerController = controller;
		addToNavigation(controller, true);
	}
	
	public void addMainToNavigation (PageController controller) {
		this.mainPageController = controller;
		addToNavigation(controller, false);
	}
	
	public void addSecondToNavigation (PageController controller) {
		addToNavigation(controller, false);
	}
	
	private List<PresenterEntry> getPresenters () {
		if (!this.isPresentersInit && this.isWCAGSupportOn) {
			this.presenters = this.sortTextToSpeechModules(this.mainPageController, this.headerController, this.footerController);
			
			this.isPresentersInit = this.presenters.size() > 0;
		}
		
		return this.isWCAGSupportOn ? this.presenters : this.presentersOriginalOrder;
	}

	public boolean isWCAGOn() {
		return modeOn && isWCAGSupportOn;
	}

	@Override
	public void moveToModule(String soughtModuleId) {
		int soughtModuleIndex = findModuleIndex(soughtModuleId);

		if (soughtModuleIndex != -1) {
			moveNavigationToModule(soughtModuleIndex);
		}
	}

	// Returns true if element e is contained within modules group div that's not visible, false otherwise
	static public native boolean isParentGroupDivHidden (Element e) /*-{
		var $_ = $wnd.$;
		var isHidden = false;
		$_(e).parents('.modules_group').each(function(index){
			if ($_(this).css('display') == 'none' || $_(this).css('visibility') == 'hidden') {
				isHidden = true;
				return false;
			}
		});
		return isHidden;
	}-*/;

	/**
	 * Function to find module by id
	 * @param soughtModuleId (String) - module id which should be searched in presenters
	 * @return -1 if module wasn't found, otherwise it's index (0 to N)
	 */
	private int findModuleIndex(String soughtModuleId) {
		List<PresenterEntry> presenters = getPresenters();
		for (int i = 0; i < presenters.size(); i++) {
			PresenterEntry entry = presenters.get(i);
			if (entry.id.equals(soughtModuleId)) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Function to move current selection to new index. It deselects previous selected module.
	 * @param soughtModuleIndex (int) - module index in presenter list
	 */
	private void moveNavigationToModule(int soughtModuleIndex) {
		deselectCurrentModule();
		deactivateModule();

		actualSelectedModuleIndex = soughtModuleIndex;

		selectCurrentModule();
		readTitle();
	}

	public void clearEventListeners() {
		if (this.keyDownHandler != null) {
			this.keyDownHandler.removeHandler();
			clearMessageListener(this);
		}
	}

	public void handleNVDAAvailability(boolean shouldUseNVDA) {
		this.isNVDAActivate = shouldUseNVDA;
	    this.setRolesForNVDA(shouldUseNVDA);
		this.setNVDAAvailability(shouldUseNVDA, this.isWCAGOn());
	}

	private native void setNVDAAvailability(boolean shouldUseNVDA, boolean isWCAGOn) /*-{
		if (shouldUseNVDA && !isWCAGOn) {
			$wnd.$('#_icplayer').removeAttr("aria-hidden");
		}
	}-*/;

	private native void clearMessageListener(KeyboardNavigationController x)/*-{
		var receiveMessage = x.@com.lorepo.icplayer.client.page.KeyboardNavigationController::messageHandler;
		if (receiveMessage) {
			$wnd.removeEventListener("message", receiveMessage);
		}
	}-*/;
	
}
