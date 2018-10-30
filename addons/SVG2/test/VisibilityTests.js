function getValidModel(isVisible) {
    return {
        "Is Visible": isVisible,
        'SVG file': 'a'
    }
}

TestCase('[SVG2] Visibility tests', {
    setUp: function () {
        this.presenter = AddonSVG2_create();

        this.stubs = {
            setVisibilityStub: sinon.stub(),
            hasSVGSupportStub: sinon.stub(),
            loadFileStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.loadFileStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.hasSVGSupport = this.stubs.hasSVGSupportStub;

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.presenter.createPreview(this.view, getValidModel('True'));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.presenter.createPreview(this.view, getValidModel('False'));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.presenter.run(this.view, getValidModel('True'));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.presenter.run(this.view, getValidModel('False'));

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});