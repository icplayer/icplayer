TestCase("[Assessments_Navigation_Bar] Sections validation", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    'test section property cant be empty string': function () {
        var validationResult = this.presenter.validateSections("");

        assertFalse(validationResult.isValid);
        assertEquals("S_00", validationResult.errorCode);
    },

    'test only pages numbers have to be defined': function () {
        assertTrue(this.presenter.validateSections("1-4").isValid);
    },

    'test pages numbers can be comma separated': function () {
        assertTrue(this.presenter.validateSections("1, 2, 3").isValid);
    },

    'test pages numbers can be range': function () {
        assertTrue(this.presenter.validateSections("1-4").isValid);
    },

    'test pages numbers cant be mix of comma separated and ranges': function () {
        var validationResult = this.presenter.validateSections("1-4, 5, 6");

        assertFalse(validationResult.isValid);
        assertEquals("S_02", validationResult.errorCode);
        assertEquals(1, validationResult.errorData["section"]);
    },

    'test pages numbers cant be floats': function () {
        var validationResult = this.presenter.validateSections("12.5, 5.5");

        assertEquals("S_01", validationResult.errorCode);
        assertEquals(1, validationResult.errorData["section"]);
    },

    'test pages numbers cant be negative numbers': function () {
        var validationResult = this.presenter.validateSections("-12.5, -5");

        assertEquals("S_01", validationResult.errorCode);
        assertEquals(1, validationResult.errorData["section"]);
    },

    'test section description can be empty': function () {
        assertTrue(this.presenter.validateSections("1-4;; 1, 2, 3, 4").isValid);
    },

    'test section buttons descriptions have to be comma separated': function () {
        assertTrue(this.presenter.validateSections("1-4;; 1, 2, 3, 4").isValid);
    },

    'test section buttons descriptions need to be equal number to provided pages number': function () {
        var validationResult = this.presenter.validateSections("1-4;; 1, 2");
        assertFalse(validationResult.isValid);
        assertEquals("S_03", validationResult.errorCode);
        assertEquals(1, validationResult.errorData["section"]);

        validationResult = this.presenter.validateSections("1-4;; 1, 2, 4, 5, 6, 7, 8");
        assertFalse(validationResult.isValid);
        assertEquals("S_04", validationResult.errorCode);
        assertEquals(1, validationResult.errorData["section"]);
    },

    'test sections ranges cant overlap one with another': function () {
        var validationResult = this.presenter.validateSections("1-4;; 1,2,3,4 \n 2-6");

        assertFalse(validationResult.isValid);
        assertEquals("S_05", validationResult.errorCode);
        assertEquals("1", validationResult.errorData["section_1"]);
        assertEquals("2", validationResult.errorData["section_2"]);
    },

    'test pages descriptions if its empty, then should be next section pages numbers': function () {
        var validationResult = this.presenter.validateSections("1-4");

        assertTrue(validationResult.isValid);
        assertEquals(["1", "2", "3", "4"], validationResult.sections[0].pagesDescriptions);

        validationResult = this.presenter.validateSections("1,2,3,4");

        assertTrue(validationResult.isValid);
        assertEquals(["1", "2", "3", "4"], validationResult.sections[0].pagesDescriptions);
    },

    'test sections should be parsed to proper object': function () {
        var expectedResult = {
            isValid: true,
            sections: [
                {
                    pages: [0, 1, 2, 3],
                    sectionName: "latweZadania",
                    pagesDescriptions: ["1", "2", "3", "4"]
                }
            ]
        };

        var validationResult = this.presenter.validateSections("1-4; latweZadania; 1, 2, 3, 4");

        assertEquals(expectedResult, validationResult);
    }
});

TestCase("[Assessments_Navigation_Bar] Parse pages from range", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    'test parsing valid comma separated range': function () {
        var expectedResult = [0, 1, 2, 3];

        var validationResult = this.presenter.parsePagesFromRange("1, 2, 3, 4");

        assertTrue(validationResult.isValid);
        assertEquals(expectedResult, validationResult.pages);
    },

    'test parsing range separated with dash': function () {
        var expectedResult = [0, 1, 2, 3];

        var validationResult = this.presenter.parsePagesFromRange("1-4");

        assertTrue(validationResult.isValid);
        assertEquals(expectedResult, validationResult.pages);
    },

    'test parsing single comma separated section': function () {
        var validationResult = this.presenter.parsePagesFromRange("1");

        assertTrue(validationResult.isValid);
        assertEquals([0], validationResult.pages);
    },

    'test parsing single dash separated section': function () {
        var validationResult = this.presenter.parsePagesFromRange("1-1");

        assertTrue(validationResult.isValid);
        assertEquals([0], validationResult.pages);
    },

    'test parsing invalid section range non numbers string': function () {
        var validationResult = this.presenter.parsePagesFromRange("asdlhjawl34u adsfas uwaef das", 1);

        assertFalse(validationResult.isValid);
        assertEquals("S_02", validationResult.errorCode);
        assertEquals(1, validationResult.errorData["section"]);
    },

    'test parsing invalid float numbers': function () {
        var validationResult = this.presenter.parsePagesFromRange("12.5, 4, 8", 2);

        assertFalse(validationResult.isValid);
        assertEquals("S_01", validationResult.errorCode);
        assertEquals(2, validationResult.errorData["section"]);
    },

    'test parsing invalid negative numbers': function () {
        var validationResult = this.presenter.parsePagesFromRange("-12, 4, 8", 3);

        assertFalse(validationResult.isValid);
        assertEquals("S_01", validationResult.errorCode);
        assertEquals(3, validationResult.errorData["section"]);
    }
});