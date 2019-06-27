TestCase("[External Link Button] Presenter logic", {
	setUp: function () {
		this.presenter = AddonExternal_Link_Button_create();
		
		sinon.stub(this.presenter, 'validateModel');
		sinon.stub(this.presenter, 'getWrapper');
		sinon.stub(this.presenter, 'createElements');
		sinon.stub(this.presenter, 'setElementsDimensions');
		sinon.stub(this.presenter, 'setVisibility');
		
		sinon.stub(DOMOperationsUtils, 'showErrorMessage');
	},
	
	tearDown: function () {
		this.presenter.validateModel.restore();
		this.presenter.getWrapper.restore();
		this.presenter.createElements.restore();
		this.presenter.setElementsDimensions.restore();
		this.presenter.setVisibility.restore();
		
		DOMOperationsUtils.showErrorMessage.restore();
	},
	
	'test proper config': function () {
		this.presenter.validateModel.returns({ isValid: true });
		
		this.presenter.presenterLogic({}, {});
		
		assertTrue(this.presenter.validateModel.calledOnce);
		assertFalse(DOMOperationsUtils.showErrorMessage.called);
		assertTrue(this.presenter.getWrapper.calledOnce);
		assertTrue(this.presenter.createElements.calledOnce);
		
		assertTrue(this.presenter.setElementsDimensions.calledOnce);
	},

	'test errors during model validation': function () {
		this.presenter.validateModel.returns({ isValid: false, errorCode: 'M01' });
		
		this.presenter.presenterLogic({}, {});
		
		assertTrue(this.presenter.validateModel.calledOnce);
		assertTrue(DOMOperationsUtils.showErrorMessage.calledOnce);
		assertFalse(this.presenter.getWrapper.called);
		assertFalse(this.presenter.createElements.called);
		
		assertFalse(this.presenter.setElementsDimensions.called);
	},

});