TestCase("[Text_Coloring] Upgrade Text Coloring model", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.model = {
            Bottom: '',
            ID: 'Text_Coloring1'
        };

        this.addModelPropertySpy = sinon.spy(this.presenter, 'addModelProperty');
    },

    'test should add properties to model when the upgradeModel was called': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertTrue(this.addModelPropertySpy.calledThrice);
        assertTrue(upgradedModel.hasOwnProperty('Mode'));
        assertTrue(upgradedModel.hasOwnProperty('countErrors'));
        assertTrue(upgradedModel.hasOwnProperty('printable'));
    },

    'test given new property when addModelProperty was called should add the property to the model': function () {
        var property = {
            name: 'Property test',
            value: 'Property test value'
        };

        var upgradedModel = this.presenter.addModelProperty(this.model, property.name, property.value);

        assertTrue(upgradedModel.hasOwnProperty('Property test'));
        assertEquals(upgradedModel['Property test'], 'Property test value');
    }
});
