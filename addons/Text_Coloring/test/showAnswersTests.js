function getElementClassesAsArray($element) {
    return $element[0].className.split(/\s+/);
}

TestCase("[Text_Coloring] Adding and removing show answers classes test", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.$element = $('<div></div>');
    },

    'test should remove class text-coloring-show-answers-red from element': function () {
        this.$element.addClass('text-coloring-show-answers-red');

        this.presenter.removeShowAnswerClass(this.$element, 'red');
        var expected = [''];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should remove only class text-coloring-show-answers-red from element': function () {
        this.$element.addClass('not-removable');
        this.$element.addClass('text-coloring-show-answers-red');

        this.presenter.removeShowAnswerClass(this.$element, 'red');
        var expected = ['not-removable'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test element should contain text-coloring-show-answers-blue class': function () {
        this.presenter.addShowAnswerClass(this.$element, 'blue');

        var expected = ['text-coloring-show-answers-blue'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should add text-coloring-show-answers-blue class to element': function () {
        this.$element.addClass('test_class');
        this.presenter.addShowAnswerClass(this.$element, 'blue');

        var expected = ['test_class', 'text-coloring-show-answers-blue'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should add text-coloring-show-answers-\\port.,; class to element': function () {
        this.$element.addClass('test_class');
        this.presenter.addShowAnswerClass(this.$element, '\\port.,');

        var expected = ['test_class', 'text-coloring-show-answers-\\port.,'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    }

});

TestCase("[Text_Coloring] hideAnswers flow", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.stubs = {
            restorePreviousStateStub: sinon.stub(),
            onUnblockStub: sinon.stub(),
            unmarkTokenStub: sinon.stub(),
            getWordTokenByIndexStub: sinon.stub(),
            removeShowAnswerClassStub: sinon.stub()
        };

        this.presenter.configuration.filteredTokens = [
            {index: 1, isSelected: false, type: this.presenter.TOKENS_TYPES.SELECTABLE, color: 'red'},
            {index: 2, isSelected: false, type: this.presenter.TOKENS_TYPES.WORD},
            {index: 3, isSelected: false, type: this.presenter.TOKENS_TYPES.SELECTABLE, color: 'green'},
            {index: 4, isSelected: false, type: this.presenter.TOKENS_TYPES.SPACE}
        ];

        this.stubs.getWordTokenByIndexStub.withArgs(1).returns('1');
        this.stubs.getWordTokenByIndexStub.withArgs(2).returns('2');
        this.stubs.getWordTokenByIndexStub.withArgs(3).returns('3');
        this.stubs.getWordTokenByIndexStub.withArgs(4).returns('4');

        this.presenter.createStateMachine();
        this.presenter.stateMachine.restorePreviousState = this.stubs.restorePreviousStateStub;
        this.presenter.stateMachine.onUnblock = this.stubs.onUnblockStub;
        this.presenter.stateMachine.previousActiveColor = null;
        this.presenter.stateMachine.previousEraserMode = false;

        this.presenter.unmarkToken = this.stubs.unmarkTokenStub;
        this.presenter.getWordTokenByIndex = this.stubs.getWordTokenByIndexStub;
        this.presenter.removeShowAnswerClass = this.stubs.removeShowAnswerClassStub;
    },

    'test should call removeShowAnswersStub twice with proper arguments': function () {
        this.presenter.stateMachine.onHideAnswers();

        var expectedFirstCallArgs = {arg1: '1', arg2: 'red'};
        var expectedSecondCallArgs = {arg1: '3', arg2: 'green'};

        assertTrue(this.stubs.removeShowAnswerClassStub.calledTwice);
        assertTrue(this.stubs.removeShowAnswerClassStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2));
        assertTrue(this.stubs.removeShowAnswerClassStub.calledWithExactly(expectedSecondCallArgs.arg1, expectedSecondCallArgs.arg2));
    },

    'test should call removeShowAnswersStub once with proper arguments': function () {
        this.presenter.configuration.filteredTokens = [
            {index: 1, isSelected: false, type: this.presenter.TOKENS_TYPES.SPACE},
            {index: 2, isSelected: false, type: this.presenter.TOKENS_TYPES.WORD},
            {index: 3, isSelected: false, type: this.presenter.TOKENS_TYPES.NEW_LINE},
            {index: 4, isSelected: false, type: this.presenter.TOKENS_TYPES.SELECTABLE, color: 'black'}
        ];

        this.presenter.stateMachine.onHideAnswers();

        var expectedFirstCallArgs = {arg1: '4', arg2: 'black'};

        assertTrue(this.stubs.removeShowAnswerClassStub.calledOnce);
        assertTrue(this.stubs.removeShowAnswerClassStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2));
    }

});

