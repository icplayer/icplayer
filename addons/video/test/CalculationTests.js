AddAttributeTests = TestCase("[Video] Calculations",{
    setUp: function () {
        this.presenter = Addonvideo_create();
    },

    'test calculatingCaptionsOffset without changeWith should set valid value': function () {
        this.presenter.getVideoSize = sinon.stub().returns({
            width: 100,
            height: 120
        });

        this.presenter.$captionsContainer = {};
        this.presenter.$captionsContainer.css = sinon.spy();


        var expected = {
            "left":0,
            "top":10
        };

        this.presenter.calculateCaptionsOffset({
            width: 100,
            height: 100
        }, false);

        assertTrue(this.presenter.$captionsContainer.css.calledWith({
            top: 10,
            left: 0,
            position: "absolute"
        }));

        assertTrue(this.presenter.$captionsContainer.css.calledOnce);
        assertEquals(expected, this.presenter.captionsOffset);

    },

    'test calculatingCaptionsOffset with changeWith should set valid value': function () {
        this.presenter.getVideoSize = sinon.stub().returns({
            width: 150,
            height: 10
        });

        this.presenter.$captionsContainer = {};
        this.presenter.$captionsContainer.css = sinon.spy();


        var expected = {
            "left":25,
            "top":45
        };

        this.presenter.calculateCaptionsOffset({
            width: 100,
            height: 100
        }, true);

        assertEquals(expected, this.presenter.captionsOffset);

        assertTrue(this.presenter.$captionsContainer.css.calledWith({
            width: 150,
            height: 10
        }));

        assertTrue(this.presenter.$captionsContainer.css.calledTwice);

    },

    'test video size should be properly returned test nr. 1' : function () {
        var expected = {
            "width":100,
            "height":52.34042553191489
        };

        var videoElement = {
            videoWidth: 235,
            videoHeight: 123
        };

        var result = this.presenter.getVideoSize({
            width: 100,
            height: 120
        }, videoElement);

        assertEquals(expected, result);
    },

    'test getVideoSize should return real value nr. 2' : function () {
        var expected = {
            "width":7.480938330752826,
            "height":120
        };

        var videoElement = {
            videoWidth: 2134,
            videoHeight: 34231
        };

        var result = this.presenter.getVideoSize({
            width: 2345,
            height: 120
        }, videoElement);

        assertEquals(expected, result);
    }
});