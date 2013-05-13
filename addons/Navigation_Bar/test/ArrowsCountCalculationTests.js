TestCase("Arrows count calculation", {
    setUp: function () {
        this.presenter = AddonNavigation_Bar_create();
        this.presenter.configuration = {
            showNextPrevArrows: false,
            hideHomeLastArrows: true
        };
    },

    'test no arrows': function() {
        assertEquals(0, this.presenter.getArrowsCount());
    },

    'test visible home and last arrows': function() {
        this.presenter.configuration.hideHomeLastArrows = false;

        assertEquals(2, this.presenter.getArrowsCount());
    },

    'test all arrows visible': function() {
        this.presenter.configuration.hideHomeLastArrows = false;
        this.presenter.configuration.showNextPrevArrows = true;


        assertEquals(4, this.presenter.getArrowsCount());
    }
});