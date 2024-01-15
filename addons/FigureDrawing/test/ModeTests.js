TestCase("[FigureDrawing] Show Answers tests", {
    setUp: function() {
        this.presenter = AddonFigureDrawing_create();
        this.presenter.addonID = "FigureDrawing1";
        this.presenter.activity = true;
        this.presenter.AnswerLines = ["line_2_2_3_2", "line_2_3_3_3", "line_3_2_3_3"];
        this.presenter.coloring = false;
        this.presenter.grid = 50;
        this.presenter.grid3D = false;

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.getView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    getView: function () {
        return $(
            `<div>
              <div class="figure drawing_mode" style="width: 200px; height: 200px;">
                <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                  <line id="j_1" class="grid" y2="200" x2="25" y1="0" x1="25"/>
                  <line id="i_1" class="grid" y2="25" x2="200" y1="25" x1="0"/>
                  <line id="i_2" class="grid" y2="75" x2="200" y1="75" x1="0"/>
                  <line id="i_3" class="grid" y2="125" x2="200" y1="125" x1="0"/>
                  <line id="i_4" class="grid" y2="175" x2="200" y1="175" x1="0"/>
                  <line id="j_2" class="grid" y2="200" x2="75" y1="0" x1="75"/>
                  <line id="j_3" class="grid" y2="200" x2="125" y1="0" x1="125"/>
                  <line id="j_4" class="grid" y2="200" x2="175" y1="0" x1="175"/>
                  <line y1="75" x1="75" y2="125" x2="75" id="line_2_2_2_3" class="line nonremovable"/>
                  <line y1="125" x1="75" y2="175" x2="125" id="line_2_3_3_4" class="line"/>
                  <circle class="point" row="1" column="1" r="5" cy="25" cx="25"/>
                  <circle class="point" row="2" column="1" r="5" cy="75" cx="25"/>
                  <circle class="point" row="3" column="1" r="5" cy="125" cx="25"/>
                  <circle class="point" row="4" column="1" r="5" cy="175" cx="25"/>
                  <circle class="point" row="1" column="2" r="5" cy="25" cx="75"/>
                  <circle class="point" row="2" column="2" r="5" cy="75" cx="75"/>
                  <circle class="point" row="3" column="2" r="5" cy="125" cx="75"/>
                  <circle class="point" row="4" column="2" r="5" cy="175" cx="75"/>
                  <circle class="point" row="1" column="3" r="5" cy="25" cx="125"/>
                  <circle class="point" row="2" column="3" r="5" cy="75" cx="125"/>
                  <circle class="point" row="3" column="3" r="5" cy="125" cx="125"/>
                  <circle class="point" row="4" column="3" r="5" cy="175" cx="125"/>
                  <circle class="point" row="1" column="4" r="5" cy="25" cx="175"/>
                  <circle class="point" row="2" column="4" r="5" cy="75" cx="175"/>
                  <circle class="point" row="3" column="4" r="5" cy="125" cx="175"/>
                  <circle class="point" row="4" column="4" r="5" cy="175" cx="175"/>
                </svg>
              </div>
            </div>
        `);
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

        assertTrue("State isShowAnswersActive not set to true", this.presenter.isShowAnswersActive);

        // Check correctness of SA lines
        for (let i = 0 ; i < this.presenter.AnswerLines.length; i++) {
            errorMessage = "Not found answer line: #" + this.presenter.AnswerLines[i];
            assertTrue(errorMessage, this.presenter.$view.find('#' + this.presenter.AnswerLines[i]).length > 0);
        }

        // Check correctness of answers lines
        errorMessage = "Found user answer: #line_2_3_3_4";
        assertFalse(errorMessage, this.presenter.$view.find('#' + 'line_2_3_3_4').length > 0);

        // Check correctness of starting lines
        errorMessage = "Not found starting line: #line_2_2_2_3";
        assertTrue(errorMessage, this.presenter.$view.find('#' + 'line_2_2_2_3').length > 0);

        // Check correctness of saved user answers
        assertEquals(["line_2_3_3_4"], this.presenter.savedLinesIdsSA);
    },
});

TestCase("[FigureDrawing] Gradual Show Answers tests", {
    setUp: function() {
        this.presenter = AddonFigureDrawing_create();
        this.presenter.addonID = "FigureDrawing1";
        this.presenter.activity = true;
        this.presenter.AnswerLines = ["line_2_2_3_2", "line_2_3_3_3", "line_3_2_3_3"];
        this.presenter.coloring = false;
        this.presenter.grid = 50;
        this.presenter.grid3D = false;
        this.eventData = {moduleID: this.presenter.addonID, item: "1"};

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.getView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.showAnswers.restore();
    },

    getView: function () {
        return $(
            `<div>
              <div class="figure drawing_mode" style="width: 200px; height: 200px;">
                <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                  <line id="j_1" class="grid" y2="200" x2="25" y1="0" x1="25"/>
                  <line id="i_1" class="grid" y2="25" x2="200" y1="25" x1="0"/>
                  <line id="i_2" class="grid" y2="75" x2="200" y1="75" x1="0"/>
                  <line id="i_3" class="grid" y2="125" x2="200" y1="125" x1="0"/>
                  <line id="i_4" class="grid" y2="175" x2="200" y1="175" x1="0"/>
                  <line id="j_2" class="grid" y2="200" x2="75" y1="0" x1="75"/>
                  <line id="j_3" class="grid" y2="200" x2="125" y1="0" x1="125"/>
                  <line id="j_4" class="grid" y2="200" x2="175" y1="0" x1="175"/>
                  <line y1="75" x1="75" y2="125" x2="75" id="line_2_2_2_3" class="line nonremovable"/>
                  <line y1="125" x1="75" y2="175" x2="125" id="line_2_3_3_4" class="line"/>
                  <circle class="point" row="1" column="1" r="5" cy="25" cx="25"/>
                  <circle class="point" row="2" column="1" r="5" cy="75" cx="25"/>
                  <circle class="point" row="3" column="1" r="5" cy="125" cx="25"/>
                  <circle class="point" row="4" column="1" r="5" cy="175" cx="25"/>
                  <circle class="point" row="1" column="2" r="5" cy="25" cx="75"/>
                  <circle class="point" row="2" column="2" r="5" cy="75" cx="75"/>
                  <circle class="point" row="3" column="2" r="5" cy="125" cx="75"/>
                  <circle class="point" row="4" column="2" r="5" cy="175" cx="75"/>
                  <circle class="point" row="1" column="3" r="5" cy="25" cx="125"/>
                  <circle class="point" row="2" column="3" r="5" cy="75" cx="125"/>
                  <circle class="point" row="3" column="3" r="5" cy="125" cx="125"/>
                  <circle class="point" row="4" column="3" r="5" cy="175" cx="125"/>
                  <circle class="point" row="1" column="4" r="5" cy="25" cx="175"/>
                  <circle class="point" row="2" column="4" r="5" cy="75" cx="175"/>
                  <circle class="point" row="3" column="4" r="5" cy="125" cx="175"/>
                  <circle class="point" row="4" column="4" r="5" cy="175" cx="175"/>
                </svg>
              </div>
            </div>
        `);
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

        assertTrue("State isGradualShowAnswersActive not set to true", this.presenter.isGradualShowAnswersActive);

        // Check correctness of GSA lines
        for (let i = 0 ; i < 1; i++) {
            errorMessage = "Not found answer line: #" + this.presenter.AnswerLines[i];
            assertTrue(errorMessage, this.presenter.$view.find('#' + this.presenter.AnswerLines[i]).length > 0);
        }

        // Check correctness of answers lines
        errorMessage = "Found user answer: #line_2_3_3_4";
        assertFalse(errorMessage, this.presenter.$view.find('#' + 'line_2_3_3_4').length > 0);

        // Check correctness of starting lines
        errorMessage = "Not found starting line: #line_2_2_2_3";
        assertTrue(errorMessage, this.presenter.$view.find('#' + 'line_2_2_2_3').length > 0);

        // Check correctness of saved user answers
        assertEquals(["line_2_3_3_4"], this.presenter.savedLinesIdsSA);
    },
});

TestCase("[FigureDrawing] Hide Answers tests", {
    setUp: function() {
        this.presenter = AddonFigureDrawing_create();
        this.presenter.addonID = "FigureDrawing1";
        this.presenter.activity = true;
        this.presenter.AnswerLines = ["line_2_2_3_2", "line_2_3_3_3", "line_3_2_3_3"];
        this.presenter.coloring = false;
        this.presenter.savedLinesIdsSA = ["line_2_3_3_4"];

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers")
        };

        this.presenter.$view = this.getView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
        this.presenter.showAnswers.restore();
    },

    getView: function () {
        return $(
            `<div class="figure drawing_mode" style="width: 200px; height: 200px;">
                <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                  <line id="j_1" class="grid" y2="200" x2="25" y1="0" x1="25"></line>
                  <line id="i_1" class="grid" y2="25" x2="200" y1="25" x1="0"></line>
                  <line id="i_2" class="grid" y2="75" x2="200" y1="75" x1="0"></line>
                  <line id="i_3" class="grid" y2="125" x2="200" y1="125" x1="0"></line>
                  <line id="i_4" class="grid" y2="175" x2="200" y1="175" x1="0"></line>
                  <line id="j_2" class="grid" y2="200" x2="75" y1="0" x1="75"></line>
                  <line id="j_3" class="grid" y2="200" x2="125" y1="0" x1="125"></line>
                  <line id="j_4" class="grid" y2="200" x2="175" y1="0" x1="175"></line>
                  <line y1="75" x1="75" y2="125" x2="75" id="line_2_2_2_3" class="line nonremovable"></line>
                  <line y1="75" x1="75" y2="75" x2="125" id="line_2_2_3_2" class="line"></line>
                  <line y1="125" x1="75" y2="125" x2="125" id="line_2_3_3_3" class="line"></line>
                  <line y1="75" x1="125" y2="125" x2="125" id="line_3_2_3_3" class="line"></line>
                  <circle class="point" row="1" column="1" r="5" cy="25" cx="25"></circle>
                  <circle class="point" row="2" column="1" r="5" cy="75" cx="25"></circle>
                  <circle class="point" row="3" column="1" r="5" cy="125" cx="25"></circle>
                  <circle class="point" row="4" column="1" r="5" cy="175" cx="25"></circle>
                  <circle class="point" row="1" column="2" r="5" cy="25" cx="75"></circle>
                  <circle class="point" row="2" column="2" r="5" cy="75" cx="75"></circle>
                  <circle class="point" row="3" column="2" r="5" cy="125" cx="75"></circle>
                  <circle class="point" row="4" column="2" r="5" cy="175" cx="75"></circle>
                  <circle class="point" row="1" column="3" r="5" cy="25" cx="125"></circle>
                  <circle class="point" row="2" column="3" r="5" cy="75" cx="125"></circle>
                  <circle class="point" row="3" column="3" r="5" cy="125" cx="125"></circle>
                  <circle class="point" row="4" column="3" r="5" cy="175" cx="125"></circle>
                  <circle class="point" row="1" column="4" r="5" cy="25" cx="175"></circle>
                  <circle class="point" row="2" column="4" r="5" cy="75" cx="175"></circle>
                  <circle class="point" row="3" column="4" r="5" cy="125" cx="175"></circle>
                  <circle class="point" row="4" column="4" r="5" cy="175" cx="175"></circle>
                </svg>
              </div>
            </div>
        `);
    },

    'test given addon as not activity when hideAnswers called then do nothing': function () {
        this.presenter.activity = false;
        this.presenter.isShowAnswersActive = true;

        this.presenter.hideAnswers();

        assertEquals(this.getView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon not in SA and GSA mode when hideAnswers called then do nothing': function () {
        this.presenter.activity = true;
        this.presenter.isShowAnswersActive = false;
        this.presenter.isGradualShowAnswers = false;

        this.presenter.hideAnswers();

        assertEquals(this.getView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon in SA mode when hideAnswers called then hide answers': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.hideAnswers();

        this.validateLines();
    },

    'test given addon in GSA mode when hideAnswers called then hide answers': function () {
        this.presenter.isGradualShowAnswersActive = true;
        this.presenter.GSAcounter = 2;

        this.presenter.hideAnswers();

        this.validateLines();
    },

    validateLines: function () {
        let errorMessage;

        assertFalse("State isGradualShowAnswersActive not set to false", this.presenter.isGradualShowAnswersActive);
        assertFalse("State isShowAnswersActive not set to false", this.presenter.isShowAnswersActive);

        // Check correctness SA lines
        for (let i = 0 ; i < 1; i++) {
            errorMessage = "Found line from SA: #" + this.presenter.AnswerLines[i];
            assertFalse(errorMessage, this.presenter.$view.find('#' + this.presenter.AnswerLines[i]).length > 0);
        }

        // Check correctness of answers lines
        errorMessage = "Not added user answer: #line_2_3_3_4";
        assertTrue(errorMessage, this.presenter.$view.find('#' + 'line_2_3_3_4').length > 0);

        // Check correctness of starting lines
        errorMessage = "Not found starting line: #line_2_2_2_3";
        assertTrue(errorMessage, this.presenter.$view.find('#' + 'line_2_2_2_3').length > 0);

        errorMessage = "Not reset GSAcounter";
        assertEquals(errorMessage, 0, this.presenter.GSAcounter);
    },
});

TestCase("[FigureDrawing] Gradual Hide Answers tests", {
    setUp: function() {
        this.presenter = AddonFigureDrawing_create();
        this.presenter.addonID = "FigureDrawing1";
        this.presenter.activity = true;
        this.presenter.AnswerLines = ["line_2_2_3_2", "line_2_3_3_3", "line_3_2_3_3"];
        this.presenter.coloring = false;
        this.presenter.savedLinesIdsSA = ["line_2_3_3_4"];

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers")
        };

        this.presenter.$view = this.getView();
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.gradualShowAnswers.restore();
        this.presenter.showAnswers.restore();
    },

    getView: function () {
        return $(
            `<div class="figure drawing_mode" style="width: 200px; height: 200px;">
                <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                  <line id="j_1" class="grid" y2="200" x2="25" y1="0" x1="25"></line>
                  <line id="i_1" class="grid" y2="25" x2="200" y1="25" x1="0"></line>
                  <line id="i_2" class="grid" y2="75" x2="200" y1="75" x1="0"></line>
                  <line id="i_3" class="grid" y2="125" x2="200" y1="125" x1="0"></line>
                  <line id="i_4" class="grid" y2="175" x2="200" y1="175" x1="0"></line>
                  <line id="j_2" class="grid" y2="200" x2="75" y1="0" x1="75"></line>
                  <line id="j_3" class="grid" y2="200" x2="125" y1="0" x1="125"></line>
                  <line id="j_4" class="grid" y2="200" x2="175" y1="0" x1="175"></line>
                  <line y1="75" x1="75" y2="125" x2="75" id="line_2_2_2_3" class="line nonremovable"></line>
                  <line y1="75" x1="75" y2="75" x2="125" id="line_2_2_3_2" class="line"></line>
                  <line y1="125" x1="75" y2="125" x2="125" id="line_2_3_3_3" class="line"></line>
                  <line y1="75" x1="125" y2="125" x2="125" id="line_3_2_3_3" class="line"></line>
                  <circle class="point" row="1" column="1" r="5" cy="25" cx="25"></circle>
                  <circle class="point" row="2" column="1" r="5" cy="75" cx="25"></circle>
                  <circle class="point" row="3" column="1" r="5" cy="125" cx="25"></circle>
                  <circle class="point" row="4" column="1" r="5" cy="175" cx="25"></circle>
                  <circle class="point" row="1" column="2" r="5" cy="25" cx="75"></circle>
                  <circle class="point" row="2" column="2" r="5" cy="75" cx="75"></circle>
                  <circle class="point" row="3" column="2" r="5" cy="125" cx="75"></circle>
                  <circle class="point" row="4" column="2" r="5" cy="175" cx="75"></circle>
                  <circle class="point" row="1" column="3" r="5" cy="25" cx="125"></circle>
                  <circle class="point" row="2" column="3" r="5" cy="75" cx="125"></circle>
                  <circle class="point" row="3" column="3" r="5" cy="125" cx="125"></circle>
                  <circle class="point" row="4" column="3" r="5" cy="175" cx="125"></circle>
                  <circle class="point" row="1" column="4" r="5" cy="25" cx="175"></circle>
                  <circle class="point" row="2" column="4" r="5" cy="75" cx="175"></circle>
                  <circle class="point" row="3" column="4" r="5" cy="125" cx="175"></circle>
                  <circle class="point" row="4" column="4" r="5" cy="175" cx="175"></circle>
                </svg>
              </div>
            </div>
        `);
    },

    'test given addon as not activity when gradualHideAnswers called then do nothing': function () {
        this.presenter.activity = false;
        this.presenter.isShowAnswersActive = true;

        this.presenter.gradualHideAnswers();

        assertEquals(this.getView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon not in SA and GSA mode when gradualHideAnswers called then do nothing': function () {
        this.presenter.activity = true;
        this.presenter.isShowAnswersActive = false;
        this.presenter.isGradualShowAnswers = false;

        this.presenter.gradualHideAnswers();

        assertEquals(this.getView()[0].outerHTML, this.presenter.$view[0].outerHTML);
    },

    'test given addon in SA mode when gradualHideAnswers called then gradual hide answers': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.gradualHideAnswers();

        this.validateLines();
    },

    'test given addon in GSA mode when gradualHideAnswers called then gradual hide answers': function () {
        this.presenter.isGradualShowAnswersActive = true;
        this.presenter.GSAcounter = 2;

        this.presenter.gradualHideAnswers();

        this.validateLines();
    },

    validateLines: function () {
        let errorMessage;

        assertFalse("State isGradualShowAnswersActive not set to false", this.presenter.isGradualShowAnswersActive);
        assertFalse("State isShowAnswersActive not set to false", this.presenter.isShowAnswersActive);

        // Check correctness SA lines
        for (let i = 0 ; i < 1; i++) {
            errorMessage = "Found line from SA: #" + this.presenter.AnswerLines[i];
            assertFalse(errorMessage, this.presenter.$view.find('#' + this.presenter.AnswerLines[i]).length > 0);
        }

        // Check correctness of answers lines
        errorMessage = "Not added user answer: #line_2_3_3_4";
        assertTrue(errorMessage, this.presenter.$view.find('#' + 'line_2_3_3_4').length > 0);

        // Check correctness of starting lines
        errorMessage = "Not found starting line: #line_2_2_2_3";
        assertTrue(errorMessage, this.presenter.$view.find('#' + 'line_2_2_2_3').length > 0);

        errorMessage = "Not reset GSAcounter";
        assertEquals(errorMessage, 0, this.presenter.GSAcounter);
    },
});
