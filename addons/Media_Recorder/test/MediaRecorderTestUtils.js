function createView() {
    return "<div class=\"media-recorder-wrapper\">\n" +
        "    <div class=\"media-recorder-player-wrapper\">\n" +
        "        <div class=\"media-recorder-player-loader\"></div>\n" +
        "    </div>\n" +
        "    <div class=\"media-recorder-interface-wrapper\">\n" +
        "        <div class=\"media-recorder-recording-button\"></div>\n" +
        "        <div class=\"media-recorder-play-button\"></div>\n" +
        "        <div class=\"media-recorder-timer\">00:00/00:00</div>\n" +
        "        <div class=\"media-recorder-sound-intensity\">\n" +
        "            <div class=\"sound-intensity-large\" id=\"sound-intensity-6\"></div>\n" +
        "            <div class=\"sound-intensity-large\" id=\"sound-intensity-5\"></div>\n" +
        "            <div class=\"sound-intensity-medium\" id=\"sound-intensity-4\"></div>\n" +
        "            <div class=\"sound-intensity-medium\" id=\"sound-intensity-3\"></div>\n" +
        "            <div class=\"sound-intensity-low\" id=\"sound-intensity-2\"></div>\n" +
        "            <div class=\"sound-intensity-low\" id=\"sound-intensity-1\"></div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>"
}

function createModel() {
    return {
        ID: "mediaRecorder_1",
        "Is Visible": "True",
        maxTime: "10",
        defaultRecording: "/file/666666666",
        startRecordingSound: "/file/666666666",
        stopRecordingSound: "/file/666666666"
    };
}