export function createMediaStream(htmlMediaElement) {
    if (DevicesUtils.isFirefox())
        return createMediaStreamFirefox(htmlMediaElement);
    else
        return createMediaStreamOther(htmlMediaElement);
}

function createMediaStreamFirefox(htmlMediaElement) {
    return htmlMediaElement.mozCaptureStream();
}

function createMediaStreamOther(htmlMediaElement) {
    return htmlMediaElement.captureStream();
}