package com.lorepo.icplayer.client.module.checkcounter;

import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;

public class CheckCounterPresenter implements IPresenter, IWCAGPresenter, IButton{

	public interface IDisplay extends IModuleView {
		public void setData(int value);
		public Element getElement();
	}
	
	private CheckCounterModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	
	public CheckCounterPresenter(CheckCounterModule module, IPlayerServices services) {
		this.module = module;
		this.playerServices = services;
		
		connectHandlers();
	}
	
	private void connectHandlers() {
		if(playerServices != null){
			
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						
						@Override
						public void onShowErrors(ShowErrorsEvent event) {
							updateDisplay();
						}
					});

			playerServices.getEventBus().addHandler(ResetPageEvent.TYPE, 
					new ResetPageEvent.Handler() {
						
						@Override
						public void onResetPage(ResetPageEvent event) {
							updateDisplay();
						}
					});
			
			playerServices.getEventBus().addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
				@Override
				public void onCustomEventOccurred(CustomEvent event) {
					onEventReceived(event.eventName, event.getData());
				}
			});
		}
	}

	public void updateDisplay() {
		IPlayerCommands pageService = playerServices.getCommands();
		PageScore pageScore = pageService.getCurrentPageScore();
		if(pageScore != null){
			view.setData(pageScore.getCheckCount());
		}		
	}
	
	private Element getView(){
		return view.getElement();
	}
	
	@Override
	public void addView(IModuleView view) {
		if(view instanceof IDisplay){
			this.view = (IDisplay) view;
			updateDisplay();
		}
	}

	@Override
	public IModuleModel getModel() {
		return module;
	}

	@Override
	public void setShowErrorsMode() {
		// Module is not an activity
	}

	@Override
	public void setWorkMode() {
		// Module is not an activity		
	}

	@Override
	public void reset(boolean onlyWrongAnswers) {
		// Module is not an activity
	}

	@Override
	public IWCAG getWCAGController() {
		return (IWCAG) this.view;
	}

	@Override
	public void selectAsActive(String className) {
		if(className != "ic_active_module") {
			this.view.getElement().addClassName(className);
		}
	}

	@Override
	public void deselectAsActive(String className) {
		this.view.getElement().removeClassName(className);
	}

	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		boolean isVisible = !this.getView().getStyle().getVisibility().equals("hidden") 
				&& !this.getView().getStyle().getDisplay().equals("none")
				&& !KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return false;
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName.equals("ShowAnswers")) {
			updateDisplay();
		}
	}

	@Override
	public JavaScriptObject getAsJavaScript() {
		return JavaScriptObject.createObject();
	}

	@Override
	public void setDisabled(boolean value) {
		// this module only shows value
	}

	@Override
	public boolean isDisabled() {
		return false;
	}
}
