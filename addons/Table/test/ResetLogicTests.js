TestCase("Reset logic", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: [
                    { answers: [""], id: "Table1-1", value: "some value" },
                    { answers: ["ans1"], id: "Table1-2", value: "another value" },
                    { answers: [""], id: "Table1-3", value: "answer" },
                    { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "something" }
                ]
            }
        };

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'restoreGapValues');
        sinon.stub(this.presenter, 'resetIsEnabledProperty');
        sinon.stub(this.presenter, 'removeMarkClassesFromAllGaps');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.restoreGapValues.restore();
        this.presenter.resetIsEnabledProperty.restore();
        this.presenter.removeMarkClassesFromAllGaps.restore();
    },

    'test reset to visible': function () {
        this.presenter.configuration.isVisibleByDefault = true;

        this.presenter.reset();

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.removeMarkClassesFromAllGaps.calledOnce);
        assertTrue(this.presenter.resetIsEnabledProperty.calledOnce);
        assertTrue(this.presenter.restoreGapValues.calledWith(["", "", "", ""]));
    },

    'test reset to invisible': function () {
        this.presenter.configuration.isVisibleByDefault = false;

        this.presenter.reset();

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.resetIsEnabledProperty.calledOnce);
        assertTrue(this.presenter.restoreGapValues.calledWith(["", "", "", ""]));
    }
});