package com.lorepo.icplayer.client.module.limitedcheck;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore.ScoreInfo;

public class TotalScore {
	public int score = 0;
	public int errors = 0;
	public int maxScore = 0;
	
	public HashMap<String, String> getEventData(LimitedCheckModule module) {
		HashMap<String, String> data = new HashMap<String, String>();
		
		data.put("source", module.getId());
		data.put("score", String.valueOf(this.score));
		data.put("errors", String.valueOf(this.errors));
		data.put("maxScore", String.valueOf(this.maxScore));
		
		return data;
	}
	
	public HashMap<String, String> getPageReloadedEventData(LimitedCheckModule module) {
		HashMap<String, String> data = getEventData(module);
		data.put("value", "PageLoaded");
		return data;
	}
	
	public HashMap<String, String> getModeButton(LimitedCheckModule module, boolean mode) {
		HashMap<String, String> data = new HashMap<String, String>();
		
		data.put("source", module.getId());
		data.put("value", mode ? "checked" : "unchecked");
		
		return data;
	}
	
	public static TotalScore getFromPresenters(List<IPresenter> presenters) {
		TotalScore totalScore = new TotalScore();
		
		for (IPresenter presenter : presenters) {
			if (presenter instanceof IActivity) {
				IActivity activity = (IActivity) presenter;

				totalScore.errors += activity.getErrorCount();
				totalScore.maxScore += activity.getMaxScore();
				if (presenter instanceof AddonPresenter) {
					AddonPresenter addonPresenter = (AddonPresenter) presenter;
					if (addonPresenter.isOpenActivity()) {
						ScoreInfo scoreInfo = addonPresenter.getOpenActivityScores();
						totalScore.score += scoreInfo.getScore();
					} else {
						totalScore.score += activity.getScore();
					}
				} else {
					totalScore.score += activity.getScore();
				}
			}
		}
		
		return totalScore;
	}
	
	public JavaScriptObject toJavaScriptObject() {
		return createJSObject(this);
	}
	
	private native JavaScriptObject createJSObject(TotalScore x) /*-{
		return {
			'score': x.@com.lorepo.icplayer.client.module.limitedcheck.TotalScore::score,
			'errors': x.@com.lorepo.icplayer.client.module.limitedcheck.TotalScore::errors,
			'maxScore': x.@com.lorepo.icplayer.client.module.limitedcheck.TotalScore::maxScore
		};
	}-*/;
}
