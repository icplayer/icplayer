TestCase("[Commons - String Utils] Replace All method", {
     setUp: function () {
         this.text = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
     },

     'test pattern with dot': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit! 2\\3Inte,ger tin$cidunt?! a ^dui id ||vehicula! +)";
        var pattern = ".";
        var replacement = "!";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with square closing bracket': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur111 adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
        var pattern = "]";
        var replacement = "111";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with backslash': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2#3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
        var pattern = "\\";
        var replacement = "#";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with question mark': function () {
        var result = "((+Lorem$ $ ipsblaum dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$ciduntbla. a ^dui id ||vehicula. +)";
        var pattern = "?";
        var replacement = "bla";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with asterisk': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse@@ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
        var pattern = "*";
        var replacement = "@";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with plus': function () {
        var result = "((=Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. =)";
        var pattern = "+";
        var replacement = "=";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with dollar': function () {
        var result = "((+Lorem123 ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
        var pattern = "$ $";
        var replacement = "123";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with round opening bracket': function () {
        var result = "+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
        var pattern = "(";
        var replacement = "";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with round closing bracket': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +(";
        var pattern = ")";
        var replacement = "(";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with brace brackets': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis111cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
        var pattern = "{i}";
        var replacement = "111";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with minus': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit++amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id ||vehicula. +)";
        var pattern = " - ";
        var replacement = "++";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    },
    'test pattern with pipe': function () {
        var result = "((+Lorem$ $ ips?um dolor^5 sit - amet, [conse**ctetur] adipis{i}cing ^elit. 2\\3Inte,ger tin$cidunt?. a ^dui id >>vehicula. +)";
        var pattern = "|";
        var replacement = ">";

        assertString(StringUtils.replaceAll(this.text, pattern, replacement));
        assertEquals(result, StringUtils.replaceAll(this.text, pattern, replacement));
    }
});
