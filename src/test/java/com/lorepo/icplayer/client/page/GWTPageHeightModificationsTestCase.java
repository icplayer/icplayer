package com.lorepo.icplayer.client.page;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.page.properties.OutstretchHeightData;
import com.lorepo.icplayer.client.model.page.properties.PageHeightModifications;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPageHeightModificationsTestCase extends GwtTest {

    private void addOutstretchHeightSample1(PageHeightModifications heightModifications){
        heightModifications.addOutstretchHeight(10, 20, false);
    }

    private void addOutstretchHeightSample2(PageHeightModifications heightModifications){
        heightModifications.addOutstretchHeight(10, 20, false, "Layout1");
    }

    private void addOutstretchHeightSample3(PageHeightModifications heightModifications){
        heightModifications.addOutstretchHeight(10, 20, false, "");
    }

    @Test
    public void testAddOutstretchHeightWithoutLayout() {
        PageHeightModifications pageHeightModifications = new PageHeightModifications();
        this.addOutstretchHeightSample1(pageHeightModifications);

        List<OutstretchHeightData> heightModifications = pageHeightModifications.getOutStretchHeights();
        assertEquals(1, heightModifications.size());

        OutstretchHeightData actualData = heightModifications.get(0);
        OutstretchHeightData expectedData = new OutstretchHeightData(10, 20, false, "");
        assertEquals(expectedData.y, actualData.y);
        assertEquals(expectedData.height, actualData.height);
        assertEquals(expectedData.dontMoveModules, actualData.dontMoveModules);
        assertEquals(expectedData.layoutName, actualData.layoutName);
    }

    @Test
    public void testAddOutstretchHeightWithLayout() {
        PageHeightModifications pageHeightModifications = new PageHeightModifications();
        this.addOutstretchHeightSample2(pageHeightModifications);

        List<OutstretchHeightData> heightModifications = pageHeightModifications.getOutStretchHeights();
        assertEquals(1, heightModifications.size());

        OutstretchHeightData actualData = heightModifications.get(0);
        OutstretchHeightData expectedData = new OutstretchHeightData(10, 20, false, "Layout1");
        assertEquals(expectedData.y, actualData.y);
        assertEquals(expectedData.height, actualData.height);
        assertEquals(expectedData.dontMoveModules, actualData.dontMoveModules);
        assertEquals(expectedData.layoutName, actualData.layoutName);
    }

    @Test
    public void testAddOutstretchHeightWithEmptyLayout() {
        PageHeightModifications pageHeightModifications = new PageHeightModifications();
        this.addOutstretchHeightSample3(pageHeightModifications);

        List<OutstretchHeightData> heightModifications = pageHeightModifications.getOutStretchHeights();
        assertEquals(1, heightModifications.size());

        OutstretchHeightData actualData = heightModifications.get(0);
        OutstretchHeightData expectedData = new OutstretchHeightData(10, 20, false, "");
        assertEquals(expectedData.y, actualData.y);
        assertEquals(expectedData.height, actualData.height);
        assertEquals(expectedData.dontMoveModules, actualData.dontMoveModules);
        assertEquals(expectedData.layoutName, actualData.layoutName);
    }
}
