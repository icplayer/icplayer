function getCommonModel () {
    return {
        addonID: "text_identification1",
        Text: "Test Lorem ipsum"
    };
}

function getModelWhenSelectionIsCorrectAndBlockedWrongAnswers () {
    var model = getCommonModel();
    model.blockWrongAnswers = ""
    model.SelectionCorrect = "True"
    return model;
}

function getModelWhenSelectionIsCorrectAndNotBlockedWrongAnswers () {
    var model = getCommonModel();
    model.blockWrongAnswers = "True"
    model.SelectionCorrect = "True"
    return model;
}

function getModelWhenSelectionIsIncorrectAndBlockedWrongAnswers () {
    var model = getCommonModel();
    model.blockWrongAnswers = "True"
    model.SelectionCorrect = "False"
    return model;
}

function getModelWhenSelectionIsIncorrectAndNotBlockedWrongAnswers () {
    var model = getCommonModel();
    model.blockWrongAnswers = ""
    model.SelectionCorrect = "False"
    return model;
}

function getExpectedHTMLInNormalState () {
    return getExpectedHTML(false, false, null)
}

function getExpectedHTMLForShowAnswers (isCorrect) {
    if (isCorrect){
        const additionalClasses = ["printable_addon_Text_Identification-show-answers", "printable_addon_Text_Identification-correct"];
        return getExpectedHTML(false, false, ...additionalClasses);
    }
    const additionalClass = ["printable_addon_Text_Identification-show-answers"];
    return getExpectedHTML(false, false, ...additionalClass)
}

function getExpectedHTMLForShowUserAnswers (isSelected) {
    if (isSelected){
        const additionalClasses = ["printable_addon_Text_Identification-show-user-answers", "printable_addon_Text_Identification-selected"];
        return getExpectedHTML(false, false, ...additionalClasses)
    }
    const additionalClass = ["printable_addon_Text_Identification-show-user-answers"];
    return getExpectedHTML(false, false, ...additionalClass)
}

function getExpectedHTMLForCheckAnswers (isSelected, shouldBeSelected) {
    const selectedClass = ["printable_addon_Text_Identification-selected"];
    if (isSelected) {
        if (shouldBeSelected)
            return getExpectedHTML(true, true, ...selectedClass)
        else
            return getExpectedHTML(true, false, ...selectedClass)
    } else {
        if (shouldBeSelected)
            return getExpectedHTML(false, false, null)
        else
            return getExpectedHTML(false, true, null)
    }
}

function getExpectedHTML(addCorrectnessElement, isCorrect, ...additionalClasses) {
    const model = getCommonModel();

    var $mainStructureDiv = $('<div></div>');
    $mainStructureDiv.addClass("printable_addon_Text_Identification");

    var $addonWrapper = $('<div></div>');
    $addonWrapper.html(model.Text);
    $addonWrapper.addClass("printable_addon_Text_Identification-wrapper");
    if (additionalClasses) {
        for (var i = 0; i < additionalClasses.length; i++) {
            $addonWrapper.addClass(additionalClasses[i]);
        }
    }
    $mainStructureDiv.append($addonWrapper);

    if (addCorrectnessElement) {
        var $correctnessElement = $('<div></div>');
        if (isCorrect)
            $correctnessElement.addClass("printable_addon_Text_Identification-correct-answer")
        else
            $correctnessElement.addClass("printable_addon_Text_Identification-incorrect-answer")
        $mainStructureDiv.append($correctnessElement);
    }

    return $mainStructureDiv[0].outerHTML;
}

function isResetPrintableStateMode (presenter) {
    return presenter.printableStateMode === null;
}

function stubTextParser(presenter) {
    presenter.textParser = {
        parse: sinon.stub()
    };
    presenter.textParser.parse.returnsArg(0);
}

