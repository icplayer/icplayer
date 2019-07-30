TestCase("[Page Counter] Visibility Tests", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();
        this.presenter.$view = $("<div></div>");
    },


    'test hide command set currentlyVisible to false': function () {
        this.presenter.isCurrentlyVisible = true;

        this.presenter.hide();

        assertFalse(this.presenter.isCurrentlyVisible);
        assertEquals("hidden", this.presenter.$view.css("visibility"));

    },

    'test show command set currentlyVisible to true': function () {
        this.presenter.isCurrentlyVisible = false;

        this.presenter.show();

        assertTrue(this.presenter.isCurrentlyVisible);
        assertEquals("visible", this.presenter.$view.css("visibility"));
    }

});