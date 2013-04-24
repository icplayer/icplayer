TestCase("Commands logic - isGapIndexCorrect helper method", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "some value" },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "" },
                    { answers: [""], score: 1, id: "Table1-3", value: "" },
                    { answers: ["answ1", "answ2", "answ3"], score: 4, id: "Table1-4", value: "another value" }
                ]
            }
        };
    },

    'test smallest index possible': function () {
        assertTrue(this.presenter.isGapIndexCorrect(1));
    },

    'test largest index possible': function () {
        assertTrue(this.presenter.isGapIndexCorrect(4));
    },

    'test index too small': function () {
        assertFalse(this.presenter.isGapIndexCorrect(0));
    },

    'test index too high': function () {
        assertFalse(this.presenter.isGapIndexCorrect(6));
    },

    'test index is NaN': function () {
        assertFalse(this.presenter.isGapIndexCorrect("nan"));
    },

    'test empty gap descriptions array': function () {
        this.presenter.configuration.gaps.descriptions = [];

        assertFalse(this.presenter.isGapIndexCorrect(1));
    }
});

TestCase("Commands logic - getGapText / getGapValue", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "some value" },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "" },
                    { answers: [""], score: 1, id: "Table1-3", value: "" },
                    { answers: ["answ1", "answ2", "answ3"], score: 4, id: "Table1-4", value: "another value" }
                ]
            }
        };
    },

    'test proper gap index and gap empty': function () {
        assertEquals("", this.presenter.getGapText(2));
        assertEquals("", this.presenter.getGapValue(2));
        assertEquals("", this.presenter.getGapTextCommand("2"));
    },

    'test proper gap index and gap filled': function () {
        assertEquals("some value", this.presenter.getGapText(1));
        assertEquals("some value", this.presenter.getGapValue(1));
        assertEquals("some value", this.presenter.getGapTextCommand("1"));

        assertEquals("another value", this.presenter.getGapText(4));
        assertEquals("another value", this.presenter.getGapValue(4));
        assertEquals("another value", this.presenter.getGapTextCommand("4"));
    },

    'test invalid gap index': function () {
        assertUndefined(this.presenter.getGapText(0));
        assertUndefined(this.presenter.getGapValue(0));
        assertUndefined(this.presenter.getGapTextCommand(["0"]));

        assertUndefined(this.presenter.getGapText(5));
        assertUndefined(this.presenter.getGapValue(5));
        assertUndefined(this.presenter.getGapText(["5"]));

        assertUndefined(this.presenter.getGapText(-2));
        assertUndefined(this.presenter.getGapValue(-2));
        assertUndefined(this.presenter.getGapText(["-2"]));
    }
});

TestCase("Commands logic - markGapAsCorrect", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "" },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "" }
                ]
            }
        };

        this.presenter.$view = { find: function () {} };
        this.findStub = sinon.stub(this.presenter.$view, 'find');
    },

    'test gap has no additional style': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsCorrect(1);

        assertEquals("ic_gap ic_gap-correct", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap has no additional style - wrapper method': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsCorrectCommand(["1"]);

        assertEquals("ic_gap ic_gap-correct", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap was already marked': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-wrong">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsCorrect(1);

        assertEquals("ic_gap ic_gap-correct", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap was already marked but gap index is invalid': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-wrong">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsCorrect(3);

        assertEquals("ic_gap ic_gap-wrong", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    }
});

TestCase("Commands logic - markGapAsWrong", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "" },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "" }
                ]
            }
        };

        this.presenter.$view = { find: function () {} };
        this.findStub = sinon.stub(this.presenter.$view, 'find');
    },

    'test gap has no additional style': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsWrong(1);

        assertEquals("ic_gap ic_gap-wrong", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap has no additional style - wrapper method': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsWrongCommand(["1"]);

        assertEquals("ic_gap ic_gap-wrong", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap was already marked': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-empty">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsWrong(1);

        assertEquals("ic_gap ic_gap-wrong", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap was already marked but gap index is invalid': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-empty">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsWrong(3);

        assertEquals("ic_gap ic_gap-empty", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    }
});

TestCase("Commands logic - markGapAsEmpty", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "" },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "" }
                ]
            }
        };

        this.presenter.$view = { find: function () {} };
        this.findStub = sinon.stub(this.presenter.$view, 'find');
    },

    'test gap has no additional style': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsEmpty(1);

        assertEquals("ic_gap ic_gap-empty", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap has no additional style - wrapper method': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsEmptyCommand(["1"]);

        assertEquals("ic_gap ic_gap-empty", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap was already marked': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-wrong">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsEmpty(1);

        assertEquals("ic_gap ic_gap-empty", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    },

    'test gap was already marked but gap index is invalid': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap ic_gap-wrong">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.markGapAsEmpty(3);

        assertEquals("ic_gap ic_gap-wrong", $(this.inp1).attr('class'));
        assertEquals("ic_gap", $(this.inp2).attr('class'));
    }
});

