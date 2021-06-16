function getValidPrintableModel(isVisible) {
    return {
        isVisibleByDefault: isVisible,
        isValid: true,
        Width: 100,
        Height: 100,
        SelectionCorrect: "",
    }
}

TestCase("[ImageIdentification] Image indentification printable html validation", {
    setUp: function () {
        this.presenter = AddonImage_Identification_create();
        this.presenter.printableState = undefined;
        this.model = getValidPrintableModel(true);
        this.presenter.printableState = undefined;
        this.showAnswers = false;
    },

    'test empty printable state': function() {
        // given
        var divClassCore = 'printable-image-identification-empty';
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test show answer printable state empty': function() {
        // given
        var divClassCore = 'printable-image-identification-empty-answer';
        this.showAnswers = true;
        this.model.SelectionCorrect = "";
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test show answer printable state selected': function() {
        // given
        var divClassCore = 'printable-image-identification-selected-answer';
        this.showAnswers = true;
        this.model.SelectionCorrect = "True";
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test show user answer printable state empty': function() {
        // given
        var divClassCore = 'printable-image-identification-empty-user-answer';
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);
        this.presenter.printableState = {
            isSelected: false
        }

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test show user answer printable state selected': function() {
        // given
        var divClassCore = 'printable-image-identification-selected-user-answer';
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);
        this.presenter.printableState = {
            isSelected: true
        }

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test check user answer printable state empty correct': function() {
        // given
        var divClassCore = 'printable-image-identification-empty-correct-answer';
        this.showAnswers = true;
        this.model.SelectionCorrect = "";
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);
        this.presenter.printableState = {
            isSelected: false
        }

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test check user answer printable state empty incorrect': function() {
        // given
        var divClassCore = 'printable-image-identification-empty-incorrect-answer';
        this.showAnswers = true;
        this.model.SelectionCorrect = "True";
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);
        this.presenter.printableState = {
            isSelected: false
        }

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test check user answer printable state selected correct': function() {
        // given
        var divClassCore = 'printable-image-identification-selected-correct-answer';
        this.showAnswers = true;
        this.model.SelectionCorrect = "True";
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);
        this.presenter.printableState = {
            isSelected: true
        }

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test check user answer printable state selected incorrect': function() {
        // given
        var divClassCore = 'printable-image-identification-selected-incorrect-answer';
        this.showAnswers = true;
        this.model.SelectionCorrect = "";
        var expectedHtmlValue = this.getExpectedHTML(divClassCore);
        this.presenter.printableState = {
            isSelected: true
        }

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    getExpectedHTML: function(styleClass) {
        var model = getValidModel(true);

        var $root = $("<div></div>");
        $root.css("max-width", model.Width+"px");
        $root.css("max-height", model.Height+"px");
        $root.css("visibility", "visible");
        $root.addClass(styleClass + "-div");

        $root.append("<img class=" + styleClass + "-img>")
        return $root;
    },
});