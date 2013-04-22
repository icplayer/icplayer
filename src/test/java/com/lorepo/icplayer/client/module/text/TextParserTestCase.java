package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Iterator;

import org.junit.Test;

import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;

public class TextParserTestCase {

	@Test
	public void testNoMarkup() {
		
		TextParser parser = new TextParser();
		String srcText ="This is <p>html</p> tekst";
		ParserResult parsed;
		
		parsed = parser.parse(srcText);
		
		assertEquals(srcText, parsed.parsedText);
	}

	@Test
	public void testScoreMarkup() {
		
		TextParser parser = new TextParser();
		String srcText ="This is {{score.total}} out of {{score.max}}";
		ParserResult parsed;
		
		parser.addVariable("score.total", "22");
		parser.addVariable("score.max", "23");
		parsed = parser.parse(srcText);
		
		assertEquals("This is 22 out of 23", parsed.parsedText);
	}

	@Test
	public void testInputMarkup() {
		
		String expected = "This is <input id='-1' type='edit' size='3' class='ic_gap'/>" + 
		" and <input id='-2' type='edit' size='2' class='ic_gap'/>";
		TextParser parser = new TextParser();
		String srcText ="This is {{2:ala}} and {{2:as}}";
		ParserResult parsed;
		
		parsed = parser.parse(srcText);
		
		assertEquals(expected, parsed.parsedText);
	}

	@Test
	public void draggableGaps() {
		
		String expected = "This is <span id='-1' class='ic_draggableGapEmpty'>&nbsp;</span> and <span id='-2' class='ic_draggableGapEmpty'>&nbsp;</span>";
		TextParser parser = new TextParser();
		parser.setUseDraggableGaps(true);
		String srcText ="This is {{2:ala}} and {{2:as}}";
		ParserResult parsed;
		
		parsed = parser.parse(srcText);
		
		assertEquals(expected, parsed.parsedText);
	}

	@Test
	public void testGapInfos() {
		
		TextParser parser = new TextParser();
		String srcText ="This is {{2:ala}} and {{3:as}}";
		GapInfo gi;
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<GapInfo> gapInfos = parsed.gapInfos.iterator();
		
		assertTrue(gapInfos.hasNext());
		gi = gapInfos.next();
		assertEquals("xcf-1", gi.getId());
		assertEquals(2, (int)gi.getValue());
		assertTrue(gi.isCorrect("ala"));
		
		assertTrue(gapInfos.hasNext());
		gi = gapInfos.next();
		assertEquals("xcf-2", gi.getId());
		assertEquals(3, (int)gi.getValue());
		assertTrue(gi.isCorrect("as"));
		
	}

	/**
	 * Problem wystepuje gdy 2 gapy mają taką samą odpowiedź
	 */
	@Test
	public void testGap2() {
		
		TextParser parser = new TextParser();
		String srcText =
				"A1: {{1:1/2}} A2: {{1:1/3}} A3: {{1:5/6}} A4: {{1:1/3}}"; 
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<GapInfo> gapInfos = parsed.gapInfos.iterator();

		// Policzenie gap. 
		int count = 0;
		while(gapInfos.hasNext()){
			gapInfos.next();
			count ++;
		}

		// Powinny być 4
		assertEquals(4, count);
	}

	
	@Test
	public void multiAnswerGap() {
		
		TextParser parser = new TextParser();
		String srcText = "A1: \\gap{ala|ma|kota}"; 
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<GapInfo> gapInfos = parsed.gapInfos.iterator();

		assertTrue(gapInfos.hasNext());
		GapInfo gi = gapInfos.next();
		assertEquals("xcf-1", gi.getId());
		assertEquals(1, (int)gi.getValue());
		assertTrue(gi.isCorrect("ala"));
		assertTrue(gi.isCorrect("ma"));
	}

	@Test
	public void multiAnswerDraggable() {
		
		TextParser parser = new TextParser();
		String srcText = "A1: \\gap{ala|ma|kota}"; 
		
		parser.setId("xcf");
		parser.setUseDraggableGaps(true);
		ParserResult parsed = parser.parse(srcText);
		Iterator<GapInfo> gapInfos = parsed.gapInfos.iterator();

		assertTrue(gapInfos.hasNext());
		GapInfo gi = gapInfos.next();
		assertEquals("xcf-1", gi.getId());
		assertEquals(1, (int)gi.getValue());
		assertTrue(gi.isCorrect("ala"));
		assertTrue(gi.isCorrect("kota"));
	}

