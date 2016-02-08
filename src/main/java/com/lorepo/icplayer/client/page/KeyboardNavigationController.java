package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.text.TextPresenter;

public final class KeyboardNavigationController {
	private int focusedModule = 0;
	private String currentModuleName = "";
	private boolean moduleIsActivated = false;
	private HashMap<String, Widget> navigationWidgets = new HashMap<String, Widget>();
	private List<String> modulesNames = new ArrayList<String>();
	private boolean isInitiated = false;
	
	private enum ExpectedModules {
		// Navigation modules
		text, video, button, navigation_bar;
		
		private static boolean contains(String s) {
			for(ExpectedModules choice:values()) {
				if (choice.name().equals(s)) {
				   return true; 
				}
			}
			return false;
		}
	}
	
	private void initialSelect() {
		isInitiated = true;

		String moduleName = modulesNames.get(0);
		Widget w = navigationWidgets.get(moduleName);

		if (w == null) return; // there is no modules to select
		
		selectModule(moduleName);
		currentModuleName = moduleName;
		
		setModuleStatus(moduleName, true, false);	
	}
	
	public void run() {
		setModuleStatus("", false, false); //initialize moduleStatus during loading of page

		RootPanel.get().addDomHandler(new KeyDownHandler() {

	        @Override
	        public void onKeyDown(KeyDownEvent event) {
	            if (event.getNativeKeyCode() == KeyCodes.KEY_TAB) {
	            	event.preventDefault();
	            	
	            	if (!isInitiated) {
	            		initialSelect();
	            		return;
	            	}
	            	
	            	if (!moduleIsActivated) {
	            		if (event.isShiftKeyDown()) {
	            			selectPreviousModule();
	            		} else {
	            			selectNextModule();
	            		}
	            	}
	            }
	            
	            if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
	            	event.preventDefault();
	            	activateModule();
	            }
	            
	            if (event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
	            	event.preventDefault();
	            	deactivateModule();
	            }
	        }
	    }, KeyDownEvent.getType());
	}
	
	protected void addToNavigation(HashMap<String, Widget> widgets, ArrayList<IPresenter> presenters, String prefix) {
		for (IPresenter presenter : presenters) {
			IModuleModel module = presenter.getModel();
			boolean isModuleExpected = ExpectedModules.contains(module.getModuleTypeName().toLowerCase());
			String moduleTypeName = module.getModuleTypeName().toLowerCase();
			
			if (isModuleExpected) {
				if (moduleTypeName.equals("text")){
					if (!((TextPresenter) presenter).isSelectable()) continue;
				}
				
				navigationWidgets.put(prefix + module.getId(), widgets.get(module.getId()));
				modulesNames.add(prefix + presenter.getModel().getId());
			}
		}
	}
	
	private void activateModule() {
		if (currentModuleName.isEmpty()) return;
		
		Widget widget = navigationWidgets.get(currentModuleName);
		widget.getElement().addClassName("ic_active_module");
		
		this.moduleIsActivated = true;
		
		setModuleStatus(currentModuleName, true, true);
	}
	
	private void deselectModule(String currentModuleName) {
		if (currentModuleName.isEmpty()) return;
		
		Widget currentWidget = navigationWidgets.get(currentModuleName);
		currentWidget.getElement().removeClassName("ic_selected_module");
		currentWidget.getElement().removeClassName("ic_active_module");
	}
	
	private void deactivateModule() {
		if (currentModuleName.isEmpty()) return;
		
		Widget currentWidget = navigationWidgets.get(currentModuleName);
		currentWidget.getElement().removeClassName("ic_active_module");
		
		this.moduleIsActivated = false;
		
		setModuleStatus(currentModuleName, true, false);
	}
	
	private void selectPreviousModule() {
		deselectModule(currentModuleName);
		int position = --focusedModule % navigationWidgets.size();
		
		if (position < 0) {
			position = navigationWidgets.size() - 1;
			focusedModule = navigationWidgets.size() - 1;
		}
		
		String moduleName = modulesNames.get(position);
		Widget w = navigationWidgets.get(moduleName);
		int i = 0;

		if (w == null) return; // there is no modules to select
		
		// skip hidden modules
		while (w.getElement().getStyle().getVisibility().equals("hidden")) {
			if (i++ == position) break; // if all modules are hidden then break loop
			focusedModule--;
			position = focusedModule % navigationWidgets.size();
			if (position == 0) {
				position = navigationWidgets.size() - 1;
			}
			moduleName = modulesNames.get(position);
			w = navigationWidgets.get(moduleName);
		}
		
		selectModule(moduleName);

		currentModuleName = moduleName;
		
		setModuleStatus(moduleName, true, false);	
	}
	
	private void selectNextModule() {
		deselectModule(currentModuleName);
		
		int position = ++focusedModule % navigationWidgets.size();
		String moduleName = modulesNames.get(position);
		Widget w = navigationWidgets.get(moduleName);
		int i = 0;

		if (w == null) return; // there is no modules to select
		
		// skip hidden modules
		while (w.getElement().getStyle().getVisibility().equals("hidden")) {
			if (i++ == position) break; // if all modules are hidden then break loop
			focusedModule++;
			position = focusedModule % navigationWidgets.size();
			moduleName = modulesNames.get(position);
			w = navigationWidgets.get(moduleName);
		}
		
		selectModule(moduleName);

		currentModuleName = moduleName;
		
		setModuleStatus(moduleName, true, false);		
	}
	
	private native void scrollToModule(int position) /*-{
		$wnd.scrollTo(0, position);
	}-*/;
	
	private void selectModule(String moduleName) {
		Widget widget = navigationWidgets.get(moduleName);
		widget.getElement().addClassName("ic_selected_module");
		
		scrollToModule(widget.getAbsoluteTop());
	}
	
	public void resetStatus() {
		setModuleStatus("", false, false);
	}
	
	public static native void setModuleStatus(String name, boolean selected, boolean activated) /*-{
		name = name.replace(/(h|b|f)_/g, "");
		
		$wnd.moduleStatus = {
			name: name,
			selected: selected,
			activated: activated
		}
	}-*/;
	
	public void init() {
		focusedModule = 0;
		currentModuleName = "";
		moduleIsActivated = false;
		isInitiated = false;
		navigationWidgets = new HashMap<String, Widget>();
		modulesNames = new ArrayList<String>();
	}
}
