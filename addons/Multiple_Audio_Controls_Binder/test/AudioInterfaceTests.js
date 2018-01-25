TestCase("[Multiple_Audio_Controler_Binder] Audio adapter tests", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
        this.stubs = {
            play: sinon.stub(),
            stop: sinon.stub(),
            jumpTo: sinon.stub()
        };

        this.audioPresenter = {
            type: 'audio',
            play: this.stubs.play,
            stop: this.stubs.stop,
            jumpTo: this.stubs.jumpTo
        };


    },
    
    'test should call play': function () {
        var audioInterface = new this.presenter.AudioAdapter(this.audioPresenter);

        audioInterface.play();

        assertTrue(this.stubs.play.called);
        assertFalse(this.stubs.jumpTo.called);
    },

    'test should call jumpToID and play if type is multiaudio': function () {
        this.audioPresenter.type = 'multiaudio';

        var audioInterface = new this.presenter.AudioAdapter(this.audioPresenter);

        audioInterface.play();

        assertTrue(this.stubs.jumpTo.called);
        assertTrue(this.stubs.play.called);
        assertTrue(this.stubs.jumpTo.calledBefore(this.stubs.play));
    },

    'test should call stop': function () {
        var audioInterface = new this.presenter.AudioAdapter(this.audioPresenter);

        audioInterface.stop();

        assertTrue(this.stubs.stop.called);
    },
});
