package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.dom.client.Node;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.text.TextModel;
import com.lorepo.icplayer.client.module.text.TextPresenter;

public final class KeyboardNavigationController {
	private int focusedModule = 0;
	private String currentModuleName = "";
	private boolean moduleIsActivated = false;
	private HashMap<String, Widget> navigationWidgets = new HashMap<String, Widget>();
	private List<String> modulesNames = new ArrayList<String>();
	private HashMap<String, Widget> widgets = new HashMap<String, Widget>();
	private ArrayList<IPresenter> presenters;
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
	
	protected void setPresenters(ArrayList<IPresenter> presenters) {
		this.presenters = presenters;
	}
	
	protected void run(ArrayList<IPresenter> presenters) {
		this.presenters = presenters;
		setModuleStatus("", false, false); //initialize moduleStatus during loading of page
		addToNavigation();

		RootPanel.get().addDomHandler(new KeyDownHandler() {

	        @Override
	        public void onKeyDown(KeyDownEvent event) {
	            if (event.getNativeKeyCode() == KeyCodes.KEY_TAB) {
	            	JavaScriptUtils.log("AAAACTIVE: "+moduleIsActivated);
	            	if (!moduleIsActivated) {
		            	event.preventDefault();
	            		selectNextModule();
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
	
	private void addToNavigation() {
		for (IPresenter presenter : presenters) {
			IModuleModel module = presenter.getModel();
			boolean isModuleExpected = ExpectedModules.contains(module.getModuleTypeName().toLowerCase());
			String moduleTypeName = module.getModuleTypeName().toLowerCase();
			
			if (isModuleExpected) {
				if (moduleTypeName.equals("text")){
					if (!((TextPresenter) presenter).isSelectable()) continue;
				}
				
				navigationWidgets.put(module.getId(), widgets.get(module.getId()));
				modulesNames.add(presenter.getModel().getId());
			}
		}
	}
	
	protected void add(IModuleModel module, Widget moduleView) {
		widgets.put(module.getId(), moduleView);
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
	

	private void selectNextModule() {
		deselectModule(currentModuleName);
		
		int position = focusedModule % navigationWidgets.size();
		String moduleName = modulesNames.get(position);
		Widget w = navigationWidgets.get(moduleName);
		int i = 0;
		JavaScriptUtils.log(focusedModule+" : "+navigationWidgets.size()+" : "+position+" : "+moduleName+" : "+w);
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
