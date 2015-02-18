TestCase('[Double State Button] Browser', {
    setUp : function() {
        this.presenter = AddonDouble_State_Button_create();
    },

    'test when browser is not IE9' : function() {
        var isIE9 = this.presenter.isIE9("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36");
        assertFalse(isIE9);
    },

    'test when browser is IE9' : function() {
        var isIE9 = this.presenter.isIE9("Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; Media Center PC 6.0)");
        assertTrue(isIE9);
    }
});
