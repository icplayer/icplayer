TestCase("[Plot] Presenter", {
    setUp: function () {
        this.presenter = AddonPlot_create();
        this.plot = this.presenter.getPlot();
    },
    'test mark no errors when free points and none defined and none is selected': function() {
        this.presenter.isActivity = true;
        this.plot.points = [];
        this.plot.selectedPoints = [];
        this.plot.enableUI = function() {};

        sinon.stub(this.presenter, 'markPointAsError');
        this.presenter.setShowErrorsMode();
        assertFalse(this.presenter.markPointAsError.called);
    },
    'test mark no errors when free points and none defined': function() {
        this.presenter.isActivity = true;
        this.plot.points = [];
        this.plot.selectedPoints = [{x:1, y:1}];
        this.plot.enableUI = function() {};

        sinon.stub(this.presenter, 'markPointAsError');
        this.presenter.setShowErrorsMode();
        assertFalse(this.presenter.markPointAsError.called);
    }
});