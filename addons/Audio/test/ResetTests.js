TestCase('[Audio] Reset', {
    setUp : function() {
        this.presenter = AddonAudio_create();
        this.presenter.configuration = {
            isPlaying: true
        };
        this.presenter.$view = $('<div></div>');

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hideAddon');
        sinon.stub(this.presenter, 'stop');

        this.stubs = {
            addEventListener: sinon.stub(),
            sendEvent: sinon.stub(),
        };
        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListener,
            sendEvent: this.stubs.sendEvent
        };
        this.presenter.setEventBus(this.presenter.eventBus);
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hideAddon.restore();
        this.presenter.stop.restore();
    },

    'test invisible to invisible' : function() {
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isVisible);
        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hideAddon.calledOnce);
        assertTrue(this.presenter.stop.calledOnce);
    },

    'test invisible to visible' : function() {
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hideAddon.calledOnce);
        assertTrue(this.presenter.stop.calledOnce);
    },

    'test visible to invisible' : function() {
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isVisible);
        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hideAddon.calledOnce);
        assertTrue(this.presenter.stop.calledOnce);
    },

    'test visible to visible' : function() {
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hideAddon.calledOnce);
        assertTrue(this.presenter.stop.calledOnce);
    },

    'audio is not playing' : function() {
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = true;
        this.presenter.configuration.isPlaying = false;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hideAddon.calledOnce);
        assertFalse(this.presenter.stop.calledOnce);
    },

    'test given not played state when reset executed then do not send any event' : function() {
        this.presenter._setPlayed(false);

        this.presenter.reset();

        assertFalse(this.stubs.sendEvent.called);
    },

    'test given played state when reset executed then do not send any event' : function() {
        this.presenter._setPlayed(true);

        this.presenter.reset();

        assertFalse(this.stubs.sendEvent.called);
    }
});
