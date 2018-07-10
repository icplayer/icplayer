TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonNavigation_Bar_create();
    },

    'test model validation': function() {
        var model = {
            Styles: [{
                Pages: '',
                Class: '',
                Style: ''
            }],
            'playTitle': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.showNextPrevArrows);
        assertFalse(validatedModel.hideHomeLastArrows);
        assertFalse(validatedModel.isError);
    },

    'test model with empty item': function () {
        var model = {
            Styles: [{
                Pages: '1,2',
                Class: 'color',
                Style: 'background-color:red'
            },
            {
                Pages: '',
                Class: '',
                Style: ''
            }],
            'playTitle': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('E_01', validatedModel.errorCode);
    },

    'test model with neither Class nor Style properties filled': function () {
        var model = {
            Styles: [{
                Pages: '1,2',
                Class: 'color',
                Style: 'background-color:red'
            },
            {
                Pages: '3,4',
                Class: '',
                Style: ''
            }],
            'playTitle': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals('E_01', validatedModel.errorCode);
    },

    'test proper model with filled Pages and Class': function () {
        var model = {
            Styles: [{
                Pages: '1,2',
                Class: 'color',
                Style: 'background-color:red'
            },
            {
                Pages: '3,4',
                Class: 'color-1',
                Style: ''
            }],
            'playTitle': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
    },

    'test proper model with filled Pages and Style': function () {
        var model = {
            Styles: [{
                Pages: '1,2',
                Class: 'color',
                Style: 'background-color:red'
            }, {
                Pages: '3,4',
                Class: '',
                Style: 'background-color: black;'
            }],
            'playTitle': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
    },

    'test proper model with all fields filled': function () {
        var model = {
            Styles: [{
                Pages: '1,2',
                Class: 'color',
                Style: 'background-color:red'
            },
            {
                Pages: '3,4',
                Class: 'color-1',
                Style: 'background-color:green'
            }],
            'playTitle': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
    },

    'test model without property Styles': function () {
        var model = {
            ID: 'Navigation_Bar',
            'playTitle': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
    }
});