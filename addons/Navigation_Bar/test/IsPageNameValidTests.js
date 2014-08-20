TestCase("Are pages names correct", {
    setUp: function () {
        this.presenter = AddonNavigation_Bar_create();
    },

    'test valid page names': function() {
        var pageNames = ["1","2","next"];

        assertTrue(this.presenter.arePagesNamesCorrect(pageNames));
    },

    'test with invalid keyword': function() {
        var pageNames = ["1","2","test"];

        assertFalse(this.presenter.arePagesNamesCorrect(pageNames));
    },

    'test page name with not integer number': function() {
        var pageNames = ["1","2.3","next"];

        assertFalse(this.presenter.arePagesNamesCorrect(pageNames,2));
    },

    'test page name with zero': function() {
        var pageNames = ["1","0","next"];

        assertFalse(this.presenter.arePagesNamesCorrect(pageNames,2));
    },

    'test page name with negative number': function() {
        var pageNames = ["1","-2","next"];

        assertFalse(this.presenter.arePagesNamesCorrect(pageNames,2));
    },

    'test page name with illegal character': function() {
        var pageNames = ["1","2;","next/"];

        assertFalse(this.presenter.arePagesNamesCorrect(pageNames));
    },

    'test page name with empty field': function() {
        var pageNames = ["1","","next"];

        assertFalse(this.presenter.arePagesNamesCorrect(pageNames,2));
    }

});
