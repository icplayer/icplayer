package com.lorepo_patchers.icplayer.client.metadata;

import com.google.gwt.core.client.JavaScriptObject;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadata;

@PatchClass(ScoreWithMetadata.class)
public class ScoreWithMetadataPatcher {

	@PatchMethod
	public static JavaScriptObject getJSObject(ScoreWithMetadata self, ScoreWithMetadata x) {return null;}

}
