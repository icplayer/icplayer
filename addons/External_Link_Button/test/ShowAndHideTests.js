TestCase('[External Link Button] Show and hide tests', {
	setUp : function() {
		this.presenter = AddonExternal_Link_Button_create();
		this.presenter.$view = $('<div></div>');
		this.presenter.configuration = {};
		
		sinon.spy(this.presenter, 'setVisibility');
	},
	
	tearDown : function() {
		this.presenter.setVisibility.restore();
	},
	
	'test show command' : function() {
		this.presenter.configuration.isVisible = false;
		
		this.presenter.show();
		
		assertTrue(this.presenter.setVisibility.calledOnce);
		assertTrue(this.presenter.configuration.isVisible);
	},
	
	'test hide command' : function() {
		this.presenter.configuration.isVisible = true;

		this.presenter.hide();
		
		assertTrue(this.presenter.setVisibility.calledOnce);
		assertFalse(this.presenter.configuration.isVisible);
	}
})