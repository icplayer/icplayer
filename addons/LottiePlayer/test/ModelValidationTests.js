TestCase("[LottiePlayer] Model validation tests", {

    setUp: function () {
        this.presenter = AddonLottiePlayer_create();
        this.model = {
            "ID": "LottiePlayer1",
            "Is Visible": "True",
            "Items": [
                {
                    "AnimationJSON": "/file/serve/6695639266099200",
                    "Loop": "False",
                    "Autoplay": "False",
                    "Direction": "Forward",
                    "Mode": "Normal",
                    "LoopsNumber": "",
                    "Speed": "",
                    "Intermission": "",
                    "Background": "",
                    "AlternativeText": "",
                    "PreviewAlternativeText": ""
                },
            ],
            "Controls": "",
            "PlayInSuccession": "",
            "LoopSuccession": "",
            "SendEventOnEveryFrame": "",
            "{library}": "//www.mauthor.com/file/serve/4732428471631872"
        }
    },

    'test given model with valid ID when executing validateModel then returned configuration have given ID as modelID': function() {
        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(this.model.ID, configuration.addonID);
    },

    'test given model with Is Visible as empty when executing validateModel then in returned configuration isVisible equals false': function() {
        this.model["Is Visible"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.isVisible);
    },

    'test given model with Is Visible as False when executing validateModel then in returned configuration isVisible equals false': function() {
        this.model["Is Visible"] = "False";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.isVisible);
    },

    'test given model with Is Visible as True when executing validateModel then in returned configuration isVisible equals true': function() {
        this.model["Is Visible"] = "True";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertTrue(configuration.isVisible);
    },

    'test given model with Controls as empty when executing validateModel then in returned configuration controls equals false': function() {
        this.model["Controls"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.controls);
    },

    'test given model with Controls as False when executing validateModel then in returned configuration controls equals false': function() {
        this.model["Controls"] = "False";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.controls);
    },

    'test given model with Controls as True when executing validateModel then in returned configuration controls equals true': function() {
        this.model["Controls"] = "True";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertTrue(configuration.controls);
    },

    'test given model with PlayInSuccession as empty when executing validateModel then in returned configuration playInSuccession equals false': function() {
        this.model["PlayInSuccession"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.playInSuccession);
    },

    'test given model with PlayInSuccession as False when executing validateModel then in returned configuration playInSuccession equals false': function() {
        this.model["PlayInSuccession"] = "False";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.playInSuccession);
    },

    'test given model with PlayInSuccession as True when executing validateModel then in returned configuration playInSuccession equals true': function() {
        this.model["PlayInSuccession"] = "True";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertTrue(configuration.playInSuccession);
    },

    'test given model with LoopSuccession as empty when executing validateModel then in returned configuration playInSuccession equals false': function() {
        this.model["LoopSuccession"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.loopSuccession);
    },

    'test given model with LoopSuccession as False when executing validateModel then in returned configuration playInSuccession equals false': function() {
        this.model["LoopSuccession"] = "False";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.loopSuccession);
    },

    'test given model with LoopSuccession as True when executing validateModel then in returned configuration playInSuccession equals true': function() {
        this.model["LoopSuccession"] = "True";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertTrue(configuration.loopSuccession);
    },

    'test given model with SendEventOnEveryFrame as empty when executing validateModel then in returned configuration sendEventOnEveryFrame equals false': function() {
        this.model["SendEventOnEveryFrame"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.sendEventOnEveryFrame);
    },

    'test given model with SendEventOnEveryFrame as False when executing validateModel then in returned configuration sendEventOnEveryFrame equals false': function() {
        this.model["SendEventOnEveryFrame"] = "False";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(configuration.sendEventOnEveryFrame);
    },

    'test given model with SendEventOnEveryFrame as True when executing validateModel then in returned configuration sendEventOnEveryFrame equals true': function() {
        this.model["SendEventOnEveryFrame"] = "True";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertTrue(configuration.sendEventOnEveryFrame);
    },
});

