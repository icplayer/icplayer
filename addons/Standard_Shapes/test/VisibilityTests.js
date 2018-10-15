function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isError: false,
        rotation: '1'
    }
}

TestCase('[Standard_Shapes] Visibility tests', {
    setUp: function () {
        this.presenter = AddonStandard_Shapes_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            drawLineStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.drawLine = this.stubs.drawLineStub;

		this.view = document.createElement('div');
		this.canvas = document.createElement('canvas');
		$(this.canvas).addClass('standardshapes-wrapper');
		this.view.append(this.canvas);
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