TestCase("[Page_Score_Counter] GetPrintableHTML tests", {
    setUp: function () {
        this.presenter = AddonPage_Score_Counter_create();

        this.model = {
            ID: "Page_Score_Counter1",
            isVisible: "True"
        };

        this.presenter.printableController = {
            getPageMaxScore: function () {
                return 3;
            }
        };
    },

    'test given addon in fraction mode and empty state when executing getExpectedHTML then return empty score and max score from page': function() {
        this.model.DisplayMode = "Fraction (Score/Max Score)";
        const expectedScore = "&nbsp;"
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(expectedScore, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in fraction mode and show answers state when executing getExpectedHTML then return empty score and max score from page': function() {
        this.model.DisplayMode = "Fraction (Score/Max Score)";
        const expectedScore = "&nbsp;"
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(expectedScore, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, true);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in fraction mode and show user answers state when executing getExpectedHTML then return empty score and max score from page': function() {
        this.presenter.printableState = {"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 3};
        this.model.DisplayMode = "Fraction (Score/Max Score)";
        const expectedScore = "&nbsp;"
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(expectedScore, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in fraction mode and check user answers state when executing getExpectedHTML then return user score and max score from page': function() {
        this.presenter.printableState = {"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 3};
        this.model.DisplayMode = "Fraction (Score/Max Score)";
        const expectedScore = "1";
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(expectedScore, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, true);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Score mode and empty state when executing getExpectedHTML then return empty score': function() {
        this.model.DisplayMode = "Score";
        const expectedScore = "&nbsp;"
        const expectedHtmlText = this.getExpectedHTML(expectedScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Score mode and show answers state when executing getExpectedHTML then return empty score': function() {
        this.model.DisplayMode = "Score";
        const expectedScore = "&nbsp;"
        const expectedHtmlText = this.getExpectedHTML(expectedScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, true);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Score mode and show user answers state when executing getExpectedHTML then return empty score': function() {
        this.presenter.printableState = {"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 3};
        this.model.DisplayMode = "Score";
        const expectedScore = "&nbsp;";
        const expectedHtmlText = this.getExpectedHTML(expectedScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Score mode and check user answers state when executing getExpectedHTML then return user score': function() {
        this.presenter.printableState = {"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 3};
        this.model.DisplayMode = "Score";
        const expectedScore = "1";
        const expectedHtmlText = this.getExpectedHTML(expectedScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, true);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Max Score mode and empty state when executing getExpectedHTML then return max score from page': function() {
        this.model.DisplayMode = "Max Score";
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(undefined, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Max Score mode and show answers state when executing getExpectedHTML then return max score from page': function() {
        this.model.DisplayMode = "Max Score";
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(undefined, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, true);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Max Score mode and show user answers state when executing getExpectedHTML then return max score from page': function() {
        this.presenter.printableState = {"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 3};
        this.model.DisplayMode = "Max Score";
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(undefined, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    'test given addon in Max Score mode and check user answers state when executing getExpectedHTML then return max score from page': function() {
        this.presenter.printableState = {"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 3};
        this.model.DisplayMode = "Max Score";
        const expectedMaxScore = "3";
        const expectedHtmlText = this.getExpectedHTML(undefined, expectedMaxScore);

        const actualHtmlText = this.presenter.getPrintableHTML(this.model, true);

        assertEquals(expectedHtmlText.outerHTML, actualHtmlText);
    },

    getExpectedHTML: function (score, maxScore) {
        const mainDiv = document.createElement("div");
        mainDiv.id = this.model.ID;
        mainDiv.classList.add(this.presenter.CSS_CLASSES.PRINTABLE_ADDON);

        const wrapper = document.createElement("div");
        wrapper.classList.add(this.presenter.CSS_CLASSES.PRINTABLE_WRAPPER);
        mainDiv.append(wrapper);

        switch (this.model.DisplayMode) {
            case 'Fraction (Score/Max Score)':
                wrapper.append(this.createPrintableFraction(score, maxScore));
                break;
            case 'Score':
                wrapper.append(this.createPrintableScore(score));
                break;
            case 'Max Score':
                wrapper.append(this.createPrintableMaxScore(maxScore));
                break;
        }

        return mainDiv;
    },

    createPrintableFraction: function(score, maxScore) {
        const element = document.createElement("div");
        element.classList.add(this.presenter.CSS_CLASSES.PRINTABLE_FRACTION);
        element.append(this.createPrintableScore(score));
        element.append(this.createPrintableSeparator());
        element.append(this.createPrintableMaxScore(maxScore));
        return element;
    },

    createPrintableScore: function(score) {
        return this.createElement(score, this.presenter.CSS_CLASSES.PRINTABLE_SCORE);
    },

    createPrintableSeparator: function() {
        return this.createElement('/', this.presenter.CSS_CLASSES.PRINTABLE_SEPARATOR);
    },

    createPrintableMaxScore: function(maxScore) {
        return this.createElement(maxScore, this.presenter.CSS_CLASSES.PRINTABLE_MAX_SCORE);
    },

    createElement: function (text, className) {
        const element = document.createElement("div");
        element.classList.add(className);
        element.innerHTML = text;
        return element;
    }
});
