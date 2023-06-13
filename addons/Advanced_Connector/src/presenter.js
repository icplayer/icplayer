function AddonAdvanced_Connector_create() {
    var presenter = function () {};
    var event;

    presenter.STANDARD_EVENTS = [
        'ValueChanged',
        'Definition',
        'ItemSelected',
        'ItemConsumed',
        'ItemReturned',
        'PageLoaded',
        'PageAllOk',
        'ShowAnswers',
        'HideAnswers',
        'Done',
        'AllAttempted',
        'NotAllAttempted',
        'LimitedCheck',
        'GradualShowAnswers',
        'GradualHideAnswers',
    ];

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (presenter.isDisabled) {
            return;
        }
        var i, length;
        let filledEventData = presenter.fillEventData(eventData, eventName);

        try {
            var filteredEvents = presenter.filterEvents(presenter.events, filledEventData);
            for (i = 0, length = filteredEvents.length; i < length; i++) {
                event = filledEventData;
                eval(filteredEvents[i].Code);
            }
        } catch (error) {
            Helpers.alertErrorMessage(error, "Advanced Connector - problem occurred while running scripts!");
        }

        event = undefined;
    };

    presenter.reset = function () {
        presenter.onEventReceived('Reset', {});
    };

    presenter.setShowErrorsMode = function () {
        presenter.onEventReceived('Check', {});
    };

    presenter.setWorkMode = function () {
        presenter.onEventReceived('Uncheck', {});
    };

    function isCustomEvent(eventName) {
        return $.inArray(eventName, presenter.STANDARD_EVENTS) == -1;
    }

    presenter.run = function(view, model) {
        var validatedScript = presenter.validateScript(model.Scripts), eventBus,
            customEventListeners = [];

        if (validatedScript.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedScript.errorCode);
            return;
        }

        presenter.isDisabled = ModelValidationUtils.validateBoolean(model["Is disabled"]);
        if (presenter.isDisabled) {
            return;
        }

        eventBus = presenter.playerController.getEventBus();
        presenter.events = validatedScript.events;

        $.each(presenter.STANDARD_EVENTS, function(_, name) {
            eventBus.addEventListener(name, presenter);
        });

        $.each(presenter.events, function() {
            if (isCustomEvent(this.Name) && (customEventListeners.indexOf(this.Name) == -1) ){
                eventBus.addEventListener(this.Name.trim(), presenter);
                customEventListeners.push(this.Name);
            }
        });

        $(view).css('visibility', 'hidden');
    };

    presenter.checkScriptsResources = function(script) {
        script = script.replace(/\s/g,'');
        var regex = new RegExp("[\(|\=](\'|\")*(/)*file/serve/[0-9]*");

        return regex.test(script);
    };

    presenter.createPreview = function(view, model) {
        var validatedScript = presenter.validateScript(model.Scripts);
        if (validatedScript.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedScript.errorCode);
        }
        if (presenter.checkScriptsResources(model.Scripts)) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, 'SV_09');
        }

    };

    presenter.ERROR_CODES = {
        'SV_01': "Script source must be provided and cannot be empty!",
        'SV_02': "Missing EVENTSTART keyword or new line after it!",
        'SV_03': "Missing EVENTEND keyword or new line after it!",
        'SV_04': "Missing SCRIPTSTART keyword or new line after it!",
        'SV_05': "Missing SCRIPTEND keyword or new line after it!",
        'SV_06': "Repeated event field value declaration!",
        'SV_07': "Repeated keyword!",
        'SV_08': "Invalid identification. Should be Source,Item, Value or Score!",
        'SV_09': "Please pay attention to the correct linking resources"
    };

    function returnErrorResult(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    presenter.fillBlankFields = function(eventDeclaration) {
        for (var prop in eventDeclaration) {
            if (eventDeclaration.hasOwnProperty(prop) && prop !== 'Name') {
                if (eventDeclaration[prop] == undefined) {
                    eventDeclaration[prop] = '.*';
                }
            }
        }

        if (eventDeclaration.Name == undefined) {
            eventDeclaration.Name = 'ValueChanged';
        }
    };

    presenter.findKeywordIndex = function(script, keyword, currentLine) {
        for (var i = currentLine + 1; i < script.length; i++) {
            if (script[i].trim() === keyword) return i;
        }

        return -1;
    };

    presenter.validateEvent = function(script) {
        var indexes = [], i, length;
        var eventDeclaration = {
            Source: undefined,
            Item: undefined,
            Value: undefined,
            Score: undefined,
            Name: undefined,
            Word: undefined,
            Type: undefined,
            Code: ''
        };

        for(i = 0, length = script.length; i < length; i++) {
            indexes[i] = false;
        }

        var scriptStartIndex = presenter.findKeywordIndex(script, "SCRIPTSTART", -1);
        var scriptEndIndex = presenter.findKeywordIndex(script, "SCRIPTEND", 1);

        var isScriptInvalid = scriptStartIndex === -1 && scriptEndIndex !== -1;
        isScriptInvalid = isScriptInvalid || scriptStartIndex !== -1 && scriptEndIndex === -1;
        isScriptInvalid = isScriptInvalid || scriptStartIndex > scriptEndIndex;

        if (isScriptInvalid) return returnErrorResult('SV_04');

        indexes[scriptStartIndex] = true;
        indexes[scriptEndIndex] = true;

        for (i = scriptStartIndex + 1; i < scriptEndIndex; i++) {
            indexes[i] = true;
            eventDeclaration.Code += script[i];
            if (i !== scriptEndIndex - 1) {
                eventDeclaration.Code += '\n';
            }
        }

        for(i = 0, length = indexes.length; i < length; i++) {
            if (indexes[i]) continue;

            var line = script[i].split(':');
            if (line.length !== 2) return returnErrorResult('SV_08');

            var keywords = ['Source', 'Item', 'Value', 'Score', 'Name', 'Type', 'Word'];

            var trimmedKeyword = line[0].trim();
            if (keywords.indexOf(trimmedKeyword) === -1) return returnErrorResult('SV_08');

            if (eventDeclaration[trimmedKeyword]) {
                return returnErrorResult('SV_06');
            } else {
                eventDeclaration[trimmedKeyword] = line[1];
            }
        }

        presenter.fillBlankFields(eventDeclaration);

        return { isError: false, eventDeclaration: eventDeclaration };
    };

    function extractLines(script, start, end) {
        var array = [];

        for (var i = start; i < end; i++) array.push(script[i]);

        return array;
    }

    function cleanScriptFromEmptyLines(script) {
        var array = [];

        for (var i = 0; i < script.length; i++) {
            if (script[i]) array.push(script[i]);
        }

        return array;
    }

    presenter.validateScript = function (script) {
        if (!script) return returnErrorResult('SV_01');

        var scriptsArray = [];
        var scriptLines = cleanScriptFromEmptyLines(script.split('\n'));
        var lineIndex = 0, length = scriptLines.length;

        while (lineIndex < length) {
            if (scriptLines[lineIndex] !== "EVENTSTART") return returnErrorResult('SV_02');

            var endEventIndex = presenter.findKeywordIndex(scriptLines, "EVENTEND", lineIndex);
            if (endEventIndex === -1) return returnErrorResult('SV_03');

            lineIndex++;
            var startEventIndex = presenter.findKeywordIndex(scriptLines, "EVENTSTART", lineIndex);

            if (startEventIndex !== -1 && startEventIndex < endEventIndex) return returnErrorResult('SV_07');

            var eventCode = extractLines(scriptLines, lineIndex, endEventIndex);
            var validatedEvent = presenter.validateEvent(eventCode);
            if (validatedEvent.isError) {
                return returnErrorResult(validatedEvent.errorCode);
            } else {
                scriptsArray.push(validatedEvent.eventDeclaration);
            }

            lineIndex = endEventIndex + 1;
        }

        return { isError: false, events: scriptsArray };
    };

    presenter.matchFieldToRule = function (field, rule, doExactMatch) {
        if (rule.length > 0)
            var rule = doExactMatch ? '^' + $.trim(rule) + '$' : $.trim(rule);
        return new RegExp(rule).test(field);
    };

    presenter.filterEvents = function (events, event) {
        var filteredArray = [], isMatch;

        try {
            for (var i = 0, length = events.length; i < length; i++) {
                isMatch = presenter.matchFieldToRule(event.name, events[i].Name, true);
                isMatch = isMatch && presenter.matchFieldToRule(event.source, events[i].Source);
                isMatch = isMatch && presenter.matchFieldToRule(event.item, events[i].Item);
                isMatch = isMatch && presenter.matchFieldToRule(event.value, events[i].Value);
                isMatch = isMatch && presenter.matchFieldToRule(event.score, events[i].Score);
                isMatch = isMatch && presenter.matchFieldToRule(event.word, events[i].Word);
                isMatch = isMatch && presenter.matchFieldToRule(event.type, events[i].Type);

                if (isMatch) {
                    filteredArray.push(events[i]);
                }
            }
        } catch (error) {
            Helpers.alertErrorMessage(error, "Advanced Connector - problem occurred while processing conditions!");
        }

        return filteredArray;
    };

    presenter.fillEventData = function (eventData, eventName) {
        var filledEventData = $.extend(true, {}, eventData);
        filledEventData.name = eventName;

        if (!filledEventData.word) filledEventData.word = '';
        if (!filledEventData.type) filledEventData.type = '';
        if (!filledEventData.item) filledEventData.item = '';
        if (!filledEventData.value) filledEventData.value = '';
        if (!filledEventData.source) filledEventData.source = '';
        if (!filledEventData.score) filledEventData.score = '';

        return filledEventData;
    };

    return presenter;
}