TestCase("[Coloring] Upgrade model", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.stubs = {
            upgradeUserAreas: sinon.stub(this.presenter, 'upgradeUserAreas')
        };
        this.model = {
            'Areas' : '55; 150; 255 200 255 255; Area',
            'Width' : '500',
            'Height' : '500',
            'Tolerance' : '50',
            'DefaultFillingColor' : ''
        };
    },

    'test given model without colors prop when upgrading then model is updated by it': function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        const expected = [];

        assertEquals(expected, upgradedModel.colors);
    },

    'test given model without speechTexts prop when upgrading then model is updated by it': function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        const expected = {
            Area: { Area: "" },
            Color: { Color: "" },
            Selected: { Selected: "" },
            Correct: { Correct: "" },
            Incorrect: { Incorrect: "" }
        };

        assertEquals(expected, upgradedModel.speechTexts);
    },

   'test given model without markTransparentAreas property when the model is upgrading then model is updated by it': function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        const expected = "False";

        assertEquals(expected, upgradedModel.markTransparentAreas);
    },

    'test given model with markTransparentAreas property when the model is upgrading then model should not be changed': function () {
        this.model['markTransparentAreas'] = 'True';
        const upgradedModel = this.presenter.upgradeModel(this.model);

        const expected = "True";

        assertEquals(expected, upgradedModel.markTransparentAreas);
    }
});