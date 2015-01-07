TestCase("States tests", {
    setUp: function () {
        this.presenter = AddonAnimated_Lesson_Progress_create();

        sinon.stub(this.presenter, 'cleanView');
        sinon.stub(this.presenter, 'setViewImage');
        sinon.stub(this.presenter, 'setVisibility');

        this.presenter.configuration = {};
    },

    tearDown: function () {
        this.presenter.cleanView.restore();
        this.presenter.setViewImage.restore();
        this.presenter.setVisibility.restore();
    },

    'test set state on empty state': function () {
        this.presenter.setState("");

        assertFalse(this.presenter.cleanView.called);
        assertFalse(this.presenter.setViewImage.called);
        assertFalse(this.presenter.setVisibility.called);
    },

    'test set state on filled state': function () {
        var state = JSON.stringify({
            isVisible: true
        });

        this.presenter.setState(state);

        assertFalse(this.presenter.cleanView.called);
        assertFalse(this.presenter.setViewImage.calledWith(0));
        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test get state while is error': function () {
        this.presenter.configuration.isError = true;

        assertEquals("", this.presenter.getState());
    },

    'test get state while no error': function () {
        this.presenter.configuration.isError = false;
        this.presenter.configuration.isVisible = true;
        this.presenter.displayedImage = 0;

        var expectedState = JSON.stringify({
            isVisible: true
        });

        assertEquals(expectedState, this.presenter.getState());
    }
});
