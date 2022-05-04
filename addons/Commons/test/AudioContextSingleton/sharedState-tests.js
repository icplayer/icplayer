TestCase("[Commons - AudioContextSingleton] State shared among instances test case", {
    setUp: function () {
        this.instance1 = {};
        this.instance2 = {};

    },

    "test given 2 objects have AudioContext when close called then both should become closed": function () {
        this.instance1.audioContext = AudioContextSingleton.getOrCreate();
        this.instance2.audioContext = AudioContextSingleton.getOrCreate();

        AudioContextSingleton.close();

        const result = this.instance1.audioContext.state === "closed" && this.instance2.audioContext.state === "closed"

        assertTrue(result);
    },
});