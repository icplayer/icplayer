function AddonScoreboard_create() {
    var presenter = function() {};

    presenter.DEFAULT_TEAMS_DATA = [
        {
            'teamId': 0,
            'teamName': 'team A',
            'teamPoints': 0,
            'teamColor': '#bd0000',
        },
        {
            'teamId': 1,
            'teamName': 'team B',
            'teamPoints': 0,
            'teamColor': '#6152eb',
        },
        {
            'teamId': 2,
            'teamName': 'team C',
            'teamPoints': 0,
            'teamColor': '#6d1576',
        },
        {
            'teamId': 3,
            'teamName': 'team D',
            'teamPoints': 0,
            'teamColor': '#f7dd00',
        },
        {
            'teamId': 4,
            'teamName': 'team E',
            'teamPoints': 0,
            'teamColor': '#e7723e',
        },
        {
            'teamId': 5,
            'teamName': 'team F',
            'teamPoints': 0,
            'teamColor': '#0e6e23',
        },
        {
            'teamId': 6,
            'teamName': 'team G',
            'teamPoints': 0,
            'teamColor': '#583623',
        },
        {
            'teamId': 7,
            'teamName': 'team H',
            'teamPoints': 0,
            'teamColor': '#c95574',
        },
    ];

    presenter.teamsObjects = [];
    presenter.scoreboard = null;

    presenter.state = {
        isVisible: false,
        teamsObjects: [
            {
                'teamId': 0,
                'teamName': 'team A',
                'teamPoints': 0,
                'teamColor': '#bd0000',
            },
            {
                'teamId': 1,
                'teamName': 'team B',
                'teamPoints': 0,
                'teamColor': '#6152eb',
            },
        ],
        savedScoreboard: null,
    }

    presenter.ERROR_CODES = {
        C01: 'Configuration cannot be empty',
        B01: 'Variable storage ID cannot be empty',
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    function presenterLogic(view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        if (presenter.configuration.isError) {
            return;
        }

        presenter.initView(view, model);
    };

    presenter.validateModel = function (model) {
        if (ModelValidationUtils.isStringEmpty(model['Broadcast'])) {
            return {isError: true, errorCode: 'B01'};
        }
        return {
            isValid: true,
            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            Broadcast: model['Broadcast']
        }
    };

    presenter.initView = function (view, model) {
        presenter.$view = $(view);
        presenter.$pagePanel = presenter.$view.parent().parent('.ic_page_panel');
        presenter.scoreboard = presenter.createScoreBoard();
        var initialTeamsObjects = presenter.state.teamsObjects;
        presenter.state.teamsObjects = [];
        initialTeamsObjects.forEach(function (savedTeam) {
            presenter.scoreboard = presenter.addTeam(savedTeam, presenter.scoreboard);
        });
        var $scoreboardView = presenter.scoreboard.getView();

        presenter.$pagePanel.find('.ic_page').append($scoreboardView);
        presenter.$scoreboard = presenter.$pagePanel.find('.ic_page').find('.scoreboard');

        presenter.setVisibility(presenter.configuration.isVisible);
    }

// Creating scoreboard
    presenter.Scoreboard = function () {
        this.$scoreboard = null;
        this.$scoreboardBody = null;
        this.$scoreboardHeader = null;
        this.$closeButton = null;
        this.$scoreboardFooter = null;
        this.$addNewTeamButton = null;
        this.$resetButton = null;
    };

    presenter.Scoreboard._internals = {};

    presenter.Scoreboard._internals.createView = function () {
        this.$scoreboard = $('<div class="scoreboard"></div>');
        this.$scoreboardBody = $('<div class="scoreboard-body"></div>');
        this.$scoreboardHeader = $('<div class="scoreboard-header"></div>');
        this.$closeButton = $('<div class="scoreboard-close">&times;</div>');
        this.$scoreboardFooter = $('<div class="scoreboard-footer"></div>');
        this.$resetButton = $('<div class="scoreboard-reset">&#8634; RESET</div>');
        this.$addNewTeamButton = $('<div class="scoreboard-add-new-team">DODAJ TEAM &#43;</div>');

        this.$scoreboardHeader.append(this.$closeButton);

        this.$scoreboardFooter.append(this.$resetButton);
        this.$scoreboardFooter.append(this.$addNewTeamButton);
        
        this.$scoreboard.append(this.$scoreboardHeader);
        this.$scoreboard.append(this.$scoreboardBody);
        this.$scoreboard.append(this.$scoreboardFooter);
    };

    presenter.Scoreboard.prototype.init = function (savedScoreboard) {
        presenter.Scoreboard._internals.createView.call(this);

        this.connectHandlers();
        this.connectDraggable(savedScoreboard);
    };

    presenter.Scoreboard.prototype.setBody = function (body) {
        this.$scoreboardBody.append(body);
    };

    presenter.Scoreboard.createScoreboard = function (savedScoreboard) {
        var scoreboard = new presenter.Scoreboard();
        scoreboard.init(savedScoreboard);
        
        return scoreboard;
    };

    presenter.createScoreBoard = function Scoreboard_createNote (savedScoreboard) {
        return presenter.Scoreboard.createScoreboard(savedScoreboard);
    }

    presenter.Scoreboard.prototype.getState = function () {
        return {
            'top': this.$scoreboard.css('top'),
            'left': this.$scoreboard.css('left'),
        };
    };

    presenter.Scoreboard.prototype.getView = function () {
        return this.$scoreboard;
    };

    // Scoreboard buttons
    presenter.Scoreboard.prototype.closeButtonHandler = function (event) {
        presenter.hide();
    };

    presenter.Scoreboard.prototype.resetButtonHandler = function (event) {
        presenter.resetTeamsPoints();
    };

    function getLowestAvaibleTeamId() {
        var freeIds = [];
        var workingIds = []
        presenter.teamsObjects.forEach(function (team) {
            workingIds.push(team.getTeamId().teamId);
        });
        for (var i = 0; i < 8; i++) {
            if (!workingIds.includes(i)) {
                freeIds.push(i);
            }      
        }
        return Math.min(...freeIds);
    }

    presenter.Scoreboard.prototype.addTeamButtonHandler = function (event) {
        if (presenter.state.teamsObjects.length < 8) {
            var availableLowestId = getLowestAvaibleTeamId();
            var defaultTeamData = presenter.DEFAULT_TEAMS_DATA[availableLowestId]
            presenter.addTeam(defaultTeamData, this);
        }
    };

    presenter.Scoreboard.prototype.connectHandlers = function () {
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

    presenter.Scoreboard.prototype.connectDraggable = function (savedScoreboard) {
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

    presenter.Scoreboard.prototype.moveScoreboard = function (savedScoreboardPosition) {
        var ic_page_height = this.$scoreboard.parent().height();
        this.$scoreboard.css({
            'top' : savedScoreboardPosition.top < ic_page_height ? savedScoreboardPosition.top : '10px',
            'left' : savedScoreboardPosition.left,
        });
    };

// Creating Team
    presenter.Team = function (savedTeams) {
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

    presenter.Team._internals.createView = function (savedTeam) {
        this.$team = $('<div class="team"></div>');
        this.$teamHeader = $('<div class="team-header"></div>');
        this.$teamBody = $('<div class="team-body"></div>');
        this.$teamFooter = $('<div class="team-footer"></div>');
        this.$teamRemoveButton = $('<div class="team-remove">&times;</div>');
        this.$teamNameContainer = $(
            `<div class="team-name-container">
                ${this.teamName}
            </div>`
        );
        this.$teamPointsConatiner = $(
            `<div class="team-points-container">
                <h1>${this.teamPoints}</h1>
            </div>`
        );
        this.$teamPointsDecrementButton = $(
        '<div class="team-score-decrement">&#8722;</div>'
        );
        this.$teamPointsIncrementButton = $(
        '<div class="team-score-increment">&#43;</div>'
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

    presenter.Team.prototype.init = function (savedTeam) {
        presenter.Team._internals.createView.call(this, savedTeam);

        this.connectHandlers();
    };

    presenter.Team.createTeam = function (savedTeam) {
        var team = new presenter.Team(savedTeam);
        team.init(savedTeam);
        
        return team;
    };

    // Scoreboard buttons
    presenter.Team.prototype.resetPoints = function () {
        this.teamPoints = 0;
        this.$teamPointsConatiner.html(`<h1>${this.teamPoints}</h1>`)
    };

    presenter.Team.prototype.removeTeamHandler = function (event) {
        var team = event.data.scoreboard;
        team.destroy();
    };

    presenter.Team.prototype.incrementPointsButtonHandler = function (event) {
        this.teamPoints += 1;
        this.$teamPointsConatiner.html(`<h1>${this.teamPoints}</h1>`)
        presenter.updateTeamState(this.getTeamData());
    };

    presenter.Team.prototype.decrementPointsButtonHandler = function (event) {
        this.teamPoints -= 1;
        this.$teamPointsConatiner.html(`<h1>${this.teamPoints}</h1>`)
        presenter.updateTeamState(this.getTeamData());
    };

    presenter.Team.prototype.connectHandlers = function () {
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

    presenter.Team.prototype.connectTeamNameEditHandler = function () {
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

    presenter.Team.prototype.teamNameEditHandler = function () {
        this.$teamNameInput = $('<input class="team-name-input"></input>');
        this.$buttonSave = $('<div class="save">&#10003;</div>');

        this.currentValue = this.teamName;

        if(MobileUtils.isEventSupported('touchstart')) {
            this.$buttonSave.on('touchstart', function() {
                this.saveButtonHandler();
            }.bind(this));
        } else {
            this.$buttonSave.on('click', function() {
                this.saveButtonHandler();
            }.bind(this));
        }

        this.$teamNameInput.val(this.currentValue);

        this.$teamNameContainer.html(this.$teamNameInput);
        this.$teamNameContainer.append(this.$buttonSave);
        this.$teamNameInput.focus();
    };

    presenter.Team.prototype.saveButtonHandler = function () {
        var value = this.$teamNameInput.val();
        this.teamName = value;
        this.$teamNameContainer.html(value);
        this.$teamNameInput.remove();
        this.connectTeamNameEditHandler();
        presenter.updateTeamState(this.getTeamData());
    };

    presenter.Team.prototype.getView = function () {
        return this.$team;
    };

    presenter.Team.prototype.getTeamData = function () {
        return {
            'teamId': this.teamId,
            'teamName': this.teamName,
            'teamPoints': this.teamPoints,
            'teamColor': this.teamColor,
        };
    };

    presenter.Team.prototype.getTeamId = function () {
        return {
            'teamId': this.teamId,
        };
    };

    presenter.Team.prototype.destroy = function () {
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
            team.destroy()
        });
    };

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
        presenter.scoreboard.moveScoreboard(savedScoreboard.scoreboard);
        savedScoreboard.teamsObjects.forEach(function (teamData) {
            presenter.addTeam(teamData, presenter.scoreboard);
        });
        presenter.state.isVisible = savedScoreboard.isVisible;
        presenter.setVisibility(presenter.state.isVisible);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.state.isVisible = isVisible;
        presenter.$scoreboard.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.executeCommand = function (name) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, [], presenter);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();

        presenter.eventBus.addEventListener('PageLoaded', this);
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "PageLoaded" && eventData.source == "header") {
            var store = player.getPlayerServices().getHeaderModule("Variable_Storage1");
            if (store.getVariable("savedScoreboard")) {
                presenter.removeAllTeams();
                presenter.restoreAllScoreboardData(store.getVariable("savedScoreboard"));
            }
        }
    };

    presenter.getState = function () {
        var store = player.getPlayerServices().getHeaderModule("Variable_Storage1");
        presenter.state.scoreboard = presenter.scoreboard.getState();
        store.setVariable("savedScoreboard", presenter.state);
    }

    return presenter;
}
