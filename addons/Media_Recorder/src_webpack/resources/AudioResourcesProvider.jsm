import {ResourcesProvider} from "./ResourcesProider.jsm";

export class AudioResourcesProvider extends ResourcesProvider {

    _getOptions() {
        return {
            audio: true
        }
    }
}