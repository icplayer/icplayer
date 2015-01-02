TestCase("[Image_Viewer_Public] Commands logic", {
    setUp: function() {
        this.presenter = AddonImage_Viewer_Public_create();
        this.presenter.configuration = {
            currentFrame: 0,
            frames: 6,
            frameNames: [{
                name: "ImageViewer1",
                frame: "1"
            }, {
                name: "ImageViewer3",
                frame: "3"
            }, {
                name: "ImageViewer5",
                frame: "5"
            }]
        };

        /*DOC: element = <div class='image-viewer'></div> */
        this.presenter.$element = this.element;

        sinon.stub(this.presenter, 'changeFrame');
        sinon.stub(this.presenter, 'setVisibility');
    },

    tearDown: function() {
        this.presenter.changeFrame.restore();
    },

    'test next on first frame should move to second one' : function() {
        this.presenter.next();

        assertEquals(1, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test next on last frame should move to first one' : function() {
        this.presenter.configuration.currentFrame = 5;

        this.presenter.next();

        assertEquals(0, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test previous on middle frame should move to one before' : function() {
        this.presenter.configuration.currentFrame = 4;

        this.presenter.previous();

        assertEquals(3, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test next on first frame should move to last one' : function() {
        this.presenter.previous();

        assertEquals(5, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test move to frame different than current' : function() {
        this.presenter.moveToFrameCommand(['3']);

        assertEquals(2, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test move to frame different than current via public API' : function() {
        this.presenter.moveToFrame(3);

        assertEquals(2, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test move to current frame' : function() {
        this.presenter.moveToFrameCommand(['1']);

        assertEquals(0, this.presenter.configuration.currentFrame);
        assertEquals(0, this.presenter.changeFrame.callCount)
    },

    'test move to frame that is invalid' : function() {
        this.presenter.moveToFrameCommand(['7']);

        assertEquals(0, this.presenter.configuration.currentFrame);
        assertEquals(0, this.presenter.changeFrame.callCount)
    },

    'test move to frame name that points to different frame than current' : function() {
        this.presenter.moveToFrameNameCommand(['ImageViewer5']);

        assertEquals(4, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test move to frame name that points to different frame than current via public API' : function() {
        this.presenter.moveToFrameName('ImageViewer5');

        assertEquals(4, this.presenter.configuration.currentFrame);
        assertTrue(this.presenter.changeFrame.calledOnce)
    },

    'test move to frame name that points to current' : function() {
        this.presenter.moveToFrameNameCommand(['ImageViewer1']);

        assertEquals(0, this.presenter.configuration.currentFrame);
        assertEquals(0, this.presenter.changeFrame.callCount)
    },

    'test move to frame name not defined' : function() {
        this.presenter.moveToFrameNameCommand(['TrueFalse1']);

        assertEquals(0, this.presenter.configuration.currentFrame);
        assertEquals(0, this.presenter.changeFrame.callCount)
    },

    'test get current frame': function () {
        var currentFrame = this.presenter.getCurrentFrame();

        assertEquals(1, currentFrame);
    },

    'test get current frame different than initial frame': function () {
        this.presenter.configuration.currentFrame = 3;

        var currentFrame = this.presenter.getCurrentFrame();

        assertEquals(4, currentFrame);
    }
});