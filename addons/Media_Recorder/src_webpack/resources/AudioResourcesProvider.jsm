import {ResourcesProvider} from "./ResourcesProvider.jsm";

export class AudioResourcesProvider extends ResourcesProvider {

    _getOptions() {
        return {
            audio: DevicesUtils.isEdge() ? true : {
                echoCancellation: false
            }
        }
    }
}