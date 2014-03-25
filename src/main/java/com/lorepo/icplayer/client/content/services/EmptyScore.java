package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.module.api.player.PageScore;

public class EmptyScore extends PageScore {

	public EmptyScore(String pageName) {
		super(pageName);
	}

	public int getPercentageScore() {
		return 0;
	}
}
