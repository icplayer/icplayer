package com.lorepo.icplayer.client.mockup.xml;


import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.NamedNodeMap;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.Text;

public class CDATASectionImpl implements CDATASection{

	private org.w3c.dom.CDATASection nodeImpl;
	
	
	public CDATASectionImpl(org.w3c.dom.CDATASection item) {
		this.nodeImpl = item;
	}
	
	
	@Override
	public Text splitText(int offset) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void appendData(String appendedData) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void deleteData(int offset, int count) {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getData() {
		return nodeImpl.getData();
	}

	@Override
	public int getLength() {
		throw new UnsupportedOperationException();
	}

	@Override
	public void insertData(int offset, String insertedData) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void replaceData(int offset, int count, String replacementData) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void setData(String data) {
		throw new UnsupportedOperationException();
	}

	@Override
	public String substringData(int offset, int count) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node appendChild(Node newChild) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node cloneNode(boolean deep) {
		throw new UnsupportedOperationException();
	}

	@Override
	public NamedNodeMap getAttributes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public NodeList getChildNodes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getFirstChild() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getLastChild() {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getNamespaceURI() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getNextSibling() {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getNodeName() {
		throw new UnsupportedOperationException();
	}

	@Override
	public short getNodeType() {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getNodeValue() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Document getOwnerDocument() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getParentNode() {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getPrefix() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getPreviousSibling() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean hasAttributes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean hasChildNodes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node insertBefore(Node newChild, Node refChild) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void normalize() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node removeChild(Node oldChild) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node replaceChild(Node newChild, Node oldChild) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void setNodeValue(String nodeValue) {
		throw new UnsupportedOperationException();
	}

}
