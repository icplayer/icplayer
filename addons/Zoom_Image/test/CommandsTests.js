TestCase("[Zoom Image] Show and hide commands", {
    setUp: function () {
        this.presenter = AddonZoom_Image_create();
        this.presenter.configuration = {};
        this.presenter.$view = $('<div></div>');
        sinon.spy(this.presenter, 'setVisibility');
    },

    'test visibility when it was set to false and pushed the reset button': function() {
        this.presenter.configuration.isVisible = false;
        this.presenter.configuration.isVisibleByDefault = true;

        this.presenter.reset();
    },

    'test show command' : function() {
        this.presenter.show();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.setVisibility.calledOnce);
    },

    'test hide command' : function() {
        this.presenter.hide();

        assertFalse(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.setVisibility.calledOnce);
    }
});