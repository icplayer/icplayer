TestCase("[External Link Button] Model validation", {
    setUp: function () {
        this.presenter = AddonExternal_Link_Button_create();
    },
    
    'test empty URI property': function () {
    	// given
    	var model = {
    		'URI': ''
    	};
    	
    	// when
    	var validatedModel = this.presenter.validateModel(model);
    	
    	// then
    	assertFalse(validatedModel.isValid);
    	assertEquals('M01', validatedModel.errorCode);
    },
    
    'test proper model': function () {
    	// given
    	var model = {
    		'URI': 'http://www.wp.pl',
    		'Title': 'WP',
    		'Is Visible': 'True'
    	};
    	
    	// when
    	var validatedModel = this.presenter.validateModel(model);
    	
    	// then    	
    	
    	assertTrue(validatedModel.isValid);
    	assertEquals('http://www.wp.pl', validatedModel.URI);
    	assertEquals('WP', validatedModel.title);
    	assertTrue(validatedModel.isVisible);
    	assertTrue(validatedModel.isVisibleByDefault);    	
    },
    
    'test is not visible': function () {
    	// given
    	var model = {
    			'URI': 'http://www.wp.pl',
    			'Title': 'Cos',
    			'Is Visible': 'False',
    	};
    	
    	// when
    	var validatedModel = this.presenter.validateModel(model);
    	
    	// then
    	assertTrue(validatedModel.isValid);
    	assertFalse(validatedModel.isVisible);
    	assertFalse(validatedModel.isVisibleByDefault);
    },

    'test full config': function() {
        // given
        var model = {
            'Is Visible': "True",
            'Image': "/file/server/123456",
            'URI': 'callto:123456789',
            'Title': 'Call me!'
        };

        // when
        var validatedModel = this.presenter.validateModel(model);

        // then
        assertEquals('callto:123456789', validatedModel.URI);
        assertEquals('Call me!', validatedModel.title);
        assertTrue(validatedModel.isValid);
        assertEquals("/file/server/123456", validatedModel.image);
        assertEquals(this.presenter.DISPLAY_CONTENT_TYPE.BOTH, validatedModel.displayContent);
        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isVisibleByDefault);
    }
});