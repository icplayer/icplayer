TestCase("[Page Counter] Start from property validation", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();
    },

    'test testing detecting proper empty string in startFrom' : function() {
    	var validatedStartFrom = this.presenter.validateStartFrom("");

        assertTrue(validatedStartFrom.isValid);
        assertUndefined(validatedStartFrom.value);
    },


    'test checking non positive integers' : function() {
    	var validatedStartFrom = this.presenter.validateStartFrom("-5");

        assertFalse("Testing negative number", validatedStartFrom.isValid);
    	assertEquals("ST_01", validatedStartFrom.errorCode);
    },

    'test checking float number' : function() {
        var validatedStartFrom = this.presenter.validateStartFrom("12.5");

        assertFalse("Testing float number", validatedStartFrom.isValid);
        assertEquals("ST_01", validatedStartFrom.errorCode);
    },

    'test checking strings with digits in center' : function() {
    	var validatedStartFrom = this.presenter.validateStartFrom("awerafdsa123213asdfcvzx");

    	assertFalse(validatedStartFrom.isValid);
    	assertEquals("ST_01", validatedStartFrom.errorCode);
    },

    'test checking digits with string in end' : function() {
    	var validatedStartFrom = this.presenter.validateStartFrom("123213asdfcvzx");

    	assertFalse(validatedStartFrom.isValid);
    	assertEquals("ST_01", validatedStartFrom.errorCode);
    },

    'test checking digits with whitespaces mixed' : function() {
    	var validatedStartFrom = this.presenter.validateStartFrom("1  2 32  13");

    	assertFalse(validatedStartFrom.isValid);
    	assertEquals("ST_01", validatedStartFrom.errorCode);
    },


    'test checking zero number in startFrom' : function() {
    	var validatedStartFrom = this.presenter.validateStartFrom("0");

        assertFalse("Testing zero number", validatedStartFrom.isValid);
    	assertEquals("ST_01", validatedStartFrom.errorCode);
    },

    'test checking valid number in startFrom' : function() {
    	var validatedStartFrom = this.presenter.validateStartFrom("5");

        assertTrue("Testing valid number", validatedStartFrom.isValid);
    	assertEquals(validatedStartFrom.value, 4);
    }

});


TestCase("[Page Counter] Omitted Texts Pages property validation", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();
    },
    
    'test checking proper pages and start from' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
			      {"pages": "1, 2", "text": "qweqwe"}
             ]
        };

        var validatedOmittedPagesTexts = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);

        assertTrue(validatedOmittedPagesTexts.isValid);
        assertEquals({0: "qweqwe", 1: "qweqwe"}, validatedOmittedPagesTexts.value);
    },

    'test checking empty pages and proper start from' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
			      {"pages": "", "text": ""}
             ]
        };

        var validatedOmittedPagesTexts = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);
        assertTrue(validatedOmittedPagesTexts.isValid);
    },

    'test checking many texts to one page' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
                {"pages": "1, 2", "text": "qweqwe"},
                {"pages": "1", "text": "qwqwewqeqwe"}
            ]
        };

        var validatedOmittedPagesTexts = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);

        assertFalse(validatedOmittedPagesTexts.isValid);
        assertEquals("OPT_02", validatedOmittedPagesTexts.errorCode);
    },

    'test checking greater page then startFrom' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
			      {"pages": "1, 4", "text": "qweqwe"},
                  {"pages": "1", "text": "qwqwewqeqwe"}
             ]
        };

        var validatedOmittedPagesTexts = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);

        assertFalse(validatedOmittedPagesTexts.isValid);
        assertEquals(validatedOmittedPagesTexts.errorCode, "OPT_03");
    },

    'test checking not proper pages string' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
			      {"pages": "aslkrhyfao23, 4", "text": "qweqwe"},
                  {"pages": "1", "text": "qwqwewqeqwe"}
             ]
        };

        var validatedOmittedPagesTexts = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);

        assertFalse(validatedOmittedPagesTexts.isValid);
        assertEquals(validatedOmittedPagesTexts.errorCode, "OPT_01");
    },

    'test checking empty  text string with proper pages' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
			      {"pages": "1, 2", "text": ""},
             ]
        };
        var validatedEmptyPagesTextsFields = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);

        assertFalse(validatedEmptyPagesTextsFields.isValid);
        assertEquals( "OPT_05", validatedEmptyPagesTextsFields.errorCode)
    },


    'test checking empty  pages string with text' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
			      {"pages": "", "text": "qwe"},
             ]
        };
        var validatedEmptyPagesTextsFields = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);

        assertFalse(validatedEmptyPagesTextsFields.isValid);
        assertEquals("OPT_04", validatedEmptyPagesTextsFields.errorCode);
    },

    'test checking proper parsing with valid pages & text' : function() {
        var OmittedPagesTexts = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
                {"pages": "1", "text": "qwe"},
                {"pages": "2", "text": "har"}
             ]
        };
        var validatedEmptyPagesTextsFields = this.presenter.validateOmittedPagesTexts(OmittedPagesTexts, 3);

        assertTrue(validatedEmptyPagesTextsFields.isValid);
        assertEquals({0: "qwe", 1: "har"}, validatedEmptyPagesTextsFields.value);
    }
});