TestCase("[Text Identification] GetPrintableHTML tests when empty printable state mode", {
    setUp: function () {
        this.presenter = Addontext_identification_create();
        stubTextParser(this.presenter);
        this.showAnswers = false;
        this.model = null;
    },

    'test of printable HTML when selection is correct and wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsCorrectAndBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLInNormalState();
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selection is correct and no wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsCorrectAndNotBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLInNormalState();
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selection is incorrect and wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsIncorrectAndBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLInNormalState();
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selection is incorrect and no wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsIncorrectAndNotBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLInNormalState();
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

TestCase("[Text Identification] GetPrintableHTML tests when show answers printable state mode", {
    setUp: function () {
        this.presenter = Addontext_identification_create();
        stubTextParser(this.presenter);
        this.showAnswers = true;
        this.model = null;
    },

    'test of printable HTML when selection is correct and wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsCorrectAndBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLForShowAnswers(true);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selection is correct and no wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsCorrectAndNotBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLForShowAnswers(true);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selection is incorrect and wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsIncorrectAndBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLForShowAnswers(false);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selection is incorrect and no wrong answers are blocked': function() {
        this.model = getModelWhenSelectionIsIncorrectAndNotBlockedWrongAnswers();

        const expectedHTML = getExpectedHTMLForShowAnswers(false);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

TestCase("[Text Identification] GetPrintableHTML tests when show user answers printable state mode", {
    setUp: function () {
        this.presenter = Addontext_identification_create();
        stubTextParser(this.presenter);
        this.showAnswers = false;
        this.model = null;
    },

    'test of printable HTML when selected, selection is correct and wrong answers are blocked': function() {
        const isSelected = true;
        this.model = getModelWhenSelectionIsCorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is correct and wrong answers are blocked': function() {
        const isSelected = false;
        this.model = getModelWhenSelectionIsCorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);
        
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selected, selection is correct and no wrong answers are blocked': function() {
        const isSelected = true;
        this.model = getModelWhenSelectionIsCorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is correct and no wrong answers are blocked': function() {
        const isSelected = false;
        this.model = getModelWhenSelectionIsCorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selected, selection is incorrect and wrong answers are blocked': function() {
        const isSelected = true;
        this.model = getModelWhenSelectionIsIncorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is incorrect and wrong answers are blocked': function() {
        const isSelected = false;
        this.model = getModelWhenSelectionIsIncorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selected, selection is incorrect and no wrong answers are blocked': function() {
        const isSelected = true;
        this.model = getModelWhenSelectionIsIncorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is incorrect and no wrong answers are blocked': function() {
        const isSelected = false;
        this.model = getModelWhenSelectionIsIncorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForShowUserAnswers(isSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

TestCase("[Text Identification] GetPrintableHTML tests when check answers printable state mode", {
    setUp: function () {
        this.presenter = Addontext_identification_create();
        stubTextParser(this.presenter);
        this.showAnswers = true;
        this.model = null;
    },

    'test of printable HTML when selected, selection is correct and wrong answers are blocked': function() {
        const isSelected = true;
        const shouldBeSelected = true;
        this.model = getModelWhenSelectionIsCorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is correct and wrong answers are blocked': function() {
        const isSelected = false;
        const shouldBeSelected = true;
        this.model = getModelWhenSelectionIsCorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test given presenter selected and blockWrongAnswers set to True when selection is correct then answers show': function() {
        const isSelected = true;
        const shouldBeSelected = true;
        this.model = getModelWhenSelectionIsCorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is correct and no wrong answers are blocked': function() {
        const isSelected = false;
        const shouldBeSelected = true;
        this.model = getModelWhenSelectionIsCorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selected, selection is incorrect and wrong answers are blocked': function() {
        const isSelected = true;
        const shouldBeSelected = false;
        this.model = getModelWhenSelectionIsIncorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is incorrect and wrong answers are blocked': function() {
        const isSelected = false;
        const shouldBeSelected = false;
        this.model = getModelWhenSelectionIsIncorrectAndBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when selected, selection is incorrect and no wrong answers are blocked': function() {
        const isSelected = true;
        const shouldBeSelected = false;
        this.model = getModelWhenSelectionIsIncorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test of printable HTML when not selected, selection is incorrect and no wrong answers are blocked': function() {
        const isSelected = false;
        const shouldBeSelected = false;
        this.model = getModelWhenSelectionIsIncorrectAndNotBlockedWrongAnswers();
        this.presenter.printableState = {isSelected: isSelected}

        const expectedHTML = getExpectedHTMLForCheckAnswers(isSelected, shouldBeSelected);
        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);
        assertEquals(expectedHTML, actualHTML);

        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});
