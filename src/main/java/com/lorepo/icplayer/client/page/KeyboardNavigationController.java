package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.IModuleModel;

public final class KeyboardNavigationController {
	private int focusedModule = 0;
	private String currentModuleName = "";
	private boolean moduleIsActivated = false;
	private HashMap<String, Widget> navigationWidgets = new HashMap<String, Widget>();
	private List<String> modulesNames = new ArrayList<String>();
	private enum ExpectedModules {
		// Navigation modules
		text, video;
		
		private static boolean contains(String s) {
			for(ExpectedModules choice:values()) {
				if (choice.name().equals(s)) {
				   return true; 
				}
			}
			return false;
		}
	}
	
	protected void run() {
		setModuleStatus("", false, false); //initialize moduleStatus during loading of page
		
		RootPanel.get().addDomHandler(new KeyDownHandler() {

	        @Override
	        public void onKeyDown(KeyDownEvent event) {
	            if (event.getNativeKeyCode() == KeyCodes.KEY_TAB) {
	            	if (!moduleIsActivated) {
		            	event.preventDefault();
	            		selectNextModule();
	            	}
	            }
	            
	            if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
	            	event.preventDefault();
	            	activateModule(currentModuleName);
	            }
	            
	            if (event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
	            	event.preventDefault();
	            	deactivateModule(currentModuleName);
	            }
	        }
	    }, KeyDownEvent.getType());
	}
	
	protected void addToNavigation(IModuleModel module, Widget moduleView) {
		boolean isHidden = moduleView.getElement().getStyle().getVisibility().equals("hidden");
		boolean isModuleExpected = ExpectedModules.contains(module.getModuleTypeName().toLowerCase());
		
		if (isModuleExpected && !isHidden) {
			JavaScriptUtils.log(moduleView.getElement().getStyle().getVisibility());
			navigationWidgets.put(module.getId(), moduleView);
			modulesNames.add(module.getId());
		}
	}
	
	private void activateModule(String moduleName) {
		if (moduleName.isEmpty()) return;
		
		Widget widget = navigationWidgets.get(moduleName);
		widget.getElement().addClassName("ic_active_module");
		
		this.moduleIsActivated = true;
		
		setModuleStatus(moduleName, true, true);
	}
	
	private void deselectModule(String currentModuleName) {
		if (currentModuleName.isEmpty()) return;
		
		Widget currentWidget = navigationWidgets.get(currentModuleName);
		currentWidget.getElement().removeClassName("ic_selected_module");
		currentWidget.getElement().removeClassName("ic_active_module");
	}
	
	private void deactivateModule(String currentModuleName) {
		if (currentModuleName.isEmpty()) return;
		
		Widget currentWidget = navigationWidgets.get(currentModuleName);
		currentWidget.getElement().removeClassName("ic_active_module");
		
		this.moduleIsActivated = false;
		
		setModuleStatus(currentModuleName, true, false);
	}
	

	private void selectNextModule() {
		int size = focusedModule % navigationWidgets.size();
		String moduleName = modulesNames.get(size);

		selectModule(moduleName);
		deselectModule(currentModuleName);
		
		currentModuleName = moduleName;
		focusedModule++;
		
		setModuleStatus(moduleName, true, false);		
	}
	
	private void selectModule(String moduleName) {
		Widget widget = navigationWidgets.get(moduleName);
		
		widget.getElement().addClassName("ic_selected_module");
	}
	
	private static native void setModuleStatus(String name, boolean selected, boolean activated) /*-{
		$wnd.moduleStatus = {
			name: name,
			selected: selected,
			activated: activated
		}
	}-*/;
}
