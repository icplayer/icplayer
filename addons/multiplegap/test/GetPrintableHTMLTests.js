function getValidPrintableModel (isVisible) {
    return {
        "Block wrong answers": "",
        "Bottom": "",
        "Height": "175",
        "ID": "multiplegap1",
        "ID repeated element": "",
        "Is Tabindex Enabled": "False",
        "Is Visible": "True",
        "Is not an activity": "",
        "Item height": "",
        "Item horizontal align": "",
        "Item spacing": "",
        "Item vertical align": "",
        "Item width": "",
        "Items": [
            {"Answer ID": "Source_list1-3"},
            {"Answer ID": "Source_list1-5"}
        ],
        "Layout": "LTWH",
        "Left": "625",
        "Maximum item count": "",
        "Number of repetitions": "",
        "Orientation": "",
        "Right": "",
        "Source type": "texts",
        "Stretch images?": "",
        "Top": "75",
        "Width": "150",
        "langAttribute": "",
        "printable": "Don't randomize",
        "wrapItems": ""
    }
}

TestCase("[Multiple Gap] Multiple gap printable HTML validation", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.model = getValidPrintableModel(true);
        this.showAnswers = false;
        this.printableController = {
            getPrintableContext: sinon.stub()
        };
        this.presenter.setPrintableController(this.printableController);
        this.printableController.getPrintableContext.withArgs("Source_list1").returns({
            items: ["donkey", "pigeon", "zebra", "swan", "dolphin", "duck", "seagull", "tiger"]
        });
        this.state = `{"placeholders":[{"item":"Source_list1-2","value":"pigeon","type":"string"},
        {"item":"Source_list1-3","value":"zebra","type":"string"},
        {"item":"Source_list1-1","value":"donkey","type":"string"}],"isVisible":true}`;
        this.state = this.state.replaceAll("\n","");
        this.state = this.state.replaceAll(" ","");
    },

    'test given printableState is undefined when !showAnswers then return empty': function() {
        //given
        var expectedHtmlValue = '<div id="multiplegap1" class="printable_addon_multiplegap">' +
                                    '<div style="max-width: 150px; min-height: 175px; border: 1px solid; padding: 5px;"></div>' +
                                '</div>';

        //actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        //expected
        assertEquals(expectedHtmlValue, actualHtmlValue);
    },

    'test given printableState is undefined when showAnswers then return with correctAnswers': function() {
        //given
        var expectedHtmlValue = '<div id="multiplegap1" class="printable_addon_multiplegap">' +
                                    '<div style="max-width: 150px; min-height: 175px; border: 1px solid; padding: 5px; background-color: rgb(238, 238, 238);">zebra, dolphin</div>' +
                                '</div>';

        //actual
        this.showAnswers = true;
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        //expected
        assertEquals(expectedHtmlValue, actualHtmlValue);
    },

    'test given printableState when !showAnswers then return with studentAnswers': function() {
        //given
        var expectedHtmlValue = '<div id="multiplegap1" class="printable_addon_multiplegap">' +
                                    '<div style="max-width: 150px; min-height: 175px; border: 1px solid; padding: 5px;">pigeon, zebra, donkey</div>' +
                                '</div>';

        //actual
        this.presenter.setPrintableState(this.state);
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        //expected
        assertEquals(expectedHtmlValue, actualHtmlValue);
    },

    'test print student answers vertically': function() {
        //given
        var expectedHtmlValue = '<div id="multiplegap1" class="printable_addon_multiplegap">' +
                                    '<div style="max-width: 150px; min-height: 175px; border: 1px solid; padding: 5px;">pigeon<br>zebra<br>donkey</div>' +
                                '</div>';

        //actual
        this.model.Orientation = "vertical";
        this.presenter.setPrintableState(this.state);
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        //expected
        assertEquals(expectedHtmlValue, actualHtmlValue);
    },

    'test given printableState when showAnswers then return with marked studentAnswers': function() {
        //given
        var expectedHtmlValue = '<div id="multiplegap1" class="printable_addon_multiplegap">' +
                                    '<div style="max-width: 150px; min-height: 175px; border: 1px solid; padding: 5px;">' +
                                        '<span class="answerSpan incorrectAnswerSpan">pigeon</span>, ' + 
                                        '<span class="answerSpan correctAnswerSpan">zebra</span>, ' +
                                        '<span class="answerSpan incorrectAnswerSpan">donkey</span>' +
                                    '</div>' +
                                '</div>';

        //actual
        this.showAnswers = true;
        this.presenter.setPrintableState(this.state);
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        //expected
        assertEquals(expectedHtmlValue, actualHtmlValue);
    },

    'test print checked student answers vertically': function() {
        //given
        var expectedHtmlValue = '<div id="multiplegap1" class="printable_addon_multiplegap">' +
                                    '<div style="max-width: 150px; min-height: 175px; border: 1px solid; padding: 5px;">' +
                                        '<span class="answerSpan incorrectAnswerSpan">pigeon</span><br>' +
                                        '<span class="answerSpan correctAnswerSpan">zebra</span><br>' +
                                        '<span class="answerSpan incorrectAnswerSpan">donkey</span>' +
                                    '</div>' +
                                '</div>';
        
        //actual
        this.showAnswers = true;
        this.model.Orientation = "vertical";
        this.presenter.setPrintableState(this.state);
        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        //expected
        assertEquals(expectedHtmlValue, actualHtmlValue);
    },

    'test given multiply words when one of them is correct then mark the rest as incorrect': function () {
        var expectedHtmlValue = '<div id="multiplegap1" class="printable_addon_multiplegap">' +
            '<div style="max-width: 150px; min-height: 175px; border: 1px solid; padding: 5px;">' +
            '<span class="answerSpan correctAnswerSpan">zebra</span><br>' +
            '<span class="answerSpan incorrectAnswerSpan">zebra</span><br>' +
            '<span class="answerSpan incorrectAnswerSpan">zebra</span>' +
            '</div>' +
            '</div>';
        var state = `{"placeholders":[{"item":"Source_list1-3","value":"zebra","type":"string"},
        {"item":"Source_list1-3","value":"zebra","type":"string"},
        {"item":"Source_list1-3","value":"zebra","type":"string"}],"isVisible":true}`;
        state = state.replaceAll("\n","").replaceAll(" ","");
        this.showAnswers = true;
        this.model.Orientation = "vertical";
        this.presenter.setPrintableState(state);

        var actualHtmlValue = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHtmlValue, actualHtmlValue);
    }
});
