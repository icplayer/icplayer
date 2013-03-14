TestCase("Show and Hide Methods Tests", {
    setUp: function () {
        this.presenter = AddonImage_Viewer_Public_create();
        this.presenter.configuration = {
            defaultVisibility: true,
            currentVisibility: false,
            currentFrame: 0
        };

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'displayLabels');
        sinon.stub(this.presenter, 'hideLabels');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.displayLabels.restore();
        this.presenter.hideLabels.restore();
    },

    'test show method': function () {
        this.presenter.show();

        assertTrue(this.presenter.configuration.currentVisibility);
        assertTrue(this.presenter.configuration.defaultVisibility);
        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.displayLabels.calledWith(1));
        assertFalse(this.presenter.hideLabels.calledOnce);
    },

    'test hide method': function () {
        this.presenter.hide();

        assertFalse(this.presenter.configuration.currentVisibility);
        assertTrue(this.presenter.configuration.defaultVisibility);
        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.hideLabels.calledOnce);
        assertFalse(this.presenter.displayLabels.calledOnce);
    }
});