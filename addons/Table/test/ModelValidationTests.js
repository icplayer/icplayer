TestCase("Model validation", {
    setUp: function() {
        this.presenter = AddonTable_create();

        this.emptyContentModel = {
            "Is Visible": "True",
            Rows: "2",
            Columns: "3",
            "Table cells": [{
                Row: "",
                Column: "",
                Content: ""
            }],
            "Columns width": [ { Width: ""} ],
            "Rows height": [ { Width: ""} ]
        };
    },

    'test empty configuration': function() {
        var model = {
            Rows: "",
            Columns: "",
            "Table cells": [{
                Row: "",
                Column: "",
                Content: ""
            }],
            "Columns width": [ { Width: ""} ],
            "Rows height": [ { Width: ""} ]
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
    },

    'test empty contents': function() {
        var validatedModel = this.presenter.validateModel(this.emptyContentModel);

        assertTrue(validatedModel.isValid);
        assertNotUndefined(validatedModel.contents);
        assertEquals([ "auto" , "auto" , "auto" ], validatedModel.columnsWidths);
        assertEquals([ "auto" , "auto" ], validatedModel.rowsHeight);

        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isVisibleByDefault);
    },

    'test rows error': function() {
        this.emptyContentModel.Rows = "rows";

        var validatedModel = this.presenter.validateModel(this.emptyContentModel);

        assertFalse(validatedModel.isValid);
        assertEquals('RW_01', validatedModel.errorCode);
    },

    'test columns error': function() {
        this.emptyContentModel.Columns = "columns";

        var validatedModel = this.presenter.validateModel(this.emptyContentModel);

        assertFalse(validatedModel.isValid);
        assertEquals('CL_01', validatedModel.errorCode);
    },

    'test contents problem': function() {
        var model = {
            Rows: "2",
            Columns: "3",
            "Table cells": [{
                Row: "3",
                Column: "3",
                Content: "content"
            }]
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
    },

    'test column widths problem': function () {
        var model = {
            Rows: "2",
            Columns: "3",
            "Table cells": [{
                Row: "2",
                Column: "3",
                Content: "content"
            }],
            "Columns width": [ { Width: ""}, { Width: ""}, { Width: ""}, { Width: ""} ],
            "Rows height": [ { Width: ""} ]
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('CW_01', validatedModel.errorCode);
    },

    'test row heights problem': function () {
        var model = {
            Rows: "2",
            Columns: "3",
            "Table cells": [{
                Row: "2",
                Column: "3",
                Content: "content"
            }],
            "Columns width": [ { Width: ""} ],
            "Rows height": [ { Width: ""}, { Width: ""}, { Width: ""}, { Width: ""} ]
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('RH_01', validatedModel.errorCode);
    }
});