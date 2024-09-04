function AddonScoreboard_create() {
    var presenter = function() {};

    presenter.teamsObjects = [];
    presenter.scoreboard = null;

    presenter.state = {
        isVisible: false,
        teamsObjects: [],
        savedScoreboard: null,
    }
    presenter.playerController = null;

    presenter.ERROR_CODES = {
        C01: 'Configuration cannot be empty',
        I01: 'Initial number of teams is greater than maximum number of teams!',
        I02: 'Initial number of teams must be positiv integer!',
        I03: 'Initial team name cannot be empty',
        I04: 'Team color must be in RGB format (hexadecimal) and start with #',
        I05: 'Maximum number of teams must be positiv integer!',
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    function deleteCommands() {
        delete presenter.getState;
        delete presenter.setState;
    }

    function presenterLogic(view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);

            deleteCommands();
            return;
        }

        presenter.initView(view, model);
        
    };

    presenter.validateMaximumTeamsCount = function (number) {
        var validatedNumber = ModelValidationUtils.validateInteger(number)
        if (!validatedNumber.isValid || validatedNumber.value < 1) {
            return ModelValidationUtils.getErrorObject('I05');
        }

        return validatedNumber;
    };

    presenter.validateInitialTeamsCount = function (number, maxTeamsCount) {
        var validatedNumber = ModelValidationUtils.validateInteger(number)
        if (!validatedNumber.isValid || validatedNumber.value < 1) {
            return ModelValidationUtils.getErrorObject('I02');
        }

        if (validatedNumber.value > maxTeamsCount) {
            return ModelValidationUtils.getErrorObject('I01');
        }
        return validatedNumber;
    };

    presenter.validateInitialTeams = function (initialTeams, maxTeamsCount) {
        var validatedInitialTeams = [], i;
        var regExp = new RegExp("#[0-9a-fA-F]+");
        
        if (initialTeams.length > maxTeamsCount) {
            return ModelValidationUtils.getErrorObject('I01');
        }

        for (i = 0; i < maxTeamsCount; i++) {
            var initialTeam = initialTeams[i];

            if(!initialTeam) {
                initialTeam = {}
                initialTeam.teamName = "X";
                initialTeam.teamColor = "#000";
            }

            if(ModelValidationUtils.isStringEmpty(initialTeam.teamName)) {
                return ModelValidationUtils.getErrorObject('I03');
            }

            var teamColor = initialTeam.teamColor;
            var colorMatch;
            if (!teamColor) {
                teamColor = "#000";
            } else {
                if (teamColor.length < 4 || teamColor.length > 7) {
                    return ModelValidationUtils.getErrorObject('I04');
                }
                colorMatch = teamColor.match(regExp);
                if (!colorMatch || colorMatch === null || colorMatch.length < 1) {
                    return ModelValidationUtils.getErrorObject('I04');
                }
                if (colorMatch[0].length < teamColor.length) {
                    return ModelValidationUtils.getErrorObject('I04');
                }
            }
            var initialTeamObject = {
                'teamId': i,
                'teamName': initialTeam.teamName,
                'teamPoints': 0,
                'teamColor': initialTeam.teamColor,
            }

            validatedInitialTeams.push(initialTeamObject)
        };

        return {
            isValid: true,
            validatedInitialTeams: validatedInitialTeams
        }
    };

    presenter.validateModel = function (model) {
        var isOnePageScoreboard = !model['Broadcast'];

        if (model['Broadcast'] !== "" && (ModelValidationUtils.isStringEmpty(model['VariableStorageLocation']) ||
            ModelValidationUtils.isStringEmpty(model['VariableStorageLocationName']))) {
            return ModelValidationUtils.getErrorObject('C01');
        }

        var validatedMaximumTeamsCount = presenter.validateMaximumTeamsCount(model['maximumTeamsCount']);
        if (!validatedMaximumTeamsCount.isValid) {
            return validatedMaximumTeamsCount;
        }

        var validatedInitialTeamsCount = presenter.validateInitialTeamsCount(model['initialTeamsCount'], validatedMaximumTeamsCount.value);
        if (!validatedInitialTeamsCount.isValid) {
            return validatedInitialTeamsCount;
        }

        var validatedInitialTeams = presenter.validateInitialTeams(model['defaultTeamsList'], validatedMaximumTeamsCount.value);
        if (!validatedInitialTeams.isValid) {
            return validatedInitialTeams;
        }

        return {
            isValid: true,
            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            broadcast: model['Broadcast'],
            isDraggable: ModelValidationUtils.validateBoolean(model['isDraggable']),
            variableStorageLocation: model['VariableStorageLocation'],
            variableStorageLocationName: model['VariableStorageLocationName'],
            isOnePageScoreboard: isOnePageScoreboard,
            defaultTeamsList: validatedInitialTeams.validatedInitialTeams,
            maximumTeamsCount: validatedMaximumTeamsCount.value,
            initialTeamsCount: validatedInitialTeamsCount.value
        }
    };

    presenter.initView = function (view, model) {
        presenter.view = view;
        presenter.$view = $(view);
        MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
        presenter.scoreboard = presenter.createScoreboard(presenter.$view);
        for (var i = 0; i < presenter.configuration.initialTeamsCount; i++) {
            presenter.scoreboard = presenter.addTeam(presenter.configuration.defaultTeamsList[i], presenter.scoreboard);
        }
        presenter.setVisibility(presenter.configuration.isVisible);
    }

