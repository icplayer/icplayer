package com.lorepo.icplayer.client.semi.responsive.pageLayout;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.custommonkey.xmlunit.DetailedDiff;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.screen.DeviceOrientation;
import com.lorepo.icplayer.client.model.layout.PageLayout;



@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPageLayoutToXML extends GwtTest {
	private PageLayout pageLayout;
	private PageLayout defaultPageLayout;
	private PageLayout defaultVerticalPageLayout;
	private PageLayout verticalPageLayout;
	private PageLayout defaultHorizontalPageLayout;
	private PageLayout horizontalPageLayout;
	
	@Before
	public void setUp() throws ParserConfigurationException, SAXException, IOException, TransformerException {
		XMLUnit.setIgnoreWhitespace(true);
		this.pageLayout = new PageLayout("small_id", "small");
		this.pageLayout.setCssID("small_css_id");
		this.pageLayout.setThreshold(PageLayout.MAX_TRESHOLD);
		
		this.defaultPageLayout = new PageLayout("small_id", "small");
		this.defaultPageLayout.setCssID("small_css_id");
		this.defaultPageLayout.setThreshold(PageLayout.MAX_TRESHOLD);
		this.defaultPageLayout.setIsDefault(true);
		
		this.defaultVerticalPageLayout = new PageLayout("small_id", "small");
		this.defaultVerticalPageLayout.setCssID("small_css_id");
		this.defaultVerticalPageLayout.setThreshold(PageLayout.MAX_TRESHOLD);
		this.defaultVerticalPageLayout.setIsDefault(true);
		this.defaultVerticalPageLayout.useDeviceOrientation(true);
		
		this.verticalPageLayout = new PageLayout("small_id", "small");
		this.verticalPageLayout.setCssID("small_css_id");
		this.verticalPageLayout.setThreshold(PageLayout.MAX_TRESHOLD);
		this.verticalPageLayout.useDeviceOrientation(true);
		
		this.defaultHorizontalPageLayout = new PageLayout("small_id", "small");
		this.defaultHorizontalPageLayout.setCssID("small_css_id");
		this.defaultHorizontalPageLayout.setThreshold(PageLayout.MAX_TRESHOLD);
		this.defaultHorizontalPageLayout.setIsDefault(true);
		this.defaultHorizontalPageLayout.useDeviceOrientation(true);
		this.defaultHorizontalPageLayout.setDeviceOrientation(DeviceOrientation.horizontal);
		
		this.horizontalPageLayout = new PageLayout("small_id", "small");
		this.horizontalPageLayout.setCssID("small_css_id");
		this.horizontalPageLayout.setThreshold(PageLayout.MAX_TRESHOLD);
		this.horizontalPageLayout.useDeviceOrientation(true);
		this.horizontalPageLayout.setDeviceOrientation(DeviceOrientation.horizontal);
	}
	
	private String getFromFile(String path) throws IOException {
		InputStream xmlStream = getClass().getResourceAsStream(path);
		Scanner s = new Scanner(xmlStream).useDelimiter("\\A");
		String result = s.hasNext() ? s.next() : "";
		return result;
	}
	
	
	@Test
	public void simpleXMLWithoutDevice() throws SAXException, IOException {
		Element xml = this.pageLayout.toXML();

        DetailedDiff myDiff = new DetailedDiff(new Diff(this.getFromFile("testdata/simplePageLayout.xml"), xml.toString()));
        
        assertTrue(myDiff.toString(), myDiff.similar());
	}
	
	@Test
	public void defaultXMLWithoutDevice() throws SAXException, IOException {
		Element xml = this.defaultPageLayout.toXML();
		
        DetailedDiff myDiff = new DetailedDiff(new Diff(this.getFromFile("testdata/simpleDefaultPageLayout.xml"), xml.toString()));
        
        assertTrue(myDiff.toString(), myDiff.similar());
	}
	
	@Test
	public void nonDefaultXMLWithDeviceUseVertical() throws SAXException, IOException {
		Element xml = this.verticalPageLayout.toXML();
		
		DetailedDiff myDiff = new DetailedDiff(new Diff(this.getFromFile("testdata/nonDefaultWithDeviceOrientationVertical.xml"), xml.toString()));
		
		assertTrue(myDiff.toString(), myDiff.similar());
	}
	
	@Test
	public void defaultXMLWithDeviceUseVertical() throws SAXException, IOException {
		Element xml = this.defaultVerticalPageLayout.toXML();
		
        DetailedDiff myDiff = new DetailedDiff(new Diff(this.getFromFile("testdata/defaultWithDeviceOrientationVertical.xml"), xml.toString()));
        
        assertTrue(myDiff.toString(), myDiff.similar());
	}
	
	@Test
	public void nonDefaultXMLWithDeviceUseHorizontal() throws SAXException, IOException {
		Element xml = this.horizontalPageLayout.toXML();
		
		DetailedDiff myDiff = new DetailedDiff(new Diff(this.getFromFile("testdata/nonDefaultWithDeviceOrientationHorizontal.xml"), xml.toString()));
		
		assertTrue(myDiff.toString(), myDiff.similar());
	}
	
	@Test
	public void defaultXMLWithDeviceUseHorizontal() throws SAXException, IOException {
		Element xml = this.defaultHorizontalPageLayout.toXML();
		
        DetailedDiff myDiff = new DetailedDiff(new Diff(this.getFromFile("testdata/defaultWithDeviceOrientationHorizontal.xml"), xml.toString()));
        assertTrue(myDiff.toString(), myDiff.similar());
	}
	
}