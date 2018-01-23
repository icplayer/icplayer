package com.lorepo.icplayer.client.module.api;


public interface IPresenter {
	public void addView(IModuleView view);
	public IModuleModel getModel();
	public void setShowErrorsMode();
	public void setWorkMode();
	public void reset();
}
