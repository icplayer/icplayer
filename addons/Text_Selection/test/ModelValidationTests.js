TestCase("[Text Selection] Model validation", {

    setUp: function() {
        this.presenter = AddonText_Selection_create();

        this.presenter.textParser = {
            parseAltTexts: sinon.stub(),
        };
        this.presenter.textParser.parseAltTexts.returnsArg(0);
    },

    'test empty Text property': function() {
        const model = {
            Text: ""
        };

        const validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M01', validatedModel.errorCode);
    },

    'test Text without correct or wrong': function() {
        const model = {
            Text: "Lorem ipsum maka paka",
            'Enable letters selections' : 'False'
        };

        const validatedModel = this.presenter.validateModel(model);
        
        assertFalse(validatedModel.isValid);
        assertEquals('M02', validatedModel.errorCode);
    },

    'test wrong marker in "All selectable" mode': function() {
        const model = {
            Mode: "All selectable",
            Text: "\\wrong{Lorem} ipsum maka paka",
            'Enable letters selections' : 'False'
        };

        const validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M03', validatedModel.errorCode);
    },

    'test empty word in marker': function() {
        const model = {
            Text: "\\wrong{} Lorem ipsum \\correct{}",
            'Enable letters selections' : 'False'
        };

        const validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M02', validatedModel.errorCode);
    },

    'test number of marked correct in single select type' : function() {
        const model = {
            Text: "qwe zxc \\wrong{zxcasd}",
            'Selection type': 'SINGLESELECT',
            'Enable letters selections' : 'False'
        };

        const validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M05', validatedModel.errorCode);
    },

    'test number of marked wrong in single select type' : function() {
        const model = {
            Text: "qwe zxc \\correct{zxcasd}",
            'Selection type': 'SINGLESELECT',
            'Enable letters selections' : 'False'
        };

        const validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M05', validatedModel.errorCode);
    }

});
