TestCase('[Audio] State restoring', {
    setUp : function() {
        this.presenter = AddonAudio_create();
        this.presenter.$view = $('<div></div>');
        this.presenter.audio = new Audio();

        this.presenter.configuration = { isVisible: true };

        this.playSpy = sinon.spy();
        this.pauseSpy = sinon.spy();
        this.presenter.audio = {
            src: "xxx",
            play: this.playSpy,
            pause: this.pauseSpy,
            paused: true,
            readyState: 4,
            duration: 20
        };

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hideAddon');
        sinon.stub(this.presenter, 'sendNotStartedEvent');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hideAddon.restore();
        this.presenter.sendNotStartedEvent.restore();
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
    },

    'test given never played audio when getState called then set wasPlayed as False' : function() {
        var state = this.presenter.getState();

        assertFalse(JSON.parse(state).wasPlayed);
    },

    'test given played audio when getState called then set wasPlayed as True' : function() {
        this.presenter._setPlayed(true);

        var state = this.presenter.getState();

        assertTrue(JSON.parse(state).wasPlayed);
    },

    'test given never played audio when setState called then set wasPlayed as False' : function() {
        var previousState= JSON.stringify({
            isVisible : true,
            playbackRate: 1.0,
            wasPlayed: false
        });

        this.presenter.setState(previousState);

        var state = this.presenter.getState();
        assertFalse(JSON.parse(state).wasPlayed);
    },

    'test given played audio when setState called then set wasPlayed as True' : function() {
        var previousState= JSON.stringify({
            isVisible : true,
            playbackRate: 1.0,
            wasPlayed: true
        });

        this.presenter.setState(previousState);

        var state = this.presenter.getState();
        assertTrue(JSON.parse(state).wasPlayed);
    },

    'test given played audio when setState called with state without wasPlayed then use default value False as wasPlayed' : function() {
        var previousState= JSON.stringify({
            isVisible : true,
            playbackRate: 1.0,
        });

        this.presenter.setState(previousState);

        var state = this.presenter.getState();
        assertFalse(JSON.parse(state).wasPlayed);
    },
});
