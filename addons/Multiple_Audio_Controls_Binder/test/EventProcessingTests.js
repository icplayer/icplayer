TestCase("Event processing - matching modules", {
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

    'test source does not match any module': function () {
        var eventData = {
            source: 'ImageGap1'
        };

        var matchingResult = this.presenter.matchEventToModules(eventData);

        assertFalse(matchingResult.isMatch);
    },

    'test Audio addon time update event': function () {
        var eventData = {
            source: 'Audio5',
            item: '',
            value: '00:15',
            score: ''
        };

        var matchingResult = this.presenter.matchEventToModules(eventData);

        assertFalse(matchingResult.isMatch);
    },

    'test Audio addon onEnd event': function () {
        var eventData = {
            source: 'Audio5',
            item: 'end',
            value: '',
            score: ''
        };

        var matchingResult = this.presenter.matchEventToModules(eventData);

        assertTrue(matchingResult.isMatch);
        assertEquals('Audio5', matchingResult.moduleID);
        assertEquals(this.presenter.EVENT_ACTIONS.AUDIO_END, matchingResult.action);
        assertEquals(this.presenter.MODULE_TYPE.AUDIO, matchingResult.moduleType);
    },

    'test Double State Button addon select event': function () {
        var eventData = {
            source: 'Double_State_Button8',
            item: '',
            value: '1',
            score: ''
        };

        var matchingResult = this.presenter.matchEventToModules(eventData);

        assertTrue(matchingResult.isMatch);
        assertEquals('Double_State_Button8', matchingResult.moduleID);
        assertEquals(this.presenter.EVENT_ACTIONS.DOUBLE_STATE_BUTTON_SELECT, matchingResult.action);
        assertEquals(this.presenter.MODULE_TYPE.DOUBLE_STATE_BUTTON, matchingResult.moduleType);
    },

    'test Double State Button addon deselect event': function () {
        var eventData = {
            source: 'Double_State_Button8',
            item: '',
            value: '0',
            score: ''
        };

        var matchingResult = this.presenter.matchEventToModules(eventData);

        assertTrue(matchingResult.isMatch);
        assertEquals('Double_State_Button8', matchingResult.moduleID);
        assertEquals(this.presenter.EVENT_ACTIONS.DOUBLE_STATE_BUTTON_DESELECT, matchingResult.action);
        assertEquals(this.presenter.MODULE_TYPE.DOUBLE_STATE_BUTTON, matchingResult.moduleType);
    }
});

