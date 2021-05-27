package com.lorepo.icplayer.client.module.text;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.GWTPowerMockitoTest;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.reflect.Whitebox;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.*;


@PrepareForTest({TextView.class})
public class GWTPrintableTextModelTestCase extends GWTPowerMockitoTest {

	private final String PAGE_VERSION = "2";
	private final String GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"Q06VkA-3\" class=\"printable_gap\">&nbsp;</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"Q06VkA-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
	private String MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML;

	private TextModel model = null;
	private TextPrintable printable = null;
	private String gapUniqueId;

	private String getPrintableHTML(boolean showAnswers) {
		return printable.getPrintableHTML("myText", showAnswers);
	}

	private String idToGapUniqueId(int id) {
		return gapUniqueId + "-" + id;
	}

	private String valuesToJsonString(HashMap<String, String> values) {
		StringBuilder values_str = new StringBuilder();
		values_str.append("{");
		for (Map.Entry<String, String> value : values.entrySet()) {
			values_str.append("\"" + value.getKey() + "\":" + "\"" + value.getValue() + "\",");
		}
		if (values.size() > 0) {
			values_str.deleteCharAt(values_str.length() - 1);
		}
		values_str.append("}");

		return values_str.toString();
	}

	private void setPrintableState(HashMap<String, String> values) throws JSONException {
		JSONObject jo = new JSONObject();
		jo.put("gapUniqueId", gapUniqueId);
		jo.put("values", valuesToJsonString(values));
		jo.put("consumed", "{}");
		jo.put("disabled", "[false,false,false,false,false,false,false]");
		jo.put("isVisible", "true");
		jo.put("droppedElements", "{}");

		model.setPrintableState(jo.toString());
	}

	@Before
	public void initData() throws Exception {
		// PowerMockito - allows the use of constructor
		model = PowerMockito.spy(new TextModel());
		InputStream inputStream = getClass().getResourceAsStream("testdata/module6.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		model.load(element, "", PAGE_VERSION);

		gapUniqueId = model.getGapUniqueId();
		printable = new TextPrintable(model);

		MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive <input id=\"44V2rX-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"44V2rX-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";

		PowerMockito.when(model.getPrintable()).thenReturn(PrintableMode.YES);
	}

	@Test
	public void getPrintableHTMLWhenPrintableModeHasNotBeenSet() throws Exception {
		PowerMockito.when(model.getPrintable()).thenReturn(PrintableMode.NO);
		setPrintableState(new HashMap<String, String>());
		assertNull(getPrintableHTML(true));
		assertNull(getPrintableHTML(false));
	}

	@Test
	public void getPrintableHTMLWhenPrintableModeHasBeenSet() throws Exception {
		setPrintableState(new HashMap<String, String>());
		assertNotNull(getPrintableHTML(true));
		assertNotNull(getPrintableHTML(false));
	}

	@Test
	public void getPrintableHTMLWhenPrintableStateIsEmpty() {
		model.setPrintableState("");
		String resultTrue = removeIDs(getPrintableHTML(true));
		String resultFalse = removeIDs(getPrintableHTML(false));
		String expected = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>like</u></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>dont like</u></span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"AYxqB3-3\" class=\"printable_gap\">Volvo</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / <u>DEF</u> / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"AYxqB3-5\" class=\"printable_gap\">Audi</span>.</p> </div>";
		expected = removeIDs(expected);
		assertEquals(expected, resultTrue);
		assertEquals(removeIDs(GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML), resultFalse);
	}

	@Test
	public void getPrintableHTMLWithoutUserAnswers() throws JSONException {
		setPrintableState(new HashMap<String, String>());
		String resultTrue = removeIDs(getPrintableHTML(true));
		String resultFalse = removeIDs(getPrintableHTML(false));
		String expected = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"xCZFG8-3\" class=\"printable_gap\">&nbsp;</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"xCZFG8-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
		expected = removeIDs(expected);
		assertEquals(expected, resultTrue);
		assertEquals(removeIDs(GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML), resultFalse);
	}

	@Test
	public void getPrintableHTMLWithFewRightAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(3), "Volvo");
		setPrintableState(values);

		String resultTrue = removeIDs(getPrintableHTML(true));
		String resultFalse = removeIDs(getPrintableHTML(false));
		String expectedTrue = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <span class=\"ic_text-correct-answer\"><u>like</u></span></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"muZqbf-3\" class=\"printable_gap ic_text-correct-answer\">Volvo</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"muZqbf-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
		expectedTrue = removeIDs(expectedTrue);
		String expectedFalse = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>like</u></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"muZqbf-3\" class=\"printable_gap\">Volvo</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"muZqbf-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
		expectedFalse = removeIDs(expectedFalse);

