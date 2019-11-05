TestCase("[Table] Is attempted", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gapType: 'not_math',
            isNotActivity: false
        };
        this.presenter.valueChangeObserver = new this.presenter.ValueChangeObserver();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.presenter.eventBus = {
            sendEvent: sinon.spy()
        };

        this.gap = new this.presenter.GapUtils({
            addonID: "addonID",
            objectID: "someObjectId",
            connectEvents: function(){},
            createView: function(){},
            eventBus:  function(){},
            fillGap: function () {},
            getSelectedItem: function(){},
            makeGapEmpty: function () {},
            setValue: function (value) {
                this.value = value
            },
            setViewValue: function () {},
            showAnswersValue: ["value"]
        });

        this.presenter.gapsContainer.addGap(this.gap);

        this.stubs = {
            isAllOK: sinon.stub(this.presenter, 'isAllOK')
        }

    },

    tearDown: function () {
        this.presenter.isAllOK.restore();
    },

    'test given gap with isAttempted set to false when checking if table isAttempted then returns false': function () {
        this.gap.setAttempted(false);

        assertFalse(this.presenter.isAttempted());
    },

    'test given gap with isAttempted set to true when checking if table isAttempted then returns true': function () {
        this.gap.setAttempted(true);


        assertTrue(this.presenter.isAttempted());
    },

    'test given gap with filled empty text when notyfing of change then checking if table isAttempted returns false ': function () {
        this.gap.setValue("");
        this.gap.notify();

        assertFalse(this.presenter.isAttempted());
    },

    'test given gap with some text when notyfing of change then checking if table isAttempted returns true': function () {
        this.gap.setValue("value");
        this.gap.notify();

        assertTrue(this.presenter.isAttempted());
    },

    'test given gap with text changed to empty when notyfing of change then checking if table isAttempted returns false': function () {
        this.gap.setValue("value");
        this.gap.notify();

        this.gap.setValue("");
        this.gap.notify();

        assertFalse(this.presenter.isAttempted());
    },

    'test given table without gaps when is attempted is called then will return true': function () {
        this.presenter.gapsContainer.gaps = [];

        assertTrue(this.presenter.isAttempted());
    },

    'test given table which is not activity when is attempted is called then will return true': function () {
        this.presenter.configuration.isNotActivity = true;
        this.gap.setValue("");
        this.gap.notify();

        assertTrue(this.presenter.isAttempted());
    }

});
