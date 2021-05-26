package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.google.gwt.dom.client.Node;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Style;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.content.services.JsonServices;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableController;
import org.junit.Before;
import org.junit.Test;

import com.google.gwt.user.client.DOM;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTOrderingPrintableTestCase extends GwtTest {
    PrintableController printableController = null;
    PrintableModuleMock model = null;
    OrderingPrintable orderingPrintable = null;
    ArrayList<OrderingItem> items = null;
    String userStateWithCorrectAlternativeOrder = "{\"order\":\"3,2,1\", \"isSolved\": \"true\"}}";
    String userStateWithCorrectOrder = "{\"order\":\"1,2,3\", \"isSolved\": \"true\"}";
    String userStateWithWrongOrder = "{\"order\":\"1,3,2\", \"isSolved\": \"true\"}}";
    String userNotTouchedState = "{\"order\":\"1,3,2\", \"isSolved\": \"false\"}}";

    String resultHTMLString = "";
    Element resultHTML;

    class PrintableModuleMock implements IPrintableOrderingModule {
        public ArrayList<OrderingItem> items = new ArrayList<OrderingItem>();
        public Printable.PrintableMode mode = Printable.PrintableMode.YES;
        public HashMap<String, String> state = null;
        public boolean isVertical = true;
        public boolean isSplitInPrintBlocked = true;
        public String ID = "1";

        @Override
        public int getItemCount() {
            return items.size();
        }

        @Override
        public boolean isPrintable() {
            return mode != Printable.PrintableMode.NO;
        }

        @Override
        public Printable.PrintableMode getPrintable() {
            return mode;
        }

        @Override
        public Map<String, String> getPrintableState() {
            return state;
        }

        @Override
        public boolean isSplitInPrintBlocked() {
            return isSplitInPrintBlocked;
        }

        @Override
        public OrderingItem getItem(int j) {
            return items.get(j);
        }

        @Override
        public Boolean isVertical() {
            return isVertical;
        }

        @Override
        public String getId() {
            return ID;
        }
    }

    @Before
    public void setUp() {
        this.model = new PrintableModuleMock();
        givenModelWithThreeItems();
        givenPrintableModel();
    }

    @Test
    public void testHTMLGenerationWhenNotPrintable() {
        givenNotPrintableModel();
        givenOrderingPrintable();

        whenGettingPrintableHTML("", false);

        thenResultHTMLStringNull();
    }

    @Test
    public void getPrintableHTMLIfPrintableMode() {
        givenPrintableModel();
        givenOrderingPrintable();

        whenGettingPrintableHTML("", false);

        thenResultHTMLStringNotNull();
    }

    @Test
    public void getPrintableHTMLIfRandomPrintableMode() {
        givenRandomPrintableModel();
        givenOrderingPrintable();

        whenGettingPrintableHTML("", false);

        thenResultHTMLStringNotNull();
    }

    @Test
    public void getPrintableHTMLWhenIsSplitInPrintBlocked() {
        givenSplitInBlockSetTo(true);
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", false);

        thenResultHTMLDoesNotHaveClassName(PrintableContentParser.SPLITTABLE_CLASS_NAME);
    }

    @Test
    public void getPrintableHTMLWhenIsSplitInPrintNotBlocked() {
        givenSplitInBlockSetTo(false);


        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", false);

        thenResultHTMLHasClassName(PrintableContentParser.SPLITTABLE_CLASS_NAME);
    }

    @Test
    public void getPrintableHTMLWithoutClassName() {

        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", false);

        thenResultHTMLDoesNotHaveClassName("printable_module-");
    }

    @Test
    public void getPrintableHTMLWithClassName() {
        String className = "ordering_test";
        String expectedClassName = "printable_module-" + className;

        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement(className, false);

        thenResultHTMLHasClassName(expectedClassName);
    }

    @Test
    public void getPrintableHTMLCheckClassesWhenEmptyState() {
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", false);

        thenResultHTMLHasClassName("printable_module");
        thenItemWrapperHasClass();
        thenItemWrappersHaveClass();
        thenNumberBoxesHaveClass("number-box");
        thenSignNull();
    }

    @Test
    public void getPrintableHTMLCheckIndexesWhenEmptyState() {
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", false);
        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        for (Node numberBox : numberBoxes) {
            Element numberBoxElement = (Element) numberBox;
            String text = numberBoxElement.getInnerText();
            assertEquals("", text);
        }
    }

    @Test
    public void getPrintableHTMLCheckElementsAmountWhenEmptyState() {
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", false);
        int validAmount = this.model.getItemCount();

        ArrayList<Node> itemWrappers = getItemWrappers(resultHTML);
        assertEquals(validAmount, itemWrappers.size());

        ArrayList<Node> displaysViews = getDisplaysViews(resultHTML);
        assertEquals(validAmount, displaysViews.size());

        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        assertEquals(validAmount, numberBoxes.size());

        ArrayList<Node> textTDs = getTextTDs(resultHTML);
        assertEquals(validAmount, textTDs.size());
    }

    @Test
    public void getPrintableHTMLCheckIfVerticalNodesWhenEmptyState() {
        givenModelWithIsVerticalSetToFalse();

        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", false);

        thenDisplaysViewsHaveInlineBlockStyle();
    }

    @Test
    public void getPrintableHTMLCheckIfHorizontalNodesWhenEmptyState() {
        givenModelWithIsVerticalSetToFalse();
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", false);

        thenDisplaysViewsHaveInlineBlockStyle();
    }

    @Test
    public void getPrintableHTMLCheckClassesWhenShowAnswersState() {
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        thenResultHTMLHasClassName("printable_module");
        thenItemWrapperHasClass();
        thenItemWrappersHaveClass();
        thenNumberBoxesHaveClass("number-box");

        thenSignNull();
    }

    @Test
    public void getPrintableHTMLCheckIndexesWhenShowAnswersState() {
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);
        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        for (int i = 0; i < numberBoxes.size(); i++) {
            Node numberBox = numberBoxes.get(i);
            Element numberBoxElement = (Element) numberBox;
            String text = numberBoxElement.getInnerText();
            String expectedText = Integer.toString(this.items.get(i).getIndex());
            assertEquals(expectedText, text);
        }
    }

    @Test
    public void getPrintableHTMLCheckElementsAmountWhenShowAnswersState() {
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);
        int validAmount = this.model.getItemCount();

        ArrayList<Node> itemWrappers = getItemWrappers(resultHTML);
        assertEquals(validAmount, itemWrappers.size());

        ArrayList<Node> displaysViews = getDisplaysViews(resultHTML);
        assertEquals(validAmount, displaysViews.size());

        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        assertEquals(validAmount, numberBoxes.size());

        ArrayList<Node> textTDs = getTextTDs(resultHTML);
        assertEquals(validAmount, textTDs.size());
    }

    @Test
    public void getPrintableHTMLCheckIfVerticalNodesWhenShowAnswersState() {
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", true);

        thenDisplaysViewsHaveBlockStyle();
    }

    @Test
    public void getPrintableHTMLCheckIfHorizontalNodesWhenShowAnswersStateAndWrongAnswer() {
        givenModelWithIsVerticalSetToFalse();
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        thenDisplaysViewsHaveInlineBlockStyle();
    }

    @Test
    public void getPrintableHTMLCheckClassesWhenShowUserAnswersStateAndWrongAnswer() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", true);

        thenResultHTMLHasClassName("printable_module");
        thenItemWrapperHasClass();
        thenItemWrappersHaveClass();
        thenNumberBoxesHaveClass("number-box-correct", "number-box-wrong", "number-box-wrong");
    }

    @Test
    public void getPrintableHTMLCheckIndexesWhenShowUserAnswersState() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        Integer[] indexes = getItemsIndexesInOrderFromState(this.userStateWithWrongOrder);
        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        for (int i = 0; i < numberBoxes.size(); i++) {
            Node numberBox = numberBoxes.get(i);
            Element numberBoxElement = (Element) numberBox;
            String text = numberBoxElement.getInnerText();
            String expectedText = Integer.toString(indexes[i]);
            assertEquals(expectedText, text);
        }
    }

    @Test
    public void getPrintableHTMLCheckElementsAmountWhenShowUserAnswersState() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        int validAmount = this.model.getItemCount();

        ArrayList<Node> itemWrappers = getItemWrappers(resultHTML);
        assertEquals(validAmount, itemWrappers.size());

        ArrayList<Node> displaysViews = getDisplaysViews(resultHTML);
        assertEquals(validAmount, displaysViews.size());

        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        assertEquals(validAmount, numberBoxes.size());

        ArrayList<Node> textTDs = getTextTDs(resultHTML);
        assertEquals(validAmount, textTDs.size());
    }

    @Test
    public void getPrintableHTMLCheckIfVerticalNodesWhenShowUserAnswersState() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", true);

        thenDisplaysViewsHaveBlockStyle();
    }

    @Test
    public void getPrintableHTMLCheckIfHorizontalNodesWhenShowUserAnswersState() {
        givenModelWithIsVerticalSetToFalse();

        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        thenDisplaysViewsHaveInlineBlockStyle();
    }

    @Test
    public void getPrintableHTMLCheckClassesWhenCheckAnswersStateAndCorrectOrder() {
        givenPrintableState(this.userStateWithCorrectOrder);
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        thenResultHTMLHasClassName("printable_module");
        thenItemWrapperHasClass();
        thenItemWrappersHaveClass();
        thenNumberBoxesHaveClass("number-box-correct");
        thenSignHasClass("is-all-ok-sign-wrapper");
    }

    @Test
    public void getPrintableHTMLCheckClassesWhenCheckAnswersStateAndWrongOrder() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        thenResultHTMLHasClassName("printable_module");
        thenItemWrapperHasClass();
        thenItemWrappersHaveClass();

        String correctNumberBoxesClass = "number-box-correct";
        String wrongNumberBoxesClass = "number-box-wrong";
        thenNumberBoxesHaveClass(correctNumberBoxesClass, wrongNumberBoxesClass, wrongNumberBoxesClass);
        thenSignHasClass("is-not-all-ok-sign-wrapper");
    }

    @Test
    public void getPrintableHTMLCheckAlternativeCorrectAnswer() {
        givenPrintableState(this.userStateWithCorrectAlternativeOrder);

        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);

        thenNumberBoxesHaveClass("number-box-correct");

        thenSignHasClass("is-all-ok-sign-wrapper");
    }

    @Test
    public void getPrintableHTMLCheckIndexesWhenCheckAnswersState() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);
        Integer[] indexes = getItemsIndexesInOrderFromState(this.userStateWithWrongOrder);
        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        for (int i = 0; i < numberBoxes.size(); i++) {
            Node numberBox = numberBoxes.get(i);
            Element numberBoxElement = (Element) numberBox;
            String text = numberBoxElement.getInnerText();
            String expectedText = Integer.toString(indexes[i]);
            assertEquals(expectedText, text);
        }
    }

    @Test
    public void getPrintableHTMLCheckElementsAmountWhenCheckAnswersState() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();
        whenGettingPrintableHTMLAsDOMElement("", true);
        int validAmount = this.model.getItemCount();

        ArrayList<Node> itemWrappers = getItemWrappers(resultHTML);
        assertEquals(validAmount, itemWrappers.size());

        ArrayList<Node> displaysViews = getDisplaysViews(resultHTML);
        assertEquals(validAmount, displaysViews.size());

        ArrayList<Node> numberBoxes = getNumberBoxes(resultHTML);
        assertEquals(validAmount, numberBoxes.size());

        ArrayList<Node> textTDs = getTextTDs(resultHTML);
        assertEquals(validAmount, textTDs.size());
    }

    @Test
    public void getPrintableHTMLCheckIfVerticalNodesWhenCheckAnswersState() {
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", true);

        thenDisplaysViewsHaveBlockStyle();
    }

    @Test
    public void getPrintableHTMLCheckIfHorizontalNodesWhenCheckAnswersState() {
        givenModelWithIsVerticalSetToFalse();
        givenPrintableState(this.userStateWithWrongOrder);
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", true);

        thenDisplaysViewsHaveInlineBlockStyle();
    }

    @Test
    public void shownAnswersWillAddProperClass() {
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", true);

        thenWrapperHasShowAnswersClass();
    }

    @Test
    public void whenCheckingAnswersAndUserDidNotSolvedThenDoesNotHaveSigns() {
        givenPrintableState(this.userNotTouchedState);
        givenOrderingPrintable();

        whenGettingPrintableHTMLAsDOMElement("", true);

        thenNumberBoxesHaveClass("number-box");
        thenSignNull();
    }

    private void givenModelWithThreeItems() {
        this.items = new ArrayList<OrderingItem>();

        OrderingItem item1 = new OrderingItem(1, "element 1", "string", 1);
        item1.addAlternativeIndex(3);
        this.items.add(item1);

        OrderingItem item2 = new OrderingItem(2, "element 2", "string", 2);
        this.items.add(item2);

        OrderingItem item3 = new OrderingItem(3, "element 3", "string", 3);
        item3.addAlternativeIndex(1);
        this.items.add(item3);

        model.items = items;
    }

    private void givenModelWithIsVerticalSetToFalse() {
        model.isVertical = false;
    }

    private void givenNotPrintableModel() {
        model.mode = Printable.PrintableMode.NO;
    }

    private void givenPrintableModel() {
        model.mode = Printable.PrintableMode.YES;
    }

    private void givenRandomPrintableModel() {
        model.mode = Printable.PrintableMode.YES_RANDOM;
    }

    private void givenOrderingPrintable() {
        this.orderingPrintable = new OrderingPrintable(this.model, this.printableController);
    }

    private void givenSplitInBlockSetTo(boolean value) {
        model.isSplitInPrintBlocked = value;
    }

    private void givenPrintableState(String state) {
        IJsonServices jsonServices = new JsonServices();
        model.state = jsonServices.decodeHashMap(state);
    }

    private void whenGettingPrintableHTML(String className, boolean showAnswers) {
        this.resultHTMLString = this.orderingPrintable.getPrintableHTML(className, showAnswers);
    }

    private void whenGettingPrintableHTMLAsDOMElement(String className, boolean showAnswers) {
        whenGettingPrintableHTML(className, showAnswers);

        Element div = DOM.createDiv();
        div.setInnerHTML(resultHTMLString.trim());
        resultHTML = (Element) div.getChild(0);
    }

    private void thenResultHTMLStringNull() {
        assertNull(resultHTMLString);
    }

    private void thenResultHTMLStringNotNull() {
        assertNotNull(resultHTMLString);
    }

    private void thenItemWrapperHasClass() {
        Node node = getItemsWrapper(resultHTML);
        Element element = Element.as(node);
        String elementClassName = element.getClassName();

        assertEquals(elementClassName, "items-wrapper");
    }

    private void thenDisplaysViewsHaveInlineBlockStyle() {
        String expectedStyle = createDisplayInlineBlockStyle().toString();
        nodesHaveStyle(expectedStyle);
    }

    private void thenDisplaysViewsHaveBlockStyle() {
        String expectedStyle = createDisplayBlockStyle().toString();
        nodesHaveStyle(expectedStyle);
    }

    private void thenItemWrappersHaveClass() {
        ArrayList<Node> nodes = getItemWrappers(resultHTML);
        nodesHaveClass(nodes, "item-wrapper");
    }

    private void thenResultHTMLHasClassName(String className) {
        assertTrue(nodeContainsClass(resultHTML, className));
    }

    private void thenResultHTMLDoesNotHaveClassName(String className) {
        assertFalse(nodeContainsClass(resultHTML, className));
    }

    private void thenNumberBoxesHaveClass(String className) {
        ArrayList<Node> nodes = getNumberBoxes(resultHTML);
        nodesHaveClass(nodes, className);
    }

    private void thenNumberBoxesHaveClass(String className1, String className2, String className3) {
        ArrayList<Node> nodes = getNumberBoxes(resultHTML);

        String nodeClassName = getClassName(nodes.get(0));
        assertEquals(
                className1,
                nodeClassName
        );
        nodeClassName = getClassName(nodes.get(1));
        assertEquals(
                className2,
                nodeClassName
        );
        nodeClassName = getClassName(nodes.get(2));
        assertEquals(
                className3,
                nodeClassName
        );
    }

    private void thenSignHasClass(String correctClassName) {
        Node sign = resultHTML.getChild(1);
        String nodeClassName = getClassName(sign);
        assertEquals(
            "Expected sign wrapper to have " + correctClassName + " but has " + nodeClassName,
            correctClassName,
            nodeClassName
        );
    }

    private void thenSignNull() {
        assertNull("All OK sign should not be shown", resultHTML.getChild(1));
    }

    private void thenWrapperHasShowAnswersClass() {
        assertTrue(resultHTML.getClassName().contains("printable-ordering-show-answers"));
    }

    private void nodesHaveClass(ArrayList<Node> nodes, String correctClassName) {
        for (Node node : nodes) {

            String nodeClassName = getClassName(node);
            assertEquals(
                "Expected " + node.getNodeName() + " to have " + correctClassName + " but has " + nodeClassName,
                correctClassName,
                nodeClassName
            );
        }
    }

    private void nodesHaveStyle(String style) {
        ArrayList<Node> nodes = getDisplaysViews(resultHTML);

        for (Node node : nodes) {
            Element element = Element.as(node);
            Style elementStyle = element.getStyle();

            String parsedActualStyle = elementStyle.toString();

            assertEquals(style, parsedActualStyle);
        }
    }

    private String getClassName(Node node) {
        Element element = Element.as(node);
        return element.getClassName();
    }

    private boolean nodeContainsClass(Node node, String correctClassName) {
        Element element = Element.as(node);
        String elementClassName = element.getClassName();
        return elementClassName.contains(correctClassName);
    }

    private ArrayList<Node> getNumberBoxes(Node html) {
        ArrayList<Node> itemWrappers = getItemWrappers(html);

        ArrayList<Node> numberBoxes = new ArrayList<Node>();
        for (Node itemWrapper : itemWrappers) {
            for (int i = 0; i < itemWrapper.getChildCount(); i++) {
                Node table = itemWrapper.getChild(i);
                Node tr = table.getChild(0);
                Node numberBoxTD = tr.getChild(0);
                numberBoxes.add(numberBoxTD.getChild(0));
            }
        }
        return numberBoxes;
    }

    private ArrayList<Node> getTextTDs(Node html) {
        ArrayList<Node> itemWrappers = getItemWrappers(html);
        ArrayList<Node> textTDs = new ArrayList<Node>();
        for (Node itemWrapper : itemWrappers) {
            for (int i = 0; i < itemWrapper.getChildCount(); i++) {
                Node table = itemWrapper.getChild(i);
                Node tr = table.getChild(0);
                textTDs.add(tr.getChild(1));
            }
        }
        return textTDs;
    }

    private ArrayList<Node> getItemWrappers(Node html) {
        ArrayList<Node> displaysViews = getDisplaysViews(html);
        ArrayList<Node> itemWrappers = new ArrayList<Node>();

        for (Node displayView : displaysViews) {
            for (int i = 0; i < displayView.getChildCount(); i++) {
                itemWrappers.add(displayView.getChild(i));
            }
        }
        return itemWrappers;
    }

    private ArrayList<Node> getDisplaysViews(Node html) {
        Node itemsWrapper = getItemsWrapper(html);
        ArrayList<Node> displaysViews = new ArrayList<Node>();
        for (int i = 0; i < itemsWrapper.getChildCount(); i++) {
            displaysViews.add(itemsWrapper.getChild(i));
        }
        return displaysViews;
    }

    private Node getItemsWrapper(Node html) {
        return html.getChild(0);
    }

    private Style createDisplayBlockStyle() {
        Element tmpNode = DOM.createDiv();
        Style expectedStyle = tmpNode.getStyle();
        expectedStyle.setDisplay(Style.Display.BLOCK);
        return expectedStyle;
    }

    private Style createDisplayInlineBlockStyle() {
        Element tmpNode = DOM.createDiv();
        Style expectedStyle = tmpNode.getStyle();
        expectedStyle.setDisplay(Style.Display.INLINE_BLOCK);
        return expectedStyle;
    }

    private Integer[] getItemsIndexesInOrderFromState(String state) {
        IJsonServices jsonServices = new JsonServices();
        HashMap<String, String> parsedState = jsonServices.decodeHashMap(state);
        String orderState = parsedState.get("order");
        String[] indexes = orderState.split(",");
        Integer[] parsedIndexes = new Integer[indexes.length];
        for (int i = 0; i < indexes.length; i++) {
            parsedIndexes[i] = Integer.parseInt(indexes[i]);
        }
        return parsedIndexes;
    }
}
