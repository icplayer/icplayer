TestCase("[Drawing] Model validation", {

    setUp: function() {
        this.presenter = AddonDrawing_create();
    },

    'test empty color property': function() {
        var model = {
            Color: "",
            Thickness: "2",
            Border: "1",
            Opacity: 1
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('C01', validatedModel.errorCode);
    },
    
    'test wrong length of numbers in hex format' : function() {
        var validatedModel = null,
            model = null;

        model = {
            Color: "#1234567",
            Thickness: "2",
            Border: "1",
            Opacity: 1
        };
        
        validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('C02', validatedModel.errorCode);
        
        model = {
            Color: "#12345",
            Thickness: "2",
            Border: "1",
            Opacity: 1
        };
        
        validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('C02', validatedModel.errorCode);
    },

    'test strange color name' : function() {
        var validatedModel = null,
            model = null;

        model = {
            Color: "ugabuga_color",
            Thickness: "2",
            Border: "1",
            Opacity: 1
        };

        validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('C03', validatedModel.errorCode);
    },
    
    'test empty thickness property': function() {
        var model = {
            Color: "Pink",
            Thickness: "",
            Border: "1",
            Opacity: 1
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('T01', validatedModel.errorCode);
    },
    
    'test thickness smaller than 1' : function() {
    	var model = {
            Color: "Pink",
            Thickness: "-3",
            Border: "1",
            Opacity: 1
        };
        
        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('T02', validatedModel.errorCode);
    },

    'test thickness bigger than 40' : function() {
    	var model = {
            Color: "Pink",
            Thickness: "41",
            Border: "1",
            Opacity: 1
        };
        
        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('T03', validatedModel.errorCode);
    },
    
    'test empty border property': function() {
        var model = {
            Color: "Pink",
            Thickness: "2",
            Border: "",
            Opacity: 1
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('B01', validatedModel.errorCode);
    },
    
    'test border smaller than 0' : function() {
    	var model = {
            Color: "Pink",
            Thickness: "2",
            Border: "-1",
            Opacity: 1
        };
        
        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('B02', validatedModel.errorCode);
    },
    
    'test border bigger than 5' : function() {
    	var model = {
            Color: "Pink",
            Thickness: "2",
            Border: "6",
            Opacity: 1
        };
        
        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('B03', validatedModel.errorCode);
    },

    'test correct model' : function() {
        var model = {
            Color: "Pink",
            Thickness: "2",
            Border: "5",
            Opacity: 1,
            'Is Visible': "False"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
    }

});