package com.lorepo.icplayer.client.page;

import com.lorepo.icplayer.client.PlayerEntryPoint;

public interface IKeyboardNavigationController {
    void switchKeyboard(boolean enable);
    void run(PlayerEntryPoint entryPoint);
    boolean isModuleActivated();
    void reset();
    void save();
    void restore();
    void addHeaderToNavigation(PageController controller);
    void addFooterToNavigation(PageController controller);
    void addMainToNavigation(PageController controller);
    void addSecondToNavigation(PageController controller);
    boolean isWCAGOn();
    void moveToModule(String moduleId);
}
