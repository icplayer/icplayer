TestCase("[Commons - XSS Utils] sanitize method", {

    'test given html without script or inline js when sanitize is called then content remains the same': function() {
        var html = "<div>Hello World</div>";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals(html, outputHTML);
    },

    'test given html with script when sanitize is called then script element will be removed': function() {
        var html = "<div>Hello World</div><script>alert('You have been hacked!!!')</script>";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals("<div>Hello World</div>", outputHTML);
    },

    'test given html with inline js when sanitize is called then script element will be removed': function() {
        var html = "<div onload='xssAttack()'>Hello World</div>";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals("<div>Hello World</div>", outputHTML);
    },

    'test given img with inline js when sanitize is called then src attribute will be removed': function() {
        var html = "<img src=\"javascript:alert(\"hello everybody\")\"/>";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals("<img>", outputHTML);
    },

    'test given img with src starting with file when sanitize is called then do not remove src attribute': function() {
        var html = "<img src=\"file:///Users/app/data-lessons/5189827790728132/pages/../resources/123\">";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals(html, outputHTML);
    },

    'test given img with src starting with capacitor when sanitize is called then do not remove src attribute': function() {
        var html = "<img src=\"capacitor://pec/_capacitor_file_/var/mobile/Containers/Data/Application/../resources/123\">";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals(html, outputHTML);
    },
});