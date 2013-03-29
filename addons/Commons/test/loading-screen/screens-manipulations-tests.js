TestCase("Get screen number", {
    'test get screen number which exists': function() {
        LoadingScreen.screens = [{
            id: '1111-2222'
        }, {
            id: '2222-3333'
        }];

        var screenNumber = LoadingScreen.getScreen('2222-3333');

        assertEquals(1, screenNumber);
    },

    'test get number for not existing screen': function() {
        LoadingScreen.screens = [{
            id: '1111-2222'
        }, {
            id: '2222-3333'
        }];

        var screenNumber = LoadingScreen.getScreen('2222-5555');

        assertEquals(-1, screenNumber);
    }
});