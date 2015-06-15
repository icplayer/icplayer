TestCase("[Commons - Image Viewer] Sounds loading", {
    setUp: function() {
        this.sounds = [{
            AAC: "/file/sound.aac",
            MP3: "/file/sound.mp3",
            OGG: "/file/sound.ogg",
            isEmpty: false
        }];

        this.soundStub = sinon.stub(buzz, 'sound');

        this.mp3ElementStub = {
            load: function() {}
        };
        sinon.stub(this.mp3ElementStub, 'load');
        this.soundStub.withArgs('/file/sound.mp3').returns(this.mp3ElementStub);

        this.oggElementStub = {
            load: function() {}
        };
        sinon.stub(this.oggElementStub, 'load');
        this.soundStub.withArgs('/file/sound.ogg').returns(this.oggElementStub);

        this.aacElementStub = {
            load: function() {}
        };
        sinon.stub(this.aacElementStub, 'load');
        this.soundStub.withArgs('/file/sound.aac').returns(this.aacElementStub);
    },

    tearDown: function() {
        buzz.sound.restore();
    },

    'test sounds sources undefined': function() {
        var audioElements = ImageViewer.loadSounds(undefined, 6);

        assertArray(audioElements);
    },

    'test frames count undefined': function() {
        var audioElements = ImageViewer.loadSounds(this.sounds, undefined);

        assertArray(audioElements);
    },

    'test audio elements not supported': function() {
        sinon.stub(buzz, 'isSupported', function() { return false; });

        var audioElements = ImageViewer.loadSounds(this.sounds, 6);

        buzz.isSupported.restore();

        assertArray(audioElements);
        assertEquals(0, this.soundStub.callCount);
    },

    'test MP3 elements supported': function() {
        sinon.stub(buzz, 'isMP3Supported', function() { return true; });
        sinon.stub(buzz, 'isOGGSupported', function() { return false; });

        var audioElements = ImageViewer.loadSounds(this.sounds, 6);

        buzz.isMP3Supported.restore();
        buzz.isOGGSupported.restore();

        assertArray(audioElements);
        assertEquals(1, this.soundStub.callCount);
        assertEquals(1, this.mp3ElementStub.load.callCount);
        assertEquals(0, this.aacElementStub.load.callCount);
        assertEquals(0, this.oggElementStub.load.callCount);
    },

    'test OGG elements supported': function() {
        sinon.stub(buzz, 'isMP3Supported', function() { return false; });
        sinon.stub(buzz, 'isOGGSupported', function() { return true; });

        var audioElements = ImageViewer.loadSounds(this.sounds, 6);

        buzz.isMP3Supported.restore();
        buzz.isOGGSupported.restore();

        assertArray(audioElements);
        assertEquals(1, this.soundStub.callCount);
        assertEquals(1, this.oggElementStub.load.callCount);
        assertEquals(0, this.mp3ElementStub.load.callCount);
        assertEquals(0, this.aacElementStub.load.callCount);
    },

    'test AAC elements supported': function() {
        sinon.stub(buzz, 'isMP3Supported', function() { return false; });
        sinon.stub(buzz, 'isOGGSupported', function() { return false; });

        var audioElements = ImageViewer.loadSounds(this.sounds, 6);

        buzz.isMP3Supported.restore();
        buzz.isOGGSupported.restore();

        assertArray(audioElements);
        assertEquals(1, this.soundStub.callCount);
        assertEquals(1, this.aacElementStub.load.callCount);
        assertEquals(0, this.mp3ElementStub.load.callCount);
        assertEquals(0, this.oggElementStub.load.callCount);
    },

    'test multiple audio elements': function() {
        sinon.stub(buzz, 'isMP3Supported', function() { return true; });
        sinon.stub(buzz, 'isOGGSupported', function() { return false; });

        var sounds = [{
            AAC: "/file/sound.aac",
            MP3: "/file/sound.mp3",
            OGG: "/file/sound.ogg",
            isEmpty: false
        }, {
            AAC: "",
            MP3: "",
            OGG: "",
            isEmpty: true
        }, {
            AAC: "/file/sound.aac",
            MP3: "/file/sound.mp3",
            OGG: "/file/sound.ogg",
            isEmpty: false
        }];

        var audioElements = ImageViewer.loadSounds(sounds, 6);

        buzz.isMP3Supported.restore();
        buzz.isOGGSupported.restore();

        assertArray(audioElements);
        assertEquals(2, this.soundStub.callCount);
        assertEquals(2, this.mp3ElementStub.load.callCount);
        assertEquals(0, this.aacElementStub.load.callCount);
        assertEquals(0, this.oggElementStub.load.callCount);
    }
});