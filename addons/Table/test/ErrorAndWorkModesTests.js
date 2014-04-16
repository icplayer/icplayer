TestCase("Error mode", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "", isEnabled: true },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "", isEnabled: true },
                    { answers: [""], score: 1, id: "Table1-3", value: "", isEnabled: true },
                    { answers: ["answ1", "answ2", "answ3"], score: 4, id: "Table1-4", value: "", isEnabled: true }
                ]
            },
            isActivity: true,
            isCaseSensitive: false,
            isPunctuationIgnored: false,
            addonID: "Table1"
        };
    },

    'test all gaps are empty': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap">*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap">*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        var gapValues = ["", "", "", ""];
        this.presenter.restoreGapValues(gapValues);

        this.presenter.setShowErrorsMode();

        assertEquals("ic_gap ic_gap-empty", $(this.inp1).attr('class'));
        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertEquals("ic_gap ic_gap-empty", $(this.inp2).attr('class'));
        assertEquals("disabled", $(this.inp2).attr('disabled'));
        assertEquals("ic_gap ic_gap-empty", $(this.inp3).attr('class'));
        assertEquals("disabled", $(this.inp3).attr('disabled'));
        assertEquals("ic_gap ic_gap-empty", $(this.inp4).attr('class'));
        assertEquals("disabled", $(this.inp4).attr('disabled'));
    },

    'test mixed answers results': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap">*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap">*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        var gapValues = ["not empty", "ans1", "", "answ3"];
        this.presenter.restoreGapValues(gapValues);

        this.presenter.setShowErrorsMode();

        assertEquals("ic_gap ic_gap-wrong", $(this.inp1).attr('class'));
        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertEquals("ic_gap ic_gap-correct", $(this.inp2).attr('class'));
        assertEquals("disabled", $(this.inp2).attr('disabled'));
        assertEquals("ic_gap ic_gap-empty", $(this.inp3).attr('class'));
        assertEquals("disabled", $(this.inp3).attr('disabled'));
        assertEquals("ic_gap ic_gap-correct", $(this.inp4).attr('class'));
        assertEquals("disabled", $(this.inp4).attr('disabled'));
    },

    'test not an activity': function () {
        this.presenter.configuration.isActivity = false;

        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap">*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap">*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        var gapValues = ["not empty", "ans1", "", "answ3"];
        this.presenter.restoreGapValues(gapValues);

        this.presenter.setShowErrorsMode();

        assertEquals("ic_gap", $(this.inp1).attr('class'));
        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
        assertEquals("disabled", $(this.inp2).attr('disabled'));
        assertEquals("ic_gap", $(this.inp3).attr('class'));
        assertEquals("disabled", $(this.inp3).attr('disabled'));
        assertEquals("ic_gap", $(this.inp4).attr('class'));
        assertEquals("disabled", $(this.inp4).attr('disabled'));
    }
});

TestCase("Work mode", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "", isEnabled: true },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "", isEnabled: true },
                    { answers: [""], score: 1, id: "Table1-3", value: "", isEnabled: true },
                    { answers: ["answ1", "answ2", "answ3"], score: 4, id: "Table1-4", value: "", isEnabled: true }
                ]
            },
            isActivity: true,
            isCaseSensitive: false,
            isPunctuationIgnored: false,
            addonID: "Table1"
        };
    },

    'test is activity': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-correct" disabled>*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap ic_gap-empty" disabled>*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap ic_gap-correct" disabled>*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap ic_gap-wrong" disabled>*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        this.presenter.setWorkMode();

        assertEquals("ic_gap", $(this.inp1).attr('class'));
        assertUndefined("disabled", $(this.inp1).attr('disabled'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
        assertUndefined("disabled", $(this.inp2).attr('disabled'));
        assertEquals("ic_gap", $(this.inp3).attr('class'));
        assertUndefined("disabled", $(this.inp3).attr('disabled'));
        assertEquals("ic_gap", $(this.inp4).attr('class'));
        assertUndefined("disabled", $(this.inp4).attr('disabled'));
    },

    'test is not an activity': function () {
        this.presenter.configuration.isActivity = false;

        /*:DOC inp1 = <input id="Table1-1" class="ic_gap" disabled>*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap" disabled>*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap" disabled>*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap" disabled>*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        this.presenter.setWorkMode();

        assertEquals("ic_gap", $(this.inp1).attr('class'));
        assertUndefined("disabled", $(this.inp1).attr('disabled'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
        assertUndefined("disabled", $(this.inp2).attr('disabled'));
        assertEquals("ic_gap", $(this.inp3).attr('class'));
        assertUndefined("disabled", $(this.inp3).attr('disabled'));
        assertEquals("ic_gap", $(this.inp4).attr('class'));
        assertUndefined("disabled", $(this.inp4).attr('disabled'));
    },

    'test is activity and gaps were disabled by default': function () {
        this.presenter.configuration.gaps.descriptions[0].isEnabled = false;
        this.presenter.configuration.gaps.descriptions[1].isEnabled = false;
        this.presenter.configuration.gaps.descriptions[2].isEnabled = false;
        this.presenter.configuration.gaps.descriptions[3].isEnabled = false;

        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-correct" disabled>*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap ic_gap-empty" disabled>*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap ic_gap-correct" disabled>*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap ic_gap-wrong" disabled>*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        this.presenter.setWorkMode();

        assertEquals("ic_gap", $(this.inp1).attr('class'));
        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
        assertEquals("disabled", $(this.inp2).attr('disabled'));
        assertEquals("ic_gap", $(this.inp3).attr('class'));
        assertEquals("disabled", $(this.inp3).attr('disabled'));
        assertEquals("ic_gap", $(this.inp4).attr('class'));
        assertEquals("disabled", $(this.inp4).attr('disabled'));
    },

    'test is not an activity and few gaps were disabled': function () {
        this.presenter.configuration.isActivity = false;

        this.presenter.configuration.gaps.descriptions[0].isEnabled = false;
        this.presenter.configuration.gaps.descriptions[1].isEnabled = true;
        this.presenter.configuration.gaps.descriptions[2].isEnabled = false;
        this.presenter.configuration.gaps.descriptions[3].isEnabled = true;

        /*:DOC inp1 = <input id="Table1-1" class="ic_gap" disabled>*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap" disabled>*/
        /*:DOC inp3 = <input id="Table1-3" class="ic_gap" disabled>*/
        /*:DOC inp4 = <input id="Table1-4" class="ic_gap" disabled>*/

        this.presenter.$view = { find: function () {} };
        var findStub = sinon.stub(this.presenter.$view, 'find');
        findStub.returns([this.inp1, this.inp2, this.inp3, this.inp4]);

        this.presenter.setWorkMode();

        assertEquals("ic_gap", $(this.inp1).attr('class'));
        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
        assertUndefined("disabled", $(this.inp2).attr('disabled'));
        assertEquals("ic_gap", $(this.inp3).attr('class'));
        assertEquals("disabled", $(this.inp3).attr('disabled'));
        assertEquals("ic_gap", $(this.inp4).attr('class'));
        assertUndefined("disabled", $(this.inp4).attr('disabled'));
    }
});