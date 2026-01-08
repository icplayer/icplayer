function AddonAI_Assistant_create() {

    var presenter = function () {};

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.commander = controller.getCommands();
    };

    presenter.setEventBus = function (eventBus) {
        presenter.eventBus = eventBus;
        presenter.eventBus.addEventListener('ValueChanged', this);
        presenter.eventBus.addEventListener('PageLoaded', this);
    }

    presenter.fetchSessionJWTToken = function() {
        presenter.isFetching.request = true;
        let result = fetch('/api/v2/jwt/session_token', {
            method: 'GET'
        });
        return result;
    };

    let errorMessages = {
        'transcript': 'Unrecognized speech, please try again.',
        '400': 'Authorization error. (400)',
        '401': 'Authorization error. (401)',
        '500': 'Something went wrong, please try again. (500)',
        'speed out of bounds': 'The text speed property must be larger than 0.25 and smaller than 4'
    };

    presenter.run = function (view, model) {
        presenter.view = view;
        presenter.model = model;

        presenter.defaultVisibility = ModelValidationUtils.validateBoolean(model['Is Visible']);
        presenter.isVisible = presenter.defaultVisibility;
        presenter.setVisibility(presenter.defaultVisibility);

        presenter.isMobile = isMobile();

        presenter.initiate(view, model, false);

    };

    presenter.createPreview = function (view, model) {
        presenter.view = view;
        presenter.model = model;

        presenter.initiate(view, model, true);
    };

    presenter.initiate = function (view, model, isPreview) {
        presenter.isValid = true;

        presenter.chatName = !isEmpty(model['Chat name']) ? model['Chat name'] : 'AI Tutor';
        presenter.welcomeText = model['Welcome text'];
        presenter.hiddenPrompt = model['Hidden prompt'];
        presenter.suggestions = model ['Suggestions'];
        presenter.isDraggable = ModelValidationUtils.validateBoolean(model['Draggable']);
        presenter.headerHidden = ModelValidationUtils.validateBoolean(model['Hide header']);
        presenter.voiceMuted = ModelValidationUtils.validateBoolean(model['Mute voice']);
        presenter.language = !isEmpty(model['Voice language']) ? model['Voice language'] : 'en';
        presenter.voiceType = !isEmpty(model['Voice type']) ? model['Voice type'] : 'onyx';
        presenter.readingSpeed = !isEmpty(model['Reading speed']) && !isNaN(model['Reading speed']) ? model['Reading speed'] : 1.0;
        if (presenter.readingSpeed <= 0.25 || presenter.readingSpeed >= 4) {
            presenter.isValid = false;
            presenter.errorCode = "speed out of bounds"
        }
        presenter.translationLanguages = listLanguages(model['Translation languages']);
        presenter.instructions = !isEmpty(model['Instructions']) ? model['Instructions'] : "You are a helpful assistant.";
        presenter.threadID = '';
        presenter.savedChatHistory = { messages: [], translations: {} };
        if (presenter.translationLanguages) presenter.translationLanguages.forEach(code => {presenter.savedChatHistory.translations[code] = []});
        presenter.audioElement;
        presenter.isFetching = {request: false, translation: false};
        presenter.isWCAGOn = false;

        if (!presenter.isValid) {
            $(presenter.view).html(errorMessages[presenter.errorCode]);
            return;
        }

        handleHeader(view);
        presenter.setSpeechTexts(model['speechTexts']);
        presenter.classNames = {
            hide: model['Class names']['Hide']['Hide'].trim(),
            show: model['Class names']['Show']['Show'].trim()
        }



        if (!isPreview) {

            if (presenter.isDraggable) handleDragging(view);
            handleListeners();
            initiateMedia();
        } else {
            $(presenter.view).css('z-index', 0);
        }
    };

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            messageSent: 'Message sent',
            finishedRecording: 'Finished Recording',
            lastMessage: 'Last message',
            assistantMessage: 'Assistant message number',
            userMessage: 'User message number',
            textInput: 'Text input',
            recordButton: 'Record button',
            sendButton: 'Send button',
            disabled: 'Disabled',
            active: 'Active',
            suggestion: 'Suggestion number'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            messageSent: TTSUtils.getSpeechTextProperty(speechTexts['messageSent']['messageSent'], presenter.speechTexts.messageSent),
            finishedRecording: TTSUtils.getSpeechTextProperty(speechTexts['finishedRecording']['finishedRecording'], presenter.speechTexts.finishedRecording),
            lastMessage: TTSUtils.getSpeechTextProperty(speechTexts['lastMessage']['lastMessage'], presenter.speechTexts.lastMessage),
            assistantMessage: TTSUtils.getSpeechTextProperty(speechTexts['assistantMessage']['assistantMessage'], presenter.speechTexts.assistantMessage),
            userMessage: TTSUtils.getSpeechTextProperty(speechTexts['userMessage']['userMessage'], presenter.speechTexts.userMessage),
            textInput: TTSUtils.getSpeechTextProperty(speechTexts['textInput']['textInput'], presenter.speechTexts.textInput),
            recordButton: TTSUtils.getSpeechTextProperty(speechTexts['recordButton']['recordButton'], presenter.speechTexts.recordButton),
            sendButton: TTSUtils.getSpeechTextProperty(speechTexts['sendButton']['sendButton'], presenter.speechTexts.sendButton),
            disabled: TTSUtils.getSpeechTextProperty(speechTexts['disabled']['disabled'], presenter.speechTexts.disabled),
            active: TTSUtils.getSpeechTextProperty(speechTexts['active']['active'], presenter.speechTexts.active),
            suggestion: TTSUtils.getSpeechTextProperty(speechTexts['suggestion']['suggestion'], presenter.speechTexts.suggestion),
        };
    }

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventData.source == undefined || !presenter.isValid) {
            return;
        };

        if (eventName == 'PageLoaded' && eventData.source.indexOf('header') < 0 && eventData.source.indexOf('footer') < 0 && presenter.isValid) {
            handleMuteState();
            presenter.handleInput('enable');
            presenter.conversate();
        };
    };

    // === === === METHODS === === == \\

    presenter.getResponseJSON = function(response) {
        if (!response.ok) return Promise.reject(response);
        return response.json();
    }

    presenter.sendRequest = function (transcript, history, visibleText) {

        let message = transcript !== undefined ? transcript : presenter.getAndCleanUserInput();
        let length = presenter.savedChatHistory.messages.length;
        let type = 'next';
        let addToHistory = history !== undefined ? history : true;

        if (presenter.getFirstMessageType() == 'hiddenPrompt' && length == 0) {
            type = 'first';
            addToHistory = false;
        };
        if (presenter.getFirstMessageType() == 'welcomeText' && length == 1) type = 'first';
        if (presenter.getFirstMessageType() == 'user' && length == 0) type = 'first';

        if (addToHistory) presenter.addMessage('user', 'write', message)
        else if (!addToHistory && visibleText) presenter.addMessage('user', 'write', visibleText);

        if (!isEmpty(message.trim())) {
            createLoader();
            if (type == 'first') {
            presenter.fetchSessionJWTToken()
                .then(response => {return presenter.getResponseJSON(response);})
                .then(json => $.ajax({
                    url: `/api/v2/openai/responses/conversation`,
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                        'Authorization': 'JWT ' + json.token
                    }
                })).then(response => {
                        presenter.threadID = response.conversation_id;
                        presenter.sendRequestWithID(message, response.conversation_id);
                    });
            }

            if (type == 'next') {
                presenter.sendRequestWithID(message, presenter.threadID);
            }
        }
    }

    presenter.sendRequestWithID = function(message, conversationID) {
        let sentRequest = presenter.fetchSessionJWTToken()
            .then(response => {return presenter.getResponseJSON(response);})
            .then(json => {
                    let data = {
                        "model": "gpt-4",
                        "instructions": presenter.instructions,
                        "text": message.trim(),
                        "temperature": 0.7,
                        "top_p": 1.0,
                        "conversation_id": conversationID
                      }
                    return $.ajax({
                        url: '/api/v2/openai/responses/send_message',
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        headers: {
                            'Authorization': 'JWT ' + json.token
                        },
                        data: JSON.stringify(data)
                    })}).then(response => {
                        if (response.length !== 0 && inView() && presenter.isFetching.request && !presenter.pageChanged) {
                            presenter.isFetching.request = false;
                            if (presenter.voiceMuted) {
                                removeLoader();
                                presenter.handleInput('enable');
                                focusOn('textInput');
                                presenter.addMessage(response.message.role, 'write', response.message.text);
                                presenter.sendEventData('response', response.message.text);
                            } else {
                                readText(response.message.text)
                                .then( () => {
                                    removeLoader();
                                    presenter.handleInput('enable');
                                    focusOn('textInput');
                                    presenter.addMessage(response.message.role, 'write', response.message.text);
                                    presenter.sendEventData('response', response.message.text);
                                    if (presenter.isMobile && presenter.audioElement) {
                                        $(presenter.view).one('touchstart', (event) => {
                                            event.stopPropagation();
                                            if (!presenter.voiceMuted) presenter.audioElement.play()
                                            .then(() => { return presenter.sendEventData('chat_audio', 'playing'); })
                                            .catch((error) => { console.error("Playback failed:", error); });
                                        });
                                    };
                                });
                            };
                        };
                    }).catch(error => {
                removeLoader();
                presenter.handleInput('enable');
                focusOn('textInput');
                presenter.removeMessage(presenter.getLastMessage());
                presenter.sendEventData('error', error.status);
            });
        return sentRequest;
    }


    presenter.getFirstMessageType = function () {
        if (!isEmpty(presenter.hiddenPrompt)) return 'hiddenPrompt';
        for (let element of presenter.welcomeText) {
            if (!isEmpty(element.Text.trim())) return 'welcomeText';
        };
        return 'user';
    };

    presenter.getLastMessage = function () {
        let chatMessages = Array.from(presenter.view.querySelector('.ai-chat-messages').children);
        chatMessages = chatMessages.filter(el => !el.classList.contains('error-message') && !el.classList.contains('ai-loader-container') && !el.classList.contains('ai-chat-suggestions-container'));
        return chatMessages[chatMessages.length - 1];
    };

    presenter.getMessageById = function (id) {
        return presenter.view.querySelector('[message-id="'+ id + '"]');
    };

    presenter.getSuggestionByIndex = function (index) {
        let suggestions = $(presenter.view).find('.ai-chat-suggestions-container > .ai-suggestion');
        if (index < suggestions.length) return suggestions[index];
        return null;
    }

    presenter.getAndCleanUserInput = function () {
        let textInput = presenter.view.querySelector('.text-input');
        let message = textInput.value;
        textInput.value = '';
        return message;
    };

    presenter.conversate = function () {
        presenter.startConversation();
        presenter.savedChatHistory.messages.forEach( (message, index) => {
            presenter.addMessage(message.role, 'insert', message.text, index + 1);
        });
    };

    presenter.startConversation = function () {
        if (presenter.savedChatHistory.messages.length != 0) return;

        if (presenter.getFirstMessageType() == 'welcomeText') {
            createLoader();
            presenter.handleInput('disable');
            setTimeout( () => {
                let random = generateNumber(0, presenter.welcomeText.length - 1);
                if (presenter.voiceMuted) {
                    removeLoader();
                    presenter.handleInput('enable');
                    presenter.addMessage('assistant', 'write', presenter.welcomeText[random].Text);
                } else {
                    readText(presenter.welcomeText[random].Text)
                    .then( () => {
                        removeLoader();
                        presenter.handleInput('enable');
                        presenter.addMessage('assistant', 'write', presenter.welcomeText[random].Text);
                    });
                };
            }, 1350)
        } else if (presenter.getFirstMessageType() == 'hiddenPrompt') {
            presenter.sendRequest(presenter.hiddenPrompt);
        } else if (presenter.getFirstMessageType() == 'user') {
            setTimeout( () => { presenter.showSuggestions() }, 1000);
        };
    };

    presenter.updateChatHistory = function(who, message, number) {
        let newObject = {
            text: message,
            role: who,
            id: number,
        };
        presenter.savedChatHistory.messages.push(newObject);
    };

    function convertMarkdown(text) {

        //Headings
        text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        //Bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        //Links
        text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
        //Line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    };

    presenter.addMessage = function (sender, mode, content, index) {
        let chatMessages = presenter.view.querySelector('.ai-chat-messages');

        let newMessage = document.createElement('div');
        newMessage.className = `ai-message ${sender}-message`;

        let messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        newMessage.appendChild(messageContent);

        if (!isEmpty(content.trim()) && chatMessages !== null) {
            chatMessages.appendChild(newMessage);

            if (mode == 'write') {
                let messageID = presenter.savedChatHistory.messages.length + 1;
                presenter.updateChatHistory(sender, content, messageID);
                if (sender == 'user') {
                    messageContent.innerHTML = convertMarkdown(content);
                    newMessage.setAttribute('message-id', messageID);
                    scrollDown();
                };
                if (sender == 'assistant') {
                    newMessage.setAttribute('message-id', messageID);
                    animateText(messageContent, convertMarkdown(content))
                    .then( () => {
                        if (presenter.savedChatHistory.messages.length == 1) setTimeout( () => { presenter.showSuggestions() }, 500);
                        if (presenter.translationLanguages) addTranslatePanel(newMessage);
                        scrollDown();
                    })
                };
            } else {
                let messageID = index;
                messageContent.innerHTML = convertMarkdown(content);
                newMessage.setAttribute('message-id', messageID);
                if (sender == 'assistant' && chatMessages.children.length == 1) presenter.showSuggestions();
                if (sender == 'assistant' && presenter.translationLanguages) addTranslatePanel(newMessage);
                scrollDown();
            };
        };
    };

    presenter.removeMessage = function (element) {
        let chatMessages = presenter.view.querySelector('.ai-chat-messages').children;
        if (presenter.savedChatHistory.messages.length !== 0 && element) {
            let messagesArray = presenter.savedChatHistory.messages;
            let newArray = messagesArray.filter( (message) => message.text !== element.textContent );
            presenter.savedChatHistory.messages = newArray;
            for (let div of chatMessages) {
                if (div == element) fadeOutElement(div);
            };
        };
        scrollToMessage(presenter.getLastMessage());
    };

    presenter.handleInput = function (action) {
        handleElement('textInput', action);
        handleElement('buttonInput', action);
        handleElement('buttonRecord', action);
    };

    presenter.showSuggestions = function () {
        if (presenter.usesSuggestions()) {
            let chatMessages = presenter.view.querySelector('.ai-chat-messages');

            let container = document.createElement('div');
            container.className = 'ai-chat-suggestions-container';
            if (chatMessages !== null) {
                if (presenter.getFirstMessageType() == 'welcomeText') {
                    chatMessages.firstElementChild.after(container);
                } else if (presenter.getFirstMessageType() == 'user') {
                    chatMessages.prepend(container);
                };
            };

            presenter.suggestions.forEach( suggestion => {
                let newSuggestion = document.createElement('div');
                newSuggestion.className = 'ai-suggestion';
                newSuggestion.textContent = suggestion.Text;
                newSuggestion.addEventListener('click', () => { presenter.sendRequest(suggestion.Text) });
                container.appendChild(newSuggestion);
            });

            scrollDown();

        };
    };

    presenter.usesSuggestions = function () {
        for (let element of presenter.suggestions) {
            if (!isEmpty(element.Text.trim())) return true;
        };
        return false;
    };

    //-===-===-===-=== RECORDING ===-===-===-===-\\

    function initiateMedia () {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false})
        .then(presenter.setRecordingEnvironment)
        .catch( function (error) {
            console.log(error);
        });
    };

    presenter.setRecordingEnvironment = function (stream) {

        let recordButton = presenter.view.querySelector('.button-record');

        let supportedAudios = presenter.getSupportedMimeTypes('Audio');
        let options = {mimeType: supportedAudios[0]};
        console.log("supported audios");
        console.log(supportedAudios);
        let preferredMobileMimeType = "Audio/mp4;codecs=mp4a";
        if (presenter.isMobile && supportedAudios.indexOf(preferredMobileMimeType) > -1) options = {mimeType: preferredMobileMimeType}
        let recordedChunks = [];

        presenter.mediaRecorder = new MediaRecorder(stream, options);

        presenter.mediaRecorder.addEventListener('dataavailable', function (event) {
            if (event.data.size > 0) recordedChunks.push(event.data);
            let file = new Blob(recordedChunks, { type: 'audio/mp4' });
            convertToBase64(file)
            .then(base64 => presenter.handleRecording(base64));
            createLoader('transcript');
        });

        presenter.mediaRecorder.addEventListener('stop', function() {
            // add buttons handling
        });

        presenter.mediaRecorder.addEventListener('start', function() {
            // add buttons handling
        });

        recordButton.addEventListener('click', function () {
            if (!recordButton.classList.contains('active')) {
                try {
                    recordedChunks = [];
                    presenter.mediaRecorder.start();
                    handleElement('textInput', 'disable');
                    handleElement('buttonInput', 'disable');
                    $(recordButton).toggleClass('active', true);
                    presenter.sendEventData('recording', 'start');
                } catch (error) {
                    createErrorMessage();
                    presenter.sendEventData('recording', 'error');
                };
            } else {
                presenter.mediaRecorder.stop();
                $(recordButton).toggleClass('active', false);
                handleElement('buttonRecord', 'disable');
                presenter.sendEventData('recording', 'stop');
            };
        });
    };

    presenter.getSupportedMimeTypes = function(media) {
        const types = ["webm", "ogg", "mp3", "x-matroska", "mp4"];
        const codecs = ["should-not-be-supported","vp9", "vp9.0", "vp8", "vp8.0", "avc1", "av1", "h265", "h.265", "h264", "h.264", "opus", "pcm", "aac", "mpeg", "mp4a"];
        const isSupported = MediaRecorder.isTypeSupported;
        const supported = [];
        types.forEach((type) => {
            const mimeType = `${media}/${type}`;
            codecs.forEach((codec) => [
                `${mimeType};codecs=${codec}`,
                `${mimeType};codecs=${codec.toUpperCase()}`,
            ].forEach(variation => {
                if (isSupported(variation))
                    supported.push(variation);
            }));
            if (isSupported(mimeType))
            supported.push(mimeType);
        });
        return supported;
    };

    presenter.handleRecording = function(base64string) {
        presenter.fetchSessionJWTToken()
        .then(response => {return presenter.getResponseJSON(response);})
        .then(json => {
            return fetch("/api/v2/openai/audio/transcriptions", {
                method: 'POST',
                headers: {
                    'Authorization': 'JWT ' + json.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "file": `${base64string}`,
                    "model": "whisper-1",
                    "language": `${presenter.language.slice(0,2)}`
                }),
            });
        })
        .then(response => {
            presenter.handleInput('enable');
            if (response.ok) return response.json();
            if (!response.ok) return Promise.reject(response);
        })
        .then(response => {
            if (inView() && presenter.isFetching.request && !presenter.pageChanged) {
                presenter.isFetching.request = false;
                removeLoader();
                presenter.sendRequest(response);
            };
        })
        .catch(error => {
            removeLoader();
            presenter.handleInput('enable');
            //createErrorMessage(error.status);
            scrollToMessage(presenter.getLastMessage());
            presenter.sendEventData('error', error.status);
        });
    };

    presenter.sendEventData = function (item, value) {
        let eventData = presenter.createEventData(item, value);
        if (presenter.playerController !== null) {
            presenter.eventBus.sendEvent('ValueChanged', eventData);
        };
    };

    presenter.createEventData = function (item, value) {
        let data = {
            source: presenter.model.ID,
            item: item,
            value: value,
        };
        return data;
    };

    presenter.setVisibility = function (isVisible) {
        $(presenter.view).css('visibility', isVisible ? 'visible' : 'hidden');
        presenter.isVisible = isVisible;
        presenter.sendEventData('visibility', `${isVisible}`);
    };

    presenter.show = function() {
        if (!presenter.isValid) return;
        if (presenter.classNames.show.length > 0) {
            presenter.showAnimated();
        } else {
            presenter.setVisibility(true);
        }
    };

    presenter.hide = function() {
        if (!presenter.isValid) return;
        if (presenter.classNames.hide.length > 0) {
            presenter.hideAnimated();
        } else {
            presenter.setVisibility(false);
        }
    };

    presenter.showAnimated = function() {
        if (!presenter.isValid) return;
        let closeName = presenter.classNames.hide.length > 0 ? presenter.classNames.hide : 'close';
        let openName = presenter.classNames.show.length > 0 ? presenter.classNames.show : 'open';
        presenter.view.classList.remove(closeName);
        presenter.view.classList.add(openName);
        presenter.isVisible = true;
        presenter.sendEventData('visibility', `true`);
    }

    presenter.hideAnimated = function() {
        if (!presenter.isValid) return;
        let closeName = presenter.classNames.hide.length > 0 ? presenter.classNames.hide : 'close';
        let openName = presenter.classNames.show.length > 0 ? presenter.classNames.show : 'open';
        presenter.view.classList.remove(openName);
        presenter.view.classList.add(closeName);
        presenter.isVisible = false;
        presenter.sendEventData('visibility', `false`);
    }

    presenter.setState = function (state) {
        let parsedState = JSON.parse(state)

        presenter.savedChatHistory = parsedState.savedChatHistory;
        presenter.threadID = parsedState.threadID;
        presenter.voiceMuted = parsedState.voiceMuted;
        if (presenter.isVisible !== parsedState.isVisible) {
            if (parsedState.isVisible) {
                presenter.show();
            } else {
                presenter.hide();
            }
        }
    };

    presenter.getState = function () {
        presenter.pageChanged = true;
        return JSON.stringify({
            savedChatHistory: presenter.savedChatHistory,
            threadID: presenter.threadID,
            voiceMuted: presenter.voiceMuted,
            isVisible: presenter.isVisible
        });
    };

    // === === === HANDLERS === === === \\

    presenter.requestTranslation = function (message, code) {
        let promptDetails = `${message.text}`;

        let data = {
            model: 'gpt-4',
            instructions: `You are a professional translation assistant. Translate the following text from its original language to the language with an ISO 639 code "${code}" accurately, maintaining the original meaning and context. Always return only the translation, do not include any other words or comments in your response. If the original language is the same as the target language - return the original text.`,
            text: promptDetails,
            temperature: 0,
            max_tokens: 900,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        };

        presenter.isFetching.translation = true;

        return presenter.fetchSessionJWTToken()
                .then(response => {return presenter.getResponseJSON(response);})
                .then(json => $.ajax({
                    url: `/api/v2/openai/responses/conversation`,
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                        'Authorization': 'JWT ' + json.token
                    }
                })).then(conversation_json => {
                    data.conversation_id = conversation_json.conversation_id;
                    return presenter.fetchSessionJWTToken().then(response => {return presenter.getResponseJSON(response);});
                }).then(json => $.ajax({
                    url: '/api/v2/openai/responses/send_message',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                        'Authorization': 'JWT ' + json.token
                    },
                    data: JSON.stringify(data)
                })).then(response => {
                    presenter.isFetching.request = false;
                    return response.message.text;
                }).catch(error => {
                    console.error('Something went wrong:', error);
                    throw new Error(error);
                });

    };

    function handleTranslateButton(event, messageData) {
        event.stopPropagation();

        let languageCode = messageData.label.textContent.toLowerCase();
        let translatedMessage = presenter.savedChatHistory.translations[languageCode][messageData.messageIndex];

        let isSmall = messageData.button.classList.contains('small');
        if (isSmall) {
            showTranslatePanel(messageData);
        } else if (!presenter.isFetching.translation) {
            $(messageData.button).toggleClass('pressed');
            if (messageData.button.classList.contains('pressed')) {
                $(messageData.selector).toggleClass('pressed', true);
                if (!translatedMessage) {
                    createSpinner(messageData.message);
                    return presenter.requestTranslation(messageData.savedMessage, languageCode)
                    .then(translation => {
                        if (inView() && presenter.isFetching.translation && !presenter.pageChanged) {
                            presenter.savedChatHistory.translations[languageCode][messageData.messageIndex] = translation;
                            translatedMessage = presenter.savedChatHistory.translations[languageCode][messageData.messageIndex];
                            messageData.content.innerHTML = convertMarkdown(translatedMessage);
                            removeSpinner(messageData.message);
                            scrollToMessage(messageData.message);
                            presenter.isFetching.translation = false;
                        };
                    })
                    .catch(error => {
                        presenter.isFetching.translation = false;
                        $(messageData.button).toggleClass('pressed', false);
                        $(messageData.selector).toggleClass('pressed', false);
                        removeSpinner(messageData.message);
                    })
                } else if (translatedMessage) {
                    messageData.content.innerHTML = convertMarkdown(translatedMessage);
                    scrollToMessage(messageData.message);
                };
            } else {
                $(messageData.selector).toggleClass('pressed', false);
                messageData.content.innerHTML = convertMarkdown(messageData.savedMessage.text);
                scrollToMessage(messageData.message);
            };
        };
    };

    function handleLanguageChoice(event, messageData) {
        event.stopPropagation();

        let currentIndex = Array.from(messageData.list.children).indexOf(event.target);
        assignLabelLanguage(m, currentIndex);
        $(messageData.button).toggleClass('pressed', false);
        $(messageData.selector).toggleClass('pressed', false);
        $(messageData.list).toggleClass('hidden', true);
        messageData.content.innerHTML = convertMarkdown(messageData.savedMessage.text);
    };

    function addTranslatePanel(message) {

        let content = message.querySelector('.message-content');
        let savedMessage = presenter.savedChatHistory.messages.find(el => el.id == message.getAttribute('message-id'));
        let messageIndex = presenter.savedChatHistory.messages.indexOf(savedMessage);

        let panel = document.createElement('div'),
        container = document.createElement('div'),
        selector = document.createElement('button'),
        button = document.createElement('button'),
        list = document.createElement('div'),
        label = document.createElement('div'),
        text = document.createElement('div'),
        flag = document.createElement('div');

        panel.className = 'ai-translate-panel';
        container.className = 'ai-translate-container';
        selector.className = 'ai-translate-selector hidden';
        button.className = 'ai-translate-button small';
        list.className = 'ai-translate-list hidden';
        label.className = 'label';
        text.className = 'lang-text';
        flag.className = 'lang-flag';

        panel.appendChild(container);
        container.appendChild(selector);
        container.appendChild(button);
        selector.appendChild(label);
        selector.appendChild(list);
        label.appendChild(text);
        label.appendChild(flag);

        message.appendChild(panel);

        let data = {
            message: message,
            content: content,
            savedMessage: savedMessage,
            messageIndex: messageIndex,
            panel: panel,
            container: container,
            selector: selector,
            button: button,
            list: list,
            label: label,
            text: text,
            flag: flag
        };

        presenter.translationLanguages.forEach( code => { addLanguageButton(code, data); });
        let firstLanguageIndex = 0;
        assignLabelLanguage(data, firstLanguageIndex);
        button.textContent = 'Translate';

        $(message).on('mouseenter', () => { if (!presenter.isMobile) showTranslatePanel(data); });
        $(message).on('mouseleave', () => { if (!presenter.isMobile) hideTranslatePanel(data); });
        $(message).on('click', (event) => {
            if (presenter.isMobile) toggleTranslatePanel(data);
            if (!presenter.isMobile) hideLanguageList(event, data);
        });
        $(selector).on('click', (event) => { toggleLanguageList(event, data); });
        $(button).on('click', (event) => { handleTranslateButton(event, data) });
    };

    function animateText(element, html, delay = 65) {
        return new Promise((resolve) => {
            let words = splitHTML(html);
            element.innerHTML = '';
            let index = 0;

            function displayNextWord() {
                if (presenter.pageChanged) {
                    element.innerHTML = html;
                    resolve("Animation interrupted");
                    return;
                };

                if (index < words.length) {
                    if (typeof(words[index]) == 'string') {
                        element.innerHTML += words[index] + ' ';
                    } else if (words[index].nodeType) {
                        element.appendChild(words[index]);
                    };
                    index++;
                    setTimeout(() => {displayNextWord(); scrollDown()}, delay);
                } else {
                    resolve("Animation completed");
                };
            };

            displayNextWord();
        });
    };

    function splitHTML(html) {
        let list = [];
        let temp = document.createElement('div');
        temp.innerHTML = html;
        temp.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let words = node.textContent.split(' ');
                words.forEach(el => list.push(el));
            };
            if (node.nodeType == Node.ELEMENT_NODE) list.push(node);
        });
        return list;
    };

    function inView() {
        let addon = document.getElementById(`${presenter.model.ID}`);
        if (addon) {
            return addon.querySelector('.ai-chat-window');
        } else {
            return false;
        };
    };

    function handleListeners() {
        const buttonInput = presenter.view.querySelector('.button-input');
        const buttonClose = presenter.view.querySelector('.ai-close-btn');
        const buttonMute = presenter.view.querySelector('.ai-mute-btn');
        const textInput = presenter.view.querySelector('.text-input');

        buttonInput.addEventListener('click', () => { if (!presenter.isFetching.request) presenter.sendRequest() });
        textInput.addEventListener('keyup', (event) => {
            if (!presenter.isFetching.request) {
                if (event.key == 'Enter' || event.keyCode == 13) {
                    presenter.sendRequest();
                    presenter.speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.messageSent)]);
                }
            };
        });
        textInput.addEventListener('keydown', (event) => {
            if (presenter.WCAGState.status === presenter.WCAGSTATUS.TEXT_INPUT && (event.key === 'Tab' || event.keyCode === 9)) {
                event.preventDefault();
            }
        });
        textInput.addEventListener('keypress', (event) => {
            if (presenter.WCAGState.status === presenter.WCAGSTATUS.TEXT_INPUT && (event.key === 'Tab' || event.keyCode === 9)) {
                event.preventDefault();
            }
        });
        buttonClose.addEventListener('click', () => {
            presenter.hide();
        });
        buttonMute.addEventListener('click', () => { handleMuteButton() });

    };

    function handleDragging(element) {
        let page = document.querySelector('.ic_page');
        let handler = presenter.headerHidden ? element : element.querySelector('.ai-chat-header');
        $(element).draggable( {
            containment: page,
            handle: handler,
        });

        $(element).resizable( {
            containment: page,
            minHeight: 220,
            minWidth: 240,
        });
    };

    function handleHeader(element) {
        let header = element.querySelector('.ai-chat-header');
        let closeButton = element.querySelector('.ai-close-btn');
        let headerName = presenter.view.querySelector('.ai-chat-header-name');
        headerName.textContent = presenter.chatName;
        if (presenter.headerHidden) {
            $(header).css({'display' : 'none'});
            $(closeButton).css({'display' : 'none'});
        };
    };

    function readText(text) {
        let readingSpeed = presenter.readingSpeed > 0.25 && presenter.readingSpeed < 4 ? presenter.readingSpeed : 1.0;
        let voiceType = presenter.voiceType ? presenter.voiceType : 'onyx';
        return presenter.requestSpeech(text, readingSpeed, voiceType)
        .then((audio) => {
            presenter.audioElement = audio;
            if (!presenter.voiceMuted) presenter.audioElement.play()
            .then(() => { return presenter.sendEventData('chat_audio', 'playing'); })
            .catch((error) => { console.error("Playback failed:", error); });
        });
    };

    presenter.requestSpeech = function (text, speed = 1.0, voice = 'onyx') {

        return presenter.fetchSessionJWTToken()
        .then(response => response.json())
        .then(json => {
            return fetch("/api/v2/openai/audio/speech", {
                method: 'POST',
                headers: {
                    'Authorization': 'JWT ' + json.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "text": `${text}`,
                    "model": "tts-1",
                    "voice": `${voice}`,
                    "response_format": "mp3",
                    "speed": `${speed}`
                })
            });
        })
        .then(response => {
            return response.arrayBuffer();
        })
        .then(arrayBuffer => {
            if (inView() && presenter.isFetching.request && !presenter.pageChanged) {
                presenter.isFetching.request = false;
                presenter.stopReading();
                let audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
                let audioUrl = URL.createObjectURL(audioBlob);
                let audioElement = new Audio(audioUrl);
                presenter.sendEventData('requested_audio', 'available');
                return audioElement;
            };
        })
        .catch(error => {
            console.error('Something went wrong:', error);
        });
    };

    presenter.stopReading = function() {
        if (presenter.audioElement) presenter.audioElement.pause();
    };

    function handleMuteState() {
        let buttonMute = presenter.view.querySelector('.ai-mute-btn');
        if (presenter.voiceMuted == true) $(buttonMute).toggleClass('unmuted', false);
        if (presenter.voiceMuted == false) $(buttonMute).toggleClass('unmuted', true);
    };

    function handleMuteButton() {
        if (presenter.voiceMuted == true) {
            presenter.voiceMuted = false;
            presenter.sendEventData('muted', 0);
        } else if (presenter.voiceMuted == false) {
            presenter.voiceMuted = true;
            presenter.sendEventData('muted', 1);
            presenter.stopReading();
        };
        handleMuteState();
    };

    // === === === HELPERS === === === \\

    function assignLabelLanguage(messageData, index) {
        let targetLang = Array.from(messageData.list.children)[index];
        if (targetLang === undefined) return;
        $(messageData.flag).css({'background-image' : `${targetLang.querySelector('.lang-flag').style.backgroundImage}`});
        messageData.text.textContent = targetLang.querySelector('.lang-text').textContent;
    }

    function addLanguageButton(languageCode, messageData) {
        let lang = document.createElement('div');
        let text = document.createElement('div');
        let flag = document.createElement('div');
        lang.className = 'lang';
        text.className = 'lang-text';
        text.textContent = languageCode.toUpperCase();
        flag.className = 'lang-flag';
        $(flag).css({ 'background-image' : `var(--flag-${languageCode})`});
        lang.appendChild(text);
        lang.appendChild(flag);
        $(lang).on('click', (event) => { handleLanguageChoice(event, messageData) });
        messageData.list.append(lang);
    };

    function showTranslatePanel(messageData) {
        $(messageData.list).toggleClass('hidden', true);
        $(messageData.selector).toggleClass('hidden', false);
        $(messageData.button).toggleClass('small', false);
        messageData.button.classList.contains('pressed') ? $(messageData.selector).toggleClass('pressed', true) : $(messageData.selector).toggleClass('pressed', false);
    };

    function hideTranslatePanel(messageData) {
        $(messageData.selector).toggleClass('hidden', true);
        $(messageData.button).toggleClass('small', true);
        $(messageData.list).toggleClass('hidden', true);
        messageData.button.classList.contains('pressed') ? $(messageData.selector).toggleClass('pressed', true) : $(messageData.selector).toggleClass('pressed', false);
    };

    function toggleTranslatePanel(messageData) {
        $(messageData.selector).toggleClass('hidden');
        $(messageData.button).toggleClass('small');
        if (messageData.selector.classList.contains('hidden')) {
            $(messageData.list).toggleClass('hidden', true);
            $(messageData.selector).toggleClass('pressed', false);
        };
        messageData.button.classList.contains('pressed') ? $(messageData.selector).toggleClass('pressed', true) : $(messageData.selector).toggleClass('pressed', false);
    };

    function toggleLanguageList(event, messageData) {
        event.stopPropagation();
        if (!presenter.isFetching.translation) {
            messageData.button.classList.contains('pressed') ? $(messageData.selector).toggleClass('pressed', true) : $(messageData.selector).toggleClass('pressed');
            messageData.selector.classList.contains('pressed') ? $(messageData.list).toggleClass('hidden', false) : $(messageData.list).toggleClass('hidden', true);
        };
    };

    function hideLanguageList(event, messageData) {
        event.stopPropagation();
        if (!presenter.isFetching.translation && !messageData.list.classList.contains('hidden')) {
            $(messageData.list).toggleClass('hidden', true);
            if (!messageData.button.classList.contains('pressed')) $(messageData.selector).toggleClass('pressed', false);
        };
    };

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0;
    };

    function listLanguages(string) {
        let list = string.trim().split(';');
        if (isEmpty(string) || list.some(el => el.length !== 2)) {
            return false;
        } else {
            return list;
        };
    };

    function convertToBase64(blob) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.replace(/^data:.*;base64,/, ''));
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    };

    function scrollDown() {
        let chatMessages = presenter.view.querySelector('.ai-chat-messages');
        if (chatMessages) chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    };

    function scrollToMessage(element) {
        if (element) {
            let chatMessages = presenter.view.querySelector('.ai-chat-messages');
            let messageTop = parseFloat(element.offsetTop);
            if (chatMessages && !isNaN(messageTop)) {
                chatMessages.scrollTo({
                    top: messageTop,
                    behavior: 'smooth'
                });
            } else {
                scrollDown();
            };
        } else {
            scrollDown();
        };
    };

    function createErrorMessage(errorCode) {
        let chatMessages = presenter.view.querySelector('.ai-chat-messages');
        let error = document.createElement('div');
        error.className = 'ai-message error-message';
        if (errorCode) {
            let codes = Object.keys(errorMessages);
            if (codes.includes(errorCode)) {
                error.textContent = errorMessages[errorCode];
            } else {
                error.textContent = `Something went wrong, please try again.`;
            };
        } else {
            error.textContent = `Something went wrong, please try again.`;
        };
        chatMessages.appendChild(error);
        setTimeout( () => { fadeOutElement(error) }, 3000);
    };

    function createSpinner(message) {
        if (message) {
            let translatePanel = message.querySelector('.ai-translate-panel');
            let spinnerContainer = document.createElement('div');
            let spinner = document.createElement('div');
            spinnerContainer.className = 'ai-spinner-container';
            spinner.className = 'ai-message-spinner';
            spinnerContainer.appendChild(spinner);
            message.insertBefore(spinnerContainer, translatePanel);
        };
    };

    function removeSpinner(message) {
        if (message) {
            let spinnerContainer = message.querySelector('.ai-spinner-container');
            if (spinnerContainer) fadeOutElement(spinnerContainer);
        };
    };

    function createLoader(type) {
        let chatMessages = presenter.view.querySelector('.ai-chat-messages');
        let loaderContainer = document.createElement('div');
        let loader = document.createElement('div');
        loaderContainer.className = 'ai-loader-container';
        loader.className = 'ai-loader';
        for (let a = 1; a <= 3; a++) {
            let dot = document.createElement('div');
            dot.className = 'dot';
            loader.appendChild(dot);
        };
        if (type == 'transcript') $(loaderContainer).addClass('transcript');
        loaderContainer.appendChild(loader);
        chatMessages.appendChild(loaderContainer);
        scrollDown();
    };

    function removeLoader() {
        let loaderContainer = presenter.view.querySelector('.ai-loader-container');
        if (loaderContainer) loaderContainer.remove();
    };

    function fadeOutElement(element) {
        $(element).toggleClass('faded-out', true);
        $(element).on('animationend transitionend', () => {
            $(element).css({ maxHeight: 0, fontSize: 0, padding: 0, margin: 0 });
            setTimeout( () => {
                element.remove();
            }, 100);
        });
    };

    function handleElement(element, type) {
        const action = type === 'disable';
        let elements = {
            'textInput' : presenter.view.querySelector('.text-input'),
            'buttonInput' : presenter.view.querySelector('.button-input'),
            'buttonRecord' : presenter.view.querySelector('.button-record')
        }

        if (elements[element] !== null) {
            $(elements[element]).toggleClass('disabled', action);
            if (action) elements[element].setAttribute('disabled', '');
            if (!action) elements[element].removeAttribute('disabled');
        };
    };

    function focusOn(element) {
        let elements = {
            'textInput' : presenter.view.querySelector('.text-input'),
            'buttonInput' : presenter.view.querySelector('.button-input')
        }
        if (elements[element]) elements[element].focus();
    };

    function generateNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function isEmpty(string) {
        return string === '';
    };

    presenter.removeChatMessages = function () {
        presenter.stopReading();
        let chatMessages = presenter.view.querySelector('.ai-chat-messages').children;
        if (presenter.savedChatHistory.messages.length !== 0) {
            presenter.savedChatHistory.messages = [];
            for (let div of chatMessages) fadeOutElement(div);
        }
        presenter.startConversation();
    };

    //-===-===-===-===-====-===-===-===-===-\\

    presenter.sendEventData = function (item, obj) {
        let eventData = presenter.createEventData(item, obj);
        if (presenter.playerController !== null) {
            presenter.eventBus.sendEvent('ValueChanged', eventData);
        };
    };

    presenter.createEventData = function (item, obj) {
        var data = {
            source: presenter.model.ID,
            item: item,
            value: obj,
        }
        return data;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'showAnimated': presenter.showAnimated,
            'hideAnimated': presenter.hideAnimated,
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function () {
        presenter.handleInput('enable');
        presenter.removeChatMessages();
    };

    // === === === WCAG === === === \\

    presenter.setWCAGStatus = function (isOn) {
        presenter.isWCAGOn = isOn;
    };

    presenter.WCAGSTATUS = {
        MESSAGE: "MESSAGE",
        LAST_MESSAGE: "LAST_MESSAGE",
        TEXT_INPUT: "TEXT_INPUT",
        RECORD_BUTTON: "RECORD_BUTTON",
        SEND_BUTTON: "SEND_BUTTON",
        SUGGESTION: "SUGGESTION"
    }

    presenter.WCAGState = {
        selectedElementIndex: -1,
        status: presenter.WCAGSTATUS.LAST_MESSAGE
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {

        switch (keycode) {
            case window.KeyboardControllerKeys.TAB:
                event.stopPropagation();
                event.preventDefault();
                if (isShiftKeyDown) {
                    presenter.prevWCAGElement();
                } else {
                    presenter.nextWCAGElement();
                }
                break;
            case window.KeyboardControllerKeys.ARROW_LEFT:
                break;
            case window.KeyboardControllerKeys.ARROW_UP:
                break;
            case window.KeyboardControllerKeys.ARROW_RIGHT:
                break;
            case window.KeyboardControllerKeys.ARROW_DOWN:
                break;
            case window.KeyboardControllerKeys.ENTER:
                event.stopPropagation();
                event.preventDefault();
                if (isShiftKeyDown) {
                    presenter.clearCurrentWCAGElement();
                    presenter.blurTextInput();
                    presenter.WCAGState.status = presenter.WCAGSTATUS.LAST_MESSAGE;
                } else {
                    presenter.readCurrentElement();
                    presenter.selectCurrentWCAGElement();
                }
                break;
            case window.KeyboardControllerKeys.ESCAPE:
                presenter.clearCurrentWCAGElement();
                presenter.blurTextInput();
                presenter.WCAGState.status = presenter.WCAGSTATUS.LAST_MESSAGE;
                break;
            case window.KeyboardControllerKeys.SPACE:
                if (presenter.WCAGState.status !== presenter.WCAGSTATUS.TEXT_INPUT) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                if (presenter.WCAGState.status === presenter.WCAGSTATUS.SEND_BUTTON) {
                    let $sendButton = $(presenter.view).find('.button-input');
                    if (!$sendButton.hasClass('disabled')) {
                        $sendButton[0].click();
                        presenter.speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.messageSent)]);
                    }
                } else if (presenter.WCAGState.status === presenter.WCAGSTATUS.RECORD_BUTTON) {
                    let $sendButton = $(presenter.view).find('.button-record');
                    $sendButton[0].click();
                    if (!$sendButton.hasClass("active")) {
                        presenter.speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.finishedRecording)]);
                    }
                } else if (presenter.WCAGState.status === presenter.WCAGSTATUS.SUGGESTION) {
                    presenter.sendRequest(presenter.suggestions[presenter.WCAGState.selectedElementIndex].Text);
                }
                break;
        }
    };

    presenter.prevWCAGElement = function() {
        let shouldSelectAndRead = false;
        switch (presenter.WCAGState.status) {
            case presenter.WCAGSTATUS.LAST_MESSAGE:
                let lastMessageId = presenter.getLastMessageId();
                if (isSecondMessageLast() && presenter.usesSuggestions()) {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.SUGGESTION;
                    presenter.WCAGState.selectedElementIndex = presenter.suggestions.length - 1;
                    shouldSelectAndRead = true;
                } else {
                    let currentMessage = lastMessageId - 1;
                    if (currentMessage > 0) {
                        presenter.WCAGState.status = presenter.WCAGSTATUS.MESSAGE;
                        presenter.WCAGState.selectedElementIndex = currentMessage;
                        shouldSelectAndRead = true;
                    }
                }
                break;
            case presenter.WCAGSTATUS.TEXT_INPUT:
                if (isFirstMessageLast() && presenter.usesSuggestions()) {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.SUGGESTION;
                    presenter.WCAGState.selectedElementIndex = presenter.suggestions.length - 1;
                    shouldSelectAndRead = true;
                } else {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.LAST_MESSAGE;
                    shouldSelectAndRead = true;
                }
                break;
            case presenter.WCAGSTATUS.RECORD_BUTTON:
                presenter.WCAGState.status = presenter.WCAGSTATUS.TEXT_INPUT;
                shouldSelectAndRead = true;
                break;
            case presenter.WCAGSTATUS.SEND_BUTTON:
                presenter.WCAGState.status = presenter.WCAGSTATUS.RECORD_BUTTON;
                shouldSelectAndRead = true;
                break;
            case presenter.WCAGSTATUS.SUGGESTION:
                if (presenter.WCAGState.selectedElementIndex > 0) {
                    presenter.WCAGState.selectedElementIndex -= 1;
                } else {
                    if (isFirstMessageLast()) {
                        presenter.WCAGState.status = presenter.WCAGSTATUS.LAST_MESSAGE;
                    } else {
                        presenter.WCAGState.status = presenter.WCAGSTATUS.MESSAGE;
                        presenter.WCAGState.selectedElementIndex = 1;
                    }
                }
                shouldSelectAndRead = true;
                break;
            default: //presenter.WCAGSTATUS.MESSAGE
                if (presenter.WCAGState.selectedElementIndex === 2 && presenter.usesSuggestions()) {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.SUGGESTION;
                    presenter.WCAGState.selectedElementIndex = presenter.suggestions.length - 1;
                    shouldSelectAndRead = true;
                } else {
                    if (presenter.WCAGState.selectedElementIndex > 1) {
                        presenter.WCAGState.selectedElementIndex -= 1;
                        shouldSelectAndRead = true;
                    }
                }
                break;
        }
        if (shouldSelectAndRead) {
            presenter.selectCurrentWCAGElement();
            presenter.readCurrentElement();
        }
    }

    presenter.nextWCAGElement = function() {
        switch (presenter.WCAGState.status) {
        case presenter.WCAGSTATUS.LAST_MESSAGE:
            if (isFirstMessageLast() && presenter.usesSuggestions()) {
                presenter.WCAGState.status = presenter.WCAGSTATUS.SUGGESTION;
                presenter.WCAGState.selectedElementIndex = 0;
            } else {
                presenter.WCAGState.status = presenter.WCAGSTATUS.TEXT_INPUT;
            }
            break;
        case presenter.WCAGSTATUS.TEXT_INPUT:
            presenter.WCAGState.status = presenter.WCAGSTATUS.RECORD_BUTTON;
            break;
        case presenter.WCAGSTATUS.RECORD_BUTTON:
            presenter.WCAGState.status = presenter.WCAGSTATUS.SEND_BUTTON;
            break;
        case presenter.WCAGSTATUS.SUGGESTION:
            if (presenter.WCAGState.selectedElementIndex < presenter.suggestions.length - 1) {
                presenter.WCAGState.selectedElementIndex += 1;
            } else {
                if (isFirstMessageLast()) {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.TEXT_INPUT;
                } else if (isSecondMessageLast()) {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.LAST_MESSAGE;
                } else {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.MESSAGE;
                    presenter.WCAGState.selectedElementIndex = 2;
                }
            }
            break;
        default:
            if (presenter.WCAGState.selectedElementIndex === 1 && presenter.usesSuggestions()) {
                presenter.WCAGState.status = presenter.WCAGSTATUS.SUGGESTION;
                presenter.WCAGState.selectedElementIndex = 0;
            } else {
                presenter.WCAGState.selectedElementIndex += 1;
                if (presenter.WCAGState.selectedElementIndex >= presenter.getLastMessageId()) {
                    presenter.WCAGState.status = presenter.WCAGSTATUS.LAST_MESSAGE;
                }
            }
            break;
        }
        presenter.selectCurrentWCAGElement();
        presenter.readCurrentElement();
    }
    
    function isFirstMessageLast() {
        return presenter.getLastMessageId()===1;
    }
    
    function isSecondMessageLast() {
        return presenter.getLastMessageId()===2;
    }

    presenter.blurTextInput = function() {
        $(presenter.view).find('.text-input').blur();
    }

    presenter.clearCurrentWCAGElement = function() {
        $(presenter.view).find('.keyboard_navigation_active_element').removeClass('keyboard_navigation_active_element');
    }

    presenter.selectCurrentWCAGElement = function() {
        let $element = null;
        switch (presenter.WCAGState.status) {
            case presenter.WCAGSTATUS.LAST_MESSAGE:
                let lastMessage = presenter.getLastMessage();
                scrollToMessage(lastMessage);
                $element = $(lastMessage);
                presenter.blurTextInput();
                break;
            case presenter.WCAGSTATUS.TEXT_INPUT:
                $element = $(presenter.view).find('.ai-chat-input');
                focusOn('textInput');
                break;
            case presenter.WCAGSTATUS.RECORD_BUTTON:
                $element = $(presenter.view).find('.button-record');
                presenter.blurTextInput();
                break;
            case presenter.WCAGSTATUS.SEND_BUTTON:
                $element = $(presenter.view).find('.button-input');
                break;
            case presenter.WCAGSTATUS.SUGGESTION:
                $element = $(presenter.getSuggestionByIndex(presenter.WCAGState.selectedElementIndex));
                break;
            default:
                let message = presenter.getMessageById(presenter.WCAGState.selectedElementIndex);
                scrollToMessage(message);
                $element = $(message);
                break;
        }
        if ($element === null) return;
        presenter.clearCurrentWCAGElement();
        $element.addClass('keyboard_navigation_active_element');
    }

    presenter.getLastMessageId = function() {
        let lastMessage = presenter.getLastMessage();
        let lastMessageId = lastMessage.getAttribute('message-id');
        if (lastMessageId == null || isNaN(lastMessageId)) return -1;
        return Number(lastMessageId);
    }

    presenter.readCurrentElement = function() {
        let textVoices = [];
        if (presenter.WCAGState.status === presenter.WCAGSTATUS.MESSAGE || presenter.WCAGState.status === presenter.WCAGSTATUS.LAST_MESSAGE) {
            let $message = presenter.WCAGState.status === presenter.WCAGSTATUS.LAST_MESSAGE ? $(presenter.getLastMessage()) : $(presenter.getMessageById(presenter.WCAGState.selectedElementIndex));
            if (presenter.WCAGState.status === presenter.WCAGSTATUS.LAST_MESSAGE) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.lastMessage));
            }
            if ($message.hasClass('assistant-message')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.assistantMessage + " " + $message.attr("message-id")));
            } else {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.userMessage + " " + $message.attr("message-id")));

            }
            textVoices = textVoices.concat(window.TTSUtils.getTextVoiceArrayFromElement($message.find('.message-content'), presenter.language));
            if ($message.next().length > 0 && $message.next().hasClass('ai-chat-suggestions-container')) {
                textVoices = textVoices.concat(window.TTSUtils.getTextVoiceArrayFromElement($message.next(), presenter.language));
            }
        }
        if (presenter.WCAGState.status === presenter.WCAGSTATUS.TEXT_INPUT) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.textInput));
            let $textArea = $(presenter.view).find('.text-input');
            if ($textArea.hasClass('disabled')) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.disabled, presenter.language));
            }
            let textAreaValue = $textArea[0].value;
            textVoices.push(window.TTSUtils.getTextVoiceObject(textAreaValue));
        }
        if (presenter.WCAGState.status === presenter.WCAGSTATUS.RECORD_BUTTON) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.recordButton));
            if ($(presenter.view).find('.button-record').hasClass("active")) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.active));
            }
        }
        if (presenter.WCAGState.status === presenter.WCAGSTATUS.SEND_BUTTON) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.sendButton));
            if ($(presenter.view).find('.button-input').hasClass("disabled")) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.disabled));
            }
        }
        if (presenter.WCAGState.status === presenter.WCAGSTATUS.SUGGESTION) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.suggestion + ' ' + (presenter.WCAGState.selectedElementIndex + 1)));
            let suggestion = presenter.getSuggestionByIndex(presenter.WCAGState.selectedElementIndex);
            textVoices = textVoices.concat(window.TTSUtils.getTextVoiceArrayFromElement($(suggestion), presenter.language));
        }
        presenter.speak(textVoices);
    }



    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.speak = function (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    return presenter;
}