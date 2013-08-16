TestCase('[External Link Button] States restoring', {
    setUp : function() {
        this.presenter = AddonExternal_Link_Button_create();
        this.presenter.$view = $('<div></div>');
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibilityFromConfig');
    },

    tearDown : function() {
        this.presenter.setVisibilityFromConfig.restore();
    },

    'test set state to visible' : function() {
    	this.presenter.configuration = {
    		isVisible: false,
    		isVisibleByDefault: false
    	};
    	
        this.presenter.setState(JSON.stringify({ "isVisible" : true }));

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.setVisibilityFromConfig.calledOnce);
    },

    'test set state to invisible' : function() {
    	this.presenter.configuration = {
        	isVisible: true,
        	isVisibleByDefault: true
        };
    	
    	this.presenter.setState(JSON.stringify({ "isVisible" : false }));

        assertFalse(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.setVisibilityFromConfig.calledOnce);
    },

    'test reset function' : function() {
    	this.presenter.configuration = {
        	isVisible: false,
        	isVisibleByDefault: true
        };
    	
    	this.presenter.reset();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.setVisibilityFromConfig.calledOnce);
    },
});