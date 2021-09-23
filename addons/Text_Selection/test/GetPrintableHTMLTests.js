function getCommonModel () {
    return {
        addonID: "text_selection1",
        Width: "800",
        "Enable letters selections": false,
    };
}

function getMarkPhrasesToSelectWithMultiselectModelAndEnabledLettersSelections () {
    var model = getMarkPhrasesToSelectWithMultiselectModel();
    model.Text = "Mark numbers: \\correct{1}, \\correct{2}, \\wrong{A}, \\wrong{B}.";
    model["Enable letters selections"] = true;
    return model;
}

function getMarkPhrasesToSelectWithMultiselectModel () {
    var model = getCommonModel();
    model.Text = "Mark fruits: \\correct{orange}, \\correct{apple}, \\wrong{potato}, \\wrong{carrot}.";
    model.Mode = "Mark phrases to select";
    model['Selection type'] = "Multiselect";
    return model;
}

function getMarkPhrasesToSelectWithSingleSelectModelAndEnabledLettersSelections () {
    var model = getMarkPhrasesToSelectWithSingleSelectModel();
    model.Text = "Mark numbers: \\correct{1}, \\wrong{A}.";
    model["Enable letters selections"] = true;
    return model;
}

function getMarkPhrasesToSelectWithSingleSelectModel () {
    var model = getCommonModel();
    model.Text = "Mark fruits: \\correct{orange}, \\wrong{potato}.";
    model.Mode = "Mark phrases to select";
    model['Selection type'] = "Single select";
    return model;
}

function getAllSelectableWithMultiselectModelAndEnabledLettersSelections () {
    var model = getAllSelectableWithMultiselectModel();
    model.Text = "Mark numbers: \\correct{1}, \\correct{2}, A, B.";
    model["Enable letters selections"] = true;
    return model;
}

function getAllSelectableWithMultiselectModel () {
    var model = getCommonModel();
    model.Text = "Mark fruits: \\correct{orange}, \\correct{apple}, potato, carrot.";
    model.Mode = "All selectable";
    model['Selection type'] = "Multiselect";
    return model;
}

function getAllSelectableWithSingleSelectModelAndEnabledLettersSelections () {
    var model = getAllSelectableWithSingleSelectModel();
    model.Text = "Mark numbers: \\correct{1}, A.";
    model["Enable letters selections"] = true;
    return model;
}

function getAllSelectableWithSingleSelectModel () {
    var model = getCommonModel();
    model.Text = "Mark fruits: \\correct{orange}, potato.";
    model.Mode = "All selectable";
    model['Selection type'] = "Single select";
    return model;
}

function setPrintableState(presenter, numbers) {
    presenter.printableState = {numbers: numbers};
}

function isResetPrintableStateMode (presenter) {
    return presenter.printableStateMode === null;
}

function stubTextParser(presenter) {
    presenter.textParser = {
        parseAltTexts: sinon.stub(),
    };
    presenter.textParser.parseAltTexts.returnsArg(0);
}

function wrapInCommonMainDiv(text) {
    return '<div class="printable_addon_Text_Selection" style="max-width: 800px;">' + text + '</div>';
}

