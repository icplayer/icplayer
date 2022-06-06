
function AddonSpeechace_create() {
    var presenter = function (){};

    var SESSION_TOKEN_URL = '/api/v2/jwt/session_token';
    var FETCH_COURSE_URL = '/speechace/url/';

    var errorCodes = {
        "V_01": "Course ID is missing",
        "V_02": "Error occurred while fetching data"
    };

    presenter.presenterLogic = function AddonSpeechace_presenterLogic (view, model, isPreview) {
      presenter.$view = $(view);
      presenter.isPreview = isPreview;

      const upgradedModel = presenter.upgradeModel(model);
      presenter.configuration = presenter.validateModel(upgradedModel);
      if (!presenter.configuration.isValid) {
            presenter.createErrorView(view, presenter.configuration.errorCode);
            return;
      }

      presenter.setIframe(view);

      if (!presenter.isPreview) {
          presenter.handleURLLogic();
          presenter.registerEvents();
      }
    };

    presenter.run = function AddonSpeechace_run (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function AddonSpeechace_createPreview (view, model) {
        presenter.presenterLogic(view, model, true);
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
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (model[attrName] == undefined) {
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
            isValid: true,
            courseId: validatedCourseId.value
        };
    };

    presenter.validateCourseId = function AddonSpeechace_validateCourseId (courseId) {
        if (!courseId || !courseId.trim()) {
            return {isValid: false, errorCode: 'V_01'};
        }

        return {isValid: true, value: courseId.trim()};
    };

    presenter.createErrorView = function AddonSpechace_createErrorView (view, errorCode) {
        presenter.$view = $(view);
        presenter.$view.html(errorCodes[errorCode]);
    };

    presenter.setIframe = function AddonSpechace_setIframe (view) {
        presenter.iframe = $(view).find("iframe");
        presenter.iframe.attr("allow","microphone");
    };

    presenter.executeCommand = function AddonSpeechace_executeCommand (name, params) {
        if (!presenter.configuration.isValid) return;

        var commands = {
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
                presenter.createErrorView(presenter.$view, "V_02");
                console.error(`Error fetching data: ${error}`)
            });
    };

    presenter.fetchSessionJWTToken = function() {
        return fetch(SESSION_TOKEN_URL, {method: 'GET'});
    };

    presenter.getCourseURL = function AddonSpeechace_getCourseURL (token) {
        const url = `${FETCH_COURSE_URL}?course_key=${presenter.configuration.courseId}`;
        const config = {
            method: 'GET',
            headers: { 'Authorization': 'JWT ' + token }
        };

        return fetch(url, config);
    };

    presenter.handleDataReceived = function AddonSpeechace_handeDataReceived (data) {
        presenter.iframe.attr("src", data.course_url);
        presenter.speechaceToken = data.token;
    };

    presenter.registerEvents = function AddonSpeechace_registerEvents () {
        window.addEventListener("message", myHandler, false);

        function myHandler(event) {
            // if (event.origin !== "<speechace endpoint>") {
            //     return;
            // }
            if (event.data === "speechaceActivityComplete") {
                console.log("speechaceActivityComplete");
                console.log(event);
            }
        }
    }


    presenter.getState = function AddonSpeechace_getState () {
        if (!presenter.configuration.isValid) return "";

    	return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function AddonSpeechace_setState (state) {
        if (!state) return;

    	var parsedState = JSON.parse(state);

        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);
    };
    return presenter;
}