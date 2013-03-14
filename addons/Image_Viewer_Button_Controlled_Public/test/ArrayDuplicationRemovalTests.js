ArrayDuplicationRemovalTests = TestCase("Array duplication removal tests");

ArrayDuplicationRemovalTests.prototype.testEmptyArray = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var cleanedArray = presenter.removeDuplicatesFromArray([]);

    assertEquals([], cleanedArray);
};

ArrayDuplicationRemovalTests.prototype.testNotEmptyArray = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var cleanedArray = presenter.removeDuplicatesFromArray([1, 2, 2, 3, 3, 4, 5]);

    assertEquals([1, 2, 3, 4, 5], cleanedArray);
};

ArrayDuplicationRemovalTests.prototype.testLastElementDuplicate = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var cleanedArray = presenter.removeDuplicatesFromArray([1, 2, 2, 3, 3, 5, 5]);

    assertEquals([1, 2, 3, 5], cleanedArray);
};