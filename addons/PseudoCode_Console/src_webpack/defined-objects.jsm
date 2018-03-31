/**
 * Arguments dispatcher for methods. Before calling method get object and arguments from stack and convert it to js call with arguments
 * @param fn {Function}
 * @returns {Function}
 */
export function objectMocksMethodArgumentsDispatcherDecorator (fn) {
    return function () {
        let builtIn = {
           console: arguments[0].console,
           data: arguments[0].data,
           objects: arguments[1],
           retVal: arguments[4]
        };
        builtIn.console.nextIns = arguments[2];
        builtIn.console.pauseIns = arguments[3];
        let args = Array.prototype.slice.call(arguments, 5);

        args.push(builtIn);

        builtIn.retVal.value = fn.apply(this, args);
    };
}

/**
 *
 * @param {{round: Number, exceptions: EXCEPTIONS}} config
 */
export function getDefinedObjects (config) {
    let DEFINED_OBJECTS = {
        Object: {
            __constructor__: function object__constructor__ () {
                return {
                    value: null,
                    type: "Object",
                    methods: DEFINED_OBJECTS.Object['__methods__'],
                    parent: null
                }
            },
            __methods__: {
                __ge__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function object_ge__method (toValue) {
                        if (this.value >= toValue.value) {
                            return DEFINED_OBJECTS.Boolean.__constructor__(true);
                        }

                        return DEFINED_OBJECTS.Boolean.__constructor__(false);
                    })
                },
                __le__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function object__le__method (toValue) {
                        if (this.value <= toValue.value) {
                            return DEFINED_OBJECTS.Boolean.__constructor__(true);
                        }

                        return DEFINED_OBJECTS.Boolean.__constructor__(false);
                    })
                },

                __gt__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function object__gt__method (toValue) {
                        if (this.value > toValue.value) {
                            return DEFINED_OBJECTS.Boolean.__constructor__(true);
                        }

                        return DEFINED_OBJECTS.Boolean.__constructor__(false);
                    })
                },

                __lt__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function object__lt__method (toValue) {
                        if (this.value < toValue.value) {
                            return DEFINED_OBJECTS.Boolean.__constructor__(true);
                        }

                        return DEFINED_OBJECTS.Boolean.__constructor__(false);
                    })
                },

                __neq__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function object__neq__method (toValue) {
                        if (this.value !== toValue.value) {
                            return DEFINED_OBJECTS.Boolean.__constructor__(true);
                        }

                        return DEFINED_OBJECTS.Boolean.__constructor__(false);
                    })
                },

                __eq__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function object__eq__method (toValue) {
                        if (this.value === toValue.value) {
                            return DEFINED_OBJECTS.Boolean.__constructor__(true);
                        }

                        return DEFINED_OBJECTS.Boolean.__constructor__(false);
                    })
                }
            }
        },

        Array: {
            __constructor__: function array__constructor__ (count, values) {
                values = values || [];

                let value = [];
                let i = 0;

                for (i; i < values.length; i += 1) {
                    value[i] = values[i];
                }

                for (; i < count; i += 1) {
                    value.push(DEFINED_OBJECTS.Number.__constructor__(0));
                }

                return {
                    value: value,
                    type: "Array",
                    methods: DEFINED_OBJECTS.Array['__methods__'],
                    parent: DEFINED_OBJECTS.Object
                }
            },

            __methods__: {
                __get__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function array__get__code (index) {
                        if (index.type !== "Number") {
                            throw config.exceptions.CastErrorException(index.type, "Number");
                        }

                        if (this.value[index.value] === undefined) {
                            throw config.exceptions.IndexOutOfBoundsException(this.type, index.value, this.value.length);
                        }

                        return this.value[index.value];
                    })
                },
                __set__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function array__set__code (index, value) {
                        if (index.type !== "Number") {
                            throw config.exceptions.CastErrorException("String", "Number");
                        }

                        if (this.value[index.value] === undefined) {
                            throw config.exceptions.IndexOutOfBoundsException(this.type, index.value, this.value.length);
                        }

                        this.value[index.value] = value;

                        return this;
                    })
                }
            }
        },

        Boolean: {
            __constructor__: function boolean__constructor__ (val) {
                return {
                    value: Boolean(val) || false,
                    type: "Boolean",
                    methods: DEFINED_OBJECTS.Boolean['__methods__'],
                    parent: DEFINED_OBJECTS.Object
                }
            },

            __methods__: {
            }
        },

        String: {
            __constructor__: function string__constructor__ (val) {
                return {
                    value: String(val) || '',
                    type: "String",
                    methods: DEFINED_OBJECTS.String['__methods__'],
                    parent: DEFINED_OBJECTS.Object
                }
            },

            __methods__: {
                __add__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function string__add__method__ (toValue) {
                        if (toValue.type === "Number" || toValue.type === "String") {
                            return DEFINED_OBJECTS.String.__constructor__(this.value + toValue.value);
                        }

                        throw config.exceptions.CastErrorException(this.type, toValue.type);
                    })
                }
            }
        },

        Number: {
            __constructor__: function number__constructor__ (value) {
                return {
                    constructor: DEFINED_OBJECTS.Number['__constructor__'],
                    value: Number(value) || 0,
                    type: "Number",
                    methods: DEFINED_OBJECTS.Number['__methods__'],
                    parent: DEFINED_OBJECTS.Object
                }
            },
            __methods__: {
                __add__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function number__add__method (toValue) {
                        if (toValue.type === "Number") {
                            return DEFINED_OBJECTS.Number.__constructor__(this.value + toValue.value);
                        } else if (toValue.type === "String") {
                            return DEFINED_OBJECTS.String.__constructor__(this.value + toValue.value);
                        }

                        throw config.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __sub__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function number__sub__method (toValue) {
                        if (toValue.type === "Number") {
                            return DEFINED_OBJECTS.Number.__constructor__(this.value - toValue.value);
                        }

                        throw config.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },

                __mul__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function number__mul__method (toValue) {
                        if (toValue.type === "Number") {
                            let value = this.value * toValue.value;
                            value = value.toFixed(config.round);

                            return DEFINED_OBJECTS.Number.__constructor__(parseFloat(value));
                        }

                        throw config.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },

                __div__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function number__div__method (toValue) {
                        if (toValue.type === "Number") {
                            let value = this.value / toValue.value;
                            value = value.toFixed(config.round);

                            return DEFINED_OBJECTS.Number.__constructor__(parseFloat(value));
                        }

                        throw config.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __div_full__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function number__div_full__method (toValue) {
                        if (toValue.type === "Number") {
                            return DEFINED_OBJECTS.Number.__constructor__(~~(this.value / toValue.value));
                        }

                        throw config.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __mod__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function number__mod__method (toValue) {
                        if (toValue.type === "Number") {
                            return DEFINED_OBJECTS.Number.__constructor__(this.value % toValue.value);
                        }

                        throw config.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __minus__: {
                    native: true,
                    jsCode: objectMocksMethodArgumentsDispatcherDecorator(function number__minus__method () {
                        return DEFINED_OBJECTS.Number.__constructor__(this.value * -1);
                    })
                }
            }
        }
    };

    return DEFINED_OBJECTS;
}