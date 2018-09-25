package com.lorepo.icplayer.client.model.page.group;
import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.image.ImageModule;
import com.lorepo.icplayer.client.module.image.ImagePresenter.IDisplay;

public class GroupPresenter implements IPresenter{

	
	public interface IDisplay extends IModuleView{
		public void show();
		public void hide();
		public Element getElement();
	}
	
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
				reset();
			}
		});
	}
	
	@Override
	public void addView(IModuleView view) {

		if(view instanceof IDisplay){
			this.view = (IDisplay) view;
		}
		
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
	public void reset() {
		isVisible = group.isVisible();
		if(view != null){
			if(group.isVisible()){
				view.show();
			}
			else{
				view.hide();
			}
		}
		
	}
	
	public void hide() {
		if(view != null){
			view.hide();
		}
	}
	
	public void show() {
		if(view != null){
			view.show();
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
	
	
	private native JavaScriptObject initJSObject(GroupPresenter g) /*-{
		var presenter = function() {};

		presenter.show = function() {
			g.@com.lorepo.icplayer.client.model.page.Group.GroupPresenter::show()();
		};

		presenter.hide = function() {
			g.@com.lorepo.icplayer.client.model.page.Group.GroupPresenter::hide()();
		};
	
		return presenter;
	}-*/;

}
