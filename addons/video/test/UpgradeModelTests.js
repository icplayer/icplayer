UpgradeModelTests = TestCase("[Video] Upgrade Model Video");

UpgradeModelTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();

    this.model = {
        "Files": [{
            "Ogg video": "",
            "MP4 video": "",
            "WebM video": "",
            "Subtitles": "",
            ID : ""
        }],
        "Show video": ""
    };

};