TestCase("[Text Selection] GetPrintableHTML tests when empty printable state mode", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.showAnswers = false;
        this.model = null;

        stubTextParser(this.presenter);
    },

    'test printable HTML when set mark phrases to select and multiselect': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<strong>orange</strong>, ' +
            '<strong>apple</strong>, ' +
            '<strong>potato</strong>, ' +
            '<strong>carrot</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select and single selection': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<strong>orange</strong>, ' +
            '<strong>potato</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable and multiselect': function() {
        this.model = getAllSelectableWithMultiselectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            'orange, ' +
            'apple, ' +
            'potato, ' +
            'carrot.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable and single selection': function() {
        this.model = getAllSelectableWithSingleSelectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            'orange, ' +
            'potato.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, multiselect and enable letters selections': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<strong>1</strong>, ' +
            '<strong>2</strong>, ' +
            '<strong>A</strong>, ' +
            '<strong>B</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, single selection and enable letters selections': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<strong>1</strong>, ' +
            '<strong>A</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, multiselect and enable letters selections': function() {
        this.model = getAllSelectableWithMultiselectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '1, ' +
            '2, ' +
            'A, ' +
            'B.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, single selection and enable letters selections': function() {
        this.model = getAllSelectableWithSingleSelectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '1, ' +
            'A.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

TestCase("[Text Selection] GetPrintableHTML tests when show answers printable state mode", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.showAnswers = true;
        this.model = null;

        stubTextParser(this.presenter);
    },

    'test printable HTML when set mark phrases to select and multiselect': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_correct_answer"><strong>orange</strong></u>, ' +
            '<u class="printable_addon_Text_Selection_correct_answer"><strong>apple</strong></u>, ' +
            '<strong>potato</strong>, ' +
            '<strong>carrot</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select and single selection': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_correct_answer"><strong>orange</strong></u>, ' +
            '<strong>potato</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable and multiselect': function() {
        this.model = getAllSelectableWithMultiselectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_correct_answer">orange</u>, ' +
            '<u class="printable_addon_Text_Selection_correct_answer">apple</u>, ' +
            'potato, ' +
            'carrot.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable and single selection': function() {
        this.model = getAllSelectableWithSingleSelectModel();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_correct_answer">orange</u>, ' +
            'potato.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, multiselect and enable letters selections': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_correct_answer"><strong>1</strong></u>, ' +
            '<u class="printable_addon_Text_Selection_correct_answer"><strong>2</strong></u>, ' +
            '<strong>A</strong>, ' +
            '<strong>B</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, single selection and enable letters selections': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_correct_answer"><strong>1</strong></u>, ' +
            '<strong>A</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, multiselect and enable letters selections': function() {
        this.model = getAllSelectableWithMultiselectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_correct_answer">1</u>, ' +
            '<u class="printable_addon_Text_Selection_correct_answer">2</u>, ' +
            'A, ' +
            'B.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, single selection and enable letters selections': function() {
        this.model = getAllSelectableWithSingleSelectModelAndEnabledLettersSelections();
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_correct_answer">1</u>, ' +
            'A.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

TestCase("[Text Selection] GetPrintableHTML tests when show user answers printable state mode", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.showAnswers = false;
        this.model = null;

        stubTextParser(this.presenter);
    },

    'test printable HTML when set mark phrases to select and multiselect': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModel();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<strong>orange</strong>, ' +
            '<u class="printable_addon_Text_Selection_selected"><strong>apple</strong></u>, ' +
            '<u class="printable_addon_Text_Selection_selected"><strong>potato</strong></u>, ' +
            '<strong>carrot</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select and single selection': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModel();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_selected"><strong>orange</strong></u>, ' +
            '<strong>potato</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable and multiselect': function() {
        this.model = getAllSelectableWithMultiselectModel();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: orange, ' +
            '<u class="printable_addon_Text_Selection_selected">apple</u>, ' +
            '<u class="printable_addon_Text_Selection_selected">potato</u>, ' +
            'carrot.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable and single selection': function() {
        this.model = getAllSelectableWithSingleSelectModel();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_selected">orange</u>, ' +
            'potato.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, multiselect and enable letters selections': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<strong>1</strong>, ' +
            '<u class="printable_addon_Text_Selection_selected"><strong>2</strong></u>, ' +
            '<u class="printable_addon_Text_Selection_selected"><strong>A</strong></u>, ' +
            '<strong>B</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, single selection and enable letters selections': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_selected"><strong>1</strong></u>, ' +
            '<strong>A</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, multiselect and enable letters selections': function() {
        this.model = getAllSelectableWithMultiselectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '1, ' +
            '<u class="printable_addon_Text_Selection_selected">2</u>, ' +
            '<u class="printable_addon_Text_Selection_selected">A</u>, ' +
            'B.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, single selection and enable letters selections': function() {
        this.model = getAllSelectableWithSingleSelectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_selected">1</u>, ' +
            'A.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

TestCase("[Text Selection] GetPrintableHTML tests when check answers printable state mode", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.showAnswers = true;
        this.model = null;

        stubTextParser(this.presenter);
    },

    'test printable HTML when set mark phrases to select and multiselect': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModel();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<strong>orange</strong>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct"><strong>apple</strong></u>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong"><strong>potato</strong></u>, ' +
            '<strong>carrot</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, single selection and correct selected': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModel();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct"><strong>orange</strong></u>, ' +
            '<strong>potato</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, single selection and wrong selected': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModel();
        setPrintableState(this.presenter,["3"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<strong>orange</strong>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong"><strong>potato</strong></u>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable and multiselect': function() {
        this.model = getAllSelectableWithMultiselectModel();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            'orange, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct">apple</u>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong">potato</u>, ' +
            'carrot.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, single selection and correct selected': function() {
        this.model = getAllSelectableWithSingleSelectModel();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct">orange</u>, ' +
            'potato.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, single selection and wrong selected': function() {
        this.model = getAllSelectableWithSingleSelectModel();
        setPrintableState(this.presenter,["3"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark fruits: ' +
            'orange, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong">potato</u>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, multiselect and enable letters selections': function() {
        this.model = getMarkPhrasesToSelectWithMultiselectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<strong>1</strong>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct"><strong>2</strong></u>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong"><strong>A</strong></u>, ' +
            '<strong>B</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, single selection, enable letters selections and correct selected': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct"><strong>1</strong></u>, ' +
            '<strong>A</strong>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when set mark phrases to select, single selection, enable letters selections and wrong selected': function() {
        this.model = getMarkPhrasesToSelectWithSingleSelectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["3"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<strong>1</strong>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong"><strong>A</strong></u>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, multiselect and enable letters selections': function() {
        this.model = getAllSelectableWithMultiselectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["3", "4"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '1, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct">2</u>, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong">A</u>, ' +
            'B.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, single selection, enable letters selections and correct selected': function() {
        this.model = getAllSelectableWithSingleSelectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["2"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_correct">1</u>, ' +
            'A.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test printable HTML when all selectable, single selection, enable letters selections and wrong selected': function() {
        this.model = getAllSelectableWithSingleSelectModelAndEnabledLettersSelections();
        setPrintableState(this.presenter,["3"]);
        const expectedHTML = wrapInCommonMainDiv(
            'Mark numbers: ' +
            '1, ' +
            '<u class="printable_addon_Text_Selection_selected printable_addon_Text_Selection_wrong">A</u>.'
        );

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
        assertTrue(this.presenter.textParser.parseAltTexts.calledOnce);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});
