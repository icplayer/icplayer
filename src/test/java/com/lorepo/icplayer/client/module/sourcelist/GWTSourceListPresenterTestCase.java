package com.lorepo.icplayer.client.module.sourcelist;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.sourcelist.mockup.SourceListViewMockup;
import org.junit.Before;
import org.junit.Test;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTSourceListPresenterTestCase extends GwtTest {

    private static final String PAGE_VERSION = "2";
    private SourceListModule module;
    private PlayerServicesMockup services;
    private SourceListViewMockup display;
    private SourceListPresenter presenter;

    @Before
    public void runBeforeEveryTest() throws SAXException, IOException {
        InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
        XMLParserMockup xmlParser = new XMLParserMockup();
        Element element = xmlParser.parser(inputStream);

        module = new SourceListModule();
        module.load(element, "", PAGE_VERSION);

        services = new PlayerServicesMockup();
        display = new SourceListViewMockup(module);
        presenter = new SourceListPresenter(module, services);
        presenter.addView(display);
    }

    @Test
    public void givenOldestStateWhenSettingStateThenProperlyAddsItems() {
        String state = "{" +
            "\"sl1-2\":\"B\"," +
            "\"sl1-3\":\"C\"," +
            "\"sl1-4\":\"D\"" +
        "}";

        this.presenter.setState(state);

        Set<String> set = Whitebox.getInternalState(this.presenter, "items");

        assertEquals(3, set.size());
        assertTrue(set.contains("sl1-2"));
        assertTrue(set.contains("sl1-3"));
        assertTrue(set.contains("sl1-4"));
    }

    @Test
    public void givenOldStateWhenSettingStateThenProperlyAddsItems() {
        String items = "{" +
            "\\\"sl1-2\\\": \\\"B\\\"," +
            "\\\"sl1-3\\\": \\\"C\\\"," +
            "\\\"sl1-4\\\": \\\"D\\\"" +
        "}";
        String state = "{" +
            "\"isVisible\": \"true\"," +
            "\"items\": \"" + items + "\"" +
        "}";

        this.presenter.setState(state);

        Set<String> set = Whitebox.getInternalState(this.presenter, "items");

        assertEquals(3, set.size());
        assertTrue(set.contains("sl1-2"));
        assertTrue(set.contains("sl1-3"));
        assertTrue(set.contains("sl1-4"));
    }

    // We cannot test setting new state (version 1), since library for json parsing has issue with parsing JSON which consist only of array
    // ISSUE: https://github.com/gwt-test-utils/gwt-test-utils/issues/92
}
