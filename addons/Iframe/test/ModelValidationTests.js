TestCase("[Iframe] validateIFrameSource", {

    setUp: function () {
        this.presenter = AddonIframe_create();
        this.validModel = {
            index: "/file/1243234432412",
            iframeURL: "http://www.mywebpage.com"
        };


        this.validModelWithoutURL = {
            index : "/file/123456",
            iframeURL : "   "
        };

        this.validModelWithoutIndex = {
            index : "    ",
            iframeURL : "http://smth.sm"
        };

        this.invalidModel = {
            index : "",
            iframeURL : ""
        };

    },

    'test if there is url there should be a index file uploaded': function () {
        var expectedResult = {
            isValid: true,
            haveURL: true
        };

         var result = this.presenter.validateIFrameSource(this.validModel);
         assertEquals(expectedResult, result);
    },

    'test if there is no url there should be index file uploaded': function () {
        var expectedResult = {
            isValid: true,
            haveURL: false
        };

        var result = this.presenter.validateIFrameSource(this.validModelWithoutURL);
        assertEquals(expectedResult, result);
    },

    'test if there is no index file there should be url': function () {
        var expectedResult = {
            isValid: true,
            haveURL: true
        };

        var result = this.presenter.validateIFrameSource(this.validModelWithoutIndex);
        assertEquals(expectedResult, result);
    },

    'test if there is invalid model there should be error' : function () {
         var expectedResult = {
            isValid: false,
            errorCode: 'M01'
        };

        var result = this.presenter.validateIFrameSource(this.invalidModel);
        assertEquals(expectedResult, result);
    }
});

TestCase("[Iframe] validateCommunicationID", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.validModel = {
            communicationID : "   simpleID "
        };

        this.invalidModelWhiteSpaces = {
            communicationID : "   "
        };

        this.invalidModel = {
            communicationID : ""
        }
    },

    'test there should be non empty communicationID string': function () {
        var expectedResult = {
            isValid: true,
            value : this.validModel.communicationID.trim()
        };

        var result = this.presenter.validateCommunicationID(this.validModel);
        assertEquals(expectedResult, result);
    },

    'test empty or whitespaces string is invalid communicationID' : function () {
        var expectedResult = {
            isValid : false,
            errorCode: 'M02'
        };

        var result = this.presenter.validateCommunicationID(this.invalidModel);
        assertEquals(expectedResult, result);
    }
});

TestCase("[Iframe] validateFile", {
    setUp: function () {
        this.presenter = AddonIframe_create();

        this.dictionaryToValid = {
            "smth": "somethingElse"
        };

        this.dictionaryToInvalid = {
            "something" : "something"
        };

        this.validModel = {
            id: "something",
            file: "/file/212312"
        };

        this.invalidModel = {
            id: "   ",
            file: " "
        };

    },

    'test there should be valid file' : function () {
         var expectedResult = {
             isValid : true,
             id : this.validModel.id,
             file : this.validModel.file
         };

         var result = this.presenter.validateFile(this.validModel, this.dictionaryToValid);
         assertEquals(expectedResult, result);
    },

    'test if file ID is in dictionary there should be ID multiplication error' : function () {
         var expectedResult = {
             isValid : false,
             errorCode : "I01"
         };

         var result = this.presenter.validateFile(this.validModel, this.dictionaryToInvalid);
         assertEquals(expectedResult, result);
    },

    'test if model is empty there should be false' : function () {

         var result = this.presenter.validateFile(this.invalidModel, this.dictionaryToValid);
         assertFalse(result.isValid);

    }
});

TestCase("[Iframe] validateFileList", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.validModel = {
            fileList: [
                {id: "sth", file: "  /file/23124124 "},
                {id: "  sthelse", file: "/file/241231"},
                {id: "sthelseelse", file: "/file/213124"}
            ]
        };
        this.emptyFile = {
            fileList: [
                {id: "", file: ""}
            ]
        };
    },

    'test if there is file list there should be file dictionary' : function () {
        var expectedResult = {
            isValid : true,
            fileDictionary : {
                "sth" :  "/file/23124124",
                "sthelse" : "/file/241231",
                "sthelseelse" : "/file/213124"
            }
        };
        var result = this.presenter.validateFileList(this.validModel);
        assertEquals(expectedResult, result);
    },

    'test if there are no files there should be empty dictionary' : function () {
        var expectedResult = {
            isValid : true,
            fileDictionary : {
            }
        };

        var result = this.presenter.validateFileList(this.emptyFile);
        assertEquals(expectedResult, result);
    }
});

