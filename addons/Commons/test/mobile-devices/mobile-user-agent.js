TestCase("[Commons - Mobile devices] isMobileDevice", {
    'test empty userAgent': function() {
        var mobileagent = MobileUtils.isMobileUserAgent("");

        assertEquals(false, mobileagent);
    },

    'test undefined userAgent': function() {
        var mobileagent = MobileUtils.isMobileUserAgent(undefined);

        assertFalse(mobileagent);
    },

    'test Android': function() {
        var mobileagent = MobileUtils.isMobileUserAgent('Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1');

        assertTrue(mobileagent);
    },

    'test BlackBerry': function() {
        var mobileagent = MobileUtils.isMobileUserAgent('Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+');

        assertTrue(mobileagent);
    },

    'test iPhone': function() {
        var mobileagent = MobileUtils.isMobileUserAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7');

        assertTrue(mobileagent);
    },

    'test iPad': function() {
        var mobileagent = MobileUtils.isMobileUserAgent('Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10');

        assertTrue(mobileagent);
    },

    'test iPod': function() {
        var mobileagent = MobileUtils.isMobileUserAgent('Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3');

        assertTrue(mobileagent);
    },

    'test IEMobile': function() {
        var mobileagent = MobileUtils.isMobileUserAgent('Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)');

        assertTrue(mobileagent);
    },

    'test Opera Mini': function() {
        var mobileagent = MobileUtils.isMobileUserAgent('Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54');

        assertTrue(mobileagent);
    },

    'test android web browser': function() {
        var android = "Mozilla/5.0 (Linux; U; Android 4.1.2; pl-pl; SM-T210 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";
        assertTrue(MobileUtils.isAndroidWebBrowser(android));
    },

    'test android version': function() {
        var android = "Mozilla/5.0 (Linux; U; Android 4.1.2; pl-pl; SM-T210 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";
        assertEquals("4.1.2", MobileUtils.getAndroidVersion(android));
    },

    'test chrome web browser (isAndroidWebBrowser)': function() {
        var chrome = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.21.25.101 Safari/537.36";
        assertFalse(MobileUtils.isAndroidWebBrowser(chrome));
    }
});