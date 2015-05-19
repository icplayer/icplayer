package com.lorepo.icplayer.client.module.limitedcheck;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.LinkedList;

import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IPresenter;

@SuppressWarnings("serial")
public class TotalScoreTestCase {

	@Test
	public void getEventData() {
		LimitedCheckModule module = Mockito.mock(LimitedCheckModule.class);
		Mockito.when(module.getId()).thenReturn("LimitedCheck1");
		
		TotalScore totalScore = new TotalScore();
		totalScore.score = 3;
		totalScore.errors = 2;
		totalScore.maxScore = 5;
		
		HashMap<String, String> eventData = totalScore.getEventData(module);
		
		assertTrue(eventData.containsKey("source"));
		assertEquals("LimitedCheck1", eventData.get("source"));
		
		assertTrue(eventData.containsKey("score"));
		assertEquals("3", eventData.get("score"));
		
		assertTrue(eventData.containsKey("errors"));
		assertEquals("2", eventData.get("errors"));
		
		assertTrue(eventData.containsKey("maxScore"));
		assertEquals("5", eventData.get("maxScore"));
	}
	
	@Test
	public void getFromPresentersEmptyList() {
		TotalScore totalScore = TotalScore.getFromPresenters(new LinkedList<IPresenter>());
		
		assertEquals(0, totalScore.score);
		assertEquals(0, totalScore.errors);
		assertEquals(0, totalScore.maxScore);
	}
	
	@Test
	public void getFromPresentersSingleActivity() {
		final IPresenter activity = Mockito.mock(IPresenter.class, Mockito.withSettings().extraInterfaces(IActivity.class));
		Mockito.when(((IActivity)activity).getScore()).thenReturn(2);
		Mockito.when(((IActivity)activity).getErrorCount()).thenReturn(3);
		Mockito.when(((IActivity)activity).getMaxScore()).thenReturn(5);
		
		TotalScore totalScore = TotalScore.getFromPresenters(new LinkedList<IPresenter>(){{
			add(activity);
		}});
		
		assertEquals(2, totalScore.score);
		assertEquals(3, totalScore.errors);
		assertEquals(5, totalScore.maxScore);
	}
	
	@Test
	public void getFromPresentersSingleNotActivity() {
		final IPresenter presenter = Mockito.mock(IPresenter.class);
		
		TotalScore totalScore = TotalScore.getFromPresenters(new LinkedList<IPresenter>(){{
			add(presenter);
		}});
		
		assertEquals(0, totalScore.score);
		assertEquals(0, totalScore.errors);
		assertEquals(0, totalScore.maxScore);
	}
	
	@Test
	public void getFromPresentersMultipleActivities() {
		final IPresenter firstActivity = Mockito.mock(IPresenter.class, Mockito.withSettings().extraInterfaces(IActivity.class));
		Mockito.when(((IActivity)firstActivity).getScore()).thenReturn(2);
		Mockito.when(((IActivity)firstActivity).getErrorCount()).thenReturn(3);
		Mockito.when(((IActivity)firstActivity).getMaxScore()).thenReturn(5);
		
		final IPresenter secondActivity = Mockito.mock(IPresenter.class, Mockito.withSettings().extraInterfaces(IActivity.class));
		Mockito.when(((IActivity)secondActivity).getScore()).thenReturn(1);
		Mockito.when(((IActivity)secondActivity).getErrorCount()).thenReturn(1);
		Mockito.when(((IActivity)secondActivity).getMaxScore()).thenReturn(2);
		
		final IPresenter notActivity = Mockito.mock(IPresenter.class);
		
		TotalScore totalScore = TotalScore.getFromPresenters(new LinkedList<IPresenter>(){{
			add(firstActivity);
			add(secondActivity);
			add(notActivity);
		}});
		
		assertEquals(3, totalScore.score);
		assertEquals(4, totalScore.errors);
		assertEquals(7, totalScore.maxScore);
	}
}
