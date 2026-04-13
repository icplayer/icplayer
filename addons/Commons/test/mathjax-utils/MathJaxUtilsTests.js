TestCase("[Commons] MathJaxUtils - detectMathJaxSource", {
    setUp: function () {
        this.addedScripts = [];
    },

    tearDown: function () {
        this.addedScripts.forEach(function (el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        this.addedScripts = [];
    },

    addMathJaxScript: function (src) {
        var script = document.createElement('script');
        script.setAttribute('src', src);
        document.head.appendChild(script);
        this.addedScripts.push(script);
        return script;
    },

    'test given no MathJax script in DOM when detecting source then returns empty string': function () {
        var result = window.MathJaxUtils.detectMathJaxSource();

        assertEquals('', result);
    },

    'test given MathJax script in DOM when detecting source then returned URL contains MathJax.js': function () {
        this.addMathJaxScript('javascript/MathJax/MathJax.js');

        var result = window.MathJaxUtils.detectMathJaxSource();

        assertTrue(result.indexOf('MathJax.js') !== -1);
    },

    'test given MathJax script with full path when detecting source then returned URL contains full path fragment': function () {
        this.addMathJaxScript('libs/vendor/MathJax/MathJax.js');

        var result = window.MathJaxUtils.detectMathJaxSource();

        assertTrue(result.indexOf('libs/vendor/MathJax/MathJax.js') !== -1);
    },

    'test given no MathJax script but other scripts in DOM when detecting source then returns empty string': function () {
        var script = document.createElement('script');
        script.setAttribute('src', 'javascript/jquery.js');
        document.head.appendChild(script);
        this.addedScripts.push(script);

        var result = window.MathJaxUtils.detectMathJaxSource();

        assertEquals('', result);
    }
});

TestCase("[Commons] MathJaxUtils - detectMathJaxConfig", {
    setUp: function () {
        this.addedElements = [];
        this.originalMathJax = window.MathJax;
        window.MathJax = undefined;

        this.detectSourceStub = sinon.stub(window.MathJaxUtils, 'detectMathJaxSource');
        this.detectSourceStub.returns('');
    },

    tearDown: function () {
        this.addedElements.forEach(function (el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        this.addedElements = [];
        window.MathJax = this.originalMathJax;
        this.detectSourceStub.restore();
    },

    addConfigScript: function (content) {
        var script = document.createElement('script');
        script.type = 'text/x-mathjax-config';
        script.textContent = content;
        document.head.appendChild(script);
        this.addedElements.push(script);
        return script;
    },

    'test given no config script and no window.MathJax when detecting config then returns empty string': function () {
        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertEquals('', result);
    },

    'test given config script with content when detecting config then returns that content': function () {
        var configContent = 'MathJax.Hub.Config({ tex2jax: {} });';
        this.addConfigScript(configContent);

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertEquals(configContent, result);
    },

    'test given config script and detected MathJax source when detecting config then appends Ajax root fix': function () {
        this.detectSourceStub.returns('http://localhost/javascript/MathJax/MathJax.js');
        var configContent = 'MathJax.Hub.Config({});';
        this.addConfigScript(configContent);

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertTrue(result.indexOf('MathJax.Ajax.config.root') !== -1);
    },

    'test given config script and detected MathJax source when detecting config then Ajax root contains correct path': function () {
        this.detectSourceStub.returns('http://localhost/javascript/MathJax/MathJax.js');
        this.addConfigScript('MathJax.Hub.Config({});');

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertTrue(result.indexOf('http://localhost/javascript/MathJax') !== -1);
    },

    'test given config script and no MathJax source when detecting config then no Ajax root fix appended': function () {
        var configContent = 'MathJax.Hub.Config({});';
        this.addConfigScript(configContent);

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertFalse(result.indexOf('MathJax.Ajax.config.root') !== -1);
    },

    'test given no config script but window.MathJax.Hub.config exists when detecting config then returns generated config string': function () {
        window.MathJax = {
            Hub: {
                config: {
                    jax: ['input/TeX', 'output/HTML-CSS'],
                    extensions: ['tex2jax.js']
                }
            }
        };

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertTrue(result.indexOf('MathJax.Hub.Config') !== -1);
    },

    'test given window.MathJax.Hub.config and isMathML false when detecting config then result contains HTML-CSS jax': function () {
        window.MathJax = {
            Hub: {
                config: { jax: ['input/TeX', 'output/HTML-CSS'] }
            }
        };

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertTrue(result.indexOf('HTML-CSS') !== -1);
    },

    'test given window.MathJax.Hub.config and isMathML true when detecting config then result contains NativeMML jax': function () {
        window.MathJax = {
            Hub: {
                config: { jax: ['input/TeX', 'output/NativeMML'] }
            }
        };

        var result = window.MathJaxUtils.detectMathJaxConfig(true);

        assertTrue(result.indexOf('NativeMML') !== -1);
    },

    'test given window.MathJax without Hub when detecting config then returns empty string': function () {
        window.MathJax = {};

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertEquals('', result);
    },

    'test given window.MathJax.Hub without config when detecting config then returns empty string': function () {
        window.MathJax = { Hub: {} };

        var result = window.MathJaxUtils.detectMathJaxConfig(false);

        assertEquals('', result);
    }
});

TestCase("[Commons] MathJaxUtils - getDefaultMathJaxConfig", {
    setUp: function () {
        this.detectSourceStub = sinon.stub(window.MathJaxUtils, 'detectMathJaxSource');
        this.detectSourceStub.returns('');
    },

    tearDown: function () {
        this.detectSourceStub.restore();
    },

    'test given isMathML false when getting default config then returns MathJax.Hub.Config string': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(false);

        assertTrue(result.indexOf('MathJax.Hub.Config') !== -1);
    },

    'test given isMathML true when getting default config then returns MathJax.Hub.Config string': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(true);

        assertTrue(result.indexOf('MathJax.Hub.Config') !== -1);
    },

    'test given isMathML false when getting default config then result contains HTML-CSS output': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(false);

        assertTrue(result.indexOf('output/HTML-CSS') !== -1);
    },

    'test given isMathML true when getting default config then result contains NativeMML output': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(true);

        assertTrue(result.indexOf('output/NativeMML') !== -1);
    },

    'test given isMathML false when getting default config then result does not contain NativeMML output': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(false);

        assertFalse(result.indexOf('output/NativeMML') !== -1);
    },

    'test given isMathML true when getting default config then result contains HTML-CSS as fallback output': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(true);

        assertTrue(result.indexOf('output/HTML-CSS') !== -1);
    },

    'test given isMathML false when getting default config then result contains TeX input': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(false);

        assertTrue(result.indexOf('input/TeX') !== -1);
    },

    'test given isMathML false when getting default config then result contains MathML input': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(false);

        assertTrue(result.indexOf('input/MathML') !== -1);
    },

    'test given detected MathJax source when getting default config then result contains Ajax root fix': function () {
        this.detectSourceStub.returns('http://localhost/javascript/MathJax/MathJax.js');

        var result = window.MathJaxUtils.getDefaultMathJaxConfig(false);

        assertTrue(result.indexOf('MathJax.Ajax.config.root') !== -1);
    },

    'test given no detected MathJax source when getting default config then result does not contain Ajax root fix': function () {
        var result = window.MathJaxUtils.getDefaultMathJaxConfig(false);

        assertFalse(result.indexOf('MathJax.Ajax.config.root') !== -1);
    }
});
