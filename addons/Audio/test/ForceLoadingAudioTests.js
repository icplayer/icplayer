TestCase('[Audio] ForceLoadingAudio', {
    setUp: function () {
        this.xhr = sinon.useFakeXMLHttpRequest();
        this.presenter = AddonAudio_create();

        this.requests = [];
        var requests = this.requests;

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };

        this.URLMock = sinon.stub(URL, "createObjectURL");
    },

    tearDown: function () {
        this.xhr.restore();
        this.URLMock.restore();
    },

    'test fetchAudioFromServer should send request to src and on success should call callback': function () {
        this.presenter.loadAudioDataFromRequest = sinon.spy();

        this.presenter.fetchAudioFromServer("src");
        assertEquals(1, this.requests.length);

        this.requests[0].respond(200, { "Content-Type": "application/json" },
                         '[{ "id": 12, "comment": "Hey there" }]');

        assertTrue(this.presenter.loadAudioDataFromRequest.calledOnce);
    },

    'test loadAudioDataFromRequest should set addon state': function () {
        this.URLMock.returns("some_url");

        this.presenter.configuration = {
            forceLoadAudio: true
        };

        var callback = sinon.spy();

        this.presenter.audio = {
            src: "xxx",
            paused: true,
            play: callback
        };

        var event = {
            currentTarget: {
                status: 200,
                reponse: "some_url"
            }
        };

        this.presenter.play();

        assertTrue(callback.notCalled);

        this.presenter.loadAudioDataFromRequest(event);

        assertEquals("some_url", this.presenter.audio.src);
        assertTrue(this.URLMock.calledOnce);

    }
});