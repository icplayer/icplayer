function AddonGap_Binder_create() {

    var presenter = function () { }

    // addon's parsed configuration data
    presenter.modulesIDs = [];
    presenter.answers = [];

    // addon's modes
    presenter.isErrorMode = false;
    presenter.isShowAnswersActive = false;

    // addon's score variables
    presenter.correctElementsNumber = 0;
    presenter.maxCorrectElementsNumber = 0;
    let usedAnswersIndex = [];
    let gapsIDsWithCorrectAnswer = [];

    presenter.validatedPages = [];
    let savedGapsValues = [];

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
            // handleClickActions();
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
            presenter.answers.push(...answers);
        });
    };

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

    function isSomeItemFieldEmpty(model) {
        return model.Items.some(item => {
            return ((!item.Module || item.Module.trim() == "")
                || !item.Answers || item.Answers.trim() == "");
        });
    }

    function isOneItemInConfiguration(model) {
        return model.Items.length === 1;
    }

    function isEachModuleOnCurrentPage() {
        const $pageGaps = findCurrentPageGaps();
        const pageModulesIDs = getGapsModulesIDs($pageGaps);

        let countValidateElements = 0;
        presenter.modulesIDs.forEach(configurationModuleID => {
            for (let i = 0; i < pageModulesIDs.length; i++) {
                if (configurationModuleID === pageModulesIDs[i]) {
                    countValidateElements++;
                }
            }
        })

        return countValidateElements === presenter.modulesIDs.length;
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

    presenter.getModule = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };

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
            value: gap.value
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

                if (gapsIDsWithCorrectAnswer.includes(gap.id)) {
                    module.markGapAsCorrect(gapIndexInModule);
                } else if (isGapNotEmpty(gap)) {
                    module.markGapAsWrong(gapIndexInModule);
                } else {
                    module.markGapAsEmpty(gapIndexInModule);
                }
            }
        })
    }

    function isGapNotEmpty(gap) {
        return ((gap.innerHTML != "&nbsp;" && gap.innerHTML != "")
            || (gap.innerHTML == "" && gap.value != ""));
    }

    presenter.reset = function () {
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
            moduleGaps.forEach(gap => {
                if (gap.value == "" || gap.innerHTML == "&nbsp;") {
                    emptyGapsNumber++;
                }
            });
        });
        return emptyGapsNumber;
    }

    presenter.getMaxScore = function () {
        checkCorrectnessOfAnswers();
        return presenter.maxCorrectElementsNumber ? presenter.maxCorrectElementsNumber : 0;
    }

    presenter.getScore = function () {
        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }
        checkCorrectnessOfAnswers();
        return presenter.correctElementsNumber;
    };

    function checkCorrectnessOfAnswers() {
        if (!presenter.answers || !presenter.modulesIDs) {
            return;
        }

        presenter.maxCorrectElementsNumber = 0;
        presenter.correctElementsNumber = 0;

        usedAnswersIndex.length = 0;
        gapsIDsWithCorrectAnswer.length = 0;

        hideMathJaxElements();
        presenter.modulesIDs.forEach(moduleID => {
            const moduleGaps = findModuleGaps(moduleID);
            if (!moduleGaps) {
                return;
            }

            presenter.maxCorrectElementsNumber += moduleGaps.length;
            moduleGaps.forEach(gap => {
                const gapInnerHTML = gap.innerHTML;
                const gapValue = gap.value;
                for (let answerIndex = 0; answerIndex < presenter.answers.length; answerIndex++) {
                    if (isAnswerUsed(answerIndex)) {
                        continue;
                    }

                    const correctAnswer = presenter.answers[answerIndex];
                    if (gapInnerHTML == correctAnswer || gapValue == correctAnswer) {
                        presenter.correctElementsNumber++;
                        usedAnswersIndex.push(answerIndex);
                        gapsIDsWithCorrectAnswer.push(gap.id);
                    }
                }
            })
        })
    }

    function hideMathJaxElements() {
        $('body').find(".MathJax_Preview").each(() => $(this).style.display = "none");
    }

    function isAnswerUsed(answerIndex) {
        return usedAnswersIndex.some(usedIndex => usedIndex === answerIndex);
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
        checkCorrectnessOfAnswers();
        if (presenter.modulesIDs[moduleIndex]) {
            const moduleGaps = findModuleGaps(presenter.modulesIDs[moduleIndex]);
            if (moduleGaps) {
                const elementID = moduleGaps[gapIndex].id;
                if (gapsIDsWithCorrectAnswer.includes(elementID)) {
                    return 1;
                }
            }
        }
        return 0;
    };

    presenter.isAttempted = function () {
        if (presenter.isShowAnswersActive) {
            handleHideAnswers();
        }

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

    function sendAllOKEvent () {
        var eventData = {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.countItems = function () {
        let count = 0;
        presenter.modulesIDs.forEach(moduleID => {
            let moduleGaps = findModuleGaps(moduleID);
            moduleGaps.forEach(gap => {
                if (isGapNotEmpty(gap)) {
                    count++;
                }
            });
        });
        return count;
    };

    function handleClickActions() {
        const pageGaps = findCurrentPageGaps().toArray();

        pageGaps.forEach(gap => {
            gap.addEventListener('touchstart', (event) => {
                event.stopPropagation();
                event.preventDefault();
            });
        });

        pageGaps.forEach(gap => {
            gap.addEventListener('touchend', (event) => {
                event.stopPropagation();
                event.preventDefault();
                clickLogic(gap);
            });
        });

        pageGaps.forEach(gap => {
            gap.addEventListener('click', (event) => {
                event.stopPropagation();
                clickLogic(gap);
            });
        });
    }

    function clickLogic(gap) {
        if (!presenter.isShowAnswersActive) {
            checkCorrectnessOfAnswers();

            const pageGaps = findCurrentPageGaps().toArray();

            const elementIndex = pageGaps.indexOf(gap.id);
            const item = elementIndex !== -1 ? elementIndex : '';
            const score = gapsIDsWithCorrectAnswer.includes(gap.id) ? 1 : 0;
            const value = '';

            const eventData = presenter.createEventData(item, value, score);
            presenter.eventBus.sendEvent('ValueChanged', eventData);

            if (presenter.isAllOK()) {
                sendAllOKEvent();
            }
        }
    }

    return presenter;
}
