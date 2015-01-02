TestCase("Runtime exceptions catching", {
    setUp: function () {
        this.presenter = AddonCustom_Scoring_create();
        this.presenter.configuration = {
            script: 'exception'
        };

        sinon.stub(Helpers, 'alertErrorMessage');
        sinon.stub(window, 'eval');
        window.eval.throws(new TypeError("type error"));
    },

    tearDown: function () {
        Helpers.alertErrorMessage.restore();
        window.eval.restore();
    },

    'test exception occurred while running script': function () {
        this.presenter.evaluateScript();

        assertTrue(Helpers.alertErrorMessage.calledOnce);
    }
});