TestCase("[Table] Is attempted", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gapType: 'not_math'
        };
        this.presenter.valueChangeObserver = new this.presenter.ValueChangeObserver();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.presenter.eventBus = {
            sendEvent: sinon.spy()
        };

        this.gapId = 'someObjectId';
        this.gap = new this.presenter.GapUtils({
            addonID: "addonID",
            objectID: this.gapId,
            connectEvents: function(){},
            createView: function(){},
            eventBus:  function(){},
            fillGap: function () {},
            getSelectedItem: function(){},
            makeGapEmpty: function () {},
            setValue: function () {},
            setViewValue: function () {}
        });

        this.presenter.gapsContainer.addGap(this.gap);

        this.stubs = {
            isAllOK: sinon.stub(this.presenter, 'isAllOK')
        }

    },

    tearDown: function () {
        this.presenter.isAllOK.restore();
    },

    'test given not exsting gap id when notifying observer gap value has changed then isAttempted returns false': function () {
        this.presenter.valueChangeObserver.notify({
            objectID: 'not_valid'
        });

        assertFalse(this.presenter.isAttempted());
    },

    'test given valid gap id when notifying observer gap value has changed then isAttempted returns false': function () {
                debugger;

        this.presenter.valueChangeObserver.notify({
            objectID: this.gapId
        });

        assertTrue(this.presenter.isAttempted());
    }


});
