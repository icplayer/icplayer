UtilitiesTests = TestCase("Utilities Tests");

UtilitiesTests.prototype.setUp = function() {
    this.presenter = AddonConnection_create();
    this.presenter.elements = [
        {
            id : 'abc',
            element : $(document.createElement("div")).addClass("element1")
        },
        {
            id: 1,
            element : $(document.createElement("div")).addClass("element2")
        }
    ]
};

UtilitiesTests.prototype.testGetElementById = function() {
    var expectedElementClass = "element2";
    var element = this.presenter.getElementById(1);
    assertEquals(expectedElementClass, element.attr('class'))
};