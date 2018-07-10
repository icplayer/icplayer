function AddonMultiple_Audio_Controls_Binder_create() {
    var presenter = function () {};
    presenter.configuration = {};

    presenter.ERROR_CODES = {
        'CONNECTIONS_01': "Connections cannot be empty!",
        'CONNECTIONS_02': "Missing separator character!",
        'CONNECTIONS_03': "Missing Audio addon ID!",
        'CONNECTIONS_04': "Missing Double State Button addon ID!",
        'CONNECTIONS_05': "Empty lines are not allowed!",
        'CONNECTIONS_06': "Repeated Audio addon ID!",
        'CONNECTIONS_07': "Repeated Double State Button addon ID!",
        'CONNECTIONS_08': "Missing item number!",
        'CONNECTIONS_09': "Item must be positive number!"
    };

    presenter.STATES = {
        AUDIO: {
            PLAYING: 1,
            STOPPED: 2
        },

        DOUBLE_STATE_BUTTON: {
            SELECTED: 1,
            DESELECTED: 2
        }
    };

    function showErrorMessage(errorCode) {
        presenter.$view.html(presenter.ERROR_CODES[errorCode]);
    }

    presenter.validateModel = function AddonMultiple_Audio_Controls_Binder_validateModel (model) {
        var validatedConnections = presenter.validateConnections(model.Connections);

        if (!validatedConnections.isValid) {
            return {
                isValid: false,
                errorCode: validatedConnections.errorCode
            }
        }

        return {
            isValid: true,
            connections:  new presenter.Connections(validatedConnections.connections)
        }
    };

    function presenterLogic (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            showErrorMessage(presenter.configuration.errorCode);

            delete presenter.getState;
            delete presenter.setState;

            return;
        }

        if (presenter.eventBus) {
            presenter.eventBus.addEventListener('PageLoaded', presenter);
        }

        if (isPreview) return;

        presenter.$view.css('visible', 'hidden');
    }

    presenter.isAudioIDPresent = function (connections, audioID) {
        var i;

        for (i = 0; i < connections.length; i++) {
            if (connections[i].Audio === audioID) return true;
        }

        return false;
    };

    presenter.isDoubleStateButtonIDPresent = function (connections, doubleStateButtonID) {
        var i;

        for (i = 0; i < connections.length; i++) {
            if (connections[i].DoubleStateButton === doubleStateButtonID) return true;
        }

        return false;
    };

    presenter.validateConnections = function AddonMultiple_Audio_Controls_Binder_validateConnections(connections) {
        var parsedConnections = [], isValid = true, errorCode;

        if (ModelValidationUtils.isStringEmpty(connections)) return { isValid: false, errorCode: 'CONNECTIONS_01'};

        jQuery.each(connections.split('\n'), function (elementIndex, element) {
            var indexOfSeparator, modules, audioID, doubleStateButtonID, itemNumber;

            if (ModelValidationUtils.isStringEmpty(element)) {
                isValid = false;
                errorCode = 'CONNECTIONS_05';
                return false;
            }

            indexOfSeparator = element.indexOf('|');
            if (indexOfSeparator === -1) {
                isValid = false;
                errorCode = 'CONNECTIONS_02';
                return false;
            }

            modules = element.split('|');
            audioID = modules[0];
            doubleStateButtonID = modules[1];
            itemNumber = modules[2];

            if (ModelValidationUtils.isStringEmpty(audioID)) {
                isValid = false;
                errorCode = 'CONNECTIONS_03';
                return false;
            }

            if (ModelValidationUtils.isStringEmpty(doubleStateButtonID)) {
                isValid = false;
                errorCode = 'CONNECTIONS_04';
                return false;
            }

            if (itemNumber === undefined && presenter.isAudioIDPresent(parsedConnections, audioID)) {
                isValid = false;
                errorCode = 'CONNECTIONS_06';
                return false;
            }

            if (presenter.isDoubleStateButtonIDPresent(parsedConnections, doubleStateButtonID)) {
                isValid = false;
                errorCode = 'CONNECTIONS_07';
                return false;
            }

            if (itemNumber !== undefined && ModelValidationUtils.isStringEmpty(itemNumber)) {
                isValid = false;
                errorCode = 'CONNECTIONS_08';
                return false;
            }

            if (itemNumber !== undefined && !ModelValidationUtils.validatePositiveInteger(itemNumber).isValid) {
                isValid = false;
                errorCode = 'CONNECTIONS_09';
                return false;
            }

            parsedConnections.push({ Audio: audioID, DoubleStateButton: doubleStateButtonID, Item: itemNumber });
        });

        return {
            isValid: isValid,
            connections: parsedConnections,
            errorCode: errorCode
        };
    };

    presenter.Connection = function (audioID, doubleStateButtonID, ID, item) {
        var self = this;

        this.DoubleStateButton = {
            ID: doubleStateButtonID,
            getModule: function () { return presenter.getModule(self.DoubleStateButton.ID); },
            state: presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED
        };

        this.Audio = {
            ID: audioID,
            getModule: function () { return new presenter.AudioAdapter(presenter.getModule(self.Audio.ID)); },
            state: presenter.STATES.AUDIO.STOPPED
        };

         this.Item = {
            Digit: item
        };

        this.ID = ID;
    };

    presenter.Connections = function (connections) {
        this.connections = [];

        for (var i = 0; i < connections.length; i++) {
            var audioID = connections[i].Audio;
            var doubleStateButtonID = connections[i].DoubleStateButton;
            var item = connections[i].Item;

            this.connections.push(new presenter.Connection(audioID, doubleStateButtonID, i, item));
        }

        this.getConnection = function (connectionID) {
            return jQuery.grep(this.connections, function (element) {
                return element.ID == connectionID;
            })[0];
        };

        this.getConnectionWithAudio = function (audioID) {
            for (var i = 0; i < this.connections.length; i++) {
                if (this.connections[i].Audio.ID == audioID) return this.connections[i];
            }

            return undefined;
        };

        this.getConnectionWithAudioAndItem = function (audioID, item) {
            for (var i = 0; i < this.connections.length; i++) {
                if (this.connections[i].Audio.ID == audioID && this.connections[i].Item.Digit == item) return this.connections[i];
            }

            return undefined;
        };

        this.getConnectionWithDSB = function (doubleStateButtonID) {
            for (var i = 0; i < this.connections.length; i++) {
                if (this.connections[i].DoubleStateButton.ID == doubleStateButtonID) return this.connections[i];
            }

            return undefined;
        };

        this.getConnectionsOtherThan = function (connectionID) {
            return jQuery.grep(this.connections, function (connection) {
                return connection.ID != connectionID;
            });
        };

        this.getAllConnections = function () {
            return this.connections;
        };
    };

    presenter.getModule = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('ValueChanged', this);
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        }

        var matchedModule = presenter.matchEventToModules(eventData);

        if (!matchedModule.isMatch) return;

        switch (matchedModule.action) {
            case presenter.EVENT_ACTIONS.AUDIO_END:
                presenter.audioEndHandler(matchedModule.moduleID, eventData.item);
                break;
            case presenter.EVENT_ACTIONS.DOUBLE_STATE_BUTTON_SELECT:
                presenter.doubleStateButtonSelectionHandler(matchedModule.moduleID);
                break;
            case presenter.EVENT_ACTIONS.DOUBLE_STATE_BUTTON_DESELECT:
                presenter.doubleStateButtonDeselectionHandler(matchedModule.moduleID);
                break;
        }
    };

    presenter.audioEndHandler = function (audioID, item) {
        var connection = presenter.getAudioAdapterConnection(audioID, item);

        connection.Audio.state = presenter.STATES.AUDIO.STOPPED;
        connection.DoubleStateButton.getModule().deselect();
        connection.DoubleStateButton.state = presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED;
    };

    presenter.getAudioAdapterConnection = function (audioID, item) {
        if (presenter.getModule(audioID).type === 'multiaudio') {
            return presenter.configuration.connections.getConnectionWithAudioAndItem(audioID, item);
        }

        return presenter.configuration.connections.getConnectionWithAudio(audioID);
    };

    presenter.doubleStateButtonSelectionHandler = function (moduleID) {
        var connection = presenter.configuration.connections.getConnectionWithDSB(moduleID),
            otherConnections = presenter.configuration.connections.getConnectionsOtherThan(connection.ID),
            audio, doubleStateButton;

        jQuery.each(otherConnections, function (index, connection) {
            audio = connection.Audio;
            doubleStateButton = connection.DoubleStateButton;
            if (presenter.STATES.AUDIO.PLAYING == audio.state) {
                audio.getModule().stop();
                audio.state = presenter.STATES.AUDIO.STOPPED;
                doubleStateButton.getModule().deselect();
                doubleStateButton.state = presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED;
            }
        });

        connection.Audio.getModule().play(connection.Item.Digit);
        connection.Audio.state = presenter.STATES.AUDIO.PLAYING;
        connection.DoubleStateButton.state = presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED;
    };

    presenter.doubleStateButtonDeselectionHandler = function (moduleID) {
        var connection = presenter.configuration.connections.getConnectionWithDSB(moduleID);

        connection.Audio.getModule().stop();
        connection.Audio.state = presenter.STATES.AUDIO.STOPPED;
        connection.DoubleStateButton.state = presenter.STATES.DOUBLE_STATE_BUTTON.DESELECTED;
    };

    presenter.matchEventToModules = function (eventData) {
        var moduleID = eventData.source,
            connection = presenter.configuration.connections.getConnectionWithAudio(moduleID),
            eventActions = presenter.EVENT_ACTIONS;

        if (connection) {
            if (eventData.item !== 'end' && eventData.value !== 'end') return { isMatch: false };

            return {
                isMatch: true,
                moduleID: moduleID,
                moduleType: presenter.MODULE_TYPE.AUDIO,
                action: eventActions.AUDIO_END,
                connectionID: connection.ID
            };
        }

        // No Audio module with given ID
        connection = presenter.configuration.connections.getConnectionWithDSB(moduleID);
        if (!connection) return { isMatch: false };

        return {
            isMatch: true,
            moduleType: presenter.MODULE_TYPE.DOUBLE_STATE_BUTTON,
            moduleID: moduleID,
            action: eventData.value == '1' ? eventActions.DOUBLE_STATE_BUTTON_SELECT : eventActions.DOUBLE_STATE_BUTTON_DESELECT,
            connectionID: connection.ID
        };
    };

    presenter.EVENT_ACTIONS = {
        AUDIO_END: 0,
        DOUBLE_STATE_BUTTON_SELECT: 1,
        DOUBLE_STATE_BUTTON_DESELECT: 2
    };

    presenter.MODULE_TYPE = {
        AUDIO: 0,
        DOUBLE_STATE_BUTTON: 1
    };

    presenter.run = function (view, model) {
        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();
        presenterLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.getState = function () {
        var state = jQuery.map(presenter.configuration.connections.getAllConnections(), function (connection) {
            var isSelected = presenter.STATES.DOUBLE_STATE_BUTTON.SELECTED === connection.DoubleStateButton.state;

            return { ID: connection.ID, isSelected: isSelected };
        });

        return JSON.stringify(state);
    };

    presenter.setState = function (stringifiedState) {
        var state = JSON.parse(stringifiedState);

        state = jQuery.grep(state, function (element) {
            return element.isSelected;
        });

        presenter.pageLoadedHandlerLoad(state);
    };

    presenter.pageLoadedHandlerLoad = function (state) {
        var connection;
        presenter.pageLoaded.then(function() {
            jQuery.each(state, function (index, value) {
                connection = presenter.configuration.connections.getConnection(value.ID);
                connection.DoubleStateButton.getModule().deselect();
            });
        });
    };

    presenter.AudioAdapter = function AddonMultiple_Audio_Controls_Binder_AudioAdapter (audioPresenter) {
        this.audioPresenter = audioPresenter;
    };

    presenter.AudioAdapter.prototype.play = function (item) {
        if (this.audioPresenter === undefined || this.audioPresenter === null) return;

        if (this.audioPresenter.type === 'multiaudio') {
            this.audioPresenter.jumpTo(item);
        }
        this.audioPresenter.play();
    };

     presenter.AudioAdapter.prototype.stop = function () {
         if (this.audioPresenter === undefined || this.audioPresenter === null) return;

         this.audioPresenter.stop();
    };

    return presenter;
}