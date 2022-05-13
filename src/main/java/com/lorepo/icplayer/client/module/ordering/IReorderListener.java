package com.lorepo.icplayer.client.module.ordering;
import com.lorepo.icplayer.client.module.text.AudioInfo;

public interface IReorderListener {
	public void onItemMoved(int sourceIndex, int destIndex);
	public void onAudioButtonClicked(AudioInfo audioInfo);
	public void onAudioEnded(AudioInfo audioInfo);
}
