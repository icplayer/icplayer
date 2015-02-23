TestCase("[Graph] Upgrade Y axis values validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test model should be upgraded': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10.5',
            'Y axis minimum value': '-10.5',
            'Y axis grid step': '2',
            'Interactive': 'True',
            'Interactive step': '2',
            'Data': '"1", "2", "3", "4"\n' +
                    '"2", "0", "-6", "-8"\n' +
                    '"20", "4", "6", "8"'
        };

        var upgradedModel = this.presenter.upgradeAxisYValues(model);

        assertTrue(ModelValidationUtils.isStringEmpty(upgradedModel["Y axis values"]));
        assertEquals("", upgradedModel["Y axis values"]);
    },

    'test model should not be upgraded': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10.5',
            'Y axis minimum value': '-10.5',
            'Y axis grid step': '2',
            'Y axis values': '2',
            'Interactive': 'True',
            'Interactive step': '2',
            'Data': '"1", "2", "3", "4"\n' +
                    '"2", "0", "-6", "-8"\n' +
                    '"20", "4", "6", "8"'
        };
        var upgradedModel = this.presenter.upgradeAxisYValues(model);

        assertEquals("2", upgradedModel["Y axis values"]);
    }
});