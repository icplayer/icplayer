TestCase("[PieChart] generateItemData function", {
    setUp: function () {
        this.presenter = AddonPieChart_create();
    },

    'test given arguments with parameter < 50, when generateItemData is called, return correct value': function () {
        this.presenter.center = 118;
        this.presenter.radius = 77.6;

        let result = this.presenter.generateItemData(10, 216);

        let expectedResult = 'M 118 118 L 118 40.400000000000006 A 77.6 77.6 0 0 1 163.6121355778959 55.220281236504086 L 118 118 Z';
        assertEquals(expectedResult, result);
    },


    'test given arguments with parameter > 50, when generateItemData is called, return correct value': function () {
        this.presenter.center = 118;
        this.presenter.radius = 77.6;

        let result = this.presenter.generateItemData(70, 180);

        let expectedResult = 'M 118 118 L 191.80198566450392 141.9797187634959 A 77.6 77.6 0 1 1 117.99999999999999 40.400000000000006 L 118 118 Z';
        assertEquals(expectedResult, result);
    },

});
