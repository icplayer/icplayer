function AddonSpeechace_create() {
    var presenter = function (){};

    var errorCodes = {
        "V_01": "Course ID is missing",
        "V_02": "Error occurred while fetching data",
        "V_03": "Missing configuration params in context metadata",
        "V_04": "Cannot load context metadata - setting default URLs"
    };

    presenter.eventBus = null;

    presenter.DEFAULTS = {
        JWTSessionTokenURL: "/api/v2/jwt/session_token",
        speechaceCourseURL: "/speechace/url/",
        collectionId: 0
    };

    presenter.JWTSessionTokenURL = "";
    presenter.speechaceCourseURL = "";
    presenter.isFetchingScore = false;

    presenter.presenterLogic = function AddonSpeechace_presenterLogic (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.view = view;
        presenter.isPreview = isPreview;

        const upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);
        if (!presenter.configuration.isValid) {
            presenter.createErrorView(presenter.configuration.errorCode);
            return;
        }

        presenter.setIframe(view);

        if (!presenter.isPreview) {
            const iterations = presenter.isMauthor() ? 1 : 10;
            presenter.runLogic(iterations);
            presenter.registerEvents();
        }
    };

    presenter.isMauthor = function AddonSpeechace_isMauthor () {
        const names = ["lorepo", "mauthor"];
        const origin = window.origin;
        return names.some((name) => origin.includes(name));
    };

    presenter.run = function AddonSpeechace_run (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function AddonSpeechace_createPreview (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.runLogic = function AddonSpeechace_runLogic (iterationsLeft) {
        const context = presenter.playerController && presenter.playerController.getContextMetadata();
        if (context != null) {
            if ("JWTSessionTokenURL" in context) {
                presenter.JWTSessionTokenURL = context["JWTSessionTokenURL"];
            }

            if ("speechaceCourseURL" in context) {
                presenter.speechaceCourseURL = context["speechaceCourseURL"];
            }

            presenter.collectionID = "collectionID" in context ? context["collectionID"] : presenter.DEFAULTS.collectionId;

            if (presenter.JWTSessionTokenURL.length && presenter.speechaceCourseURL.length) {
                presenter.handleURLLogic();
            } else {
                presenter.createErrorView("V_03");
            }
        } else {
            if (iterationsLeft > 0) {
                window.setTimeout(function(){presenter.runLogic(iterationsLeft-1)}, 500);
            } else {
                console.warn(errorCodes["V_04"]);
                console.warn("Setting default URLs - no context metadata was set");
                presenter.JWTSessionTokenURL = presenter.DEFAULTS.JWTSessionTokenURL;
                presenter.speechaceCourseURL = presenter.DEFAULTS.speechaceCourseURL;
                presenter.collectionID = presenter.DEFAULTS.collectionId;
                presenter.handleURLLogic();
            }
        }
    };

    presenter.setVisibility = function AddonSpeechace_setVisibility (isVisible) {
        presenter.$view.css("display", isVisible ? "" : "none");
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.upgradeModel = function AddonSpeechace_upgradeModel (model) {
        return presenter.upgradeCourseId(model);
    };

    presenter.upgradeAttribute = function AddonSpeechace_upgradeAttribute (model, attrName, defaultValue) {
        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (model[attrName] === undefined) {
            upgradedModel[attrName] = defaultValue;
        }

        return upgradedModel;
    };

    presenter.upgradeCourseId = function AddonSpeechace_upgradeCourseId (model) {
        return presenter.upgradeAttribute(model, "CourseId", "");
    };

    presenter.validateModel = function AddonSpeechace_validateModel (model) {
        const validatedCourseId = presenter.validateCourseId(model["CourseId"]);
        if (!validatedCourseId.isValid) {
            return {isValid: false, errorCode: validatedCourseId.errorCode};
        }

        return {
            addonID: model.ID,
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            courseId: validatedCourseId.value,
            maxScore: 100
        };
    };

    presenter.validateCourseId = function AddonSpeechace_validateCourseId (courseId) {
        if (!courseId || !courseId.trim()) {
            return {isValid: false, errorCode: 'V_01'};
        }

        return {isValid: true, value: courseId.trim()};
    };

    presenter.createErrorView = function AddonSpeechace_createErrorView (errorCode) {
        presenter.$view.html(errorCodes[errorCode]);
    };

    presenter.setPlayerController = function AddonSpeechace_setPlayerController (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.setIframe = function AddonSpeechace_setIframe (view) {
        presenter.iframe = $(view).find("iframe");
        presenter.iframe.attr("allow","microphone");
    };

    presenter.executeCommand = function AddonSpeechace_executeCommand (name, params) {
        if (!presenter.configuration.isValid) return;

        const commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.handleURLLogic = function AddonSpeechace_handleURLLogic () {
        presenter.fetchSessionJWTToken()
            .then((response) => response.json())
            .then((data) => presenter.getCourseURL(data.token))
            .then((response) => response.json())
            .then((data) => presenter.handleDataReceived(data))
            .catch((error) => {
                presenter.createErrorView("V_02");
                console.error(`Error fetching data: ${error}`)
            });
    };

    presenter.fetchSessionJWTToken = function() {
        return fetch(presenter.JWTSessionTokenURL, {method: 'GET'});
    };

    presenter.getCourseURL = function AddonSpeechace_getCourseURL (token) {
        let url = `${presenter.speechaceCourseURL}?course_key=${presenter.configuration.courseId}`;
        if (presenter.collectionID) {
            url += `&collection_id=${presenter.collectionID}`;
        }
        const config = {
            method: 'GET',
            headers: { 'Authorization': `JWT ${token}` }
        };

        return fetch(url, config);
    };

    presenter.handleDataReceived = function AddonSpeechace_handleDataReceived (data) {
        presenter.iframe.attr("src", data.course_url);
        presenter.speechaceToken = data.token;
        presenter.speechaceUrl = data.speechace_url;
    };

    presenter.registerEvents = function AddonSpeechace_registerEvents () {
        window.addEventListener("message", presenter.handleMessageReceived, false);
        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    };

    presenter.handleMessageReceived = function AddonSpeechace_handleMessageReceived (event) {
        if (event.data === "speechaceActivityComplete") {
            presenter.requestScore();
        }
    };

    presenter.destroy = function AddonSpeechace_destroy (event) {
        if (event.target !== presenter.view) {
            return;
        }

        window.removeEventListener("message", presenter.handleMessageReceived);
    };

    presenter.getState = function AddonSpeechace_getState () {
        if (!presenter.configuration.isValid) return "";

        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            averageScore: presenter.averageScore
        });
    };

    presenter.setState = function AddonSpeechace_setState (state) {
        if (!state) return;

        const parsedState = JSON.parse(state);

        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.updateScore(parsedState.averageScore);
    };

    presenter.showMessageDialog = function AddonSpeechace_showMessageDialog () {
        const messageElement = presenter.$view.find(".speechace-message");
        messageElement.css("display", "flex");
    };

    presenter.hideMessageDialog = function AddonSpeechace_hideMessageDialog () {
        const messageElement = presenter.$view.find(".speechace-message");
        messageElement.css("display", "none");
    };

    presenter.requestScore = function AddonSpeechace_requestScore() {
        presenter.isFetchingScore = true;
        window.setTimeout(function(){
            if (presenter.isFetchingScore) {
                presenter.showMessageDialog();
            }}, 1000);

        const url = presenter.generateScoreUrl();
        fetch(url, {method: 'GET'})
            .then((response) => response.json())
            .then((data) => presenter.saveScore(data))
            .catch((error) => {
                console.error(`Error fetching data: ${error}`);
                presenter.isFetchingScore = false;
                presenter.hideMessageDialog();
                presenter.onScoreFetchError();
            });
    };

    presenter.generateScoreUrl = function AddonSpeechace_generateScoreUrl() {
        const unixTimestamp = Math.round((new Date()).getTime() / 1000);
        const coreUrl = presenter.speechaceUrl;
        const courseId = presenter.configuration.courseId;
        const token = presenter.speechaceToken;

        return `${coreUrl}/embed/api/${courseId}/report?speechace_token=${token}&session_start_time=${unixTimestamp}`;
    };

    presenter.saveScore = function AddonSpeechace_saveScore(data) {
        const status = data["status"];
        if (status !== "success") {
            console.error("Fetching score failed - status: error");
            console.error("Detailed message:");
            console.error(data["detail_message"]);
            presenter.onScoreFetchError();
            return;
        }

        let score = parseInt(data["report"]["averageScore"], 10);
        score = isNaN(score) ? 0 : score;
        presenter.updateScore(score);

        presenter.isFetchingScore = false;
        presenter.hideMessageDialog();
    };

    presenter.updateScore = function AddonSpeechace_updateScore (score) {
        presenter.averageScore = score;
        presenter.sendScoreUpdateEvent();
    };

    presenter.onScoreFetchError = function AddonSpeechace_onScoreFetchError () {
        const messageElement = presenter.$view.find(".speechace-message-text")[0];
        const prevMessage = messageElement.innerHTML;
        messageElement.innerHTML = "Error saving the score. Try again.";

        presenter.showMessageDialog();

        window.setTimeout(function(){
            presenter.hideMessageDialog();
            messageElement.innerHTML = prevMessage;
            }, 5000);
    };

    presenter.getMaxScore = function AddonSpeechace_getMaxScore () {
        return presenter.configuration.maxScore;
    };

    presenter.getScore = function AddonSpeechace_getScore () {
        return presenter.averageScore || 0;
    };

    presenter.sendScoreUpdateEvent = function AddonSpeechace_sendValueChangedEvent () {
        presenter.eventBus.sendEvent('ValueChanged', presenter.createEventData());
    };

    presenter.createEventData = function AddonSpeechace_createEventData () {
        return {
            'source' : presenter.configuration.addonID,
            'item' : '',
            'value' : '',
            'score' : presenter.averageScore || 0
        };
    };

    return presenter;
}