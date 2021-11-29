TestCase("[Connection] Answers manipulation tests", {

   setUp: function () {
       this.presenter = AddonConnection_create();
       this.presenter.mathJaxLoaders = {
            runLoader: true,
            setStateLoader: true
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

       this.presenter.isNotActivity = false;
   },

    'test given active addon and showing answers when hideAnswers was called then hide answers and redraw the view': function () {
       this.presenter.isShowAnswersActive = true;
       var expected = {
           redrawCalled: true,
           selectEnabledArg: true,
           isShowAnswersActive: false
       };

        this.presenter.hideAnswers();

        assertEquals(expected.redrawCalled, this.stubs.redrawStub.called);
        assertEquals(expected.selectEnabledArg, this.stubs.selectEnabledStub.args[0][0]);
        assertEquals(expected.isShowAnswersActive, this.presenter.isShowAnswersActive);
    },

    'test given active addon when showAnswers was called then show answers and redraw the view': function () {
       var expected = {
           redrawShowAnswersCalled: true,
           selectEnabledArg: false,
           isShowAnswersActive: true
       };

        this.presenter.showAnswers();

        assertEquals(expected.redrawShowAnswersCalled, this.stubs.redrawShowAnswersStub.called);
        assertEquals(expected.selectEnabledArg, this.stubs.selectEnabledStub.args[0][0]);
        assertEquals(expected.isShowAnswersActive, this.presenter.isShowAnswersActive);
    },
});