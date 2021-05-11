package com.lorepo.icplayer.client.module.skiplink;

import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkKeyboardItem;
import com.lorepo.icplayer.client.module.skiplink.keyboardManager.SkipLinkKeyboardManager;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class SkipLinkKeyboardManagerTestCase {
    private class SkipLinkKeyboardItemMock implements ISkipLinkKeyboardItem {
        public String moduleId;
        public boolean isVisible = false;
        SkipLinkKeyboardItemMock(String moduleId) {
            this.moduleId = moduleId;
        }

        @Override
        public String getModuleId() {
            return moduleId;
        }

        @Override
        public String getTextToRead() {
            return moduleId;
        }

        @Override
        public String getTextLang() {
            return moduleId;
        }

        @Override
        public void setVisible() {
            isVisible = true;
        }

        @Override
        public void setInvisible() {
            isVisible = false;
        }
    }

    private SkipLinkKeyboardManager manager;
    private List<SkipLinkKeyboardItemMock> items;

    @Test
    public void initialState() {
        givenManagerWithFourItems();

        thenAllItemsInvisible();
    }

    @Test
    public void settingToActive() {
        givenManagerWithFourItems();

        whenManagerSetToActive();

        thenOnlyItemVisible(0);
    }

    @Test
    public void settingToInactive() {
        givenManagerWithFourItems();

        whenManagerSetToInactive();

        thenAllItemsInvisible();
    }

    @Test
    public void settingToActiveAndToInactive() {
        givenManagerWithFourItems();

        whenManagerSetToActive();
        whenManagerSetToInactive();

        thenAllItemsInvisible();
    }

    @Test
    public void settingToActiveAndToInactiveAndToActive() {
        givenManagerWithFourItems();

        whenManagerSetToActive();
        whenManagerSetToInactive();
        whenManagerSetToActive();

        thenOnlyItemVisible(0);
    }

    @Test
    public void increasingSelectedItemWhenInactive() {
        givenManagerWithFourItems();

        whenManagerSetToInactive();
        whenIncreasingSelectedItem();

        thenAllItemsInvisible();
    }

    @Test
    public void increasingSelectedItem() {
        givenManagerWithFourItems();

        whenManagerSetToActive();
        whenIncreasingSelectedItem();

        thenOnlyItemVisible(1);
    }

    @Test
    public void increasingSelectedItemFewTimes() {
        givenManagerWithFourItems();

        whenManagerSetToActive();
        whenIncreasingSelectedItem();
        whenIncreasingSelectedItem();

        thenOnlyItemVisible(2);
    }

    @Test
    public void increasingSelectedItemAndSettingToInactive() {
        givenManagerWithFourItems();

        whenManagerSetToActive();
        whenIncreasingSelectedItem();
        whenManagerSetToInactive();

        thenAllItemsInvisible();
    }

    @Test
    public void decreasingWhen0Selected() {
        givenManagerWithFourItems();

        whenManagerSetToActive();
        whenDecreasingSelectedItem();

        thenOnlyItemVisible(0);
    }

    @Test
    public void increasingOverItemCount() {
        givenManagerWithFourItems();

        whenManagerSetToActive();

        for (int i = 0; i < 10; i++) {
            whenIncreasingSelectedItem();
        }

        int lastItemIndex = items.size() - 1;
        thenOnlyItemVisible(lastItemIndex);
    }

    private void givenManagerWithFourItems() {
        items = new ArrayList<SkipLinkKeyboardItemMock>();
        items.add(new SkipLinkKeyboardItemMock("1"));
        items.add(new SkipLinkKeyboardItemMock("2"));
        items.add(new SkipLinkKeyboardItemMock("3"));
        items.add(new SkipLinkKeyboardItemMock("4"));

        manager = new SkipLinkKeyboardManager(items);
    }

    private void whenManagerSetToActive() {
        manager.setActive();
    }

    private void whenManagerSetToInactive() {
        manager.setInactive();
    }


    private void whenIncreasingSelectedItem() {
        manager.increase();
    }

    private void whenDecreasingSelectedItem() {
        manager.decrease();
    }

    private void thenOnlyItemVisible(int expectedVisibleIndex) {
        SkipLinkKeyboardItemMock visibleItem = items.get(expectedVisibleIndex);
        assertTrue(visibleItem.isVisible);

        for (SkipLinkKeyboardItemMock item : items) {
            if (item != visibleItem) {
                assertFalse(item.isVisible);
            }
        }
    }

    private void thenAllItemsInvisible() {
        for (SkipLinkKeyboardItemMock item : items) {
            assertFalse(item.isVisible);
        }
    }
}
