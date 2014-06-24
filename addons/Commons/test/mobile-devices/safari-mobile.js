TestCase("[Commons - Mobile devices] isSafariMobile", {
    'test empty userAgent': function() {
        var mobileagent = MobileUtils.isSafariMobile("");

        assertFalse(mobileagent);
    },

    'test undefined userAgent': function() {
        var mobileagent = MobileUtils.isSafariMobile(undefined);

        assertFalse(mobileagent);
    },

    'test iPhone': function() {
        var mobileagent = MobileUtils.isSafariMobile('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7');

        assertTrue(mobileagent);
    },

    'test iPad': function() {
        var mobileagent = MobileUtils.isSafariMobile('Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10');

        assertTrue(mobileagent);
    },

    'test iPod': function() {
        var mobileagent = MobileUtils.isSafariMobile('Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3');

        assertTrue(mobileagent);
    },

    'test Android': function() {
        var mobileagent = MobileUtils.isSafariMobile('Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1');

        assertFalse(mobileagent);
    },


});