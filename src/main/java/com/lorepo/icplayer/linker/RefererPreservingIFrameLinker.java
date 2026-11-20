package com.lorepo.icplayer.linker;

import com.google.gwt.core.ext.LinkerContext;
import com.google.gwt.core.ext.TreeLogger;
import com.google.gwt.core.ext.linker.LinkerOrder;
import com.google.gwt.core.ext.linker.LinkerOrder.Order;
import com.google.gwt.core.ext.linker.Shardable;
import com.google.gwt.core.linker.IFrameLinker;

/**
 * Standard GWT iframe linker whose bootstrap loads the compiled *.cache.html
 * by setting the iframe src directly. The default template navigates from a
 * "javascript:''" document, for which WebKit sends no Referer header, so
 * Referer-protected hosts (e.g. S3 with aws:Referer) reject the request.
 */
@LinkerOrder(Order.PRIMARY)
@Shardable
public class RefererPreservingIFrameLinker extends IFrameLinker {

	@Override
	public String getDescription() {
		return "Standard (Referer-preserving)";
	}

	@Override
	protected String getSelectionScriptTemplate(TreeLogger logger, LinkerContext context) {
		return "com/lorepo/icplayer/linker/RefererPreservingIFrameTemplate.js";
	}
}
