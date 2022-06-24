function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        error: false,
        keyboardPosition: 'custom',
        toolbar: ''
    }
}

TestCase('[Paragraph Keyboard] Visibility tests', {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();

        this.stubs = {
            parseModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            initStub: sinon.stub(),
            thenStub: sinon.stub(),
            setWrapperIDStub: sinon.stub(),
            buildKeyboardStub: sinon.stub()
        };

        this.stubs.initStub.returns({
            then: this.stubs.thenStub
        });

        window.tinymce = {
            init: this.stubs.initStub
        };

        this.presenter.parseModel = this.stubs.parseModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setWrapperID = this.stubs.setWrapperIDStub;
        this.presenter.buildKeyboard = this.stubs.buildKeyboardStub;

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.parseModelStub.returns(getValidModel(true));

        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.parseModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.parseModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.parseModelStub.returns(getValidModel(false));

        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});