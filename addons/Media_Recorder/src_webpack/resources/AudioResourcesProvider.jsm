import {ResourcesProvider} from "./ResourcesProvider.jsm";

export class AudioResourcesProvider extends ResourcesProvider {

    _getOptions() {
        return {
            audio: true
        }
    }
}