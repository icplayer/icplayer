package com.lorepo.icplayer.client.mockup.services;

import com.lorepo.icf.utils.NavigationModuleIndentifier;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.page.ITextToSpeechController;

import java.util.List;

public class SpeechControllerMockup implements ITextToSpeechController {
    @Override
    public void playTitle(String area, String id, String lagTag) {

    }

    @Override
    public void speak(List<TextToSpeechVoice> voiceTexts) {

    }

    @Override
    public void readStartText() {

    }

    @Override
    public void readExitText() {

    }

    @Override
    public List<NavigationModuleIndentifier> getModulesOrder() {
        return null;
    }

    @Override
    public boolean isTextToSpeechModuleEnable() {
        return false;
    }
}
