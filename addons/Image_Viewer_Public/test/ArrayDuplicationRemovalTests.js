TestCase("Array duplication removal", {
    setUp: function () {
        this.presenter = AddonImage_Viewer_Public_create();
    },

    'test empty array': function () {
        var cleanedArray = this.presenter.removeDuplicatesFromArray([]);

        assertEquals([], cleanedArray);
    },

    'test not empty array': function () {
        var cleanedArray = this.presenter.removeDuplicatesFromArray([1, 2, 2, 3, 3, 4, 5]);

        assertEquals([1, 2, 3, 4, 5], cleanedArray);
    },

    'test last element duplicate': function () {
        var cleanedArray = this.presenter.removeDuplicatesFromArray([1, 2, 2, 3, 3, 5, 5]);

        assertEquals([1, 2, 3, 5], cleanedArray);
    }
});