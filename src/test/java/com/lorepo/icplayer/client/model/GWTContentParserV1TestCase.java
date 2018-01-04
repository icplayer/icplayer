package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.screen.DeviceOrientation;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.utils.ContentFactoryMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTContentParserV1TestCase extends GwtTest {
	
	private HashMap<String, PageLayout> contentV1ParserLayouts = new HashMap<String, PageLayout>(); 
	private HashMap<String, CssStyle> contentV1ParserStyles = new HashMap<String, CssStyle>();
	
	private HashMap<String, PageLayout> contentV1C1ParserLayouts = new HashMap<String, PageLayout>();
	private HashMap<String, CssStyle> contentV1C1ParserStyles = new HashMap<String, CssStyle>();
	
	@Before
	public void initData() {
		this.initContentV1ParserLayouts();
		this.initContentV1ParserStyles();
		
		this.initContentV1C1ParserLayouts();
		this.initContentV1C1ParserStyles();
	}
	
	private void initContentV1C1ParserStyles() {
		CssStyle defaultStyle = new CssStyle("default", "default", "default-style");
		CssStyle style320 = new CssStyle("320", "320", "320-style");
		CssStyle styleTT = new CssStyle("TT", "TT", "320-style");
		CssStyle styleT2 = new CssStyle("T2", "T2", "T2-style");
		
		this.contentV1C1ParserStyles.put(defaultStyle.getID(), defaultStyle);
		this.contentV1C1ParserStyles.put(style320.getID(), style320);
		this.contentV1C1ParserStyles.put(styleTT.getID(), styleTT);
		this.contentV1C1ParserStyles.put(styleT2.getID(), styleT2);
	}

	private void initContentV1C1ParserLayouts() {
		PageLayout defaultV1 = PageLayout.createDefaultPageLayout();
		defaultV1.setThreshold(1000);
		defaultV1.setDeviceOrientation(DeviceOrientation.horizontal);
		defaultV1.useDeviceOrientation(true);
		defaultV1.setCssID("default");
		
		PageLayout layout320 = new PageLayout("320", "320");
		layout320.useDeviceOrientation(true);
		layout320.setDeviceOrientation(DeviceOrientation.vertical);
		layout320.setThreshold(320);
		layout320.setCssID(layout320.getID());
		
		PageLayout layoutTT = new PageLayout("TT", "TT");
		layoutTT.useDeviceOrientation(false);
		layoutTT.setThreshold(11);
		layoutTT.setCssID("TT");
		
		PageLayout layoutT2 = new PageLayout("T2", "T2");
		layoutT2.useDeviceOrientation(false);
		layoutT2.setThreshold(22);
		layoutT2.setCssID("T2");
		
		this.contentV1C1ParserLayouts.put("default", defaultV1);
		this.contentV1C1ParserLayouts.put(layout320.getID(), layout320);
		this.contentV1C1ParserLayouts.put(layoutTT.getID(), layoutTT);
		this.contentV1C1ParserLayouts.put(layoutT2.getID(), layoutT2);
		
	}

	private void initContentV1ParserStyles() {
		CssStyle defaultStyle = new CssStyle("default", "default", "style-default");
		CssStyle style320 = new CssStyle("320", "320", "style-320");
		
		this.contentV1ParserStyles.put(defaultStyle.getID(), defaultStyle);
		this.contentV1ParserStyles.put(style320.getID(), style320);
	}

	private void initContentV1ParserLayouts() {
		PageLayout defaultV1 = PageLayout.createDefaultPageLayout();
		defaultV1.setThreshold(1000);
		defaultV1.setDeviceOrientation(DeviceOrientation.horizontal);
		defaultV1.useDeviceOrientation(true);
		defaultV1.setCssID("default");
		
		PageLayout layout320 = new PageLayout("320", "320");
		layout320.useDeviceOrientation(true);
		layout320.setDeviceOrientation(DeviceOrientation.vertical);
		layout320.setThreshold(320);
		layout320.setCssID(layout320.getID());
		
		this.contentV1ParserLayouts.put("default", defaultV1);
		this.contentV1ParserLayouts.put(layout320.getID(), layout320);
	}

	@Test
	public void syncingExistingV1HaveToCreateOneToOneRelationOfLayoutAndCssStyle() throws SAXException, IOException {
		ContentFactoryMockup cf =  ContentFactoryMockup.getInstanceWithAllPages();
		Content content = cf.loadFromFile("testdata/contentV1Parser.xml");
		
		
		HashMap<String, CssStyle> styles = content.getStyles();
		HashMap<String, PageLayout> layouts = content.getLayouts();
		
		assertEquals(this.contentV1ParserLayouts, layouts);
		assertEquals(this.contentV1ParserStyles, styles);
	}
	
	@Test
	public void syncingLayoutsWhoUseTheSameCssStyleHaveToCreateSeparateCopiesForThemAndRemoveAdditional() throws SAXException, IOException {
		ContentFactoryMockup cf =  ContentFactoryMockup.getInstanceWithAllPages();
		Content content = cf.loadFromFile("testdata/contentV1Parser_c1.xml");
		
		
		HashMap<String, CssStyle> resultStyles = content.getStyles();
		HashMap<String, PageLayout> resultLayouts = content.getLayouts();
		
		assertEquals(this.contentV1C1ParserLayouts, resultLayouts);
		assertEquals(this.contentV1C1ParserStyles, resultStyles);
	}
}
