TestCase("State saving", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
        this.presenter.configuration = {
            connections: new this.presenter.Connections([
                { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
                { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
                { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
            ])
        };
    },

    'test get state when no Audio is playing': function () {
        var expectedState = JSON.stringify([
            {ID: 0, isSelected: false},
            {ID: 1, isSelected: false},
            {ID: 2, isSelected: false},
            {ID: 3, isSelected: false}
        ]);

        var state = this.presenter.getState();

        assertEquals(expectedState, state);
    },

    'test get state when one Audio is playing': function () {
        var connection7 = this.presenter.configuration.connections.getConnectionWithAudio('Audio7');
        connection7.Audio.state = this.presenter.STATES.AUDIO.PLAYING;
        connection7.DoubleStateButton.state = this.presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED;

        var expectedState = JSON.stringify([
            {ID: 0, isSelected: false},
            {ID: 1, isSelected: false},
            {ID: 2, isSelected: true},
            {ID: 3, isSelected: false}
        ]);

        var state = this.presenter.getState();

        assertEquals(expectedState, state);
    }
});

TestCase("State restoring", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();

        this.doubleStateButtonAction = { deselect: function () {} };
        this.doubleStateButtonActionMock = sinon.mock(this.doubleStateButtonAction);
        this.doubleStateButtonOther = { deselect: function () {} };
        this.doubleStateButtonOtherMock = sinon.mock(this.doubleStateButtonOther);


        this.getModuleStub = sinon.stub(this.presenter, 'getModule');
        this.getModuleStub.withArgs('Double_State_Button7').returns(this.doubleStateButtonAction);
        this.getModuleStub.withArgs('Audio7').returns(function () {});
        this.getModuleStub.withArgs('Double_State_Button6').returns(this.doubleStateButtonOther);
        this.getModuleStub.withArgs('Audio5').returns(function () {});
        this.getModuleStub.withArgs('Double_State_Button5').returns(this.doubleStateButtonOther);
        this.getModuleStub.withArgs('Audio6').returns(function () {});
        this.getModuleStub.withArgs('Double_State_Button8').returns(this.doubleStateButtonOther);
        this.getModuleStub.withArgs('Audio8').returns(function () {});

        this.presenter.configuration = {
            connections: new this.presenter.Connections([
                { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
                { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
                { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
            ])
        };

        sinon.stub(this.presenter, 'pageLoadedHandlerLoad');
    },

    tearDown: function () {
        this.presenter.getModule.restore();
        this.presenter.pageLoadedHandlerLoad.restore();
    },

    'test set state when no Audio was playing': function () {
        this.doubleStateButtonActionMock.expects('deselect').never();
        this.doubleStateButtonOtherMock.expects('deselect').never();

        var state = JSON.stringify([
            {ID: 0, isSelected: false},
            {ID: 1, isSelected: false},
            {ID: 2, isSelected: false},
            {ID: 3, isSelected: false}
        ]);

        this.presenter.setState(state);

        this.doubleStateButtonActionMock.verify();
        this.doubleStateButtonOtherMock.verify();
        assertTrue(this.presenter.pageLoadedHandlerLoad.called);
    }
});