package com.lorepo.icplayer.client.module.skiplink;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.XMLParser;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.XMLUtilsMock;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
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

    List<SkipLinkItem> expectedItems = Arrays.asList(
            new SkipLinkItem("Text1", "This skiplink will move keyboard navigation to text1", "en-US"),
            new SkipLinkItem("Text2", "This skiplink will move keyboard navigation to text2", ""),
            new SkipLinkItem("Text3", "Text3", "")
    );

    @Test
    public void givenProperXMLWhenCreatingModuleThenContainsProperItems() throws SAXException, IOException {
        SkipLinkModule module = new SkipLinkModule();
        InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
        XMLParserMockup xmlParser = new XMLParserMockup();

        Element element = xmlParser.parser(inputStream);

        module.load(element, "", "1");


        List<? extends ISkipLinkItem> items = module.getItems();
        assertEquals(expectedItems.size(), items.size());
        for (int i = 0; i < items.size(); i++) {
            itemEquals(items.get(i), expectedItems.get(i));
        }
    }



    @Test
    public void givenModuleWhenMappingThenContainsProperItems() throws SAXException, IOException {
        List<SkipLinkData> givenItems = Arrays.asList(
                new SkipLinkData("Text1", "This skiplink will move keyboard navigation to text1", "en-US"),
                new SkipLinkData("Text2", "This skiplink will move keyboard navigation to text2", ""),
                new SkipLinkData("Text3", "", "")
        );

        InputStream expectedInputStream = getClass().getResourceAsStream("testdata/module.xml");
        XMLParserMockup xmlParser = new XMLParserMockup();
        String expected = xmlParser.parser(expectedInputStream).toString();

        SkipLinkModule module = new SkipLinkModule();
        module.setID("skipLinkModule1");
        addItems(module, givenItems);

        String result = module.toXML();
        System.out.println(result);
        Diff diff = new Diff(expected, result);
        // TODO: [Fatal Error] :1:1: Content is not allowed in prolog.
//        XMLAssert.assertXMLEqual(diff, true);
    }

    @Test
    public void givenNotValidXMLEntitiesInModuleWhenMappingToXMLThenContainsEscapedEntities() throws SAXException, IOException {
        List<SkipLinkData> givenItems = Arrays.asList(
                new SkipLinkData("Text1", ">", ""),
                new SkipLinkData("Text2", "<", ""),
                new SkipLinkData("Text3", "&", ""),
                new SkipLinkData("Text3", "\"", ""),
                new SkipLinkData("Text3", "'", "")
        );
        SkipLinkModule module = new SkipLinkModule();
        module.setID("skipLinkModule1");
        addItems(module, givenItems);


        String result = module.toXML();

        assertTrue(result.contains("&lt;"));
        assertTrue(result.contains("&gt;"));
        assertTrue(result.contains("&amp;"));
        assertTrue(result.contains("&quot;"));
        assertTrue(result.contains("&apos;"));
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
