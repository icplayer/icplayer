function getValidModel(isVisible) {
    return {
        "Is Visible": isVisible,
        'Items': [
            {
                'Color': '#28e32a',
                'Starting percent': '100',
                'Answer': '100'
            }],
        'Radius': '',
        'Percents': '',
        'Step': ''
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

        this.presenter.eventBus = {
            addEventListener: function () {}
        };

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.presenter.createPreview(this.view, getValidModel("True"));

        assertFalse(this.stubs.hideStub.called);
        assertFalse(this.stubs.showStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.presenter.createPreview(this.view, getValidModel("False"));

        assertFalse(this.stubs.hideStub.called);
        assertFalse(this.stubs.showStub.called);
    },

    'test when not in preview mode and addon is visible, hide should not be called': function () {
        this.presenter.run(this.view, getValidModel("True"));

        assertTrue(this.stubs.showStub.called);
    },

    'test when not in preview mode and addon is not visible, hide should be called': function () {
        this.presenter.run(this.view, getValidModel("False"));

        assertTrue(this.stubs.hideStub.called);
    }
});