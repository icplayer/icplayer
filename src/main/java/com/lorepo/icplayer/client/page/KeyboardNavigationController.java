package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.ModuleActivatedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.text.TextPresenter;

public final class KeyboardNavigationController {
	private int focusedModule = 0;
	private String currentModuleName = "";
	private boolean moduleIsActivated = false;
	private HashMap<String, Widget> navigationWidgets = new HashMap<String, Widget>();
	private List<String> modulesNames = new ArrayList<String>();
	private List<String> tempModulesNames = new ArrayList<String>();
	private HashMap<String, List<String>> pageModules = new HashMap<String, List<String>>();
	private List<String> headerNames = new ArrayList<String>();
	private boolean isInitiated = false;
	private HashMap<String, IPlayerServices> playerServices = new HashMap<String, IPlayerServices>();
	private List<String> headerWidgets = new ArrayList<String>();
	private List<String> footerWidgets = new ArrayList<String>();
	private List<String> mainPageWidgets = new ArrayList<String>();
	private List<String> bookPageWidgets = new ArrayList<String>();
	
	private enum ExpectedModules {
		// Navigation modules
		text, video, button, navigation_bar, choice;
		
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
		String moduleName = modulesNames.get(0);
		Widget w = navigationWidgets.get(moduleName);

		if (w == null) return; // there is no modules to select
		selectModule(moduleName);
		currentModuleName = moduleName;
		isInitiated = true;
		
		setModuleStatus(moduleName, true, false);	
	}
	
	// we must update this position because each of page has different number of modules
	private void updateFocusedModulePosition() {
		for (int i = 0; i < modulesNames.size(); i++) {
			if (modulesNames.get(i).equals(currentModuleName)) {
				focusedModule = i;
			}
		}
	}
	
	public void fillModulesNamesList() {	
		modulesNames.clear();
		if(!headerWidgets.isEmpty()) {
			modulesNames.addAll(headerWidgets);
		}

		if(!mainPageWidgets.isEmpty()) {
			modulesNames.addAll(mainPageWidgets);
		}
		
		if(!bookPageWidgets.isEmpty()) {
			modulesNames.addAll(bookPageWidgets);
		}
		
		if(!footerWidgets.isEmpty()) {
			modulesNames.addAll(footerWidgets);
		}

		if (!currentModuleName.equals("")) {
			selectModule(currentModuleName);
			activateModule();
			updateFocusedModulePosition();
		}
	}
	
	private boolean isModuleInBookView(String moduleName) {
		return (moduleName.length() >= 2 && moduleName.startsWith("__b__"));
	}
	
	public void run() {
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
	            
	            if (moduleIsActivated) {
	            	boolean isModuleInBookView = isModuleInBookView(currentModuleName);
	            	String moduleName = currentModuleName.replaceFirst("__[hbf]__", "");
	            	
	            	if (isModuleInBookView && playerServices.containsKey("BookMode")) {
	            		playerServices.get("BookMode").getEventBus().fireEvent(new ModuleActivatedEvent(moduleName, event));
	            	} else {
	            		playerServices.get("SingleMode").getEventBus().fireEvent(new ModuleActivatedEvent(moduleName, event));
	            	}
	            }
	            
	            if (event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
	            	event.preventDefault();
	            	deactivateModule();
	            }

	        }
	    }, KeyDownEvent.getType());
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
	
	private boolean isModuleHidden(Element elem) {
		return elem.getStyle().getVisibility().equals("hidden") || elem.getStyle().getDisplay().equals("none");
	}
	
	private void selectNextModule() {
		deselectModule(currentModuleName);
		
		int position = ++focusedModule % navigationWidgets.size();
		String moduleName = modulesNames.get(position);
		Widget w = navigationWidgets.get(moduleName);
		int i = 0;

		if (w == null) return; // there is no modules to select
		
		// skip hidden modules
		while (isModuleHidden(w.getElement())) {
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
	
	private boolean isCommonModule() {
		return currentModuleName.startsWith("__h__") || currentModuleName.startsWith("__f__");
	}
	
	public void resetStatus() {
		if (!isCommonModule()) {
			setModuleStatus("", false, false);
		}
	}
	
	// True, if no module is activated
	private static native boolean shouldSelectModule() /*-{
		return typeof $wnd.moduleStatus.name !== ""
	}-*/;

	public static native void setModuleStatus(String name, boolean selected, boolean activated) /*-{
		name = name.replace(/__(h|b|f)__/g, "");
		
		$wnd.moduleStatus = {
			name: name,
			selected: selected,
			activated: activated
		}
	}-*/;
	
	public boolean isModuleActivated() {
		return moduleIsActivated;
	}
	
	public void reset() {
		if (!(isCommonModule() && isModuleActivated())) {
			focusedModule = 0;
			currentModuleName = "";
			moduleIsActivated = false;
			isInitiated = false;
		}

		headerWidgets.clear();
		footerWidgets.clear();
		mainPageWidgets.clear();
		bookPageWidgets.clear();
		
		navigationWidgets = new HashMap<String, Widget>();
		modulesNames = new ArrayList<String>();
	}
	
	public void setPlayerService(IPlayerServices ps, boolean isBookMode) {
		if (isBookMode) {
			playerServices.put("BookMode", ps);
		} else {
			playerServices.put("SingleMode", ps);
		}
	}
	
	private List<String> getProperModulesToList(List<IPresenter> presenters, HashMap<String, Widget> widgets, String prefix) {
		List<String> tempModulesNames = new ArrayList<String>();

		for (IPresenter presenter : presenters) {
			IModuleModel module = presenter.getModel();
			boolean isModuleExpected = ExpectedModules.contains(module.getModuleTypeName().toLowerCase());
			String moduleTypeName = module.getModuleTypeName().toLowerCase();
			
			if (isModuleExpected) {
				// for text modules
				if (moduleTypeName.equals("text")){
					if (!((TextPresenter) presenter).isSelectable()) continue;
				}
				
				tempModulesNames.add(prefix + presenter.getModel().getId());
				navigationWidgets.put(prefix + module.getId(), widgets.get(module.getId()));
			}
		}
		
		return tempModulesNames;
	}
	
	public void addHeaderToNavigation(PageController controller) {
		if (controller != null && controller.getWidgets() != null) {
			headerWidgets.clear();
			List<String> widgetNames = new ArrayList<String>();
			widgetNames = getProperModulesToList(controller.getPresenters(), controller.getWidgets(), "__h__");
			headerWidgets.addAll(widgetNames);
		}
	}
	
	public void addFooterToNavigation(PageController controller) {
		if (controller != null && controller.getWidgets() != null) {
			footerWidgets.clear();
			List<String> widgetNames = new ArrayList<String>();
			widgetNames = getProperModulesToList(controller.getPresenters(), controller.getWidgets(), "__f__");
			footerWidgets.addAll(widgetNames);
		}
	}
	
	public void addMainToNavigation(PageController controller) {
		if (controller != null && controller.getWidgets() != null) {
			mainPageWidgets.clear();
			List<String> widgetNames = new ArrayList<String>();
			
			widgetNames = getProperModulesToList(controller.getPresenters(), controller.getWidgets(), "");
			mainPageWidgets.addAll(widgetNames);
		}
	}
	
	public void addSecondToNavigation(PageController controller) {
		if (controller != null && controller.getWidgets() != null) {
			bookPageWidgets.clear();
			List<String> widgetNames = new ArrayList<String>();
			widgetNames = getProperModulesToList(controller.getPresenters(), controller.getWidgets(), "__b__");
			bookPageWidgets.addAll(widgetNames);
		}
	}
}