// Creating scoreboard
    presenter.Scoreboard = function scoreboardCreate () {
        this.$scoreboard = null;
        this.$scoreboardBody = null;
        this.$scoreboardHeader = null;
        this.$closeButton = null;
        this.$scoreboardFooter = null;
        this.$addNewTeamButton = null;
        this.$resetButton = null;
    };

    presenter.Scoreboard._internals = {};

    presenter.Scoreboard._internals.createView = function scoreboardCreateView (savedScoreboard) {
        this.$scoreboard = savedScoreboard;
        this.$scoreboardBody = $('<div class="scoreboard-body"></div>');
        this.$scoreboardHeader = $('<div class="scoreboard-header"></div>');
        this.$closeButton = $('<div class="scoreboard-close"></div>');
        this.$scoreboardFooter = $('<div class="scoreboard-footer"></div>');
        this.$resetButton = $('<div class="scoreboard-reset"></div>');
        this.$addNewTeamButton = $('<div class="scoreboard-add-new-team"></div>');

        this.$scoreboardHeader.append(this.$closeButton);

        this.$scoreboardFooter.append(this.$resetButton);
        this.$scoreboardFooter.append(this.$addNewTeamButton);
        
        this.$scoreboard.append(this.$scoreboardHeader);
        this.$scoreboard.append(this.$scoreboardBody);
        this.$scoreboard.append(this.$scoreboardFooter);

    };

    presenter.Scoreboard.prototype.init = function scoreboardInit (savedScoreboard) {
        presenter.Scoreboard._internals.createView.call(this, savedScoreboard);

        this.connectHandlers();
        if (presenter.configuration.isDraggable) {
            this.connectDraggable(savedScoreboard);
        }
    };

    presenter.Scoreboard.prototype.setBody = function scoreboardSetBody (body) {
        this.$scoreboardBody.append(body);
    };

    presenter.Scoreboard.createScoreboard = function creatingScoreboard (savedScoreboard) {
        var scoreboard = new presenter.Scoreboard(savedScoreboard);
        scoreboard.init(savedScoreboard);
        
        return scoreboard;
    };

    presenter.createScoreboard = function scoreboardCreateScoreboard (savedScoreboard) {
        return presenter.Scoreboard.createScoreboard(savedScoreboard);
    }

    presenter.Scoreboard.prototype.getState = function scoreboardGetState () {
        return {
            'top': this.$scoreboard.css('top'),
            'left': this.$scoreboard.css('left'),
        };
    };

    presenter.Scoreboard.prototype.getView = function scoreboardGetView () {
        return this.$scoreboard;
    };

    // Scoreboard buttons
    presenter.Scoreboard.prototype.closeButtonHandler = function scoreboardCloseButtonHandler (event) {
        presenter.closeScoreBoard();
    };

    presenter.Scoreboard.prototype.resetButtonHandler = function scoreboardResetButtonHandler (event) {
        presenter.resetTeamsPoints();
    };

    function getLowestAvaibleTeamId() {
        var freeIds = [];
        var workingIds = []
        presenter.teamsObjects.forEach(function (team) {
            workingIds.push(team.getTeamId().teamId);
        });
        for (var i = 0; i < presenter.configuration.defaultTeamsList.length; i++) {
            if (!workingIds.includes(i)) {
                freeIds.push(i);
            }      
        }
        return Math.min(...freeIds);
    }

    presenter.Scoreboard.prototype.addTeamButtonHandler = function scoreboardResetButtonHandler (event) {
        if (presenter.state.teamsObjects.length < presenter.configuration.maximumTeamsCount) {
            var availableLowestId = getLowestAvaibleTeamId();
            var defaultTeamData = presenter.configuration.defaultTeamsList[availableLowestId]
            presenter.addTeam(defaultTeamData, this);
        }
    };

    presenter.Scoreboard.prototype.connectHandlers = function scoreboardConnectHandlers () {
        if (MobileUtils.isEventSupported('touchstart')) {
            this.$closeButton.on('touchstart', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.closeButtonHandler(event);
            }.bind(this));
            this.$resetButton.on('touchstart', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.resetButtonHandler(event);
            }.bind(this));
            this.$addNewTeamButton.on('touchstart', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.addTeamButtonHandler(event);
            }.bind(this));
        } else {
            this.$closeButton.on('click', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.closeButtonHandler(event);
            }.bind(this));
            this.$resetButton.on('click', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.resetButtonHandler(event);
            }.bind(this));
            this.$addNewTeamButton.on('click', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.addTeamButtonHandler(event);
            }.bind(this));
        }
    };

    presenter.Scoreboard.prototype.connectDraggable = function scoreboardConnectDraggable (savedScoreboard) {
        this.$scoreboard.draggable({
            containment: 'parent',
            opacity: 0.35,
            create: function(event, _) {
                $(event.target).css({
                    'top' : savedScoreboard ? savedScoreboard.top : '10px',
                    'left' : savedScoreboard ? savedScoreboard.left : '10px',
                    'position' : 'absolute'
                });
            },

            stop: function ScoreboardStopFunction() {
                $.ui.ddmanager.current = null;
            }
        });
    };

    presenter.Scoreboard.prototype.moveScoreboard = function scoreboardMoveScoreboard (savedScoreboardPosition) {
        var ic_page_height = this.$scoreboard.parent().height();
        this.$scoreboard.css({
            'top' : parseInt(savedScoreboardPosition.top, 10) < ic_page_height ? savedScoreboardPosition.top : '10px',
            'left' : savedScoreboardPosition.left,
        });
    };

    presenter.Scoreboard.prototype.destroy = function scoreboardDestroy () {
        if(this.$scoreboard) {
            var $scoreboard = this.$scoreboard.draggable("destroy");
            $scoreboard.off();
            this.$scoreboard.off();
            this.$scoreboardBody.off();
            this.$scoreboardHeader.off();
            this.$closeButton.off();
            this.$scoreboardFooter.off();
            this.$resetButton.off();
            this.$addNewTeamButton.off();
            this.$scoreboard = null;
            this.$scoreboardBody = null;
            this.$scoreboardHeader = null;
            this.$closeButton = null;
            this.$scoreboardFooter = null;
            this.$resetButton = null;
            this.$addNewTeamButton = null;
        }
    };