TestCase("[Text_Coloring] gradualShowAnswers button", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.stubs = {
            restorePreviousStateStub: sinon.stub(),
            onBlockStub: sinon.stub(),
            unmarkTokenStub: sinon.stub(),
            markTokenStub: sinon.stub(),
            getWordTokenByIndexStub: sinon.stub(),
            addShowAnswerClassStub: sinon.stub()
        };

        this.presenter.configuration.filteredTokens = [
            {index: 1, isSelected: false, type: this.presenter.TOKENS_TYPES.SELECTABLE, color: 'red'},
            {index: 2, isSelected: false, type: this.presenter.TOKENS_TYPES.WORD},
            {index: 3, isSelected: false, type: this.presenter.TOKENS_TYPES.SELECTABLE, color: 'green'},
            {index: 4, isSelected: false, type: this.presenter.TOKENS_TYPES.SPACE}
        ];
        this.presenter.configuration.colors = [
            {id: 'red', color: '#f34444'},
            {id: 'green', color: '#63e33c'}
        ];

        this.stubs.getWordTokenByIndexStub.withArgs(1).returns('1');
        this.stubs.getWordTokenByIndexStub.withArgs(2).returns('2');
        this.stubs.getWordTokenByIndexStub.withArgs(3).returns('3');
        this.stubs.getWordTokenByIndexStub.withArgs(4).returns('4');

        this.presenter.createStateMachine();
        this.presenter.stateMachine.restorePreviousState = this.stubs.restorePreviousStateStub;
        this.presenter.stateMachine.onBlock = this.stubs.onBlockStub;
        this.presenter.stateMachine.previousActiveColor = null;
        this.presenter.stateMachine.previousEraserMode = false;

        this.presenter.unmarkToken = this.stubs.unmarkTokenStub;
        this.presenter.markToken = this.stubs.markTokenStub;
        this.presenter.getWordTokenByIndex = this.stubs.getWordTokenByIndexStub;
        this.presenter.addShowAnswerClass = this.stubs.addShowAnswerClassStub;
    },

    'test should call addShowAnswerClassStub once with proper arguments when showAllAnswersInGradualShowAnswersMode is inactive and called function once': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = false;

        this.presenter.stateMachine.onShowSingleAnswer();

        var expectedFirstCallArgs = {arg1: '1', arg2: 'red'};

        assertTrue(this.stubs.addShowAnswerClassStub.calledOnce);
        assertTrue(this.stubs.addShowAnswerClassStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2));
    },

    'test should call addShowAnswerClassStub once with proper arguments when showAllAnswersInGradualShowAnswersMode is inactive and called function twice': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = false;

        this.presenter.stateMachine.onShowSingleAnswer();
        this.presenter.stateMachine.onShowSingleAnswer();

        var expectedFirstCallArgs = {arg1: '1', arg2: 'red'};
        var expectedSecondCallArgs = {arg1: '3', arg2: 'green'};

        assertTrue(this.stubs.addShowAnswerClassStub.calledTwice);
        assertTrue(this.stubs.addShowAnswerClassStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2));
        assertTrue(this.stubs.addShowAnswerClassStub.calledWithExactly(expectedSecondCallArgs.arg1, expectedSecondCallArgs.arg2));
    },

    'test should call addShowAnswerClassStub once with proper arguments when showAllAnswersInGradualShowAnswersMode is active': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = true;

        this.presenter.stateMachine.onShowSingleAnswer();

        var expectedFirstCallArgs = {arg1: '1', arg2: 'red'};
        var expectedSecondCallArgs = {arg1: '3', arg2: 'green'};

        assertTrue(this.stubs.addShowAnswerClassStub.calledTwice);
        assertTrue(this.stubs.addShowAnswerClassStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2));
        assertTrue(this.stubs.addShowAnswerClassStub.calledWithExactly(expectedSecondCallArgs.arg1, expectedSecondCallArgs.arg2));
    }
});
