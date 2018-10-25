package com.lorepo.icplayer.client.module.text.mockup;

import com.lorepo.icplayer.client.module.text.TextModel;
import com.lorepo.icplayer.client.module.text.TextView;

public class TextViewMockupExtendFromOriginal extends TextView{

	public TextViewMockupExtendFromOriginal(TextModel module, boolean isPreview) {
		super(module, isPreview);
	}
	
	//mock for method 
	public void mathJaxLoaded() {
		
	}

}
