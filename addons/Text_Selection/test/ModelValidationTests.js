TestCase("[Text Selection] Model validation", {

    setUp: function() {
        this.presenter = AddonText_Selection_create();
    },

    'test empty Text property': function() {
        var model = {
            Text: ""
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M01', validatedModel.errorCode);
    },

    'test Text without correct or wrong': function() {
        var model = {
            Text: "Lorem ipsum maka paka",
            'Enable letters selections' : 'False'
        };

        var validatedModel = this.presenter.validateModel(model);
        
        assertFalse(validatedModel.isValid);
        assertEquals('M02', validatedModel.errorCode);
    },

    'test wrong marker in "All selectable" mode': function() {
        var model = {
            Mode: "All selectable",
            Text: "\\wrong{Lorem} ipsum maka paka",
            'Enable letters selections' : 'False'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M03', validatedModel.errorCode);
    },

    'test empty word in marker': function() {
        var model = {
            Text: "\\wrong{} Lorem ipsum \\correct{}",
            'Enable letters selections' : 'False'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M02', validatedModel.errorCode);
    },

    'test number of marked correct in single select type' : function() {
        var model = {
            Text: "qwe zxc \\wrong{zxcasd}",
            'Selection type': 'SINGLESELECT',
            'Enable letters selections' : 'False'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M05', validatedModel.errorCode);
    },

    'test number of marked wrong in single select type' : function() {
        var model = {
            Text: "qwe zxc \\correct{zxcasd}",
            'Selection type': 'SINGLESELECT',
            'Enable letters selections' : 'False'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('M05', validatedModel.errorCode);
    }

});