TestCase("Commands logic - enableGap", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "", isEnabled: true },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "", isEnabled: true }
                ]
            }
        };

        this.presenter.$view = { find: function () {} };
        this.findStub = sinon.stub(this.presenter.$view, 'find');
    },

    'test gap is already enabled': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.enableGap(1);

        assertUndefined($(this.inp1).attr('disabled'));
        assertTrue(this.presenter.configuration.gaps.descriptions[0].isEnabled);
        assertUndefined($(this.inp2).attr('disabled'));
        assertTrue(this.presenter.configuration.gaps.descriptions[1].isEnabled);
    },

    'test both gaps are disabled but only one will be enabled': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap" disabled>*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap" disabled>*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));
        this.presenter.configuration.gaps.descriptions[0].isEnabled = false;
        this.presenter.configuration.gaps.descriptions[1].isEnabled = false;

        this.presenter.enableGap(1);

        assertUndefined($(this.inp1).attr('disabled'));
        assertTrue(this.presenter.configuration.gaps.descriptions[0].isEnabled);
        assertEquals("disabled", $(this.inp2).attr('disabled'));
        assertFalse(this.presenter.configuration.gaps.descriptions[1].isEnabled);
    },

    'test both gaps are disabled but only one will be enabled - command': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap" disabled>*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap" disabled>*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));
        this.presenter.configuration.gaps.descriptions[0].isEnabled = false;
        this.presenter.configuration.gaps.descriptions[1].isEnabled = false;

        this.presenter.enableGapCommand(["1"]);

        assertUndefined($(this.inp1).attr('disabled'));
        assertTrue(this.presenter.configuration.gaps.descriptions[0].isEnabled);
        assertEquals("disabled", $(this.inp2).attr('disabled'));
        assertFalse(this.presenter.configuration.gaps.descriptions[1].isEnabled);
    }
});

TestCase("Commands logic - disableGap", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], score: 1, id: "Table1-1", value: "", isEnabled: false },
                    { answers: ["ans1"], score: 2, id: "Table1-2", value: "", isEnabled: false }
                ]
            }
        };

        this.presenter.$view = { find: function () {} };
        this.findStub = sinon.stub(this.presenter.$view, 'find');
    },

    'test gap is already disabled': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap" disabled>*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap" disabled>*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));

        this.presenter.disableGap(1);

        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertFalse(this.presenter.configuration.gaps.descriptions[0].isEnabled);
        assertEquals("disabled", $(this.inp2).attr('disabled'));
        assertFalse(this.presenter.configuration.gaps.descriptions[1].isEnabled);
    },

    'test both gaps are enabled but only one will be disabled': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));
        this.presenter.configuration.gaps.descriptions[0].isEnabled = true;
        this.presenter.configuration.gaps.descriptions[1].isEnabled = true;

        this.presenter.disableGap(1);

        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertFalse(this.presenter.configuration.gaps.descriptions[0].isEnabled);
        assertUndefined($(this.inp2).attr('disabled'));
        assertTrue(this.presenter.configuration.gaps.descriptions[1].isEnabled);
    },

    'test both gaps are enabled but only one will be disabled - command': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        /*:DOC inp2 = <input id="Table1-2" class="ic_gap">*/
        this.findStub.withArgs('#Table1-1').returns($(this.inp1));
        this.presenter.configuration.gaps.descriptions[0].isEnabled = true;
        this.presenter.configuration.gaps.descriptions[1].isEnabled = true;

        this.presenter.disableGapCommand(["1"]);

        assertEquals("disabled", $(this.inp1).attr('disabled'));
        assertFalse(this.presenter.configuration.gaps.descriptions[0].isEnabled);
        assertUndefined($(this.inp2).attr('disabled'));
        assertTrue(this.presenter.configuration.gaps.descriptions[1].isEnabled);
    }
});