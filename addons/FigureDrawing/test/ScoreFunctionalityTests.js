TestCase("[FigureDrawing] Score Functionality tests - without coloring", {
    setUp: function() {
        this.presenter = AddonFigureDrawing_create();
        this.presenter.addonID = "FigureDrawing1";
        this.presenter.activity = true;
        this.presenter.error = false;
        this.presenter.isStarted = true;
        this.presenter.AnswerLines = [
            "line_1_3_1_4",
            "line_1_4_2_4",
            "line_2_3_2_4",
            "line_1_3_2_3"
        ];
        this.presenter.coloring = false;
        this.presenter.answersColors = [];
        this.presenter.grid = 50;
        this.presenter.grid3D = false;
        this.presenter.isShowAnswersActive = false;
        this.presenter.isGradualShowAnswersActive = false;
        this.presenter.GSAcounter = 0;

        this.stubs = {
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            performGradualShowAnswers: sinon.stub(this.presenter, "performGradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.getView();
    },

    tearDown: function () {
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.performGradualShowAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
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

    // ==================== getMaxScore tests ====================

    'test getMaxScore returns 0 when activity is false': function () {
        this.presenter.activity = false;

        const result = this.presenter.getMaxScore();

        assertEquals(0, result);
    },

    'test getMaxScore returns 0 when error is set': function () {
        this.presenter.error = true;

        const result = this.presenter.getMaxScore();

        assertEquals(0, result);
    },

    'test getMaxScore returns number of answer lines ': function () {
        const result = this.presenter.getMaxScore();

        assertEquals(4, result);
    },

    'test getMaxScore returns 0 when answer lines are empty': function () {
        this.presenter.AnswerLines = [];

        const result = this.presenter.getMaxScore();

        assertEquals(0, result);
    },

    // ==================== getScore tests ====================

    'test getScore returns 0 when activity is false': function () {
        this.presenter.activity = false;

        const result = this.presenter.getScore();

        assertEquals(0, result);
    },

    'test getScore returns 0 when error is set': function () {
        this.presenter.error = true;

        const result = this.presenter.getScore();

        assertEquals(0, result);
    },

    'test getScore returns 0 when addon is not attempted': function () {
        this.presenter.isStarted = false;

        const result = this.presenter.getScore();

        assertEquals(0, result);
    },

    'test getScore counts drawn answer lines correctly': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_1_4_2_4" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getScore();

        assertEquals(2, result);
    },

    'test getScore returns 0 when no answer lines are drawn': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getScore();

        assertEquals(0, result);
    },

    'test getScore counts all drawn lines when all answer lines are drawn': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_1_4_2_4" class="line"/>
                        <line id="line_2_3_2_4" class="line"/>
                        <line id="line_1_3_2_3" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getScore();

        assertEquals(4, result);
    },

    'test getScore restores showAnswers state after calculation': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        this.presenter.getScore();

        assertTrue(this.stubs.showAnswers.calledOnce);
        assertTrue(this.presenter.isShowAnswersActive);
    },

    'test getScore restores gradualShowAnswers state after calculation': function () {
        this.presenter.isGradualShowAnswersActive = true;
        this.presenter.GSAcounter = 2;
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_1_4_2_4" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        this.presenter.getScore();

        assertTrue(this.stubs.performGradualShowAnswers.calledOnce);
        assertEquals(2, this.stubs.performGradualShowAnswers.lastCall.args[0]);
    },

    // ==================== getErrorCount tests ====================

    'test getErrorCount returns 0 when activity is false': function () {
        this.presenter.activity = false;

        const result = this.presenter.getErrorCount();

        assertEquals(0, result);
    },

    'test getErrorCount returns 0 when error is set': function () {
        this.presenter.error = true;

        const result = this.presenter.getErrorCount();

        assertEquals(0, result);
    },

    'test getErrorCount returns 0 when addon is not attempted': function () {
        this.presenter.isStarted = false;

        const result = this.presenter.getErrorCount();

        assertEquals(0, result);
    },

    'test getErrorCount returns count of wrong lines drawn': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_wrong_1" class="line"/>
                        <line id="line_wrong_2" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getErrorCount();

        assertEquals(2, result);
    },

    'test getErrorCount excludes nonremovable lines from error count': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_1_1_1_2" class="line nonremovable"/>
                        <line id="line_wrong_1" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getErrorCount();

        assertEquals(1, result);
    },

    'test getErrorCount returns 0 when any line was created': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getErrorCount();

        assertEquals(0, result);
    },

    'test getErrorCount returns 0 when all lines are correct': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_1_4_2_4" class="line"/>
                        <line id="line_2_3_2_4" class="line"/>
                        <line id="line_1_3_2_3" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getErrorCount();

        assertEquals(0, result);
    },

    'test getErrorCount restores showAnswers state after calculation': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_2_2_3_2" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        this.presenter.getErrorCount();

        assertTrue(this.stubs.showAnswers.calledOnce);
    },

    'test getErrorCount restores gradualShowAnswers state after calculation': function () {
        this.presenter.isGradualShowAnswersActive = true;
        this.presenter.GSAcounter = 2;
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_2_2_3_2" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        this.presenter.getErrorCount();

        assertTrue(this.stubs.performGradualShowAnswers.calledOnce);
        assertEquals(2, this.stubs.performGradualShowAnswers.lastCall.args[0]);
    },

    // ==================== Integration tests ====================

    'test getScore plus getErrorCount equals total nonremovable drawn lines': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_1_4_2_4" class="line"/>
                        <line id="line_2_2_3_2" class="line"/>
                        <line id="line_nonremovable" class="line nonremovable"/>
                    </svg>
                </div>
            </div>`
        );

        const score = this.presenter.getScore();
        const errorCount = this.presenter.getErrorCount();
        const totalDrawnLines = this.presenter.$view.find('.line').length - this.presenter.$view.find('.nonremovable').length;

        assertEquals(totalDrawnLines, score + errorCount);
    },

    'test getScore equals getMaxScore when all answers are correct': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_2_2_3_2" class="line"/>
                        <line id="line_2_3_3_3" class="line"/>
                        <line id="line_3_2_3_3" class="line"/>
                    </svg>
                </div>
            </div>`
        );
        this.presenter.AnswerLines = ["line_2_2_3_2", "line_2_3_3_3", "line_3_2_3_3"];

        const maxScore = this.presenter.getMaxScore();
        const score = this.presenter.getScore();

        assertEquals(maxScore, score);
    },

    'test getScore is less than getMaxScore when answers are incomplete': function () {
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_2_2_3_2" class="line"/>
                    </svg>
                </div>
            </div>`
        );
        this.presenter.AnswerLines = ["line_2_2_3_2", "line_2_3_3_3", "line_3_2_3_3"];
        this.presenter.coloring = false;

        const maxScore = this.presenter.getMaxScore();
        const score = this.presenter.getScore();

        assertTrue(score < maxScore);
    }
});

TestCase("[FigureDrawing] Score Functionality tests - with coloring", {
    setUp: function() {
        this.presenter = AddonFigureDrawing_create();
        this.presenter.addonID = "FigureDrawing1";
        this.presenter.activity = true;
        this.presenter.error = false;
        this.presenter.isStarted = true;
        this.presenter.AnswerLines = [
            "line_1_1_2_1",
            "line_2_1_2_2",
            "line_1_2_2_2",
            "line_1_1_1_2",
            "line_1_3_1_4",
            "line_1_4_2_4",
            "line_2_3_2_4",
            "line_1_3_2_3"
        ];
        this.presenter.coloring = true;
        this.presenter.answersColors = [
            {
                "lines": [
                    "line_1_1_2_1",
                    "line_2_1_2_2",
                    "line_1_2_2_2",
                    "line_1_1_1_2"
                ],
                "x": 50,
                "y": 50,
                "color": "200 50 50 255"
            }
        ];
        this.presenter.grid = 50;
        this.presenter.grid3D = false;
        this.presenter.isShowAnswersActive = false;
        this.presenter.isGradualShowAnswersActive = false;
        this.presenter.GSAcounter = 0;

        this.correctColoredData = new Uint8ClampedArray([200, 50, 50, 255]);
        this.wrongColoredData = new Uint8ClampedArray([100, 100, 100, 255]);
        this.transparentColoredData = new Uint8ClampedArray([0, 0, 0, 0]);

        this.stubs = {
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            performGradualShowAnswers: sinon.stub(this.presenter, "performGradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.getView();
    },

    tearDown: function () {
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.performGradualShowAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
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

    setupCanvasContext: function(width, height) {
        const canvasElement = document.createElement('canvas');
        canvasElement.width = width || 200;
        canvasElement.height = height || 200;
        this.presenter.canvas = canvasElement;
        this.presenter.ctx = canvasElement.getContext('2d');
        this.presenter.canvasWidth = canvasElement.width;
        this.presenter.canvasHeight = canvasElement.height;
    },

    // ==================== getMaxScore tests ====================

    'test getMaxScore returns sum of answer lines and colors when coloring is enabled': function () {
        const result = this.presenter.getMaxScore();

        assertEquals(9, result);
    },

    'test getMaxScore returns color count when answer lines are empty but coloring is enabled': function () {
        // Setup is possible when all starting lines are defined in answersColors, so we can have coloring without answer lines
        this.presenter.AnswerLines = [];

        const result = this.presenter.getMaxScore();

        assertEquals(1, result);
    },

    // ==================== getScore with coloring tests ====================

    'test getScore counts both lines and colored areas when all are correct': function () {
        this.setupCanvasContext(200, 200);
        const correctColoredData = this.correctColoredData;
        const transparentColoredData = this.transparentColoredData;
        sinon.stub(this.presenter.ctx, 'getImageData').callsFake(function(x, y, w, h) {
            return { data: (x === 50 && y === 50) ? correctColoredData : transparentColoredData };
        });

        this.presenter.$view = $(
            `<div>
                <div class="figure" style="width: 200px; height: 200px;">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_1_2_1" class="line"/>
                        <line id="line_2_1_2_2" class="line"/>
                        <line id="line_1_2_2_2" class="line"/>
                        <line id="line_1_1_1_2" class="line"/>
                        <line id="line_1_3_1_4" class="line"/>
                        <line id="line_1_4_2_4" class="line"/>
                        <line id="line_2_3_2_4" class="line"/>
                        <line id="line_1_3_2_3" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getScore();

        assertEquals(9, result);
        this.presenter.ctx.getImageData.restore();
    },

    'test getScore counts both lines and colored areas when all from colored area are correct': function () {
        this.setupCanvasContext(200, 200);
        const correctColoredData = this.correctColoredData;
        const transparentColoredData = this.transparentColoredData;
        sinon.stub(this.presenter.ctx, 'getImageData').callsFake(function(x, y, w, h) {
            return { data: (x === 50 && y === 50) ? correctColoredData : transparentColoredData };
        });

        this.presenter.$view = $(
            `<div>
                <div class="figure" style="width: 200px; height: 200px;">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_1_2_1" class="line"/>
                        <line id="line_2_1_2_2" class="line"/>
                        <line id="line_1_2_2_2" class="line"/>
                        <line id="line_1_1_1_2" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getScore();

        assertEquals(5, result);
        this.presenter.ctx.getImageData.restore();
    },

    'test getScore does not count colored area when not all required lines are drawn': function () {
        this.setupCanvasContext(200, 200);
        const correctColoredData = this.correctColoredData;
        const transparentColoredData = this.transparentColoredData;
        sinon.stub(this.presenter.ctx, 'getImageData').callsFake(function(x, y, w, h) {
            return { data: (x === 50 && y === 50) ? correctColoredData : transparentColoredData };
        });
        this.presenter.$view = $(
            `<div>
                <div class="figure">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_1_2_1" class="line"/>
                        <line id="line_2_1_2_2" class="line"/>
                        <line id="line_1_2_2_2" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getScore();

        assertEquals(3, result);
        this.presenter.ctx.getImageData.restore();
    },

    'test getScore does not count colored area when canvas exists but color does not match': function () {
        this.setupCanvasContext(200, 200);
        const wrongColoredData = this.wrongColoredData;
        const transparentColoredData = this.transparentColoredData;
        sinon.stub(this.presenter.ctx, 'getImageData').callsFake(function(x, y, w, h) {
            return { data: (x === 50 && y === 50) ? wrongColoredData : transparentColoredData };
        });
        this.presenter.$view = $(
            `<div>
                <div class="figure" style="width: 200px; height: 200px;">
                    <svg height="200" width="200" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">
                        <line id="line_1_1_2_1" class="line"/>
                        <line id="line_2_1_2_2" class="line"/>
                        <line id="line_1_2_2_2" class="line"/>
                        <line id="line_1_1_1_2" class="line"/>
                    </svg>
                </div>
            </div>`
        );

        const result = this.presenter.getScore();

        assertEquals(4, result);
        this.presenter.ctx.getImageData.restore();
    }
});
