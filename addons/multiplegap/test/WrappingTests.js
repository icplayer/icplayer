(function () {
    function setHorizontalOrientation(presenter) {
        presenter.configuration.orientation = presenter.ORIENTATIONS.HORIZONTAL;
    }
    
    function setVerticalOrientation(presenter) {
        presenter.configuration.orientation = presenter.ORIENTATIONS.VERTICAL;
    }
    
    function setWrappingItems(presenter) {
        presenter.configuration.wrapItems = true;
    }
    
    function compareCalculationsAndAssert(countItems, expectedPositions) {
        this.stubs.countItems.returns(countItems);
        assertEquals(expectedPositions, this.presenter.calculateElementPositions());
    }
    
    function setUpForTests () {
        this.presenter = new Addonmultiplegap_create();
        this.presenter.configuration = {
            wrapItems: false,
            items: {
                width: 100,
                height: 150,
                spacing: 10
            }
        };
        
        this.elementsCount = [1, 5, 10, 100];
        this.horizontalCorrectPositionsWithoutWrapping = [
            { top: 0, left: 110},
            { top: 0, left: 550},
            { top: 0, left: 1100},
            { top: 0, left: 11000}
        ];
        
        this.horizontalCorrectPositionForFirstElement = {
            top: 0,
            left: 0
        };
        
        this.verticalCorrectPositionForFirstElement = {
            top: 0,
            left: 0
        };
        
        this.verticalCorrectPositionsWithoutWrapping = [
            { top: 160, left: 0},
            { top: 800, left: 0},
            { top: 1600, left: 0},
            { top: 16000, left: 0}
        ];
        
        this.horizontalPositions = {
            edgeNotInBoundaries: {
                containerWidth: 300,
                firstElement: {
                    top: 0,
                    left: 0
                },
                firstElementCountItems: 0,
    
                secondElement: {
                    top: 0,
                    left: 110
                },
                secondElementCountItems: 1,
                
                edgeElement: {
                    top: 160,
                    left: 0
                },
                edgeElementCountItems: 2,
                
                nextToEdgeElement: {
                    top: 160,
                    left: 110
                },
                nextToEdgeElementCountItems: 3
            },
            edgeInBoundaries: {
                containerWidth: 320,
                firstElementCountItems: 0,
                firstElement: {
                    top: 0,
                    left: 0
                },
                
                secondElementCountItems: 1,
                secondElement: {
                    top: 0,
                    left: 110
                },
                
                edgeElementItemCount: 2,
                edgeElement: {
                    top: 0,
                    left: 220
                },
                
                nextToEdgeElementItemCount: 3,
                nextToEdgeElement: {
                    left: 0,
                    top: 160
                }
            }
        };
        
        this.verticalPositions = {
            edgeNotInBoundaries: {
                containerHeight: 450,
                firstElementCountItems: 0,
                firstElement: {
                    top: 0,
                    left: 0
                },
                
                secondElementCountItems: 1,
                secondElement: {
                    top: 160,
                    left: 0
                },
                
                edgeElementCountItems: 2,
                edgeElement: {
                    left: 110,
                    top: 0
                },
                
                nextToEdgeElementCountItems: 3,
                nextToEdgeElement: {
                    left: 110,
                    top: 160
                }
            },
            
            edgeInBoundaries: {
                containerHeight: 470,
                firstElementElementCountItems: 0,
                firstElement: {
                    top: 0,
                    left: 0
                },
                
                secondElementCountItems: 1,
                secondElement: {
                    top: 160,
                    left: 0
                },
                
                edgeElementCountItems: 2,
                edgeElement: {
                    left: 0,
                    top: 320
                },
                
                nextToEdgeElementCountItems: 3,
                nextToEdgeElement: {
                    left: 110,
                    top: 0
                }
            }
        };
        
        this.stubs = {
            countItems: sinon.stub(this.presenter, 'countItems'),
            getContainerWidth: sinon.stub(this.presenter, 'getContainerWidth'),
            getContainerHeight: sinon.stub(this.presenter, 'getContainerHeight')
        };
        
        this.stubs.getContainerWidth.returns(this.containerWidth);
        this.stubs.getContainerHeight.returns(this.containerHeight);
    }
    
    function tearDownFunction () {
        this.presenter.countItems.restore();
        this.presenter.getContainerWidth.restore();
        this.presenter.getContainerHeight.restore();
    }
    
    TestCase("[Multiple Gap ][calculateElementPositions] horizontal orientation - no wrapping", {
        setUp: function () {
            setUpForTests.call(this);
            setHorizontalOrientation(this.presenter);
        },
        
        tearDown: tearDownFunction,
        
        'test should return always top 0': function () {
            this.elementsCount.map(function (itemCount, index) {
                this.stubs.countItems.returns(itemCount);
                var positions = this.presenter.calculateElementPositions();
                assertEquals(0, positions.top);
            }, this);
        },
        
        'test should return left 0 and top 0 for first element': function () {
            this.stubs.countItems.returns(0);
            
            var positions = this.presenter.calculateElementPositions();
            
            assertEquals(this.horizontalCorrectPositionForFirstElement, positions);
        },
        
        'test should return left as sum of widths of items and configured element spacing': function () {
            this.elementsCount.map(function (itemCount, index) {
                this.stubs.countItems.returns(itemCount);
                
                assertEquals(this.horizontalCorrectPositionsWithoutWrapping[index], this.presenter.calculateElementPositions());
            }, this);
        }
    });
    
    TestCase("[Multiple Gap] [calculateElementPositions] vertical orientation - no wrapping", {
        setUp: function () {
            setUpForTests.call(this);
            setVerticalOrientation(this.presenter);
        },
        
        tearDown: tearDownFunction,
        
        'test should return always left 0': function () {
            this.elementsCount.map(function (itemCount, index) {
                this.stubs.countItems.returns(itemCount);
                var positions = this.presenter.calculateElementPositions();
                assertEquals(this.verticalCorrectPositionsWithoutWrapping[index].left, positions.left);
            }, this);
        },
        
        'test should return left 0 and top 0 for first element': function () {
            this.stubs.countItems.returns(0);
            
            var positions = this.presenter.calculateElementPositions();
            
            assertEquals(this.verticalCorrectPositionForFirstElement, positions);
        },
        
        'test should return top as sum of heights of items and configured element spacing': function () {
            this.elementsCount.map(function (itemCount, index) {
                this.stubs.countItems.returns(itemCount);
                
                assertEquals(this.verticalCorrectPositionsWithoutWrapping[index], this.presenter.calculateElementPositions());
            }, this);
        }
    });
    
    TestCase("[Multiple Gap] [calculateElementPositions] horizontal orientation - wrapping elements - edge element not in boundaries", {
        setUp: function () {
            setUpForTests.call(this);
            setHorizontalOrientation(this.presenter);
            setWrappingItems(this.presenter);
            this.stubs.getContainerWidth.returns(this.horizontalPositions.edgeNotInBoundaries.containerWidth);
        },
        
        tearDown: tearDownFunction,
        
        'test should place always atleast 1 element in row': function () {
            this.presenter.configuration.items.width = this.horizontalPositions.edgeNotInBoundaries.containerWidth * 2;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
            
            this.presenter.configuration.items.width = this.horizontalPositions.edgeNotInBoundaries.containerWidth + 10;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
        },
        
        'test should place first element in first row at top, left 0,0': function () {
            var countItems = this.horizontalPositions.edgeNotInBoundaries.firstElementCountItems;
            var expectedPositions = this.horizontalPositions.edgeNotInBoundaries.firstElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place middle elements in current row if they fit in container boundaries': function () {
            var countItems = this.horizontalPositions.edgeNotInBoundaries.firstElementCountItems;
            var expectedPositions = this.horizontalPositions.edgeNotInBoundaries.firstElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should wrap edge element and move to second row if it doesnt fit in container boundaries': function () {
            var countItems = this.horizontalPositions.edgeNotInBoundaries.edgeElementCountItems;
            var expectedPositions = this.horizontalPositions.edgeNotInBoundaries.edgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place next to edge element in second row if it fits or wrap': function () {
            var countItems = this.horizontalPositions.edgeNotInBoundaries.nextToEdgeElementCountItems;
            var expectedPositions = this.horizontalPositions.edgeNotInBoundaries.nextToEdgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        }
    });
    
    TestCase("[Multiple Gap] [calculateElementPositions] horizontal orientation - wrapping elements - edge element in boundaries", {
        setUp: function () {
            setUpForTests.call(this);
            setHorizontalOrientation(this.presenter);
            setWrappingItems(this.presenter);
            this.stubs.getContainerWidth.returns(this.horizontalPositions.edgeInBoundaries.containerWidth);
        },
        
        tearDown: tearDownFunction,
        
        'test should place always at least 1 element in row': function () {
            this.presenter.configuration.items.width = this.horizontalPositions.edgeInBoundaries.containerWidth;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
            
            this.presenter.configuration.items.width = this.horizontalPositions.edgeInBoundaries.containerWidth / 2;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
        },
        
        'test should place first element in first row at top, left 0,0': function () {
            var countItems = this.horizontalPositions.edgeInBoundaries.firstElementCountItems;
            var expectedPositions = this.horizontalPositions.edgeInBoundaries.firstElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place second element in first row next to first element if elements will stay in container bounds': function () {
            var countItems = this.horizontalPositions.edgeInBoundaries.secondElementCountItems;
            var expectedPositions = this.horizontalPositions.edgeInBoundaries.secondElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place edge element in current row if it fits to container boundaries': function () {
            var countItems = this.horizontalPositions.edgeInBoundaries.edgeElementItemCount;
            var expectedPositions = this.horizontalPositions.edgeInBoundaries.edgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place next element to edge in next row at first available place': function () {
            var countItems = this.horizontalPositions.edgeInBoundaries.nextToEdgeElementItemCount;
            var expectedPositions = this.horizontalPositions.edgeInBoundaries.nextToEdgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        }
    });
    
    TestCase("[Multiple Gap] [calculateElementPositions] vertical orientation - wrapping elements - edge not in boundaries", {
        setUp: function () {
            setUpForTests.call(this);
            setVerticalOrientation(this.presenter);
            setWrappingItems(this.presenter);
            this.stubs.getContainerHeight.returns(this.verticalPositions.edgeNotInBoundaries.containerHeight);
        },
        
        tearDown: tearDownFunction,
        
        'test should place always at least 1 element in column': function () {
            this.presenter.configuration.items.height = this.verticalPositions.edgeNotInBoundaries.containerHeight * 2;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
            
            this.presenter.configuration.items.height = this.verticalPositions.edgeNotInBoundaries.containerHeight + 10;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
        },
        
        'test should place first element at 0,0': function () {
            var countItems = this.verticalPositions.edgeNotInBoundaries.firstElementCountItems;
            var expectedPositions = this.verticalPositions.edgeNotInBoundaries.firstElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place another elements below with specified spacing if it  fits in boundaries': function () {
            var countItems = this.verticalPositions.edgeNotInBoundaries.secondElementCountItems;
            var expectedPositions = this.verticalPositions.edgeNotInBoundaries.secondElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should wrap edge element if it not fit in boundaries to next column': function () {
            var countItems = this.verticalPositions.edgeNotInBoundaries.edgeElementCountItems;
            var expectedPositions = this.verticalPositions.edgeNotInBoundaries.edgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place next to edge in the same column if it fits in boundaries': function () {
            var countItems = this.verticalPositions.edgeNotInBoundaries.nextToEdgeElementCountItems;
            var expectedPositions = this.verticalPositions.edgeNotInBoundaries.nextToEdgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        }
    });
    
    TestCase("[Multiple Gap] [calculateElementPositions] vertical orientation - wrapping elements - edge in boundaries", {
        setUp: function () {
            setUpForTests.call(this);
            setVerticalOrientation(this.presenter);
            setWrappingItems(this.presenter);
            this.stubs.getContainerHeight.returns(this.verticalPositions.edgeInBoundaries.containerHeight);
        },
        
        tearDown: tearDownFunction,
        
        'test should place always at least 1 element in column': function () {
            this.presenter.configuration.items.height = this.verticalPositions.edgeInBoundaries.containerHeight;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
            
            this.presenter.configuration.items.height = this.verticalPositions.edgeInBoundaries.containerHeight / 2;
            compareCalculationsAndAssert.call(this, 0, {
                top: 0,
                left: 0
            });
        },
        
        'test should place first element at 0,0': function () {
            var countItems = this.verticalPositions.edgeInBoundaries.firstElementElementCountItems;
            var expectedPositions = this.verticalPositions.edgeInBoundaries.firstElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should place another elements below with specified spacing if it  fits in boundaries': function () {
            var countItems = this.verticalPositions.edgeInBoundaries.secondElementCountItems;
            var expectedPositions = this.verticalPositions.edgeInBoundaries.secondElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test shouldnt wrap edge element, if it fits in boundaries, to next column': function () {
            var countItems = this.verticalPositions.edgeInBoundaries.edgeElementCountItems;
            var expectedPositions = this.verticalPositions.edgeInBoundaries.edgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        },
        
        'test should wrap next to edge element to next column ': function () {
            var countItems = this.verticalPositions.edgeInBoundaries.nextToEdgeElementCountItems;
            var expectedPositions = this.verticalPositions.edgeInBoundaries.nextToEdgeElement;
            compareCalculationsAndAssert.call(this, countItems, expectedPositions);
        }
    });
})();