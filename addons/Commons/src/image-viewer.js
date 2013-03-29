/**
 * @module commons
 */
(function (window) {
    /**
     Image Viewer Addon logic and common
     @class Image Viewer
     */
    // Expose utils to the global object
    window.ImageViewer = {
        /**
         Validates sound sources array and assigns it to element corresponding to frame change (i.e. second element will
         contain sound to be played while changing frame from first to second.
         @method validateSound
         @param soundsArray array of sound definition objects containing 'MP3 sound', 'AAC sound' and 'OGG sound' sources
         @return {Array} array of sounds sources
         */
        validateSound: function validateSound(soundsArray) {
            var sounds = [];

            if (soundsArray && $.isArray(soundsArray)) {
                for (var i = 0; i < soundsArray.length; i++) {
                    var isMP3Empty = ModelValidationUtils.isStringWithPrefixEmpty(soundsArray[i]['MP3 sound'], '/file/');
                    var isAACEmpty = ModelValidationUtils.isStringWithPrefixEmpty(soundsArray[i]['AAC sound'], '/file/');
                    var isOGGEmpty = ModelValidationUtils.isStringWithPrefixEmpty(soundsArray[i]['OGG sound'], '/file/');
                    var isEmpty = isMP3Empty && isAACEmpty && isOGGEmpty;

                    sounds.push({
                        AAC: isAACEmpty ? "" : soundsArray[i]['AAC sound'],
                        OGG: isOGGEmpty ? "" : soundsArray[i]['OGG sound'],
                        MP3: isMP3Empty ? "" : soundsArray[i]['MP3 sound'],
                        isEmpty: isEmpty
                    });
                }
            }

            return {
                sounds:sounds
            };
        },

        /**
         Parsed array of sounds sources into array of sounds objects and pre loads them.
         @method loadSounds
         @param {Array} sounds array of sounds sources
         @param {Number} framesCount number of frames
         @return {Array} array of loaded sounds objects
         */
        loadSounds: function loadSounds(sounds, framesCount) {
            var audioElements = [];

            if (!buzz.isSupported()) {
                return audioElements;
            }

            if (!sounds || !framesCount) {
                return audioElements;
            }

            for (var i = 0; i < framesCount; i++) {
                if ((i > sounds.length - 1 ) || sounds[i].isEmpty) {
                    audioElements[i] = null;
                } else {
                    if (sounds[i].MP3 !== "" && buzz.isMP3Supported()) {
                        audioElements[i] = new buzz.sound(sounds[i].MP3);
                    } else if (sounds[i].OGG !== "" && buzz.isOGGSupported()) {
                        audioElements[i] = new buzz.sound(sounds[i].OGG);
                    } else {
                        audioElements[i] = new buzz.sound(sounds[i].AAC);
                    }

                    audioElements[i].load();
                }
            }

            return audioElements;
        },

        /**
         Converts frames numbers (counted from min to frames count) list separated with commas.
         Conversion error codes:
         FL01 - list undefined or empty
         FL02 - list syntax incorrect (probably wrong separator)
         FL03 - frame number invalid
         FL04 - frame number missing inside list
         FL05 - frame numbers range incorrect

         @method convertFramesList

         @param {String} frames string representation of frames list
         @param {Number} min minimum frame number
         @param {Number} count frames count

         @return {Array} sorted array of frames numbers counted from 1 to n or error code when
         */
        convertFramesList: function (frames, min, count) {
            if (ModelValidationUtils.isStringEmpty(frames)) {
                return { isError: true, errorCode: "FL01" };
            }

            var regExp = new RegExp('[0-9a-zA-Z\,\-]+'); // Only digits and commas are allowed in slides list
            var matchResult = frames.match(regExp);
            if (matchResult === null || frames.length !== matchResult[0].length) {
                return { isError: true, errorCode: "FL02" };
            }

            var list = [], splittedFrames = frames.split(',');

            for (var i = 0; i < splittedFrames.length; i++) {
                if (ModelValidationUtils.isStringEmpty(splittedFrames[i])) {
                    return { isError: true, errorCode: "FL04" };
                }

                var indexOfRange = splittedFrames[i].search('-');
                if (indexOfRange !== -1) {
                    var rangeEnd = splittedFrames[i].split('-')[1];
                    var validatedRangeEnd = ModelValidationUtils.validateIntegerInRange(rangeEnd, count, min);
                    if (!validatedRangeEnd.isValid) {
                        return { isError: true, errorCode: "FL05" };
                    }

                    var rangeStart = splittedFrames[i].split('-')[0];
                    var validatedRangeStart = ModelValidationUtils.validateIntegerInRange(rangeStart, rangeEnd.value, min);
                    if (!validatedRangeStart.isValid || validatedRangeStart.value > validatedRangeEnd.value) {
                        return { isError: true, errorCode: "FL05" };
                    }

                    for (var frameNumber = validatedRangeStart.value; frameNumber <= validatedRangeEnd.value; frameNumber++) {
                        list.push(frameNumber);
                    }

                    continue;
                }

                var validatedFrame = ModelValidationUtils.validateIntegerInRange(splittedFrames[i], count, min);
                if (!validatedFrame.isValid) {
                    return { isError: true, errorCode: "FL03" };
                }

                list.push(validatedFrame.value);
            }

            list.sort();
            list = ModelValidationUtils.removeDuplicatesFromArray(list);

            return { isError: false, list: list };
        }
    };
})(window);