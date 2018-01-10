package com.lorepo.icplayer.client.module;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;

import com.lorepo.icplayer.client.model.layout.PageLayout;

public class StyledModuleTest {
	
	StyledModule testedModule = new StyledModule("testModule");
	Set<PageLayout> layoutsWithoutChange = new HashSet<PageLayout>(Arrays.asList(
			new PageLayout("desktop", "desktop"),
			new PageLayout("mobile", "mobile")
			));
	
	Set<PageLayout> layoutsRemovedDesktop = new HashSet<PageLayout>(Arrays.asList(
			new PageLayout("mobile", "mobile")
			));
	
	Set<PageLayout> layoutsWithNewDefault = new HashSet<PageLayout>();
	
	HashMap<String, String> notChangedStyleClasses = new HashMap<String, String>();
	HashMap<String, String> notChangedInlineStyles = new HashMap<String, String>();
	HashMap<String, String> removedDesktopInlineStyles = new HashMap<String, String>();
	HashMap<String, String> removedDesktopStyleClasses = new HashMap<String, String>();
	
	HashMap<String, String> newDefaultInlineStyles = new HashMap<String, String>();
	HashMap<String, String> newDefaultStyleClasses = new HashMap<String, String>();
	
	private void prepareInitialData() {
		PageLayout defaultPL = new PageLayout("default", "default");
		defaultPL.setIsDefault(true);
		
		this.layoutsWithoutChange.add(defaultPL);
		this.layoutsRemovedDesktop.add(defaultPL);
		
		this.notChangedStyleClasses.put("default", "defaultStyleClass");
		this.notChangedStyleClasses.put("mobile", "mobileStyleClass");
		this.notChangedStyleClasses.put("desktop", "desktopStyleClass");
		
		this.notChangedInlineStyles.put("default", "defaultInlineStyle");
		this.notChangedInlineStyles.put("mobile", "mobileInlineStyle");
		this.notChangedInlineStyles.put("desktop", "desktopInlineStyle");
		
		
		this.removedDesktopInlineStyles.put("default", "defaultInlineStyle");
		this.removedDesktopInlineStyles.put("mobile", "mobileInlineStyle");
		
		this.removedDesktopStyleClasses.put("default", "defaultStyleClass");
		this.removedDesktopStyleClasses.put("mobile", "mobileStyleClass");
		
		
		PageLayout newDefault = new PageLayout("newDefault", "newDefault");
		newDefault.setIsDefault(true);
		
		this.layoutsWithNewDefault.add(newDefault);
		this.layoutsWithNewDefault.add(new PageLayout("newMobile", "newDefault"));
		this.layoutsWithNewDefault.add(new PageLayout("newDesktop", "newDefault"));
		this.layoutsWithNewDefault.add(new PageLayout("mobile", "mobile"));
		
		this.newDefaultInlineStyles.put("newDefault", "defaultInlineStyle");
		this.newDefaultInlineStyles.put("newDesktop", "defaultInlineStyle");
		this.newDefaultInlineStyles.put("newMobile", "defaultInlineStyle");
		this.newDefaultInlineStyles.put("mobile", "mobileInlineStyle");
		
		this.newDefaultStyleClasses.put("newDefault", "defaultStyleClass");
		this.newDefaultStyleClasses.put("newDesktop", "defaultStyleClass");
		this.newDefaultStyleClasses.put("newMobile", "defaultStyleClass");
		this.newDefaultStyleClasses.put("mobile", "mobileStyleClass");
	}
	
	@Before
	public void setUp() {
		this.prepareInitialData();
		
		testedModule.setSemiResponsiveLayoutID("default");
		testedModule.setInlineStyle("defaultInlineStyle");
		testedModule.setStyleClass("defaultStyleClass");
		
		testedModule.setSemiResponsiveLayoutID("mobile");
		testedModule.setInlineStyle("mobileInlineStyle");
		testedModule.setStyleClass("mobileStyleClass");
		
		testedModule.setSemiResponsiveLayoutID("desktop");
		testedModule.setInlineStyle("desktopInlineStyle");
		testedModule.setStyleClass("desktopStyleClass");
	}

	@Test
	public void syncingTheSameLayoutsDontChangeStyleClassess() {
		testedModule.syncSemiResponsiveStyles(this.layoutsWithoutChange);
		
		HashMap<String, String> result = testedModule.getStylesClasses();
		
		assertEquals(this.notChangedStyleClasses, result);
	}
	
	@Test
	public void syncingTheSameLayoutsDontChangeInlineStyles() {
		testedModule.syncSemiResponsiveStyles(this.layoutsWithoutChange);
		
		HashMap<String, String> result = testedModule.getInlineStyles();
		
		assertEquals(this.notChangedInlineStyles, result);
	}
	
	@Test
	public void syncingRemovesOldKeysFromInlineStyles() {
		testedModule.syncSemiResponsiveStyles(this.layoutsRemovedDesktop);
		
		HashMap<String, String> result = testedModule.getInlineStyles();
		
		assertEquals(this.removedDesktopInlineStyles, result);
	}

	@Test
	public void syncingRemovesOldKeysFromStyleClasses() {
		testedModule.syncSemiResponsiveStyles(this.layoutsRemovedDesktop);
		
		HashMap<String, String> result = testedModule.getStylesClasses();
		
		assertEquals(this.removedDesktopStyleClasses, result);
	}
	
	@Test
	public void syncingWithNewDefaultLayoutShouldCreateAllNewsFromDefaultAndRemoveUnusedLayouts() {
		testedModule.syncSemiResponsiveStyles(this.layoutsWithNewDefault);
		
		HashMap<String, String> resultInlineStyles = testedModule.getInlineStyles();
		HashMap<String, String> resultStyleClasses = testedModule.getStylesClasses();
		
		assertEquals(this.newDefaultStyleClasses, resultStyleClasses);
		assertEquals(this.newDefaultInlineStyles, resultInlineStyles);
	}
	
	@Test
	public void syncingEmptyStylesCantCreateNullValues() {
		StyledModule testedModule = new StyledModule("testModule");
		
		testedModule.syncSemiResponsiveStyles(this.layoutsWithoutChange);
		
		
//		desktop, default, mobile
		testedModule.setSemiResponsiveLayoutID("desktop");
		assertEquals("", testedModule.getStyleClass());
		assertEquals("", testedModule.getInlineStyle());

		testedModule.setSemiResponsiveLayoutID("default");
		assertEquals("", testedModule.getStyleClass());
		assertEquals("", testedModule.getInlineStyle());

		testedModule.setSemiResponsiveLayoutID("mobile");
		assertEquals("", testedModule.getStyleClass());
		assertEquals("", testedModule.getInlineStyle());
	}
}
