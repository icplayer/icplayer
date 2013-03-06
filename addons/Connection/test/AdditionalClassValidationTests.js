AdditionalClassValidation = TestCase("Additional Class Validation");

AdditionalClassValidation.prototype.testClassNameDefined = function() {
    var presenter = AddonConnection_create();
    var className = "right";
    var expectedClassName = "innerWrapper right";
    
    /*:DOC elementBefore = <div class='innerWrapper'></div> */

    var elementAfter = presenter.addClassToElement(this.elementBefore, className);

    assertClassName("After calling addClassToElement() elementAfter should have expectedClassName set as class.", expectedClassName, elementAfter);
};

AdditionalClassValidation.prototype.testClassNameUndefined = function() {
    var presenter = AddonConnection_create();
    var className = "";
    var expectedClassName = "innerWrapper";
    
    /*:DOC elementBefore = <div class='innerWrapper'></div> */

    var elementAfter = presenter.addClassToElement(this.elementBefore, className);

    assertClassName("After calling addClassToElement() elementAfter should stay unchanged.", expectedClassName, elementAfter);
};