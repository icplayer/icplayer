TestCase("[Basic Math Gaps] Parse Item Value", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test one bold markup': function() {
        var item = "it**e**m";

        assertEquals("it<b>e</b>m", this.presenter.parseItemValue(item));
    },

    'test one italics markup': function() {
        var item = "it__e__m";

        assertEquals("it<i>e</i>m", this.presenter.parseItemValue(item));
    },

    'test more italics markups': function() {
        var item = "it__e__mi__t__em";

        assertEquals("it<i>e</i>mi<i>t</i>em", this.presenter.parseItemValue(item));
    },

    'test more bold markups': function() {
        var item = "it**e**mi**t**em";

        assertEquals("it<b>e</b>mi<b>t</b>em", this.presenter.parseItemValue(item));
    },

    'test more characters in bold markups': function() {
        var item = "it**eee**mi**tttt**em";

        assertEquals("it<b>eee</b>mi<b>tttt</b>em", this.presenter.parseItemValue(item));
    },

    'test more characters in italics markups': function() {
        var item = "it__eee__mi__tttt__em";

        assertEquals("it<i>eee</i>mi<i>tttt</i>em", this.presenter.parseItemValue(item));
    },

    'test mixed markups': function() {
        var item = "it**eee**mi__tttt__em";

        assertEquals("it<b>eee</b>mi<i>tttt</i>em", this.presenter.parseItemValue(item));
    },

    'test with more bold markups characters': function() {
        var item = "it***e***m";

        assertEquals("it<b>*e</b>*m", this.presenter.parseItemValue(item));
    },

    'test with more italics markups characters': function() {
        var item = "it___e___m";

        assertEquals("it<i>_e</i>_m", this.presenter.parseItemValue(item));
    },

    'test case **__item__**': function() {
        var item = "**__item__**";

        assertEquals("<b><i>item</i></b>", this.presenter.parseItemValue(item));
    },

    'test case ****item****': function() {
        var item = "****item****";

        assertEquals("<b></b>item<b></b>", this.presenter.parseItemValue(item));
    },

    'test case **item* as in source list': function() {
        var item = "**item*";

        assertEquals("<b>item*</b>", this.presenter.parseItemValue(item));
    },

    'test case __item_ as in source list': function() {
        var item = "__item_";

        assertEquals("<i>item_</i>", this.presenter.parseItemValue(item));
    },

    'test case *item** as in source list': function() {
        var item = "*item**";

        assertEquals("*item", this.presenter.parseItemValue(item));
    },

    'test case _item__ as in source list': function() {
        var item = "_item__";

        assertEquals("_item", this.presenter.parseItemValue(item));
    },

    'test case **__item**__ as in source list': function() {
        var item = "**__item**__";

        assertEquals("<b><i>item</b></i>", this.presenter.parseItemValue(item));
    },

    'test case __**item__** as in source list': function() {
        var item = "__**item__**";

        assertEquals("<i><b>item</i></b>", this.presenter.parseItemValue(item));
    },

    'test case item as in source list': function() {
        var item = "item";

        assertEquals("item", this.presenter.parseItemValue(item));
    }
});