	@Test
	public void testChoiceInfos() {
		
		TextParser parser = new TextParser();
		String srcText ="This is {{2:ala|ola|as}} and {{3:as|ola|ala}}";
		InlineChoiceInfo gi;
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<InlineChoiceInfo> choiceInfos = parsed.choiceInfos.iterator();
		
		assertTrue(choiceInfos.hasNext());
		gi = choiceInfos.next();
		assertEquals("xcf-1", gi.getId());
		assertEquals(2, (int)gi.getValue());
		assertEquals("ala", gi.getAnswer());
		
		assertTrue(choiceInfos.hasNext());
		gi = choiceInfos.next();
		assertEquals("xcf-2", gi.getId());
		assertEquals(3, (int)gi.getValue());
		assertEquals("as", gi.getAnswer());
		
	}

	@Test
	public void testChoiceInfos2() {
		
		TextParser parser = new TextParser();
		String srcText ="This is {{2:ala|ola|as}} and {{3:as|ola|ala}}";
		InlineChoiceInfo gi;
		String distractor;
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<InlineChoiceInfo> choiceInfos = parsed.choiceInfos.iterator();
		
		assertTrue(choiceInfos.hasNext());
		gi = choiceInfos.next();
		assertEquals("xcf-1", gi.getId());
		assertEquals(2, (int)gi.getValue());
		assertEquals("ala", gi.getAnswer());
		
		Iterator<String> distractors = gi.getDistractors();

		assertTrue(distractors.hasNext());
		distractor = distractors.next();
		assertEquals("ala", distractor);

		assertTrue(distractors.hasNext());
		distractor = distractors.next();
		assertEquals("as", distractor);
		
		assertTrue(distractors.hasNext());
		distractor = distractors.next();
		assertEquals("ola", distractor);

	}
	

	@Test
	public void testChoiceInfos3() {
		
		TextParser parser = new TextParser();
		String srcText ="This is {{2:ala  2|ola|as}} and {{3:as   3|ola|ala}}";
		InlineChoiceInfo gi;
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<InlineChoiceInfo> choiceInfos = parsed.choiceInfos.iterator();
		
		assertTrue(choiceInfos.hasNext());
		gi = choiceInfos.next();
		assertEquals("xcf-1", gi.getId());
		assertEquals(2, (int)gi.getValue());
		assertEquals("ala 2", gi.getAnswer());
		
		assertTrue(choiceInfos.hasNext());
		gi = choiceInfos.next();
		assertEquals("xcf-2", gi.getId());
		assertEquals(3, (int)gi.getValue());
		assertEquals("as 3", gi.getAnswer());
		
	}
	

	@Test
	public void gapMath() {
		
		TextParser parser = new TextParser();
		parser.setUseDraggableGaps(true);
		String srcText ="This is {{1:\\(\\cfrac{1}{10^4}\\)}}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<GapInfo> gapInfos = parsed.gapInfos.iterator();

		assertTrue(gapInfos.hasNext());
		GapInfo gi = gapInfos.next();
		
		assertEquals("xcf-1", gi.getId());
		assertEquals(1, (int)gi.getValue());
		assertTrue(gi.isCorrect("\\(\\cfrac{1}{10^4}\\)"));
	}
	

	@Test
	public void gapMath2() {
		
		TextParser parser = new TextParser();
		parser.setUseDraggableGaps(true);
		String srcText ="{{ 1:\\(G_{1}\\)}}<br>";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<GapInfo> gapInfos = parsed.gapInfos.iterator();

		assertTrue(gapInfos.hasNext());
		GapInfo gi = gapInfos.next();
		
		assertEquals("xcf-1", gi.getId());
		assertEquals(1, (int)gi.getValue());
		assertTrue(gi.isCorrect("\\(G_{1}\\)"));
	}


	@Test
	public void gapMath3() {
		
		TextParser parser = new TextParser();
		parser.setUseDraggableGaps(true);
		String srcText ="{{ 1 :\\(G_{1}\\)}}<br>";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		Iterator<GapInfo> gapInfos = parsed.gapInfos.iterator();

		assertTrue(gapInfos.hasNext());
		GapInfo gi = gapInfos.next();
		
		assertEquals("xcf-1", gi.getId());
		assertEquals(1, (int)gi.getValue());
		assertTrue(gi.isCorrect("\\(G_{1}\\)"));
	}


