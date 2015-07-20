TestCase("[Math] Commands logic - evaluate", {
    setUp: function () {
        this.presenter = AddonMath_create();

        this.presenter.configuration = {
            expressions: {},
            variables: {},
            onCorrectEvent: "CORRECT",
            onIncorrectEvent: "INCORRECT",
            onPartialEvent: "PARTIAL"
        };

        sinon.stub(this.presenter, 'getEmptyGaps');
        this.presenter.getEmptyGaps.returns({ isValid: true, gaps: []});
        sinon.stub(this.presenter, 'evaluateAllExpressions');
        sinon.stub(this.presenter, 'executeEventCode');
        sinon.stub(this.presenter, 'markGapsEmptiness');
    },

    tearDown: function () {
        this.presenter.getEmptyGaps.restore();
        this.presenter.evaluateAllExpressions.restore();
        this.presenter.executeEventCode.restore();
        this.presenter.markGapsEmptiness.restore();
    },

    'test Addon is in error checking mode': function () {
        this.presenter.isErrorMode = true;

        this.presenter.evaluate();

        assertEquals(0, this.presenter.getEmptyGaps.callCount);
    },

    'test not all gaps are filled': function () {
        this.presenter.getEmptyGaps.returns({ isValid: true, gaps: ["gap03"]});

        this.presenter.evaluate();

        assertEquals(1, this.presenter.getEmptyGaps.callCount);
        assertTrue(this.presenter.executeEventCode.calledWith("PARTIAL"));
        assertEquals(0, this.presenter.evaluateAllExpressions.callCount);
    },

    'test expressions evaluates to true': function () {
        this.presenter.evaluateAllExpressions.returns({ overall: true });

        this.presenter.evaluate();

        assertEquals(1, this.presenter.getEmptyGaps.callCount);
        assertEquals(1, this.presenter.evaluateAllExpressions.callCount);
        assertTrue(this.presenter.executeEventCode.calledWith("CORRECT"));
    },

    'test expressions evaluates to false': function () {
        this.presenter.evaluateAllExpressions.returns({ overall: false });

        this.presenter.evaluate();

        assertEquals(1, this.presenter.getEmptyGaps.callCount);
        assertEquals(1, this.presenter.evaluateAllExpressions.callCount);
        assertTrue(this.presenter.executeEventCode.calledWith("INCORRECT"));
    },

    'test runtime variables conversion error': function () {
        sinon.stub(window, 'alert');
        this.presenter.getEmptyGaps.returns({ isValid: false, errorMessage: "ERROR"});

        this.presenter.evaluate();

        assertTrue(window.alert.calledWith("ERROR"));
        assertEquals(0, this.presenter.evaluateAllExpressions.callCount);
        assertEquals(0, this.presenter.executeEventCode.callCount);

        window.alert.restore();
    }
});