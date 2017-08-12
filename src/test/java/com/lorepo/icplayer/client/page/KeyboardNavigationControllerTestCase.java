package com.lorepo.icplayer.client.page;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Test;

public class KeyboardNavigationControllerTestCase {
	
	@Test
	public void sortModulesFromTextToSpeech () {
		KeyboardNavigationController nav = new KeyboardNavigationController();
		List<String> modulesFromPage = new ArrayList<String>(Arrays.asList("mod1", "mod2"));
		List<String> modulesNamesFromTTS = new ArrayList<String>(Arrays.asList("mod3", "mod4"));
		
		List<String> result = nav.sortModulesFromTextToSpeech(modulesFromPage, modulesNamesFromTTS);
		
		assertEquals(result, new ArrayList<String>(Arrays.asList("mod3", "mod4")));
	}
}
