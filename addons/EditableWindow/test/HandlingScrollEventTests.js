TestCase("[EditableWindow] Handling scroll event", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();

        this.presenter.temporaryState = {
            isFullScreen: false,
            scrollTop: 0,
            scaleInfo: {
                scaleX: 1.0,
                scaleY: 1.0
            }
        };

        this.mocks = {
            updateFullScreenWindowTop: sinon.stub(this.presenter, "updateFullScreenWindowTop"),
        };
    },

    'test given presenter is not in full screen mode when scroll event comes then updateFullScreenWindowTop not called': function () {
        var eventData = {
            value: '100'
        };

        this.presenter.handleScrollEvent(eventData);

        assertFalse(this.mocks.updateFullScreenWindowTop.called);
    },

    'test given presenter is in full screen mode when scroll event comes then updateFullScreenWindowTop called': function () {
        this.presenter.temporaryState.isFullScreen = true;
        var eventData = {
            value: '100'
        };

        this.presenter.handleScrollEvent(eventData);

        assertTrue(this.mocks.updateFullScreenWindowTop.called);
    },

    'test given scroll in state when scroll event comes then scroll value in state will be number and will be changed': function () {
        assertEquals(0, this.presenter.temporaryState.scrollTop);

        var eventData = {
            value: '100'
        };

        this.presenter.handleScrollEvent(eventData);

        assertEquals('number', typeof this.presenter.temporaryState.scrollTop);
        assertEquals(100, this.presenter.temporaryState.scrollTop);
    }
});

