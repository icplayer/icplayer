TestCase("Presenter logic process", {
    setUp: function () {
        this.presenter = AddonPage_Rating_create();

        sinon.stub(this.presenter, 'updateView');
        sinon.stub(this.presenter, 'setVisibility');
        this.modelSanitizationStub = sinon.stub(this.presenter, 'sanitizeModel');
        this.modelSanitizationStub.returns({
            isError: false
        });

        sinon.stub(DOMOperationsUtils, 'showErrorMessage');

        this.viewElement = $('<div></div>');
    },

    tearDown: function () {
        this.presenter.updateView.restore();
        this.presenter.setVisibility.restore();
        this.presenter.sanitizeModel.restore();

        DOMOperationsUtils.showErrorMessage.restore();
    },

    'test error while sanitizing model': function () {
        this.modelSanitizationStub.returns({ isError: true});

        this.presenter.presenterLogic(this.viewElement, {}, false);

        assertTrue(DOMOperationsUtils.showErrorMessage.calledOnce);
        assertFalse(this.presenter.setVisibility.called);
        assertFalse(this.presenter.updateView.called);
    },

    'test model sanitation went well in Addon preview (Editor)': function () {
        this.modelSanitizationStub.returns({ isError: false});
        this.presenter.presenterLogic(this.viewElement, {}, true);

        assertFalse(DOMOperationsUtils.showErrorMessage.called);
        assertTrue(this.presenter.setVisibility.called);
        assertTrue(this.presenter.updateView.called);
    },

    'test model sanitation went well in Addon run (Player)': function () {
        this.modelSanitizationStub.returns({ isError: false});

        this.presenter.presenterLogic(this.viewElement, {}, false);

        assertFalse(DOMOperationsUtils.showErrorMessage.called);
        assertTrue(this.presenter.setVisibility.called);
        assertTrue(this.presenter.updateView.called);
    },

    'test setting visibility' : function() {
        this.modelSanitizationStub.returns({ isError: false});

        this.presenter.presenterLogic(this.viewElement, {}, true);

        assertFalse(DOMOperationsUtils.showErrorMessage.called);
        assertTrue(this.presenter.setVisibility.calledOnce);
        assertTrue(this.presenter.updateView.called);
    }

});

