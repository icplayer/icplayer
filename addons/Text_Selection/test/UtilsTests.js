TestCase("[Text_Selection] Remove non breaking spaces in with", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
    },

    'test should remove all nbsp and replace with provided string': function () {
        var text = "123 \\correct{213128pd a}&nbsp;\\wrong{123} \\correct{213128pd a}&nbsp;";
        var separator = " ";
        var expectedText = "123 \\correct{213128pd a} \\wrong{123} \\correct{213128pd a} ";

        var validationResult = this.presenter.removeNonBreakingSpacesInWith(text, separator);

        assertEquals(expectedText, validationResult)
    }
});

TestCase("[Text_Selection] Deselect spans with only spaces", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
    },

    'test all spans with spaces only, should not have selectable class': function () {
        var htmlString = "<span class=" +"\"selectable\" " + "number=" + "\"0\"" + ">3 <\/span>";
        htmlString += "<span class=" +"\"selectable\" " + "number=" + "\"1\"" + ">4<\/span>";
        htmlString += "<span class=" +"\"selectable\" " + "number=" + "\"2\"" + "> <\/span>";
        htmlString += "<span class=" +"\"selectable\" " + "number=" + "\"3\"" + ">7<\/span>";

        var expectedHtmlString = "<span class=" + "\"selectable\" " + "number=" + "\"0\"" + ">3 <\/span>";
        expectedHtmlString += "<span class=" + "\"selectable\" " + "number=" + "\"1\"" + ">4<\/span>";
        expectedHtmlString += "<span class=" + "\"\" " + "number=" + "\"2\"" + "> <\/span>";
        expectedHtmlString += "<span class=" + "\"selectable\" " + "number=" + "\"3\"" + ">7<\/span>";

        var validationResult = this.presenter.deselectSpansWithOnlySpaces(htmlString);

        assertEquals(expectedHtmlString, validationResult);
    }
});