TestCase("Presentation visible area estimation", {
    setUp: function() {
        this.presenter = AddonGlossary_create();
    },

    'test presentation fits window perfectly and there are no scrolls': function() {
        var visibleArea = this.presenter.estimateVisibleArea(100, 200, 0, 400);

        assertEquals(100, visibleArea.top);
        assertEquals(300, visibleArea.bottom);
    },

    'test presentation fits scrolled window': function() {
        var visibleArea = this.presenter.estimateVisibleArea(1100, 200, 1000, 400);

        assertEquals(1100, visibleArea.top);
        assertEquals(1300, visibleArea.bottom);
    },

    'test presentation upper edge above scrolled window': function() {
        var visibleArea = this.presenter.estimateVisibleArea(900, 200, 1000, 400);

        assertEquals(1000, visibleArea.top);
        assertEquals(1100, visibleArea.bottom);
    },

    'test presentation lower edge below scrolled window': function() {
        var visibleArea = this.presenter.estimateVisibleArea(1300, 200, 1000, 400);

        assertEquals(1300, visibleArea.top);
        assertEquals(1400, visibleArea.bottom);
    },

    'test presentation both edges out of scrolled window': function() {
        var visibleArea = this.presenter.estimateVisibleArea(900, 600, 1000, 400);

        assertEquals(1000, visibleArea.top);
        assertEquals(1400, visibleArea.bottom);
    }
});