TestCase("[Video] Free Up Memory Tests", {
    setUp: function () {
        this.presenter = Addonvideo_create();
        /*:DOC view = <div><div class="video-caontainer"><video controls="controls">Video playback is not supported on your browser.</video></div></div>*/

        this.presenter.videoContainer = $(this.view).find('.video-container');
        this.presenter.videoView = this.view;
        this.presenter.$view = $(this.view);
        this.presenter.videoObject = this.presenter.videoView;
        this.presenter.$videoObject = $(this.presenter.videoView);
        this.presenter.registerHook();
        this.stubs = {
            unbind: sinon.stub(this.presenter.$videoObject, 'unbind'),
            removeHook: sinon.stub(MathJax.Hub.signal.hooks["End Process"], 'Remove'),
            registerHook: sinon.stub(MathJax.Hub.Register, 'MessageHook'),
            offView: sinon.stub(this.presenter.$view, 'off'),
            removeEventListener: sinon.stub(this.presenter.videoObject, 'removeEventListener')
        };
    },

    tearDown: function () {
        this.presenter.$videoObject.unbind.restore();
        MathJax.Hub.signal.hooks["End Process"].Remove.restore();
        MathJax.Hub.Register.MessageHook.restore();
        this.presenter.$view.off.restore();
        this.stubs.removeEventListener.restore();
    },

    'test event listeners are off': function () {
        this.presenter.destroy();

        assertTrue(this.stubs.removeEventListener.called);
        assertTrue(this.stubs.unbind.called);
        assertTrue(this.stubs.removeHook.called);
        assertTrue(this.stubs.offView.called);

        assertEquals('ended', this.stubs.unbind.args[0][0]);
        assertEquals('error', this.stubs.unbind.args[1][0]);
        assertEquals('canplay', this.stubs.unbind.args[2][0]);
        assertEquals('timeupdate', this.stubs.unbind.args[3][0]);

        assertEquals('DOMNodeRemoved', this.stubs.removeEventListener.args[0][0]);
        assertEquals('click', this.stubs.removeEventListener.args[1][0]);
        assertEquals('loadedmetadata', this.stubs.removeEventListener.args[2][0]);
        assertEquals('play', this.stubs.removeEventListener.args[3][0]);
        assertEquals('pause', this.stubs.removeEventListener.args[4][0]);
        assertEquals('stalled', this.stubs.removeEventListener.args[5][0]);
        assertEquals('webkitfullscreenchange', this.stubs.removeEventListener.args[6][0]);
    },

    'test null is assigned to variables': function () {
        this.presenter.destroy();
        assertEquals(null, this.presenter.view);
        assertEquals(null, this.presenter.viewObject);
        assertEquals(null, this.presenter.mathJaxHook);
        assertEquals(null, this.presenter.eventBus);
        assertEquals(null, this.presenter.videoObject);
    },

    'test added and removed mathJaxHook': function() {
        this.presenter.registerHook(); //register
        this.presenter.removeMathJaxHook(); //remove

        assert(this.stubs.registerHook.called);
        assert(this.stubs.removeHook.called);
    }
});