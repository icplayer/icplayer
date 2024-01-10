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
    }
});