TestCase("[LottiePlayer] Animation model validation tests", {
    setUp: function () {
        this.presenter = AddonLottiePlayer_create();
        this.model = {
            "ID": "LottiePlayer1",
            "Is Visible": "True",
            "Items": [
                {
                    "AnimationJSON": "/file/serve/6695639266099200",
                    "Loop": "False",
                    "Autoplay": "False",
                    "Direction": "Forward",
                    "Mode": "Normal",
                    "LoopsNumber": "",
                    "Speed": "",
                    "Intermission": "",
                    "Background": "",
                    "AlternativeText": "",
                    "PreviewAlternativeText": ""
                },
            ],
            "Controls": "",
            "PlayInSuccession": "",
            "LoopSuccession": "",
            "SendEventOnEveryFrame": "",
            "{library}": "//www.mauthor.com/file/serve/4732428471631872"
        }
    },

    getFirstAnimationConfiguration: function (configuration) {
        return configuration.animations[0];
    },

    getFirstAnimationModel: function () {
        return this.model.Items[0];
    },

    'test given animation model with valid AnimationJSON when executing validateModel then in returned configuration animationSrc equals given value': function() {
        let newSrc = "/file/serve/6695639266099200";
        this.getFirstAnimationModel()["AnimationJSON"] = newSrc;

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(newSrc, this.getFirstAnimationConfiguration(configuration, 0).animationSrc);
    },

    'test given animation model with AnimationJSON as empty when executing validateModel then returned not valid configuration with error code IAS_0 and itemIndex 0': function() {
        this.getFirstAnimationModel()["AnimationJSON"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("IAS_0", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with Loop as empty when executing validateModel then in returned configuration isLoop equals false': function() {
        this.getFirstAnimationModel()["Loop"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(this.getFirstAnimationConfiguration(configuration, 0).isLoop);
    },

    'test given animation model with Loop as False when executing validateModel then in returned configuration isLoop equals false': function() {
        this.getFirstAnimationModel()["Loop"] = "False";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(this.getFirstAnimationConfiguration(configuration, 0).isLoop);
    },

    'test given animation model with Loop as True when executing validateModel then in returned configuration isLoop equals true': function() {
        this.getFirstAnimationModel()["Loop"] = "True";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertTrue(this.getFirstAnimationConfiguration(configuration, 0).isLoop);
    },

    'test given animation model with Autoplay as empty when executing validateModel then in returned configuration isAutoplay equals false': function() {
        this.getFirstAnimationModel()["Autoplay"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(this.getFirstAnimationConfiguration(configuration, 0).isAutoplay);
    },

    'test given animation model with Autoplay as False when executing validateModel then in returned configuration isAutoplay equals false': function() {
        this.getFirstAnimationModel()["Autoplay"] = "False";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertFalse(this.getFirstAnimationConfiguration(configuration, 0).isAutoplay);
    },

    'test given animation model with Autoplay as True when executing validateModel then in returned configuration isAutoplay equals true': function() {
        this.getFirstAnimationModel()["Autoplay"] = "True";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertTrue(this.getFirstAnimationConfiguration(configuration, 0).isAutoplay);
    },

    'test given animation model with Direction as empty when executing validateModel then in returned configuration direction equals Forward': function() {
        this.getFirstAnimationModel()["Direction"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(this.presenter.DIRECTION.Forward, this.getFirstAnimationConfiguration(configuration, 0).direction);
    },

    'test given animation model with Direction as Forward when executing validateModel then in returned configuration direction equals Forward': function() {
        this.getFirstAnimationModel()["Direction"] = this.presenter.DIRECTION.Forward;

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(this.presenter.DIRECTION.Forward, this.getFirstAnimationConfiguration(configuration, 0).direction);
    },

    'test given animation model with Direction as Backward when executing validateModel then in returned configuration direction equals true': function() {
        this.getFirstAnimationModel()["Direction"] = this.presenter.DIRECTION.Backward;

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(this.presenter.DIRECTION.Backward, this.getFirstAnimationConfiguration(configuration, 0).direction);
    },

    'test given animation model with Mode as empty when executing validateModel then in returned configuration mode equals Normal': function() {
        this.getFirstAnimationModel()["Mode"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(this.presenter.MODE.Normal, this.getFirstAnimationConfiguration(configuration, 0).mode);
    },

    'test given animation model with Mode as Forward when executing validateModel then in returned configuration mode equals Normal': function() {
        this.getFirstAnimationModel()["Mode"] = this.presenter.MODE.Normal;

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(this.presenter.MODE.Normal, this.getFirstAnimationConfiguration(configuration, 0).mode);
    },

    'test given animation model with Mode as Backward when executing validateModel then in returned configuration mode equals true': function() {
        this.getFirstAnimationModel()["Mode"] = this.presenter.MODE.Bounce;

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(this.presenter.MODE.Bounce, this.getFirstAnimationConfiguration(configuration, 0).mode);
    },

    'test given animation model with LoopsNumber as empty when executing validateModel then in returned configuration loopsNumber equals null': function() {
        this.getFirstAnimationModel()["LoopsNumber"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(null, this.getFirstAnimationConfiguration(configuration, 0).loopsNumber);
    },

    'test given animation model with LoopsNumber as "2" integer when executing validateModel then in returned configuration loopsNumber equals 2': function() {
        this.getFirstAnimationModel()["LoopsNumber"] = "2";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(2, this.getFirstAnimationConfiguration(configuration, 0).loopsNumber);
    },

    'test given animation model with LoopsNumber as "1.1" float when executing validateModel then in returned configuration loopsNumber equals 1': function() {
        this.getFirstAnimationModel()["LoopsNumber"] = "1.1";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(1, this.getFirstAnimationConfiguration(configuration, 0).loopsNumber);
    },

    'test given animation model with LoopsNumber as some string when executing validateModel then returned not valid configuration with error code ILN_0 and itemIndex 0': function() {
        this.getFirstAnimationModel()["LoopsNumber"] = "Some text";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("ILN_0", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with LoopsNumber as "-1" integer when executing validateModel then returned not valid configuration with error code ILN_1 and itemIndex 0': function() {
        this.getFirstAnimationModel()["LoopsNumber"] = "-1";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("ILN_1", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with Speed as empty when executing validateModel then in returned configuration speed equals 1': function() {
        this.getFirstAnimationModel()["Speed"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(1, this.getFirstAnimationConfiguration(configuration, 0).speed);
    },

    'test given animation model with Speed as "2" integer when executing validateModel then in returned configuration speed equals 2': function() {
        this.getFirstAnimationModel()["Speed"] = "2";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(2, this.getFirstAnimationConfiguration(configuration, 0).speed);
    },

    'test given animation model with Speed as "1.1" float when executing validateModel then in returned configuration speed equals 1.1': function() {
        this.getFirstAnimationModel()["Speed"] = "1.1";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(1.1, this.getFirstAnimationConfiguration(configuration, 0).speed);
    },

    'test given animation model with Speed as some string when executing validateModel then returned not valid configuration with error code IS_0 and itemIndex 0': function() {
        this.getFirstAnimationModel()["Speed"] = "Some text";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("IS_0", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with Speed as "-1" integer when executing validateModel then returned not valid configuration with error code IS_1 and itemIndex 0': function() {
        this.getFirstAnimationModel()["Speed"] = "-1";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("IS_1", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with Intermission as empty when executing validateModel then in returned configuration intermission equals null': function() {
        this.getFirstAnimationModel()["Intermission"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(null, this.getFirstAnimationConfiguration(configuration, 0).intermission);
    },

    'test given animation model with Intermission as "2" integer when executing validateModel then in returned configuration loopsNumber equals 2': function() {
        this.getFirstAnimationModel()["Intermission"] = "2";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(2, this.getFirstAnimationConfiguration(configuration, 0).intermission);
    },

    'test given animation model with Intermission as "1.1" float when executing validateModel then in returned configuration loopsNumber equals 1': function() {
        this.getFirstAnimationModel()["Intermission"] = "1.1";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(1, this.getFirstAnimationConfiguration(configuration, 0).intermission);
    },

    'test given animation model with Intermission as some string when executing validateModel then returned not valid configuration with error code II_0 and itemIndex 0': function() {
        this.getFirstAnimationModel()["Intermission"] = "Some text";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("II_0", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with Intermission as "-1" integer when executing validateModel then returned not valid configuration with error code II_1 and itemIndex 0': function() {
        this.getFirstAnimationModel()["Intermission"] = "-1";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("II_1", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with Background as empty when executing validateModel then in returned configuration background equals transparent': function() {
        this.getFirstAnimationModel()["Background"] = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("transparent", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with Background as "transparent" string when executing validateModel then in returned configuration background equals transparent': function() {
        this.getFirstAnimationModel()["Background"] = "transparent";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("transparent", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with Background as some string when executing validateModel then returned not valid configuration with error code IB_0 and itemIndex 0': function() {
        this.getFirstAnimationModel()["Background"] = "Some text";

        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals("IB_0", configuration.errorCode);
        assertEquals(0, configuration.itemIndex);
    },

    'test given animation model with Background as "#D5F5E3" valid HEX when executing validateModel then in returned configuration background equals #d5f5e3': function() {
        this.getFirstAnimationModel()["Background"] = "#D5F5E3";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("#d5f5e3", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with Background as "rgb(255,0,0)" valid RGB when executing validateModel then in returned configuration background equals rgb(255, 0, 0)': function() {
        this.getFirstAnimationModel()["Background"] = "rgb(255,0,0)";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("rgb(255,0,0)", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with Background as "rgb(255, 0, 0)" valid RGB when executing validateModel then in returned configuration background equals rgb(255, 0, 0)': function() {
        this.getFirstAnimationModel()["Background"] = "rgb(255, 0, 0)";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("rgb(255, 0, 0)", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with Background as "Rgb(255,255,255)" valid RGB when executing validateModel then in returned configuration background equals rgb(255,255,255)': function() {
        this.getFirstAnimationModel()["Background"] = "Rgb(255,0,0)";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("rgb(255,0,0)", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with Background as "rgba(255,0,0,0.3)" valid RGBA when executing validateModel then in returned configuration background equals rgba(255,0,0,0.3)': function() {
        this.getFirstAnimationModel()["Background"] = "rgba(255,0,0,0.3)";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("rgba(255,0,0,0.3)", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with Background as "Rgba(255, 0, 0, 0.3)" valid RGBA when executing validateModel then in returned configuration background equals Rgba(255, 0, 0, 0.3)': function() {
        this.getFirstAnimationModel()["Background"] = "Rgba(255,0,0,0.3)";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("rgba(255,0,0,0.3)", this.getFirstAnimationConfiguration(configuration, 0).background);
    },

    'test given animation model with AlternativeText as "Some text" when executing validateModel then in returned configuration altText equals "Some Text': function() {
        this.getFirstAnimationModel()["AlternativeText"] = "Some text";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("Some text", this.getFirstAnimationConfiguration(configuration, 0).altText);
    },

    'test given animation model with PreviewAlternativeText as "Some text" when executing validateModel then in returned configuration altTextPreview equals "Some Text': function() {
        this.getFirstAnimationModel()["PreviewAlternativeText"] = "Some text";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("Some text", this.getFirstAnimationConfiguration(configuration, 0).altTextPreview);
    },
});
