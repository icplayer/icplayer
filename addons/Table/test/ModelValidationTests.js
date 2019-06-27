TestCase("[Table] Model validation", {
    setUp: function() {
        this.presenter = AddonTable_create();

        this.emptyContentModel = {
            "ID": 'Table1',
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
            "ID": 'Table1',
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
        assertEquals([ "auto" , "auto" ], validatedModel.rowsHeights);
        assertEquals('Table1', validatedModel.addonID);

        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isVisibleByDefault);

        // Properties for gaps
        assertFalse(validatedModel.isDisabledByDefault);
        assertTrue(validatedModel.isActivity);
        assertFalse(validatedModel.isCaseSensitive);
        assertFalse(validatedModel.isPunctuationIgnored);
        assertEquals({isSet: false, value: undefined}, validatedModel.gapWidth);

        assertEquals(3, validatedModel.columnsCount);
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
    },

    'test gap width error': function() {
        this.emptyContentModel["Gap width"] = "gap";

        var validatedModel = this.presenter.validateModel(this.emptyContentModel);

        assertFalse(validatedModel.isValid);
        assertEquals('GW_01', validatedModel.errorCode);
    },

    'test gap width set': function() {
        this.emptyContentModel["Gap width"] = "10";

        var validatedModel = this.presenter.validateModel(this.emptyContentModel);

        assertTrue(validatedModel.isValid);
        assertNotUndefined(validatedModel.contents);
        assertEquals([ "auto" , "auto" , "auto" ], validatedModel.columnsWidths);
        assertEquals([ "auto" , "auto" ], validatedModel.rowsHeights);
        assertEquals('Table1', validatedModel.addonID);

        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isVisibleByDefault);

        // Properties for gaps
        assertFalse(validatedModel.isDisabledByDefault);
        assertTrue(validatedModel.isActivity);
        assertFalse(validatedModel.isCaseSensitive);
        assertFalse(validatedModel.isPunctuationIgnored);
        assertEquals({isSet: true, value: 10}, validatedModel.gapWidth);
    },

    'test is not an activity option selected': function() {
        this.emptyContentModel["Is not an activity"] = "True";

        var validatedModel = this.presenter.validateModel(this.emptyContentModel);

        assertFalse(validatedModel.isDisabledByDefault);
        assertFalse(validatedModel.isActivity);
        assertFalse(validatedModel.isCaseSensitive);
        assertFalse(validatedModel.isPunctuationIgnored);
        assertEquals({isSet: false, value: undefined}, validatedModel.gapWidth);
    }
});