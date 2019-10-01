TestCase("[Table] Is attempted", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};
        this.presenter.valueChangeObserver = new this.presenter.ValueChangeObserver();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.presenter.eventBus = {
            sendEvent: sinon.spy()
        };


        this.stubs = {
            isAllOK: sinon.stub(this.presenter, 'isAllOK'),
            show: sinon.stub(this.presenter, 'show')
        };

        this.stubs.isAllOK.returns(false);
    },

    tearDown: function () {
        this.presenter.isAllOK.restore();
        this.presenter.show.restore();
    },

    'test given isActivityAttempted set to false when notifying observer then isAttempted returns true': function () {
        this.presenter.isActivityAttempted = false;

        this.presenter.valueChangeObserver.notify({});

        assertTrue(this.presenter.isAttempted());
    },

    'test given isActivityAttempted set to true when notifying observer then isAttempted returns true': function () {
        this.presenter.isActivityAttempted = false;

        this.presenter.valueChangeObserver.notify({});

        assertTrue(this.presenter.isAttempted());
    },

    'test given isActivityAttempted set to true when trying to execute nonexistent command then isAttempted returns true': function () {
        this.presenter.isActivityAttempted = true;

        this.presenter.executeCommand('');

        assertTrue(this.presenter.isAttempted());
    },

    'test given isActivityAttempted set to false when trying to execute nonexistent command then isAttempted returns false': function () {
        this.presenter.isActivityAttempted = false;

        this.presenter.executeCommand('');

        assertFalse(this.presenter.isAttempted());
    },

    'test given isActivityAttempted set to false when trying to execute show command then isAttempted returns true': function () {
        this.presenter.isActivityAttempted = false;

        this.presenter.executeCommand('show');

        assertTrue(this.presenter.isAttempted());
        assertTrue(this.stubs.show.called);
    },

    'test given isActivityAttempted set to true when trying to execute show command then isAttempted returns true': function () {
        this.presenter.isActivityAttempted = false;

        this.presenter.executeCommand('show');

        assertTrue(this.presenter.isAttempted());
        assertTrue(this.stubs.show.called);
    }


});
