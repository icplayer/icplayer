TestCase("[Crossword] Events tests", {
    setUp: function() {
        this.presenter = Addoncrossword_create();
        this.presenter.addonID = 'crossword1';
        this.presenter.isGradualShowAnswersActive = false;

        sinon.stub(this.presenter, 'sendAllOKEvent');
        sinon.stub(this.presenter, 'isAllOK');

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers'),
            gradualShowAnswers: sinon.spy(this.presenter, 'gradualShowAnswers'),
            resetDirection: sinon.spy(this.presenter, 'resetDirection')
        }
    },

    tearDown: function() {
        this.presenter.sendAllOKEvent.restore();
        this.presenter.isAllOK.restore();
    },

    'test AllOK event should be sent': function () {
        this.presenter.isAllOK.returns(true);
        this.presenter.cellBlurEventHandler();

        assertTrue(this.presenter.sendAllOKEvent.called);
    },

    'test AllOK event should not be sent': function () {
        this.presenter.isAllOK.returns(false);
        this.presenter.cellBlurEventHandler();

        assertFalse(this.presenter.sendAllOKEvent.called);
    },

    'test showAnswers event calls the right method': function () {
        var eventName = "ShowAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.showAnswers.calledOnce);
    },

    'test hideAnswers event calls the right method': function () {
        var eventName = "HideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.calledOnce);
    },

    'test GSA event calls the right method and changes isGradualShowAnswersActive to true': function () {
        this.presenter.$view = { find: () => ({ removeClass: () => null, addClass: () => null }) };
        this.presenter.isWordNumbersCorrect = () => true;
        this.presenter.fillRowGaps = () => null;
        var eventName = "GradualShowAnswers";
        var eventData = {
            moduleID: 'crossword1',
            item: "1"
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.gradualShowAnswers.calledOnce);
        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test GSA event calls the right method and changes isGradualShowAnswersActive to true when showAllAnswersInGradualShowAnswersMode set to true': function () {
        this.presenter.isWordNumbersCorrect = () => true;
        this.presenter.showAllAnswersInGradualShowAnswersMode = "True";
        this.presenter.showAnswers = () => undefined;
        var eventName = "GradualShowAnswers";
        var eventData = {
            moduleID: 'crossword1',
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.gradualShowAnswers.calledOnce);
        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test GHA event calls the right method and changes isGradualShowAnswersActive to false': function () {
        this.presenter.$view = { find: () => ({ removeClass: () => null }) };
        this.presenter.isWordNumbersCorrect = () => true;
        this.presenter.isGradualShowAnswersActive = true;
        var eventName = "GradualHideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.calledOnce);
        assertFalse(this.presenter.isGradualShowAnswersActive);
    },

    'test given editable cell when triggered click event on it then resetDirections should be called': function () {
        this.buildCrossword();
        var cellInput = this.getCellInputElement(3, 4);

        $(cellInput).trigger('click');

        assertTrue(this.presenter.resetDirection.calledOnce);
    },

    'test given Show Answers when gaps edited then user answers are properly saved': function () {
        this.presenter.isWordNumbersCorrect = () => true;
        this.buildCrossword();

        this.presenter.$view.find('.cell_' + 5 + 'x' + 5 + ' input').val("A");
        this.presenter.showAnswers();

        const expected = "A";
        const actual = this.presenter.userAnswers[5][5];

        assertTrue(expected === actual);
    },

    'test given Hide Answers when user filled gaps then user answers are properly brought back': function () {
        this.presenter.isWordNumbersCorrect = () => true;
        this.buildCrossword();

        this.presenter.$view.find('.cell_' + 5 + 'x' + 5 + ' input').val("A");

        this.presenter.showAnswers();
        this.presenter.hideAnswers();

        const expected = "A";
        const actual = this.presenter.$view.find('.cell_' + 5 + 'x' + 5 + ' input').val();

        assertTrue(expected === actual);
    },

    'test given constant cell when triggered click event on it then resetDirections should not be called': function () {
        this.buildCrossword();
        var cellInput = this.getCellInputElement(3, 3);

        $(cellInput).trigger('click');

        assertFalse(this.presenter.resetDirection.called);
    },

    getCellInputElement: function (x, y) {
        return this.presenter.$view.find(`.cell_row_${y}.cell_column_${x}`).find("input")[0];
    },

    buildCrossword: function() {
        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.$view = $(document.createElement('div'));
        this.presenter.createGrid();
    },
});
