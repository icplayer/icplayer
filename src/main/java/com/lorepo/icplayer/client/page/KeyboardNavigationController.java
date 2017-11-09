package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icplayer.client.PlayerEntryPoint;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;

/*
	Usage:
		Module:
			- Presenter must implement IWCAGPresenter interface and must return IWCAG element
		Addon:
			- Addon must have keyboardController(keyCode, isShiftDown) function in presenter
*/
public final class KeyboardNavigationController {
	private boolean moduleIsActivated = false;
	private boolean isInitiated = false;
	private List<PresenterEntry> presenters = new ArrayList<PresenterEntry>();
	private boolean modeOn = false;
	private PlayerEntryPoint entryPoint;
	private JavaScriptObject invisibleInputForFocus = null;
	private int actualSelectedModuleIndex = 0;

	//state
	private PresenterEntry savedEntry = null;

	class PresenterEntry {
		public IWCAGPresenter presenter = null;
		public boolean common = false;

		PresenterEntry(IWCAGPresenter presenter, boolean isCommon) {
			this.presenter = presenter;
			this.common = isCommon;
		}

		public boolean isCommon() {
			return this.common;
		}
	}
	
	public KeyboardNavigationController() {
		this.waitOnMessages(this);
	}

	private void callEnterPressEvent () {
		DomEvent.fireNativeEvent(Document.get().createKeyDownEvent(false, false, true, false, KeyCodes.KEY_ENTER), RootPanel.get());
	}

	private native void waitOnMessages (KeyboardNavigationController x) /*-{
		$wnd.addEventListener("message", receiveMessage);
		function receiveMessage(event) {
			try {
				var eventData = JSON.parse(event.data);

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
	}-*/;

