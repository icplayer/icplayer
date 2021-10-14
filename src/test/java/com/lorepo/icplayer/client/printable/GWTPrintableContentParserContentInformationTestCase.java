package com.lorepo.icplayer.client.printable;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.CALLS_REAL_METHODS;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPrintableContentParserContentInformationTestCase extends GwtTest {

    String ID_KEY = "id";
    String PARENT_KEY = "parentId";
    String NAME_KEY = "name";
    String IS_REPORTABLE_KEY = "isReportable";
    String TYPE_KEY = "type";
    String IS_VISITED_KEY = "isVisited";

    PrintableContentParser printableContentParserMock = null;
    Content content = null;
    ArrayList<Integer> pageSubset = null;
    PageList chapter2 = null;
    PageList chapter21 = null;
    Page chapter21Page1 = null;
    Page chapter21Page2 = null;

    @Before
    public void setUp () throws Exception {
        this.content = generateContent();
        this.printableContentParserMock
                = mock(PrintableContentParser.class, CALLS_REAL_METHODS);
        doNothing().when(this.printableContentParserMock)
                .generatePrintableHTMLForPages(any(List.class));
    }

    private Content generateContent() {
        Content content = new Content();
        Page header = createDefaultPage("header", "header");
        Page main = createDefaultPage("main", "main");

        PageList chapter1 = new PageList("chapter1");

        Page chapter1Page1 = createDefaultPage(
                "chapter1Page1", "chapter1Page1");
        chapter1.add(chapter1Page1);

        Page chapter1Page2 = createDefaultPage(
                "chapter1Page2", "chapter1Page2");
        chapter1.add(chapter1Page2);

        this.chapter21 = new PageList("chapter21");

        this.chapter21Page1 = createDefaultPage(
                "chapter21Page1", "chapter21Page1");
        this.chapter21Page1.setReportable(false);
        this.chapter21.add(this.chapter21Page1);

        this.chapter21Page2 = createDefaultPage(
                "chapter21Page2", "chapter21Page2", true);
        this.chapter21Page2.setReportable(true);
        this.chapter21.add(this.chapter21Page2);

        this.chapter2 = new PageList("chapter2");

        Page chapter2Page1 = createDefaultPage(
                "chapter2Page1", "chapter2Page1");
        this.chapter2.add(chapter2Page1);

        this.chapter2.add(this.chapter21);

        Page chapter2Page2 = createDefaultPage(
                "chapter2Page2", "chapter2Page2", false);
        this.chapter2.add(chapter2Page2);

        Page footer = createDefaultPage("footer", "footer");

        content.getTableOfContents().add(header);
        content.getTableOfContents().add(main);
        content.getTableOfContents().add(chapter1);
        content.getTableOfContents().add(this.chapter2);
        content.getTableOfContents().add(footer);

        return content;
    }

    private Page createDefaultPage(String name, String url) {
        Page page = spy(new Page(name, url));
        doReturn(false).when(page).isVisited();
        page.setReportable(false);
        return page;
    }

    private Page createDefaultPage(String name, String url, Boolean isReportable) {
        Page page = spy(new Page(name, url));
        doReturn(false).when(page).isVisited();
        page.setReportable(isReportable);
        return page;
    }

    private void setContentInformationWithSomeElements() {
        HashMap<String, String> information1 = new HashMap<String, String>();
        information1.put("some_key1", "some_value1");
        HashMap<String, String> information2 = new HashMap<String, String>();
        information2.put("some_key2", "some_value2");
        this.printableContentParserMock.contentInformation
                = new ArrayList<HashMap<String, String>>();
        this.printableContentParserMock.contentInformation.add(information1);
        this.printableContentParserMock.contentInformation.add(information2);
    }

    private void setEmptyContentInformation() {
        this.printableContentParserMock.contentInformation
                = new ArrayList<HashMap<String, String>>();
    }

    @Test
    public void generatePrintableHTMLCleanContentInformationDuringExecution() {
        setContentInformationWithSomeElements();
        this.content = new Content();

        this.printableContentParserMock.generatePrintableHTML(
                this.content, this.pageSubset);

        Integer expectedSize = 0;
        Integer size = this.printableContentParserMock.contentInformation.size();
        assertEquals(expectedSize, size);
    }

    @Test
    public void generatePrintableHTMLCreateCorrectContentInformationForPage() {
        setEmptyContentInformation();

        this.printableContentParserMock.generatePrintableHTML(
                this.content, this.pageSubset);

        HashMap<String, String> contentInformation
                = this.printableContentParserMock.contentInformation.get(9);
        assertEquals(this.chapter21Page2.getId(), contentInformation.get(ID_KEY));
        assertEquals(this.chapter21.getId(), contentInformation.get(PARENT_KEY));
        assertEquals(this.chapter21Page2.getName(), contentInformation.get(NAME_KEY));
        assertEquals("true", contentInformation.get(IS_REPORTABLE_KEY));
        assertEquals("page", contentInformation.get(TYPE_KEY));
        assertEquals("false", contentInformation.get(IS_VISITED_KEY));
    }

    @Test
    public void generatePrintableHTMLCreateCorrectContentInformationForChapter() {
        setEmptyContentInformation();

        this.printableContentParserMock.generatePrintableHTML(
                this.content, this.pageSubset);

        HashMap<String, String> contentInformation
                = this.printableContentParserMock.contentInformation.get(7);
        assertEquals(this.chapter21.getId(), contentInformation.get(ID_KEY));
        assertEquals(this.chapter2.getId(), contentInformation.get(PARENT_KEY));
        assertEquals(this.chapter21.getName(), contentInformation.get(NAME_KEY));
        assertEquals("false", contentInformation.get(IS_REPORTABLE_KEY));
        assertEquals("chapter", contentInformation.get(TYPE_KEY));
        assertNull(contentInformation.get(IS_VISITED_KEY));
    }

    @Test
    public void generatePrintableHTMLCreateContentInformationWithCorrectOrder() {
        setEmptyContentInformation();

        this.printableContentParserMock.generatePrintableHTML(
                this.content, this.pageSubset);

        String[] expectedNames = new String[] {
                "header", "main", "chapter1", "chapter1Page1", "chapter1Page2",
                "chapter2", "chapter2Page1", "chapter21", "chapter21Page1",
                "chapter21Page2", "chapter2Page2", "footer"
        };
        ArrayList<HashMap<String, String>> array
                = this.printableContentParserMock.contentInformation;
        for (int i = 0; i < array.size(); i++) {
            assertEquals(expectedNames[i], array.get(i).get(NAME_KEY));
        }
        assertEquals(expectedNames.length, array.size());
    }

    @Test
    public void generatePrintableHTMLCreateCorrectContentInformationWhenPageSubsetUsed() {
        setEmptyContentInformation();
        this.pageSubset = new ArrayList<Integer>(){{
            add(0);
            add(3);
            add(4);
            add(6);
            add(7);
            add(8);
        }};

        this.printableContentParserMock.generatePrintableHTML(
                this.content, this.pageSubset);

        String[] expectedNames = new String[] {
                "header", "chapter1", "chapter1Page2",
                "chapter2", "chapter2Page1", "chapter21",
                "chapter21Page2", "chapter2Page2", "footer"
        };
        ArrayList<HashMap<String, String>> array
                = this.printableContentParserMock.contentInformation;
        for (int i = 0; i < array.size(); i++) {
            assertEquals(expectedNames[i], array.get(i).get(NAME_KEY));
        }
        assertEquals(expectedNames.length, array.size());
    }
}
