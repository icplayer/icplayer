/**
 * 
 * KNOWN WORKAROUNDS:
 *  Iframe src:
 *      -mCourser have optimalization on /file/serve, where file serving is redirecting to GCS. Files passed in FILE_DICTIONARY_ACTUALIZATION are relative to domain, so after redirect that files while request are built by browser as storage.google.com/file/serve/<id>. To fix it add no_gcs flag to address
 * 
 */
function AddonIframe_create() {
    var presenter = function (){};

    presenter.iframeState = undefined;
    presenter.iframeContent = null;
    presenter.configuration = null;
    presenter.$view = null;
    presenter.eventBus = null;
    presenter.isEditor = false;
    presenter.isVisible = true;
    presenter.originalDisplay = "block";

    presenter.actionID = {
        SET_WORK_MODE : "SET_WORK_MODE",
        SET_SHOW_ERRORS_MODE : "SET_SHOW_ERRORS_MODE",
        RESET : "RESET",
        STATE_ACTUALIZATION: "STATE_ACTUALIZATION",
        STATE_REQUEST: "STATE_REQUEST",
        SHOW_ANSWERS: "SHOW_ANSWERS",
        HIDE_ANSWERS: "HIDE_ANSWERS",
        FILE_DICTIONARY_REQUEST: "FILE_DICTIONARY_REQUEST",
        FILE_DICTIONARY_ACTUALIZATION: "FILE_DICTIONARY_ACTUALIZATION",
        CUSTOM_EVENT: "CUSTOM_EVENT"
    };

    presenter.iframeScore = {
            pageCount: 0,
            checks: 0,
            errors: 0,
            mistakes: 0,
            score: 0,
            maxScore: 0,
            scaledScore: 0
    };

    presenter.ERROR_CODES = {
        'M01' : "Module must have Index File or IFrame URL",
        'M02' : "Module must have Communication ID",
        'F01' : "File must have ID",
        'F02' : "In File List all elements must have file",
        'I01' : "Multiple File ID in File List"
    };

    presenter.validateMessage = function AddonIFrame_Communication_Validate_Message (message) {
        if (message != undefined) {
            if ((message.id == presenter.configuration.communicationID) && (message.actionID != undefined)) {
                return true;
            }
        }
        return false;
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.run = function AddonIFrame_Communication_run (view, model) {
        presenter.initialize(view, model);
        if (presenter.configuration.isValid) {
            presenter.setVisibility(presenter.configuration.isVisibleByDefault);
            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);
        }
    };

    presenter.createPreview = function AddonIFrame_Communication_create_preview (view, model) {
        presenter.isEditor = true;
        presenter.initialize(view, model);
        if (presenter.configuration.isValid) {
            presenter.setVisibility(true);
        }
    };

    presenter.getIframeIndexSource = function () {
        var source = presenter.configuration.index;
        if (source.indexOf("/file/serve") > -1) {
            var separator = (presenter.configuration.index.indexOf("?")===-1)?"?":"&";
            source = presenter.configuration.index + separator + "no_gcs=true";
        }

        return source;
    };

    presenter.initialize = function AddonIFrame_Communication_initialize (view, model)  {
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        window.addEventListener("message", presenter.getMessage, false);

        var iframe = $(view).find("iframe");

        if (presenter.configuration.allowFullScreen) {  // It must be done before src setup.
            iframe.attr("allowfullscreen", "allowfullscreen");
            iframe.attr("webkitallowfullscreen", "webkitallowfullscreen");
            iframe.attr("mozallowfullscreen", "mozallowfullscreen");
        }

        if(presenter.configuration.haveURL) {
            iframe.attr("src", presenter.configuration.iframeURL);
        }
        else {
            iframe.attr("src", presenter.getIframeIndexSource());
        }

        presenter.$view = $(view);
        presenter.view = view;

         var display = presenter.$view.css('display');
        if (display != null && display.length > 0) {
            presenter.originalDisplay = display;
        }

        presenter.iframeContent = iframe.get(0).contentWindow;

        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();

        presenter.$view.attr('alt', presenter.configuration.altText);
    };

    presenter.destroy = function () {
        window.removeEventListener("message",presenter.getMessage);
    };

    presenter.validateFile = function AddonIFrame_Communication_Validate_File (file, dictionary) {
        var trimmedFileID = file.id.trim();
        var trimmedFile = file.file.trim();

        if (ModelValidationUtils.isStringEmpty(trimmedFileID)) {
            return {isValid: false, errorCode: "F01" };
        }

        if (ModelValidationUtils.isStringEmpty(trimmedFile)) {
            return {isValid: false, errorCode: "F02" };
        }

        if (dictionary[trimmedFileID] !== undefined) {
            return {isValid: false, errorCode: "I01" };
        }

        return {isValid: true, id: trimmedFileID, file: trimmedFile};
    };


    presenter.validateFileList = function AddonIFrame_Communication_Validate_File_List (model) {
        var fileDictionary = {};

        for (var i = 0; i < model.fileList.length; i++) {
            if(ModelValidationUtils.isStringEmpty(model.fileList[i].fileDictionary)
                && ModelValidationUtils.isStringEmpty(model.fileList[i].file)){
                continue;
            }
            var validateFileResult = presenter.validateFile(model.fileList[i],fileDictionary);
            if (!validateFileResult.isValid) {
                return validateFileResult;
            }
            else {
                fileDictionary[validateFileResult.id] = validateFileResult.file;
            }
        }
        return {isValid: true, fileDictionary: fileDictionary};
    };
    presenter.validateIFrameSource = function AddonIFrame_Communication_Validate_IFrame_Source (model) {
        var haveURL = !ModelValidationUtils.isStringEmpty(model.iframeURL.trim());

        if (!haveURL && ModelValidationUtils.isStringEmpty(model.index.trim()))  {
            return { isValid: false, errorCode: 'M01'};
        }
        return { isValid: true, haveURL: haveURL };
    };

    presenter.validateCommunicationID = function AddonIFrame_Communication_Validate_Communication_ID (model) {
       if (ModelValidationUtils.isStringEmpty(model.communicationID.trim()) ) {
           return { isValid: false, errorCode: 'M02'};
        }
        return { isValid: true, value: (model.communicationID.trim()) };
    };

    presenter.validateModel = function AddonIFrame_Communication_Validate_Model(model) {
        var validateIFrameSourceResult = presenter.validateIFrameSource(model);
        if (!validateIFrameSourceResult.isValid) {
            return validateIFrameSourceResult;
        }

        var validateCommunicationIDResult = presenter.validateCommunicationID(model);
        if (!validateCommunicationIDResult.isValid) {
            return validateCommunicationIDResult;
        }

        var validateFileListResult = presenter.validateFileList(model);
        if (!validateFileListResult.isValid) {
            return validateFileListResult;
        }

        var allowFullScreen = model['allowFullscreen'];
        if (allowFullScreen === undefined) {
            allowFullScreen = "False";
        }

        var altText = model['Alt text'];
        if(altText === undefined) {
            altText = '';
        }

        return {
            isValid: true,
            haveURL: validateIFrameSourceResult.haveURL,
            iframeURL: model.iframeURL,
            index: model.index,
            indexHtmlLocation: model.indexHtmlLocation,
            zipFile: model.zipFile,
            communicationID: validateCommunicationIDResult.value,
            addonID : model.ID,
            fileDictionary: validateFileListResult.fileDictionary,
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible']),
            allowFullScreen: ModelValidationUtils.validateBoolean(allowFullScreen),
            altText: altText
        };
    };

    presenter.setVisibility = function (isVisible) {
        presenter.isVisible = isVisible;
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        if(!presenter.isEditor) {
            presenter.$view.css('display', isVisible ? presenter.originalDisplay : 'none');
        }
    };

    presenter.show = function AddonIFrame_Communication_show () {
        presenter.setVisibility(true);
    };

    presenter.hide = function AddonIFrame_Communication_hide () {
        presenter.setVisibility(false);
    };

    presenter.reset = function AddonIFrame_Communication_reset () {
        presenter.sendMessage(presenter.actionID.RESET);
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.isVisible = presenter.configuration.isVisibleByDefault;
    };

    presenter.showAnswers = function AddonIFrame_Communication_show_answers () {
        presenter.sendMessage(presenter.actionID.SHOW_ANSWERS);
    };

    presenter.hideAnswers = function AddonIFrame_Communication_hide_answers () {
        presenter.sendMessage(presenter.actionID.HIDE_ANSWERS);
    };

    presenter.setWorkMode = function AddonIFrame_Communication_set_work_mode () {
        presenter.sendMessage(presenter.actionID.SET_WORK_MODE);
    };

    presenter.setShowErrorsMode = function AddonIFrame_Communication_set_show_errors_mode () {
        presenter.sendMessage(presenter.actionID.SET_SHOW_ERRORS_MODE);
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.setState = function AddonIFrame_Communication_set_state (state) {
        try {
            var parsedState = JSON.parse(state);
            presenter.iframeState = parsedState.iframeState;
            presenter.iframeScore = parsedState.iframeScore;
            if(typeof(parsedState.isVisible) === "boolean") {
                presenter.isVisible = parsedState.isVisible;
            }else{
                presenter.isVisible = presenter.configuration.isVisibleByDefault;
            }
            presenter.setVisibility(presenter.isVisible);
        }
        catch (error) {
            presenter.iframeState = undefined;
        }
    };

    presenter.getState = function AddonIFrame_Communication_get_state () {
        return JSON.stringify({
            iframeState: presenter.iframeState,
            iframeScore: presenter.iframeScore,
            isVisible:presenter.isVisible,
        });
    };

    presenter.getScore = function AddonIFrame_Communication_get_score () {
        return presenter.iframeScore.score;
    };

    presenter.getMaxScore = function AddonIFrame_Communication_get_maxScore () {
        return presenter.iframeScore.maxScore;
    };

    presenter.getErrorCount = function AddonIFrame_Communication_get_error_count () {
        return presenter.iframeScore.errors;
    };

    presenter.sendMessageCommand = function (command) {
        presenter.sendMessage(command[0], command[1]);
    };

    presenter.executeCommand = function AddonIFrame_Communication_execute_Command (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'sendMessage': presenter.sendMessage
        };
        Commands.dispatch(commands, name, params, presenter);
    };
    presenter.createEventData = function AddonIFrame_Communication_create_event_data() {
        return {
            source : presenter.configuration.addonID,
            item : "all",
            value : '',
            score : ''
        };

    };

   presenter.triggerFrameChangeEvent = function AddonIFrame_Communication_trigger_frame_change_event () {
        if (presenter.eventBus != undefined) {
            presenter.eventBus.sendEvent('ValueChanged', presenter.createEventData());

        }
    };

    presenter.createCustomEventData = function AddonIframe_Communication_create_custom_data (data) {
        return {
            source : presenter.configuration.addonID,
            item : "CUSTOM_EVENT",
            value : data.params,
            score : ''
        }
    };

    presenter.triggerCustomEvent = function AddonIFrame_Communication_trigget_custon_event (data) {
        if (presenter.eventBus != undefined) {
            presenter.eventBus.sendEvent('ValueChanged', presenter.createCustomEventData(data));

        }
    };

    presenter.sendMessage = function AddonIFrame_Communication_send_message (actionID, params) {
        if (params == undefined) {
            params = {};
        }
        var newMessage = { id : presenter.configuration.communicationID, actionID : actionID, params:params};
        presenter.iframeContent.postMessage(newMessage, "*");
    };

    presenter.setStateActualization = function AddonIFrame_Communication_set_state_actualization (state) {
        if (presenter.validateActualizationModel(state).isValid) {
            //state undefined nie aktualizwac
            if(state.iframeState !== undefined) {
                presenter.iframeState = state.iframeState;
            }
            presenter.iframeScore = state.iframeScore;
            if(typeof(presenter.isVisible) === "boolean") {
                presenter.isVisible = state.isVisible
            }else{
                presenter.isVisible = presenter.configuration.isVisibleByDefault;
            }
        }
    };

    presenter.validateActualizationModel = function AddonIFrame_Communication_Validate_Actualization_Model (actualization) {
        if (actualization === undefined) {
            return {isValid: false};
        }
        var attributes = ["pageCount", "checks", "errors", "mistakes", "score", "maxScore", "scaledScore"];
        if(actualization.iframeScore === undefined) {
            return {isValid: false };
        }
        for (var i = 0; i< attributes.length; i++) {
            if (!ModelValidationUtils.validateInteger(actualization.iframeScore[attributes[i]]).isValid) {
                return {isValid: false };
            }
        }
        return {isValid: true};
    };

    presenter.getMessage = function AddonIFrame_Communication_get_message (event) {
        var message = event.data;
        if (presenter.validateMessage(message)) {
            switch (message.actionID) {
                case presenter.actionID.STATE_ACTUALIZATION:
                    presenter.setStateActualization(message.params);
                    presenter.triggerFrameChangeEvent();
                    break;

                case presenter.actionID.STATE_REQUEST:
                    presenter.sendMessage(presenter.actionID.STATE_ACTUALIZATION, { iframeState: presenter.iframeState, iframeScore: presenter.iframeScore } );
                    break;

                case presenter.actionID.FILE_DICTIONARY_REQUEST:
                    presenter.sendMessage(presenter.actionID.FILE_DICTIONARY_ACTUALIZATION, { fileDictionary: presenter.configuration.fileDictionary});
                    break;
                case presenter.actionID.CUSTOM_EVENT:
                    presenter.triggerCustomEvent(message);
                    break;
            }
        }
    };

    return presenter;
}