// Creating Team
    presenter.Team = function TeamCreate (savedTeams) {
        this.teamId = savedTeams.teamId;
        this.teamPoints = savedTeams.teamPoints;
        this.teamName = savedTeams.teamName;
        this.teamColor = savedTeams.teamColor;
        this.$team = null;
        this.$teamHeader = null;
        this.$teamBody = null;
        this.$teamFooter = null;
        this.$teamPointsIncrementButton = null;
        this.$teamPointsDecrementButton = null;
        this.$teamNameContainer = null;
        this.$teamPointsConatiner = null;
        this.$teamNameInput = null;
        this.$teamRemoveButton = null;
    };

    presenter.Team._internals = {};

    presenter.Team._internals.createView = function TeamCreateView (savedTeam) {
        this.$team = $('<div class="scoreboard-team"></div>');
        this.$teamHeader = $('<div class="scoreboard-team-header"></div>');
        this.$teamBody = $('<div class="scoreboard-team-body"></div>');
        this.$teamFooter = $('<div class="scoreboard-team-footer"></div>');
        this.$teamRemoveButton = $('<div class="scoreboard-team-remove"></div>');
        this.$teamNameContainer = $(
            `<div class="scoreboard-team-name-container">
                ${this.teamName}
            </div>`
        );
        this.$teamPointsConatiner = $(
            `<div class="scoreboard-team-points-container">
                <h1>${this.teamPoints}</h1>
            </div>`
        );
        this.$teamPointsDecrementButton = $(
        '<div class="scoreboard-team-score-decrement"></div>'
        );
        this.$teamPointsIncrementButton = $(
        '<div class="scoreboard-team-score-increment"></div>'
        );
        this.$teamHeader.append(this.$teamRemoveButton);

        this.$teamBody.append(this.$teamNameContainer);
        this.$teamBody.append(this.$teamPointsConatiner);
        
        this.$teamFooter.append(this.$teamPointsDecrementButton);
        this.$teamFooter.append(this.$teamPointsIncrementButton);

        this.$team.css("background-color", savedTeam.teamColor);

        this.$team.append(this.$teamHeader);
        this.$team.append(this.$teamBody);
        this.$team.append(this.$teamFooter);
    };

    presenter.Team.prototype.init = function teamInit (savedTeam) {
        presenter.Team._internals.createView.call(this, savedTeam);

        this.connectHandlers();
    };

    presenter.Team.createTeam = function teamCreateTeam (savedTeam) {
        var team = new presenter.Team(savedTeam);
        team.init(savedTeam);
        
        return team;
    };

    // Scoreboard buttons
    presenter.Team.prototype.resetPoints = function teamResetPoints () {
        this.teamPoints = 0;
        this.$teamPointsConatiner.html(`<h1>${this.teamPoints}</h1>`)
    };

    presenter.Team.prototype.removeTeamHandler = function teamRemoveTeamHandler (event) {
        var team = event.data.scoreboard;
        team.destroy();
    };

    presenter.Team.prototype.incrementPointsButtonHandler = function teamIncrementPointsButtonHandler (event) {
        this.teamPoints += 1;
        this.$teamPointsConatiner.html(`<h1>${this.teamPoints}</h1>`)
        presenter.updateTeamState(this.getTeamData());
    };

    presenter.Team.prototype.decrementPointsButtonHandler = function teamDecrementPointsButtonHandler (event) {
        this.teamPoints -= 1;
        this.$teamPointsConatiner.html(`<h1>${this.teamPoints}</h1>`)
        presenter.updateTeamState(this.getTeamData());
    };

    presenter.Team.prototype.connectHandlers = function teamConnectHandlers () {
        if(MobileUtils.isEventSupported('touchstart')) {
            this.$teamRemoveButton.on('touchstart', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.removeTeamHandler(event);
            }.bind(this));
            this.$teamPointsIncrementButton.on('touchstart', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.incrementPointsButtonHandler(event);
            }.bind(this));
            this.$teamPointsDecrementButton.on('touchstart', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.decrementPointsButtonHandler(event);
            }.bind(this));
        } else {
            this.$teamRemoveButton.on('click', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.removeTeamHandler(event);
            }.bind(this));
            this.$teamPointsIncrementButton.on('click', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.incrementPointsButtonHandler(event);
            }.bind(this));
            this.$teamPointsDecrementButton.on('click', {"scoreboard": this}, function (event) {
                event.stopPropagation();
                this.decrementPointsButtonHandler(event);
            }.bind(this));
        }
        
        this.connectTeamNameEditHandler();
    };

    presenter.Team.prototype.connectTeamNameEditHandler = function teamConnectTeamNameEditHandler () {
        this.$teamNameContainer.on('dblclick', function () {
            this.teamNameEditHandler();
            this.$teamNameContainer.off('dblclick');
        }.bind(this));

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.EventsUtils.DoubleTap.on(this.$teamNameContainer, function () {
                this.teamNameEditHandler();
                window.EventsUtils.DoubleTap.off(this.$teamNameContainer);
            }.bind(this));
        }
    };

    presenter.Team.prototype.teamNameEditHandler = function teamNameEditHandler () {
        this.currentValue = this.teamName;

        this.$teamNameInput = $('<input class="team-name-input"></input>');
        this.$teamNameInput.val(this.currentValue);
        
        this.$teamNameContainer.html(this.$teamNameInput);
        this.$teamNameInput.focus();

        this.$teamNameInput.keypress(function (e) {
            if (e.which == 13) {
                this.saveNewTeamName();
                return false;
            }
        }.bind(this));
        this.$teamNameInput.focusout(function (e) {
            this.saveNewTeamName();
            return false;
        }.bind(this));
    };

    presenter.Team.prototype.saveNewTeamName = function teamSaveNewTeamName () {
        var value = this.$teamNameInput.val();
        this.teamName = value;
        this.$teamNameContainer.html(value);
        this.$teamNameInput.remove();
        this.connectTeamNameEditHandler();
        presenter.updateTeamState(this.getTeamData());
    };

    presenter.Team.prototype.getView = function teamGetView () {
        return this.$team;
    };

    presenter.Team.prototype.getTeamData = function teamGetView () {
        return {
            'teamId': this.teamId,
            'teamName': this.teamName,
            'teamPoints': this.teamPoints,
            'teamColor': this.teamColor,
        };
    };

    presenter.Team.prototype.getTeamId = function teamGetTeamId () {
        return {
            'teamId': this.teamId,
        };
    };

    presenter.Team.prototype.destroy = function teamDestroy () {
        if(this.$team) {
            presenter.removeTeam(this.teamId);
            var $team = this.$team.draggable("destroy");
            $team.off();
            this.$team.off();
            this.$teamHeader.off();
            this.$teamBody.off();
            this.$teamFooter.off();
            this.$teamRemoveButton.off();
            this.$teamNameContainer.off();
            this.$teamPointsConatiner.off();
            this.$teamPointsDecrementButton.off();
            this.$teamPointsIncrementButton.off();
            if (this.$teamNameInput !== null) {
                this.$teamNameInput.off();
            }

            if (this.$teamRemoveButton !== null) {
                this.$teamRemoveButton.off();
            }

            window.EventsUtils.DoubleTap.off(this.$teamNameContainer);
            this.$team.remove();
            this.$team = null;
            this.teamPoints = 0;
            this.teamName = '';
            this.teamColor = ''
            this.$teamHeader = null;
            this.$teamBody = null;
            this.$teamFooter = null;
            this.$teamPointsIncrementButton = null;
            this.$teamPointsDecrementButton = null;
            this.$teamNameContainer = null;
            this.$teamPointsConatiner = null;
            this.$teamNameInput = null;
            this.$teamRemoveButton = null;
        }
    };

    presenter.createTeam = function Scoreboard_createTeam (savedTeam) {
        return presenter.Team.createTeam(savedTeam)
    };

    presenter.resetTeamsPoints = function Scoreboard_resetTeamPoints () {
        presenter.teamsObjects.forEach(function (team) {
            team.resetPoints();
        });
        presenter.state.teamsObjects.forEach(function (team) {
            team.teamPoints = 0;
        });
    };

    presenter.removeTeam = function Scoreboard_removeTeam (teamId) {
        presenter.teamsObjects = presenter.teamsObjects.filter((team) => {
            return teamId !== team.getTeamId().teamId;
        });
        presenter.state.teamsObjects = presenter.state.teamsObjects.filter((team) => {
            return teamId !== team.teamId;
        });
    };

    presenter.addTeam = function Scoreboard_addTeam (teamData, scoreboard) {
        var team = presenter.createTeam(teamData);
        presenter.teamsObjects.push(team);
        presenter.state.teamsObjects.push(team.getTeamData());
        var $teamView = team.getView();
        scoreboard.setBody($teamView);
        return scoreboard;
    };
    
    presenter.removeAllTeams = function Scoreboard_removeAllTeams () {
        presenter.teamsObjects.forEach(function (team) {
            team.destroy();
            team = null;
        });
    };

    presenter.removeScoreboard = function Scoreboard_removeScoreboard () {
        presenter.scoreboard.destroy();
        presenter.scoreboard = null;

    }

    presenter.updateTeamState = function Scoreboard_updateTeamState (updatedTeamData) {
        presenter.state.teamsObjects = presenter.state.teamsObjects.map(teamData =>
            teamData.teamId === updatedTeamData.teamId ? { 
                ...teamData,
                'teamName': updatedTeamData.teamName,
                'teamPoints': updatedTeamData.teamPoints,
            } : teamData
        );
    };

    presenter.restoreAllScoreboardData = function Scoreboard_restoreAllScoreboardData (savedScoreboard) {
        presenter.removeAllTeams();
        presenter.scoreboard.moveScoreboard(savedScoreboard.scoreboard);
        savedScoreboard.teamsObjects.forEach(function (teamData) {
            presenter.addTeam(teamData, presenter.scoreboard);
        });
        presenter.state.isVisible = savedScoreboard.isVisible;
        presenter.setVisibility(presenter.state.isVisible);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.state.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.closeScoreBoard = function () {
        var eventData = {
            'source': presenter.configuration.ID,
            'value': "HideScoreboard",
        };
        var eventBus = presenter.playerController.getEventBus();
        eventBus.sendEvent('ValueChanged', eventData);
        presenter.setVisibility(false);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.executeCommand = function (name) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, [], presenter);
    };

    presenter.setPlayerController = function Scoreboard_setPlayerController (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();

        presenter.eventBus.addEventListener('PageLoaded', this);
    };

    presenter.onEventReceived = function Scoreboard_onEventReceived (eventName, eventData) {
        if (presenter.configuration.isOnePageScoreboard) {
            return;
        }
        if (eventName == "PageLoaded" && eventData.source == presenter.configuration.variableStorageLocationName) {
            var store = null;
            if (presenter.configuration.variableStorageLocation == "header") {
                store = presenter.playerController.getHeaderModule(presenter.configuration.broadcast);
            } else {
                store = presenter.playerController.getFooterModule(presenter.configuration.broadcast);
            }

            if (store == null) {
                return;
            }

            if (store.getVariable("savedScoreboard")) {
                presenter.restoreAllScoreboardData(store.getVariable("savedScoreboard"));
            }
        }
    };

    presenter.getState = function Scoreboard_getState () {
        presenter.state.scoreboard = presenter.scoreboard.getState();
        if (!presenter.configuration.isOnePageScoreboard) {
            var store = null;
            if (presenter.configuration.variableStorageLocation == "header") {
                store = presenter.playerController.getHeaderModule(presenter.configuration.broadcast);
            } else {
                store = presenter.playerController.getFooterModule(presenter.configuration.broadcast);
            }

            if (store == null) {
                return;
            }

            store.setVariable("savedScoreboard", presenter.state);
        } else {
            return JSON.stringify({
                savedScoreboard: presenter.state
            })
        }
    }

    presenter.setState = function Scoreboard_setState (state) {
        if (presenter.configuration.isOnePageScoreboard) {
            var parsedState = JSON.parse(state);
            presenter.restoreAllScoreboardData(parsedState.savedScoreboard);
        }
    }

    presenter.reset = function Scoreboard_reset () {
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.destroy = function Scoreboard_destroy (event) {
        if (event.target !== presenter.view) { return; }

        if(presenter.teamsObjects) {
            presenter.removeAllTeams();
        }
        presenter.playerController = null;
        presenter.removeScoreboard();
        presenter.configuration = null;
        presenter.state = null;
        presenter.playerController = null;
        presenter.eventBus = null;
        presenter.ERROR_CODES = null;
        presenter.$view.unbind();
        presenter.$view = null;
        presenter.view = null;
        presenter.teamsObjects = [];
        presenter.teamsObjects = null;
        presenter.createScoreboard = null;
    };

    return presenter;
}
