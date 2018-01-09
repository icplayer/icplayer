TestCase("[Multiple_Audio_Controler_Binder] Audio interface tests", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
        this.stubs = {
            play: sinon.stub(),
            stop: sinon.stub(),
            jumpToID: sinon.stub()
        };

        this.audioPresenter = {
            type: 'audio',
            play: this.stubs.play,
            stop: this.stubs.stop,
            jumpToID: this.stubs.jumpToID
        };


    },
    
    'test should call play': function () {
        var audioInterface = new this.presenter.AudioInterface(this.audioPresenter);

        audioInterface.play();

        assertTrue(this.stubs.play.called);
        assertFalse(this.stubs.jumpToID.called);
    },

    'test should call jumpToID and play if type is multiaudio': function () {
        this.audioPresenter.type = 'multiaudio';

        var audioInterface = new this.presenter.AudioInterface(this.audioPresenter);

        audioInterface.play();

        assertTrue(this.stubs.jumpToID.called);
        assertTrue(this.stubs.play.called);
        assertTrue(this.stubs.jumpToID.calledBefore(this.stubs.play));
    },

    'test should call stop': function () {
        var audioInterface = new this.presenter.AudioInterface(this.audioPresenter);

        audioInterface.stop();

        assertTrue(this.stubs.stop.called);
    },
});
