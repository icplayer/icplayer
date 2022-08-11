function AddonGap_Binder_create() {

    var presenter = function () { }

    // addon's parsed configuration data
    presenter.modulesIDs = [];
    presenter.answers = [];

    // addon's modes
    presenter.isErrorMode = false;
    presenter.isShowAnswersActive = false;

    const SUPPORTED_MODULES_TYPES = ["Text", "table"];

    let scoreData = {
        correctElementsNumber: 0,
        maxCorrectElementsNumber: 0,
        usedAnswersIndex: [],
        gapsIDsWithCorrectAnswer: [],
    }
    let savedGapsValues = [];

    presenter.validatedPages = [];

    presenter.ERROR_CODES = {
        INVALID_ID: "Provided module ID is incorrect.",
        INVALID_NUMBER_GAP: "The number of answers provided is incorrect.",
        INVALID_NUMBER_ITEMS: "Addon supports only one item in the configuration.",
        INVALID_NULL: "Value cannot be null."
    };

    presenter.CSS_CLASSES = {
        INVALID_CONFIGURATION: "gap_binder_invalid",
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);

        setTimeout(() => {
            presenter.configuration = presenter.validateModel(model);
            $(view).removeClass(presenter.CSS_CLASSES.INVALID_CONFIGURATION);
            if (presenter.configuration.isError) {
                DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
                $(view).addClass(presenter.CSS_CLASSES.INVALID_CONFIGURATION);
            }
        }, 1250);
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);

        presenter.view.addEventListener("DOMNodeRemoved", presenter.destroy);
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.addonID = model.ID;
        presenter.view = view;
        presenter.$view = $(view);
        presenter.readModelItems(model.Items);
    };

    presenter.readModelItems = function (items) {
        setModulesIDs(items);
        setAnswers(items);
    };

    function setModulesIDs(items) {
        presenter.modulesIDs.length = 0;
        let newModules = [];

        items.forEach(item => {
            const modulesIDs = item.Modules.split(",");
            modulesIDs.forEach(moduleID => {
                moduleID = moduleID.trim();
                newModules.push(moduleID);
            })
        });

        presenter.modulesIDs = [...new Set(newModules)];
    }

    function setAnswers(items) {
        presenter.answers.length = 0;

        items.forEach(item => {
            let answers = item.Answers.split('\n');
            presenter.answers.push(...answers);
        });
    }

    presenter.validateModel = function (model) {
        const oneItemInConfiguration = isOneItemInConfiguration(model);
        if (!oneItemInConfiguration) {
            return { isError: true, errorCode: 'INVALID_NUMBER_ITEMS' };
        }

        const someItemEmpty = isSomeItemFieldEmpty(model);
        if (someItemEmpty) {
            return { isError: true, errorCode: 'INVALID_NULL' };
        }

        const eachModuleOnCurrentPage = isEachModuleOnCurrentPage()
        if (!eachModuleOnCurrentPage) {
            return { isError: true, errorCode: 'INVALID_ID' };
        }

        const numberOfProvidedAnswersCorrect = isNumberOfProvidedAnswersCorrect();
        if (!numberOfProvidedAnswersCorrect) {
            return { isError: true, errorCode: 'INVALID_NUMBER_GAP' };
        }

        return {
            isError: false,
        }
    };

    function isOneItemInConfiguration(model) {
        return model.Items.length === 1;
    }

    function isSomeItemFieldEmpty(model) {
        return model.Items.some(item => {
            return ((!item.Modules || item.Modules.trim() == "")
                || !item.Answers || item.Answers.trim() == "");
        });
    }

    function isEachModuleOnCurrentPage() {
        const $pageGaps = findCurrentPageGaps();
        const pageModulesIDs = getGapsModulesIDs($pageGaps);

        let foundModulesNumber = 0;
        presenter.modulesIDs.forEach(configurationModuleID => {
            if (pageModulesIDs.includes(configurationModuleID)) {
                foundModulesNumber++;
            }
        });

        return foundModulesNumber === presenter.modulesIDs.length;
    }

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
        return [...new Set(modulesIDs)];
    }

    function isNumberOfProvidedAnswersCorrect() {
        let count = 0;
        presenter.modulesIDs.forEach(moduleID => {
            const $element = $('body').find(`#${moduleID}`);
            const $elementGaps = findGaps($element);
            const elementGaps = $elementGaps.toArray();
            count += elementGaps.length;
        });

        return count === presenter.answers.length;
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.currentPageIndex = controller.getCurrentPageIndex();
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

        if (eventName == "ValueChanged" && !presenter.isShowAnswersActive) {
            handleValueChangedEvent(eventData);
        }
    };

    presenter.showAnswers = () => {
        if (presenter.isShowAnswersActive) {
            return;
        }

        if (presenter.isErrorMode) {
            handleWorkMode();
        }

        handleShowAnswers();
    };

    function handleShowAnswers() {
        presenter.isShowAnswersActive = true;

        savedGapsValues.length = 0;
        let answerIndex = 0;
        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            const module = getModule(moduleID);

            for (let gapIndex = 0; gapIndex < moduleGaps.length; gapIndex++) {
                const gap = moduleGaps[gapIndex];
                saveNextGapValue(gap);
                loadCorrectAnswer(gap, answerIndex);
                answerIndex++;

                module.disableGap(gapIndex + 1);
            }
        });
    }

    presenter.hideAnswers = () => {
        if (!presenter.isShowAnswersActive) {
            return;
        }

        if (presenter.isErrorMode) {
            handleWorkMode();
        }

        handleHideAnswers();
    };

    function handleHideAnswers() {
        presenter.isShowAnswersActive = false;

        let answerIndex = 0;
        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            const module = getModule(moduleID);

            for (let gapIndex = 0; gapIndex < moduleGaps.length; gapIndex++) {
                const gap = moduleGaps[gapIndex];
                loadSavedGapValue(gap, answerIndex);
                answerIndex++;

                module.enableGap(gapIndex + 1);
            }
        });
    }

    function saveNextGapValue(gap) {
        const valueToSave = {
            innerHTML: gap.innerHTML,
            value: gap.value,
            id: gap.id,
        };
        savedGapsValues.push(valueToSave);
    }

    function loadCorrectAnswer(gap, index) {
        const answer = presenter.answers[index];
        gap.innerHTML = answer;
        gap.value = answer;
    }

    function loadSavedGapValue(gap, index) {
        const valueToLoad = savedGapsValues[index];
        gap.innerHTML = valueToLoad.innerHTML;
        gap.value = valueToLoad.value;
    }

    presenter.setShowErrorsMode = function () {
        if (presenter.isErrorMode) {
            return;
        }

        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }

        handleShowErrorsMode();
    };

    function handleShowErrorsMode() {
        presenter.isErrorMode = true;

        checkCorrectnessOfAnswers();

        presenter.validatedPages[presenter.currentPageIndex] = true;

        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            const module = getModule(moduleID);

            for (let gapIndex = 0; gapIndex < moduleGaps.length; gapIndex++) {
                const gapIndexInModule = gapIndex + 1;
                const gap = moduleGaps[gapIndex];

                if (isCorrectAnswerInGap(gap.id)) {
                    module.markGapAsCorrect(gapIndexInModule);
                } else if (!isGapEmpty(gap)) {
                    module.markGapAsWrong(gapIndexInModule);
                } else {
                    module.markGapAsEmpty(gapIndexInModule);
                }
            }
        })
    }

    function isGapEmpty(gap) {
        return ((!gap.innerHTML && !gap.value)
            || (gap.innerHTML === "&nbsp;" && !gap.value)
            || (gap.innerHTML === "" && !gap.value)
        );
    }

    presenter.reset = function () {
        resetScoreData();
        presenter.hideAnswers();
        presenter.setWorkMode();
    };

    presenter.setWorkMode = function () {
        if (!presenter.isErrorMode) {
            return;
        }

        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }

        handleWorkMode();
    };

    function handleWorkMode() {
        presenter.isErrorMode = false;
        enableAllGapsOfConnectedModules();
    }

    function enableAllGapsOfConnectedModules() {
        presenter.modulesIDs.forEach(moduleID => {
            const module = getModule(moduleID);
            module.enableAllGaps();
        });
    }

    presenter.getErrorCount = function () {
        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }

        checkCorrectnessOfAnswers();
        if (scoreData.correctElementsNumber === scoreData.maxCorrectElementsNumber) {
            return 0;
        }
        const emptyGapsNumber = countEmptyItems();
        return scoreData.maxCorrectElementsNumber - scoreData.correctElementsNumber - emptyGapsNumber;
    };

    presenter.getMaxScore = function () {
        if (!presenter.playerController) {
            return presenter.answers.length;
        }
        checkCorrectnessOfAnswers();
        return scoreData.maxCorrectElementsNumber;
    }

    presenter.getScore = function () {
        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }
        checkCorrectnessOfAnswers();
        return scoreData.correctElementsNumber;
    };

    function checkCorrectnessOfAnswers() {
        if (!presenter.answers || !presenter.modulesIDs) {
            return;
        }

        resetScoreData();

        hideMathJaxElements();
        presenter.modulesIDs.forEach(checkCorrectnessOfAnswersInModule);
    }

    function checkCorrectnessOfAnswersInModule(moduleID) {
        const moduleGaps = findModuleGaps(moduleID);
        if (!moduleGaps) {
            return;
        }

        scoreData.maxCorrectElementsNumber += moduleGaps.length;
        moduleGaps.forEach(gap => {
            for (let answerIndex = 0; answerIndex < presenter.answers.length; answerIndex++) {
                if (isAnswerUsed(answerIndex)) {
                    continue;
                }

                const correctAnswer = presenter.answers[answerIndex];
                if (gap.innerHTML == correctAnswer || gap.value == correctAnswer) {
                    scoreData.correctElementsNumber++;
                    scoreData.usedAnswersIndex.push(answerIndex);
                    scoreData.gapsIDsWithCorrectAnswer.push(gap.id);
                }
            }
        });
    }

    function resetScoreData() {
        scoreData.maxCorrectElementsNumber = 0;
        scoreData.correctElementsNumber = 0;
        scoreData.usedAnswersIndex.length = 0;
        scoreData.gapsIDsWithCorrectAnswer.length = 0;
    }

    function hideMathJaxElements() {
        $('body').find(".MathJax_Preview").each(() => $(this).style.display = "none");
    }

    function isAnswerUsed(answerIndex) {
        return scoreData.usedAnswersIndex.includes(answerIndex);
    }

    function isCorrectAnswerInGap(gapID) {
        return scoreData.gapsIDsWithCorrectAnswer.includes(gapID);
    }

    presenter.createEventData = function (item, value, score) {
        return {
            'source': "" + presenter.addonID,
            'item': "" + item,
            'value': "" + value,
            'score': "" + score
        };
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore();
    };

    presenter.isOK = function (moduleIndex, gapIndex) {
        const trueModuleIndex = moduleIndex - 1;
        const trueGapIndex = gapIndex - 1;

        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }
        checkCorrectnessOfAnswers();
        if (presenter.modulesIDs[trueModuleIndex]) {
            const moduleGaps = findModuleGaps(presenter.modulesIDs[trueModuleIndex]);
            if (moduleGaps) {
                const elementID = moduleGaps[trueGapIndex].id;
                if (isCorrectAnswerInGap(elementID)) {
                    return true;
                }
            }
        }
        return false;
    };

    presenter.isAttempted = function () {
        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }

        return countFilledInItems() > 0;
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
        const eventData = presenter.createEventData("all", "", "");
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    function countEmptyItems() {
        return countItems(true);
    }

    function countFilledInItems() {
        return countItems(false);
    }

    function countItems(forEmptyGaps) {
        let count = 0;
        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            moduleGaps.forEach(gap => {
                const gapEmpty = isGapEmpty(gap);
                if ((forEmptyGaps && gapEmpty) || (!forEmptyGaps && !gapEmpty)) {
                    count++;
                }
            });
        });
        return count;
    }

    function handleValueChangedEvent (eventData) {
        const moduleType = eventData.moduleType;
        if (moduleType && SUPPORTED_MODULES_TYPES.includes(moduleType)) {
            checkCorrectnessOfAnswers();

            const gapData = findGapThatSentValueChangedEvent(eventData);
            if (!gapData.gap || gapData.relativeIndex === -1) {
                return;
            }

            const item = gapData.relativeIndex !== -1 ? gapData.relativeIndex : '';
            const score = isCorrectAnswerInGap(gapData.gap.id) ? 1 : 0;
            const value = eventData.value ? eventData.value : '';

            const newEventData = presenter.createEventData(item, value, score);
            presenter.eventBus.sendEvent('ValueChanged', newEventData);

            if (presenter.isAllOK()) {
                presenter.sendAllOKEvent();
            }
        }
    }

    function findGapThatSentValueChangedEvent(eventData) {
        const notFoundResponse = {
            gap: undefined,
            relativeIndex: -1,
        }

        if (eventData.source === undefined || eventData.item === undefined) {
            return notFoundResponse;
        }

        const moduleIndex = presenter.modulesIDs.findIndex(moduleID => moduleID === eventData.source);
        if (moduleIndex === -1) {
            return notFoundResponse;
        }

        const foundGaps = findModuleGaps(eventData.source);
        const itemIndex = parseInt(eventData.item, 10) - 1;
        if (itemIndex < 0 || itemIndex >= foundGaps.length) {
            return notFoundResponse;
        }

        let relativeIndex = 1;
        for (let i = 0, moduleGaps; i < moduleIndex; i++) {
            moduleGaps = findModuleGaps(presenter.modulesIDs[i]);
            relativeIndex += moduleGaps.length;
        }
        relativeIndex += itemIndex;

        return {
            gap: foundGaps[itemIndex],
            relativeIndex,
        };
    }

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

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }

        presenter.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
        presenter.hideAnswers();
        presenter.setWorkMode();
    };

    presenter.getState = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
    };

    return presenter;
}