	private void initialSelect() {
		if (this.presenters.size() == 0) {
			this.modeOn = false;
			return;
		}
		
		if (!this.presenters.get(this.actualSelectedModuleIndex).presenter.isSelectable()) {	//If first is not selectable
			this.setIndexToNextModule();
			if (this.actualSelectedModuleIndex == 0) {	//And others modules too, then turn off navigation
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
	
	private boolean isModuleButton() {
		if (this.presenters.get(this.actualSelectedModuleIndex).presenter instanceof IButton) {
			return true;
		}

		
		if (this.presenters.get(this.actualSelectedModuleIndex).presenter instanceof AddonPresenter) {	//Addon can be button or not, so AddonPresenter contains list of buttons
			AddonPresenter presenter = (AddonPresenter) this.presenters.get(this.actualSelectedModuleIndex).presenter;
			return presenter.isButton();
		}
		
		return false;
	}

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
			IWCAG wcagWidget = this.presenters.get(this.actualSelectedModuleIndex).presenter.getWCAGController();
			if (wcagWidget != null) {
				wcagWidget.enter(true);
			}
			this.deselectCurrentModule();
		}
	}
	
	private void changeKeyboardMode (KeyDownEvent event) {
		this.modeOn = !this.modeOn;
		if (this.modeOn) {
			this.setFocusOnInvisibleElement();
			if (!this.isInitiated) {
				this.initialSelect();
			} else {
				this.selectCurrentModule();
			}
		} else {
			this.manageKey(event);
			this.deselectCurrentModule();
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
	}

	private int getNextElementIndex(int step) {
		int index = this.actualSelectedModuleIndex;
		do {
			index += step;

			index = index % this.presenters.size();
			if (index < 0) {
				index = this.presenters.size() - 1;
			}

			if (index == this.actualSelectedModuleIndex) break; // if all modules are hidden then break loop
		} while (!this.presenters.get(index).presenter.isSelectable());

		return index;
	}

	private void setIndexToNextModule() {
		this.actualSelectedModuleIndex = this.getNextElementIndex(1);
	}

	private void setIndexToPreviousModule () {
		this.actualSelectedModuleIndex = this.getNextElementIndex(-1);
	}

	public void run(PlayerEntryPoint entry) {
		entryPoint = entry;
				
		RootPanel.get().addDomHandler(new KeyDownHandler() {
			@Override
	        public void onKeyDown(KeyDownEvent event) {
				if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER && event.isShiftKeyDown()) {
					event.preventDefault();
					changeKeyboardMode(event);
					return;
				}

				if (event.getNativeKeyCode() == KeyCodes.KEY_TAB && modeOn) {	//Disable tab default action if eKeyboard is working
					event.preventDefault();
				}

				if (event.getNativeKeyCode() == KeyCodes.KEY_TAB && (!moduleIsActivated || isModuleButton())) {
					if (moduleIsActivated) {	//If we was in button, and he was clicked then we want to disactivate that button
						deactivateModule();
						moduleIsActivated = false;
					}
					changeCurrentModule(event);
					return;
				}

				if (modeOn && event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
					event.preventDefault();
					activateModule();
				}

	            if (modeOn && moduleIsActivated) {
	            	manageKey(event);
	            }


	            if (modeOn && event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
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
		
	private native JavaScriptObject	getInputElement() /*-{
		var input = $wnd.$("#input_element_for_focus_to_change_focused_element_by_browser").get(0);
		if (!input) {
			input = $wnd.$("<input/>");
			input.attr("id", "input_element_for_focus_to_change_focused_element_by_browser");
			input.css({
						"opacity": 0.0001,
						'pointer-events':    "none",
						"position": "absolute",
						"top": "0px"
						});
			var body = $wnd.$("body");
			body.append(input);
		}
		
		return input;		
	}-*/;
	
	private native void focusElement(JavaScriptObject element) /*-{
		element.focus();
	}-*/;
	

	private void manageKey (KeyDownEvent event) {
		IWCAG wcagWidget = this.presenters.get(this.actualSelectedModuleIndex).presenter.getWCAGController();
		if (wcagWidget == null) {
			return;
		}
		
		switch(event.getNativeEvent().getKeyCode()) {
			case KeyCodes.KEY_UP:
				wcagWidget.up();
				break;
			case KeyCodes.KEY_DOWN:
				wcagWidget.down();
				break;
			case KeyCodes.KEY_LEFT:
				wcagWidget.left();
				break;
			case KeyCodes.KEY_RIGHT:
				wcagWidget.right();
				break;
			case KeyCodes.KEY_ESCAPE:
				wcagWidget.escape();
				break;
			case KeyCodes.KEY_ENTER:
				if (event.isShiftKeyDown()) {
					wcagWidget.enter(true);
				} else {
					wcagWidget.enter(false);
				}
				break;
			case KeyCodes.KEY_TAB:
				if (event.isShiftKeyDown()) {
					wcagWidget.shiftTab();
				} else {
					wcagWidget.tab();
				}
				break;
			case 32:
				wcagWidget.space();
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

		this.presenters.get(this.actualSelectedModuleIndex).presenter.selectAsActive("ic_active_module");
		this.moduleIsActivated = true;
	}
	
	private void deactivateModule () {
		this.presenters.get(this.actualSelectedModuleIndex).presenter.deselectAsActive("ic_active_module");
		this.moduleIsActivated = false;
	}
	
	private void selectCurrentModule() {
		if (this.presenters.size() == 0) {
			return;
		}
		
		this.presenters.get(this.actualSelectedModuleIndex).presenter.selectAsActive("ic_selected_module");
	}

	private void deselectCurrentModule () {
		if (this.presenters.size() == 0) {
			return;
		}

		this.presenters.get(this.actualSelectedModuleIndex).presenter.deselectAsActive("ic_selected_module");
	}
	
	public boolean isModuleActivated() {
		return moduleIsActivated;
	}
	
	public void reset() {
		if (this.presenters.size() == 0) {
			return;
		}

		if (!(this.presenters.get(this.actualSelectedModuleIndex).isCommon() && isModuleActivated())) {
			this.moduleIsActivated = false;
			this.isInitiated = false;
			this.actualSelectedModuleIndex = 0;
		}
		

		this.presenters.clear();
	}
	
	public void save() {
		if (this.presenters.size() == 0) {
			return;
		}

		if(!this.modeOn) {
			return;
		}

		this.savedEntry = this.presenters.get(this.actualSelectedModuleIndex);
	}

	public void restore() {
		if (this.savedEntry == null) {
			return;
		}

		for (int i = 0; i < this.presenters.size(); i++) {
			IPresenter presenter = (IPresenter) this.presenters.get(i).presenter;
			IPresenter savedPresenter = (IPresenter)this.savedEntry.presenter;

			if(presenter.getModel() == savedPresenter.getModel()) {
				this.actualSelectedModuleIndex = i;
				this.initialSelect();
				this.activateModule();
				return;
			}
		}
		this.actualSelectedModuleIndex = 0;
		this.initialSelect();
	}

	private void addToNavigation(PageController controller, boolean isCommon) {
		if (controller == null || controller.getWidgets() == null) {
			return;
		}

		for (IPresenter presenter : controller.getPresenters()) {
			if (presenter instanceof IWCAGPresenter) {
				this.presenters.add(new PresenterEntry((IWCAGPresenter) presenter, isCommon));
			}
		}

	}
	
	public void addHeaderToNavigation(PageController controller) {
		addToNavigation(controller, true);
	}
	
	public void addFooterToNavigation(PageController controller) {
		addToNavigation(controller, true);
	}
	
	public void addMainToNavigation(PageController controller) {
		addToNavigation(controller, false);
	}
	
	public void addSecondToNavigation(PageController controller) {
		addToNavigation(controller, false);
	}
}
