TestCase("[Video] formatTime", {

    setUp: function () {
        this.presenter = new Addonvideo_create();
    },

    'test should return 00:00 for zero seconds': function () {
        var result = this.presenter.formatTime(0);

        assertEquals("00:00", result);
    },

    'test should return number of minutes in seconds in format MM:SS': function () {
        var result = this.presenter.formatTime(70);

        assertEquals("01:10", result);
    },

    'test should return 00:00 for negative number': function () {
        var result = this.presenter.formatTime(-1);

        assertEquals("00:00", result);
    },

    'test should return 00:00 for not a number': function () {
        var result = this.presenter.formatTime("Test");

        assertEquals("00:00", result);
    },

    'test given text with vertical bars in square brackets when calling escapeAltText then return escaped text': function(){
        var text = '"Oh, you [can’t| help] [that," |said| |the |Cat]: |"we’re |all [mad] here. I’m mad. You’re mad."';

        var result = this.presenter.escapeAltText(text);

        var expectedResult = '"Oh, you [can’t&&separator&& help] [that," &&separator&&said&&separator&&' +
            ' &&separator&&the &&separator&&Cat]: |"we’re |all [mad] here. I’m mad. You’re mad."';
        assertEquals(expectedResult, result);
    },

    'test given escaped text when calling unescapeAndConvertAltText then returns unescaped text with correct alt texts': function(){
        var text = '[Why&&separator&&Because], sometimes [I\'ve&&separator&& believed&&separator&& ' +
            '&&separator&&as&&separator&& &&separator&&many&&separator&& as] ' +
            '[six&&separator&&sześć&&separator&&pl] impossible things before [breakfast&&separator&&supper].';

        var result = this.presenter.unescapeAndConvertAltText(text);

        var expectedResult = '\\alt{Why|Because}, sometimes [I\'ve| believed| |as| |many| as]' +
            ' \\alt{six|sześć}[lang pl] impossible things before \\alt{breakfast|supper}.';
        assertEquals(expectedResult, result);
    }
});