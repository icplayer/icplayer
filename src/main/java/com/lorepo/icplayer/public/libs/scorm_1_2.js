function getScorm_1_2() {
	var scorm = function() {}

	var nFindAPITries = 0;
	var API = null;
	var maxTries = 500;
	var initialized = false;

	function scanForAPI(win) {
		while ((win.API == null) && (win.parent != null) &&	(win.parent != win)) {
			nFindAPITries ++;
			if (nFindAPITries > maxTries) {
				alert("Error in finding API instance -- too deeply nested.");
				return null;
			}
			win = win.parent;
		}
		return win.API;
	}

	scorm.getAPI = function(win) {
		if (API == null) {
			if ((win.parent != null) && (win.parent != win)) {
				API = scanForAPI(window.parent);
			}
			if ((API == null) && (window.opener != null)) {
				API = scanForAPI(window.opener);
			}
			if ((API == null)) {
				API = scanForAPI(win)
			}
		}
	}

	scorm.initializeScormCommunication = function(win) {
		this.getAPI(win);
		if (initialized == false && API != null) {
			var result = API.LMSInitialize("");
			if (result == "true") {
				initialized = true;
				return true;
			} else {
				return false;
			}
		}
		if (initialized == false && API == null) {
			return false;
		}
		return true;
	}

	scorm.commitScormCommunication = function() {
		if (initialized == true) {
			return API.LMSCommit("");
		}
		return false;
	}

	scorm.terminateScormCommunication = function() {
		if (initialized == true) {
			return API.LMSFinish("");
		}
		return false;
	}

	scorm.setMinScore = function(score) {
		if (initialized == true) {
			return API.LMSSetValue("cmi.core.score.min", score);
		}
		return false;
	}

	scorm.setMaxScore = function(score) {
		if (initialized == true) {
			return API.LMSSetValue("cmi.core.score.max", score);
		}
		return false;
	}

	scorm.setRawScore = function(score) {
		if (initialized == true) {
			return API.LMSSetValue("cmi.core.score.raw", score);
		}
		return false;
	}

	scorm.setScaledScore = function(score) {
		return true; // not supported in SCORM 1.2
	}

	scorm.setPageName = function(page, name) {
		if (initialized == true) {
			return API.LMSSetValue("cmi.objectives." + page + ".id", name);
		}
		return false;
	}
	
	scorm.setPageMinScore = function(page, score) {
		if (initialized == true) {
			return API.LMSSetValue("cmi.objectives." + page + ".score.min", score);
		}
		return false;
	}

	scorm.setPageMaxScore = function(page, score) {
		if (initialized == true) {
			return API.LMSSetValue("cmi.objectives." + page + ".score.max", score);
		}
		return false;
	}

	scorm.setPageRawScore = function(page, score) {
		if (initialized == true) {
			return API.LMSSetValue("cmi.objectives." + page + ".score.raw", score);
		}
		return false;
	}

	scorm.setPageScaledScore = function(page, score) {
		return false; // not supported 
	}
	
	scorm.setCompleted = function() {
		if (initialized == true) {
			return API.LMSSetValue("cmi.core.lesson_status", "completed");
		}
		return false;
	}

	scorm.setIncomplete = function() {
		if (initialized == true) {
			return API.LMSSetValue("cmi.core.lesson_status", "incomplete");
		}
		return false;
	}

	scorm.setNotAttempted = function() {
		if (initialized == true) {
			return API.LMSSetValue("cmi.core.lesson_status", "not attempted");
		}
		return false;
	}

	scorm.saveState = function(state) {
		if (initialized == true) {
			API.LMSSetValue("cmi.core.exit", "suspend");
			return API.LMSSetValue("cmi.suspend_data", state);
		}
		return false;
	}

	scorm.loadState = function() {
		if (initialized == true) {
			return API.LMSGetValue("cmi.suspend_data");
		}
		return false;
	}

	scorm.saveLocation = function(page) {
		return false; // not supported 
	}

	scorm.loadLocation = function() {
		return false; // not supported 
	}

	return scorm;
}
