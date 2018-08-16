function getValidModel(isVisible) {
    return {
        "Is Visible": isVisible,
        'Items': []
    }
}

TestCase('[PieChart] Visibility tests', {
    setUp: function () {
        this.presenter = AddonPieChart_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            showStub: sinon.stub(),
            hideStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.show = this.stubs.showStub;
        this.presenter.hide = this.stubs.hideStub;

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));

        this.presenter.initiate(this.view, getValidModel("True"), true);

        assertFalse(this.stubs.hideStub.called);
        assertFalse(this.stubs.showStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.presenter.initiate(this.view, getValidModel("False"), true);

        assertFalse(this.stubs.hideStub.called);
        assertFalse(this.stubs.showStub.called);
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.presenter.initiate(this.view, getValidModel("True"), false);

        assertTrue(this.stubs.showStub.called);
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.presenter.initiate(this.view, getValidModel("False"), false);

        assertTrue(this.stubs.hideStub.called);
    }
});