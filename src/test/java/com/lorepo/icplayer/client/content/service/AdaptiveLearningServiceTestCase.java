package com.lorepo.icplayer.client.content.service;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import org.mockito.Mockito;
import org.mockito.internal.util.reflection.Whitebox;
import com.googlecode.gwt.test.GwtTest;
import com.googlecode.gwt.test.GwtModule;
import com.google.gwt.json.client.JSONObject;

import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.ui.PlayerView;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;
import com.lorepo.icplayer.client.content.services.AdaptiveLearningService;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.PlayerEntryPoint;
import com.lorepo.icplayer.client.IPlayerController;
import static org.mockito.Mockito.spy;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import java.util.ArrayList;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class AdaptiveLearningServiceTestCase extends GwtTest {
    private PlayerController playerController = null;
    private AdaptiveLearningService service = null;

    private IPlayerController playerControllerMock = null;
    private Content contentMock = null;
    PlayerView playerViewMock = null;

    @Before
    public void setUp() {
        Content content = new Content();
		PlayerEntryPoint playerEntryPoint = new PlayerEntryPoint();

        this.contentMock = Mockito.mock(Content.class);
        this.playerViewMock = Mockito.mock(PlayerView.class);
        ArrayList<Page> pages = new ArrayList<Page>();
        pages.add(Mockito.mock(Page.class));
        pages.add(Mockito.mock(Page.class));
        pages.add(Mockito.mock(Page.class));
        Mockito.when(this.contentMock.getAllPages()).thenReturn(pages);

        this.playerController = new PlayerController(this.contentMock, this.playerViewMock, false, playerEntryPoint);
        PlayerController pcSpy = spy(this.playerController);
        Whitebox.setInternalState(pcSpy, "currentMainPageIndex", 0);
        Whitebox.setInternalState(pcSpy, "playerView", this.playerViewMock);
        Mockito.doNothing().when(pcSpy).switchToPageById(Mockito.anyString());

        String adaptiveStructure = "{\"steps\":[\"62501ff1-5067-4296-9978-a4d051f8cc46\",\"129f5925-40ab-4e83-862b-7234f713dd1d\",\"11fb56ae-8d78-4710-8a47-0f9b8cc36ce1\",\"68b91bb2-c07e-47dd-884d-0acc49832e25\",\"d24ef2da-6671-48bf-bd86-74b4d1b7c895\",\"22134e53-42d7-4c0f-826f-37e150291f5d\",\"0dca5b24-8da6-4fc4-bd4e-034b819815dc\",\"3ee24587-549d-4c20-8c76-581b0790a4f8\",\"571d7b17-85b9-434d-beda-b754704eac44\"],\"pages\":[{\"ID\":\"1bOVCHXsUca7AM1w\",\"stepID\":\"62501ff1-5067-4296-9978-a4d051f8cc46\",\"pageName\":\"Side 1 - Basis\",\"previewURL\":\"\",\"difficulty\":0},{\"ID\":\"EJBBnU9MDgs860OI\",\"stepID\":\"129f5925-40ab-4e83-862b-7234f713dd1d\",\"pageName\":\"Side 2 - Basis\",\"previewURL\":\"\",\"difficulty\":0},{\"ID\":\"vwXAJWsPmQEprNNH\",\"stepID\":\"11fb56ae-8d78-4710-8a47-0f9b8cc36ce1\",\"pageName\":\"Side 3 - Basis\",\"previewURL\":\"\",\"difficulty\":0},{\"ID\":\"YuEbu85iBEhh1upo\",\"stepID\":\"68b91bb2-c07e-47dd-884d-0acc49832e25\",\"pageName\":\"Side 4 - Basis\",\"previewURL\":\"\",\"difficulty\":0},{\"ID\":\"zQytr2Qeo1xrLdYT\",\"stepID\":\"d24ef2da-6671-48bf-bd86-74b4d1b7c895\",\"pageName\":\"Side 5 - Basis\",\"previewURL\":\"\",\"difficulty\":0},{\"ID\":\"b1OPvzh6aHCaxBSP\",\"stepID\":\"22134e53-42d7-4c0f-826f-37e150291f5d\",\"pageName\":\"Side 6 - Trene\",\"previewURL\":\"\",\"difficulty\":2},{\"ID\":\"rh8PPtYi70hrGOCh\",\"stepID\":\"0dca5b24-8da6-4fc4-bd4e-034b819815dc\",\"pageName\":\"Side 7 - Trene\",\"previewURL\":\"\",\"difficulty\":2},{\"ID\":\"40IRAv3mFaxj8Ol0\",\"stepID\":\"3ee24587-549d-4c20-8c76-581b0790a4f8\",\"pageName\":\"Side 8 - Trene\",\"previewURL\":\"\",\"difficulty\":2},{\"ID\":\"yRWNehGr5Qw4SgGW\",\"stepID\":\"22134e53-42d7-4c0f-826f-37e150291f5d\",\"pageName\":\"Side 6 - Ekstra\",\"previewURL\":\"\",\"difficulty\":4},{\"ID\":\"ZJ7VyrtKVQkLJKDt\",\"stepID\":\"0dca5b24-8da6-4fc4-bd4e-034b819815dc\",\"pageName\":\"Side 7 - Ekstra\",\"previewURL\":\"\",\"difficulty\":4},{\"ID\":\"32iIyfepKejQLGG5\",\"stepID\":\"571d7b17-85b9-434d-beda-b754704eac44\",\"pageName\":\"Resultat\",\"previewURL\":\"\",\"difficulty\":0}],\"edges\":{\"1bOVCHXsUca7AM1w\":[{\"source\":\"1bOVCHXsUca7AM1w\",\"target\":\"EJBBnU9MDgs860OI\",\"conditions\":\"\"}],\"EJBBnU9MDgs860OI\":[{\"source\":\"EJBBnU9MDgs860OI\",\"target\":\"vwXAJWsPmQEprNNH\",\"conditions\":\"\"}],\"vwXAJWsPmQEprNNH\":[{\"source\":\"vwXAJWsPmQEprNNH\",\"target\":\"YuEbu85iBEhh1upo\",\"conditions\":\"\"}],\"YuEbu85iBEhh1upo\":[{\"source\":\"YuEbu85iBEhh1upo\",\"target\":\"zQytr2Qeo1xrLdYT\",\"conditions\":\"\"}],\"zQytr2Qeo1xrLdYT\":[{\"source\":\"zQytr2Qeo1xrLdYT\",\"target\":\"b1OPvzh6aHCaxBSP\",\"conditions\":\"((expect(\"1bOVCHXsUca7AM1w\").scaledScore + expect(\"EJBBnU9MDgs860OI\").scaledScore + expect(\"vwXAJWsPmQEprNNH\").scaledScore + expect(\"YuEbu85iBEhh1upo\").scaledScore + expect(\"zQytr2Qeo1xrLdYT\").scaledScore)/5) < 0.7\"},{\"source\":\"zQytr2Qeo1xrLdYT\",\"target\":\"yRWNehGr5Qw4SgGW\",\"conditions\":\"((expect(\"1bOVCHXsUca7AM1w\").scaledScore + expect(\"EJBBnU9MDgs860OI\").scaledScore + expect(\"vwXAJWsPmQEprNNH\").scaledScore + expect(\"YuEbu85iBEhh1upo\").scaledScore + expect(\"zQytr2Qeo1xrLdYT\").scaledScore)/5) > 0.7\"}],\"b1OPvzh6aHCaxBSP\":[{\"source\":\"b1OPvzh6aHCaxBSP\",\"target\":\"rh8PPtYi70hrGOCh\",\"conditions\":\"\"}],\"rh8PPtYi70hrGOCh\":[{\"source\":\"rh8PPtYi70hrGOCh\",\"target\":\"40IRAv3mFaxj8Ol0\",\"conditions\":\"\"}],\"40IRAv3mFaxj8Ol0\":[{\"source\":\"40IRAv3mFaxj8Ol0\",\"target\":\"32iIyfepKejQLGG5\",\"conditions\":\"\"}],\"ZJ7VyrtKVQkLJKDt\":[{\"source\":\"ZJ7VyrtKVQkLJKDt\",\"target\":\"32iIyfepKejQLGG5\",\"conditions\":\"\"}],\"yRWNehGr5Qw4SgGW\":[{\"source\":\"yRWNehGr5Qw4SgGW\",\"target\":\"ZJ7VyrtKVQkLJKDt\",\"conditions\":\"\"}]},\"difficulty\":{\"0\":\"Informative\",\"1\":\"Assessment\",\"2\":\"Easy\",\"3\":\"Medium\",\"4\":\"Hard\"}}";

        this.service = new AdaptiveLearningService(pcSpy, adaptiveStructure);
    }

    @Test
    public void testGivenStartingPageWhenAddAndMoveToNextPageCalledOnceThenGoToNextPage() {
        AdaptiveLearningService spyService = spy(this.service);

        spyService.addAndMoveToNextPage("EJBBnU9MDgs860OI");

        ArrayList<Integer> visitedPages = (ArrayList<Integer>)Whitebox.getInternalState(spyService, "visitedPageIndexes");
        int currentPageIndex = (Integer) Whitebox.getInternalState(spyService,"currentPageIndex");
        assertEquals(visitedPages.size(), 2);
        assertEquals(currentPageIndex, 1);
    }

    @Test
    public void testGivenStartingPageWhenAddAndMoveToNextPageCalledTwiceThenGoToNextPageHappenTwice() {
        AdaptiveLearningService spyService = spy(this.service);

        spyService.addAndMoveToNextPage("EJBBnU9MDgs860OI");
        spyService.addAndMoveToNextPage("TWBaw2nqqVWKD83M");

        ArrayList<Integer> visitedPages = (ArrayList<Integer>)Whitebox.getInternalState(spyService, "visitedPageIndexes");
        int currentPageIndex = (Integer) Whitebox.getInternalState(spyService,"currentPageIndex");
        assertEquals(visitedPages.size(), 3);
        assertEquals(currentPageIndex, 2);
    }
}
