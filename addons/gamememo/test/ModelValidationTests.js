TestCase("[Gamememo] Model validation tests", {
   setUp: function () {
       this.presenter = Addongamememo_create();

       this.stubs = {
           cssStub: sinon.stub().returns(1)
       };

       this.presenter.viewContainer = {
           css: this.stubs.cssStub
       };

       this.model = {
           "Rows": "1",
           "Columns": "2",
           "Pairs": [{
               'A (text)': "Text A",
               'A (image)': "",
               'B (text)': "Text B",
               'B (image)': ""
           }],
           "Use two styles for cards": "True",
           'Keep cards aspect ratio': "True",
           'Image for style A': "",
           'Image for style B': "",
           'Is Not Activity': "True",
           'Image Mode': "",
           'Keep wrong marking': "True",
           'Time to solve': 10,
           'Session ended message': "",
           'Is Tabindex Enabled': "True",
           'langAttribute': "en",
           'speechTexts': {
                Revealed: {Revealed: "Revealed test"},
                Paired: {Paired: "Paired test"},
                Value: {Value: "with a value of test"},
                WrongColor: {WrongColor: "Incorrect card color test"},
                Match: {Match: "Matches test"},
                NotMatch: {NotMatch: "Doesn't match test"},
                CurrentlySelected: {CurrentlySelected: "Currently selected test"},
                TurnOver: {TurnOver: "Incorrect pair was turned over test"},
                OutOf: {OutOf: "out of test"},
                Found: {Found: "found test"},
               RevealedCards: {RevealedCards: "Number of revealed cards test"}
           }
       }
   },

    'test should set isTabindexEnabled to true': function () {
        var configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isError);
        assertTrue(configuration.isTabindexEnabled);
    },

    'test should set isTabindexEnabled to false': function () {
        this.model['Is Tabindex Enabled'] = "False";

        var configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isError);
        assertFalse(configuration.isTabindexEnabled);
    },

    'test if speechTexts and lang tag were set correctly': function () {
       var configuration = this.presenter.validateModel(this.model);

       assertEquals('en', configuration.langTag);
       assertEquals(this.presenter.speechTexts.revealed, "Revealed test");
       assertEquals(this.presenter.speechTexts.paired, "Paired test");
       assertEquals(this.presenter.speechTexts.value, "with a value of test");
       assertEquals(this.presenter.speechTexts.wrongColor, "Incorrect card color test");
       assertEquals(this.presenter.speechTexts.match, "Matches test");
       assertEquals(this.presenter.speechTexts.notMatch, "Doesn't match test");
       assertEquals(this.presenter.speechTexts.currentlySelected, "Currently selected test");
       assertEquals(this.presenter.speechTexts.turnOver, "Incorrect pair was turned over test");
       assertEquals(this.presenter.speechTexts.outOf, "out of test");
       assertEquals(this.presenter.speechTexts.found, "found test");
       assertEquals(this.presenter.speechTexts.revealedCards, "Number of revealed cards test");
    }
});