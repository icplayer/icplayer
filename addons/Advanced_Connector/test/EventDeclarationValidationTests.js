TestCase("Event declaration validation", {
    setUp: function() {
        this.presenter = AddonAdvanced_Connector_create();

        this.stubs = {
            signURLStub: sinon.stub(),
        }
        this.stubs.signURLStub.returnsArg(0);

        const self = this;
        this.presenter.playerController = {
            getContextMetadata() {
                return {};
            },
            getCurrentPageIndex() {
                return 0;
            },
            getPresentation() {
                return {
                    getPage(pageIndex) {
                        return {
                            getBaseURL() {
                                return "https://test.com/resources/"
                            }
                        }
                    }
                }
            },
            getRequestsConfig() {
                return {
                    signURL: self.stubs.signURLStub
                }
            }
        }
    },

    'test missing SCRIPTSTART keyword': function() {
        var script = [
            'Source:Slider.+',
            'Value:1',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_04', validationResult.errorCode);
    },

    'test missing SCRIPTEND keyword': function() {
        var script = [
            'Source:Slider.+',
            'Value:1',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_04', validationResult.errorCode);
    },

    'test missing newline after SCRIPTSTART keyword': function() {
        var script = [
            'SCRIPTSTART Source:Slider.+',
            'Value:1',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_04', validationResult.errorCode);
    },

    'test misplaced SCRIPTEND keyword': function() {
        var script = [
            'Source:Slider.+',
            'Value:1',
            'SCRIPTEND',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_04', validationResult.errorCode);
    },

    'test invalid identifier': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Score:3',
            'SomeField:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_08', validationResult.errorCode);
    },

    'test repeated Source field': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Score:3',
            'Source:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_06', validationResult.errorCode);
    },

    'test repeated Item field': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Score:3',
            'Item:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_06', validationResult.errorCode);
    },

    'test repeated Value field': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Score:3',
            'Value:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_06', validationResult.errorCode);
    },

    'test repeated Score field': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Score:3',
            'Score:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_06', validationResult.errorCode);
    },

    'test repeated Word field': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Word:babylon',
            'Word:mountain',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_06', validationResult.errorCode);
    },

    'test repeated Type field': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Type:image',
            'Type:text',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_06', validationResult.errorCode);
    },

    'test repeated Name field': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Name:ValueChanged',
            'Name:ItemSelected',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];

        var validationResult = this.presenter.validateEvent(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_06', validationResult.errorCode);
    },

    'test valid event declaration': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'Value:2',
            'Score:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '1',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test omitted Source field': function() {
        var script = [
            'Item:1',
            'Value:2',
            'Score:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];
        var expectedEvent = {
            Source: '.*',
            Item: '1',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test omitted Item field': function() {
        var script = [
            'Source:Slider1',
            'Value:2',
            'Score:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];
        var expectedEvent = {
            Source: 'Slider1',
            Item: '.*',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test omitted Value field': function() {
        var script = [
            'Source:Slider1',
            'Item:1',
            'Score:3',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];
        var expectedEvent = {
            Source: 'Slider1',
            Item: '1',
            Value: '.*',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test omitted Score field': function() {
        var script = [
            'Source:Slider1',
            'Item:1',
            'Value:2',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND'
        ];
        var expectedEvent = {
            Source: 'Slider1',
            Item: '1',
            Value: '2',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test script not at the end of event declaration': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND',
            'Value:2',
            'Score:3'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '1',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test repeated SCRIPTSTART keyword': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'SCRIPTSTART',
            'ImageViewer1.show();',
            'SCRIPTSTART',
            'Feedback1.change("Slider-New-Step");',
            'SCRIPTEND',
            'Value:2',
            'Score:3'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '1',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'ImageViewer1.show();\nSCRIPTSTART\nFeedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test missing both SCRIPTSTART and SCRIPTEND keyword': function() {
        var script = [
            'Source:Slider.+',
            'Value:1'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '.*',
            Value: '1',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test empty event declaration': function() {
        var script = [];
        var expectedEvent = {
            Source: '.*',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test empty script declaration': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'SCRIPTSTART',
            'SCRIPTEND',
            'Value:2',
            'Score:3'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '1',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test empty string as Source value': function() {
        var script = [
            'Source:',
            'Item:1',
            'SCRIPTSTART',
            'SCRIPTEND',
            'Value:2',
            'Score:3'
        ];
        var expectedEvent = {
            Source: '',
            Item: '1',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test empty string as Item value': function() {
        var script = [
            'Source:Slider.+',
            'Item:',
            'SCRIPTSTART',
            'SCRIPTEND',
            'Value:2',
            'Score:3'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test empty string as Value value': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'SCRIPTSTART',
            'SCRIPTEND',
            'Value:',
            'Score:3'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '1',
            Value: '',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test empty string as Score value': function() {
        var script = [
            'Source:Slider.+',
            'Item:1',
            'SCRIPTSTART',
            'SCRIPTEND',
            'Value:2',
            'Score:'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '1',
            Value: '2',
            Score: '',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test valid event declaration with tabs before keywords': function() {
        var script = [
            '   Source:Slider.+',
            '   Item:1',
            'Value:2',
            'Score:3',
            '   SCRIPTSTART',
            '       Feedback1.change("Slider-New-Step");',
            '   SCRIPTEND'
        ];
        var expectedEvent = {
            Source: 'Slider.+',
            Item: '1',
            Value: '2',
            Score: '3',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: '       Feedback1.change("Slider-New-Step");'
        };

        var validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test given valid event with relative to resources link when executing then parse link': function() {
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "../resources/123.mp3";',
            'window.open(url);',
            'SCRIPTEND'
        ];
        const expectedEvent = {
            Source: 'Single_State_Button1',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'let url = "https://test.com/resources/123.mp3";\nwindow.open(url);'
        };

        const validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test given valid event with absolute link when executing then do not parse link': function() {
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "https://badsite.com/../resources/123.mp3";',
            'window.open(url);',
            'SCRIPTEND'
        ];
        const expectedEvent = {
            Source: 'Single_State_Button1',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'let url = "https://badsite.com/../resources/123.mp3";\nwindow.open(url);'
        };

        const validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test given valid event without proper path link when executing then do not parse link': function() {
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "/../resources/123.mp3";',
            'window.open(url);',
            'SCRIPTEND'
        ];
        const expectedEvent = {
            Source: 'Single_State_Button1',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'let url = "/../resources/123.mp3";\nwindow.open(url);'
        };

        const validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test given valid event with /file/serve path link when executing then do not parse link': function() {
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "/file/serve/123";',
            'window.open(url);',
            'SCRIPTEND'
        ];
        const expectedEvent = {
            Source: 'Single_State_Button1',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'let url = "/file/serve/123";\nwindow.open(url);'
        };

        const validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test given valid event with /file/serve path and with file extension link when executing then do not parse link': function() {
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "/file/serve/123.mp3";',
            'window.open(url);',
            'SCRIPTEND'
        ];
        const expectedEvent = {
            Source: 'Single_State_Button1',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'let url = "/file/serve/123.mp3";\nwindow.open(url);'
        };

        const validationResult = this.presenter.validateEvent(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test given valid event with ../resources/ path link and should sign URL when executing then should return signed and parsed link': function() {
        this.stubs.signURLStub.reset();
        this.stubs.signURLStub.callsFake(function (url) { return (url + "?123");});
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "../resources/123.mp3";',
            'window.open(url);',
            'SCRIPTEND'
        ];
        const expectedEvent = {
            Source: 'Single_State_Button1',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'let url = "https://test.com/resources/123.mp3?123";\nwindow.open(url);'
        };

        const validationResult = this.presenter.validateEvent(script);

        assertTrue(this.stubs.signURLStub.called);
        assertFalse(validationResult.isError);
        assertEquals(expectedEvent, validationResult.eventDeclaration);
    },

    'test given valid event with absolute link and should not sign URL when executing then should do not sigh link': function() {
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "https://badsite.com/../resources/123.mp3";',
            'window.open(url);',
            'SCRIPTEND'
        ];

        this.presenter.validateEvent(script);

        assertFalse(this.stubs.signURLStub.called);
    },

    'test given valid event with /file/serve/ path link and should not sign URL when executing then should not sigh link': function() {
        const script = [
            'Source:Single_State_Button1',
            'SCRIPTSTART',
            'let url = "/file/serve/123";',
            'window.open(url);',
            'SCRIPTEND'
        ];

        this.presenter.validateEvent(script);

        assertFalse(this.stubs.signURLStub.called);
    }
});