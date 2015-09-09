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
                'Multiplication' : '',
                'Equals' : ''
            }
        ]
    };

    var upgradedModel = this.presenter.upgradeSigns(this.model);

    assertEquals(expectedModelAfterUpgradeSigns, upgradedModel);
    assertNotEquals(this.model, upgradedModel); // Ensure that changes were made on copy
};

UpgradeModelTests.prototype.testUpgradeSignsWhenSignsAreAlreadyHere = function() {
    this.model['Signs'] = [{
        'Addition' : 'a',
        'Subtraction' : 'b',
        'Division' : 'c',
        'Multiplication' : 'd'
    }];

    var upgradedModel = this.presenter.upgradeSigns(this.model);

    assertEquals(this.model, upgradedModel);
};