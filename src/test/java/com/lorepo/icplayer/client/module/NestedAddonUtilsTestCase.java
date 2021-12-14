package com.lorepo.icplayer.client.module;

import com.google.gwt.dom.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class NestedAddonUtilsTestCase extends GwtTest {
	
	@Test
	public void emptyList() {
		String addonId = "test123";

		String result = NestedAddonUtils.getDefinition(addonId);
		
		assertEquals("\\addon{test123}", result);
	}

	@Test
	public void givenAddonIdWhenCallingGetPlaceholderThenGetCorrectPlaceholder() {
		String addonId = "test123";

		Element result = NestedAddonUtils.getPlaceholder(addonId);

		assertEquals("ic_addon_gap", result.getClassName());
		assertEquals("addonGap-test123", result.getId());
		assertEquals("test123", result.getAttribute("placeholder"));
		assertEquals("8", result.getAttribute("size"));
		assertEquals("", result.getAttribute("data-addon-value"));
	}

	@Test
	public void givenAddonIdWhenCallingGetPlaceholderInEditorModeThenGetCorrectPlaceholderWithDefinition() {
		String addonId = "test123";

		Element result = NestedAddonUtils.getPlaceholderInEditorMode(addonId);

		assertEquals("ic_addon_gap", result.getClassName());
		assertEquals("addonGap-test123", result.getId());
		assertEquals("test123", result.getAttribute("placeholder"));
		assertEquals("8", result.getAttribute("size"));
		assertEquals("\\addon{test123}", result.getAttribute("data-addon-value"));
	}

	@Test
	public void givenPlaceholderAndNewAddonIdWhenCallingUpdatePlaceholderThenGetCorrectPlaceholder() {
		String addonId = "test123";
		Element el = NestedAddonUtils.getPlaceholder("wrong");

		NestedAddonUtils.updatePlaceholder(addonId, el);

		assertEquals("ic_addon_gap", el.getClassName());
		assertEquals("addonGap-test123", el.getId());
		assertEquals("test123", el.getAttribute("placeholder"));
		assertEquals("8", el.getAttribute("size"));
		assertEquals("", el.getAttribute("data-addon-value"));
	}

	@Test
	public void givenEditorPlaceholderAndNewAddonIdWhenCallingUpdatePlaceholderInEditorModeThenGetCorrectPlaceholder() {
		String addonId = "test123";
		Element el = NestedAddonUtils.getPlaceholderInEditorMode("wrong");

		NestedAddonUtils.updatePlaceholderInEditorMode(addonId, el);

		assertEquals("ic_addon_gap", el.getClassName());
		assertEquals("addonGap-test123", el.getId());
		assertEquals("test123", el.getAttribute("placeholder"));
		assertEquals("8", el.getAttribute("size"));
		assertEquals("\\addon{test123}", el.getAttribute("data-addon-value"));
	}

}
