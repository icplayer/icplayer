TestCase("[Page Counter] PositiveInt validation", {

    setUp: function () {
        this.presenter = AddonPage_Counter_create();
    },
    
    'test correct detecting positive integers' : function() {
        assertTrue(this.presenter.isPositiveInt("1"));
        assertTrue(this.presenter.isPositiveInt("5"));
        assertTrue(this.presenter.isPositiveInt("123710928321"));
        assertTrue(this.presenter.isPositiveInt("9023583024"));

    },

    'test checking zero' : function() {
        assertFalse(this.presenter.isPositiveInt("0"));
    },

    'test negative numbers' : function() {
        assertFalse(this.presenter.isPositiveInt("-5"));
        assertFalse(this.presenter.isPositiveInt("-15"));
        assertFalse(this.presenter.isPositiveInt("-12391867321"));
        assertFalse(this.presenter.isPositiveInt("-3458976293875623"));

    },

    'test floats numbers' : function() {
        assertFalse(this.presenter.isPositiveInt("12.5"));
        assertFalse(this.presenter.isPositiveInt("-13.5"));
        assertFalse(this.presenter.isPositiveInt("0.0"));
        assertFalse(this.presenter.isPositiveInt("1.1"));
        assertFalse(this.presenter.isPositiveInt("0.43249803276493276432"));

    },

    'test strings and whitespaces in front of numbers' : function() {
        assertFalse(this.presenter.isPositiveInt("qwe1231edsad12380210-dfas"));
        assertFalse(this.presenter.isPositiveInt("-132-901819321das,mcnlxz;khj p12i9 ]iqa"));
        assertFalse(this.presenter.isPositiveInt("    12    23432dasda"));
        assertFalse(this.presenter.isPositiveInt("   012873018"));

    },

    'test strings and whitespaces in end of numbers' : function() {
        assertFalse(this.presenter.isPositiveInt("1231321 a;klsfdj as; 2p34987 234 fdsaa   "));
        assertFalse(this.presenter.isPositiveInt("1221310321 a;klsfdj as; 2p34987 234 fdsaa   "));
        assertFalse(this.presenter.isPositiveInt("2342 a;klsfdj as; 2p34987 234 fdsaa   "));
        assertFalse(this.presenter.isPositiveInt("1231321 a;klsfdj as; 2p34987 234 fdsaa   "));
        assertFalse(this.presenter.isPositiveInt("12asdsa1 a;klsfdj as; 2p34987 234 fdsaa   "));
    },


    'test Random input' : function() {
        assertFalse(this.presenter.isPositiveInt(" 123 81p09   0128370ifadfls hdfalsy 3201711 "));
        assertFalse(this.presenter.isPositiveInt(" 123 81p09   0128370ifadfls hdfalsy 3201711 "));
        assertFalse(this.presenter.isPositiveInt("qwlhjr 02187y A:>LJSpfa878 2p-129 dfs"));
        assertFalse(this.presenter.isPositiveInt("12[p0938 -1 21897312-9 78412-827 410-29 481 hlsdkl zjklds "));
        assertFalse(this.presenter.isPositiveInt("12p093 89u3 12-9 38-12983 -1029 hfljdszlk h"));
        assertFalse(this.presenter.isPositiveInt(" *& $)_!@* &)*& LJKfshaloi8y7 0-19 7u21;klew8=-123842132"));
    },

 
});