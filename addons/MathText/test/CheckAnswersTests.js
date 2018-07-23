TestCase("[MathText] Check answers tests", {
    setUp: function () {
        this.presenter = AddonMathText_create();

        // stubs
        this.stubs = {
            getMathMLStub: sinon.stub(),
            setMathMLStub: sinon.stub(),
            setToolbarHiddenStub: sinon.stub(),
            checkIfAnswerIsCorrectStub: sinon.stub(),
            hideAnswersStub: sinon.stub(),
            findStub: sinon.stub(),
            attrStub: sinon.stub(),
            removeAttrStub: sinon.stub(),
            removeStub: sinon.stub(),
            addStub: sinon.stub()
        };

        this.stubs.checkIfAnswerIsCorrectStub.returns(true);
        this.stubs.getMathMLStub.returns('MathML');
        this.stubs.findStub.returns({
            attr: this.stubs.attrStub,
            removeAttr: this.stubs.removeAttrStub
        });

        // inner states
        this.presenter.state = {
            isShowAnswers: false,
            isCheckAnswers: false,
            currentAnswer: 'current'
        };

        this.presenter.configuration = {
            isActivity: true,
            initialText: 'initial',
            correctAnswer: 'correct'
        };

        // presenter mocking
        this.presenter.editor = {
            setToolbarHidden: this.stubs.setToolbarHiddenStub,
            getMathML: this.stubs.getMathMLStub,
            setMathML: this.stubs.setMathMLStub
        };

        this.presenter.$view = {
            find: this.stubs.findStub
        };

        this.presenter.wrapper = {
            classList: {
                remove: this.stubs.removeStub,
                add: this.stubs.addStub
            }
        };

        this.presenter.checkIfAnswerIsCorrect = this.stubs.checkIfAnswerIsCorrectStub;
        this.presenter.hideAnswers = this.stubs.hideAnswersStub;

    },

    // setShowErrorsMode tests

    'test should hide answers when in show answers mode': function(){
        this.presenter.state.isShowAnswers = true;
        this.presenter.configuration.isActivity = false;

        this.presenter.setShowErrorsMode();

        assertTrue(this.stubs.hideAnswersStub.called);
    },

    'test should not hide answers when not in show answers mode': function(){
        this.presenter.state.isShowAnswers = false;
        this.presenter.configuration.isActivity = false;

        this.presenter.setShowErrorsMode();

        assertFalse(this.stubs.hideAnswersStub.called);
    },

    'test should set state of isCheckAnswers to true': function(){
        this.presenter.state.isCheckAnswers = false;
        this.presenter.configuration.isActivity = true;

        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.state.isCheckAnswers);
    },

    'test should set state of currentUserAnswer to MathML': function(){
        this.presenter.state.isCheckAnswers = false;
        this.presenter.configuration.isActivity = true;

        this.presenter.setShowErrorsMode();

        assertEquals('MathML', this.presenter.state.currentAnswer);
    },

    'test should add correct class when answer is correct': function(){
        this.presenter.setShowErrorsMode();

        assertTrue(this.stubs.addStub.called);
        assertEquals('correct', this.stubs.addStub.getCall(0).args[0]);
    },

    'test should add wrong class when answer is not correct': function(){
        this.stubs.checkIfAnswerIsCorrectStub.returns(false);
        this.presenter.setShowErrorsMode();

        assertTrue(this.stubs.addStub.called);
        assertEquals('wrong', this.stubs.addStub.getCall(0).args[0]);
    },


    // setWorkMode tests
    'test should set value of isCheckAnswers to false when was in checkanswers mode': function(){
        this.presenter.state.isCheckAnswers = true;

        this.presenter.setWorkMode();

        assertFalse(this.presenter.state.isCheckAnswers);

    },

    'test should remove all added classes': function(){
        this.presenter.state.isCheckAnswers = true;

        this.presenter.setWorkMode();

        assertEquals(2, this.stubs.removeStub.callCount);
        assertTrue(this.stubs.removeStub.calledWith('correct'));
        assertTrue(this.stubs.removeStub.calledWith('wrong'));
    },

    'test should set editor text to user previous answer': function(){
        this.presenter.state.isCheckAnswers = true;

        this.presenter.setWorkMode();

        assertEquals(2, this.stubs.removeStub.callCount);
        assertTrue(this.stubs.removeStub.calledWith('correct'));
        assertTrue(this.stubs.removeStub.calledWith('wrong'));
    },

    'test should set editor text to answer in presenter state': function(){
        this.presenter.state.currentAnswer = 'current_answer';
        this.presenter.configuration.isActivity = true;
        this.presenter.state.isCheckAnswers = true;

        this.presenter.setWorkMode();

        assertTrue(this.stubs.setMathMLStub.called);
        assertTrue(this.stubs.setMathMLStub.calledWith('current_answer'));
    },

});