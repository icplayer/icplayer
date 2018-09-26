function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
    }
}

TestCase('[Paragraph] Visibility tests', {
    setUp: function () {
        this.presenter = AddonParagraph_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            initStub: sinon.stub(),
            thenStub: sinon.stub(),
            placeholderElementStub: sinon.stub(),
            getPluginsStub: sinon.stub(),
            addPluginsStub: sinon.stub(),
            getTinymceInitConfigurationStub: sinon.stub(),
            getTinyMceSelectorStub: sinon.stub()
        };

        this.stubs.initStub.returns({
            then: this.stubs.thenStub
        });

        window.tinymce = {
            init: this.stubs.initStub
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.placeholderElement = this.stubs.placeholderElementStub;
        this.presenter.getPlugins = this.stubs.getPluginsStub;
        this.presenter.addPlugins = this.stubs.addPluginsStub;
        this.presenter.getTinymceInitConfiguration = this.stubs.getTinymceInitConfigurationStub;
        this.presenter.getTinyMceSelector = this.stubs.getTinyMceSelectorStub;

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));

        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));

        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});