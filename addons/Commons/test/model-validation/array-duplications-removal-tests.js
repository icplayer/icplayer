TestCase("[Commons - Model Validation Utils] Array duplication removal", {
    'test empty array': function () {
        var cleanedArray = ModelValidationUtils.removeDuplicatesFromArray([]);

        assertEquals([], cleanedArray);
    },

    'test not empty array': function () {
        var cleanedArray = ModelValidationUtils.removeDuplicatesFromArray([1, 2, 2, 3, 3, 4, 5]);

        assertEquals([1, 2, 3, 4, 5], cleanedArray);
    },

    'test last element duplicate': function () {
        var cleanedArray = ModelValidationUtils.removeDuplicatesFromArray([1, 2, 2, 3, 3, 4, 5, 5]);

        assertEquals([1, 2, 3, 4, 5], cleanedArray);
    }
});