package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.ITimeService;
import com.lorepo.icf.utils.JSONUtils;

public class TimeService implements ITimeService {

	private final HashMap<String, Long>	pagesTimes;
	private long lastTimeStamp = 0;
	
	public TimeService() {
		pagesTimes = new HashMap<String, Long>();
	}
	
	@Override
	public Long getTotalTime() {
		Long t = (long) 0;
		for (Long page_time : pagesTimes.values()){
			if (page_time >= 0) {
				t += page_time;
			}
		}
		return t;
	}
	
	@Override
	public String getAsString() {
		
		HashMap<String, String> data = new HashMap<String, String>();
		HashMap<String, String> pages_times = new HashMap<String, String>();
		
		for(String pageName : pagesTimes.keySet()){
			pages_times.put(pageName, String.valueOf(pagesTimes.get(pageName)));
		}
		String pages_times_data = JSONUtils.toJSONString(pages_times);
		data.put("pages_times", pages_times_data);
		return JSONUtils.toJSONString(data);
	}

	@Override
	public Long getPageTimeById(String pageId) {
		Long time = pagesTimes.get(pageId);
		if (time == null) {
			time = (long) 0;
		}
		return time;
	}

	@Override
	public void loadFromString(String state) {
		if (state == null) {
			return;
		}
		HashMap<String, String> data = JSONUtils.decodeHashMap(state);
		HashMap<String, String> pages_times = JSONUtils.decodeHashMap(data.get("pages_times"));
		for(String pageName : pages_times.keySet()){
			Long pageTime = Long.decode(pages_times.get(pageName));
			pagesTimes.put(pageName, pageTime);
		}
	}

	private void addPageTime(IPage page, Long time) {
		String pageId = page.getId();
		Long pageTime = pagesTimes.get(pageId);
		if (pageTime == null) {
			pageTime = time;
		} else {
			pageTime += time;
		}
		pagesTimes.put(pageId, pageTime);
	}

	@Override
	public void updateTimeForPages(IPage page1, IPage page2) {
		if (lastTimeStamp == 0) {
			lastTimeStamp = System.currentTimeMillis();
		} else if (page1 != null) {
			Long now = System.currentTimeMillis();
			Long timeDiff = now - lastTimeStamp;
			 if (page2 != null) {
				timeDiff = timeDiff / 2;
				addPageTime(page2, timeDiff);
			}
			addPageTime(page1, timeDiff);
			lastTimeStamp = now;
		}
	}

}