	@Test
	public void gapMath4() {
		
		TextParser parser = new TextParser();
		String srcText ="\\gap{10|{5}{2}}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(1, parsed.gapInfos.size());

		GapInfo gi = parsed.gapInfos.get(0);
		assertTrue(gi.isCorrect("10"));
		assertTrue(gi.isCorrect("{5}{2}"));
	}
	

	@Test
	public void gapMath5() {
		
		TextParser parser = new TextParser();
		String srcText ="\\gap{\\(f(x)=\\frac{x}{|x|}\\)}";
		
		parser.setId("xcf");
		parser.setUseDraggableGaps(true);
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(1, parsed.gapInfos.size());

		GapInfo gi = parsed.gapInfos.get(0);
		assertTrue(gi.isCorrect("\\(f(x)=\\frac{x}{|x|}\\)"));
	}
	

	@Test
	public void testLinks() {
		
		TextParser parser = new TextParser();
		String srcText ="This is [[page1|Link do strony 1]] and [[page2|Link do strony 2]]";
		String expectedText ="This is <a id='xcf-1' class='ic_definitionLink' href='#'>Link do strony 1</a> and <a id='xcf-2' class='ic_definitionLink' href='#'>Link do strony 2</a>";
		
		parser.setId("xcf");
		ParserResult parsedText = parser.parse(srcText);
		Iterator<LinkInfo> it = parsedText.linkInfos.iterator();
		expectedText = expectedText.replace("'xcf-1'", "'" + it.next().getId() + "'");
		expectedText = expectedText.replace("'xcf-2'", "'" + it.next().getId() + "'");

		assertEquals(expectedText, parsedText.parsedText);
	}

	@Test
	public void formattedLink() {
		
		TextParser parser = new TextParser();
		String srcText ="This is [[<span id='result_box' class='short_text' lang='en'><span class='hps'>Page1</span><span class='hps'></span></span>|Link do strony 1]]";
		
		parser.setId("xcf");
		ParserResult parsedText = parser.parse(srcText);

		Iterator<LinkInfo> it = parsedText.linkInfos.iterator();
		assertTrue(it.hasNext());
		LinkInfo info = it.next();
		assertEquals("Page1", info.getHref());
	}

	@Test
	public void testGap1() {
		
		TextParser parser = new TextParser();
		String srcText ="\\gap{answer1|answer2|answer3} \\gap{answer1|answer2|answer3}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(2, parsed.gapInfos.size());

	}
	
	
	@Test
	public void testDefinition1() {
		
		TextParser parser = new TextParser();
		String srcText ="\\def{słówko1} \\def{słówko2}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(2, parsed.linkInfos.size());

	}

	@Test
	public void testDefinition2() {
		
		TextParser parser = new TextParser();
		String srcText ="\\def{słówko1} \\def{słówko2}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		int index = parsed.parsedText.indexOf("słówko1");
		assertTrue(index > 0);
	}


	/**
	 * Błędna składania nie powinna sypać parsera
	 */
	@Test
	public void wrongSyntax() {
		
		TextParser parser = new TextParser();
		String srcText ="{{1 {{1:7200}}";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals("#ERROR#", parsed.parsedText);
	}

	
	@Test
	public void skipGapInMath() {
		
		TextParser parser = new TextParser();
		parser.setUseDraggableGaps(true);
		String srcText ="This is \\(\\cfrac{{1}}{10^4}\\) not a gap";
		
		parser.setId("xcf");
		ParserResult parsed = parser.parse(srcText);

		assertEquals("This is \\(\\cfrac{{1}}{10^4}\\) not a gap", parsed.parsedText);
	}

	@Test
	public void skipGaps() {
		
		TextParser parser = new TextParser();
		parser.skipGaps();
		String srcText ="This is {{2:ala}} and \\def{słówko1}";
		ParserResult parsed = parser.parse(srcText);
		
		assertEquals(1, parsed.linkInfos.size());
		assertTrue(parsed.parsedText.indexOf("{{2:ala}}") > 0);
	}
}
