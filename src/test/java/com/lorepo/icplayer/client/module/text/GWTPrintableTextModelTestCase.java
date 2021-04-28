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
	private final String GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML = "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"printable_gap\">&nbsp;</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"printable_gap\">&nbsp;</span>.</p> </div>";
	private String MAKE_PRINTABLE_INPUT_NOT_SHOWING_ANSWERS_HTML;
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

		MAKE_PRINTABLE_INPUT_NOT_SHOWING_ANSWERS_HTML = " <p>I <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-1\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"like\" aria-label=\"like\">like</option></select> you very much (like).</p> <p>You <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-2\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"dont like\" aria-label=\"dont like\">dont like</option></select> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"printable_gap\">&nbsp;</span>.</p> <p>She <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-4\"><option value=\"-\">---</option><option value=\"ABC\" aria-label=\"ABC\">ABC</option><option value=\"DEF\" aria-label=\"DEF\">DEF</option><option value=\"GHI\" aria-label=\"GHI\">GHI</option></select> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"printable_gap\">&nbsp;</span>.</p> ";
		MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML = " <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / like</span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / dont like</span> him very much (like).</p> <p>He likes to drive <input id=\"" + gapUniqueId + "-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"printable_dropdown\">ABC / DEF / GHI</span> him very much (like).</p> <p>It likes to drive <input id=\"" + gapUniqueId + "-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ";

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
		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>like</u></span> you very much (like).</p> <p>You <span class=\"printable_dropdown\">aaaaa aa / bbb bb / <u>dont like</u></span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"printable_gap\">Volvo</span>.</p> <p>She <span class=\"printable_dropdown\">ABC / <u>DEF</u> / GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"printable_gap\">Audi</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void getPrintableHTMLWithoutUserAnswers() throws JSONException {
		setPrintableState(new HashMap<String, String>());
		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"ic_text-wrong-answer\"></span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">&nbsp;</span>.</p> <p>She <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">&nbsp;</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void getPrintableHTMLWithFewRightAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(3), "Volvo");
		setPrintableState(values);

		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"ic_text-correct-answer\">like</span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Volvo</span>.</p> <p>She <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">&nbsp;</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void getPrintableHTMLWithFewWrongAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "aaaaa aa");
		values.put(idToGapUniqueId(3), "123");
		setPrintableState(values);

		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"ic_text-wrong-answer\">aaaaa aa</span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">123</span>.</p> <p>She <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">&nbsp;</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void getPrintableHTMLWithFewRightAndWrongAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "aaaaa aa");
		values.put(idToGapUniqueId(3), "Volvo");
		values.put(idToGapUniqueId(4), "ABC");
		setPrintableState(values);

		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"ic_text-wrong-answer\">aaaaa aa</span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Volvo</span>.</p> <p>She <span class=\"ic_text-wrong-answer\">ABC</span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">&nbsp;</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void getPrintableHTMLWithOnlyRightAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(2), "dont like");
		values.put(idToGapUniqueId(3), "Volvo");
		values.put(idToGapUniqueId(4), "DEF");
		values.put(idToGapUniqueId(5), "Audi");
		setPrintableState(values);

		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"ic_text-correct-answer\">like</span> you very much (like).</p> <p>You <span class=\"ic_text-correct-answer\">dont like</span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Volvo</span>.</p> <p>She <span class=\"ic_text-correct-answer\">DEF</span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Audi</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void getPrintableHTMLWithOnlyWrongAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "aaaaa aa");
		values.put(idToGapUniqueId(2), "bbb bb");
		values.put(idToGapUniqueId(3), "123");
		values.put(idToGapUniqueId(4), "GHI");
		values.put(idToGapUniqueId(5), "ABC");
		setPrintableState(values);

		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"ic_text-wrong-answer\">aaaaa aa</span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\">bbb bb</span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">123</span>.</p> <p>She <span class=\"ic_text-wrong-answer\">GHI</span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">ABC</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void getPrintableHTMLWithOnlyFilledAnswers() throws JSONException {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(2), "bbb bb");
		values.put(idToGapUniqueId(3), "123");
		values.put(idToGapUniqueId(4), "DEF");
		values.put(idToGapUniqueId(5), "Audi");
		setPrintableState(values);

		assertEquals(getPrintableHTML(true), "<div class=\"printable_ic_text printable_module printable_module-myText splittable\" id=\"text\"> <p>I <span class=\"ic_text-correct-answer\">like</span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\">bbb bb</span> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">123</span>.</p> <p>She <span class=\"ic_text-correct-answer\">DEF</span> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Audi</span>.</p> </div>");
		assertEquals(getPrintableHTML(false), GET_PRINTABLE_HTML_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableInputWithoutUserAnswers() throws Exception {
		setPrintableState(new HashMap<String, String>());

		String result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), true);
		assertEquals(result, " <p>I <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-1\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"like\" aria-label=\"like\">like</option></select> you very much (like).</p> <p>You <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-2\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"dont like\" aria-label=\"dont like\">dont like</option></select> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">&nbsp;</span>.</p> <p>She <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-4\"><option value=\"-\">---</option><option value=\"ABC\" aria-label=\"ABC\">ABC</option><option value=\"DEF\" aria-label=\"DEF\">DEF</option><option value=\"GHI\" aria-label=\"GHI\">GHI</option></select> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">&nbsp;</span>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_INPUT_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableInputWithOnlyRightAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(3), "Volvo");
		values.put(idToGapUniqueId(5), "Audi");
		setPrintableState(values);

		String result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), true);
		assertEquals(result, " <p>I <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-1\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"like\" aria-label=\"like\">like</option></select> you very much (like).</p> <p>You <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-2\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"dont like\" aria-label=\"dont like\">dont like</option></select> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Volvo</span>.</p> <p>She <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-4\"><option value=\"-\">---</option><option value=\"ABC\" aria-label=\"ABC\">ABC</option><option value=\"DEF\" aria-label=\"DEF\">DEF</option><option value=\"GHI\" aria-label=\"GHI\">GHI</option></select> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Audi</span>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_INPUT_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableInputWithOnlyWrongAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(3), "123");
		values.put(idToGapUniqueId(5), "ABC");
		setPrintableState(values);

		String result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), true);
		assertEquals(result, " <p>I <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-1\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"like\" aria-label=\"like\">like</option></select> you very much (like).</p> <p>You <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-2\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"dont like\" aria-label=\"dont like\">dont like</option></select> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">123</span>.</p> <p>She <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-4\"><option value=\"-\">---</option><option value=\"ABC\" aria-label=\"ABC\">ABC</option><option value=\"DEF\" aria-label=\"DEF\">DEF</option><option value=\"GHI\" aria-label=\"GHI\">GHI</option></select> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">ABC</span>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_INPUT_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableInputWithRightAndWrongAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(3), "123");
		values.put(idToGapUniqueId(5), "Audi");
		setPrintableState(values);

		String result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), true);
		assertEquals(result, " <p>I <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-1\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"like\" aria-label=\"like\">like</option></select> you very much (like).</p> <p>You <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-2\"><option value=\"-\">---</option><option value=\"aaaaa aa\" aria-label=\"aaaaa aa\">aaaaa aa</option><option value=\"bbb bb\" aria-label=\"bbb bb\">bbb bb</option><option value=\"dont like\" aria-label=\"dont like\">dont like</option></select> him very much (like).</p> <p>He likes to drive &nbsp;<span class=\"ic_text-wrong-answer\">123</span>.</p> <p>She <select class=\"ic_inlineChoice\" id=\"" + gapUniqueId + "-4\"><option value=\"-\">---</option><option value=\"ABC\" aria-label=\"ABC\">ABC</option><option value=\"DEF\" aria-label=\"DEF\">DEF</option><option value=\"GHI\" aria-label=\"GHI\">GHI</option></select> him very much (like).</p> <p>It likes to drive &nbsp;<span class=\"ic_text-correct-answer\">Audi</span>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableInput", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_INPUT_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableDropdownsWithoutUserAnswers() throws Exception {
		setPrintableState(new HashMap<String, String>());

		String result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		assertEquals(result, " <p>I <span class=\"ic_text-wrong-answer\"></span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>He likes to drive <input id=\"" + gapUniqueId + "-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"ic_text-wrong-answer\"></span> him very much (like).</p> <p>It likes to drive <input id=\"" + gapUniqueId + "-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableDropdownsWithOnlyRightAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(2), "dont like");
		values.put(idToGapUniqueId(4), "DEF");
		setPrintableState(values);

		String result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		assertEquals(result, " <p>I <span class=\"ic_text-correct-answer\">like</span> you very much (like).</p> <p>You <span class=\"ic_text-correct-answer\">dont like</span> him very much (like).</p> <p>He likes to drive <input id=\"" + gapUniqueId + "-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"ic_text-correct-answer\">DEF</span> him very much (like).</p> <p>It likes to drive <input id=\"" + gapUniqueId + "-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableDropdownsWithOnlyWrongAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "123");
		values.put(idToGapUniqueId(2), "456");
		values.put(idToGapUniqueId(4), "ABC");
		setPrintableState(values);

		String result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		assertEquals(result, " <p>I <span class=\"ic_text-wrong-answer\">123</span> you very much (like).</p> <p>You <span class=\"ic_text-wrong-answer\">456</span> him very much (like).</p> <p>He likes to drive <input id=\"" + gapUniqueId + "-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"ic_text-wrong-answer\">ABC</span> him very much (like).</p> <p>It likes to drive <input id=\"" + gapUniqueId + "-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML);
	}

	@Test
	public void makePrintableDropdownsWithRightAndWrongAnswers() throws Exception {
		HashMap<String, String> values = new HashMap<String, String>();
		values.put(idToGapUniqueId(1), "like");
		values.put(idToGapUniqueId(2), "dont like");
		values.put(idToGapUniqueId(4), "ABC");
		setPrintableState(values);

		String result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), true);
		assertEquals(result, " <p>I <span class=\"ic_text-correct-answer\">like</span> you very much (like).</p> <p>You <span class=\"ic_text-correct-answer\">dont like</span> him very much (like).</p> <p>He likes to drive <input id=\"" + gapUniqueId + "-3\" type=\"edit\" data-gap=\"editable\" size=\"5\" class=\"ic_gap\"></input>.</p> <p>She <span class=\"ic_text-wrong-answer\">ABC</span> him very much (like).</p> <p>It likes to drive <input id=\"" + gapUniqueId + "-5\" type=\"edit\" data-gap=\"editable\" size=\"4\" class=\"ic_gap\"></input>.</p> ");

		result = Whitebox.invokeMethod(printable, "makePrintableDropdowns", model.getParsedText(), false);
		assertEquals(result, MAKE_PRINTABLE_DROPDOWNS_NOT_SHOWING_ANSWERS_HTML);
	}
}
