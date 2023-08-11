TestCase("[Hierarchical Lesson Report] Alternative page names tests", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.presenter.configuration = {
            alternativePageTitles: []
        };
        this.presenter.printableConfiguration = {
            alternativePageTitles: []
        };

        this.presenter.configuration.alternativePageTitles
          = generateRunAlternativePageTitles(3);
        this.presenter.printableConfiguration.alternativePageTitles
          = generatePrintableAlternativePageTitles(3);
    },

    'test should return undefined when there is only one alterantive page without number': function () {
        this.presenter.configuration.alternativePageTitles = [
            {
                alternativePageIsChapter: false,
                alternativePageName: "",
                alternativePageNumber: ""
            }
        ];
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(1, lookingForChapter);

        assertEquals(undefined, result);
    },

    'test should return Alternative Page 3 when not looking for chapter': function () {
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(2, lookingForChapter);

        assertEquals("Alternative Page 3", result);
    },

    'test should return undefined when looking for page without specified alternative name': function () {
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(11, lookingForChapter);

        assertEquals(undefined, result);
    },

    'test should return undefined when looking for a chapter when none exists' : function () {
        var lookingForChapter = true;

        var result = this.presenter.findAlternativeName(1, lookingForChapter);

        assertEquals(undefined, result);
    },

    'test should return Chapter 1 when looking for a first chapter' : function () {
        var chapter = {
            alternativePageIsChapter: true,
            alternativePageName: "Chapter 1",
            alternativePageNumber: 1
        };
        this.presenter.configuration.alternativePageTitles.push(chapter);
        var lookingForChapter = true;

        var result = this.presenter.findAlternativeName(0, lookingForChapter);

        assertEquals("Chapter 1", result);
    },

    'test should return Alternative Page 3 when looking for third page' : function () {
        var chapter = {
            alternativePageIsChapter: true,
            alternativePageName: "Chapter 1",
            alternativePageNumber: 1
        };
        this.presenter.configuration.alternativePageTitles.splice(1, 0, chapter);
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(2, lookingForChapter);

        assertEquals("Alternative Page 3", result);
    },

    'test should return Chapter 1 when looking for first chapter inside of pages' : function () {
        var chapter = {
            alternativePageIsChapter: true,
            alternativePageName: "Chapter 1",
            alternativePageNumber: 1
        };
        this.presenter.configuration.alternativePageTitles.splice(1, 0, chapter);
        var lookingForChapter = true;

        var result = this.presenter.findAlternativeName(0, lookingForChapter);

        assertEquals("Chapter 1", result);
    },

    'test should return undefined when addon is in printable state and there is only one alternative page without number': function () {
        setPrintableStateMode(this.presenter);
        this.presenter.printableConfiguration.alternativePageTitles = [
            {
                alternativePageIsChapter: false,
                alternativePageName: "",
                alternativePageNumber: ""
            }
        ];
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(1, lookingForChapter);

        assertEquals(undefined, result);
    },

    'test should return Alternative Printable Page 3 when addon is in printable state and not looking for chapter': function () {
        setPrintableStateMode(this.presenter);
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(2, lookingForChapter);

        assertEquals("Alternative Printable Page 3", result);
    },

    'test should return undefined when addon is in printable state and looking for page without specified alternative name': function () {
        setPrintableStateMode(this.presenter);
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(11, lookingForChapter);

        assertEquals(undefined, result);
    },

    'test should return undefined when addon is in printable state and looking for a chapter when none exists' : function () {
        setPrintableStateMode(this.presenter);
        var lookingForChapter = true;

        var result = this.presenter.findAlternativeName(1, lookingForChapter);

        assertEquals(undefined, result);
    },

    'test should return Chapter 1 when addon is in printable state and looking for a first chapter' : function () {
        setPrintableStateMode(this.presenter);
        var chapter = {
            alternativePageIsChapter: true,
            alternativePageName: "Chapter 1",
            alternativePageNumber: 1
        };
        this.presenter.printableConfiguration.alternativePageTitles.push(chapter);
        var lookingForChapter = true;

        var result = this.presenter.findAlternativeName(0, lookingForChapter);

        assertEquals("Chapter 1", result);
    },

    'test should return Alternative Printable Page 3 when addon is in printable state and looking for third page' : function () {
        setPrintableStateMode(this.presenter);
        var chapter = {
            alternativePageIsChapter: true,
            alternativePageName: "Chapter 1",
            alternativePageNumber: 1
        };
        this.presenter.printableConfiguration.alternativePageTitles.splice(1, 0, chapter);
        var lookingForChapter = false;

        var result = this.presenter.findAlternativeName(2, lookingForChapter);

        assertEquals("Alternative Printable Page 3", result);
    },

    'test should return Chapter 1 when addon is in printable state and looking for first chapter inside of pages' : function () {
        setPrintableStateMode(this.presenter);
        var chapter = {
            alternativePageIsChapter: true,
            alternativePageName: "Chapter 1",
            alternativePageNumber: 1
        };
        this.presenter.printableConfiguration.alternativePageTitles.splice(1, 0, chapter);
        var lookingForChapter = true;

        var result = this.presenter.findAlternativeName(0, lookingForChapter);

        assertEquals("Chapter 1", result);
    }
});

function generateRunAlternativePageTitles(count) {
    return generateAlternativePageTitles(
      count, "Alternative Page ");
}

function generatePrintableAlternativePageTitles(count) {
    return generateAlternativePageTitles(
      count, "Alternative Printable Page ");
}

function generateAlternativePageTitles(count, prefix) {
    var result = [];
    for (var i = 0; i < count; i++) {
        result[i] = {
            alternativePageNumber: i + 1,
            alternativePageIsChapter: false,
            alternativePageName: prefix + (i + 1)
        }
    }

    return result;
}


function setPrintableStateMode(presenter) {
    presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.EMPTY;
}