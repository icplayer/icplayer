package com.lorepo.icplayer.client.module.report;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.apache.tools.ant.filters.StringInputStream;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;

@RunWith(PowerMockRunner.class)
@PrepareForTest(DictionaryWrapper.class)
public class ReportModelTestCase {

	private static final String PAGE_VERSION = "2";


	@Test
	public void moduleTypeName() {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_module")).thenReturn("Report");
		
		ReportModule module = new ReportModule();
		assertEquals("Report", module.getModuleTypeName());
	}


	@Test
	public void loadFromPageXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/report.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);
		
		assertEquals("report1", module.getId());
	}

	@Test
	public void errorLabel() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_error_label")).thenReturn("Errors label");
		when(DictionaryWrapper.get("report_errors")).thenReturn("No of errors");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/report.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String errorCountLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Errors label") == 0){
				errorCountLabel = property.getValue();
			}
		}
		
		assertEquals("No of errors", errorCountLabel);
	}


	@Test
	public void checkLabel() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_checks_label")).thenReturn("Checks label");
		when(DictionaryWrapper.get("report_checks")).thenReturn("No of checks");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/report.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String checkCountLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Checks label") == 0){
				checkCountLabel = property.getValue();
			}
		}
		
		assertEquals("No of checks", checkCountLabel);
	}


	@Test
	public void resultsLabel() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_results_label")).thenReturn("Results label");
		when(DictionaryWrapper.get("report_results")).thenReturn("Results:");

		InputStream inputStream = getClass().getResourceAsStream("testdata/report.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String resultsLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Results label") == 0){
				resultsLabel = property.getValue();
			}
		}
		
		assertEquals("Results:", resultsLabel);
	}


	@Test
	public void totalLabel() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_total_label")).thenReturn("Total label");
		when(DictionaryWrapper.get("report_total")).thenReturn("Total:");

		InputStream inputStream = getClass().getResourceAsStream("testdata/report.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String totalLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Total label") == 0){
				totalLabel = property.getValue();
			}
		}
		
		assertEquals("Total:", totalLabel);
	}
	
	
	@Test
	public void errorLabel2() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_error_label")).thenReturn("Errors label");

		InputStream inputStream = getClass().getResourceAsStream("testdata/report2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String errorCountLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Errors label") == 0){
				errorCountLabel = property.getValue();
			}
		}
		
		assertEquals("label1", errorCountLabel);
	}


	@Test
	public void checkLabel2() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_checks_label")).thenReturn("Checks label");
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/report2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String checkCountLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Checks label") == 0){
				checkCountLabel = property.getValue();
			}
		}
		
		assertEquals("label2", checkCountLabel);
	}


	@Test
	public void resultsLabel2() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_results_label")).thenReturn("Results label");

		InputStream inputStream = getClass().getResourceAsStream("testdata/report2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String resultsLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Results label") == 0){
				resultsLabel = property.getValue();
			}
		}
		
		assertEquals("label3", resultsLabel);
	}


	@Test
	public void totalLabel2() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("report_total_label")).thenReturn("Total label");

		InputStream inputStream = getClass().getResourceAsStream("testdata/report2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		String totalLabel = null;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Total label") == 0){
				totalLabel = property.getValue();
			}
		}
		
		assertEquals("label4", totalLabel);
	}
	


	@Test
	public void showCounters() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/report2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);
		
		assertFalse(module.isShowCounters());
	}

	
	@Test
	public void showCounter() throws SAXException, IOException {
		PowerMockito.spy(DictionaryWrapper.class);
		when(DictionaryWrapper.get("showCounters")).thenReturn("Show Counters");

		InputStream inputStream = getClass().getResourceAsStream("testdata/report2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);

		boolean found = false;
		
		for(int i = 0; i < module.getPropertyCount(); i++){
			
			IProperty property = module.getProperty(i);
			if(property.getName().compareTo("Show Counters") == 0){
				found = true;
			}
		}
		
		assertTrue(found);
	}


	@Test
	public void pageNameColumnWidth() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/report.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ReportModule module = new ReportModule();
		module.load(element, "", PAGE_VERSION);
		
		assertEquals(100, module.getPageNameWidth());
	}


}
