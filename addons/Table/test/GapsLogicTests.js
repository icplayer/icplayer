TestCase("Gaps logic", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'parseGaps');
        sinon.stub(this.presenter, 'replaceGapsWithHTMLElements');
        sinon.stub(this.presenter, 'setGapsWidth');
    },

    tearDown: function () {
        this.presenter.parseGaps.restore();
        this.presenter.replaceGapsWithHTMLElements.restore();
        this.presenter.setGapsWidth.restore();
    },

    'test run mode': function () {
        this.presenter.gapLogic(false);

        assertTrue(this.presenter.parseGaps.calledOnce);
        assertTrue(this.presenter.replaceGapsWithHTMLElements.calledOnce);
        assertTrue(this.presenter.setGapsWidth.calledOnce);
    },

    'test preview mode': function () {
        this.presenter.gapLogic(true);

        assertTrue(this.presenter.parseGaps.calledOnce);
        assertTrue(this.presenter.replaceGapsWithHTMLElements.calledOnce);
        assertTrue(this.presenter.setGapsWidth.calledOnce);
    }
});

TestCase("Value change event handler", {
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

        sinon.stub(this.presenter, 'getGapIndex');
        this.presenter.getGapIndex.returns(0);
        sinon.stub(this.presenter, 'sendValueChangeEvent');
    },

    tearDown: function () {
        this.presenter.getGapIndex.restore();
        this.presenter.sendValueChangeEvent.restore();
    },

    'test some': function () {
        /*:DOC inp1 = <input id="Table1-1" class="ic_gap">*/
        $(this.inp1).val("ans1");

        this.presenter.valueChangedEventHandler.apply(this.inp1);

        assertEquals("ans1", this.presenter.configuration.gaps.descriptions[0].value);
        assertTrue(this.presenter.sendValueChangeEvent.calledOnce);
    }
});