TestCase('[Audio] Show and hide commands', {
    setUp : function() {
        this.presenter = AddonAudio_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'stop')
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
        this.presenter.stop.restore();
    },

    'test show command' : function() {
        this.presenter.show();

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test hide command' : function() {
        this.presenter.hideAddon();

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertFalse(this.presenter.configuration.isVisible);
    }
});