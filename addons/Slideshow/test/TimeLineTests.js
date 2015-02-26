TimeLineTests = TestCase("[Slideshow] Time Line");

TimeLineTests.prototype.testProperTimeLineSlides = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "00:00"
    }, {
        Image: "/files/serve/slide_02.png",
        Start: "00:10"
    }];
    slides = presenter.validateSlides(slides).slides.content;
    
    var properArray = [];
    properArray[0] = [{
            type: presenter.TIME_LINE_TASK.TYPE.SLIDE,
            task: presenter.TIME_LINE_TASK.TASK.SHOW,
            index: 0
    }];
    properArray[10] = [{
            type: presenter.TIME_LINE_TASK.TYPE.SLIDE,
            task: presenter.TIME_LINE_TASK.TASK.SHOW,
            index: 1
    }];
    
    var timeLine = presenter.buildTimeLine(slides, []);
    
    assertArray(timeLine);
    assertEquals(properArray[0], timeLine[0]);
    assertEquals(properArray[10], timeLine[10]);
};

TimeLineTests.prototype.testProperTimeLineSlidesWithTexts = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "00:00"
    }, {
        Image: "/files/serve/slide_02.png",
        Start: "00:10"
    }];
    slides = presenter.validateSlides(slides).slides.content;
    
    var texts = [{
        Text: "Sky",
        Start: "00:01",
        End: "00:5",
        Top: "0",
        Left: "0"
    }, {
        Text: "Mountains",
        Start: "00:03",
        End: "00:15",
        Top: "110",
        Left: "50"
    }, {
        Text: "Sun",
        Start: "00:10",
        End: "00:19",
        Top: "200",
        Left: "30"
    }];
    texts = presenter.validateTexts(texts).texts.content;
    
    var properArray = [];
    properArray[0] = [{
            type: presenter.TIME_LINE_TASK.TYPE.SLIDE,
            task: presenter.TIME_LINE_TASK.TASK.SHOW,
            index: 0
    }];
    properArray[1] = [{
            type: presenter.TIME_LINE_TASK.TYPE.TEXT,
            task: presenter.TIME_LINE_TASK.TASK.SHOW,
            index: 0
    }];
    properArray[3] = [{
            type: presenter.TIME_LINE_TASK.TYPE.TEXT,
            task: presenter.TIME_LINE_TASK.TASK.SHOW,
            index: 1
    }];
    properArray[5] = [{
            type: presenter.TIME_LINE_TASK.TYPE.TEXT,
            task: presenter.TIME_LINE_TASK.TASK.HIDE,
            index: 0
    }];
    properArray[10] = [{
            type: presenter.TIME_LINE_TASK.TYPE.SLIDE,
            task: presenter.TIME_LINE_TASK.TASK.SHOW,
            index: 1
    }, {
            type: presenter.TIME_LINE_TASK.TYPE.TEXT,
            task: presenter.TIME_LINE_TASK.TASK.SHOW,
            index: 2
    }];
    properArray[15] = [{
            type: presenter.TIME_LINE_TASK.TYPE.TEXT,
            task: presenter.TIME_LINE_TASK.TASK.HIDE,
            index: 1
    }];
    properArray[19] = [{
            type: presenter.TIME_LINE_TASK.TYPE.TEXT,
            task: presenter.TIME_LINE_TASK.TASK.HIDE,
            index: 2
    }];
    
    var timeLine = presenter.buildTimeLine(slides, texts);
    
    assertArray(timeLine);
    assertEquals(properArray[0], timeLine[0]);
    assertEquals(properArray[1], timeLine[1]);
    assertEquals(properArray[3], timeLine[3]);
    assertEquals(properArray[5], timeLine[5]);
    assertEquals(properArray[10], timeLine[10]);
    assertEquals(properArray[15], timeLine[15]);
    assertEquals(properArray[19], timeLine[19]);
};