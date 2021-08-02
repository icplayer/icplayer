function getValidPrintableModel(isVisible) {
    return {
        "Bottom": "",
        "Height": "35",
        "ID": "Page_Name1",
        "Is Tabindex Enabled": "False",
        "Is Visible": "True",
        "Layout": "LTWH",
        "Left": "149",
        "Right": "",
        "Top": "175",
        "Width": "173",
        "printable": "Don't randomize"
    }
}

TestCase("[PageName] Page Name printable HTML validation", {
    setUp: function() {
        this.presenter = AddonPage_Name_create();
        this.model = getValidPrintableModel(true);
        this.showAnswers = false;
        this.printableController = {
            getPageName: sinon.stub()
        };
        this.printableController.getPageName.returns("Page 1");
        this.presenter.setPrintableController(this.printableController);
    },

    'test print PageName': function() {
        //given
        var expectedHtmlValue = `<div id="Page_Name1" class="printable_addon_pagename">
                                    <div class="printable_pagename_wrapper">Page 1</div>
                                </div>`;
        expectedHtmlValue = expectedHtmlValue.replaceAll("\n","");
        expectedHtmlValue = expectedHtmlValue.replaceAll("    ","");

        //actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        //expected
        assertEquals(expectedHtmlValue, actualHtmlValue);
    }
});