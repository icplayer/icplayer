TestCase("[Commons - Loading Screen] Element creation", {
    'test element creation': function() {
        /*:DOC += <div id="element-creation"></div> */

        var elementID = LoadingScreen.create($('#element-creation')[0]);

        assertNotUndefined(elementID);
        assertNotNull(elementID);

        var $loadingScreen = $('#element-creation img');
        assertEquals(1, $loadingScreen.length);
        assertEquals('http://www.lorepo.com/media/images/loading.gif', $loadingScreen.attr('src'));
    },

    'test container element undefined': function() {
        var elementID = LoadingScreen.create(undefined);

        assertUndefined(elementID);
    }
});