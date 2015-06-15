TestCase("[Commons - Image Viewer] Sound validation", {
    'test undefined': function() {
        var validationResult = ImageViewer.validateSound(undefined);

        assertNotUndefined(validationResult.sounds);
    },

    'test empty': function() {
        var sounds = [{
            'AAC sound': "",
            'MP3 sound': "",
            'OGG sound': ""
        }];

        var validationResult = ImageViewer.validateSound(sounds);

        assertEquals("", validationResult.sounds[0].AAC);
        assertEquals("", validationResult.sounds[0].MP3);
        assertEquals("", validationResult.sounds[0].OGG);
        assertEquals(true, validationResult.sounds[0].isEmpty);
    },

    'test only prefix': function() {
        var sounds = [{
            'AAC sound': "/file/",
            'MP3 sound': "/file/",
            'OGG sound': "/file/"
        }];

        var validationResult = ImageViewer.validateSound(sounds);

        assertEquals("", validationResult.sounds[0].AAC);
        assertEquals("", validationResult.sounds[0].MP3);
        assertEquals("", validationResult.sounds[0].OGG);
        assertEquals(true, validationResult.sounds[0].isEmpty);
    },

    'test middle sound empty': function() {
        var sounds = [{
            'AAC sound':"/files/serve/sound.aac",
            'MP3 sound':"/files/serve/sound.mp3",
            'OGG sound':"/files/serve/sound.ogg"
        }, {
            'AAC sound':"/file/",
            'MP3 sound':"/file/",
            'OGG sound':"/file/"
        }, {
            'AAC sound':"/files/serve/sound.aac",
            'MP3 sound':"/files/serve/sound.mp3",
            'OGG sound':"/files/serve/sound.ogg"
        }];

        var validationResult = ImageViewer.validateSound(sounds);

        assertEquals("/files/serve/sound.aac", validationResult.sounds[0].AAC);
        assertEquals("/files/serve/sound.mp3", validationResult.sounds[0].MP3);
        assertEquals("/files/serve/sound.ogg", validationResult.sounds[0].OGG);
        assertEquals(false, validationResult.sounds[0].isEmpty);

        assertEquals("", validationResult.sounds[1].AAC);
        assertEquals("", validationResult.sounds[1].MP3);
        assertEquals("", validationResult.sounds[1].OGG);
        assertEquals(true, validationResult.sounds[1].isEmpty);

        assertEquals("/files/serve/sound.aac", validationResult.sounds[2].AAC);
        assertEquals("/files/serve/sound.mp3", validationResult.sounds[2].MP3);
        assertEquals("/files/serve/sound.ogg", validationResult.sounds[2].OGG);
        assertEquals(false, validationResult.sounds[2].isEmpty);
    }
});