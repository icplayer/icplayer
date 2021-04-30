package com.lorepo.icplayer.client.module.api.player;
import java.util.List;
import com.google.gwt.core.client.JavaScriptObject;

public interface IAssetsService {
	public String getContentType (String href);
	public List<JavaScriptObject> getAssetsAsJS();
}
