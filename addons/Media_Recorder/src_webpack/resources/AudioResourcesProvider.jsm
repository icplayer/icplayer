import {ResourcesProvider} from "./ResourcesProvider.jsm";

export class AudioResourcesProvider extends ResourcesProvider {

    _getOptions() {
        return {
            audio: DevicesUtils.isEdge() ? true : {
                echoCancellation: false
            }
        }
    }

    // /**
    // * Check if stream have
    // *
    // * Note on iOS compatibility: The autoGainControl setting is not supported on iOS and some microphones.
    // * As a result, recording volume is not automatically adjusted, which may cause recordings to be too quiet
    // * on these devices.
    // */
    // _shouldAdjustGraph() {
    //     console.log("shouldIncreaseAmplitude: " + !navigator.mediaDevices.getSupportedConstraints().autoGainControl);
    //     return !navigator.mediaDevices.getSupportedConstraints().autoGainControl && this.gainNodeValue !== 1;
    // }
    //
    // _adjustGraph(stream, audioContext) {
    //     console.log("Execute _createStreamWithAdjustedAmplitude");
    //     const source = audioContext.createMediaStreamSource(stream);
    //     const gainNode = audioContext.createGain();
    //     const destination = audioContext.createMediaStreamDestination();
    //
    //     const gainValue = this.gainNodeValue;
    //     gainNode.gain.value = gainValue;
    //
    //     source.connect(gainNode);
    //     gainNode.connect(destination);
    //
    //     return destination.stream;
    // }

}
