TestCase('[Video] Helpers', {
    setUp: function() {
        this.presenter = Addonvideo_create();
    },

    'test get IOS version': function() {
        var ua1 = 'Mozilla/5.0 (iPad; CPU OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4';
        assertEquals('8_3', this.presenter.getIOSVersion(ua1));

        var ua2 = 'Mozilla/5.0 (iPad; CPU OS 7_1_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4';
        assertEquals('7_1_1', this.presenter.getIOSVersion(ua2));

        var ua3 = 'Mozilla/5.0 (iPad; ) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4';
        assertEquals('', this.presenter.getIOSVersion(ua3));

        var ua4 = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36';
        assertEquals('', this.presenter.getIOSVersion(ua4));

        var ua5 = 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0';
        assertEquals('', this.presenter.getIOSVersion(ua5));
    }
});