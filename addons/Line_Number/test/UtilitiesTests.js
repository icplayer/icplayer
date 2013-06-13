TestCase("Utilities Tests", {

    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.presenter.configuration = { drawnRangesData: { ranges: [] } };
        this.presenter.configuration.drawnRangesData.ranges = [
            {
                start: { value: -5, include: false },
                end: { value: 0, include: false }
            },
            {
                start: { value: -5, include: true },
                end: { value: 0, include: true }
            }
        ];

    },

    'test value -5 in range (-5, 0) should return false because -5 is excluded': function() {
        assertFalse('', this.presenter.isValueInRange(-5, this.presenter.configuration.drawnRangesData.ranges[0], true));
    },

    'test value -5 in range <-5, 0> should return true because -5 is included': function() {
        assertTrue('', this.presenter.isValueInRange(-5, this.presenter.configuration.drawnRangesData.ranges[1], true));
    },

    'test value -10 in range (-5, 0) should return false because -10 is out of range': function() {
        assertFalse('', this.presenter.isValueInRange(-10, this.presenter.configuration.drawnRangesData.ranges[0], true));
    },

    'test value -3 in range <-5, 0> should return true because -3 is in range': function() {
        assertTrue('', this.presenter.isValueInRange(-3, this.presenter.configuration.drawnRangesData.ranges[1], true));
    }

});