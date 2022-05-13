package com.lorepo.icplayer.client.module.choice;

import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.text.AudioInfo;

public interface IOptionListener {

	void onValueChange(IOptionDisplay option, boolean selected);
	void onAudioButtonClicked(AudioInfo audioInfo);
	void onAudioEnded(AudioInfo audioInfo);
}
