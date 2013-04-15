UpgradeModelTests = TestCase("Upgrade Model Tests");

UpgradeModelTests.prototype.setUp = function() {
    this.presenter = AddonWritingCalculations_create();

    this.model = {
        'Value' : ''
    };

};

UpgradeModelTests.prototype.testUpgradeSigns = function() {
    var expectedModelAfterUpgradeSigns = {
        'Value' : '',
        'Signs' : [
            {
                'Addition' : '',
                'Subtraction' : '',
                'Division' : '',
                'Multiplication' : ''
            }
        ]
    };

    var upgradedModel = this.presenter.upgradeSigns(this.model);

    assertEquals(expectedModelAfterUpgradeSigns, upgradedModel);
    assertNotEquals(this.model, upgradedModel); // Ensure that changes were made on copy
};