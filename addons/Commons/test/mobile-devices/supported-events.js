TestCase("[Commons - Mobile devices] isEventSupported", {

    'test isClickSupported': function() {
        var isClickSupported = MobileUtils.isEventSupported('click');

        assertTrue(isClickSupported);
    }

});