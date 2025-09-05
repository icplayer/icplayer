TestCase("[Connection] Answers manipulation tests", {

   setUp: function () {
       this.presenter = AddonConnection_create();
       this.presenter.mathJaxLoaders = {
            runLoaded: true,
            setStateLoaded: true
        };

       this.stubs = {
           selectEnabledStub: sinon.stub(),
           redrawStub: sinon.stub(),
           redrawShowAnswersStub: sinon.stub()
       };

       this.presenter.redraw = this.stubs.redrawStub;
       this.presenter.redrawShowAnswers = this.stubs.redrawShowAnswersStub;

       this.presenter.lineStack = {
           ids: [],
           clear: function () {},
           stack: []
       };
       this.presenter.elements = [];

       this.presenter.keyboardControllerObject = {
           selectEnabled: this.stubs.selectEnabledStub
       };

       this.presenter.configuration = {
           isNotActivity: false
       };
   },

    'test given active addon and showing answers when hideAnswers was called then hide answers and redraw the view': function () {
       this.presenter.isShowAnswersActive = true;

       this.presenter.hideAnswers();

       assertTrue("Redraw called once", this.stubs.redrawStub.calledOnce);
       assertTrue("Select enabled", this.stubs.selectEnabledStub.args[0][0]);
       assertFalse("Is show answers active", this.presenter.isShowAnswersActive);
    },

    'test given active addon when showAnswers was called then show answers and redraw the view': function () {
       this.presenter.isShowAnswersActive = false;

       this.presenter.showAnswers();

       assertTrue("Redraw show answers called once", this.stubs.redrawShowAnswersStub.calledOnce);
       assertFalse("Select enabled", this.stubs.selectEnabledStub.args[0][0]);
       assertTrue("Is show answers active", this.presenter.isShowAnswersActive);
    },
});