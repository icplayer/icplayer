/**
 * SoundJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011 gskinner.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * ver. 1.3.0-3 created from release_v0.2.0
 **/
(function (h) {
    var file_extension = navigator.userAgent.indexOf("Firefox") != -1 ? "ogg" : "mp3";

    function b() {
        throw "SoundJS cannot be instantiated";
    }

    function f(a, b) {
        this.init(a, b)
    }

    function d() {
    }

    b.DELIMITER = "|";
    b.AUDIO_TIMEOUT = 8E3;
    b.INTERRUPT_ANY = "any";
    b.INTERRUPT_EARLY = "early";
    b.INTERRUPT_LATE = "late";
    b.INTERRUPT_NONE = "none";
    b.PLAY_INITED = "playInited";
    b.PLAY_SUCCEEDED = "playSucceeded";
    b.PLAY_INTERRUPTED = "playInterrupted";
    b.PLAY_FINISHED = "playFinished";
    b.PLAY_FAILED = "playFailed";
    b.activePlugin = null;
    b.muted = false;
    b.pluginsRegistered = false;
    b.masterVolume = 1;
    b.muted = false;
    b.instances = [];
    b.instanceHash = {};
    b.idHash = null;
    b.defaultSoundInstance = null;
    b.getPreloadHandlers = function () {
        return {callback: b.proxy(b.initLoad, b), types: ["sound"], extensions: ["mp3", "ogg", "wav"]}
    };
    b.registerPlugins = function (a) {
        b.pluginsRegistered = true;
        for (var g = 0, c = a.length; g < c; g++) {
            var e = a[g];
            if (e != null && e.isSupported())return b.activePlugin = new e, true
        }
        return false
    };
    b.registerPlugin = function (a) {
        b.pluginsRegistered = true;
        return a.isSupported() ? (b.activePlugin = new a, true) : false
    };
    b.isReady = function () {
        return b.activePlugin != null
    };
    b.getCapabilities = function () {
        return b.activePlugin ? b.activePlugin.capabilities : null
    };
    b.getCapability = function (a) {
        return b.activePlugin == null ? null : b.activePlugin.capabilities[a]
    };
    b.initLoad = function (a, g, c, e) {
        if (!b.checkPlugin(true))return false;
        a = b.parsePath(a, g, c, e);
        if (a == null)return false;
        if (c != null) {
            if (b.idHash == null)b.idHash = {};
            b.idHash[c] = a.src
        }
        f.create(a.src, e);
        c = b.activePlugin.register(a.src, e);
        if (c != null) {
            if (c.tag != null)a.tag = c.tag; else if (c.src)a.src = c.src;
            if (c.completeHandler != null)a.handler = c.completeHandler
        }
        return a
    };
    b.parsePath = function (a, g, c, e) {
        for (var a = a.split(b.DELIMITER), g = {type: g || "sound", id: c, data: e, handler: b.handleSoundReady}, c = false, e = b.getCapabilities(), i = 0, d = a.length; i < d; i++) {
            var f = a[i], h = f.lastIndexOf("."), extension = f.substr(h + 1).toLowerCase(), h = f.substr(0, h).split("/").pop();
            return g.name = h, g.src = f, g.extension = file_extension, g
        }
        return null
    };
    b.play = function (a, g, c, e, i, d, f) {
        if (file_extension == "ogg") a += "_ogg";

        if (!b.checkPlugin(true)) return b.defaultSoundInstance;
        a = b.getSrcFromId(a);
        a = b.activePlugin.create(a);
        a.mute(b.muted);
        b.playInstance(a, g, c, e, i, d, f) || a.playFailed();
        return a
    };
    b.playInstance = function (a, g, c, e, i, d, f) {
        g = g || b.INTERRUPT_NONE;
        c == null && (c = 0);
        e == null && (e = 0);
        i == null && (i = 0);
        d == null && (d = 1);
        f == null && (f = 0);
        if (c == 0) {
            if (!b.beginPlaying(a, g, e, i, d, f)) return false
        } else setTimeout(function () {
            b.beginPlaying(a, g, e, i, d, f)
        }, c);
        this.instances.push(a);
        this.instanceHash[a.uniqueId] = a;
        return true
    };
    b.beginPlaying = function (a, b, c, e, d, h) {
        if (!f.add(a, b))return false;
        return!a.beginPlaying(c, e, d, h) ? (this.instances.splice(this.instances.indexOf(a), 1), delete this.instanceHash[a.uniqueId], false) : true
    };
    b.checkPlugin = function (a) {
        return b.activePlugin == null && (a && !b.pluginsRegistered && b.registerPlugin(b.HTMLAudioPlugin), b.activePlugin == null) ? false : true
    };
    b.getSrcFromId = function (a) {
        return b.idHash == null || b.idHash[a] == null ? a : b.idHash[a]
    };
    b.setVolume = function (a, g) {
        if (Number(a) == null)return false;
        a = Math.max(0, Math.min(1, a));
        return b.tellAllInstances("setVolume", g, a)
    };
    b.getMasterVolume =
        function () {
            return b.masterVolume
        };
    b.setMasterVolume = function (a) {
        b.masterVolume = a;
        return b.tellAllInstances("setMasterVolume", null, a)
    };
    b.setMute = function (a) {
        this.muted = a;
        return b.tellAllInstances("mute", null, a)
    };
    b.pause = function (a) {
        return b.tellAllInstances("pause", a)
    };
    b.resume = function (a) {
        return b.tellAllInstances("resume", a)
    };
    b.stop = function (a) {
        return b.tellAllInstances("stop", a)
    };
    b.getInstanceById = function (a) {
        return this.instanceHash[a]
    };
    b.playFinished = function (a) {
        f.remove(a);
        this.instances.splice(this.instances.indexOf(a),
            1)
    };
    b.tellAllInstances = function (a, b, c) {
        if (this.activePlugin == null)return false;
        for (var b = this.getSrcFromId(b), e = this.instances.length - 1; e >= 0; e--) {
            var d = this.instances[e];
            if (!(b != null && d.src != b))switch (a) {
                case "pause":
                    d.pause();
                    break;
                case "resume":
                    d.resume();
                    break;
                case "setVolume":
                    d.setVolume(c);
                    break;
                case "setMasterVolume":
                    d.setMasterVolume(c);
                    break;
                case "mute":
                    d.mute(c);
                    break;
                case "stop":
                    d.stop();
                    break;
                case "setPan":
                    d.setPan(c)
            }
        }
        return true
    };
    b.proxy = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    };
    h.SoundJS = b;
    f.channels = {};
    f.create = function (a, b) {
        var c = f.get(a);
        c == null ? f.channels[a] = new f(a, b) : c.max += b
    };
    f.add = function (a, b) {
        var c = f.get(a.src);
        return c == null ? false : c.add(a, b)
    };
    f.remove = function (a) {
        var b = f.get(a.src);
        if (b == null)return false;
        b.remove(a);
        return true
    };
    f.get = function (a) {
        return f.channels[a]
    };
    f.prototype = {src: null, max: null, length: 0, init: function (a, b) {
        this.src = a;
        this.max = b || 1;
        this.instances = []
    }, get: function (a) {
        return this.instances[a]
    }, add: function (a, b) {
        if (!this.getSlot(b,
            a))return false;
        this.instances.push(a);
        this.length++;
        return true
    }, remove: function (a) {
        a = this.instances.indexOf(a);
        if (a == -1)return false;
        this.instances.splice(a, 1);
        this.length--;
        return true
    }, getSlot: function (a) {
        for (var g, c, e = 0, d = this.max || 100; e < d; e++) {
            g = this.get(e);
            if (g == null)return true; else if (a == b.INTERRUPT_NONE)continue;
            if (e == 0)c = g; else if (g.playState == b.PLAY_FINISHED || g == b.PLAY_INTERRUPTED || g == b.PLAY_FAILED)c = g; else if (a == b.INTERRUPT_EARLY && g.getPosition() < c.getPosition() || a == b.INTERRUPT_LATE &&
                g.getPosition() > c.getPosition())c = g
        }
        return c != null ? (c.interrupt(), this.remove(c), true) : false
    }, toString: function () {
        return"[SoundJS SoundChannel]"
    }};
    b.defaultSoundInstance = new function () {
        this.pause = this.resume = this.play = this.beginPlaying = this.cleanUp = this.interrupt = this.stop = this.setMasterVolume = this.setVolume = this.mute = this.setPan = this.getPosition = this.setPosition = this.toString = function () {
            return false
        };
        this.getVolume = this.getPan = this.getDuration = function () {
            return 0
        };
        this.playState = b.PLAY_FAILED
    };
    d.init =
        function () {
            var a = navigator.userAgent;
            d.isFirefox = a.indexOf("Firefox") > -1;
            d.isOpera = h.opera != null;
            d.isIOS = a.indexOf("iPod") > -1 || a.indexOf("iPhone") > -1 || a.indexOf("iPad") > -1;
            d.isAdobeAIR = a.indexOf("AdobeAIR") > -1 || h.navigator.isAIR;
            d.isAndroid = a.indexOf("Android") > -1
        };
    d.init();
    b.BrowserDetect = d
})(window);
(function (h) {
    function b() {
        this.init()
    }

    function f(a) {
        this.init(a)
    }

    function d(a) {
        this.init(a)
    }

    b.MAX_INSTANCES = 30;
    b.capabilities = null;
    b.lastId = 0;
    b.AUDIO_READY = "canplaythrough";
    b.AUDIO_ENDED = "ended";
    b.AUDIO_ERROR = "error";
    b.AUDIO_STALLED = "stalled";
    b.fillChannels = false;
    b.isSupported = function () {
        if (SoundJS.BrowserDetect.isAdobeAIR && SoundJS.BrowserDetect.isAndroid)return false;
        b.generateCapabilities();
        if (b.capabilities.mp3 || b.capabilities.ogg || b.capabilities.mpeg || b.capabilities.wav) {
            var a = b.tag;
            return !(a == null || a.canPlayType == null);
        } else return false
    };
    b.generateCapabilities = function () {
        if (b.capabilities == null) {
            var a = b.tag = document.createElement("audio");
            b.capabilities = {panning: false, volume: true, mp3: a.canPlayType("audio/mp3") != "no" && a.canPlayType("audio/mp3") != "" || a.canPlayType("audio/mpeg") != "no" && a.canPlayType("audio/mpeg") != "", ogg: a.canPlayType("audio/ogg") != "no" && a.canPlayType("audio/ogg") != "", mpeg: a.canPlayType("audio/mpeg") != "no" && a.canPlayType("audio/mpeg") != "", wav: a.canPlayType("audio/wav") !=
                "no" && a.canPlayType("audio/wav") != "", channels: b.MAX_INSTANCES}
        }
    };
    b.prototype = {capabilities: null, FT: 0.0010, channels: null, init: function () {
        this.capabilities = b.capabilities;
        this.channels = {}
    }, register: function (a, b) {
        for (var c = d.get(a), e, f = 0, h = b || 1; f < h; f++)e = this.createTag(a), c.add(e);
        return{tag: e}
    }, createTag: function (a) {
        var b = document.createElement("audio");
        b.preload = false;
        b.src = a;
        return b
    }, create: function (a) {
        a = new f(a);
        a.owner = this;
        return a
    }, toString: function () {
        return"[HTMLAudioPlugin]"
    }};
    h.SoundJS.HTMLAudioPlugin =
        b;
    f.prototype = {src: null, uniqueId: -1, playState: null, owner: null, loaded: false, lastInterrupt: SoundJS.INTERRUPT_NONE, offset: 0, delay: 0, volume: 1, pan: 0, remainingLoops: 0, delayTimeout: -1, tag: null, muted: false, paused: false, onComplete: null, onLoop: null, onReady: null, onPlayFailed: null, onPlayInterrupted: null, endedHandler: null, readyHandler: null, stalledHandler: null, init: function (a) {
        this.uniqueId = b.lastId++;
        this.src = a;
        this.endedHandler = SoundJS.proxy(this.handleSoundComplete, this);
        this.readyHandler = SoundJS.proxy(this.handleSoundReady,
            this);
        this.stalledHandler = SoundJS.proxy(this.handleSoundStalled, this)
    }, cleanUp: function () {
        var a = this.tag;
        if (a != null) {
            a.pause();
            try {
                a.currentTime = 0
            } catch (g) {
            }
            a.removeEventListener(b.AUDIO_ENDED, this.endedHandler, false);
            a.removeEventListener(b.AUDIO_READY, this.readyHandler, false);
            d.setInstance(this.src, a);
            this.tag = null
        }
        SoundJS.playFinished(this)
    }, interrupt: function () {
        if (this.tag != null) {
            this.playState = SoundJS.PLAY_INTERRUPTED;
            if (this.onPlayInterrupted)this.onPlayInterrupted(this);
            this.cleanUp();
            this.paused =
                false
        }
    }, play: function (a, b, c, e, d, f) {
        this.cleanUp();
        SoundJS.playInstance(this, a, b, c, e, d, f)
    }, beginPlaying: function (a, g, c) {
        var e = this.tag = d.getInstance(this.src);
        if (e == null)return this.playFailed(), -1;
        e.addEventListener(b.AUDIO_ENDED, this.endedHandler, false);
        this.offset = a;
        this.volume = c;
        this.updateVolume();
        this.remainingLoops = g;
        e.readyState !== 4 ? (e.addEventListener(b.AUDIO_READY, this.readyHandler, false), e.addEventListener(b.AUDIO_STALLED, this.stalledHandler, false), e.load()) : this.handleSoundReady(null);
        return 1
    }, handleSoundStalled: function () {
        if (this.onPlayFailed != null)this.onPlayFailed(this);
        this.cleanUp()
    }, handleSoundReady: function () {
        this.playState = SoundJS.PLAY_SUCCEEDED;
        this.paused = false;
        this.tag.removeEventListener(b.AUDIO_READY, this.readyHandler, false);
        this.offset >= this.getDuration() ? this.playFailed() : (this.tag.currentTime = this.offset * 0.0010, this.tag.play())
    }, pause: function () {
        this.paused = true;
        return this.tag != null ? (this.tag.pause(), false) : true
    }, resume: function () {
        this.paused = false;
        return this.tag != null ? (this.tag.play(), false) : true
    }, stop: function () {
        this.pause();
        this.playState = SoundJS.PLAY_FINISHED;
        this.cleanUp();
        return true
    }, setMasterVolume: function () {
        this.updateVolume();
        return true
    }, setVolume: function (a) {
        this.volume = a;
        this.updateVolume();
        return true
    }, updateVolume: function () {
        return this.tag != null ? (this.tag.volume = this.muted ? 0 : this.volume * SoundJS.masterVolume, true) : false
    }, getVolume: function () {
        return this.volume
    }, mute: function (a) {
        this.muted = a;
        this.updateVolume();
        return true
    }, setPan: function () {
        return false
    },
        getPan: function () {
            return 0
        }, getPosition: function () {
            return this.tag == null ? 0 : this.tag.currentTime * 1E3
        }, setPosition: function (a) {
            if (this.tag == null)return false;
            try {
                this.tag.currentTime = a * 0.0010
            } catch (b) {
                return false
            }
            return true
        }, getDuration: function () {
            return this.tag == null ? 0 : this.tag.duration * 1E3
        }, handleSoundComplete: function () {
            if (this.remainingLoops != 0) {
                this.remainingLoops--;
                try {
                    this.tag.currentTime = 0
                } catch (a) {
                }
                this.tag.play();
                if (this.onLoop != null)this.onLoop(this)
            } else {
                this.playState = SoundJS.PLAY_FINISHED;
                if (this.onComplete != null)this.onComplete(this);
                this.cleanUp()
            }
        }, playFailed: function () {
            this.playState = SoundJS.PLAY_FAILED;
            if (this.onPlayFailed != null)this.onPlayFailed(this);
            this.cleanUp()
        }, toString: function () {
            return"[HTMLAudio SoundInstance]"
        }};
    d.channels = {};
    d.get = function (a) {
        var b = d.channels[a];
        b == null && (b = d.channels[a] = new d(a));
        return b
    };
    d.getInstance = function (a) {
        a = d.channels[a];
        return a == null ? null : a.get()
    };
    d.setInstance = function (a, b) {
        var c = d.channels[a];
        return c == null ? null : c.set(b)
    };
    d.prototype =
    {src: null, length: 0, available: 0, tags: null, container: null, init: function (a) {
        this.src = a;
        this.tags = [];
        this.container = document.createElement("div");
        this.container.style.width = "0px";
        this.container.style.height = "0px";
        document.body.appendChild(this.container)
    }, add: function (a) {
        this.tags.push(a);
        this.length++;
        this.available = this.tags.length
    }, get: function () {
        if (this.tags.length == 0)return null;
        this.available = this.tags.length;
        var a = this.tags.pop();
        a.parentNode == null && this.container.appendChild(a);
        return a
    }, set: function (a) {
        this.tags.indexOf(a) == -1 && this.tags.push(a);
        this.available = this.tags.length
    }, toString: function () {
        return"[HTMLAudioPlugin TagChannel]"
    }}
})(window);
(function (h) {
    function b() {
        this.init()
    }

    function f(a, b) {
        this.init(a, b)
    }

    function d(a, b, c, e) {
        this.init(a, b, c, e)
    }

    b.capabilities = null;
    b.BASE_PATH = "src/soundjs";
    b.lastId = 0;
    b.preloadId = 0;
    b.isSupported = function () {
        return SoundJS.BrowserDetect.isAdobeAIR && SoundJS.BrowserDetect.isAndroid
    };
    b.generateCapabilities = function () {
        return b.capabilities != null ? b.capabilities : b.capabilities = {panning: true, volume: true, mp3: true, ogg: true, mpeg: true, wav: true, channels: 255}
    };
    b.prototype = {CONTAINER_ID: "flashAudioContainer", capabilities: null,
        container: null, externalContainer: null, flashReady: false, externalPlayerSoundInstances: null, externalPlayerPreloadInstances: null, queuedInstances: null, init: function () {
            this.capabilities = b.generateCapabilities();
            this.externalPlayerSoundInstances = {};
            this.externalPlayerPreloadInstances = {};
            this.queuedInstances = []
        }, handleTimeout: function () {
        }, register: function (a) {
            var g = "p" + b.preloadId++;
            return new d(a, this.externalContainer, this, g)
        }, create: function (a) {
            try {
                var b = new f(a, this.externalContainer);
                b.owner = this;
                return b
            } catch (c) {
            }
            return null
        },
        registerSoundInstance: function (a, b) {
            this.externalPlayerSoundInstances[a] = b
        }, unregisterSoundInstance: function (a) {
            delete this.externalPlayerSoundInstances[a]
        }, handleSoundEvent: function (a, b) {
            var c = this.externalPlayerSoundInstances[a];
            if (c != null) {
                for (var e = [], d = 2, f = arguments.length; d < f; d++)e.push(arguments[d]);
                try {
                    if (e.length == 0)c[b](); else c[b].apply(c, e)
                } catch (h) {
                }
            }
        }, handleEvent: function () {
        }, handleErrorEvent: function () {
        }, toString: function () {
            return"[ExternalPlugin]"
        }};
    h.SoundJS.ExternalPlugin = b;
    f.prototype =
    {src: null, uniqueId: -1, capabilities: null, externalContainer: null, playerId: null, loop: 0, volume: 1, pan: 0, muted: false, paused: false, onComplete: null, onLoop: null, onReady: null, onPlayFailed: null, onPlayInterrupted: null, init: function (a) {
        this.playerId = h.soundJsExternalRegister(a);
        this.src = a;
        this.externalPlayer = h
    }, initialize: function (a) {
        this.externalContainer = a
    }, interrupt: function () {
        this.playState = SoundJS.PLAY_INTERRUPTED;
        if (this.onPlayInterrupted != null)this.onPlayInterrupted(this);
        this.cleanUp()
    }, cleanUp: function () {
        this.owner.unregisterSoundInstance(this.playerId);
        SoundJS.playFinished(this)
    }, play: function (a, b, c, e, d, f, ext) {
        SoundJS.playInstance(this, a, b, c, e, d, f, ext)
    }, beginPlaying: function (a, b) {
        this.loop = b;
        this.paused = false;
        this.externalPlayer.soundJsExternalPlay(this.playerId);
        this.playState = SoundJS.PLAY_SUCCEEDED;
        this.owner.registerSoundInstance(this.playerId, this);
        return true
    }, pause: function () {
        this.paused = true;
        this.externalPlayer.soundJsExternalPause(this.playerId)
    }, resume: function () {
        this.paused = false;
        this.externalPlayer.soundJsExternalResume(this.playerId)
    }, stop: function () {
        this.playState =
            SoundJS.PLAY_FINISHED;
        this.paused = false;
        this.externalPlayer.soundJsExternalStop(this.playerId);
        this.cleanUp();
        return true
    }, setVolume: function (a) {
        this.volume = a
    }, getVolume: function () {
        return this.volume
    }, mute: function (a) {
        this.muted = a
    }, getPan: function () {
        return this.pan
    }, setPan: function (a) {
        this.pan = a
    }, getPosition: function () {
        return 0
    }, setPosition: function () {
    }, getDuration: function () {
    }, handleSoundFinished: function () {
        this.playState = SoundJS.PLAY_FINISHED;
        if (this.onComplete != null)this.onComplete(this);
        this.cleanUp()
    },
        handleLoop: function () {
            if (this.onLoop != null)this.onLoop(this)
        }, toString: function () {
        return"[ExternalPlugin SoundInstance]"
    }};
    d.prototype = {externalContainer: null, src: null, tag: null, playerId: null, progress: 1, readyState: 4, loading: false, preloadId: null, owner: null, onload: null, onprogress: null, onError: null, init: function (a, b, c, d) {
        this.src = a;
        this.externalContainer = b;
        this.owner = c;
        this.preloadId = d;
        this.tag = this
    }, initialize: function () {
    }, load: function () {
        return false
    }, handleProgress: function (a, b) {
        this.progress = a / b;
        if (this.onprogress != null)this.onprogress({loaded: a, total: b, progress: this.progress})
    }, handleComplete: function () {
        this.progress = 1;
        this.readyState = 4;
        if (this.onload != null)this.onload()
    }, handleError: function (a) {
        if (this.onerror != null)this.onerror(a)
    }, toString: function () {
        return"[ExternalPlugin SoundLoader]"
    }}
})(window);