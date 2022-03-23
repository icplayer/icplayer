TestCase("[SrtParser] test case", {
    setUp: function () {
        this.sampleSrt = `
1
00:00:00,000 --> 00:00:05,568
Adam: Oh, I love that song!

2
00:00:05,569 --> 00:00:11,303
It’s one of my favourites!

3
00:00:11,304 --> 00:00:12,437
Jane: Why’s that?

4
00:00:12,438 --> 00:00:15,363
t reminds me of the summer of 2013.

5
00:00:15,364 --> 00:00:17,854
I was staying with friends
in London.

6
00:00:17,855 --> 00:00:20,417
We used to play that song all the time!

7
00:00:20,418 --> 00:00:22,810
I’ll never forget
that summer.

8
00:00:23,000 --> 00:00:24,000
Jane: Isn’t it funny how sounds`;
        this.correctFifthSection = {
            id: 5,
            startTime: 15364,
            endTime: 17854,
            text: "I was staying with friends\nin London."
        };
    },

    "test given proper sample srt when parse with false param timeInMs then parsed properly with time in colon separated format": function () {
        var parsed = SrtParser.parse(this.sampleSrt, false);

        this.correctFifthSection.startTime = "00:00:15,364";
        this.correctFifthSection.endTime = "00:00:17,854";

        assertEquals(8, parsed.length);
        assertEquals(this.correctFifthSection, parsed[4]);
    },

    "test given proper sample srt when parse with true param timeInMs then parsed properly with time in milliseconds": function () {
        var parsed = SrtParser.parse(this.sampleSrt, true);

        assertEquals(8, parsed.length);
        assertEquals(this.correctFifthSection, parsed[4]);
    },

    "test given parsed data when crop value 0 then return unchanged data": function () {
        var parsed = SrtParser.parse(this.sampleSrt, true);
        var cropTime = 0;

        var cropped = SrtParser.cropTimes(parsed, cropTime);

        assertEquals(8, cropped.length);
        assertEquals(this.correctFifthSection, cropped[4]);
    },

    "test given parsed data when crop value 10 seconds then return cropped data": function () {
        var parsed = SrtParser.parse(this.sampleSrt, true);
        var cropTime = 10 * 1000; //10 seconds to ms

        var cropped = SrtParser.cropTimes(parsed, cropTime);

        this.correctFifthSection.startTime = this.correctFifthSection.startTime - 10000;
        this.correctFifthSection.endTime = this.correctFifthSection.endTime - 10000;

        assertEquals(7, cropped.length);
        assertEquals(0, cropped[0].startTime);
        assertEquals(1303, cropped[0].endTime);
        assertEquals(this.correctFifthSection, cropped[3]);
    },

    "test given invalid timeColon time when timeColonSeparatedToMs then return 0": function () {
        var sampleTime = "eee:33sx,0";
        var expected = 0;

        var result = SrtParser.timeColonSeparatedToMs(sampleTime);
        assertEquals(expected, result);
    },

    "test given valid timeColon time when timeColonSeparatedToMs then return correctly transformed value": function () {
        var sampleTime = "01:03:33,923";
        var expected = 3813923;

        var result = SrtParser.timeColonSeparatedToMs(sampleTime);
        assertEquals(expected, result);
    },

    "test given invalid value in ms when msToTimeColonSeparated then return 0": function () {
        var sampleTime = "eee:33sx,0";
        var expected = 0;

        var result = SrtParser.msToTimeColonSeparated(sampleTime);
        assertEquals(expected, result);
    },

    "test given valid value in ms when msToTimeColonSeparated then return correct timeColon format": function () {
        var sampleTime = 3813923;
        var expected = "01:03:33,923";

        var result = SrtParser.msToTimeColonSeparated(sampleTime);
        assertEquals(expected, result);
    },
});