TestCase("[Iframe] validateActualizationModel", {
    setUp : function () {
        this.presenter = AddonIframe_create();
        this.validModel = {
            iframeScore: {
                pageCount: 0,
                checks: 0,
                errors: 0,
                mistakes: 0,
                score: 0,
                maxScore: 0,
                scaledScore: 0
            }
        };

        this.invalidModelPageCount = {
            iframeScore: {
                checks: 0,
                errors: 0,
                mistakes: 0,
                score: 0,
                maxScore: 0,
                scaledScore: 0
            }
        };

        this.invalidModelChecks = {
            iframeScore: {
                pageCount: 0,
                errors: 0,
                mistakes: 0,
                score: 0,
                maxScore: 0,
                scaledScore: 0
            }
        };

        this.invalidModelErrors = {
            iframeScore: {
                pageCount: 0,
                checks: 0,
                mistakes: 0,
                score: 0,
                maxScore: 0,
                scaledScore: 0
            }
        };

        this.invalidModelMistakes = {
            iframeScore: {
                pageCount: 0,
                checks: 0,
                errors: 0,
                score: 0,
                maxScore: 0,
                scaledScore: 0
            }
        };

        this.invalidModelScore = {
            iframeScore: {
                pageCount: 0,
                checks: 0,
                errors: 0,
                mistakes: 0,
                maxScore: 0,
                scaledScore: 0
            }
        };

        this.invalidModelMaxScore = {
            iframeScore: {
                pageCount: 0,
                checks: 0,
                errors: 0,
                mistakes: 0,
                score: 0,
                scaledScore: 0
            }
        };

        this.invalidModelScaledScore = {
            iframeScore: {
                pageCount: 0,
                checks: 0,
                errors: 0,
                mistakes: 0,
                score: 0,
                maxScore: 0
            }
        };

        this.invalidModelWithoutIFrameScore = {
        }
    },

    'test if there is valid model there should be valid result' : function () {
        var expectedResult = {
            isValid: true
        };

        var result = this.presenter.validateActualizationModel(this.validModel);
        assertEquals(expectedResult, result);
    },

    'test if there is invalid model there should be false' : function () {
         var expectedResult = {
            isValid: false
        };
        var result = this.presenter.validateActualizationModel(this.invalidModelPageCount);

        assertEquals(expectedResult, result);
        result = this.presenter.validateActualizationModel(this.invalidModelChecks);
        assertEquals(expectedResult, result);
        result = this.presenter.validateActualizationModel(this.invalidModelErrors);
        assertEquals(expectedResult, result);
        result = this.presenter.validateActualizationModel(this.invalidModelMistakes);
        assertEquals(expectedResult, result);
        result = this.presenter.validateActualizationModel(this.invalidModelScore);
        assertEquals(expectedResult, result);
        result = this.presenter.validateActualizationModel(this.invalidModelMaxScore);
        assertEquals(expectedResult, result);
        result = this.presenter.validateActualizationModel(this.invalidModelScaledScore);
        assertEquals(expectedResult, result);
        result = this.presenter.validateActualizationModel(this.invalidModelWithoutIFrameScore);
        assertEquals(expectedResult, result);
    }
});

TestCase("[Iframe] validateModelOriginal", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.validModel = {
            iframeURL : "http://www.example.com/",
            ID : "someAddonID",
            index : "/file/123453",
            fileList : [{id: "someID", file: "/file/12345"}],
            communicationID: "someID",
            "Alt text": "some alt"
        };

        this.expectedValue = {
            isValid : true,
            haveURL : true,
            iframeURL : "http://www.example.com/",
            index : "/file/123453",
            communicationID : "someID",
            addonID : "someAddonID",
            fileDictionary : {
                "someID": "/file/12345"
            },
            isVisibleByDefault: false,
            allowFullScreen:false,
            altText: "some alt"
        };
    },

    'test if there is valid model there should be addon configuration' : function () {
        var result = this.presenter.validateModel(this.validModel);

        assertEquals(JSON.stringify(result), JSON.stringify(this.expectedValue));
    }
});