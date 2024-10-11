TestCase("[Writing Calculations] Upgrade Model Tests", {
    setUp: function () {
        this.presenter = AddonWritingCalculations_create();
        this.model = {
            'Value' : ''
        };
    },

    'test given model without signs when upgradeModel is called then signs is added with default value': function () {
        const expectedResult = [
            {
                'Addition' : '',
                'Subtraction' : '',
                'Division' : '',
                'Multiplication' : '',
                'Equals' : ''
            }
        ];

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["Signs"]);
        assertEquals(expectedResult, upgradedModel["Signs"]);
    },

    'test given model with signs when upgradeModel is called then signs remains unchanged': function () {
        const data = [
            {
                'Addition' : '1',
                'Subtraction' : '2',
                'Division' : '3',
                'Multiplication' : '4',
                'Equals' : '5'
            }
        ];
        this.model["Signs"] = data;

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(data, upgradedModel["Signs"]);
    },

    "test given model without showAllAnswersInGSA when upgradeModel is called then showAllAnswersInGSA is added with default value": function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["showAllAnswersInGSA"]);
        assertEquals("False", upgradedModel["showAllAnswersInGSA"]);
    },

    "test given model with showAllAnswersInGSA when upgradeModel is called then showAllAnswersInGSA value remains unchanged": function () {
        this.model["showAllAnswersInGSA"] = "True";
        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("True", upgradedModel["showAllAnswersInGSA"]);
    },

    "test given model without TTS properties when upgradeModel is called then TTS properties are added": function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["speechTexts"]);

        assertNotUndefined(upgradedModel["speechTexts"]);

        assertNotUndefined(upgradedModel["speechTexts"]["Gap"]);
        assertNotUndefined(upgradedModel["speechTexts"]["Gap"]["Gap"]);
        assertEquals("", upgradedModel["speechTexts"]["Gap"]["Gap"]);

        assertNotUndefined(upgradedModel["speechTexts"]["AdditionalGap"]);
        assertNotUndefined(upgradedModel["speechTexts"]["AdditionalGap"]["AdditionalGap"]);
        assertEquals("", upgradedModel["speechTexts"]["AdditionalGap"]["AdditionalGap"]);

        assertNotUndefined(upgradedModel["speechTexts"]["Empty"]);
        assertNotUndefined(upgradedModel["speechTexts"]["Empty"]["Empty"]);
        assertEquals("", upgradedModel["speechTexts"]["Empty"]["Empty"]);

        assertNotUndefined(upgradedModel["speechTexts"]["AdditionSign"]);
        assertNotUndefined(upgradedModel["speechTexts"]["AdditionSign"]["AdditionSign"]);
        assertEquals("", upgradedModel["speechTexts"]["AdditionSign"]["AdditionSign"]);

        assertNotUndefined(upgradedModel["speechTexts"]["SubtractionSign"]);
        assertNotUndefined(upgradedModel["speechTexts"]["SubtractionSign"]["SubtractionSign"]);
        assertEquals("", upgradedModel["speechTexts"]["SubtractionSign"]["SubtractionSign"]);

        assertNotUndefined(upgradedModel["speechTexts"]["DivisionSign"]);
        assertNotUndefined(upgradedModel["speechTexts"]["DivisionSign"]["DivisionSign"]);
        assertEquals("", upgradedModel["speechTexts"]["DivisionSign"]["DivisionSign"]);

        assertNotUndefined(upgradedModel["speechTexts"]["MultiplicationSign"]);
        assertNotUndefined(upgradedModel["speechTexts"]["MultiplicationSign"]["MultiplicationSign"]);
        assertEquals("", upgradedModel["speechTexts"]["MultiplicationSign"]["MultiplicationSign"]);

        assertNotUndefined(upgradedModel["speechTexts"]["EqualsSign"]);
        assertNotUndefined(upgradedModel["speechTexts"]["EqualsSign"]["EqualsSign"]);
        assertEquals("", upgradedModel["speechTexts"]["EqualsSign"]["EqualsSign"]);

        assertNotUndefined(upgradedModel["speechTexts"]["DecimalSeparator"]);
        assertNotUndefined(upgradedModel["speechTexts"]["DecimalSeparator"]["DecimalSeparator"]);
        assertEquals("", upgradedModel["speechTexts"]["DecimalSeparator"]["DecimalSeparator"]);

        assertNotUndefined(upgradedModel["speechTexts"]["Line"]);
        assertNotUndefined(upgradedModel["speechTexts"]["Line"]["Line"]);
        assertEquals("", upgradedModel["speechTexts"]["Line"]["Line"]);

        assertNotUndefined(upgradedModel["speechTexts"]["Correct"]);
        assertNotUndefined(upgradedModel["speechTexts"]["Correct"]["Correct"]);
        assertEquals("", upgradedModel["speechTexts"]["Correct"]["Correct"]);

        assertNotUndefined(upgradedModel["speechTexts"]["Wrong"]);
        assertNotUndefined(upgradedModel["speechTexts"]["Wrong"]["Wrong"]);
        assertEquals("", upgradedModel["speechTexts"]["Wrong"]["Wrong"]);
    },

    "test given model with TTS properties when upgradeModel is called then TTS properties are not overwritten": function () {
        this.model["speechTexts"] = {
            Gap: {Gap: "gapa"},
            AdditionalGap: {AdditionalGap: "dodatkowa gapa"},
            Empty: {Empty: "pusty"},
            AdditionSign: {AdditionSign: "dodawanie"},
            SubtractionSign: {SubtractionSign: "odejmowanie"},
            DivisionSign: {DivisionSign: "dzielenie"},
            MultiplicationSign: {MultiplicationSign: "mnożenie"},
            EqualsSign: {EqualsSign: "równanie"},
            DecimalSeparator: {DecimalSeparator: "kropka"},
            Line: {Line: "linia"},
            Correct: {Correct: "poprawne"},
            Wrong: {Wrong: "niepoprawne"}

        };

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("gapa", upgradedModel["speechTexts"]["Gap"]["Gap"]);
        assertEquals("dodatkowa gapa", upgradedModel["speechTexts"]["AdditionalGap"]["AdditionalGap"]);
        assertEquals("pusty", upgradedModel["speechTexts"]["Empty"]["Empty"]);
        assertEquals("dodawanie", upgradedModel["speechTexts"]["AdditionSign"]["AdditionSign"]);
        assertEquals("odejmowanie", upgradedModel["speechTexts"]["SubtractionSign"]["SubtractionSign"]);
        assertEquals("dzielenie", upgradedModel["speechTexts"]["DivisionSign"]["DivisionSign"]);
        assertEquals("mnożenie", upgradedModel["speechTexts"]["MultiplicationSign"]["MultiplicationSign"]);
        assertEquals("równanie", upgradedModel["speechTexts"]["EqualsSign"]["EqualsSign"]);
        assertEquals("kropka", upgradedModel["speechTexts"]["DecimalSeparator"]["DecimalSeparator"]);
        assertEquals("linia", upgradedModel["speechTexts"]["Line"]["Line"]);
        assertEquals("poprawne", upgradedModel["speechTexts"]["Correct"]["Correct"]);
        assertEquals("niepoprawne", upgradedModel["speechTexts"]["Wrong"]["Wrong"]);
    }
});