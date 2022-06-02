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

        assertTrue(this.spies.showAnswers.called);
    },

    'test hideAnswers event calls the right method': function () {
        var eventName = "HideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.called);
    },

    'test GSA event calls the right method and changes isGradualShowAnswersActive to true': function () {
        var eventName = "GradualShowAnswers";
        var eventData = {
            moduleID: 'crossword1'
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.gradualShowAnswers.called);
        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test GHA event calls the right method and changes isGradualShowAnswersActive to false': function () {
        this.presenter.isGradualShowAnswersActive = true;
        var eventName = "GradualHideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.called);
        assertFalse(this.presenter.isGradualShowAnswersActive);
    },

    'test given editable cell when triggered click event on it then resetDirections should be called': function () {
        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.$view = $(document.createElement('div'));
        this.presenter.createGrid();
        var cellInput = this.getCellInputElement(3, 4);

        $(cellInput).trigger('click');

        assertTrue(this.presenter.resetDirection.calledOnce);
    },

    'test given constant cell when triggered click event on it then resetDirections should not be called': function () {
        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.$view = $(document.createElement('div'));
        this.presenter.createGrid();
        var cellInput = this.getCellInputElement(3, 3);

        $(cellInput).trigger('click');

        assertFalse(this.presenter.resetDirection.called);
    },

    getCellInputElement: function (x, y) {
        return this.presenter.$view.find(`.cell_row_${y}.cell_column_${x}`).find("input")[0];
    },
});
