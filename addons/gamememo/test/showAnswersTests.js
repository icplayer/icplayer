TestCase("[Gamememo] gradualShowAnswers button", {
    setUp: function () {
        this.presenter = Addongamememo_create();
        this.presenter.isActivity = true;
        this.presenter.configuration = {
            pairs: sinon.stub()
        };

        this.cards = $(['card_1', 'card_2', 'card_3', 'card_4', 'card_5', 'card_6']);
        this.view = document.createElement('div');
        this.presenter.viewContainer = $(this.view);
        this.presenter.viewContainer.find = sinon.stub().withArgs('.cell').returns(this.cards);

        this.presenter.prepareGrid();
        this.presenter.createGrid();

        this.stubs = {
            showCardStub: sinon.stub()
        };

        this.presenter.showCard = this.stubs.showCardStub;
    },

    'test should call addShowAnswerClassStub once with proper arguments when showAllAnswersInGradualShowAnswersMode is inactive': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = false;

        this.presenter.gradualShowAnswers();

        var expectedFirstCallArg = this.cards.first();
        var expectedSecondCallArg = this.cards.first().next();

        assertTrue(this.stubs.showCardStub.calledTwice);
        assertTrue(this.stubs.showCardStub.calledWithExactly(expectedFirstCallArg));
        assertTrue(this.stubs.showCardStub.calledWithExactly(expectedSecondCallArg));
    },

    'test should call addShowAnswerClassStub once with proper arguments when showAllAnswersInGradualShowAnswersMode is active': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = true;

        this.presenter.gradualShowAnswers();

        var expectedFirstCallArg = this.cards;

        assertTrue(this.stubs.showCardStub.calledOnce);
        assertTrue(this.stubs.showCardStub.calledWithExactly(expectedFirstCallArg));
    }
});