TestCase("[Page Counter] Numericals property validation", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();
        this.model = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
			      {"pages": "1, 2", "text": "qweqwe"}
             ]
        };
    },

    'test checking detecting Western Arabic' : function() {
        this.model.Numericals = "Western Arabic";
        var validatedLanguage = this.presenter.validateLanguage(this.model);

        assertTrue(validatedLanguage.isValid);
        assertEquals(Internationalization.WESTERN_ARABIC, validatedLanguage.value);
    },

    'test checking detecting Eastern Arabic' : function() {
        this.model.Numericals = "Eastern Arabic";
        var validatedLanguage = this.presenter.validateLanguage(this.model);

        assertTrue(validatedLanguage.isValid);
        assertEquals(Internationalization.EASTERN_ARABIC, validatedLanguage.value);
    },

    'test checking detecting Perso-Arabic' : function() {
        this.model.Numericals = "Perso-Arabic";
        var validatedLanguage = this.presenter.validateLanguage(this.model);

        assertTrue(validatedLanguage.isValid);
        assertEquals(Internationalization.PERSO_ARABIC, validatedLanguage.value);
    },

    'test checking default (empty string) language' : function() {
        this.model.Numericals = "";
        var validatedLanguage = this.presenter.validateLanguage(this.model);

        assertTrue(validatedLanguage.isValid);
        assertEquals(Internationalization.WESTERN_ARABIC, validatedLanguage.value);
    }
});

TestCase('[Page Counter] Model validation', {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();

        this.stubs = {
            startFrom: sinon.stub(this.presenter, 'validateStartFrom'),
            omittedPagesTexts: sinon.stub(this.presenter, 'validateOmittedPagesTexts'),
            language: sinon.stub(this.presenter, 'validateLanguage')
        };
    },

    tearDown: function() {
        this.presenter.validateStartFrom.restore();
        this.presenter.validateOmittedPagesTexts.restore();
        this.presenter.validateLanguage.restore();
    },

    'test failed start from property validation': function () {
        this.stubs.startFrom.returns({isValid: false, errorCode: 'ST_01'});

        var validatedModel = this.presenter.validateModel({});

        assertFalse(validatedModel.isValid);
        assertEquals('ST_01', validatedModel.errorCode);

        assertTrue(this.stubs.startFrom.called);
        assertFalse(this.stubs.omittedPagesTexts.called);
        assertFalse(this.stubs.language.called);
    },

    'test failed omittedPagesTexts property validation': function () {
        this.stubs.startFrom.returns({isValid: true});
        this.stubs.omittedPagesTexts.returns({isValid: false, errorCode: "OPT_01"});

        var validatedModel = this.presenter.validateModel({});

        assertFalse(validatedModel.isValid);
        assertEquals("OPT_01", validatedModel.errorCode);

        assertTrue(this.stubs.startFrom.called);
        assertTrue(this.stubs.omittedPagesTexts.called);
        assertFalse(this.stubs.language.called);
    },

    'test success model validation': function () {
        this.stubs.startFrom.returns({isValid: true, value: 3});
        this.stubs.omittedPagesTexts.returns({isValid: true, value: {1: "qwe"}});
        this.stubs.language.returns({isValid: true, value: Internationalization.WESTERN_ARABIC});

        var validatedModel = this.presenter.validateModel({});

        assertTrue(validatedModel.isValid);
        assertTrue(this.stubs.startFrom.called);
        assertTrue(this.stubs.omittedPagesTexts.called);
        assertTrue(this.stubs.language.called);

        assertEquals(3, validatedModel.startFrom);
        assertEquals({1: "qwe"}, validatedModel.omittedPagesTexts);
        assertEquals(Internationalization.WESTERN_ARABIC, validatedModel.Numericals);
    }
});