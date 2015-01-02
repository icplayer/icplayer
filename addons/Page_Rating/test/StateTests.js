TestCase("States tests", {
    setUp: function () {
        this.presenter = AddonPage_Rating_create();

        sinon.stub(this.presenter, 'setCommentValue');
        sinon.stub(this.presenter, 'setSelectedImage');
        sinon.stub(this.presenter, 'setVisibility');

        this.presenter.configuration = {};
    },

    tearDown: function () {
        this.presenter.setCommentValue.restore();
        this.presenter.setSelectedImage.restore();
        this.presenter.setVisibility.restore();
    },

    'test set state on empty state': function () {
        this.presenter.setState("");

        assertFalse(this.presenter.setCommentValue.called);
        assertFalse(this.presenter.setSelectedImage.called);
        assertFalse(this.presenter.setVisibility.called);
    },

    'test set state on filled state': function () {
        var state = JSON.stringify({
            commentValue: 'Comment',
            isVisible: true,
            selectedItem: 0
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.setCommentValue.calledWith("Comment"));
        assertTrue(this.presenter.setSelectedImage.calledWith(0));
        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test get state while is error': function () {
        this.presenter.configuration.isError = true;

        assertEquals("", this.presenter.getState());
    },

    'test get state while no error': function () {
        this.presenter.configuration.isError = false;
        this.presenter.configuration.isVisible = true;
        this.presenter.isElementSelected = 1;
        this.presenter.currentRate = 1;

        this.getCommentValueStub = sinon.stub(this.presenter, 'getCommentValue');
        this.getCommentValueStub.returns("some comment");

        var expectedState = JSON.stringify({
            commentValue: 'some comment',
            isVisible: true,
            selectedItem: 1,
            currentRate: 1
        });

        assertEquals(expectedState, this.presenter.getState());

        this.presenter.getCommentValue.restore();
    }
});
