function getScorm() {
	var scorm = function() {}

	var nFindAPITries = 0;
	var API = null;
	var maxTries = 500;
	var initialized = false;

	function scanForAPI(win) {
		while ((win.API_1484_11 == null) && (win.parent != null) &&	(win.parent != win)) {
			nFindAPITries ++;
			if (nFindAPITries > maxTries) {
				alert("Error in finding API instance -- too deeply nested.");
				return null;
			}
			win = win.parent;
		}
		return win.API_1484_11;
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
			var result = API.Initialize("");
			if (result == "true") {
				initialized = true;
				return true;
			} else {
				return false;
			}
		}
		return true;
	}

	scorm.commitScormCommunication = function() {
		if (initialized == true) {
			return API.Commit("");
		}
		return false;
	}

	scorm.terminateScormCommunication = function() {
		if (initialized == true) {
			return API.Terminate("");
		}
		return false;
	}

	scorm.setMinScore = function(score) {
		if (initialized == true) {
			return API.SetValue("cmi.score.min", score);
		}
		return false;
	}

	scorm.setMaxScore = function(score) {
		if (initialized == true) {
			return API.SetValue("cmi.score.max", score);
		}
		return false;
	}

	scorm.setRawScore = function(score) {
		if (initialized == true) {
			return API.SetValue("cmi.score.raw", score);
		}
		return false;
	}

	scorm.setScaledScore = function(score) {
		if (initialized == true) {
			return API.SetValue("cmi.score.scaled", score);
		}
		return false;
	}

	scorm.setPageName = function(page, name) {
		if (initialized == true) {
			return API.SetValue("cmi.objectives." + page + ".id", name);
		}
		return false;
	}
	
	scorm.setPageMinScore = function(page, score) {
		if (initialized == true) {
			return API.SetValue("cmi.objectives." + page + ".score.min", score);
		}
		return false;
	}

	scorm.setPageMaxScore = function(page, score) {
		if (initialized == true) {
			return API.SetValue("cmi.objectives." + page + ".score.max", score);
		}
		return false;
	}

	scorm.setPageRawScore = function(page, score) {
		if (initialized == true) {
			return API.SetValue("cmi.objectives." + page + ".score.raw", score);
		}
		return false;
	}

	scorm.setPageScaledScore = function(page, score) {
		if (initialized == true) {
			return API.SetValue("cmi.objectives." + page + ".score.scaled", score);
		}
		return false;
	}
	
	scorm.setCompleted = function() {
		if (initialized == true) {
			return API.SetValue("cmi.completion_status", "completed");
		}
		return false;
	}

	scorm.setIncomplete = function() {
		if (initialized == true) {
			return API.SetValue("cmi.completion_status", "incomplete");
		}
		return false;
	}

	scorm.setNotAttempted = function() {
		if (initialized == true) {
			return API.SetValue("cmi.completion_status", "not attempted");
		}
		return false;
	}

	return scorm;
}
