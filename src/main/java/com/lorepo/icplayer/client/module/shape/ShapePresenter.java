package com.lorepo.icplayer.client.module.shape;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class ShapePresenter implements IPresenter {

	public interface IDisplay extends IModuleView {
		public Element getElement();
	}
	
	private IDisplay view;
	private ShapeModule model;
	private JavaScriptObject jsObject;
	
	public ShapePresenter(ShapeModule model, IPlayerServices services) {
		this.model = model;
	}

	@Override
	public void addView(IModuleView view) {
		if (view instanceof IDisplay) {
			this.view = (IDisplay) view;
		}
	}

	@Override
	public IModuleModel getModel() {
		return model;
	}
	
	public JavaScriptObject getAsJavaScript(){
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	
	private native JavaScriptObject initJSObject(ShapePresenter x) /*-{
		var presenter = function(){}
			
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.shape.ShapePresenter::getView()();
		}
		
		return presenter;
	}-*/;
	
	private Element getView(){
		return view.getElement();
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
	public void reset() {
		// Module is not an activity
	}
}
