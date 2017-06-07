package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import java.util.Iterator;
import org.junit.Test;
import com.lorepo.icplayer.client.module.text.InlineChoiceInfo;


public class InlineChoiceInfoTestCase {

	@Test
	public void testAddDistractor() {
		
		InlineChoiceInfo info = new InlineChoiceInfo("1", "aaaa", 1);
		
		info.addDistractor("---");
		info.addDistractor("ddd");
		info.addDistractor("aaa");
		info.addDistractor("ccccc");
		
		Iterator<String> distractors = info.getDistractors();
		
		assertEquals("---", distractors.next());
		assertEquals("aaa", distractors.next());
		assertEquals("ccccc", distractors.next());
		assertEquals("ddd", distractors.next());
	}

}
