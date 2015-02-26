TimeLineActiveTextsTests = TestCase("[Slideshow] Time Line Active Texts");

TimeLineActiveTextsTests.prototype.testActiveTextsEmpty = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "00:00"
    }, {
        Image: "/files/serve/slide_02.png",
        Start: "00:03"
    }, {
        Image: "/files/serve/slide_03.png",
        Start: "00:06"
    }];
    slides = presenter.validateSlides(slides).slides.content;
    
    var texts = [{
        Text: "Sky",
        Start: "00:00",
        End: "00:03",
        Top: "0",
        Left: "0"
    }, {
        Text: "Mountains",
        Start: "00:03",
        End: "00:06",
        Top: "110",
        Left: "50"
    }, {
        Text: "Sun",
        Start: "00:06",
        End: "00:09",
        Top: "200",
        Left: "30"
    }];
    texts = presenter.validateTexts(texts).texts.content;
    
    var timeLine = presenter.buildTimeLine(slides, texts);
    
    var activeTexts = presenter.findActiveTexts(timeLine, 3);
    
    assertArray(activeTexts);
    assertEquals(0, activeTexts.length);
};

TimeLineActiveTextsTests.prototype.testActiveTextsNotEmpty = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "00:00"
    }, {
        Image: "/files/serve/slide_02.png",
        Start: "00:03"
    }, {
        Image: "/files/serve/slide_03.png",
        Start: "00:06"
    }];
    slides = presenter.validateSlides(slides).slides.content;
    
    var texts = [{
        Text: "Sky",
        Start: "00:00",
        End: "00:03",
        Top: "0",
        Left: "0"
    }, {
        Text: "Mountains",
        Start: "00:03",
        End: "00:06",
        Top: "110",
        Left: "50"
    }, {
        Text: "Sun",
        Start: "00:06",
        End: "00:09",
        Top: "200",
        Left: "30"
    }, {
        Text: "Slide 1 and 2",
        Start: "00:01",
        End: "00:08",
        Top: "110",
        Left: "50"
    }, {
        Text: "Sun",
        Start: "00:04",
        End: "00:08",
        Top: "200",
        Left: "30"
    }];
    texts = presenter.validateTexts(texts).texts.content;
    
    var timeLine = presenter.buildTimeLine(slides, texts);
    
    var activeTexts = presenter.findActiveTexts(timeLine, 6);
    
    assertArray(activeTexts);
    assertEquals(2, activeTexts.length);
    assertEquals([3, 4], activeTexts);
};

TimeLineActiveTextsTests.prototype.testActiveTextsOneSecondOverlap = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "00:00"
    }, {
        Image: "/files/serve/slide_02.png",
        Start: "00:03"
    }, {
        Image: "/files/serve/slide_03.png",
        Start: "00:06"
    }];
    slides = presenter.validateSlides(slides).slides.content;

    var texts = [{
        Text: "Sky",
        Start: "00:00",
        End: "00:02",
        Top: "0",
        Left: "0"
    }, {
        Text: "Mountains",
        Start: "00:03",
        End: "00:05",
        Top: "110",
        Left: "50"
    }, {
        Text: "Sun",
        Start: "00:06",
        End: "00:09",
        Top: "200",
        Left: "30"
    }];
    texts = presenter.validateTexts(texts).texts.content;

    var timeLine = presenter.buildTimeLine(slides, texts);

    var activeTexts = presenter.findActiveTexts(timeLine, 3);

    assertArray(activeTexts);
    assertEquals(0, activeTexts.length);
};