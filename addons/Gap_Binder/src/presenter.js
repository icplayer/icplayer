function AddonGap_Binder_create() {

    var presenter = function () { }
    presenter.gapsSize = [];
    presenter.gapIndex = 0;
    presenter.initialMarks = 0;
    presenter.arrayModule = [];
    presenter.arrayAnswers = [];
    presenter.validatedPages = new Array();
    let arrayCount = [];
    let arrayIDCorrectAnswer = [];
    let allIDText = [];
    let copyOldValue = [];
    presenter.CorrectElements = 0;

    presenter.ERROR_CODES = {
        INVALID_ID: "Provided module ID is incorrect.",
        INVALID_NUMBER_GAP: "The number of answers provided is incorrect.",
        INVALID_NULL: "Value cannot be null"
    };

    presenter.createPreview = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addAllModules(presenter.model.Items);
        presenter.addAllGoodAnswer(presenter.model.Items);
        setTimeout(() => {
            presenter.configuration = presenter.validateModel(model);
            $(view).removeClass("invalidInformationAddon")
            if (presenter.configuration.isError) {
                DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
                $(view).addClass("invalidInformationAddon")
            }
        }, 1250)
    };
    presenter.run = function (view, model) {
        presenter.model = model;
        presenter.addonID = model.ID;
        presenter.$view = $(view);
        presenter.addAllModules(presenter.model.Items);
        presenter.addAllGoodAnswer(presenter.model.Items);
        handleClickActions(view);
    }

    presenter.addAllModules = function(Items) {
        presenter.arrayModule.length = 0;
        for (let i = 0; i < Items.length; i++) {

            const myArray = Items[i].Module.split(",");
            myArray.forEach(el => {
                el = el.trim();
                presenter.arrayModule.push(el);
            })
        }
    }

    presenter.addAllGoodAnswer = function (Items) {
        presenter.arrayAnswers.length = 0;

        for (let i = 0; i < Items.length; i++) {
            let answers = Items[i].Answers.split('\n');
            presenter.arrayAnswers.push(answers);

        }
    }

    presenter.getModule = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };


    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.currentIndex = controller.getCurrentPageIndex();

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
    presenter.showAnswers = () => {
        presenter.setWorkMode();
        let numberAnswer = 0;
        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView()).find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')

            let children = checkRealChildren(element);

            for (let j = 0; j < children.length; j++) {
                if (children[j].innerHTML != "") {
                    copyOldValue.push(children[j].innerHTML)
                } else {
                    copyOldValue.push(children[j].value)
                }
                children[j].innerHTML = presenter.arrayAnswers[0][numberAnswer];
                children[j].value = presenter.arrayAnswers[0][numberAnswer];
                numberAnswer++;
                let textModule = presenter.playerController.getModule(presenter.arrayModule[i]);
                textModule.disableGap(j + 1);

            }
        }


    }
    presenter.hideAnswers = () => {
        let numberAnswer = 0;
        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView())
                .find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty');
            let children = checkRealChildren(element);
            for (let j = 0; j < children.length; j++) {
                if (copyOldValue[numberAnswer] || copyOldValue[numberAnswer] == "") {
                    children[j].innerHTML = `${copyOldValue[numberAnswer]}`;
                    children[j].value = `${copyOldValue[numberAnswer]}`;
                    numberAnswer++;
                }
                let textModule = presenter.playerController.getModule(presenter.arrayModule[i]);
                textModule.enableGap(j + 1);
            }
        }
        copyOldValue.length = 0;

    }

    function gapParent(gaps) {
        let allID = [];

        for (let i = 0; i < gaps.length; i++) {
            let inputID = gaps[i].id;
            let parent = gaps[i].closest('.ice_module');
            if (parent == null) {
                parent = gaps[i].closest('.ic_text');
            }
            if (parent == null) {
                parent = gaps[i].closest('.addon_Table');
            }
            if (parent != null && $(parent).attr('id').length > 0) {
                allID.push($(parent).attr('id'));
            }

        }
        return allID;
    }

    presenter.validateModel = function (model) {
        let gaps = $('html').find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')
        let allID = [];
        let presenterValidation;
        allID = gapParent(gaps);
        presenterValidation = validateParameters(allID, model);
        return presenterValidation;
    }

    function validateParameters(allID, model) {
        allIDText = allID.filter(function (item, pos) {
            return allID.indexOf(item) == pos;
        });
        let validatedNull = checkValidetedNull(model);
        if (!validatedNull) {
            return { isError: true, errorCode: 'INVALID_NULL' };
        }
        let validatedId = checkValidetedID(model, allIDText)
        if (!validatedId) {
            return { isError: true, errorCode: 'INVALID_ID' };
        }
        let validatedNumberGaps = checkValidetedNumberGaps(model, allIDText);
        if (!validatedNumberGaps) {
            return { isError: true, errorCode: 'INVALID_NUMBER_GAP' };
        }
         return {
            isError: false
        }
    }

    function checkValidetedID(model, allIDText) {
        let countValidateElements = 0;
        for (let i = 0; i < model.Items.length; i++) {
            for (let j = 0; j < allIDText.length; j++) {
                for (let k = 0; k < presenter.arrayModule.length; k++) {
                    if (presenter.arrayModule[k] == allIDText[j]) {
                        countValidateElements++;
                    }
                }
            }
        }
        return countValidateElements == presenter.arrayModule.length;

    }

    function checkValidetedNumberGaps(model, allIDText) {
        let count = 0;
        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $('body').find(`#${allIDText[i]}`).find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty');
            let children = checkRealChildren(element);
            count += children.length;
        }
        let arr = [];
        presenter.arrayAnswers.forEach(el => el.forEach(podEl => arr.push(podEl)));
        if (count !== arr.length) { return false };
        return true;
    }

    function checkValidetedNull(model) {
        for (let i = 0; i < model.Items.length; i++) {
            if (!model.Items[i].Module || model.Items[i].Module.trim() == "") {
                return false;
            }
            if (!model.Items[i].Answers || model.Items[i].Answers.trim() == "") {
                return false;
            }
        }
        return true;
    }


    presenter.setShowErrorsMode = function () {
        presenter.hideAnswers();
        checkGoodAnswer();
        presenter.validatedPages[presenter.currentIndex] = true;

        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView()).find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty');
            let children = checkRealChildren(element);
            for (let j = 0; j < children.length; j++) {
                let textModule = presenter.playerController.getModule(presenter.arrayModule[i]);
                if (children[j].innerHTML != "&nbsp;" && children[j].innerHTML != "") {
                    textModule.markGapAsWrong(j + 1);
                } else if (children[j].innerHTML == "" && children[j].value != "") {
                    textModule.markGapAsWrong(j + 1);
                } else {
                    textModule.markGapAsEmpty(j + 1);
                }
                for (let k = 0; k < arrayIDCorrectAnswer.length; k++) {
                    if (children[j].id == arrayIDCorrectAnswer[k]) {
                        textModule.markGapAsCorrect(j + 1);
                    }
                }
            }
        }
    }


    presenter.setWorkMode = function () {
        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView()).find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')
            let textModule = presenter.playerController.getModule(presenter.arrayModule[i]);
            textModule.enableAllGaps();
        }
    }

    presenter.reset = function () {
        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView()).find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')
            let children = checkRealChildren(element);
            let textModule = presenter.playerController.getModule(presenter.arrayModule[i]);
            textModule.enableAllGaps();
        }
    }

    presenter.getErrorCount = function () {

        if (presenter.initialMarks == presenter.CorrectElements) {
            return 0;
        } else {
            let nullAnswers = nullElements();
            return presenter.CorrectElements - presenter.initialMarks - nullAnswers;
        }
    }


    function nullElements() {
        let numberOfNullAnswers = 0;
        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView()).find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')
            let children = checkRealChildren(element);
            for (let j = 0; j < children.length; j++) {
                if (children[j].innerHTML == "&nbsp;") {
                    numberOfNullAnswers++;
                } else if (children[j].value == "") {
                    numberOfNullAnswers++;
                }
            }
        }
        return numberOfNullAnswers;
    }
    presenter.getMaxScore = function () {
        return (presenter.CorrectElements) ? presenter.CorrectElements : 0
    }

    presenter.getScore = function () {
        checkGoodAnswer();
        return presenter.initialMarks;
    }

    function checkRealChildren(element) {
        let children = [];
        for (let i = 0; i < element.length; i++) {
            children.push(element[i]);
        }
        return children;
    }

    function checkGoodAnswer() {
        presenter.initialMarks = 0;
        arrayIDCorrectAnswer.length = 0;
        let array = [];
        presenter.arrayAnswers.forEach(el => array.push(el));
        arrayCount.length = 0;
        checkArrayToGoodAnswer(array);

    }
    function checkArrayToGoodAnswer(array) {
        let arr = [];
        if (array) {
            array.forEach(el => el.forEach(podEl => arr.push(podEl)));
        }

        presenter.CorrectElements = 0;
        presenter.initialMarks = 0;
        arrayIDCorrectAnswer.length = 0;

        for (let i = 0; i < presenter.arrayModule.length; i++) {
            $('body').find(".MathJax_Preview").each(() => $(this).style.display = "none");
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView()).find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty');
            let children = checkRealChildren(element);

            arrayCount.length = 0;
            if (children) {
                for (let j = 0; j < children.length; j++) {
                    if (array) {
                        if (children[j].innerHTML == arr[j+presenter.CorrectElements]) {
                            arrayCount.push(j+presenter.CorrectElements);
                            presenter.initialMarks++;
                            arrayIDCorrectAnswer.push(children[j].id);
                        }
                        if (children[j].value == arr[j+presenter.CorrectElements]) {
                            if (!checkNumber(j+presenter.CorrectElements)) {
                                arrayCount.push(j+presenter.CorrectElements);
                                presenter.initialMarks++;
                                arrayIDCorrectAnswer.push(children[j].id);
                            }
                        }
                    }
                }
                presenter.CorrectElements += children.length;
            }
        }
    }

    function checkNumber(number) {
        for (let i = 0; i < arrayCount.length; i++) {
            if (number == arrayCount[i]) {
                return 1;
            }
        }
        return 0;
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
        if (presenter.arrayModule[id]) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[id]}`).getView())
                .find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')
            let children = checkRealChildren(element);
            if (children) {
                let idElement = children[item].id;
                for (let j = 0; j < arrayIDCorrectAnswer.length; j++) {
                    if (arrayIDCorrectAnswer[j] == idElement) {
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
        for (let i = 0; i < presenter.arrayModule.length; i++) {
            let element = $(presenter.playerController.getModule(`${presenter.arrayModule[i]}`).getView())
                .find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')
            let children = checkRealChildren(element);
            for (let j = 0; j < children.length; j++) {
                if (children[j].innerHTML != "&nbsp;" && children[j].innerHTML != "") {
                    count++;
                } else if (children[j].innerHTML == "" && children[j].value != "") {
                    count++;
                }
            }
        }
        return count
    }

    function handleClickActions(view) {
            let elements = $('html').find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')

            let arrayElements = [];
            for (let i = 0; i < elements.length; i++) {
                arrayElements.push(elements[i]);
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

        let elements = $('html').find('.ic_gap, .gapFilled, .ic_gap-empty, .ic_filled_gap,  .ic_draggableGapFilled, .ic_draggableGapEmpty')

        let arrayElements = []
        for (let i = 0; i < elements.length; i++) {
            arrayElements.push(elements[i]);
        }

        let item = '';
        let value = '';
        let score = 0;
        for (let i = 0; i < arrayElements.length; i++) {
            if (arrayElements[i].id == element.id) {
                item = i;
            }
        }
        checkArrayToGoodAnswer(presenter.arrayAnswers)
        for (let j = 0; j < arrayIDCorrectAnswer.length; j++) {
            if (arrayIDCorrectAnswer[j] == element.id) {
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