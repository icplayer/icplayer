function AddonGap_Binder_create() {

    var presenter = function () { }
    presenter.modulesIDs = [];
    presenter.answers = [];

    presenter.gapsSize = [];
    presenter.gapIndex = 0;
    presenter.correctElementsNumber = 0;
    presenter.maxCorrectElementsNumber = 0;
    presenter.validatedPages = [];

    let usedAnswersIndex = [];
    let gapsIDsWithCorrectAnswer = [];
    let uniqueModulesIDs = [];
    let savedGapsValues = [];

    presenter.ERROR_CODES = {
        INVALID_ID: "Provided module ID is incorrect.",
        INVALID_NUMBER_GAP: "The number of answers provided is incorrect.",
        INVALID_NULL: "Value cannot be null"
    };

    presenter.CSS_CLASSES = {
        INVALID_CONFIGURATION: "invalidInformationAddon",
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.model = model;
        presenter.addonID = model.ID;
        presenter.$view = $(view);
        presenter.setModulesIDs(presenter.model.Items);
        presenter.setAnswers(presenter.model.Items);

        if (isPreview) {
            setTimeout(() => {
                presenter.configuration = presenter.validateModel(model);
                $(view).removeClass(presenter.CSS_CLASSES.INVALID_CONFIGURATION);
                if (presenter.configuration.isError) {
                    DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
                    $(view).addClass(presenter.CSS_CLASSES.INVALID_CONFIGURATION);
                }
            }, 1250);
        } else {
            handleClickActions(view);
        }
    };

    presenter.setModulesIDs = function(items) {
        presenter.modulesIDs.length = 0;

        items.forEach(item => {
            const modulesIDs = item.Module.split(",");
            modulesIDs.forEach(moduleID => {
                moduleID = moduleID.trim();
                presenter.modulesIDs.push(moduleID);
            })
        });
    };

    presenter.setAnswers = function (items) {
        presenter.answers.length = 0;

        items.forEach(item => {
            let answers = item.Answers.split('\n');
            presenter.answers.concat(...answers);
        });
    };

    presenter.getModule = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.currentIndex = controller.getCurrentPageIndex();
    };

    presenter.setEventBus = function(eventBus) {
        presenter.eventBus = eventBus;

        presenter.eventBus.addEventListener('ValueChanged', this);
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
        presenter.eventBus.addEventListener('PageLoaded', this);
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    function findModuleGaps(moduleID, toArray = true) {
        const module = getModule(moduleID);
        const $moduleView = $(module.getView());
        const $foundGaps = findGaps($moduleView);
        if (toArray) {
            return $foundGaps.toArray();
        }
        return $foundGaps;
    }

    function getModule(moduleID) {
        return presenter.playerController.getModule(moduleID);
    }

    function findCurrentPageGaps() {
        const $pageView = $('html');
        return findGaps($pageView);
    }

    function findGaps($view) {
        return $view.find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty');
    }

    presenter.showAnswers = () => {
        presenter.setWorkMode();
        savedGapsValues.length = 0;

        let answerIndex = 0;
        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            const module = getModule(moduleID);

            for (let gapIndex = 0; gapIndex < moduleGaps.length; gapIndex++) {
                const $gap = moduleGaps[gapIndex];
                saveNextGapValue($gap);

                const newValue = presenter.answers[answerIndex];
                $gap.innerHTML = newValue;
                $gap.value = newValue;

                module.disableGap(gapIndex + 1);
                answerIndex++;
            }
        });
    };

    presenter.hideAnswers = () => {
        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            const module = getModule(moduleID);

            for (let gapIndex = 0; gapIndex < moduleGaps.length; gapIndex++) {
                const $gap = moduleGaps[gapIndex];
                loadGapValue($gap, gapIndex);
                module.enableGap(gapIndex + 1);
            }
        });
    };

    function saveNextGapValue($gap) {
        if ($gap.innerHTML != "") {
            savedGapsValues.push($gap.innerHTML)
        } else {
            savedGapsValues.push($gap.value)
        }
    }

    function loadGapValue($gap, gapIndex) {
        const oldValue = `${savedGapsValues[gapIndex]}`;
        $gap.innerHTML = oldValue;
        $gap.value = oldValue;
    }

    presenter.validateModel = function (model) {
        let $pageGaps = findCurrentPageGaps();
        let modulesIDs = getGapsModulesIDs($pageGaps);
        return validateParameters(modulesIDs, model);
    };

    function getGapsModulesIDs($gaps) {
        let modulesIDs = [];

        for (let i = 0; i < $gaps.length; i++) {
            let parent = $gaps[i].closest('.ice_module');
            if (parent == null) {
                parent = $gaps[i].closest('.ic_text');
            }

            if (parent == null) {
                parent = $gaps[i].closest('.addon_Table');
            }

            if (parent != null && $(parent).attr('id').length > 0) {
                modulesIDs.push($(parent).attr('id'));
            }
        }
        return modulesIDs;
    }

    function validateParameters(modulesIDs, model) {
        uniqueModulesIDs = [...new Set(modulesIDs)];

        let someItemEmpty = isSomeItemFieldEmpty(model);
        if (someItemEmpty) {
            return { isError: true, errorCode: 'INVALID_NULL' };
        }

        let validatedId = checkValidetedID(model, uniqueModulesIDs)
        if (!validatedId) {
            return { isError: true, errorCode: 'INVALID_ID' };
        }

        let validatedNumberGaps = checkValidetedNumberGaps(model, uniqueModulesIDs);
        if (!validatedNumberGaps) {
            return { isError: true, errorCode: 'INVALID_NUMBER_GAP' };
        }

        return {
            isError: false,
        }
    }

    function isSomeItemFieldEmpty(model) {
        return model.Items.some(item => {
            return ((!item.Module || item.Module.trim() == "")
                || !item.Answers || item.Answers.trim() == "");
        });
    }

    function checkValidetedID(model, modulesIDs) {
        let countValidateElements = 0;
        for (let i = 0; i < model.Items.length; i++) {
            for (let j = 0; j < modulesIDs.length; j++) {
                for (let k = 0; k < presenter.modulesIDs.length; k++) {
                    if (presenter.modulesIDs[k] == modulesIDs[j]) {
                        countValidateElements++;
                    }
                }
            }
        }
        return countValidateElements == presenter.modulesIDs.length;

    }

    function checkValidetedNumberGaps(model, allIDText) {
        let count = 0;
        for (let i = 0; i < presenter.modulesIDs.length; i++) {
            let $element = $('body').find(`#${allIDText[i]}`);
            let $elementGaps = findGaps($element);
            let elementGaps = $elementGaps.toArray();
            count += elementGaps.length;
        }
        if (count !== presenter.answers.length) { return false };
        return true;
    }

    presenter.setShowErrorsMode = function () {
        presenter.hideAnswers();
        checkGoodAnswer();
        presenter.validatedPages[presenter.currentIndex] = true;

        for (let i = 0; i < presenter.modulesIDs.length; i++) {
            let moduleGaps = findModuleGaps(presenter.modulesIDs[i]);
            for (let j = 0; j < moduleGaps.length; j++) {
                let textModule = presenter.playerController.getModule(presenter.modulesIDs[i]);
                if (moduleGaps[j].innerHTML != "&nbsp;" && moduleGaps[j].innerHTML != "") {
                    textModule.markGapAsWrong(j + 1);
                } else if (moduleGaps[j].innerHTML == "" && moduleGaps[j].value != "") {
                    textModule.markGapAsWrong(j + 1);
                } else {
                    textModule.markGapAsEmpty(j + 1);
                }
                for (let k = 0; k < gapsIDsWithCorrectAnswer.length; k++) {
                    if (moduleGaps[j].id == gapsIDsWithCorrectAnswer[k]) {
                        textModule.markGapAsCorrect(j + 1);
                    }
                }
            }
        }
    };

    presenter.setWorkMode = function () {
        enableAllGapsOfConnectedModules();
    };

    presenter.reset = function () {
        enableAllGapsOfConnectedModules();
    };

    function enableAllGapsOfConnectedModules() {
        presenter.modulesIDs.forEach(moduleID => {
            const module = getModule(moduleID);
            module.enableAllGaps();
        });
    }

    presenter.getErrorCount = function () {
        if (presenter.correctElementsNumber === presenter.maxCorrectElementsNumber) {
            return 0;
        }
        let emptyGapsNumber = getNumberOfEmptyGapsInSupportedModules();
        return presenter.maxCorrectElementsNumber - presenter.correctElementsNumber - emptyGapsNumber;
    };

    function getNumberOfEmptyGapsInSupportedModules() {
        let emptyGapsNumber = 0;
        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            moduleGaps.forEach($gap => {
                if ($gap.value == "" || $gap.innerHTML == "&nbsp;") {
                    emptyGapsNumber++;
                }
            });
        });
        return emptyGapsNumber;
    }

    presenter.getMaxScore = function () {
        return presenter.maxCorrectElementsNumber ? presenter.maxCorrectElementsNumber : 0
    };

    presenter.getScore = function () {
        checkGoodAnswer();
        return presenter.correctElementsNumber;
    };

    function checkGoodAnswer() {
        checkArrayToGoodAnswer();
    }

    function checkArrayToGoodAnswer() {
        if (!presenter.answers || !presenter.modulesIDs) {
            return;
        }

        presenter.maxCorrectElementsNumber = 0;
        presenter.correctElementsNumber = 0;

        usedAnswersIndex.length = 0;
        gapsIDsWithCorrectAnswer.length = 0;

        hideMathJaxElements();
        for (let i = 0; i < presenter.modulesIDs.length; i++) {
            let moduleGaps = findModuleGaps(presenter.modulesIDs[i]);
            if (!moduleGaps) {
                return;
            }
            presenter.maxCorrectElementsNumber += moduleGaps.length;

            for (let moduleGapIndex = 0; moduleGapIndex < moduleGaps.length; moduleGapIndex++) {
                const $gap = moduleGaps[moduleGapIndex];
                const gapInnerHTML = $gap.innerHTML;
                const gapValue = $gap.value;
                for (let answerIndex = 0; answerIndex <= presenter.answers.length; answerIndex++) {
                    if (isAnswerUsed(answerIndex)) {
                        continue;
                    }
                    const gapAnswer = presenter.answers[answerIndex];
                    if (gapInnerHTML == gapAnswer || gapValue == gapAnswer) {
                        presenter.correctElementsNumber++;
                        usedAnswersIndex.push(answerIndex);
                        gapsIDsWithCorrectAnswer.push(moduleGaps[moduleGapIndex].id);
                    }
                }
            }
        }
    }

    function hideMathJaxElements() {
        $('body').find(".MathJax_Preview").each(() => $(this).style.display = "none");
    }

    function isAnswerUsed(answerIndex) {
        return usedAnswersIndex.some(usedIndex => usedIndex === answerIndex);
    }

    presenter.createEventData = function (item, value, score) {
        var eventData = {
            'source': "" + presenter.addonID,
            'item': "" + item,
            'value': "" + value,
            'score': "" + score
        };
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore();
    };

    presenter.isOK = function (id, item) {
        if (presenter.modulesIDs[id]) {
            let moduleGaps = findModuleGaps(presenter.modulesIDs[id]);
            if (moduleGaps) {
                let idElement = moduleGaps[item].id;
                for (let j = 0; j < gapsIDsWithCorrectAnswer.length; j++) {
                    if (gapsIDsWithCorrectAnswer[j] == idElement) {
                        return 1;
                    }
                }
            }
        }
        return 0;
    };

    presenter.isAttempted = function () {
        return presenter.countItems() > 0;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'isAllOK': presenter.isAllOK,
            'isOK': presenter.isOK,
            'isAttempted': presenter.isAttempted

        };
        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.sendAllOKEvent = function () {
        var eventData = {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.countItems = function () {
        let count = 0
        for (let i = 0; i < presenter.modulesIDs.length; i++) {
            let moduleGaps = findModuleGaps(presenter.modulesIDs[i]);
            for (let j = 0; j < moduleGaps.length; j++) {
                if (moduleGaps[j].innerHTML != "&nbsp;" && moduleGaps[j].innerHTML != "") {
                    count++;
                } else if (moduleGaps[j].innerHTML == "" && moduleGaps[j].value != "") {
                    count++;
                }
            }
        }
        return count
    };

    function handleClickActions() {
        let $pageGaps = findCurrentPageGaps();

        let arrayElements = [];
        for (let i = 0; i < $pageGaps.length; i++) {
            arrayElements.push($pageGaps[i]);
        }

        arrayElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault();
            })
        })

        arrayElements.forEach(element => {
            element.addEventListener('touchend', (e) => {
                e.stopPropagation();
                e.preventDefault();
                clickLogic(element);
            })
        })

        arrayElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                clickLogic(element);
            })
        })
    }

    function clickLogic(element) {
        presenter.hideAnswers();

        let $pageGaps = findCurrentPageGaps();

        let arrayElements = []
        for (let i = 0; i < $pageGaps.length; i++) {
            arrayElements.push($pageGaps[i]);
        }

        let item = '';
        let value = '';
        let score = 0;
        for (let i = 0; i < arrayElements.length; i++) {
            if (arrayElements[i].id == element.id) {
                item = i;
            }
        }
        checkArrayToGoodAnswer()
        for (let j = 0; j < gapsIDsWithCorrectAnswer.length; j++) {
            if (gapsIDsWithCorrectAnswer[j] == element.id) {
                score = 1;
            }
        }
        presenter.createEventData(item, value, score);

        if (presenter.isAllOK()) {
            presenter.sendAllOKEvent();
        }
    }

    return presenter;
}