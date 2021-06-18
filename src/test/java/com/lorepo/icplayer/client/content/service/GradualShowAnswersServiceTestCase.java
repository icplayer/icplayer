package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.*;

import com.lorepo.icplayer.client.content.services.GradualShowAnswersService;
import com.lorepo.icplayer.client.content.services.PlayerEventBus;
import com.lorepo.icplayer.client.module.api.IGradualShowAnswersPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IPlayerStateService;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.GradualShowAnswerEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerEventBusService;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.PageController;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.*;

import java.util.ArrayList;
import java.util.List;

public class GradualShowAnswersServiceTestCase {

    private GradualShowAnswersService gradualShowAnswersService;
    @Mock
    private PageController mockedPageController;
    @Mock
    PlayerEventBus mockedPlayerEventBus;
    @Captor ArgumentCaptor<GradualShowAnswerEvent> eventCaptor;
    private String workWith;
    private int presenterActivities = 2;


    @Rule
    public final ExpectedException exception = ExpectedException.none();

    @Before
    public void setUp () {
        MockitoAnnotations.initMocks(this);
        List<IPresenter> mockedPagePresenters = this.createPresenters();
        Mockito.when(mockedPageController.getPresenters()).thenReturn(mockedPagePresenters);

        IPlayerServices mockedPlayerServices = Mockito.mock(IPlayerServices.class);
        IPlayerStateService mockedPlayerStateService = Mockito.mock(IPlayerStateService.class);
        Mockito.when(mockedPageController.getPlayerServices()).thenReturn(mockedPlayerServices);
        Mockito.when(mockedPlayerServices.getPlayerStateService()).thenReturn(mockedPlayerStateService);
        Mockito.when(mockedPlayerStateService.isGradualShowAnswersMode()).thenReturn(true);

        IPlayerEventBusService mockedPlayerEventBusService = Mockito.mock(IPlayerEventBusService.class);
        Mockito.when(mockedPlayerServices.getEventBusService()).thenReturn(mockedPlayerEventBusService);
        Mockito.when(mockedPlayerEventBusService.getEventBus()).thenReturn(mockedPlayerEventBus);

        gradualShowAnswersService = new GradualShowAnswersService(mockedPageController);

    }

    private List<IPresenter> createPresenters(){
        List<IPresenter> pagePresenters = new ArrayList<IPresenter>();
        for(int i=0; i<3; i++){
            IGradualShowAnswersPresenter presenter = Mockito.mock(IGradualShowAnswersPresenter.class);
            IModuleModel mockedModel = Mockito.mock(IModuleModel.class);
            Mockito.when(presenter.getModel()).thenReturn(mockedModel);
            Mockito.when(mockedModel.getId()).thenReturn("ID" + i);
            Mockito.when(presenter.getActivitiesCount()).thenReturn(presenterActivities);
            pagePresenters.add(presenter);
        }

        return pagePresenters;
    }

    @Test
    public void testCallFirstPresenterIfNoWorkWith(){
        this.givenWorkWith("");
        this.whenCalledShowNext();
        this.thenFireEventForPresenter("ID0", 0);
    }

    @Test
    public void testCallSecondPresenterIfNoWorkWithAndUsedAllActivitiesInFirstPresenter(){
        this.givenWorkWith("");
        this.andPresenterHasAllUsedActivities("ID0");
        this.whenCalledShowNext();
        this.thenFireEventForPresenter("ID1", 0);
    }

    @Test
    public void testCallSecondPresenterIfIDOfSecondPresenterIsInWorkWith(){
        this.givenWorkWith("ID1");
        this.whenCalledShowNext();
        this.thenFireEventForPresenter("ID1", 0);
    }

    @Test
    public void testCallThirdPresenterIfIDOfFirstAndThirdPresenterIsInWorkWithAndFirstPresenterHasAllUsedActivities(){
        this.givenWorkWith("ID0\nID2");
        this.andPresenterHasAllUsedActivities("ID0");
        this.whenCalledShowNext();
        this.thenFireEventForPresenter("ID2", 0);
    }

    @Test
    public void testNotCallAnyPresenterIfWorkWithHasIdWhoDoesntExist(){
        this.givenWorkWith("NotExistID");
        this.whenCalledShowNext();
        this.thenEventNotFired();
    }

    @Test
    public void testNotCallAnyPresenterIfNoWorkWithButAllPresenterHasUsedActivities(){
        this.givenWorkWith("");
        this.andPresenterHasAllUsedActivities("ID0");
        this.andPresenterHasAllUsedActivities("ID1");
        this.andPresenterHasAllUsedActivities("ID2");
        this.whenCalledShowNext();
        this.thenEventNotFired();
    }

    @Test
    public void testCallFirstPresenterIfNullIsGivenAsWorkWith(){
        this.givenWorkWith(null);
        this.whenCalledShowNext();
        this.thenFireEventForPresenter("ID0", 0);
    }

    private void givenWorkWith(String workWith){
        this.workWith = workWith;
    }

    private void andPresenterHasAllUsedActivities(String presenterID){
        gradualShowAnswersService.setPresenterActivitiesCountUsed(presenterID, presenterActivities);
    }

    private void whenCalledShowNext(){
        gradualShowAnswersService.showNext(workWith);
    }

    private void thenFireEventForPresenter(String presenterID, int activities){
        Mockito.verify(mockedPlayerEventBus, Mockito.times(1)).fireEvent(eventCaptor.capture());
        GradualShowAnswerEvent eventValue = eventCaptor.getValue();
        assertEquals(presenterID, eventValue.getModuleID());
        assertEquals(activities, eventValue.getItem());
    }

    private void thenEventNotFired(){
        Mockito.verify(mockedPlayerEventBus, Mockito.times(0)).fireEvent(eventCaptor.capture());
    }

}
