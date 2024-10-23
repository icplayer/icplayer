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

    'test section css class names can be not defined': function () {
        assertTrue(this.presenter.validateSections("1-4;desc; 1, 2, 3, 4").isValid);
    },

    'test section css class names cannot be empty': function () {
        assertFalse(this.presenter.validateSections("1-4;; 1, 2, 3, 4;").isValid);
    },

    'test sections should be parsed to proper object': function () {
        var expectedResult = {
            isValid: true,
            sections: [
                {
                    pages: [0, 1, 2, 3],
                    sectionName: "latweZadania",
                    pagesDescriptions: ["1", "2", "3", "4"],
                    sectionButtonsCssClassNames: ["AClass", "BClass"],
                    staticPosition: ""
                }
            ]
        };

        var validationResult = this.presenter.validateSections("1-4; latweZadania; 1, 2, 3, 4; AClass, BClass");

        assertEquals(expectedResult, validationResult);
    },
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

TestCase("[Assessments Navigation Bar] Parse buttons width", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    'test should parse empty string as no value provided': function () {
        var result = this.presenter.parseButtonsWidth("      ");

        assertTrue(result.isValid);
        assertUndefined(result.value);
    },

    'test should parse string to integers': function () {
        var result = this.presenter.parseButtonsWidth("  42.5");

        assertTrue(result.isValid);
        assertEquals(42, result.value);

        result = this.presenter.parseButtonsWidth("10");

        assertTrue(result.isValid);
        assertEquals(10, result.value);

        result = this.presenter.parseButtonsWidth("10asfdafdsa");

        assertFalse(result.isValid);
    },

    'test should parse negative or 0 buttons to error': function () {
        var result = this.presenter.parseButtonsWidth("0");

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_09");
        assertUndefined(result.errorData);

        var result = this.presenter.parseButtonsWidth("-15");

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_09");
        assertUndefined(result.errorData);
    },

    'test should parse non numeric string to error': function (){
        var result = this.presenter.parseButtonsWidth("asdfhjla  d sfva");

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_10");
        assertUndefined(result.errorData);
    }
});

TestCase("[Assessments Navigation Bar] Parse buttons number", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    'test should parse empty string as no value provided': function () {
        var result = this.presenter.parseButtonsNumber("      ", 10);

        assertTrue(result.isValid);
        assertUndefined(result.value);
    },

    'test should parse string to integers': function () {
        var result = this.presenter.parseButtonsNumber("  42.5", 50);

        assertTrue(result.isValid);
        assertEquals(42, result.value);

        result = this.presenter.parseButtonsNumber("10", 20);

        assertTrue(result.isValid);
        assertEquals(10, result.value);

        result = this.presenter.parseButtonsNumber("10asfdafdsa", 20);
        assertFalse(result.isValid);
    },

    'test should parse negative or 0 buttons to error': function () {
        var result = this.presenter.parseButtonsNumber("0", 10);

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_06");
        assertUndefined(result.errorData);

        result = this.presenter.parseButtonsNumber("-15", 10);

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_06");
        assertUndefined(result.errorData);
    },

    'test should parse non numeric string to error': function (){
        var result = this.presenter.parseButtonsNumber("asdfhjla  d sfva", 10);

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_07");
        assertUndefined(result.errorData);
    },

    'test should be equal or less than number of pages in sections': function (){
        var result = this.presenter.parseButtonsNumber("20", 10);

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_08");
        assertUndefined(result.errorData);
    }
});

TestCase("[Assessments Navigation Bar] Parse section buttons css class names", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.sectionIndex = 5;
    },

    'test given empty string when parsing should raise error': function () {
        const inputValue = "";

        var result = this.presenter.parseSectionButtonsCssClassNames(inputValue, this.sectionIndex);

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_11");
        assertEquals(this.sectionIndex, result.errorData.section);
    },

    'test given undefined when parsing should raise error': function () {
        const inputValue = undefined;

        var result = this.presenter.parseSectionButtonsCssClassNames(inputValue, this.sectionIndex);

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_11");
        assertEquals(this.sectionIndex, result.errorData.section);
    },

    'test given invalid css class name when parsing should raise error': function () {
        const invalidClassNames = [".AClass", "A Class", "@Class"];

        for (var i = 0; i < invalidClassNames.length; i++) {
            var result = this.presenter.parseSectionButtonsCssClassNames(
                invalidClassNames[i], this.sectionIndex
            );

            assertFalse(result.isValid);
            assertEquals(result.errorCode, "S_12");
            assertEquals(this.sectionIndex, result.errorData.section);
        }
    },

    'test given valid css class name when parsing should success': function () {
        const validClasses = ["AClass", "A-Class", "A_Class", "Class1"];

        for (var i = 0; i < validClasses.length; i++) {
            var result = this.presenter.parseSectionButtonsCssClassNames(validClasses[i], this.sectionIndex);

            assertTrue(result.isValid);
            assertEquals(result.cssClasses, [validClasses[i]]);
        }
    },

    'test given valid css class names separated by comma when parsing should success': function () {
        const inputValue = "AClass,BClass,CClass";

        var result = this.presenter.parseSectionButtonsCssClassNames(inputValue, this.sectionIndex);

        assertTrue(result.isValid);
        assertEquals(result.cssClasses, ["AClass", "BClass", "CClass"]);
    },

    'test given valid css class names separated by comma and space when parsing should success': function () {
        const inputValue = " AClass, BClass, CClass";

        var result = this.presenter.parseSectionButtonsCssClassNames(inputValue, this.sectionIndex);

        assertTrue(result.isValid);
        assertEquals(result.cssClasses, ["AClass", "BClass", "CClass"]);
    },

    'test given duplicated css class names when parsing should success and remove duplications': function () {
        const inputValue = "AClass, AClass, CClass";

        var result = this.presenter.parseSectionButtonsCssClassNames(inputValue, this.sectionIndex);

        assertTrue(result.isValid);
        assertEquals(result.cssClasses, ["AClass", "CClass"]);
    },

    'test given invalid string with css class separated by comma when parsing should raise error': function () {
        const inputValue = ",AClass,BClass,CClass";

        var result = this.presenter.parseSectionButtonsCssClassNames(inputValue, this.sectionIndex);

        assertFalse(result.isValid);
        assertEquals(result.errorCode, "S_11");
        assertEquals(this.sectionIndex, result.errorData.section);
    },
});


