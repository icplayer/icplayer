TestCase("[Multiple Gap] UpgradeModel - flow", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();

        this.stubs = {
            upgradeModel: sinon.stub(this.presenter, 'upgradeModel'),
            validateModel: sinon.stub(this.presenter, 'validateModel'),
            itemCounterModeValue: sinon.stub(this.presenter, 'setItemCounterModeValue'),
            setUpEventListeners: sinon.stub(this.presenter, 'setUpEventListeners'),
            createView: sinon.stub(this.presenter, 'createView'),
            hide: sinon.stub(this.presenter, 'hide')
        };
    },

    tearDown : function() {
        this.presenter.upgradeModel.restore();
        this.presenter.validateModel.restore();
        this.presenter.setItemCounterModeValue.restore();
        this.presenter.setUpEventListeners.restore();
        this.presenter.createView.restore();
        this.presenter.hide.restore();
    },

    'test should upgrade model before parsing it' : function() {
        this.stubs.validateModel.returns({
            isError: false
        });
        this.presenter.run({}, {});
        assertTrue(this.stubs.upgradeModel.calledBefore(this.stubs.validateModel));
    },
    
    'test should call validateModel with upgradedModel': function () {
        var expectedModel = {
            "id": 5,
            "wrapItems": true
        };
        
        this.stubs.validateModel.returns({
            isError: false
        });
        this.stubs.upgradeModel.returns(expectedModel);
        this.presenter.run({}, {});
        
        assertTrue(this.stubs.validateModel.calledWith(expectedModel));
    }
});

TestCase("[Multiple Gap] UpgradeModel - Upgrade WrapItems property", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        
        this.nonUpgradedModel = {
            "id": 1,
            "someattribute": 5
        };
        
        this.newValidWrappingModel = {
            "id": 2,
            "someattribute": 5,
            "wrapItems": true,
            "speechTexts":{
                Inserted:{Inserted:"Inserted"},
                Removed:{Removed:"Removed"},
                Empty:{Empty:"Empty"},
                Correct:{Correct:"Correct"},
                Wrong:{Wrong:"Wrong"}
                },
            "langAttribute":""
        };
        
        this.newValidNotWrappingModel = {
            "id": 3,
            "someattribute": 5,
            "wrapItems": false,
            "speechTexts":{
                Inserted:{Inserted:"Inserted"},
                Removed:{Removed:"Removed"},
                Empty:{Empty:"Empty"},
                Correct:{Correct:"Correct"},
                Wrong:{Wrong:"Wrong"}
                },
            "langAttribute":""
        };
        
        this.upgradedModel = {
            "id": 1,
            "someattribute": 5,
            "wrapItems": false,
            "speechTexts":{
                Inserted:{Inserted:"Inserted"},
                Removed:{Removed:"Removed"},
                Empty:{Empty:"Empty"},
                Correct:{Correct:"Correct"},
                Wrong:{Wrong:"Wrong"}
                },
            "langAttribute":""
        };
        
        this.spies = {
            upgradeWrapItems: sinon.spy(this.presenter, 'upgradeWrapItems')
        };
    },
    
    tearDown: function () {
        this.presenter.upgradeWrapItems.restore();
    },
    
    'test should call upgrade wrapItems if property is not present': function () {
        this.presenter.upgradeModel(this.nonUpgradedModel);
        
        assertTrue(this.spies.upgradeWrapItems.calledOnce);
    },
    
    'test should provide false value to model and not change other attributes': function () {
        var upgradedModel = this.presenter.upgradeModel(this.nonUpgradedModel);
        
        assertEquals(this.upgradedModel, upgradedModel);
    },
    
    'test should not change model values if attribute is present': function () {
        var upgradedValidWrappingModel = this.presenter.upgradeModel(this.newValidWrappingModel);
        var upgradedValidNotWrappingModel = this.presenter.upgradeModel(this.newValidNotWrappingModel);
        
        assertEquals(this.newValidWrappingModel, upgradedValidWrappingModel);
        assertEquals(this.newValidNotWrappingModel, upgradedValidNotWrappingModel);
    },
    
    'test should not call upgrade wrap items if attribute is present': function () {
        this.presenter.upgradeModel(this.newValidNotWrappingModel);
        this.presenter.upgradeModel(this.newValidWrappingModel);
        
        assertFalse(this.spies.upgradeWrapItems.called);
    }
});