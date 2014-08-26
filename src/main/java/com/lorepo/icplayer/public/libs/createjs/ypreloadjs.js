/**
 * PreloadJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011 gskinner.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * ver. 1.3.0-1 created from release_v0.1.0
 **/
(function (c) {
    var e = function () {
        this.init()
    };
    e.prototype = {};
    var a = e.prototype;
    a.loaded = false;
    a.progress = 0;
    a._item = null;
    a.onProgress = null;
    a.onLoadStart = null;
    a.onFileLoad = null;
    a.onFileProgress = null;
    a.onComplete = null;
    a.onError = null;
    a.getItem = function () {
        return this._item
    };
    a.init = function () {
    };
    a.load = function () {
    };
    a.cancel = function () {
    };
    a._sendLoadStart = function () {
        if (this.onLoadStart)this.onLoadStart({target: this})
    };
    a._sendProgress = function (a) {
        var b;
        if (a instanceof Number)this.progress = a, b = {loaded: this.progress,
            total: 1}; else if (b = a, this.progress = a.loaded / a.total, isNaN(this.progress) || this.progress == Infinity)this.progress = 0;
        b.target = this;
        if (this.onProgress)this.onProgress(b)
    };
    a._sendFileProgress = function (a) {
        if (this.onFileProgress)a.target = this, this.onFileProgress(a)
    };
    a._sendComplete = function () {
        if (this.onComplete)this.onComplete({target: this})
    };
    a._sendFileComplete = function (a) {
        if (this.onFileLoad)a.target = this, this.onFileLoad(a)
    };
    a._sendError = function (a) {
        if (this.onError)a == null && (a = {}), a.target = this, this.onError(a)
    };
    a.toString = function () {
        return"[PreloadJS AbstractLoader]"
    };
    c.AbstractLoader = e
})(createjs || (createjs = {}));
var createjs;
(function (c) {
    var e = function (b) {
        this.initialize(b)
    }, a = e.prototype = new c.AbstractLoader;
    e.IMAGE = "image";
    e.SVG = "svg";
    e.SOUND = "sound";
    e.JSON = "json";
    e.JAVASCRIPT = "javascript";
    e.CSS = "css";
    e.XML = "xml";
    e.TEXT = "text";
    e.TIMEOUT_TIME = 2E3;
    a.useXHR = true;
    a.stopOnError = false;
    a.maintainScriptOrder = true;
    a.next = null;
    a.typeHandlers = null;
    a.extensionHandlers = null;
    a._loadStartWasDispatched = false;
    a._maxConnections = 1;
    a._currentLoads = null;
    a._loadQueue = null;
    a._loadedItemsById = null;
    a._loadedItemsBySrc = null;
    a._targetProgress =
        0;
    a._numItems = 0;
    a._numItemsLoaded = null;
    a._scriptOrder = null;
    a._loadedScripts = null;
    a.TAG_LOAD_OGGS = true;
    a.initialize = function (b) {
        this._targetProgress = this._numItemsLoaded = this._numItems = 0;
        this._paused = false;
        this._currentLoads = [];
        this._loadQueue = [];
        this._scriptOrder = [];
        this._loadedScripts = [];
        this._loadedItemsById = {};
        this._loadedItemsBySrc = {};
        this.typeHandlers = {};
        this.extensionHandlers = {};
        this._loadStartWasDispatched = false;
        this.useXHR = b != false && window.XMLHttpRequest != null;
        this.determineCapabilities()
    };
    a.determineCapabilities = function () {
        var b = c.BrowserDetect;
        if (b != null)c.PreloadJS.TAG_LOAD_OGGS = b.isFirefox || b.isOpera
    };
    e.isBinary = function (b) {
        switch (b) {
            case c.PreloadJS.IMAGE:
            case c.PreloadJS.SOUND:
                return true;
            default:
                return false
        }
    };
    a.installPlugin = function (b) {
        if (!(b == null || b.getPreloadHandlers == null)) {
            b = b.getPreloadHandlers();
            if (b.types != null)for (var a = 0, d = b.types.length; a < d; a++)this.typeHandlers[b.types[a]] = b.callback;
            if (b.extensions != null)for (a = 0, d = b.extensions.length; a < d; a++)this.extensionHandlers[b.extensions[a]] =
                b.callback
        }
    };
    a.setMaxConnections = function (b) {
        this._maxConnections = b;
        this._paused || this._loadNext()
    };
    a.loadFile = function (b, a) {
        b == null ? this._sendError({text: "File is null."}) : (this._addItem(b), a !== false && this.setPaused(false))
    };
    a.loadManifest = function (b, a) {
        var d;
        if (b instanceof Array) {
            if (b.length == 0) {
                this._sendError({text: "Manifest is empty."});
                return
            }
            d = b
        } else {
            if (b == null) {
                this._sendError({text: "Manifest is null."});
                return
            }
            d = [b]
        }
        for (var c = 0, e = d.length; c < e; c++)this._addItem(d[c], false);
        a !== false && this._loadNext()
    };
    a.load = function () {
        this.setPaused(false)
    };
    a.getResult = function (b) {
        return this._loadedItemsById[b] || this._loadedItemsBySrc[b]
    };
    a.setPaused = function (b) {
        (this._paused = b) || this._loadNext()
    };
    a.close = function () {
        for (; this._currentLoads.length;)this._currentLoads.pop().cancel();
        this._currentLoads = [];
        this._scriptOrder = [];
        this._loadedScripts = []
    };
    a._addItem = function (b) {
        b = this._createLoadItem(b);
        b != null && (this._loadQueue.push(b), this._numItems++, this._updateProgress(), b.getItem().type == c.PreloadJS.JAVASCRIPT &&
            (this._scriptOrder.push(b.getItem()), this._loadedScripts.push(null)))
    };
    a._loadNext = function () {
        if (!this._paused) {
            if (!this._loadStartWasDispatched)this._sendLoadStart(), this._loadStartWasDispatched = true;
            if (this._numItems == this._numItemsLoaded)this.loaded = true, this._sendComplete(), this.next && this.next.load && this.next.load.apply(this.next);
            for (; this._loadQueue.length && this._currentLoads.length < this._maxConnections;)this._loadItem(this._loadQueue.shift())
        }
    };
    a._loadItem = function (b) {
        b.onProgress = c.PreloadJS.proxy(this._handleProgress,
            this);
        b.onComplete = c.PreloadJS.proxy(this._handleFileComplete, this);
        b.onError = c.PreloadJS.proxy(this._handleFileError, this);
        this._currentLoads.push(b);
        b.load()
    };
    a._handleFileError = function (b) {
        var b = b.target, a = this._createResultData(b.getItem());
        this._numItemsLoaded++;
        this._updateProgress();
        this._sendError(a);
        this.stopOnError || (this._removeLoadItem(b), this._loadNext())
    };
    a._createResultData = function (b) {
        var a = {id: b.id, result: null, data: b.data, type: b.type, src: b.src};
        this._loadedItemsById[b.id] = a;
        return this._loadedItemsBySrc[b.src] =
            a
    };
    a._handleFileComplete = function (b) {
        var b = b.target, a = b.getItem(), d = this._createResultData(a);
        this._removeLoadItem(b);
        d.result = b instanceof c.XHRLoader ? this._createResult(a, b.getResult()) : a.tag;
        switch (a.type) {
            case c.PreloadJS.IMAGE:
                if (b instanceof c.XHRLoader) {
                    var e = this;
                    d.result.onload = function () {
                        e._handleFileTagComplete(a, d)
                    };
                    return
                }
                break;
            case c.PreloadJS.JAVASCRIPT:
                if (this.maintainScriptOrder) {
                    this._loadedScripts[this._scriptOrder.indexOf(a)] = a;
                    this._checkScriptLoadOrder(b);
                    return
                }
        }
        this._handleFileTagComplete(a,
            d)
    };
    a._checkScriptLoadOrder = function () {
        for (var b = this._loadedScripts.length, a = 0; a < b; a++) {
            var d = this._loadedScripts[a];
            if (d === null)break;
            if (d !== true) {
                var c = this.getResult(d.src), d = this.getResult(d.id);
                d.result = c.result;
                this._handleFileTagComplete(c, d);
                this._loadedScripts[a] = true;
                a--;
                b--
            }
        }
    };
    a._handleFileTagComplete = function (b, a) {
        this._numItemsLoaded++;
        b.completeHandler && b.completeHandler(a);
        this._updateProgress();
        this._sendFileComplete(a);
        this._loadNext()
    };
    a._removeLoadItem = function (b) {
        for (var a = this._currentLoads.length,
                 d = 0; d < a; d++)if (this._currentLoads[d] == b) {
            this._currentLoads.splice(d, 1);
            break
        }
    };
    a._createResult = function (b, a) {
        var d = null, e;
        switch (b.type) {
            case c.PreloadJS.IMAGE:
                d = this._createImage();
                break;
            case c.PreloadJS.SOUND:
                d = b.tag || this._createAudio();
                break;
            case c.PreloadJS.CSS:
                d = this._createLink();
                break;
            case c.PreloadJS.JAVASCRIPT:
                d = this._createScript();
                break;
            case c.PreloadJS.SVG:
                var d = this._createSVG(), g = this._createXML(a, "image/svg+xml");
                d.appendChild(g);
                break;
            case c.PreloadJS.XML:
                e = this._createXML(a, "text/xml");
                break;
            case c.PreloadJS.JSON:
            case c.PreloadJS.TEXT:
                e = a
        }
        if (d) {
            if (b.type == c.PreloadJS.CSS)d.href = b.src; else if (b.type != c.PreloadJS.SVG)d.src = b.src;
            return d
        } else return e
    };
    a._createXML = function (b, a) {
        var d;
        window.DOMParser ? (d = new DOMParser, d = d.parseFromString(b, a)) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = false, d.loadXML(b));
        return d
    };
    a._handleProgress = function (b) {
        var b = b.target, a = this._createResultData(b.getItem());
        a.progress = b.progress;
        this._sendFileProgress(a);
        this._updateProgress()
    };
    a._updateProgress =
        function () {
            var b = this._numItemsLoaded / this._numItems, a = this._numItems - this._numItemsLoaded;
            if (a > 0) {
                for (var d = 0, c = 0, e = this._currentLoads.length; c < e; c++)d += this._currentLoads[c].progress;
                b += d / a * (a / this._numItems)
            }
            this._sendProgress({loaded: b, total: 1})
        };
    a._isInstanceOfHTMLAudioElement = function (b) {
        try {
            return b instanceof HTMLAudioElement
        } catch (a) {
            return false
        }
    };
    a._createLoadItem = function (b) {
        var a = {};
        switch (typeof b) {
            case "string":
                a.src = b;
                break;
            case "object":
                this._isInstanceOfHTMLAudioElement(b) ? (a.tag =
                    b, a.src = a.tag.src, a.type = c.PreloadJS.SOUND) : a = b
        }
        a.ext = this._getNameAfter(a.src, ".");
        if (!a.type)a.type = this.getType(a.ext);
        if (a.id == null || a.id == "")a.id = a.src;
        if (b = this.typeHandlers[a.type] || this.extensionHandlers[a.ext]) {
            b = b(a.src, a.type, a.id, a.data);
            if (b === false)return null; else if (b !== true) {
                if (b.src != null)a.src = b.src;
                if (b.id != null)a.id = b.id;
                if (b.tag != null && b.tag.load instanceof Function)a.tag = b.tag
            }
            a.ext = this._getNameAfter(a.src, ".")
        }
        b = this.useXHR;
        switch (a.type) {
            case c.PreloadJS.JSON:
            case c.PreloadJS.XML:
            case c.PreloadJS.TEXT:
                b =
                    true;
                break;
            case c.PreloadJS.SOUND:
                a.ext == "ogg" && c.PreloadJS.TAG_LOAD_OGGS && (b = false)
        }
        return this.useXHR == true && (a.type == c.PreloadJS.IMAGE || a.type == c.PreloadJS.SVG) ? (a = this._createTagItem(a), a.useXHR = true, a) : b ? new c.XHRLoader(a) : a.tag ? new c.TagLoader(a) : this._createTagItem(a)
    };
    a._createTagItem = function (a) {
        var d, e = "src", f = false;
        switch (a.type) {
            case c.PreloadJS.IMAGE:
                d = this._createImage();
                break;
            case c.PreloadJS.SOUND:
                d = this._createAudio();
                break;
            case c.PreloadJS.CSS:
                e = "href";
                f = true;
                d = this._createLink();
                break;
            case c.PreloadJS.JAVASCRIPT:
                f = true;
                d = this._createScript();
                break;
            case c.PreloadJS.SVG:
                e = "data", d = this._createSVG()
        }
        a.tag = d;
        return new c.TagLoader(a, e, f)
    };
    a.getType = function (a) {
        switch (a) {
            case "jpeg":
            case "jpg":
            case "gif":
            case "png":
                return c.PreloadJS.IMAGE;
            case "ogg":
            case "mp3":
            case "wav":
                return c.PreloadJS.SOUND;
            case "json":
                return c.PreloadJS.JSON;
            case "xml":
                return c.PreloadJS.XML;
            case "css":
                return c.PreloadJS.CSS;
            case "js":
                return c.PreloadJS.JAVASCRIPT;
            case "svg":
                return c.PreloadJS.SVG;
            default:
                return c.PreloadJS.TEXT
        }
    };
    a._getNameAfter = function (a, d) {
        var c = a.lastIndexOf(d), c = a.substr(c + 1), e = c.lastIndexOf(/[\b|\?|\#|\s]/);
        return e == -1 ? c : c.substr(0, e)
    };
    a._createImage = function () {
        return document.createElement("img")
    };
    a._createSVG = function () {
        var a = document.createElement("object");
        a.type = "image/svg+xml";
        return a
    };
    a._createAudio = function () {
        var a = document.createElement("audio");
        a.autoplay = false;
        a.type = "audio/ogg";
        return a
    };
    a._createScript = function () {
        var a = document.createElement("script");
        a.type = "text/javascript";
        return a
    };
    a._createLink = function () {
        var a = document.createElement("link");
        a.type = "text/css";
        a.rel = "stylesheet";
        return a
    };
    a.toString = function () {
        return"[PreloadJS]"
    };
    e.proxy = function (a, d) {
        return function (c) {
            return a.apply(d, arguments)
        }
    };
    c.PreloadJS = e;
    var d = function () {
    };
    d.init = function () {
        var a = navigator.userAgent;
        d.isFirefox = a.indexOf("Firefox") > -1;
        d.isOpera = window.opera != null;
        d.isIOS = a.indexOf("iPod") > -1 || a.indexOf("iPhone") > -1 || a.indexOf("iPad") > -1
    };
    d.init();
    c.BrowserDetect = d
})(createjs || (createjs = {}));
(function (c) {
    var e = function (a, b, c) {
        this.init(a, b, c)
    }, a = e.prototype = new c.AbstractLoader;
    a._srcAttr = null;
    a._loadTimeOutTimeout = null;
    a.tagCompleteProxy = null;
    a.init = function (a, b, e) {
        this._item = a;
        this._srcAttr = b || "src";
        this.useXHR = e == true;
        this.isAudio = this._isAudioTag(a.tag);
        this.tagCompleteProxy = c.PreloadJS.proxy(this._handleTagLoad, this)
    };
    a.cancel = function () {
        this._clean();
        var a = this.getItem();
        if (a != null)a.src = null
    };
    a.load = function () {
        this.useXHR ? this.loadXHR() : this.loadTag()
    };
    a.loadXHR = function () {
        var a =
            this.getItem(), a = new c.XHRLoader(a);
        a.onProgress = c.PreloadJS.proxy(this._handleProgress, this);
        a.onFileLoad = c.PreloadJS.proxy(this._handleXHRComplete, this);
        a.onComplete = c.PreloadJS.proxy(this._handleXHRComplete, this);
        a.onError = c.PreloadJS.proxy(this._handleLoadError, this);
        a.load()
    };
    a._handleXHRComplete = function (a) {
        this._clean();
        a.target.onFileLoad = null;
        a.target.onComplete = null;
        var b = a.target.getItem();
        a.target.getResult();
        b.type == c.PreloadJS.IMAGE ? (b.tag.onload = c.PreloadJS.proxy(this._sendComplete,
            this), b.tag.src = b.src) : (b.tag[this._srcAttr] = b.src, this._sendComplete())
    };
    a._handleLoadError = function (a) {
        a.error && a.error.code == 101 ? this.loadTag() : (this._clean(), this._sendError(a))
    };
    a._isAudioTag = function (a) {
        try {
            return a instanceof HTMLAudioElement
        } catch (b) {
            return false
        }
    };
    a.loadTag = function () {
        var a = this.getItem(), b = a.tag;
        clearTimeout(this._loadTimeOutTimeout);
        this._loadTimeOutTimeout = setTimeout(c.PreloadJS.proxy(this._handleLoadTimeOut, this), c.PreloadJS.TIMEOUT_TIME);
        if (this.isAudio)b.src = null, b.preload =
            "auto", b.setAttribute("data-temp", "true");
        b.onerror = c.PreloadJS.proxy(this._handleLoadError, this);
        b.onprogress = c.PreloadJS.proxy(this._handleProgress, this);
        this.isAudio ? (b.onstalled = c.PreloadJS.proxy(this._handleStalled, this), b.addEventListener("canplaythrough", this.tagCompleteProxy, false)) : b.onload = c.PreloadJS.proxy(this._handleTagLoad, this);
        b[this._srcAttr] = a.src;
        a.type == c.PreloadJS.SVG && document.getElementsByTagName("body")[0].appendChild(b);
        a = a.type == c.PreloadJS.SOUND && a.ext == "ogg" && c.BrowserDetect.isFirefox;
        b.load != null && !a && b.load();
        b = this._getNameAfter(b.src, ".");
        (this.isAudio || b == "ogg" || b == "mp3" || b == "mp4" || b == "ogv") && this._handleLoadTimeOut()
    };
    a._handleLoadTimeOut = function () {
        this._clean();
        this._sendError()
    };
    a._handleStalled = function () {
    };
    a._handleLoadError = function () {
        this._clean();
        this._sendError()
    };
    a._handleTagLoad = function () {
        var a = this.getItem().tag;
        clearTimeout(this._loadTimeOutTimeout);
        if (!(this.loaded || this.isAudio && a.readyState !== 4))this.getItem().type == c.PreloadJS.SVG && document.getElementsByTagName("body")[0].removeChild(a),
            this.loaded = true, this._clean(), this._sendComplete()
    };
    a._clean = function () {
        clearTimeout(this._loadTimeOutTimeout);
        var a = this.getItem().tag;
        a.onload = null;
        a.removeEventListener != null && a.removeEventListener("canplaythrough", this.tagCompleteProxy, false);
        a.onstalled = null;
        a.onprogress = null;
        a.onerror = null
    };
    a._handleProgress = function (a) {
        clearTimeout(this._loadTimeOutTimeout);
        if (this.isAudio) {
            a = this.getItem();
            if (a.buffered == null)return;
            a = {loaded: a.buffered.length > 0 ? a.buffered.end(0) : 0, total: a.duration}
        }
        this._sendProgress(a)
    };
    a.toString = function () {
        return"[PreloadJS TagLoader]"
    };
    a._getNameAfter = function (a, b) {
        var c = a.lastIndexOf(b), c = a.substr(c + 1), e = c.lastIndexOf(/[\b|\?|\#|\s]/);
        return e == -1 ? c : c.substr(0, e)
    };
    c.TagLoader = e
})(createjs || (createjs = {}));
(function (c) {
    var e = function (a) {
        this.init(a)
    }, a = e.prototype = new c.AbstractLoader;
    a._wasLoaded = false;
    a._request = null;
    a._loadTimeOutTimeout = null;
    a._xhrLevel = null;
    a.init = function (a) {
        this._item = a;
        this._createXHR(a)
    };
    a.getResult = function () {
        try {
            return this._request.responseText
        } catch (a) {
        }
        return this._request.response
    };
    a.cancel = function () {
        this._clean();
        this._request.abort()
    };
    a.load = function () {
        if (this._request == null)this.handleError(); else {
            if (this._xhrLevel == 1)this._loadTimeOutTimeout = setTimeout(c.PreloadJS.proxy(this.handleTimeout,
                this), c.PreloadJS.TIMEOUT_TIME);
            this._request.onloadstart = c.PreloadJS.proxy(this.handleLoadStart, this);
            this._request.onprogress = c.PreloadJS.proxy(this.handleProgress, this);
            this._request.onabort = c.PreloadJS.proxy(this.handleAbort, this);
            this._request.onerror = c.PreloadJS.proxy(this.handleError, this);
            this._request.ontimeout = c.PreloadJS.proxy(this.handleTimeout, this);
            this._request.onload = c.PreloadJS.proxy(this.handleLoad, this);
            this._request.onreadystatechange = c.PreloadJS.proxy(this.handleReadyStateChange,
                this);
            try {
                this._request.send()
            } catch (a) {
                this._sendError({source: a})
            }
        }
    };
    a.handleProgress = function (a) {
        a.loaded > 0 && a.total == 0 || this._sendProgress({loaded: a.loaded, total: a.total})
    };
    a.handleLoadStart = function () {
        clearTimeout(this._loadTimeOutTimeout);
        this._sendLoadStart()
    };
    a.handleAbort = function () {
        this._clean();
        this._sendError()
    };
    a.handleError = function () {
        this._clean();
        this._sendError()
    };
    a.handleReadyStateChange = function () {
        this._request.readyState == 4 && this.handleLoad()
    };
    a._checkError = function () {
        switch (parseInt(this._request.status)) {
            case 404:
            case 0:
                return false
        }
        return this._hasResponse() ||
            this._hasTextResponse() || this._hasXMLResponse()
    };
    a._hasResponse = function () {
        return this._request.response != null
    };
    a._hasTextResponse = function () {
        try {
            return this._request.responseText != null
        } catch (a) {
            return false
        }
    };
    a._hasXMLResponse = function () {
        try {
            return this._request.responseXML != null
        } catch (a) {
            return false
        }
    };
    a.handleLoad = function () {
        if (!this.loaded)this.loaded = true, this._checkError() ? (this._clean(), this._sendComplete()) : this.handleError()
    };
    a.handleTimeout = function () {
        this._clean();
        this._sendError()
    };
    a._createXHR =
        function (a) {
            this._xhrLevel = 1;
            if (window.ArrayBuffer)this._xhrLevel = 2;
            if (window.XMLHttpRequest)this._request = new XMLHttpRequest; else try {
                this._request = new ActiveXObject("MSXML2.XMLHTTP.3.0")
            } catch (b) {
                return null
            }
            a.type == c.PreloadJS.TEXT && this._request.overrideMimeType && this._request.overrideMimeType("text/plain; charset=x-user-defined");
            this._request.open("GET", a.src, true);
            if (c.PreloadJS.isBinary(a.type))this._request.responseType = "arraybuffer";
            return true
        };
    a._clean = function () {
        clearTimeout(this._loadTimeOutTimeout);
        var a = this._request;
        a.onloadstart = null;
        a.onprogress = null;
        a.onabort = null;
        a.onerror = null;
        a.onload = null;
        a.ontimeout = null;
        a.onloadend = null;
        a.onreadystatechange = null;
        clearInterval(this._checkLoadInterval)
    };
    a.toString = function () {
        return"[PreloadJS XHRLoader]"
    };
    c.XHRLoader = e
})(createjs || (createjs = {}));