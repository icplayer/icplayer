package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkItem;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLAssert;
import org.junit.Test;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;


@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTXMLModuleTestCase extends GwtTest {
    private static class SkipLinkData {
        public String id;
        public String text;
        public String langTag;
        SkipLinkData(String moduleId, String text, String langTag) {
            this.id = moduleId;
            this.text = text;
            this.langTag = langTag;
        }
    }

    List<SkipLinkData> givenItems;
    Element givenXMLElement;
    SkipLinkModule moduleToLoadXMLInto;
    SkipLinkModule moduleToAddProperties;

    List<SkipLinkItem> expectedItems = Arrays.asList(
            new SkipLinkItem("Text1", "This skiplink will move keyboard navigation to text1", "en-US"),
            new SkipLinkItem("Text2", "This skiplink will move keyboard navigation to text2", ""),
            new SkipLinkItem("Text3", "Text3", "")
    );

    @Test
    public void loadingModuleFromXML() throws SAXException, IOException {
        givenParsedXML();

        whenXMLLoadedIntoModule();

        thenItemsFromXMLAreAsExpected();
    }

    @Test
    public void comparingLoadedXMLAndGeneratedXML() throws SAXException, IOException {
        givenParsedXML();

        given3Items();

        whenItemsAddedToModule();
        whenXMLLoadedIntoModule();
        whenModulesIDsSet("skiplink1");

        thenXMLProducedByBothModulesIsSame();
    }

    @Test
    public void escapingXMLEntities() {
        givenItemsWithUnescapedXMLEntities();

        whenItemsAddedToModule();

        thenXMLContainsEscapedProperties();
    }

    private void given3Items() {
        givenItems = Arrays.asList(
                new SkipLinkData("Text1", "This skiplink will move keyboard navigation to text1", "en-US"),
                new SkipLinkData("Text2", "This skiplink will move keyboard navigation to text2", ""),
                new SkipLinkData("Text3", "", "")
        );
    }

    private void givenItemsWithUnescapedXMLEntities() {
        givenItems = Arrays.asList(
                new SkipLinkData("Text1", ">", ""),
                new SkipLinkData("Text2", "<", ""),
                new SkipLinkData("Text3", "&", ""),
                new SkipLinkData("Text3", "\"", ""),
                new SkipLinkData("Text3", "'", "")
        );
    }

    private void givenParsedXML() throws IOException, SAXException {
        InputStream expectedInputStream = getClass().getResourceAsStream("testdata/module.xml");
        XMLParserMockup xmlParser = new XMLParserMockup();
        givenXMLElement = xmlParser.parser(expectedInputStream);
    }

    private void whenXMLLoadedIntoModule() {
        moduleToLoadXMLInto = new SkipLinkModule();
        moduleToLoadXMLInto.load(givenXMLElement, "", "1");
    }

    private void whenItemsAddedToModule() {
        moduleToAddProperties = new SkipLinkModule();
        addItems(moduleToAddProperties, givenItems);
    }

    private void whenModulesIDsSet(String moduleId) {
        moduleToLoadXMLInto.setID(moduleId);
        moduleToAddProperties.setID(moduleId);
    }

    private void thenItemsFromXMLAreAsExpected() {
        List<? extends ISkipLinkItem> items = moduleToLoadXMLInto.getItems();
        assertEquals(expectedItems.size(), items.size());
        for (int i = 0; i < items.size(); i++) {
            itemEquals(items.get(i), expectedItems.get(i));
        }
    }

    private void thenXMLContainsEscapedProperties() {
        String result = moduleToAddProperties.toXML();

        assertTrue(result.contains("&lt;"));
        assertTrue(result.contains("&gt;"));
        assertTrue(result.contains("&amp;"));
        assertTrue(result.contains("&quot;"));
        assertTrue(result.contains("&apos;"));
    }

    private void thenXMLProducedByBothModulesIsSame() throws IOException, SAXException {
        Diff diff = new Diff(moduleToLoadXMLInto.toXML(), moduleToAddProperties.toXML());
        XMLAssert.assertXMLEqual(diff, true);
    }

    private void itemEquals(ISkipLinkItem givenItem, ISkipLinkItem expectedItem) {
        assertEquals(expectedItem.getModuleId(), givenItem.getModuleId());
        assertEquals(expectedItem.getModuleText(), givenItem.getModuleText());
        assertEquals(expectedItem.getModuleTextLang(), givenItem.getModuleTextLang());
    }

    private void addItems(SkipLinkModule module, List<SkipLinkData> itemsToAdd) {
        IListProperty property = (IListProperty) module.getPropertyByName(DictionaryWrapper.get("skiplink_items"));
        property.addChildren(itemsToAdd.size());

        for (int i = 0; i < itemsToAdd.size(); i++){
            SkipLinkItem item = (SkipLinkItem) property.getChild(i);

            item.setModuleId(itemsToAdd.get(i).id);
            item.setModuleText(itemsToAdd.get(i).text);
            item.setModuleTextLang(itemsToAdd.get(i).langTag);
        }
    }
}
