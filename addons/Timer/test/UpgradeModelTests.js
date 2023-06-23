TestCase("[Timer] Upgrade model", {
    setUp: function () {
        this.presenter = AddonTimer_create();

        this.model = {
            ID: 'Timer1',
            Mode: '',
            "Is Visible": 'True'
        };
    },

    'test given model without speechText property when upgradeModel was called then the model should be updated': function () {
        const expectedModel = {
            ID: 'Timer1',
            Mode: '',
            "Is Visible": 'True',
            "speechTexts": {
                Hours: {Hours: ''},
                Minutes: {Minutes: ''},
                Seconds: {Seconds: ''},
                StopwatchStarted: {StopwatchStarted: ''},
                StopwatchStopped: {StopwatchStopped: ''},
                TimerEnded: {TimerEnded: ''},
                TimerStarted: {TimerStarted: ''},
                TimerStopped: {TimerStopped: ''}
            }
        };

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(expectedModel, upgradedModel);
    },

    'test given model with speechText property when upgradeModel was called then the model should not be updated': function () {
        this.model["speechTexts"] = {
            Hours: {Hours: 'Godzin'},
            Minutes: {Minutes: 'Minut'},
            Seconds: {Seconds: 'Sekund'},
            StopwatchStarted: {StopwatchStarted: 'Start'},
            StopwatchStopped: {StopwatchStopped: 'Stop'},
            TimerEnded: {TimerEnded: ''},
            TimerStarted: {TimerStarted: ''},
            TimerStopped: {TimerStopped: ''}
        };

        const expectedModel = {
            ID: 'Timer1',
            Mode: '',
            "Is Visible": 'True',
            "speechTexts": {
                Hours: {Hours: 'Godzin'},
                Minutes: {Minutes: 'Minut'},
                Seconds: {Seconds: 'Sekund'},
                StopwatchStarted: {StopwatchStarted: 'Start'},
                StopwatchStopped: {StopwatchStopped: 'Stop'},
                TimerEnded: {TimerEnded: ''},
                TimerStarted: {TimerStarted: ''},
                TimerStopped: {TimerStopped: ''}
            }
        };

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(expectedModel, upgradedModel);
    }
});