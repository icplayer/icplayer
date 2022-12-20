package com.lorepo.icplayer.client.model.page.group;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class GroupPresenter implements IPresenter, IStateful{

	
	public interface IDisplay extends IModuleView{
		public void show();
		public void hide();
		public Element getElement();
	}
	
	private List<IPresenter> presenters = new ArrayList<IPresenter>(); 
	
	private IDisplay view;
	private IPlayerServices playerServices;
	private Group group;
	private JavaScriptObject	jsObject;
	private boolean isVisible;
	
	
	public GroupPresenter(Group group, IPlayerServices services){

		this.group = group;
		this.playerServices = services;
		isVisible = group.isVisible();
		
		connectHandlers();
	}
	
	public String getId() {
		return group.getId(); 
	}
	
	private void connectHandlers() {
		
		EventBus eventBus = playerServices.getEventBus();
		
		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			public void onResetPage(ResetPageEvent event) {
				reset(event.getIsOnlyWrongAnswers());
			}
		});
	}
	
	@Override
	public void addView(IModuleView view) {

		if(view instanceof IDisplay){
			this.view = (IDisplay) view;
		}
		
	}

	public boolean hasView() {
	    return this.view != null;
	}

	@Override
	public IModuleModel getModel() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setShowErrorsMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setWorkMode() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void reset(boolean onlyWrongAnswers) {
		isVisible = group.isVisible();
		if(view != null){
			if(isVisible){
				view.show();
			}
			else{
				view.hide();
			}
		}
		
	}
	
	public void hide() {
		if(view != null){
			this.isVisible = false; 
			view.hide();
		}
		for(IPresenter p : presenters) {
			setVisible(p, false);
		}
	}
	
	public void show() {
		if(view != null){
			this.isVisible = true; 
			view.show();
		}
		for(IPresenter p : presenters) {
			setVisible(p, true);
		}
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		// TODO Auto-generated method stub
		
	}
	
	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	@Override
	public void setDisabled(boolean value) {
		// calling setDisabled from this place would break gradual show answers, as it saves the state of the presenter
		// and it cannot check if all presenters in group are disabled
	}

	@Override
	public boolean isDisabled() {
		return false;
	}

	public void addPresenter(IPresenter p) {
		presenters.add(p); 
	}
	
	private native void setVisible(IPresenter p, boolean isVisible) /*-{
		var presenter = p.@com.lorepo.icplayer.client.module.api.IPresenter::getAsJavaScript()(); 
		if(isVisible && presenter.show){
			presenter.show(); 
		}else if (!isVisible && presenter.hide){
			presenter.hide(); 
		}
	}-*/;
	
	
	private native JavaScriptObject initJSObject(GroupPresenter g) /*-{
		var presenter = function() {};

		presenter.show = function() {
			g.@com.lorepo.icplayer.client.model.page.group.GroupPresenter::show()();
		};

		presenter.hide = function() {
			g.@com.lorepo.icplayer.client.model.page.group.GroupPresenter::hide()();
		};
	
		return presenter;
	}-*/;

	
	public Group getGroup() {
		return group; 
	}

	@Override
	public String getSerialId() {
		return group.getId();
	}

	@Override
	public String getState() {
		return Boolean.toString(isVisible);
	}

	@Override
	public void setState(String state) {
		if (group.isDiv()) {
			isVisible = Boolean.parseBoolean(state);
			if(!isVisible){
				view.hide(); 
			} else {
				view.show();
			}
		}
	}
}
