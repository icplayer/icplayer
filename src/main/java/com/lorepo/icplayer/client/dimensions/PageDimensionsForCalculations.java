package com.lorepo.icplayer.client.dimensions;

import com.google.gwt.user.client.DOM;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PopupPage;
import com.lorepo.icplayer.client.page.AbsolutePageView;

public class PageDimensionsForCalculations {
    public int width;
    public int height;
    public int absoluteLeft;
    public int absoluteTop;

    public PageDimensionsForCalculations(int width, int height, int absoluteLeft, int absoluteTop) {
        this.width = width;
        this.height = height;
        this.absoluteLeft = absoluteLeft;
        this.absoluteTop = absoluteTop;
    }

    public static PageDimensionsForCalculations getAbsolutePageViewDimensions(AbsolutePageView panel, Page page) {
        if (page instanceof PopupPage)
            return getAbsolutePopupPageViewDimensions(panel, (PopupPage) page);

        return getAbsolutePageViewDimensions(panel);
    }

    private static PageDimensionsForCalculations getAbsolutePageViewDimensions(AbsolutePageView panel) {
        int width = DOM.getElementPropertyInt(panel.getElement(), "clientWidth");
        int height = DOM.getElementPropertyInt(panel.getElement(), "clientHeight");
        int absoluteLeft = panel.getAbsoluteLeft();
        int absoluteTop = panel.getAbsoluteTop();

        return new PageDimensionsForCalculations(width, height, absoluteLeft, absoluteTop);
    }

    private static PageDimensionsForCalculations getAbsolutePopupPageViewDimensions(AbsolutePageView panel, PopupPage page) {
        int width = page.getOriginalWidth();
        int height = page.getOriginalHeight();
        int absoluteLeft = panel.getAbsoluteLeft();
        int absoluteTop = panel.getAbsoluteTop();

        return new PageDimensionsForCalculations(width, height, absoluteLeft, absoluteTop);
    }
}
