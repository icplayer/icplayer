package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.page.mockup.ModuleModelMockup;
import com.lorepo.icplayer.client.utils.ModuleFactoryUtils;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ModuleFactoryUtilsTestCase {
	
	@Test
	public void moduleIsCheckAnswersButton() {
		
		ModuleModelMockup moduleMockup = new ModuleModelMockup();
		moduleMockup.setButtonType("checkAnswers");
		
		assertEquals(true, ModuleFactoryUtils.isCheckAnswersButton(moduleMockup));
	}
	
	@Test
	public void moduleIsButtonButNotCheckAnswersButton() {
		
		ModuleModelMockup moduleMockup = new ModuleModelMockup();
		moduleMockup.setButtonType("reset");
		
		assertEquals(false, ModuleFactoryUtils.isCheckAnswersButton(moduleMockup));
	}
	
	@Test
	public void moduleTypeNameIsNull() {
		
		ModuleModelMockup moduleMockup = new ModuleModelMockup();
		moduleMockup.setModuleTypeName(null);
		
		assertEquals(false, ModuleFactoryUtils.isCheckAnswersButton(moduleMockup));
	}
}