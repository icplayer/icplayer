TestCase("Frames changing", {
    setUp: function () {
        this.presenter = AddonImage_Viewer_Public_create();
        this.presenter.configuration = {
            currentFrame: 0,
            frames: 6,
            frameNames: [
                { name: "ImageViewer1", frame: "1" },
                { name: "ImageViewer3", frame: "3" },
                { name: "ImageViewer5", frame: "5" }
            ],
            currentVisibility: true
        };

        /*DOC: element = <div class='image-viewer'></div> */
        this.presenter.$element = this.element;

        sinon.stub(this.presenter, 'triggerFrameChangeEvent');
        sinon.stub(this.presenter, 'stopAllAudio');
        sinon.stub(this.presenter, 'playAudio');
        sinon.stub(this.presenter, 'displayLabels');
        sinon.stub(this.presenter, 'hideLabels');
        sinon.stub(this.presenter, 'changeBackgroundPosition');
        sinon.stub(this.presenter, 'changeCurrentDot');
    },

    tearDown: function () {
        this.presenter.triggerFrameChangeEvent.restore();
        this.presenter.stopAllAudio.restore();
        this.presenter.playAudio.restore();
        this.presenter.displayLabels.restore();
        this.presenter.hideLabels.restore();
        this.presenter.changeBackgroundPosition.restore();
        this.presenter.changeCurrentDot.restore();
    },

    'test changing frame to first': function () {
        this.presenter.changeFrame(false, false, true);

        assertFalse(this.presenter.playAudio.called);
        assertTrue(this.presenter.stopAllAudio.calledOnce);
        assertTrue(this.presenter.changeBackgroundPosition.calledOnce);
        assertTrue(this.presenter.changeCurrentDot.calledOnce);
        assertTrue(this.presenter.displayLabels.calledOnce);
        assertFalse(this.presenter.hideLabels.called);
        assertTrue(this.presenter.triggerFrameChangeEvent.calledOnce);
    },

    'test changing frame not to first one': function () {
        this.presenter.configuration.currentFrame = 3;

        this.presenter.changeFrame(false, false, true);

        assertTrue(this.presenter.playAudio.calledOnce);
        assertFalse(this.presenter.stopAllAudio.called);
        assertTrue(this.presenter.changeBackgroundPosition.calledOnce);
        assertTrue(this.presenter.changeCurrentDot.calledOnce);
        assertTrue(this.presenter.displayLabels.calledOnce);
        assertFalse(this.presenter.hideLabels.called);
        assertTrue(this.presenter.triggerFrameChangeEvent.calledOnce);
    },

    'test changing frame to first in preview mode': function () {
        this.presenter.changeFrame(true, false, true);

        assertFalse(this.presenter.playAudio.called);
        assertFalse(this.presenter.stopAllAudio.called);
        assertTrue(this.presenter.changeBackgroundPosition.calledOnce);
        assertTrue(this.presenter.changeCurrentDot.calledOnce);
        assertTrue(this.presenter.displayLabels.calledOnce);
        assertFalse(this.presenter.hideLabels.called);
        assertFalse(this.presenter.triggerFrameChangeEvent.called);
    },

    'test changing frame not to first one in preview mode': function () {
        this.presenter.configuration.currentFrame = 3;

        this.presenter.changeFrame(true, false, true);

        assertFalse(this.presenter.playAudio.called);
        assertFalse(this.presenter.stopAllAudio.called);
        assertTrue(this.presenter.changeBackgroundPosition.calledOnce);
        assertTrue(this.presenter.changeCurrentDot.calledOnce);
        assertTrue(this.presenter.displayLabels.calledOnce);
        assertFalse(this.presenter.hideLabels.called);
        assertFalse(this.presenter.triggerFrameChangeEvent.called);
    },

    'test changing frame without triggering event': function () {
        this.presenter.configuration.currentFrame = 3;

        this.presenter.changeFrame(false, false, false);

        assertTrue(this.presenter.playAudio.calledOnce);
        assertFalse(this.presenter.stopAllAudio.called);
        assertTrue(this.presenter.changeBackgroundPosition.calledOnce);
        assertTrue(this.presenter.changeCurrentDot.calledOnce);
        assertTrue(this.presenter.displayLabels.calledOnce);
        assertFalse(this.presenter.hideLabels.called);
        assertFalse(this.presenter.triggerFrameChangeEvent.called);
    },

    'test changing frame without triggering event while addon is invisible': function () {
        this.presenter.configuration.currentFrame = 3;
        this.presenter.configuration.currentVisibility = false;

        this.presenter.changeFrame(false, false, false);

        assertTrue(this.presenter.playAudio.calledOnce);
        assertFalse(this.presenter.stopAllAudio.called);
        assertTrue(this.presenter.changeBackgroundPosition.calledOnce);
        assertTrue(this.presenter.changeCurrentDot.calledOnce);
        assertFalse(this.presenter.displayLabels.calledOnce);
        assertTrue(this.presenter.hideLabels.calledOnce);
        assertFalse(this.presenter.triggerFrameChangeEvent.called);
    }
});