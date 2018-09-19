function getValidModel(isVisible) {
    return {
        'Is Visible': isVisible ? "True" : "False"
    }
}

TestCase('[Limited_Show_Answers] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonMenuPanel_create();

        this.stubs = {
            setAlignmentStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            setAbilityAllStub: sinon.stub(),
            drawElementsStub: sinon.stub(),
            buildElementsArrayStub: sinon.stub()
        };

        this.presenter.setAlignment = this.stubs.setAlignmentStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setAbilityAll = this.stubs.setAbilityAllStub;
        this.presenter.drawElements = this.stubs.drawElementsStub;
        this.presenter.buildElementsArray = this.stubs.buildElementsArrayStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should not be called': function () {
        this.presenter.createPreview(this.view, getValidModel(true));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        this.presenter.createPreview(this.view, getValidModel(false));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.presenter.run(this.view, getValidModel(true));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.presenter.run(this.view, getValidModel(false));

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});