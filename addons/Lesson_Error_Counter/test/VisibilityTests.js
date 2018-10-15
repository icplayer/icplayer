function getValidModel(isVisible) {
    return {
        isVisibleByDefault: isVisible,
        isValid: true
    }
}

TestCase('[Lesson_Error_Counter] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonLesson_Error_Counter_create();

        this.stubs = {
            sanitizeModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            countErrorsStub: sinon.stub()
        };

        this.presenter.sanitizeModel = this.stubs.sanitizeModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.countErrors = this.stubs.countErrorsStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});