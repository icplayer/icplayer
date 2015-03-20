TestCase('[TextAudio] Validation model', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },

    'test proper slides model': function () {
        var model = {
            'mp3': '/some/file.mp3',
            //'ogg': '/some/file.ogg',
            'Slides': [
                {
                    'Text': 'Lorem|| Ipsum|| Dolor',
                    'Times': '00:00-00:02' + "\n" +
                             '00:02-00:04' + "\n" +
                             '00:04-00:06'
                },
                {
                    'Text': 'sit|| amet|| consectetur',
                    'Times': '00:06-00:08' + "\n" +
                             '00:08-00:10' + "\n" +
                             '00:10-00:12'
                }
            ],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);

        assertEquals(validatedModel.controls, "Browser");

        assertEquals(2, validatedModel.slides.length);
        assertEquals(validatedModel.slides[0].Text, ["Lorem"," Ipsum"," Dolor"]);
        assertEquals(validatedModel.slides[1].Text, ["sit"," amet"," consectetur"]);
        assertEquals(validatedModel.slides[0].Times, [{"start":0,"end":20},{"start":20,"end":40},{"start":40,"end":60}]);
        assertEquals(validatedModel.slides[1].Times, [{"start":60,"end":80},{"start":80,"end":100},{"start":100,"end":120}]);
    },

    
    'test no file error': function() {
        var model = {
            'mp3': '',
            'ogg': '',
            'Slides': [
                {
                    'Text': 'Lorem|| Ipsum|| Dolor',
                    'Times': '00:00-00:02' + "\n" +
                             '00:02-00:04' + "\n" +
                             '00:04-00:06'
                },
                {
                    'Text': 'sit|| amet|| consectetur',
                    'Times': '00:06-00:08' + "\n" +
                             '00:08-00:10' + "\n" +
                             '00:10-00:12'
                }
            ],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'M01');
    },
    
    'test number of slides are different than time entries': function() {
        var model = {
            'mp3': '/some/file.mp3',
            'Slides': [
                {
                    'Text': 'Lorem|| Ipsum|| Dolor',
                    'Times': '00:00-00:02' + "\n" +
                             '00:02-00:04' + "\n" +
                             '00:04-00:06'
                },
                {
                    'Text': 'sit|| amet|| consectetur',
                    'Times': '00:06-00:08' + "\n" +
                             '00:08-00:10'
                }
            ],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'M02');
    },
    
    'test time ends before start': function() {
        var model = {
            'mp3': '/some/file.mp3',
            'Slides': [
                {
                    'Text': 'Lorem|| Ipsum|| Dolor',
                    'Times': '00:00-00:02' + "\n" +
                             '00:04-00:02' + "\n" +
                             '00:04-00:06'
                },
                {
                    'Text': 'sit|| amet|| consectetur',
                    'Times': '00:06-00:08' + "\n" +
                             '00:08-00:10' + "\n" +
                             '00:10-00:12'
                }
            ],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'M04');
    },
        
    'test duplicated frames': function() {
        var model = {
            'mp3': '/some/file.mp3',
            'Slides': [
                {
                    'Text': 'Lorem|| Ipsum|| Dolor',
                    'Times': '00:00-00:02' + "\n" +
                             '00:00-00:04' + "\n" +
                             '00:04-00:06'
                },
                {
                    'Text': 'sit|| amet|| consectetur',
                    'Times': '00:06-00:08' + "\n" +
                             '00:08-00:10' + "\n" +
                             '00:10-00:12'
                }
            ],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'M05');
    },

    'test vocabulary when mp3 and ogg files are empty': function() {
        var model = {
                playSeparateFiles: "True",
                separateFiles: [{ mp3: "", ogg: "" }]
            };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'M01');
    },
    
    'test number of vocabulary audio files and time items must be the same': function() {
        var audioObject = { mp3: "/some/file.mp3", ogg: "/some/file.ogg" };
        var model = {
            'Slides': [{
                'Text': 'Lorem|| Ipsum|| Dolor',
                'Times': "00:00-00:02\n00:02-00:04\n00:04-00:06"
            }, {
                'Text': 'sit|| amet|| consectetur',
                'Times': "00:06-00:08\n00:08-00:10\n00:10-00:12"
            }],
            playSeparateFiles: "True",
            separateFiles: [audioObject, audioObject, audioObject, audioObject, audioObject],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'M01');
    },
    
    'test all values in property Vocabulary audio files has to be filled': function() {
        var audioObject = { mp3: "/some/file.mp3", ogg: "/some/file.ogg" };
        var model = {
            'Slides': [{
                'Text': 'Lorem|| Ipsum|| Dolor',
                'Times': "00:00-00:02\n00:02-00:04\n00:04-00:06"
            }, {
                'Text': 'sit|| amet|| consectetur',
                'Times': "00:06-00:08\n00:08-00:10\n00:10-00:12"
            }],
            playSeparateFiles: "True",
            separateFiles: [audioObject, audioObject, { mp3: "", ogg: "/some/file.ogg" }, audioObject, audioObject],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'M01');
    },
    
    'test valid model without separate files': function() {
        var model = {
            'mp3': '/some/file.mp3',
            'Slides': [{
                'Text': 'Lorem',
                'Times': "00:00-00:02"
            }],
            playSeparateFiles: "",
            separateFiles: [{ mp3: "/some/file.mp3", ogg: "/some/file.ogg" }],
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);

        assertFalse(validatedModel.separateFiles);

        assertEquals(validatedModel.controls, "Browser");

        assertEquals(1, validatedModel.slides.length);
        assertEquals(validatedModel.slides[0].Text, ["Lorem"]);
        assertEquals(validatedModel.slides[0].Times, [{"start":0,"end":20}]);
    },
    
    'test vocabulary intervals are correct': function() {
	    var model = {
	        'mp3': '/some/file.mp3',
	        'Slides': [{
	            'Text': 'Lorem || ipsum',
	            'Times': "00:00-00:02" + "\n" + "00:02-00:05"
	        }],
	        'clickAction': 'Play the interval from vocabulary file',
	        'vocabulary_mp3': '/some/file.mp3',
	        'vocabulary_intervals': "00:01-00:02" + "\n" + "00:03-00:04",
            controls: "Browser"
	    };
	
	    var validatedModel = this.presenter.validateModel(model);
	
	    assertTrue(validatedModel.isValid);
	    assertEquals(validatedModel.vocabularyIntervals.length, 2);
        assertEquals(validatedModel.vocabularyIntervals, [{"start": 10, "end": 20}, {"start": 30, "end": 40}]);
    },
    
    'test vocabulary intervals are wrong': function() {
        var model = {
            'mp3': '/some/file.mp3',
            'Slides': [{
                'Text': 'Lorem || ipsum',
                'Times': "00:00-00:02" + "\n" + "00:02-00:05"
            }],
            'clickAction': 'Play the interval from vocabulary file',
            'vocabulary_mp3': '/some/file.mp3',
            'vocabulary_intervals': "00:01-00:02",
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'VI02');
    },

    'test vocabulary intervals without vocabulary file': function() {
        var model = {
            'mp3': '/some/file.mp3',
            'Slides': [{
                'Text': 'Lorem || ipsum',
                'Times': "00:00-00:02" + "\n" + "00:02-00:05"
            }],
            'clickAction': 'Play the interval from vocabulary file',
            'vocabulary_intervals': "00:01-00:02" + "\n" + "00:03-00:04",
            controls: "Browser"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals(validatedModel.errorCode, 'VI01');
    }
});