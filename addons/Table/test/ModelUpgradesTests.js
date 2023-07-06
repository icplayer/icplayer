TestCase("[Table] Model upgrades - add columns widths", {
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

TestCase("[Table] Model upgrades - add rows heights", {
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

TestCase("[Table] Model upgrades - add langAttribute", {
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

    'test langAttribute undefined': function () {
        var upgradedModel = this.presenter.addLangTag(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("", upgradedModel["langAttribute"]);
    },

    'test langAttribute already defined': function () {
        this.model["langAttribute"] = "it-IT";

        var upgradedModel = this.presenter.addLangTag(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("it-IT", upgradedModel["langAttribute"]);
    },

    'test given model without header properties when upgradeModel is called then missing properties are added with default values': function () {
        this.model['speechTexts'] = {};

        var upgradedModel = this.presenter.addHeaders(this.model);

        assertEquals("False", upgradedModel["isFirstColumnHeader"]);
        assertEquals("False", upgradedModel["isFirstRowHeader"]);
        assertNotUndefined(upgradedModel['speechTexts']["Row"]);
        assertEquals("Row", upgradedModel['speechTexts']["Row"]["Row"]);
        assertNotUndefined(upgradedModel['speechTexts']["Column"]);
        assertEquals("Column", upgradedModel['speechTexts']["Column"]["Column"]);
    },

    'test given model with header properties when upgradeModel is called the header properties are unaffected': function () {
        this.model['speechTexts'] = {
            Row: {Row: "Wiersz"},
            Column: {Column: "Kolumna"}
        };
        this.model["isFirstRowHeader"] = "True";
        this.model["isFirstColumnHeader"] = "True";

        var upgradedModel = this.presenter.addHeaders(this.model);

        assertEquals("True", upgradedModel["isFirstColumnHeader"]);
        assertEquals("True", upgradedModel["isFirstRowHeader"]);
        assertNotUndefined(upgradedModel['speechTexts']["Row"]);
        assertEquals("Wiersz", upgradedModel['speechTexts']["Row"]["Row"]);
        assertNotUndefined(upgradedModel['speechTexts']["Column"]);
        assertEquals("Kolumna", upgradedModel['speechTexts']["Column"]["Column"]);
    },

    'test given model without span speech texts when addSpanSpeechTexts is called then missing properties are added with default values': function () {
        this.model['speechTexts'] = {};

        var upgradedModel = this.presenter.addSpanSpeechTexts(this.model);

        assertNotUndefined(upgradedModel['speechTexts']["RowSpan"]);
        assertEquals("Row span", upgradedModel['speechTexts']["RowSpan"]["RowSpan"]);
        assertNotUndefined(upgradedModel['speechTexts']["ColSpan"]);
        assertEquals("Column span", upgradedModel['speechTexts']["ColSpan"]["ColSpan"]);
    },
});

TestCase("[Table] Model upgrades - add gap max length", {
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

    'test given model without gapMaxLength when addGapMaxLength is called then missing properties are added with default value': function () {
        const upgradedModel = this.presenter.addGapMaxLength(this.model);

        assertNotUndefined(upgradedModel["GapMaxLength"]);
        assertEquals(["0"], upgradedModel["GapMaxLength"]);
    },

    'test given model with gapMaxLength when addGapMaxLength is called then the property are not changed': function () {
        this.model['GapMaxLength'] = '12';
        const upgradedModel = this.presenter.addGapMaxLength(this.model);

        assertEquals(["12"], upgradedModel["GapMaxLength"]);
    }
});