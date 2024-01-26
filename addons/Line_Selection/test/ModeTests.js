TestCase("[Line_Selection] Show Answers tests", {
    setUp: function() {
        this.presenter = AddonLine_Selection_create();
        this.presenter.addonID = "Line_Selection1";
        this.presenter.activity = true;
        this.presenter.answers = ["1", "1", "0"];
        this.presenter.selected = ["2", "1"];

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.createView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    createView: function () {
        // WARNING: The <svg class="lines_wrapper"> element has been turned into a DIV, due to the lack of
        // responsiveness to adding/removing CSS classes to <line> elements during tests
        return $(
            `<div>
                <div class="lines_selection">
                    <div class="lines_wrapper">
                        <line id="line_0" class="line" x1="20" y1="200" x2="250" y2="230"></line>
                        <line id="line_1" class="line selected" x1="100" y1="100" x2="150" y2="150"></line>
                        <line id="line_2" class="line selected" x1="20" y1="70" x2="140" y2="10"></line>
                    </div>
                </div>
            </div>
        `);
    },

    getLineElement: function (index) {
        return this.presenter.$view.find("#line_" + index)[0];
    },

    'test given addon as not activity when showAnswers called then do nothing': function () {
        this.presenter.activity = false;

        this.presenter.showAnswers();

        assertFalse(this.presenter.isShowAnswersActive);
    },

    'test given addon in work mode when showAnswers called then show answers': function () {
        this.presenter.showAnswers();

        this.validateLinesInSA();
    },

    'test given addon in error mode when showAnswers called then show answers': function () {
        this.presenter.isErrorMode = true;

        this.presenter.showAnswers();

        this.validateLinesInSA();
    },

    'test given addon in SA mode when showAnswers called then show answers': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.showAnswers();

        this.validateLinesInSA();
    },

    'test given addon in GSA mode when showAnswers called then show answers': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.showAnswers();

        this.validateLinesInSA();
    },

    validateLinesInSA: function () {
        let errorMessage;

        errorMessage = "State isShowAnswersActive not set to true";
        assertTrue(errorMessage, this.presenter.isShowAnswersActive);

        errorMessage = "Wrapper with .lines_selection class does not get .show_answers class";
        assertTrue(errorMessage, this.presenter.$view.find(".lines_selection")[0].classList.contains("show_answers"));

        errorMessage = "Elements should not have .selected class";
        assertFalse(errorMessage, this.presenter.$view.find(".selected").length > 0);

        for (let i = 0; i < this.presenter.answers.length; i++) {
            let lineElement = this.getLineElement(i);
            if (this.presenter.answers[i] == 1) {
                errorMessage = "Not found answer for: #line_" + i;
                assertTrue(errorMessage, lineElement.classList.contains("show_answers_ok"));
            } else {
                errorMessage = "Found answer for wrong line: #line_" + i;
                assertFalse(errorMessage, lineElement.classList.contains("show_answers_ok"));
            }
        }
    },
});

TestCase("[Line_Selection] Gradual Show Answers tests", {
    setUp: function() {
        this.presenter = AddonLine_Selection_create();
        this.presenter.addonID = "Line_Selection1";
        this.presenter.activity = true;
        this.presenter.answers = ["1", "1", "0"];
        this.presenter.selected = ["2", "1"];
        this.eventData = {moduleID: this.presenter.addonID, item: "0"};

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.createView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.showAnswers.restore();
    },

    createView: function () {
        // WARNING: The <svg class="lines_wrapper"> element has been turned into a DIV, due to the lack of
        // responsiveness to adding/removing CSS classes to <line> elements during tests
        return $(
            `<div>
                <div class="lines_selection">
                    <div class="lines_wrapper">
                        <line id="line_0" class="line" x1="20" y1="200" x2="250" y2="230"></line>
                        <line id="line_1" class="line selected" x1="100" y1="100" x2="150" y2="150"></line>
                        <line id="line_2" class="line selected" x1="20" y1="70" x2="140" y2="10"></line>
                    </div>
                </div>
            </div>
        `);
    },

    getLineElement: function (index) {
        return this.presenter.$view.find("#line_" + index)[0];
    },

    'test given addon as not activity when gradualShowAnswers called then do nothing': function () {
        this.presenter.activity = false;

        this.presenter.gradualShowAnswers(this.eventData);

        assertFalse(this.presenter.isGradualShowAnswersActive);
    },

    'test given addon in work mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.gradualShowAnswers(this.eventData);

        this.validateLinesInGSA();
    },

    'test given addon in error mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.isErrorMode = true;

        this.presenter.gradualShowAnswers(this.eventData);

        this.validateLinesInGSA();
    },

    'test given addon in SA mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.gradualShowAnswers(this.eventData);

        this.validateLinesInGSA();
    },

    'test given addon in GSA mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.gradualShowAnswers(this.eventData);

        this.validateLinesInGSA();
    },

    validateLinesInGSA: function () {
        let errorMessage;

        errorMessage = "State isGradualShowAnswersActive not set to true";
        assertTrue(errorMessage, this.presenter.isGradualShowAnswersActive);

        errorMessage = "Wrapper with .lines_selection class does not get .show_answers class";
        assertTrue(errorMessage, this.presenter.$view.find(".lines_selection")[0].classList.contains("show_answers"));

        errorMessage = "Elements should not have .selected class";
        assertFalse(errorMessage, this.presenter.$view.find(".selected").length > 0);

        for (let i = 0; i < this.presenter.answers.length; i++) {
            let lineElement = this.getLineElement(i);
            if (i === 0) {
                errorMessage = "Not found answer for: #line_" + i;
                assertTrue(errorMessage, lineElement.classList.contains("show_answers_ok"));
            } else {
                errorMessage = "Found answer for wrong line: #line_" + i;
                assertFalse(errorMessage, lineElement.classList.contains("show_answers_ok"));
            }
        }
    },
});

