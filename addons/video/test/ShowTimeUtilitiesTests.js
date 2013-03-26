ShowTimeUtilitiesTests = TestCase("Show Time Utilities Tests");

ShowTimeUtilitiesTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();
    this.presenter.showTime = null;
};

ShowTimeUtilitiesTests.prototype.testSetShowTimeMethod = function() {
    var expectedShowTime = 15;

    this.presenter.setShowTime("00:15");

    assertEquals(expectedShowTime, this.presenter.showTime.value);
};

ShowTimeUtilitiesTests.prototype.testSetShowTimeWithEmptyTimeString = function() {
    var expectedShowTime = null;

    this.presenter.setShowTime("");

    assertEquals(expectedShowTime, this.presenter.showTime);
};