TestCase("[Commons - String Utils] getNumericPattern method", {
    setUp: function () {
        this.pattern = StringUtils.getNumericPattern();
        const regexp = RegExp(this.pattern)
        this.isNumericFormat = function(text) {
            var match = regexp.exec(text);
            if (match) {
                if (match[0] === text)
                    return true;
            }
            return false;
        };
    },
    'test if returns String type': function () {
        assertString(StringUtils.getNumericPattern());
    },
    'test if one exponent sign is accepted': function () {
        var text = "";
        var signs = ['e', 'E'];
        var examples = ["", "100", "-100", "+100"];

        for (var i = 0; i < examples.length; i++) {
            for (var j = 0; j < signs.length; j++) {
                text = signs[j] + examples[i];
                assertTrue(this.isNumericFormat(text));
            }
        }
    },
    'test if more then one exponent sign is not accepted': function () {
        var text = "";
        var signs = ['e', 'E'];
        var examples = ["", "100", "-100", "+100"];

        for (var i = 0; i < examples.length; i++) {
            for (var j = 0; j < signs.length; j++) {
                text = signs[j] + examples[i] + 'e';
                assertFalse(this.isNumericFormat(text));
            }
        }
    },
    'test if plus sign is accepted in front': function () {
        var text = "+100";

        assertTrue(this.isNumericFormat(text));
    },
    'test if minus sign is accepted in front': function () {
        var text = "-100";

        assertTrue(this.isNumericFormat(text));
    },
    'test if plus sign is accepted after an exponent': function () {
        var text = "e+100";

        assertTrue(this.isNumericFormat(text));
    },
    'test if minus sign is accepted after an exponent': function () {
        var text = "e-100";

        assertTrue(this.isNumericFormat(text));
    },
    'test if sign is accepted after an exponent and in front': function () {
        var examples = ["+e+100", "+e-100", "-e+100", "-e-100"];

        for (var i = 0; i < examples.length; i++) {
            assertTrue(this.isNumericFormat(examples[i]));
        }
    },
    'test if sign is not accepted in middle of text': function () {
         var examples = [
            "++100", "+-100", "-+100", "--100",
            "e++100", "e+-100", "e-+100", "e--100",
            "e+1+100", "e+1-100", "e-1+100", "e-1-100",
            "100+100", "100-100",
        ];

        for (var i = 0; i < examples.length; i++) {
            assertFalse(this.isNumericFormat(examples[i]));
        }
    },
    'test if periods and commas are accepted anywhere in the text': function () {
        var examples = [
            ".", ",", "+.", "-,", ".100", "..10", ",100", ",,10", ".,10",
            ".1.1.,.1..", "+.1,e-,...,1..1."
        ];

        for (var i = 0; i < examples.length; i++) {
            assertTrue(this.isNumericFormat(examples[i]));
        }
    },
    'test if letters are not accepted': function () {
        // the letters e and E are allowed so they are not in the string
        var alphabet = 'abcdfghijklmnopqrstuvwxyzABCDFGHIJKLMNOPQRSTUVWXYZ'.split('');

        for (var i = 0; i < alphabet.length; i++) {
            assertFalse(this.isNumericFormat(alphabet[i]));
        }
    }
});
