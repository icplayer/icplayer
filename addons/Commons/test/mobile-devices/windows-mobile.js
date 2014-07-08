TestCase("[Commons - Mobile devices] isWindowsMobile", {
    'test empty userAgent': function() {
        var mobileagent = MobileUtils.isWindowsMobile("");

        assertFalse(mobileagent);
    },

    'test undefined userAgent': function() {
        var mobileagent = MobileUtils.isWindowsMobile(undefined);

        assertFalse(mobileagent);
    },

    'test InternetExplorer': function() {
        var ieAgent = {msPointerEnabled: true}
        var mobileagent = MobileUtils.isWindowsMobile(ieAgent);

        assertTrue(mobileagent);
    }

});