TestCase("[Assessments Navigation Bar] validateModel", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.stubs = {
            validateSections: sinon.stub(this.presenter, 'validateSections'),
            parseButtonsNumber: sinon.stub(this.presenter, 'parseButtonsNumber'),
            parseButtonsWidth: sinon.stub(this.presenter, 'parseButtonsWidth'),
            calculateNumberOfPages: sinon.stub(this.presenter, 'calculateNumberOfPages'),
            calculateNumberOfStaticPages: sinon.stub(this.presenter, 'calculateNumberOfStaticPages')
        }
    },

    tearDown: function () {
        this.presenter.validateSections.restore();
        this.presenter.parseButtonsNumber.restore();
        this.presenter.parseButtonsWidth.restore();
        this.presenter.calculateNumberOfPages.restore();
        this.presenter.calculateNumberOfStaticPages.restore();
    },

    'test should validate and parse all properties': function () {
        this.stubs.validateSections.returns({
            isValid: true
        });

        this.stubs.parseButtonsNumber.returns({
            isValid: true
        });

        this.stubs.parseButtonsWidth.returns({
            isValid: true
        });

        this.stubs.calculateNumberOfStaticPages.returns(0);

        this.presenter.validateModel({});

        assertTrue(this.stubs.validateSections.calledOnce);
        assertTrue(this.stubs.parseButtonsNumber.calledOnce);
        assertTrue(this.stubs.parseButtonsWidth.calledOnce);
    },

    'test should return model from values of validations': function () {
        var returnedSections = {
            isValid: true,
            sections: ["asdk;ljasv;ckxzjvzxc"]
        };

        var returnedButtonsNumber = {
            isValid: true,
            value: 5
        };

        var returnedButtonsWidth = {
            isValid: true,
            value: "asdfsafdas"
        };

        this.stubs.validateSections.returns(returnedSections);
        this.stubs.parseButtonsNumber.returns(returnedButtonsNumber);
        this.stubs.parseButtonsWidth.returns(returnedButtonsWidth);

        var result = this.presenter.validateModel({});

        assertTrue(this.stubs.validateSections.calledOnce);
        assertTrue(this.stubs.parseButtonsNumber.calledOnce);
        assertTrue(this.stubs.parseButtonsWidth.calledOnce);

        assertEquals(returnedSections.sections, result.sections);
        assertEquals(returnedButtonsNumber.value, result.userButtonsNumber);
        assertEquals(returnedButtonsWidth.value, result.userButtonsWidth);
    }
});

TestCase("[Assessments Navigation Bar] Model Validation", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.validModel = {
            Sections: "1-4; latweZadania; 1, 2, 3, 4; AClass, BClass",
            userButtonsNumber: "3",
            userButtonsWidth: "40",
            ID: "addonID",
            addClassAreAllAttempted: "True",
            defaultOrder: "True"
        };

        this.expectedResult = {
            isValid: true,
            sections: [
                {
                    pages: [0, 1, 2, 3],
                    sectionName: "latweZadania",
                    pagesDescriptions: ["1", "2", "3", "4"],
                    sectionButtonsCssClassNames: ["AClass", "BClass"],
                    staticPosition: ""
                }
            ],
            addClassAreAllAttempted: true,
            addonID: "addonID",
            userButtonsNumber: 3,
            userButtonsWidth: 40,
            numberOfPages: 4,
            defaultOrder: true,
            numberOfStaticPages: 0,
            useDynamicPagination: false,
            enableDropdownPagesList: false,
            enableRedirectToPage: false
        };
    },

    'test parsing valid model': function () {
        var result = this.presenter.validateModel(this.validModel);
        assertEquals(this.expectedResult, result);
    }
});