TestCase("Event processing - event action delegation", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();

        sinon.stub(this.presenter, 'audioEndHandler');
        sinon.stub(this.presenter, 'doubleStateButtonSelectionHandler');
        sinon.stub(this.presenter, 'doubleStateButtonDeselectionHandler');

        this.presenter.configuration = {
            connections: new this.presenter.Connections([
                { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
                { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
                { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
            ])
        };
    },

    tearDown: function () {
        this.presenter.audioEndHandler.restore();
        this.presenter.doubleStateButtonSelectionHandler.restore();
        this.presenter.doubleStateButtonDeselectionHandler.restore();
    },

    'test no action should be performed on event reception': function () {
        var eventData = {
            source: 'Audio3',
            item: 'end',
            value: '',
            score: ''
        };

        this.presenter.onEventReceived('ValueChanged', eventData);

        assertFalse(this.presenter.audioEndHandler.calledOnce);
        assertFalse(this.presenter.doubleStateButtonSelectionHandler.calledOnce);
        assertFalse(this.presenter.doubleStateButtonDeselectionHandler.calledOnce);
    },

    'test Audio addon onEnd event': function () {
        var eventData = {
            source: 'Audio5',
            item: 'end',
            value: '',
            score: ''
        };

        this.presenter.onEventReceived('ValueChanged', eventData);

        assertTrue(this.presenter.audioEndHandler.calledOnce);
        assertFalse(this.presenter.doubleStateButtonSelectionHandler.calledOnce);
        assertFalse(this.presenter.doubleStateButtonDeselectionHandler.calledOnce);
    },

    'test Double State Button addon select event': function () {
        var eventData = {
            source: 'Double_State_Button8',
            item: '',
            value: '1',
            score: ''
        };

        this.presenter.onEventReceived('ValueChanged', eventData);

        assertFalse(this.presenter.audioEndHandler.calledOnce);
        assertTrue(this.presenter.doubleStateButtonSelectionHandler.calledOnce);
        assertFalse(this.presenter.doubleStateButtonDeselectionHandler.calledOnce);
    },

    'test Double State Button addon deselect event': function () {
        var eventData = {
            source: 'Double_State_Button8',
            item: '',
            value: '0',
            score: ''
        };

        this.presenter.onEventReceived('ValueChanged', eventData);

        assertFalse(this.presenter.audioEndHandler.calledOnce);
        assertFalse(this.presenter.doubleStateButtonSelectionHandler.calledOnce);
        assertTrue(this.presenter.doubleStateButtonDeselectionHandler.calledOnce);
    }
});

TestCase("Event processing - Audio end handling", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();

        this.audio = sinon.stub();
        this.doubleStateButton = {
            select: function () {},
            deselect: function () {}
        };
        this.doubleStateButtonMock = sinon.mock(this.doubleStateButton);

        this.getModuleStub = sinon.stub(this.presenter, 'getModule');
        this.getModuleStub.withArgs('Double_State_Button7').returns(this.doubleStateButton);
        this.getModuleStub.returns(function () {});

        this.presenter.configuration = {
            connections: new this.presenter.Connections([
                { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
                { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
                { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
            ])
        };
    },

    tearDown: function () {
        this.presenter.getModule.restore();
    },

    'test audio ended': function () {
        this.doubleStateButtonMock.expects('deselect').once();
        var connection = this.presenter.configuration.connections.getConnectionWithAudio('Audio7');
        connection.DoubleStateButton.state = this.presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED;

        this.presenter.audioEndHandler('Audio7');

        this.doubleStateButtonMock.verify();
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection.DoubleStateButton.state);
    }
});

TestCase("Event processing - Double State Button (de)selection handling", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();

        this.audioAction = {
            play: function () {},
            stop: function () {}
        };
        this.audioOther = {
            play: function () {},
            stop: function () {}
        };
        this.audioActionMock = sinon.mock(this.audioAction); // Action comes to this module
        this.audioOtherMock = sinon.mock(this.audioOther);

        this.doubleStateButtonAction = {
            select: function () {},
            deselect: function () {}
        };
        this.doubleStateButtonOther = {
            select: function () {},
            deselect: function () {}
        };
        this.doubleStateButtonActionMock = sinon.mock(this.doubleStateButtonAction); // Action comes to this module
        this.doubleStateButtonOtherMock = sinon.mock(this.doubleStateButtonOther);


        this.getModuleStub = sinon.stub(this.presenter, 'getModule');
        this.getModuleStub.withArgs('Double_State_Button7').returns(this.doubleStateButtonAction);
        this.getModuleStub.withArgs('Audio7').returns(this.audioAction);
        this.getModuleStub.withArgs('Double_State_Button6').returns(this.doubleStateButtonOther);
        this.getModuleStub.withArgs('Audio5').returns(this.audioOther);
        this.getModuleStub.withArgs('Double_State_Button5').returns(this.doubleStateButtonOther);
        this.getModuleStub.withArgs('Audio6').returns(this.audioOther);
        this.getModuleStub.withArgs('Double_State_Button8').returns(this.doubleStateButtonOther);
        this.getModuleStub.withArgs('Audio8').returns(this.audioOther);

        this.presenter.configuration = {
            connections: new this.presenter.Connections([
                { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
                { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
                { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
            ])
        };
    },

    tearDown: function () {
        this.presenter.getModule.restore();
    },

    'test Double State Button deselected while Audio is playing': function () {
        var connection7 = this.presenter.configuration.connections.getConnectionWithAudio('Audio7');
        var connection5 = this.presenter.configuration.connections.getConnectionWithAudio('Audio5');
        var connection6 = this.presenter.configuration.connections.getConnectionWithAudio('Audio6');
        var connection8 = this.presenter.configuration.connections.getConnectionWithAudio('Audio8');

        connection7.Audio.state = this.presenter.STATES.AUDIO.PLAYING;
        connection7.DoubleStateButton.state = this.presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED;

        this.doubleStateButtonActionMock.expects('deselect').never();
        this.doubleStateButtonActionMock.expects('select').never();
        this.doubleStateButtonOtherMock.expects('deselect').never();
        this.doubleStateButtonOtherMock.expects('select').never();

        this.audioActionMock.expects('play').never();
        this.audioActionMock.expects('stop').once();
        this.audioOtherMock.expects('play').never();
        this.audioOtherMock.expects('stop').never();


        this.presenter.doubleStateButtonDeselectionHandler('Double_State_Button7');

        this.doubleStateButtonActionMock.verify();
        this.audioActionMock.verify();
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection7.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection7.DoubleStateButton.state);

        this.doubleStateButtonOtherMock.verify();
        this.audioOtherMock.verify();
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection5.Audio.state);
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection6.Audio.state);
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection8.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection5.DoubleStateButton.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection6.DoubleStateButton.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection8.DoubleStateButton.state);
    },

    'test Double State Button selected while all Audio are stopped': function () {
        var connection7 = this.presenter.configuration.connections.getConnectionWithAudio('Audio7');
        var connection5 = this.presenter.configuration.connections.getConnectionWithAudio('Audio5');
        var connection6 = this.presenter.configuration.connections.getConnectionWithAudio('Audio6');
        var connection8 = this.presenter.configuration.connections.getConnectionWithAudio('Audio8');

        this.doubleStateButtonActionMock.expects('deselect').never();
        this.doubleStateButtonActionMock.expects('select').never();
        this.doubleStateButtonOtherMock.expects('deselect').never();
        this.doubleStateButtonOtherMock.expects('select').never();

        this.audioActionMock.expects('play').once();
        this.audioActionMock.expects('stop').never();
        this.audioOtherMock.expects('play').never();
        this.audioOtherMock.expects('stop').never();


        this.presenter.doubleStateButtonSelectionHandler('Double_State_Button7');

        this.doubleStateButtonActionMock.verify();
        this.audioActionMock.verify();
        assertEquals(this.presenter.STATES.AUDIO.PLAYING, connection7.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED, connection7.DoubleStateButton.state);

        this.doubleStateButtonOtherMock.verify();
        this.audioOtherMock.verify();
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection5.Audio.state);
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection6.Audio.state);
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection8.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection5.DoubleStateButton.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection6.DoubleStateButton.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection8.DoubleStateButton.state);
    },

    'test Double State Button selected while one Audio is playing': function () {
        var connection7 = this.presenter.configuration.connections.getConnectionWithAudio('Audio7');
        var connection5 = this.presenter.configuration.connections.getConnectionWithAudio('Audio5');
        var connection6 = this.presenter.configuration.connections.getConnectionWithAudio('Audio6');
        var connection8 = this.presenter.configuration.connections.getConnectionWithAudio('Audio8');

        connection7.Audio.state = this.presenter.STATES.AUDIO.PLAYING;
        connection7.DoubleStateButton.state = this.presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED;

        this.doubleStateButtonActionMock.expects('deselect').once();
        this.doubleStateButtonActionMock.expects('select').never();
        this.doubleStateButtonOtherMock.expects('deselect').never();
        this.doubleStateButtonOtherMock.expects('select').never();

        this.audioActionMock.expects('play').never();
        this.audioActionMock.expects('stop').once();
        this.audioOtherMock.expects('play').once();
        this.audioOtherMock.expects('stop').never();


        this.presenter.doubleStateButtonSelectionHandler('Double_State_Button5');

        this.doubleStateButtonActionMock.verify();
        this.audioActionMock.verify();
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection7.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection7.DoubleStateButton.state);

        assertEquals(this.presenter.STATES.AUDIO.PLAYING, connection6.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED, connection6.DoubleStateButton.state);

        this.doubleStateButtonOtherMock.verify();
        this.audioOtherMock.verify();
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection5.Audio.state);
        assertEquals(this.presenter.STATES.AUDIO.STOPPED, connection8.Audio.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection5.DoubleStateButton.state);
        assertEquals(this.presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED, connection8.DoubleStateButton.state);
    }
});