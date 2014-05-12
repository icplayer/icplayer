TestCase("[Plot] Presenter", {
    setUp: function () {
        this.presenter = AddonPlot_create();
        this.plot = this.presenter.getPlot();
    },
    'test mark no errors when free points and none defined and none is selected': function () {
        this.presenter.isActivity = true;
        this.plot.points = [];
        this.plot.selectedPoints = [];
        this.plot.enableUI = function () {
        };

        sinon.stub(this.presenter, 'markPointAsError');
        this.presenter.setShowErrorsMode();
        assertFalse(this.presenter.markPointAsError.called);
    },
    'test mark no errors when free points and none defined': function () {
        this.presenter.isActivity = true;
        this.plot.points = [];
        this.plot.selectedPoints = [
            {x: 1, y: 1}
        ];
        this.plot.enableUI = function () {
        };

        sinon.stub(this.presenter, 'markPointAsError');
        this.presenter.setShowErrorsMode();
        assertFalse(this.presenter.markPointAsError.called);
    },
    'test isAttempted when is not activity': function () {
        this.presenter.isActivity = false;
        assertTrue(this.presenter.isAttempted());
    },
    'test isAttempted when not touched': function () {
        this.presenter.isActivity = true;
        this.plot.points = [
            {x: 5, y: 6, correct: true }
        ];
        assertFalse(this.presenter.isAttempted());
    },
    'test isAttempted when touched point': function () {
        this.presenter.isActivity = true;
        this.plot.points = [
            {x: 5, y: 6, correct: true },
            {x: 6, y: 6, correct: true }
        ];
        this.plot._touchPoint(5, 6);
        assertTrue(this.presenter.isAttempted());
    },
    'test setAttempted to false': function () {
        this.presenter.isActivity = true;
        this.plot.points = [
            {x: 5, y: 6, correct: true }
        ];
        this.plot._touchPoint(5, 6);
        this.presenter.setAttempted(false);
        assertFalse(this.presenter.isAttempted());
    },
    'test setAttempted to true': function () {
        this.presenter.isActivity = true;
        this.plot.points = [
            {x: 5, y: 6, correct: true }
        ];
        this.presenter.setAttempted(true);
        assertTrue(this.presenter.isAttempted());
    }
});