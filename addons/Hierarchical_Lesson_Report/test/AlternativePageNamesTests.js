TestCase("[Hierarchical Lesson Report] Alternative page names tests", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.presenter.configuration = {
            alternativePageTitles: []
        };

        this.presenter.configuration.alternativePageTitles = generateAlternativePageTitles(3);
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
        var result = this.presenter.findAlternativeName(3, lookingForChapter);

        assertEquals("Alternative Page 3", result);
    },

    'test should return undefined when looking for page without specifed alternative name': function () {
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
        var result = this.presenter.findAlternativeName(1, lookingForChapter);

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
        var result = this.presenter.findAlternativeName(3, lookingForChapter);

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
        var result = this.presenter.findAlternativeName(1, lookingForChapter);

        assertEquals("Chapter 1", result);
    }
});

function generateAlternativePageTitles(count) {
    var result = [];
    for (var i = 0; i < count; i++) {
        result[i] = {
            alternativePageNumber: i + 1,
            alternativePageIsChapter: false,
            alternativePageName: "Alternative Page " + (i + 1)
        }
    }

    return result;
}