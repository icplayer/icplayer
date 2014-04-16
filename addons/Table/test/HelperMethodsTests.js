TestCase("Helper methods - getGapIndex", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: 'Table1'
        };
    },

    'test first gap in addon': function () {
        /*:DOC inp = <input id="Table1-1" class="ic_gap">*/

        var index = this.presenter.getGapIndex(this.inp);

        assertEquals(0, index);
    },

    'test third gap in addon': function () {
        /*:DOC inp = <input id="Table1-3" class="ic_gap">*/

        var index = this.presenter.getGapIndex(this.inp);

        assertEquals(2, index);
    },

    'test addon ID contains ID and index separator': function () {
        /*:DOC inp = <input id="Table1-2-1" class="ic_gap">*/
        this.presenter.configuration.addonID = 'Table1-2';

        var index = this.presenter.getGapIndex(this.inp);

        assertEquals(0, index);
    }
});

TestCase("Helper methods - removeMarkClassesFromAllGaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], id: "Table1-1", value: "" },
                    { answers: ["ans1"], id: "Table1-2", value: "" },
                    { answers: [""], id: "Table1-3", value: "" },
                    { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }
                ]
            },
            addonID: "Table1"
        };
    },

    'test no marks on gaps': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap">*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap">*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        this.presenter.removeMarkClassesFromAllGaps();

        assertEquals("ic_gap", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
        assertEquals("ic_gap", $(this.inp3).attr('class'));
        assertEquals("ic_gap", $(this.inp4).attr('class'));
    },

    'test different marks on each gap': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-correct">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap ic_gap-wrong">*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap ic_gap-empty">*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        this.presenter.removeMarkClassesFromAllGaps();

        assertEquals("ic_gap", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
        assertEquals("ic_gap", $(this.inp3).attr('class'));
        assertEquals("ic_gap", $(this.inp4).attr('class'));
    }
});

TestCase("Helper methods - resetIsEnabledProperty", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], id: "Table1-1", value: "" },
                    { answers: ["ans1"], id: "Table1-2", value: "" },
                    { answers: [""], id: "Table1-3", value: "" },
                    { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }
                ]
            }
        };

        sinon.stub(this.presenter, 'enableGap');
        sinon.stub(this.presenter, 'disableGap');
    },

    tearDown: function () {
        this.presenter.enableGap.restore();
        this.presenter.disableGap.restore();
    },

    'test gaps are disabled by default': function () {
        this.presenter.configuration.isDisabled = true;

        this.presenter.resetIsEnabledProperty();

        assertEquals(4, this.presenter.disableGap.callCount);
        assertFalse(this.presenter.enableGap.called);
    },

    'test gaps are enabled by default': function () {
        this.presenter.configuration.isDisabled = false;

        this.presenter.resetIsEnabledProperty();

        assertEquals(4, this.presenter.enableGap.callCount);
        assertFalse(this.presenter.disableGap.called);
    }
});

TestCase("Helper methods - restoreGapValues", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], id: "Table1-1", value: "" },
                    { answers: ["ans1"], id: "Table1-2", value: "" },
                    { answers: [""], id: "Table1-3", value: "" },
                    { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }
                ]
            },
            addonID: "Table1"
          };
       },

    'test all gaps are empty': function () {

        var gapValues = ["", "", "", ""],
            expectedDescriptions = [
                { answers: [""], id: "Table1-1", value: "" },
                { answers: ["ans1"], id: "Table1-2", value: "" },
                { answers: [""], id: "Table1-3", value: "" },
                { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }
            ];

        this.presenter.restoreGapValues(gapValues);

        assertEquals(expectedDescriptions, this.presenter.configuration.gaps.descriptions);
    },

    'test some gaps had not-empty content': function () {

        var gapValues = ["some value", "", "another value", ""],
            expectedDescriptions = [
                { answers: [""], id: "Table1-1", value: "some value" },
                { answers: ["ans1"], id: "Table1-2", value: "" },
                { answers: [""], id: "Table1-3", value: "another value" },
                { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }
            ];

        this.presenter.restoreGapValues(gapValues);

        assertEquals(expectedDescriptions, this.presenter.configuration.gaps.descriptions);
    }
});