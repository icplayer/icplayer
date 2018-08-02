export function createAudioAnalyser(audioContext) {
    if (DevicesUtils.isFirefox())
        return createAudioAnalyserFirefox(audioContext);
    else
        return createAudioAnalyserOther(audioContext);
}

function createAudioAnalyserFirefox(audioContext) {
    let analyser = createAnalyser(audioContext);
    analyser.connect(audioContext.destination);

    return analyser;
}

function createAudioAnalyserOther(audioContext) {
    return createAnalyser(audioContext);
}

function createAnalyser(audioContext) {
    let analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.3;
    return analyser;
}