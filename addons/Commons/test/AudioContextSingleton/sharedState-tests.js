AsyncTestCase("[Commons - AudioContextSingleton] State shared among instances test case", {
    setUp: function () {
        this.instance1 = {};
        this.instance2 = {};
    },

    "test given 2 objects have AudioContext when close called then both should become closed": function (queue) {
        let savedContext;
        const self = this;

        queue.call('Get AudioContext for both instances', function () {
            self.instance1.audioContext = AudioContextSingleton.getOrCreate();
            self.instance2.audioContext = AudioContextSingleton.getOrCreate();
            savedContext = self.instance1.audioContext;
        });

        queue.call('Close AudioContext and wait for Promise', function (callbacks) {
            AudioContextSingleton.close().then(callbacks.add(function () {
                assertTrue(savedContext.state === "closed");
            }));
        });
    },
});