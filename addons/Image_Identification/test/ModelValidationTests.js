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
            isBlockedInErrorCheckingMode: true,
            langAttribute: 'pl-PL',
            speechTexts: {
                Selected: {Selected: 'Selected_Test'},
                Deselected: {Deselected: 'Deselected_Test'},
                Correct: {Correct: 'Correct_Test'},
                Wrong: {Wrong: 'Wrong_Test'}
            }
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
        assertEquals('pl-PL', validationResult.langTag);

        var correctSpeechTexts = {
            selected: 'Selected_Test',
            deselected: 'Deselected_Test',
            correct: 'Correct_Test',
            wrong: 'Wrong_Test'
        };
        assertEquals(correctSpeechTexts, validationResult.speechTexts);
    },
    
    'test module blocked in "check error mode" and "block in error checking mode"' : function() {
    	this.presenter.$view = $('<div id="ImageIdentification1"></div>');
    	
    	assertTrue(this.presenter.configuration.isBlockedInErrorCheckingMode);
    },

    'test adding langAttribute and speechTexts properties to the model' : function() {
        var model = {
            "Is Visible": "True",
            ID: 'ImageIdentification1',
            Image: "/file/serve/123456",
            SelectionCorrect: "",
            isBlockedInErrorCheckingMode: true
        };

        var upgradedModel = {
            "Is Visible": "True",
            ID: 'ImageIdentification1',
            Image: "/file/serve/123456",
            SelectionCorrect: "",
            isBlockedInErrorCheckingMode: true,
            langAttribute: '',
            speechTexts: {
                Selected: {Selected: 'Selected'},
                Deselected: {Deselected: 'Deselected'},
                Correct: {Correct: 'Correct'},
                Wrong: {Wrong: 'Wrong'}
            }
        };

        model = this.presenter.upgradeModel(model);
        assertEquals(upgradedModel, model);

    }
});