function AddonPoints_To_Plot_create() {

    var presenter = function() {
    };
    var eventBus; // Modules communication
    var addonID;
    presenter.data = {
        pointsOnPlot: [],
        selectedPoints: []
    };
    var isShowAnswersActive = false;
    presenter.STATE_CORRECT = 1;
    presenter.STATE_INCORRECT = 0;
    presenter.VERSION = '1.0.2';
    presenter.run = function(view, model) {
        presenter.view = view;
        presenter.model = presenter.upgradeModel(model);

        eventBus = presenter.playerController.getEventBus();
        addonID = model.ID;

        presenter._allDoneState = false;
        presenter.initialize(presenter.model);
        presenter.setEventListeners();
    };

    presenter.upgradeModel = function(model) {
        return presenter.upgradeShowAnswers(model);
    }

    presenter.upgradeShowAnswers = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel['Show answers'] === undefined) {
            upgradedModel['Show answers'] = '';
        }

        return upgradedModel;
    };

    presenter.initialize = function(model) {
        this.source = model['Source'];
        this.decimalSeparator = (model['Decimal separator'] === undefined || model['Decimal separator'] == '') ? '.' : model['Decimal separator'];
        if(presenter.decimalSeparator != '.' && presenter.decimalSeparator != ',') {
            presenter.decimalSeparator = '.';
        };
        $.each(model['Points to plot'], function(idx, val) {
            if(val !== undefined) {
                el = {
                    plotId: val['plot id'],
                    pointsToSelect: parseInt(val['points']),
                    strictPoints: val['strict points'] !== '' ? presenter.parseStrictPoints(val['strict points']) : [],
                    collectedPoints: []
                };
                presenter.data.pointsOnPlot.push(el);
            }
        });
        this.data.selectedPoints = [];
        var rawShowAnswers = model['Show answers'].trim();
        presenter.showAnswersPoints = rawShowAnswers.length > 0 ? presenter.parseStrictPoints(rawShowAnswers) : [];
    };

    presenter.setEventListeners = function() {
        if (eventBus == null) return;
        const events = ["ShowAnswers", "HideAnswers", "GradualShowAnswers", "GradualHideAnswers"];
        events.forEach((eventName) => {
            eventBus.addEventListener(eventName, this);
        });
    }

    presenter.onEventReceived = function (eventName, eventData) {
         switch (eventName) {
            case "ShowAnswers":
                presenter.showAnswers();
                break;
            case "HideAnswers":
                presenter.hideAnswers();
                break;
            case "GradualShowAnswers":
                if (eventData.moduleID === addonID) {
                    presenter.gradualShowAnswers(parseInt(eventData.item, 10));
                }
                break;
            case "GradualHideAnswers":
                presenter.hideAnswers();
                break;
        }
    };

    presenter.parseStrictPoints = function(str) {
        var pairs;
        if(this.decimalSeparator == ',') {
            pairs = str.match(/((-?[0-9]+(,?[0-9]+)?){1};{1}(-?[0-9]+(,?[0-9]+)?){1})/g);
        } else {
            pairs = str.match(/((-?[0-9]+(\.?[0-9]+)?){1},{1}(-?[0-9]+(\.?[0-9]+)?){1})/g);
        }
        var points = [];
        $.each(pairs, function(idx, val) {
            var tmp = val.split(presenter.getSeparatorByDecimalSeparator());
            points.push({x: presenter.toDotSeparator(tmp[0]), y: presenter.toDotSeparator(tmp[1])});
        });

        return points;
    };

    presenter.setShowErrorsMode = function() {
        if (isShowAnswersActive) presenter.hideAnswers();
        var sourceModule = this.getSourceModule();
        sourceModule.enableUI(false);
        //check every point
        $.each(this.data.selectedPoints, function(idx, val){
            //if point belongs to any plot mark as correct
            if(val.belongsTo.length > 0) {
                sourceModule.markPointAsCorrect(val.x, val.y);
            } else {
                sourceModule.markPointAsError(val.x, val.y);
            }
        });
    };

    presenter.setWorkMode = function() {
        var sourceModule = this.getSourceModule();
        sourceModule.removePointsStateMarks();
        sourceModule.enableUI(true);
    };

    presenter.showAnswers = function() {
        isShowAnswersActive = true;
        var sourceModule = this.getSourceModule();
        if (sourceModule == null) return;

        sourceModule.setPtpShowAnswersPoints(presenter.showAnswersPoints);
        if (presenter.showAnswersPoints.length > 0) {
            sourceModule.ptpShowAnswers(presenter.showAnswersPoints.length - 1);
        }
    }

    presenter.hideAnswers = function() {
        if (!isShowAnswersActive) return;
        isShowAnswersActive = false;
        var sourceModule = this.getSourceModule();
        if (sourceModule == null) return;
        sourceModule.ptpHideAnswers();
    }

    presenter.getActivitiesCount = function() {
        return presenter.showAnswersPoints.length;
    }

    presenter.gradualShowAnswers = function(item) {
        isShowAnswersActive = true;
        var sourceModule = this.getSourceModule();
        if (sourceModule == null) return;

        sourceModule.setPtpShowAnswersPoints(presenter.showAnswersPoints);
        sourceModule.ptpShowAnswers(item);
    }

    presenter.reset = function() {
        this._allDoneState = false;
        this.data.selectedPoints = [];
        $.each(this.data.pointsOnPlot, function(idx, val) {
            val.collectedPoints = [];
        });
    };
    presenter.getErrorCount = function() {
        var errors = 0;
        $.each(this.data.selectedPoints, function(idx, val){
            //point belongs to any plot
            if(val.belongsTo.length === 0) {
                errors++;
            }
        });
        return errors;
    };

    presenter.getMaxScore = function() {
        var todo = 0;
        $.each(this.data.pointsOnPlot, function(idx, val) {
            todo += val.pointsToSelect;
        });
        return todo;
    };

    presenter.getScore = function() {
        var done = 0;
        $.each(this.data.pointsOnPlot, function(idx, val) {
            done += val.collectedPoints.length <= val.pointsToSelect ? val.collectedPoints.length : val.pointsToSelect;
        });
        return done;
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.getState = function() {
        var state = JSON.stringify({
            version: 1,
            points: presenter.data.selectedPoints,
            plots: presenter.data.pointsOnPlot
            });
        return state;
    };

    presenter.setState = function(state) {
        if(state !== '' && state !== undefined) {
            state = JSON.parse(state);
            presenter.data.selectedPoints = state.points;
            presenter.data.pointsOnPlot = state.plots;
        }
    };

    presenter.executeCommand = function(name, params) {
    };

    presenter.createPreview = function(view, model) {
        presenter.view = view;
        presenter.model = presenter.upgradeModel(model);
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    presenter.onEvent = function(evt, data) {
        switch(evt) {
            case "ValueChanged":
                if(data.item.match(/point_/)) {
                    this.processPointEvent(data);
                }
                break;
        }
    };

    presenter.processPointEvent = function(data) {
        var els = data.item.split('_');
        var x = this.toDotSeparator(els[1]);
        var y = this.toDotSeparator(els[2]);
        var state = data.value == 1 ? true : false;
        if(state) {
            presenter.selectPoint(x,y);
        } else {
            presenter.deselectPoint(x,y);
        }
    };

    presenter.selectPoint = function(x, y) {
        var hasPoint = false;
        $.each(this.data.selectedPoints, function(k, v) {
            if (v.x == x && v.y == y) {
                hasPoint = true;
                return false;
            }
        });
        if (!hasPoint) {
            var el = {
                x: x,
                y: y,
                belongsTo: presenter.getPointOnPlots(x, y)
            };
            this.data.selectedPoints.push(el);
            this.updatePlotCollectedPoints();
            this.updatePlotsState();
            presenter.stateChanged({
                item: 'point_' + x + '_' + y,
                value: 1,
                score: el.belongsTo.length > 0 ? presenter.STATE_CORRECT : presenter.STATE_INCORRECT
            });
        }
    };

    presenter.deselectPoint = function(x, y) {
        $.each(this.data.selectedPoints, function(k, v) {
            if (v.x == x && v.y == y) {
                presenter.data.selectedPoints.splice(k, 1);
                presenter.updatePlotCollectedPoints();
                presenter.updatePlotsState();
                return false;
            }
        });
        presenter.stateChanged({
            item: 'point_' + x + '_' + y,
            value: 0,
            score: presenter.STATE_INCORRECT
        });
    };
    /**
     * Checks if point belongs to any plot
     *
     * @param float x - point's x
     * @param float y - point's y
     * @returns Array - list of plots where point belongs to
     */
    presenter.getPointOnPlots = function(x, y) {
        var sourceModule = this.getSourceModule();
        var belongsTo = [];
        $.each(this.data.pointsOnPlot, function(idx, val) {
            // any point
            if (val.strictPoints.length === 0) {
                // check if point belongs to plot
                var res = sourceModule.getPlot().isPointOnPlot(val.plotId, x, y);
                if (res) {
                    belongsTo.push(val.plotId);
                }
            } else {
                // check if point is one of strict points
                $.each(val.strictPoints, function(spIdx, spVal) {
                    if (spVal.x == x && spVal.y == y) {
                        belongsTo.push(val.plotId);
                        return false;
                    }
                });
            }
        });

        return belongsTo;
    };
    /**
     * Update plot's list of correct points
     *
     * @returns void
     */
    presenter.updatePlotCollectedPoints = function() {
        //remove all collected points for each plot
        $.each(this.data.pointsOnPlot, function(idx, val) {
            val.collectedPoints = [];
        });
        //set new collected points
        $.each(this.data.selectedPoints, function(pidx, pval) {
            $.each(pval.belongsTo, function(btIdx, btVal) {
                presenter.addCollectedPoint(btVal, pval.x, pval.y);
            });
        });
    };
    /**
     * Adds point to plot's collected points
     *
     * @param string plotId - id of plot
     * @param float x - point's x
     * @param float y - point's y
     * @returns void
     */
    presenter.addCollectedPoint = function(plotId, x, y) {
        $.each(this.data.pointsOnPlot, function(idx, val) {
           if(val.plotId == plotId) {
               val.collectedPoints.push({x: x, y: y});
               return false;
           }
        });
    };
    presenter.updatePlotsState = function() {
        $.each(this.data.pointsOnPlot, function(idx, val) {
            res = val.collectedPoints.length < val.pointsToSelect ? false : true;
            presenter.stateChanged({
                item: 'plot_' + val.plotId,
                value: '',
                score: res ? presenter.STATE_CORRECT : presenter.STATE_INCORRECT
            });
        });
    };
    presenter.getSourceModule = function() {
        return this.playerController.getModule(this.source);
    };
    presenter.stateChanged = function(data) {
        if(data) {
            //chained events when data is array
            if(!(data instanceof Array)) {
                //become chain with single event
                data = [data];
            }

            //call chained events
            for(var t=0;t<data.length;t++) {
                data[t].source = addonID;
                data[t].item = data[t].item.toString();
                if(data[t].item.substring(0,6) == 'point_') {
                    data[t].item = presenter.convertValueToDisplay(data[t].item);
                }
                data[t].value = data[t].value.toString();
                data[t].score = data[t].score === null ? null : data[t].score.toString();
                eventBus.sendEvent('ValueChanged', data[t]);
            }
        }

        if (presenter.isAllOK()) {
            if (!presenter._allDoneState) {
                presenter._allDoneState = true;
                presenter.sendAllOKEvent();
            }
        } else {
            presenter._allDoneState = false;
        }
    };
    presenter.sendAllOKEvent = function() {
        var eventData = {
            'source': addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    };
    presenter.toDotSeparator = function(value) {
        return (value + '').replace(this.decimalSeparator, '.');
    };
    presenter.getSeparatorByDecimalSeparator = function() {
        return this.decimalSeparator == '.' ? ',' : ';';
    };
    presenter.convertValueToDisplay = function(value) {
        return (value + '').replace(new RegExp('\\.', 'g'), presenter.decimalSeparator);
    };
    presenter.getDecimalSeparator = function() {
        return presenter.decimalSeparator;
    };

    return presenter;
}