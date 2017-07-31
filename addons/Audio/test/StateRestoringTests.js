TestCase('[Audio] State restoring', {
    setUp : function() {
        this.presenter = AddonAudio_create();
        this.presenter.$view = $('<div></div>');
        this.presenter.audio = new Audio();

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hideAddon');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hideAddon.restore();
    },

    'test set state to visible' : function() {
        this.presenter.configuration = {
            forceLoadAudio: false
        };
        this.presenter.setState(JSON.stringify({ isVisible: true }));

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hideAddon.calledOnce);
    },

    'test set state to invisible' : function() {
        this.presenter.configuration = {
            forceLoadAudio: false
        };
        this.presenter.setState(JSON.stringify({ isVisible: false }));

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hideAddon.calledOnce);
    },

    'test set state called with empty state string' : function() {
        this.presenter.setState("");

        assertFalse(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hideAddon.calledOnce);
    }
});