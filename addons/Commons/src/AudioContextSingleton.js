/**
 * @module commons
 */

(function (window) {
    /**
     * Audio Context singleton object accessible by all modules.
     * Should be used to handle all audio sources in need of audio-processing graph.
     */
    var AudioContextSingleton = {};

    /**
     * Get AudioContext singleton object, creating it if it does not already exist
     * @returns {AudioContext} AudioContext interface
     */
    AudioContextSingleton.getOrCreate = function () {
        if (!this.audioContext || this.audioContext.state === "closed") {
            this.audioContext = new(AudioContext || webkitAudioContext)();
        }

        return this.audioContext
    }

    /**
     * Close AudioContext object, if it has not been already closed.
     * Release any system audio resources it was using.
     * All local references to the closed AudioContext should be marked as undefined
     * @returns {null} null
     */
    AudioContextSingleton.close = function () {
        if (this.audioContext && this.audioContext.state !== "closed") {
            this.audioContext.close();
            this.audioContext = undefined;
        };
    }

    window.AudioContextSingleton = AudioContextSingleton;
})(window);