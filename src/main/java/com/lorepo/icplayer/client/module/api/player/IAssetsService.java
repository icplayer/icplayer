package com.lorepo.icplayer.client.module.api.player;
import java.util.List;
import java.util.Map;
import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.model.asset.ScriptAsset;

public interface IAssetsService {
	public String getContentType (String href);
	public List<JavaScriptObject> getAssetsAsJS();
	public Map<String, ScriptAsset> getAttachedLibraries();
}
