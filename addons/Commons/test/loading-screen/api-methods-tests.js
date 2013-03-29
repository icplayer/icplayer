TestCase("API methods", {
    setUp: function() {
        this.mockedElement = {
            show: function() { },
            hide: function() { }
        };
        sinon.stub(this.mockedElement, 'show');
        sinon.stub(this.mockedElement, 'hide');

        LoadingScreen.screens = [{
            id: '1111-2222',
            counter: 0,
            $element: this.mockedElement
        }];
    },

    'test twice call show method': function() {
        LoadingScreen.show('1111-2222');
        LoadingScreen.show('1111-2222');

        assertTrue(this.mockedElement.show.calledTwice);
        assertEquals(2, LoadingScreen.screens[0].counter);
    },

    'test show and hide methods sequence': function() {
        LoadingScreen.show('1111-2222');
        LoadingScreen.show('1111-2222');
        LoadingScreen.hide('1111-2222');
        LoadingScreen.show('1111-2222');
        LoadingScreen.hide('1111-2222');

        assertEquals(3, this.mockedElement.show.callCount);
        assertEquals(0, this.mockedElement.hide.callCount);
        assertEquals(1, LoadingScreen.screens[0].counter);
    },

    'test hide methods sequence resulting in hiding element': function() {
        LoadingScreen.show('1111-2222');
        LoadingScreen.show('1111-2222');
        LoadingScreen.hide('1111-2222');
        LoadingScreen.show('1111-2222');
        LoadingScreen.hide('1111-2222');
        LoadingScreen.hide('1111-2222');

        assertEquals(3, this.mockedElement.show.callCount);
        assertEquals(1, this.mockedElement.hide.callCount);
        assertEquals(0, LoadingScreen.screens[0].counter);
    },

    'test hide method call on invisible element': function() {
        LoadingScreen.hide('1111-2222');

        assertEquals(1, this.mockedElement.hide.callCount);
        assertEquals(0, LoadingScreen.screens[0].counter);
    }
});