TestCase("[Line_Selection] Hide Answers tests", {
    setUp: function() {
        this.presenter = AddonLine_Selection_create();
        this.presenter.addonID = "Line_Selection1";
        this.presenter.activity = true;
        this.presenter.answers = ["1", "1", "0"];
        this.presenter.selected = ["2", "1"];

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers")
        };

        this.presenter.$view = this.createView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
        this.presenter.showAnswers.restore();
    },

    createView: function () {
        // WARNING: The <svg class="lines_wrapper"> element has been turned into a DIV, due to the lack of
        // responsiveness to adding/removing CSS classes to <line> elements during tests
        return $(
            `<div>
                <div class="lines_selection">
                    <div class="lines_wrapper show_answers">
                        <line id="line_0" class="line show_answers_ok" x1="20" y1="200" x2="250" y2="230"></line>
                        <line id="line_1" class="line show_answers_ok" x1="100" y1="100" x2="150" y2="150"></line>
                        <line id="line_2" class="line" x1="20" y1="70" x2="140" y2="10"></line>
                    </div>
                </div>
            </div>
        `);
    },

    getLineElement: function (index) {
        return this.presenter.$view.find("#line_" + index)[0];
    },

    'test given addon as not activity when hideAnswers called then do nothing': function () {
        this.presenter.activity = false;
        this.presenter.isShowAnswersActive = true;

        this.presenter.hideAnswers();

        assertEquals(this.createView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon as not in Show Answers when hideAnswers called then do nothing': function () {
        this.presenter.activity = true;
        this.presenter.isShowAnswersActive = false;

        this.presenter.hideAnswers();

        assertEquals(this.createView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon in SA mode when hideAnswers called then hide answers': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.hideAnswers();

        this.validateLines();
    },

    validateLines: function () {
        let errorMessage = "State isShowAnswersActive not set to false";
        assertFalse(errorMessage, this.presenter.isShowAnswersActive);

        errorMessage = "Wrapper with .lines_selection class still has .show_answers class";
        assertFalse(errorMessage, this.presenter.$view.find(".lines_selection")[0].classList.contains("show_answers"));

        errorMessage = "Elements should not have .show_answers_ok class";
        assertFalse(errorMessage, this.presenter.$view.find(".show_answers_ok").length > 0);

        for (let i = 0; i < this.presenter.selected.length; i++) {
            let lineIndex = this.presenter.selected[i];
            let lineElement = this.getLineElement(lineIndex);
            errorMessage = "Not found .selected class for: #line_" + lineIndex;
            assertTrue(errorMessage, lineElement.classList.contains("selected"));
        }
    },
});

TestCase("[Line_Selection] Gradual Hide Answers tests", {
    setUp: function() {
        this.presenter = AddonLine_Selection_create();
        this.presenter.addonID = "Line_Selection1";
        this.presenter.activity = true;
        this.presenter.answers = ["1", "1", "0"];
        this.presenter.selected = ["2", "1"];

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers")
        };

        this.presenter.$view = this.createView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.gradualShowAnswers.restore();
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
    },

    createView: function () {
        // WARNING: The <svg class="lines_wrapper"> element has been turned into a DIV, due to the lack of
        // responsiveness to adding/removing CSS classes to <line> elements during tests
        return $(
            `<div>
                <div class="lines_selection">
                    <div class="lines_wrapper show_answers">
                        <line id="line_0" class="line show_answers_ok" x1="20" y1="200" x2="250" y2="230"></line>
                        <line id="line_1" class="line show_answers_ok" x1="100" y1="100" x2="150" y2="150"></line>
                        <line id="line_2" class="line" x1="20" y1="70" x2="140" y2="10"></line>
                    </div>
                </div>
            </div>
        `);
    },

    getLineElement: function (index) {
        return this.presenter.$view.find("#line_" + index)[0];
    },

    'test given addon as not activity when gradualHideAnswers called then do nothing': function () {
        this.presenter.activity = false;
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.gradualHideAnswers();

        assertEquals(this.createView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon as not in GSA when gradualHideAnswers called then do nothing': function () {
        this.presenter.activity = true;
        this.presenter.isGradualShowAnswersActive = false;

        this.presenter.gradualHideAnswers();

        assertEquals(this.createView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon in SA mode when gradualHideAnswers called then gradual hide answers': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.gradualHideAnswers();

        this.validateLines();
    },

    validateLines: function () {
        let errorMessage = "State isGradualShowAnswersActive not set to false";
        assertFalse(errorMessage, this.presenter.isGradualShowAnswersActive);

        errorMessage = "Wrapper with .lines_selection class still has .show_answers class";
        assertFalse(errorMessage, this.presenter.$view.find(".lines_selection")[0].classList.contains("show_answers"));

        errorMessage = "Elements should not have .show_answers_ok class";
        assertFalse(errorMessage, this.presenter.$view.find(".show_answers_ok").length > 0);

        for (let i = 0; i < this.presenter.selected.length; i++) {
            let lineIndex = this.presenter.selected[i];
            let lineElement = this.getLineElement(lineIndex);
            errorMessage = "Not found .selected class for: #line_" + lineIndex;
            assertTrue(errorMessage, lineElement.classList.contains("selected"));
        }
    },
});
