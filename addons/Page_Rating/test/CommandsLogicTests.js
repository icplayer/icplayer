TestCase("Commands logic", {
    setUp : function() {
        this.presenter = AddonPage_Rating_create();
        sinon.stub(this.presenter, 'setVisibility');
        this.presenter.configuration = {};
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
    },

    'test show command' : function() {
        this.presenter.show();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test hide command' : function() {
        this.presenter.hide();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertFalse(this.presenter.configuration.isVisible);
    },
    
    'test get unchecked rate' : function() {
    	this.presenter.currentRate = 0;
    	var rate = this.presenter.getRate();
    	assertEquals('0', rate);
    },
    
    'test get checked rate' : function() {
    	this.presenter.currentRate = 3;
    	var rate = this.presenter.getRate();
    	assertEquals('3', rate);
    }
});