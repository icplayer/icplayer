CalculateContainerDimensionsTests = TestCase("Container dimensions calculations validation");

CalculateContainerDimensionsTests.prototype.testImageRatioSmallerThanContainer = function() {
    var presenter = AddonAnimation_create();
    
    var dimensions = presenter.calculateContainerDimensions(2, 1, 3, 1);
    
    assertEquals(2, dimensions.horizontal);
    assertEquals(1, dimensions.vertical);
};

CalculateContainerDimensionsTests.prototype.testImageRatioLargerThanContainer = function() {
    var presenter = AddonAnimation_create();
    
    var dimensions = presenter.calculateContainerDimensions(2, 1, 3, 3);
    
    assertEquals(3, dimensions.horizontal);
    assertEquals(1.5, dimensions.vertical);
    
    dimensions = presenter.calculateContainerDimensions(2, 1, 1, 3);
    
    assertEquals(1, dimensions.horizontal);
    assertEquals(0.5, dimensions.vertical);
    
    dimensions = presenter.calculateContainerDimensions(2, 1, 3, 2);
    
    assertEquals(3, dimensions.horizontal);
    assertEquals(1.5, dimensions.vertical);
};