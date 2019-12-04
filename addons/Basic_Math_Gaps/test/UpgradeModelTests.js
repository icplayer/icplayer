TestCase("[Basic Math Gaps] Upgrade model", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.spies = {
            upgradeModel: sinon.spy(this.presenter, 'upgradeModel'),
            upgradeGapType: sinon.spy(this.presenter, 'upgradeGapType'),
            upgradeUserActionEvents: sinon.spy(this.presenter, 'upgradeUserActionEvents')
        };
    },

    'test upgrading model should trigger upgrading gap type': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.spies.upgradeGapType.calledOnce);
    },

    'test when model have gap type, it shouldn\'t change it value': function () {
        var expectedModel = { "gapType": "as.dkhjncvfal834y5rolafda"};

        var upgradedModel = this.presenter.upgradeGapType(expectedModel);

        assertEquals(expectedModel, upgradedModel);
    },

    'test when model don\'t have gap type, it should place type Editable as default' : function () {
        var expectedModel = { "gapType": "Editable"};

        var upgradedModel = this.presenter.upgradeGapType({});

        assertEquals(expectedModel, upgradedModel);
    },

    'test given model without user actions events field when upgrade model is called then upgradeUserActionEvents is called ': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.spies.upgradeUserActionEvents.calledOnce);
    },

    'test given model without user actions events field when upgrade model is called then will return this field as false': function () {
        var o = this.presenter.upgradeModel({});

        assertEquals(o.userActionEvents, 'False');
    },

    'test given model with user actions events field when upgrade model is called then field is not changed': function () {
        var o = this.presenter.upgradeModel({'userActionEvents': 'True'});

        assertEquals(o.userActionEvents, 'True');
    }

});
