TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonImage_Identification_create();
        
        this.presenter.configuration = {
            isBlockedInErrorCheckingMode: true
        };
    },

    'test full config': function () {
        var model = {
            "Is Visible": "True",
            ID: 'ImageIdentification1',
            Image: "/file/serve/123456",
            SelectionCorrect: "",
            isBlockedInErrorCheckingMode: true
        };

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);

        assertFalse(validationResult.shouldBeSelected);
        assertFalse(validationResult.isSelected);

        assertTrue(validationResult.isActivity);
        assertFalse(validationResult.isErrorCheckMode);

        assertEquals("/file/serve/123456", validationResult.imageSrc);
        assertEquals('ImageIdentification1', validationResult.addonID);
    },
    
    'test module blocked in "check error mode" and "block in error checking mode"' : function() {
    	this.presenter.$view = $('<div id="ImageIdentification1"></div>');
    	
    	assertTrue(this.presenter.configuration.isBlockedInErrorCheckingMode);
    }
});