		assertEquals(expectedTrue, resultTrue);
		assertEquals(expectedFalse, resultFalse);
	}

	@Test
	public void getPrintableHTMLWithFewWrongAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "aaaaa aa");
		values.put(idToGapUniqueId(3), "123");
		setPrintableState(values);
		String expectedTrue = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\"><span class=\"ic_text-wrong-answer\"><u>aaaaa aa</u></span> / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"AWx4X9-3\" class=\"printable_gap ic_text-wrong-answer\">123</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"AWx4X9-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
		expectedTrue = removeIDs(expectedTrue);
		String expectedFalse = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\"><u>aaaaa aa</u> / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"VX8rzg-3\" class=\"printable_gap\">123</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"VX8rzg-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
		expectedFalse = removeIDs(expectedFalse);
		String result1 = removeIDs(getPrintableHTML(true));
		String result2 = removeIDs(getPrintableHTML(false));
		assertEquals(expectedTrue, result1);
		assertEquals(expectedFalse, result2);
	}

	@Test
	public void getPrintableHTMLWithFewRightAndWrongAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "aaaaa aa");
		values.put(idToGapUniqueId(3), "Volvo");
		values.put(idToGapUniqueId(4), "ABC");
		setPrintableState(values);

		String expectedTrue = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\"><span class=\"ic_text-wrong-answer\"><u>aaaaa aa</u></span> / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"qgQInL-3\" class=\"printable_gap ic_text-correct-answer\">Volvo</span>.</p> <p>She <span class=\"printable_dropdown\"><span class=\"ic_text-wrong-answer\"><u>ABC</u></span> / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"qgQInL-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
		expectedTrue = removeIDs(expectedTrue);
		String expectedFalse = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\"><u>aaaaa aa</u> / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span id=\"qgQInL-3\" class=\"printable_gap\">Volvo</span>.</p> <p>She <span class=\"printable_dropdown\"><u>ABC</u> / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span id=\"qgQInL-5\" class=\"printable_gap\">&nbsp;</span>.</p> </div>";
		expectedFalse = removeIDs(expectedFalse);
		String result1 = removeIDs(getPrintableHTML(true));
		String result2 = removeIDs(getPrintableHTML(false));

		assertEquals(expectedTrue, result1);
		assertEquals(expectedFalse, result2);
	}


	@Test
	public void makePrintableDropdownsWithoutUserAnswers() throws Exception {
		setPrintableState(new HashMap<String, String>());

		String resultTrue = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		String resultFalse = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		resultTrue = removeIDs(resultTrue);
		resultFalse = removeIDs(resultFalse);
		String expectedTrue = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive <input id=\"44V2rX-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"44V2rX-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";
		expectedTrue = removeIDs(expectedTrue);

		assertEquals(expectedTrue,resultTrue);
		assertEquals(removeIDs(MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML), resultFalse);
	}

	@Test
	public void makePrintableDropdownsWithOnlyRightAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(2), "dont like");
		values.put(idToGapUniqueId(4), "DEF");
		setPrintableState(values);

		String expectedTrue = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <span class=\"ic_text-correct-answer\"><u>like</u></span></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <span class=\"ic_text-correct-answer\"><u>dont like</u></span></span> him very much (like).</p> <p>He likes to drive <input id=\"hwOM23-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\">ABC / <span class=\"ic_text-correct-answer\"><u>DEF</u></span> / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"hwOM23-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";
		expectedTrue = removeIDs(expectedTrue);
		String expectedFalse = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>like</u></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>dont like</u></span> him very much (like).</p> <p>He likes to drive <input id=\"hwOM23-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\">ABC / <u>DEF</u> / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"hwOM23-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";
		expectedFalse = removeIDs(expectedFalse);

		String resultTrue = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		String resultFalse = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		resultTrue = removeIDs(resultTrue);
		resultFalse = removeIDs(resultFalse);

		assertEquals(expectedTrue, resultTrue);
		assertEquals(expectedFalse, resultFalse);
	}

	@Test
	public void makePrintableDropdownsWithOnlyWrongAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "123");
		values.put(idToGapUniqueId(2), "456");
		values.put(idToGapUniqueId(4), "ABC");
		setPrintableState(values);

		String expectedTrue = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive <input id=\"DKa3YI-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\"><span class=\"ic_text-wrong-answer\"><u>ABC</u></span> / DEF / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"DKa3YI-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";
		expectedTrue = removeIDs(expectedTrue);
		String expectedFalse = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive <input id=\"DKa3YI-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\"><u>ABC</u> / DEF / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"DKa3YI-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";
		expectedFalse = removeIDs(expectedFalse);

		String resultTrue = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		String resultFalse = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		resultTrue = removeIDs(resultTrue);
		resultFalse = removeIDs(resultFalse);

		assertEquals(expectedTrue, resultTrue);
		assertEquals(expectedFalse, resultFalse);
	}

	@Test
	public void makePrintableDropdownsWithRightAndWrongAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(2), "dont like");
		values.put(idToGapUniqueId(4), "ABC");
		setPrintableState(values);

		String expectedTrue = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <span class=\"ic_text-correct-answer\"><u>like</u></span></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <span class=\"ic_text-correct-answer\"><u>dont like</u></span></span> him very much (like).</p> <p>He likes to drive <input id=\"eXyGEY-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\"><span class=\"ic_text-wrong-answer\"><u>ABC</u></span> / DEF / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"eXyGEY-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";
		expectedTrue = removeIDs(expectedTrue);
		String expectedFalse = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>like</u></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>dont like</u></span> him very much (like).</p> <p>He likes to drive <input id=\"eXyGEY-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\"><u>ABC</u> / DEF / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"eXyGEY-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";
		expectedFalse = removeIDs(expectedFalse);

		String resultTrue = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		String resultFalse = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		resultTrue = removeIDs(resultTrue);
		resultFalse = removeIDs(resultFalse);

		assertEquals(expectedTrue, resultTrue);
		assertEquals(expectedFalse, resultFalse);
	}

	private String removeIDs(String raw) {
		return raw.replaceAll("id=\".*?\"","id");
	}
}
