TestCase("[PieChart] Show Answers tests", {
    setUp: function() {
        this.presenter = AddonPieChart_create();
        this.presenter.addonID = "PieChart1";
        this.presenter.activity = true;
        this.presenter.radiusSize = 0.7;
        this.presenter.numberOfItems = 3;
        this.presenter.items = [
            {"Name": 'Item 1', "Color": '#FFCA28', "Starting percent": '10', "Answer": '20'},
            {"Name": 'Item 2', "Color": '#EC407A', "Starting percent": '20', "Answer": '30'},
            {"Name": 'Item 3', "Color": '#42A5F5', "Starting percent": '70', "Answer": '50'},
        ];
        this.presenter.angles = [216, 288, 180];
        this.presenter.startingLines = [216, 288, 180];
        this.presenter.values = true;
        this.presenter.percentsPosition = 0.85;

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.createView();
        this.presenter.piechart = this.presenter.$view.find('.piechart');
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    createView: function () {
        return $(
            `<div style="width: 400px; height: 250px; position: absolute; left: 25px; top: 25px; visibility: visible;">
                <div class="piechart" style="width: 250px; height: 250px;">
                    <svg height="250" width="250" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart" style="visibility: visible;">
                        <path id="item1" class="item item1" d="M 125 125 L 125 42.5 A 82.5 82.5 0 0 1 173.49228331412903 58.25609796406684 L 125 125 Z" stroke-width="0" style="fill: #FFCA28;"></path>
                        <path id="item2" class="item item2" d="M 125 125 L 173.49228331412903 58.25609796406684 A 82.5 82.5 0 0 1 203.46216259435016 150.49390203593316 L 125 125 Z" stroke-width="0" style="fill: #EC407A;"></path>
                        <path id="item3" class="item item3" d="M 125 125 L 203.46216259435016 150.49390203593316 A 82.5 82.5 0 1 1 124.99999999999999 42.5 L 125 125 Z" stroke-width="0" style="fill: #42A5F5;"></path>
                        <circle class="graph" r="82.5" cy="125" cx="125"></circle>
                        <rect id="1" class="line" height="82.5" width="2" y="125" x="124" transform="rotate(216, 125, 125)"></rect>
                        <rect id="2" class="line" height="82.5" width="2" y="125" x="124" transform="rotate(288, 125, 125)"></rect>
                        <rect id="3" class="line" height="82.5" width="2" y="125" x="124" transform="rotate(180, 125, 125)"></rect>
                        <text id="Text1" class="percentsValues" x="157.83305565233815" y="23.950245143639933" text-anchor="middle">10%</text>
                        <text id="Text2" class="percentsValues" x="226.04975485636007" y="92.1669443476618" text-anchor="middle">20%</text>
                        <text id="Text3" class="percentsValues" x="39.041944347661854" y="187.4521830560753" text-anchor="middle">70%</text>
                    </svg>
                </div>
                <div class="legend">
                    <!--Not important for these tests-->
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
        this.presenter.isErrorCheckingMode = false;

        this.presenter.showAnswers();

        this.validateInSA();
        assertFalse("setWorkMode called when addon is not in error mode", this.stubs.setWorkMode.called);
    },

    'test given addon in error mode when showAnswers called then show answers': function () {
        this.presenter.isErrorCheckingMode = true;

        this.presenter.showAnswers();

        this.validateInSA();
        assertTrue("setWorkMode not called when addon is in error mode", this.stubs.setWorkMode.calledOnce);
    },

    'test given addon in SA mode when showAnswers called then show answers': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.showAnswers();

        this.validateInSA();
        assertTrue("hideAnswers not called when addon is in SA mode", this.stubs.hideAnswers.calledOnce);
    },

    'test given addon in GSA mode when showAnswers called then show answers': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.showAnswers();

        this.validateInSA();
        assertTrue("gradualHideAnswers not called when addon is in GSA mode", this.stubs.gradualHideAnswers.calledOnce);
    },

    validateInSA: function () {
        let errorMessage;

        errorMessage = "State isShowAnswersActive not set to true";
        assertTrue(errorMessage, this.presenter.isShowAnswersActive);

        errorMessage = "Original SVG is not hidden";
        assertEquals(errorMessage, "hidden", this.presenter.$view.find(".chart").css("visibility"));

        const $svgForSA = this.presenter.$view.find(".chart-show-answers");

        const itemsId = ["item1", "item2", "item3"];
        const expectedItemsD = [
            "M 125 125 L 125 42.5 A 82.5 82.5 0 0 1 203.46216259435016 99.50609796406684 L 125 125 Z",
            "M 125 125 L 203.46216259435016 99.50609796406684 A 82.5 82.5 0 0 1 125.00000000000001 207.5 L 125 125 Z",
            "M 125 125 L 125.00000000000001 207.5 A 82.5 82.5 0 0 1 124.99999999999999 42.5 L 125 125 Z",
        ];
        for (let itemIndex = 0; itemIndex < this.presenter.numberOfItems; itemIndex ++) {
            const itemD = $svgForSA.find("#" + itemsId[itemIndex]).attr("d");
            assertEquals(`${itemsId[itemIndex]} have wrong d`, expectedItemsD[itemIndex], itemD);
        }

        const itemsTextsId = ["Text1", "Text2", "Text3"];
        const expectedItemsTexts = ["20%", "30%", "50%"];
        const expectedItemsTextX = ["187.45218305607528", "210.95805565233815", "18.75"];
        const expectedItemsTextY = ["39.04194434766184", "187.45218305607526", "125.00000000000001"];
        for (let itemIndex = 0; itemIndex < this.presenter.numberOfItems; itemIndex ++) {
            const $itemTextElement = $svgForSA.find("#" + itemsTextsId[itemIndex]);
            const itemText = $itemTextElement[0].innerHTML;
            assertEquals(`${itemsTextsId[itemIndex]} have wrong text`, expectedItemsTexts[itemIndex], itemText);

            const xPosition = $itemTextElement.attr("x");
            const yPosition = $itemTextElement.attr("y");
            assertEquals(`${itemsTextsId[itemIndex]} have wrong x`, expectedItemsTextX[itemIndex], xPosition);
            assertEquals(`${itemsTextsId[itemIndex]} have wrong y`, expectedItemsTextY[itemIndex], yPosition);
        }
    }
});

TestCase("[PieChart] Gradual Show Answers tests", {
    setUp: function() {
        this.presenter = AddonPieChart_create();
        this.presenter.addonID = "PieChart1";
        this.presenter.activity = true;
        this.presenter.radiusSize = 0.7;
        this.presenter.numberOfItems = 3;
        this.presenter.items = [
            {"Name": 'Item 1', "Color": '#FFCA28', "Starting percent": '10', "Answer": '20'},
            {"Name": 'Item 2', "Color": '#EC407A', "Starting percent": '20', "Answer": '30'},
            {"Name": 'Item 3', "Color": '#42A5F5', "Starting percent": '70', "Answer": '50'},
        ];
        this.presenter.angles = [216, 288, 180];
        this.presenter.startingLines = [216, 288, 180];
        this.presenter.values = true;
        this.presenter.percentsPosition = 0.85;
        this.eventData = {moduleID: this.presenter.addonID};

        this.stubs = {
            setWorkMode: sinon.stub(this.presenter, "setWorkMode"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };

        this.presenter.$view = this.createView();
        this.presenter.piechart = this.presenter.$view.find('.piechart');
    },

    tearDown: function () {
        this.presenter.setWorkMode.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.showAnswers.restore();
    },

    createView: function () {
        return $(
            `<div style="width: 400px; height: 250px; position: absolute; left: 25px; top: 25px; visibility: visible;">
                <div class="piechart" style="width: 250px; height: 250px;">
                    <svg height="250" width="250" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart" style="visibility: visible;">
                        <path id="item1" class="item item1" d="M 125 125 L 125 42.5 A 82.5 82.5 0 0 1 173.49228331412903 58.25609796406684 L 125 125 Z" stroke-width="0" style="fill: #FFCA28;"></path>
                        <path id="item2" class="item item2" d="M 125 125 L 173.49228331412903 58.25609796406684 A 82.5 82.5 0 0 1 203.46216259435016 150.49390203593316 L 125 125 Z" stroke-width="0" style="fill: #EC407A;"></path>
                        <path id="item3" class="item item3" d="M 125 125 L 203.46216259435016 150.49390203593316 A 82.5 82.5 0 1 1 124.99999999999999 42.5 L 125 125 Z" stroke-width="0" style="fill: #42A5F5;"></path>
                        <circle class="graph" r="82.5" cy="125" cx="125"></circle>
                        <rect id="1" class="line" height="82.5" width="2" y="125" x="124" transform="rotate(216, 125, 125)"></rect>
                        <rect id="2" class="line" height="82.5" width="2" y="125" x="124" transform="rotate(288, 125, 125)"></rect>
                        <rect id="3" class="line" height="82.5" width="2" y="125" x="124" transform="rotate(180, 125, 125)"></rect>
                        <text id="Text1" class="percentsValues" x="157.83305565233815" y="23.950245143639933" text-anchor="middle">10%</text>
                        <text id="Text2" class="percentsValues" x="226.04975485636007" y="92.1669443476618" text-anchor="middle">20%</text>
                        <text id="Text3" class="percentsValues" x="39.041944347661854" y="187.4521830560753" text-anchor="middle">70%</text>
                    </svg>
                </div>
                <div class="legend">
                    <!--Not important for these tests-->
                </div>
            </div>
        `);
    },

    'test given addon as not activity when gradualShowAnswers called then do nothing': function () {
        this.presenter.activity = false;

        this.presenter.gradualShowAnswers();

        assertFalse(this.presenter.isGradualShowAnswersActive);
    },

    'test given addon when gradualShowAnswers for Text1 then do nothing': function () {
        const eventData = {moduleID: "Text1"};

        this.presenter.gradualShowAnswers(eventData);

        assertFalse(this.presenter.isGradualShowAnswersActive);
    },

    'test given addon in work mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.isErrorCheckingMode = false;

        this.presenter.gradualShowAnswers(this.eventData);

        this.validateInGSA();
        assertFalse("setWorkMode called when addon is not in error mode", this.stubs.setWorkMode.called);
    },

    'test given addon in error mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.isErrorCheckingMode = true;

        this.presenter.gradualShowAnswers(this.eventData);

        this.validateInGSA();
        assertTrue("setWorkMode not called when addon is in error mode", this.stubs.setWorkMode.calledOnce);
    },

    'test given addon in SA mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.gradualShowAnswers(this.eventData);

        this.validateInGSA();
        assertTrue("hideAnswers not called when addon is in SA mode", this.stubs.hideAnswers.calledOnce);
    },

    'test given addon in GSA mode when gradualShowAnswers called then gradual show answers': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.gradualShowAnswers(this.eventData);

        this.validateInGSA();
        assertTrue("gradualHideAnswers not called when addon is in GSA mode", this.stubs.gradualHideAnswers.calledOnce);
    },

    validateInGSA: function () {
        let errorMessage;

        errorMessage = "State isGradualShowAnswersActive not set to true";
        assertTrue(errorMessage, this.presenter.isGradualShowAnswersActive);

        errorMessage = "Original SVG is not hidden";
        assertEquals(errorMessage, "hidden", this.presenter.$view.find(".chart").css("visibility"));

        const $svgForSA = this.presenter.$view.find(".chart-show-answers");

        const itemsId = ["item1", "item2", "item3"];
        const expectedItemsD = [
            "M 125 125 L 125 42.5 A 82.5 82.5 0 0 1 203.46216259435016 99.50609796406684 L 125 125 Z",
            "M 125 125 L 203.46216259435016 99.50609796406684 A 82.5 82.5 0 0 1 125.00000000000001 207.5 L 125 125 Z",
            "M 125 125 L 125.00000000000001 207.5 A 82.5 82.5 0 0 1 124.99999999999999 42.5 L 125 125 Z",
        ];
        for (let itemIndex = 0; itemIndex < this.presenter.numberOfItems; itemIndex ++) {
            const itemD = $svgForSA.find("#" + itemsId[itemIndex]).attr("d");
            assertEquals(`${itemsId[itemIndex]} have wrong d`, expectedItemsD[itemIndex], itemD);
        }

        const itemsTextsId = ["Text1", "Text2", "Text3"];
        const expectedItemsTexts = ["20%", "30%", "50%"];
        const expectedItemsTextX = ["187.45218305607528", "210.95805565233815", "18.75"];
        const expectedItemsTextY = ["39.04194434766184", "187.45218305607526", "125.00000000000001"];
        for (let itemIndex = 0; itemIndex < this.presenter.numberOfItems; itemIndex ++) {
            const $itemTextElement = $svgForSA.find("#" + itemsTextsId[itemIndex]);
            const itemText = $itemTextElement[0].innerHTML;
            assertEquals(`${itemsTextsId[itemIndex]} have wrong text`, expectedItemsTexts[itemIndex], itemText);

            const xPosition = $itemTextElement.attr("x");
            const yPosition = $itemTextElement.attr("y");
            assertEquals(`${itemsTextsId[itemIndex]} have wrong x`, expectedItemsTextX[itemIndex], xPosition);
            assertEquals(`${itemsTextsId[itemIndex]} have wrong y`, expectedItemsTextY[itemIndex], yPosition);
        }
    }
});

TestCase("[PieChart] Hide Answers tests", {
    setUp: function() {
        this.presenter = AddonPieChart_create();

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
        return $(
            `<div style="width: 400px; height: 250px; position: absolute; left: 25px; top: 25px; visibility: visible;">
                <div class="piechart" style="width: 250px; height: 250px;">
                    <svg height="250" width="250" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart-show-answers">
                        <!--Not important for these tests-->
                    </svg>
                    <svg height="250" width="250" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart" style="visibility: hidden;">
                        <!--Not important for these tests-->
                    </svg>
                </div>
                <div class="legend">
                    <!--Not important for these tests-->
                </div>
            </div>
        `);
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
        this.presenter.activity = true;
        this.presenter.isShowAnswersActive = true;

        this.presenter.hideAnswers();

        this.validate();
    },

    validate: function () {
        let errorMessage = "State isShowAnswersActive not set to false";
        assertFalse(errorMessage, this.presenter.isShowAnswersActive);

        errorMessage = "Original SVG is hidden";
        assertEquals(errorMessage, "visible", this.presenter.$view.find(".chart").css("visibility"));

        errorMessage = "SVG for SA should not exist";
        assertFalse(errorMessage, this.presenter.$view.find(".chart-show-answers").length > 0);
    }
});

TestCase("[PieChart] Gradual Hide Answers tests", {
    setUp: function() {
        this.presenter = AddonPieChart_create();
        this.presenter.addonID = "PieChart1";

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
        return $(
            `<div style="width: 400px; height: 250px; position: absolute; left: 25px; top: 25px; visibility: visible;">
                <div class="piechart" style="width: 250px; height: 250px;">
                    <svg height="250" width="250" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart-show-answers">
                        <!--Not important for these tests-->
                    </svg>
                    <svg height="250" width="250" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart" style="visibility: hidden;">
                        <!--Not important for these tests-->
                    </svg>
                </div>
                <div class="legend">
                    <!--Not important for these tests-->
                </div>
            </div>
        `);
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

    'test given addon in GSA mode when gradualHideAnswers called then hide answers': function () {
        this.presenter.activity = true;
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.gradualHideAnswers();

        this.validate();
    },

    validate: function () {
        let errorMessage = "State isShowAnswersActive not set to false";
        assertFalse(errorMessage, this.presenter.isGradualShowAnswersActive);

        errorMessage = "Original SVG is hidden";
        assertEquals(errorMessage, "visible", this.presenter.$view.find(".chart").css("visibility"));

        errorMessage = "SVG for GSA should not exist";
        assertFalse(errorMessage, this.presenter.$view.find(".chart-show-answers").length > 0);
    }
});
