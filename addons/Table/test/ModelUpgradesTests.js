TestCase("Model upgrades - add columns widths", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.model = {
            Rows: "",
            Columns: "",
            "Table cells": [{
                Row: "",
                Column: "",
                Content: ""
            }]
        };
    },

    'test column width undefined': function () {
        var upgradedModel = this.presenter.addColumnsWidth(this.model);

        assertNotUndefined(upgradedModel["Columns width"]);
        assertEquals([{ Width: ""}], upgradedModel["Columns width"]);
    },

    'test column width already defined': function () {
        this.model["Columns width"] = [
            { Width: "10px" },
            { Width: "120px" },
            { Width: "1.25em" }
        ];

        var upgradedModel = this.presenter.addColumnsWidth(this.model);

        assertNotUndefined(upgradedModel["Columns width"]);
        assertEquals([{ Width: "10px" }, { Width: "120px" }, { Width: "1.25em" }], upgradedModel["Columns width"]);
    }
});

TestCase("Model upgrades - add rows heights", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.model = {
            Rows: "",
            Columns: "",
            "Table cells": [{
                Row: "",
                Column: "",
                Content: ""
            }],
            "Columns width": [ { Width: ""} ]
        };
    },

    'test row height undefined': function () {
        var upgradedModel = this.presenter.addRowHeights(this.model);

        assertNotUndefined(upgradedModel["Rows height"]);
        assertEquals([{ Height: ""}], upgradedModel["Rows height"]);
    },

    'test row height already defined': function () {
        this.model["Rows height"] = [
            { Height: "10px" },
            { Height: "120px" },
            { Height: "1.25em" }
        ];

        var upgradedModel = this.presenter.addRowHeights(this.model);

        assertNotUndefined(upgradedModel["Rows height"]);
        assertEquals([{ Height: "10px" }, { Height: "120px" }, { Height: "1.25em" }], upgradedModel["Rows height"]);
    }
});