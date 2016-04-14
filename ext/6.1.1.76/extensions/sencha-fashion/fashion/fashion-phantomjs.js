var Fashion;
(function (Fashion) {
    if (typeof module != 'undefined') {
        module.exports = Fashion;
    }
    if (typeof window !== 'undefined') {
        window.Fashion = Fashion;
    }
    var Base = (function () {
        function Base(config) {
            if (config) {
                merge(this, config);
            }
        }
        return Base;
    }());
    Fashion.Base = Base;
    function apply(target, source) {
        target = target || {};
        if (source) {
            for (var name in source) {
                target[name] = source[name];
            }
        }
        return target;
    }
    Fashion.apply = apply;
    function merge(destination, object) {
        destination = destination || {};
        var key, value, sourceKey;
        if (object) {
            for (key in object) {
                value = object[key];
                if (value && value.constructor === Object) {
                    sourceKey = destination[key];
                    if (sourceKey && sourceKey.constructor === Object) {
                        merge(sourceKey, value);
                    }
                    else {
                        destination[key] = value;
                    }
                }
                else {
                    destination[key] = value;
                }
            }
        }
        return destination;
    }
    Fashion.merge = merge;
    function _chainFunc() { }
    Fashion.chain = Object.create || function (Parent) {
        _chainFunc.prototype = Parent;
        return new _chainFunc();
    };
    function createMessage(message, source) {
        if (source && source.isFashionScanner) {
            message += ': ' + source.currentFile + ':' + source.lineNumber;
        }
        else if (source) {
            message += ': ' + source.file + ':' + source.lineNumber;
        }
        return message;
    }
    Fashion.createMessage = createMessage;
    function isFunction(obj) {
        return obj && typeof obj === 'function';
    }
    Fashion.isFunction = isFunction;
    function debug(message, source) {
        console.log(createMessage('[DBG] ' + message, source));
    }
    Fashion.debug = debug;
    function log(message, source) {
        console.log(createMessage('[LOG] ' + message, source));
    }
    Fashion.log = log;
    function info(message, source) {
        console.info(createMessage('[INF] ' + message, source));
    }
    Fashion.info = info;
    function warn(message, source) {
        console.warn(createMessage('[WRN] ' + message, source));
    }
    Fashion.warn = warn;
    function error(message, source) {
        console.error(createMessage('[ERR] ' + message, source));
    }
    Fashion.error = error;
    function raise(message, extra) {
        if (typeof message !== 'string') {
            extra = message;
            message = extra.message;
            delete extra.message;
        }
        throw apply(new Error(message), extra);
    }
    Fashion.raise = raise;
    function raiseAt(message, source) {
        var extra;
        if (source) {
            message = createMessage(message, source);
            if (source.isFashionScanner) {
                extra = {
                    file: source.currentFile,
                    lineNumber: source.lineNumber
                };
            }
            else {
                extra = {
                    node: source,
                    lineNumber: source.lineNumber,
                    file: source.currentFile
                };
            }
        }
        raise(message, extra);
    }
    Fashion.raiseAt = raiseAt;
    function filter(array, func) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (func(item, i)) {
                result.push(item);
            }
        }
        return result;
    }
    Fashion.filter = filter;
    function convert(array, func) {
        var converted = [];
        for (var i = 0; i < array.length; i++) {
            converted.push(func(array[i]));
        }
        return converted;
    }
    Fashion.convert = convert;
    function first(array) {
        return array.length && array[0];
    }
    Fashion.first = first;
    function last(array) {
        return array.length && array[array.length - 1];
    }
    Fashion.last = last;
    function tail(array) {
        if (array.length > 2) {
            return array.slice(1);
        }
        return [];
    }
    Fashion.tail = tail;
    var BaseSet = (function () {
        function BaseSet() {
        }
        BaseSet.prototype.first = function () {
            return first(this.items);
        };
        BaseSet.prototype.last = function () {
            return last(this.items);
        };
        BaseSet.prototype.tail = function () {
            return tail(this.items);
        };
        return BaseSet;
    }());
    Fashion.BaseSet = BaseSet;
    function mixin(target, bases) {
        if (!Array.isArray(bases)) {
            bases = Array.prototype.slice.call(arguments, 1);
        }
        var proto = target.prototype;
        for (var b = 0; b < bases.length; b++) {
            var base = bases[b], baseProto = base.prototype;
            for (var name in baseProto) {
                if (baseProto.hasOwnProperty(name) && !proto[name]) {
                    proto[name] = baseProto[name];
                }
            }
        }
    }
    Fashion.mixin = mixin;
    function flatten(array, level, output) {
        output = output || [];
        level = typeof level === 'undefined' ? 1000 : level;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (Array.isArray(item) && level) {
                flatten(item, level - 1, output);
            }
            else {
                output.push(item);
            }
        }
        return output;
    }
    Fashion.flatten = flatten;
    Fashion.EmptyArray = [];
})(Fashion || (Fashion = {}));
///<reference path="Base.ts"/>
///<require path="typings/tsd.d.ts"/>
var Fashion;
(function (Fashion) {
    var Env;
    (function (Env) {
        Env.isNode = typeof process === 'object' && process + '' === '[object process]';
        Env.isPhantom = typeof phantom !== 'undefined';
        Env.isRhino = typeof importPackage !== 'undefined';
        Env.isBrowser = !(Env.isNode || Env.isRhino || Env.isPhantom);
        Env.canSetPrototype = (function () {
            var a = { x: 42 }, b = {};
            try {
                b.__proto__ = a;
            }
            catch (e) {
            }
            return b.x === 42;
        })();
        function exists(path) {
            try {
                if (Env.isRhino && !Env.isPhantom) {
                    return new java.io.File(path).exists();
                }
                if (Env.isPhantom) {
                    var fs = require('fs');
                    return fs.exists(path);
                }
                readFile(path);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        Env.exists = exists;
        function join(dir, subpath) {
            return dir + "/" + subpath;
        }
        Env.join = join;
        function readFileRhino(file) {
            Fashion.raise("function 'Fashion.Env.readFileRhino' has no default implementation");
        }
        Env.readFileRhino = readFileRhino;
        function readFile(file) {
            if (Env.isRhino) {
                return Fashion.Env.readFileRhino(file);
            }
            if (Env.isNode) {
                var fs = require('fs');
                return fs.readFileSync(file);
            }
            return doRequest({
                url: file,
                async: false,
                method: 'GET'
            });
        }
        Env.readFile = readFile;
        function loadFileRhino(file, success, error) {
            Fashion.raise("function 'Fashion.Env.readFileRhino' has no default implementation");
        }
        Env.loadFileRhino = loadFileRhino;
        function loadFile(file, success, error, options, retries) {
            if (Env.isBrowser) {
                retries = retries || 0;
                doRequest(Fashion.merge({
                    url: file,
                    async: true,
                    params: {
                        _dc: new Date().getTime()
                    },
                    onComplete: function (options, xhr) {
                        if (success) {
                            success(xhr.responseText, xhr);
                        }
                    },
                    onError: function () {
                        if (retries < 3) {
                            Fashion.Env.loadFile(file, success, error, options, retries + 1);
                        }
                        else {
                            error && error.apply(error, arguments);
                        }
                    }
                }, options));
            }
            else if (Env.isNode) {
                var fs = require('fs');
                fs.readFile(file, function (err, data) {
                    if (err && error) {
                        error(err);
                    }
                    else {
                        success(data + '');
                    }
                });
            }
            else if (Env.isRhino) {
                Fashion.Env.loadFileRhino(file, success, error);
            }
        }
        Env.loadFile = loadFile;
        function doRequest(options) {
            var url = options.url, method = options.method || 'GET', data = options.data || null, async = options.async !== false, onComplete = options.onComplete, onError = options.onError, scope = options.scope || this, params = options.params, queryParams = [], arrayBufferSupported = false, queryParamStr, xhr, content, sep;
            if (params) {
                for (var name in params) {
                    queryParams.push(name + "=" + params[name]);
                }
                queryParamStr = queryParams.join('&');
                if (queryParamStr !== '') {
                    sep = url.indexOf('?') > -1 ? '&' : '?';
                    url = url + sep + queryParamStr;
                }
            }
            if (typeof XMLHttpRequest !== 'undefined') {
                xhr = new XMLHttpRequest();
                arrayBufferSupported = typeof xhr.responseType === 'string';
            }
            else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            //console.log("requesting url : " + url);
            xhr.open(method, url, async);
            if (async) {
                xhr.timeout = 5 * 1000;
            }
            if (options.binary) {
                if (arrayBufferSupported) {
                    xhr.responseType = 'arraybuffer';
                    xhr.getBinaryData = function () {
                        return new Uint8Array(this.response);
                    };
                }
                else {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                    xhr.getBinaryData = function () {
                        return this.responseText;
                    };
                }
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    try {
                        if (xhr.status === 200) {
                            if (onComplete) {
                                onComplete.call(scope, options, xhr);
                            }
                        }
                        else {
                            if (onError) {
                                onError.call(scope, options, xhr);
                            }
                        }
                    }
                    catch (err) {
                        Fashion.error((err.stack || err) + '');
                        if (onError) {
                            onError.call(scope, options, xhr, err);
                        }
                    }
                    finally {
                    }
                }
            };
            xhr.onerror = onError;
            if (typeof data === "function") {
                data = data();
            }
            if (typeof data !== 'string') {
                data = JSON.stringify(data);
            }
            xhr.send(data);
            if (!async) {
                content = xhr.responseText;
                return content;
            }
        }
        Env.doRequest = doRequest;
    })(Env = Fashion.Env || (Fashion.Env = {}));
})(Fashion || (Fashion = {}));
/// <reference path="Base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fashion;
(function (Fashion) {
    var Visitor = (function (_super) {
        __extends(Visitor, _super);
        function Visitor(config) {
            _super.call(this, config);
            this.nodeStack = [];
        }
        Visitor.prototype.visitComments = function (docs) {
            for (var d = 0; d < docs.length; d++) {
                this.Comment(docs[d]);
            }
        };
        Visitor.prototype.visitItem = function (obj) {
            if (obj.docs && obj.docs.length) {
                this.visitComments(obj.docs);
            }
            obj.doVisit(this);
        };
        Visitor.prototype.visit = function (obj) {
            while (obj && (obj.visitTarget !== undefined)) {
                obj = obj.visitTarget;
            }
            if (obj) {
                if (Array.isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        this.visit(obj[i]);
                    }
                    return;
                }
                this.nodeStack.push(obj);
                this.visitItem(obj);
                this.nodeStack.pop();
            }
        };
        Visitor.prototype.Comment = function (comment) {
        };
        /*
        visitEach (node, handlers) {
            this.visit(node.variable, handlers);
            this.visit(node.list, handlers);
            this.visit(node.statements, handlers);
        }

        visitFor (node, handlers) {
            this.visit(node.variable, handlers);
            this.visit(node.start, handlers);
            this.visit(node.end, handlers);
            this.visit(node.statements, handlers);
        }

        visitFunction (node, handlers) {
            this.visit(node.func, handlers);
            this.visit(node.statements, handlers);
        }

        visitRuleset (node, handlers) {
            this.visit(node.selectors, handlers);
            this.visit(node.statements, handlers);
        }

        visitMixin (node, handlers) {
            this.visit(node.name, handlers);
            this.visit(node.statements, handlers);
        }

        visitInclude (node, handlers) {
            this.visit(node.include, handlers);
        }

        visitDeclaration (node, handlers) {
            this.visit(node.property, handlers);
            this.visit(node.value, handlers);
        }

        visitVariableAssignment (node, handlers) {
            this.visit(node.value, handlers);
        }

        visitIf (node, handlers) {
            this.visit(node.condition, handlers);
            this.visit(node.statements, handlers);
        }

        visitElse (node, handlers) {
            this.visit(node.condition, handlers);
            this.visit(node.statements, handlers);
        }

        visitReturn (node, handlers) {
            this.visit(node.expr, handlers);
        }

        visitParenthetical (node, handlers) {
            this.visit(node.expr, handlers);
        }

        visitSelectorPart (node, handlers) {
            this.visit(node.value, handlers);
        }

        visitSelectorProperty(node, handlers) {
            this.visit(node.property, handlers);
            this.visit(node.value, handlers);
        }

        visitCompoundSelector(node, handlers) {
            this.visit(node.items, handlers);
        }

        visitMultiPartSelector(node, handlers) {
            this.visit(node.items, handlers);
        }

        visitSelectorList(node, handlers) {
            this.visit(node.items, handlers);
        }

        visitBinaryExpression (node, handlers) {
            this.visit(node.left, handlers);
            this.visit(node.right, handlers);
        }

        visitUnaryExpression (node, handlers) {
            this.visit(node.expr, handlers);
        }

        visitVariable (node, handlers) {
            // no child nodes to descend
        }

        visitConstant (node, handlers) {
            // no child nodes to descend
        }

        visitFunctionCall (node, handlers) {
            this.visit(node.args, handlers);
        }

        visitExtend (node, handlers) {
            // no child nodes to descend
        }

        visitList (node, handlers) {
            this.visit(node.items, handlers);
        }

        visitWarn (node, handlers) {
            // no child nodes to descend
        }

        visitImport (node, handlers) {
            this.visit(node.source, handlers);
        }

        visitRequire (node, handlers) {
            this.visit(node.source, handlers);
        }

        visitDebugger (node, handlers) {
            // no child nodes
        }
        */
        Visitor.prototype.Each = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.For = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.While = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Charset = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Function = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Ruleset = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Mixin = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Block = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Include = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Declaration = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.VariableAssignment = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Assignment = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.If = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Else = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Return = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.ParentheticalExpression = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.SelectorPart = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.SelectorProperty = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.CompoundSelector = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.MultiPartSelector = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.SelectorList = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.BinaryExpression = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.UnaryExpression = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Variable = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Constant = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.FunctionCall = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Extend = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.List = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Warn = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Import = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Require = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Content = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Debugger = function (obj) {
            obj.descend(this);
        };
        Visitor.prototype.Debug = function (obj) {
            obj.descend(this);
        };
        return Visitor;
    }(Fashion.Base));
    Fashion.Visitor = Visitor;
})(Fashion || (Fashion = {}));
/// <reference path="Base.ts"/>
var Fashion;
(function (Fashion) {
    var Output = (function (_super) {
        __extends(Output, _super);
        function Output() {
            _super.call(this);
            this.indentation = '';
            this.isCompressed = false;
            this.indentstr = '    ';
            this.splitThreshold = 1000000;
            this.selectorCount = 0;
            this.output = '';
        }
        Output.prototype.space = function () {
            this.add(' ');
        };
        Output.prototype.add = function (text) {
            this.output += text;
        };
        Output.prototype.addComment = function (text) {
            this.output += text;
        };
        Output.prototype.indent = function () {
            this.indentation += this.indentstr;
        };
        Output.prototype.unindent = function () {
            this.indentation = this.indentation.substr(this.indentstr.length);
        };
        Output.prototype.addln = function (ln) {
            this.output += '\n' + this.indentation + (ln || '');
        };
        Output.prototype.addCommentLn = function (ln) {
            if (ln && ln.indexOf('//') === 0) {
                return;
            }
            this.addln(ln);
        };
        Output.prototype.get = function () {
            return this.output;
        };
        Output.prototype.indentln = function (ln) {
            this.addln(ln);
            this.indent();
        };
        Output.prototype.unindentln = function (ln) {
            this.unindent();
            this.addln(ln);
        };
        Output.prototype.reset = function () {
            this.indentation = '';
            this.output = '';
        };
        return Output;
    }(Fashion.Base));
    Fashion.Output = Output;
})(Fashion || (Fashion = {}));
///<reference path='../Base.ts'/>
///<reference path="../Output.ts"/>
var Fashion;
(function (Fashion) {
    var Type = (function () {
        function Type() {
            this.value = undefined;
            this.unit = undefined;
        }
        Type.prototype.coerce = function (obj) {
            var converted = this.tryCoerce(obj);
            return converted || obj;
        };
        Type.prototype.getHash = function () {
            if (this.visitTarget) {
                return this.visitTarget.toString();
            }
            return this.toString();
        };
        Type.prototype.tryCoerce = function (obj) {
            var me = this;
            if (me.constructor === obj.constructor) {
                return obj;
            }
            if (me.constructor.tryCoerce) {
                return me.constructor.tryCoerce(obj);
            }
            return undefined;
        };
        Type.prototype.supports = function (prefix) {
            return false;
        };
        Type.prototype.operate = function (operation, right) {
            return this.performOperation(operation, this.coerce(right));
        };
        Type.prototype.performOperation = function (operation, right) {
            // check for <op>.<type> name for class-specific impl,
            // eg, ==.color or +.list
            var method = this[operation + "." + right.type] || this[operation];
            if (!method) {
                Fashion.raise("Failed to find method for operation " + operation + " on type " +
                    right.type + " with value " + right + ".");
            }
            return Fashion.Type.box(method.call(this, right));
        };
        Type.prototype['=='] = function (right) {
            return this.getHash() === right.getHash();
        };
        Type.prototype['!='] = function (right) {
            return this.getHash() !== right.getHash();
        };
        Type.prototype['>='] = function (right) {
            return this.getHash() >= right.getHash();
        };
        Type.prototype['<='] = function (right) {
            return this.getHash() <= right.getHash();
        };
        Type.prototype['>'] = function (right) {
            return this.getHash() > right.getHash();
        };
        Type.prototype['<'] = function (right) {
            return this.getHash() < right.getHash();
        };
        Type.prototype['+'] = function (right) {
            return this.getHash() + right.getHash();
        };
        Type.prototype.clone = function (match, replace) {
            return this;
        };
        Type.prototype.unquote = function () {
            return this;
        };
        Type.prototype.toPrefixedString = function (prefix) {
            return this.toString();
        };
        Type.prototype.doVisit = function (visitor) { };
        Type.prototype.descend = function (visitoir) { };
        /**
         * A mechanism that enables searching upwards in the type tree for comments with a
         * particular control tag.  The search begins locally first on the specified node,
         * and continues upwards until either an enable or disable tag is specified, or the
         * the root of the tree is reached with no tags specified.
         *
         * By testing for both positive and negative matches locally, features can be enabled
         * or disabled at specific points, potentially overriding state set at a more
         * generic scope.  Ex:
         *
         *      //# fashion -ingline
         *      @font-face {
         *          src: url(foo.eot);
         *          src: url(foo.svg);
         *          //# fashion +inline
         *          src: url(foo.ttf);
         *      }
         *
         * @param tag The tag to search for.
         * @param prefix An optional prefix, such as 'fashion warn'.  Defaults to 'fashion'
         * @param enable A regex indicating a match for the enable state (+tag).
         * @param disable A regex indicating a match for the disable state (-tag)
         * @returns {any} true for enable | false for disable | null for unspecified
         */
        Type.prototype.hasTag = function (tag, prefix, enable, disable) {
            prefix = prefix || "fashion";
            enable = enable || new RegExp('^\\s*//#\\s*' + prefix + '\\s*\\+?' + tag + "\s*$");
            disable = disable || new RegExp('^\\s*//#\\s*' + prefix + '\\s*\\-' + tag + '\\s*$');
            var docs = this.docs;
            if (docs && docs.length) {
                for (var d = 0; d < this.docs.length; d++) {
                    var doc = docs[d];
                    if (enable.test(doc)) {
                        return true;
                    }
                    if (disable.test(doc)) {
                        return false;
                    }
                }
            }
            if (this.parentNode) {
                return this.parentNode.hasTag(tag, prefix, enable, disable);
            }
            return null;
        };
        return Type;
    }());
    Fashion.Type = Type;
    Fashion.apply(Type.prototype, {
        visitTarget: undefined,
        $isFashionType: true,
        $canUnbox: true
    });
})(Fashion || (Fashion = {}));
/// <reference path='Type.ts'/>
///<reference path="Numeric.ts"/>
var Fashion;
(function (Fashion) {
    var Literal = (function (_super) {
        __extends(Literal, _super);
        function Literal(value) {
            _super.call(this);
            this.value = value;
        }
        Literal.prototype.doVisit = function (visitor) {
            visitor.literal(this);
        };
        Literal.prototype.getHash = function () {
            return this.value;
        };
        Literal.prototype.toString = function () {
            return this.value || '';
        };
        Literal.prototype.toBoolean = function () {
            return this.value.length;
        };
        Literal.prototype.clone = function (match, replace) {
            if (match && match === this.toString()) {
                return replace.clone();
            }
            return new Fashion.Literal(this.value);
        };
        Literal.prototype['+'] = function (right) {
            return new Fashion.Literal(this.value + right.getHash());
        };
        Literal.prototype['+.number'] = function (right) {
            if (this.value === null) {
                return right;
            }
            return new Fashion.Literal(this.value + right.toString());
        };
        Literal.prototype['/'] = function (right) {
            return new Fashion.Literal(this.value + '/' + right.getHash());
        };
        Literal.prototype['-'] = function (right) {
            return new Fashion.Literal(this.value + '-' + right.getHash());
        };
        Literal.prototype['%'] = function (right) {
            return new Fashion.Literal(this.value + '%' + right.getHash());
        };
        Literal.tryCoerce = function (obj) {
            if (obj.$isFashionNumber) {
                return undefined;
            }
            if (obj.$isFashionString) {
                return new Fashion.Literal(obj.value);
            }
            if (obj.$isFashionLiteral) {
                return obj;
            }
            return new Fashion.Literal(obj.getHash());
        };
        Literal.prototype.normalizeStart = function (startVal) {
            var start = Fashion.Type.unbox(startVal) || 0;
            if (start > 0) {
                start = start - 1;
            }
            if (start < 0) {
                start = this.value.length + start;
            }
            if (start < 0) {
                start = 0;
            }
            return start;
        };
        Literal.prototype.normalizeEnd = function (endVal) {
            var end = Fashion.Type.unbox(endVal) || -1;
            if (end > 0) {
                end = end - 1;
            }
            if (end < 0) {
                end = this.value.length + end;
            }
            if (end < 0) {
                end = 0;
            }
            if (end > 0) {
                end = end + 1;
            }
            return end;
        };
        Literal.prototype.slice = function (start, end) {
            start = this.normalizeStart(start);
            end = this.normalizeEnd(end);
            return new Fashion.Literal(this.value.slice(start, end));
        };
        Literal.prototype.toUpperCase = function () {
            return new Fashion.Literal(this.value.toUpperCase());
        };
        Literal.prototype.toLowerCase = function () {
            return new Fashion.Literal(this.value.toLowerCase());
        };
        Literal.prototype.indexOf = function (str) {
            var idx = this.value.indexOf(str.value);
            if (idx === -1) {
                return undefined;
            }
            return new Fashion.Numeric(idx + 1);
        };
        Literal.prototype.insert = function (str, startVal) {
            var start = Fashion.Type.unbox(startVal) || 0, inserted = this.value;
            if (start > 0) {
                start = Math.min(start - 1, inserted.length);
            }
            if (start < 0) {
                start = inserted.length + start + 1;
                start = Math.max(start, 0);
            }
            inserted = inserted.substring(0, start) + str.value + inserted.substring(start);
            return new Fashion.Literal(Fashion.Literal.deEscape(inserted));
        };
        Literal.deEscape = function (str) {
            var buff = '', i, ch;
            for (i = 0; i < str.length; i++) {
                ch = str.charAt(i);
                if (ch === '\\') {
                    i++;
                    ch = str.charAt(i);
                }
                buff += ch;
            }
            return buff;
        };
        return Literal;
    }(Fashion.Type));
    Fashion.Literal = Literal;
    var ParentheticalExpression = (function (_super) {
        __extends(ParentheticalExpression, _super);
        function ParentheticalExpression(value) {
            _super.call(this);
            this.type = 'parenthetical';
            this.value = value;
        }
        ParentheticalExpression.prototype.toString = function () {
            return '(' + this.value.toString() + ')';
        };
        ParentheticalExpression.prototype.doVisit = function (visitor) {
            visitor.parenthetical(this);
        };
        return ParentheticalExpression;
    }(Fashion.Type));
    Fashion.ParentheticalExpression = ParentheticalExpression;
    Fashion.apply(Literal.prototype, {
        type: 'literal',
        $isFashionLiteral: true
    });
    Fashion.Null = new Literal(null);
    Fashion.None = new Literal('none');
})(Fashion || (Fashion = {}));
/// <reference path='Type.ts'/>
var Fashion;
(function (Fashion) {
    var Bool = (function (_super) {
        __extends(Bool, _super);
        function Bool(value) {
            _super.call(this);
            this.value = !!value;
        }
        Bool.prototype.doVisit = function (visitor) {
            visitor.bool(this);
        };
        Bool.prototype.toString = function () {
            return this.value ? 'true' : 'false';
        };
        Bool.prototype.clone = function () {
            return new Fashion.Bool(this.value);
        };
        return Bool;
    }(Fashion.Type));
    Fashion.Bool = Bool;
    Fashion.apply(Bool.prototype, {
        type: 'bool',
        $isFashionBool: true
    });
    Fashion.True = new Bool(true);
    Fashion.False = new Bool(false);
})(Fashion || (Fashion = {}));
///<reference path='Type.ts'/>
///<reference path="Literal.ts"/>
///<reference path="Bool.ts"/>
var Fashion;
(function (Fashion) {
    var Numeric = (function (_super) {
        __extends(Numeric, _super);
        function Numeric(value, unit, numeratorUnits, denominatorUnits) {
            _super.call(this);
            this.value = value;
            this.unit = unit;
            if (unit && !numeratorUnits) {
                this.numeratorUnits = [unit];
            }
            else {
                this.numeratorUnits = numeratorUnits || [];
            }
            this.denominatorUnits = denominatorUnits || [];
        }
        Numeric.prototype.doVisit = function (visitor) {
            visitor.number(this);
        };
        Numeric.prototype.unitless = function () {
            if (this.numeratorUnits && this.numeratorUnits.length) {
                return false;
            }
            if (this.denominatorUnits && this.denominatorUnits.length) {
                return false;
            }
            return true;
            ;
        };
        Numeric.prototype.getUnitStr = function () {
            this.normalizeUnits();
            var unitStr = this.numeratorUnits.join('*');
            if (this.denominatorUnits.length) {
                unitStr += '/' + this.denominatorUnits.join('*');
            }
            return unitStr;
        };
        Numeric.prototype.getHash = function () {
            return this.value;
        };
        Numeric.prototype.stringify = function () {
            this.normalizeUnits();
            var value = this.value, valStr;
            // prevent 0.020000000000000004 type numbers in output
            valStr = (Math.round(value * 100000) / 100000) + '';
            //unitStr = valStr === '0' ? '' : this.getUnitStr();
            return valStr + this.getUnitStr();
        };
        Numeric.prototype.toString = function () {
            return this.stringify();
        };
        Numeric.prototype.toBoolean = function () {
            return this.unit ? true : !!this.value;
        };
        Numeric.prototype.clone = function () {
            return new Fashion.Numeric(this.value, this.unit);
        };
        Numeric.prototype['-.literal'] = function (right) {
            if (this.value === 0 && this.unitless()) {
                return new Fashion.Literal(['-', right.toString()].join(''));
            }
            return new Fashion.Literal([this.toString(), '-', right.toString()].join(''));
        };
        Numeric.prototype['-.string'] = function (right) {
            if (this.value === 0 && this.unitless()) {
                return new Fashion.Literal(['-', right.toString()].join(''));
            }
            return new Fashion.Literal([this.toString(), '-', right.toString()].join(''));
        };
        Numeric.prototype['-.number'] = function (right) {
            var value = right.value;
            if (right.unit == '%' && right.unit !== this.unit) {
                value = this.value * (right.value / 100);
            }
            return new Fashion.Numeric(this.value - value, this.unit || right.unit);
        };
        Numeric.prototype['+.literal'] = function (right) {
            if (right.$isFashionString) {
                return new Fashion.Literal([
                    this.toString(),
                    right.value
                ].join(''));
            }
            return new Fashion.Literal([
                this.toString(),
                right.toString()
            ].join(''));
        };
        Numeric.prototype['+.number'] = function (right) {
            var value = right.value;
            if (right.unit == '%' && right.unit !== this.unit) {
                value = this.value * (right.value / 100);
            }
            return new Fashion.Numeric(this.value + value, this.unit || right.unit);
        };
        Numeric.prototype['/'] = function (right) {
            return new Fashion.Numeric(this.value / right.value, ((this.unit == right.unit) ? null : (this.unit || right.unit)));
        };
        Numeric.prototype['*'] = function (right) {
            return new Fashion.Numeric(this.value * right.value, this.unit || right.unit);
        };
        Numeric.prototype['%'] = function (right) {
            return new Fashion.Numeric(this.value % right.value, this.unit || right.unit);
        };
        Numeric.prototype['**'] = function (right) {
            return new Fashion.Numeric(Math.pow(this.value, right.value), this.unit || right.unit);
        };
        Numeric.prototype.operate = function (operation, right) {
            var unit = this.unit || right.unit, rightUnit = right.unit || unit, normalized;
            if (right.$isFashionRGBA || right.$isFashionHSLA) {
                return new Fashion.Literal(this + operation + right);
            }
            if (right.$isFashionNumber) {
                return this.numericOperate(operation, right);
            }
            else if (right.$isFashionLiteral) {
                normalized = this.tryCoerce(right);
                if (normalized) {
                    return this.performOperation(operation, normalized);
                }
            }
            return Fashion.Type.prototype.operate.call(this, operation, right);
        };
        Numeric.prototype.tryNormalize = function (other) {
            var value = other.value, unit = other.unit;
            if (other.$isFashionNumber) {
                switch (this.unit) {
                    case 'mm':
                        switch (unit) {
                            case 'in':
                                return new Fashion.Numeric(value * 25.4, 'mm');
                            case 'cm':
                                return new Fashion.Numeric(value * 2.54, 'mm');
                        }
                        break;
                    case 'cm':
                        switch (unit) {
                            case 'in':
                                return new Fashion.Numeric(value * 2.54, 'cm');
                            case 'mm':
                                return new Fashion.Numeric(value / 10, 'cm');
                        }
                        break;
                    case 'in':
                        switch (unit) {
                            case 'mm':
                                return new Fashion.Numeric(value / 25.4, 'in');
                            case 'cm':
                                return new Fashion.Numeric(value / 2.54, 'in');
                        }
                        break;
                    case 'ms':
                        switch (unit) {
                            case 's':
                                return new Fashion.Numeric(value * 1000, 'ms');
                        }
                        break;
                    case 's':
                        switch (unit) {
                            case 'ms':
                                return new Fashion.Numeric(value / 1000, 's');
                        }
                        break;
                    case 'Hz':
                        switch (unit) {
                            case 'kHz':
                                return new Fashion.Numeric(value * 1000, 'Hz');
                        }
                        break;
                    case 'kHz':
                        switch (unit) {
                            case 'Hz':
                                return new Fashion.Numeric(value / 1000, 'kHz');
                        }
                        break;
                    case '%':
                        switch (unit) {
                            default:
                                return new Fashion.Numeric(value);
                        }
                    default:
                        break;
                }
            }
            return undefined;
        };
        Numeric.prototype.normalize = function (other) {
            var norm = this.tryNormalize(other);
            if (norm === undefined) {
                Fashion.raise('Could not normalize ' + this + ' with ' + other);
            }
            return norm;
        };
        Numeric.prototype.comparable = function (other) {
            var unit1 = this.unit, unit2 = other.unit;
            if (!other.$isFashionNumber) {
                return false;
            }
            return ((unit1 === unit2) ||
                (unit1 === 'mm' && (unit2 === 'in' || unit2 === 'cm')) ||
                (unit1 === 'cm' && (unit2 === 'in' || unit2 === 'mm')) ||
                (unit1 === 'in' && (unit2 === 'mm' || unit2 === 'cm')) ||
                (unit1 === 'ms' && unit2 === 's') ||
                (unit1 === 's' && unit2 === 'ms') ||
                (unit1 === 'Hz' && unit2 === 'kHz') ||
                (unit1 === 'kHz' && unit2 === 'Hz'));
        };
        //---------------------------------------------------------------
        Numeric.prototype.normalizeUnits = function () {
            if (this.normalized) {
                return;
            }
            this.normalized = true;
            if (!this.unitless()) {
                var clean = this.removeCommonUnits(this.numeratorUnits, this.denominatorUnits), converted;
                //var num = [],
                //    den = [];
                //
                //for(var d = 0; d < clean.den.length; d++) {
                //    var dn = clean.den[d];
                //    if(this.convertable(dn)) {
                //        converted = false;
                //        for (var n = 0; n < clean.num.length; n++) {
                //            var nm = clean.num[n];
                //            if(this.convertable(nm)) {
                //                this.value = this.value / this.conversionFactor(dn, nm);
                //                converted = true;
                //            } else {
                //                num.push(nm);
                //            }
                //        }
                //        if(!converted) {
                //            den.push(dn);
                //        }
                //    }
                //}
                //
                //this.numeratorUnits = num;
                //this.denominatorUnits = den;
                clean.num = Fashion.filter(clean.num, function (val) {
                    return !!val;
                });
                clean.den = Fashion.filter(clean.den, function (val) {
                    return !!val;
                });
                this.numeratorUnits = clean.num;
                this.denominatorUnits = clean.den;
            }
        };
        Numeric.prototype.numericOperate = function (operation, right) {
            this.normalizeUnits();
            right.normalizeUnits();
            var me = this, other = right, ops = Fashion.Numeric.OPERATIONS, moreOps = Fashion.Numeric.NON_COERCE_OPERATIONS, op = ops[operation], result;
            if (op) {
                try {
                    if (me.unitless()) {
                        me = me.coerceUnits(other.numeratorUnits, other.denominatorUnits);
                    }
                    else {
                        other = other.coerceUnits(me.numeratorUnits, me.denominatorUnits);
                    }
                }
                catch (e) {
                    if (operation == '==') {
                        return Fashion.False;
                    }
                    if (operation == '!=') {
                        return Fashion.True;
                    }
                    throw e;
                }
            }
            else {
                op = moreOps[operation];
            }
            if (op) {
                result = op(me.value, other.value);
            }
            if (typeof result === 'number') {
                var units = this.computeUnits(me, other, operation);
                return new Numeric(result, (units.num.length ? units.num[0] : null), units.num, units.den);
            }
            return new Fashion.Bool(result);
        };
        Numeric.prototype.computeUnits = function (left, right, op) {
            switch (op) {
                case '*':
                    return {
                        num: left.numeratorUnits.slice().concat(right.numeratorUnits),
                        den: left.denominatorUnits.slice().concat(right.denominatorUnits)
                    };
                case '/':
                    return {
                        num: left.numeratorUnits.slice().concat(right.denominatorUnits),
                        den: left.denominatorUnits.slice().concat(right.numeratorUnits)
                    };
                default:
                    return {
                        num: left.numeratorUnits,
                        den: left.denominatorUnits
                    };
            }
        };
        Numeric.prototype.coerceUnits = function (units, denominatorUnits) {
            var value = this.value;
            if (!this.unitless()) {
                value = value
                    * this.coercionFactor(this.numeratorUnits, units)
                    / this.coercionFactor(this.denominatorUnits, denominatorUnits);
            }
            return new Numeric(value, units && units[0], units, denominatorUnits);
        };
        Numeric.prototype.coercionFactor = function (units, otherUnits) {
            var res = this.removeCommonUnits(units, otherUnits), fromUnits = res.num, toUnits = res.den;
            if (fromUnits.length !== toUnits.length || !this.convertable(fromUnits || toUnits)) {
                Fashion.raise('Incompatible units: ' + fromUnits.join('*') + ' and ' + toUnits.join('*'));
            }
            for (var i = 0; i < fromUnits.length; i++) {
                var fromUnit = fromUnits[i];
                for (var j = 0; j < toUnits.length; j++) {
                    var toUnit = toUnits[j], factor = this.conversionFactor(fromUnit, toUnit);
                    if (factor !== null) {
                        return factor;
                    }
                }
            }
            return 1;
        };
        Numeric.prototype.conversionFactor = function (fromUnit, toUnit) {
            var cUnits = Fashion.Numeric.CONVERTABLE_UNITS, cTable = Fashion.Numeric.CONVERSION_TABLE, factor = null;
            if (cUnits[fromUnit]) {
                if (cUnits[toUnit]) {
                    factor = cTable[cUnits[fromUnit]][cUnits[toUnit]];
                }
            }
            if (factor === null && cUnits[toUnit]) {
                if (cUnits[fromUnit]) {
                    factor = 1.0 / cTable[cUnits[toUnit]][cUnits[fromUnit]];
                }
            }
            return factor;
        };
        Numeric.prototype.convertable = function (units) {
            if (units && !Array.isArray(units)) {
                units = [units];
            }
            if (units && units.length) {
                var convertableUnits = Fashion.Numeric.CONVERTABLE_UNITS;
                for (var i = 0; i < units.length; i++) {
                    if (convertableUnits[units[i]] === undefined) {
                        return false;
                    }
                }
            }
            return true;
        };
        Numeric.prototype.removeCommonUnits = function (numUnits, denUnits) {
            var map = {}, num = [], den = [], i, unit, unit;
            for (i = 0; i < numUnits.length; i++) {
                unit = numUnits[i];
                map[unit] = (map[unit] || 0) + 1;
            }
            for (i = 0; i < denUnits.length; i++) {
                unit = denUnits[i];
                map[unit] = (map[unit] || 0) - 1;
            }
            for (i = 0; i < numUnits.length; i++) {
                unit = numUnits[i];
                if (map[unit] > 0) {
                    num.push(unit);
                    map[unit]--;
                }
            }
            for (i = 0; i < denUnits.length; i++) {
                unit = denUnits[i];
                if (map[unit] < 0) {
                    den.push(unit);
                    map[unit]++;
                }
            }
            return {
                num: num,
                den: den
            };
        };
        Numeric.tryGetNumber = function (value) {
            if (/^\d*$/.test(value)) {
                value = parseFloat(value);
            }
            if (!isNaN(value)) {
                return new Fashion.Numeric(value);
            }
            return undefined;
        };
        Numeric.tryCoerce = function (obj) {
            if (obj.$isFashionNumber) {
                return obj;
            }
            if (obj.$isFashionLiteral) {
                return this.tryGetNumber(obj.value);
            }
            return undefined;
        };
        //---------------------------------------------------------------
        // Statics
        Numeric.OPERATIONS = {
            '!=': function (l, r) { return l != r; },
            '+': function (l, r) { return l + r; },
            '-': function (l, r) { return l - r; },
            '<=': function (l, r) { return l <= r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '>=': function (l, r) { return l >= r; },
            '==': function (l, r) { return l == r; },
            '%': function (l, r) { return Math.abs(l % r); }
        };
        Numeric.NON_COERCE_OPERATIONS = {
            '*': function (l, r) { return l * r; },
            '**': function (l, r) { return Math.pow(l, r); },
            '/': function (l, r) { return l / r; }
        };
        Numeric.CONVERTABLE_UNITS = {
            'in': 0,
            'cm': 1,
            'pc': 2,
            'mm': 3,
            'pt': 4,
            'px': 5
        };
        Numeric.CONVERSION_TABLE = [
            [1, 2.54, 6, 25.4, 72, 96],
            [null, 1, 2.36220473, 10, 28.3464567, 37.795276],
            [null, null, 1, 4.23333333, 12, 16],
            [null, null, null, 1, 2.83464567, 3.7795276],
            [null, null, null, null, 1, 1.3333333],
            [null, null, null, null, null, 1] // px
        ];
        return Numeric;
    }(Fashion.Type));
    Fashion.Numeric = Numeric;
    Fashion.apply(Numeric.prototype, {
        type: 'number',
        $isFashionNumber: true
    });
})(Fashion || (Fashion = {}));
/// <reference path='Type.ts'/>
///<reference path="Numeric.ts"/>
///<reference path="Bool.ts"/>
var Fashion;
(function (Fashion) {
    var Color = (function (_super) {
        __extends(Color, _super);
        function Color() {
            _super.apply(this, arguments);
        }
        Color.prototype.toBoolean = function () {
            return Fashion.True;
        };
        // These two references need to be left out of the comment section above
        // so as to prevent ordering issue during builds;
        Color.prototype.getRGBA = function () {
            return this;
        };
        Color.prototype.getHSLA = function () {
            return this;
        };
        Color.prototype.clone = function () {
            return new Fashion.ColorRGBA(0, 0, 0, 1);
        };
        Color.component = function (color, component) {
            var unit = Fashion.Color.units[component], type = Fashion.Color.types[component], prop = Fashion.Color.comps[component], targetColor;
            if (type == 'hsla') {
                targetColor = color.getHSLA();
            }
            else {
                targetColor = color.getRGBA();
            }
            return new Fashion.Numeric(targetColor[prop], unit);
        };
        Color.adjust = function (color, component, amount) {
            var hsl = color.getHSLA().clone(), prop = Fashion.Color.comps[component], value = amount.value;
            //    if (component === 'saturation' && hsl.s === 0)  {
            //        return color.clone();
            //    }
            //
            hsl[prop] += value;
            hsl.h = Fashion.Color.constrainDegrees(hsl.h);
            hsl.s = Fashion.Color.constrainPercentage(hsl.s);
            hsl.l = Fashion.Color.constrainPercentage(hsl.l);
            return hsl.getRGBA();
        };
        Color.constrainChannel = function (channel) {
            return Math.max(0, Math.min(channel, 255));
        };
        Color.constrainPercentage = function (per) {
            return Math.max(0, Math.min(per, 100));
        };
        Color.constrainDegrees = function (deg) {
            deg = deg % 360;
            return (deg < 0) ? (360 + deg) : deg;
        };
        Color.constrainAlpha = function (alpha) {
            if (alpha === undefined) {
                return 1;
            }
            return Math.max(0, Math.min(alpha, 1));
        };
        //--------------------------------------------------------------------
        // Statics
        Color.units = {
            lightness: '%',
            saturation: '%',
            hue: 'deg'
        };
        Color.types = {
            red: 'rgba',
            blue: 'rgba',
            green: 'rgba',
            alpha: 'rgba',
            hue: 'hsla',
            saturation: 'hsla',
            lightness: 'hsla'
        };
        Color.comps = {
            red: 'r',
            green: 'g',
            blue: 'b',
            alpha: 'a',
            hue: 'h',
            saturation: 's',
            lightness: 'l'
        };
        Color.map = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 132, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 255, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 203],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [119, 128, 144],
            slategrey: [119, 128, 144],
            snow: [255, 255, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 5],
            transparent: [0, 0, 0, 0]
        };
        return Color;
    }(Fashion.Type));
    Fashion.Color = Color;
    Fashion.apply(Color.prototype, {
        type: 'color',
        $isFashionColor: true,
        $isFashionRGBA: false,
        $isFashionHSLA: false,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
/// <reference path='Color.ts'/>
///<reference path="ColorRGBA.ts"/>
var Fashion;
(function (Fashion) {
    var ColorHSLA = (function (_super) {
        __extends(ColorHSLA, _super);
        function ColorHSLA(h, s, l, a) {
            _super.call(this);
            this.type = 'hsla';
            this.$isFashionHSLA = true;
            this.h = Fashion.Color.constrainDegrees(h);
            this.s = s;
            this.l = l;
            this.a = (a !== undefined) ? a : 1;
        }
        ColorHSLA.prototype.doVisit = function (visitor) {
            visitor.hsla(this);
        };
        ColorHSLA.prototype.operate = function (operation, right) {
            return this.getRGBA().operate(operation, right);
        };
        ColorHSLA.prototype.clone = function () {
            return new Fashion.ColorHSLA(this.h, this.s, this.l, this.a);
        };
        ColorHSLA.prototype.getRGBA = function () {
            return Fashion.ColorRGBA.fromHSLA(this);
        };
        ColorHSLA.prototype.toString = function () {
            return this.getRGBA().toString();
        };
        ColorHSLA.prototype.add = function (h, s, l, a) {
            return new Fashion.ColorHSLA(Fashion.Color.constrainDegrees(this.h + h), Fashion.Color.constrainPercentage(this.s + s), Fashion.Color.constrainPercentage(this.l + l), Fashion.Color.constrainAlpha(this.a * a));
        };
        ColorHSLA.prototype.subtract = function (h, s, l) {
            return this.add(-h, -s, -l);
        };
        ColorHSLA.prototype.adjustLightness = function (percent) {
            this.l = Fashion.Color.constrainPercentage(this.l + percent);
            return this;
        };
        ColorHSLA.prototype.adjustHue = function (deg) {
            this.h = Fashion.Color.constrainDegrees(this.h + deg);
            return this;
        };
        ColorHSLA.fromRGBA = function (rgba) {
            if (rgba.$isFashionHSLA) {
                return rgba.clone();
            }
            var r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255, a = rgba.a, max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min, h = 0, s = 0, l = 0.5 * (max + min);
            // min==max means achromatic (hue is undefined)
            if (min != max) {
                s = (l < 0.5) ? delta / (max + min) : delta / (2 - max - min);
                if (r == max) {
                    h = 60 * (g - b) / delta;
                }
                else if (g == max) {
                    h = 120 + 60 * (b - r) / delta;
                }
                else {
                    h = 240 + 60 * (r - g) / delta;
                }
                if (h < 0) {
                    h += 360;
                }
                if (h >= 360) {
                    h -= 360;
                }
            }
            return new Fashion.ColorHSLA(Fashion.Color.constrainDegrees(h), Fashion.Color.constrainPercentage(s * 100), Fashion.Color.constrainPercentage(l * 100), a);
        };
        return ColorHSLA;
    }(Fashion.Color));
    Fashion.ColorHSLA = ColorHSLA;
})(Fashion || (Fashion = {}));
/// <reference path='Color.ts'/>
///<reference path="ColorHSLA.ts"/>
var Fashion;
(function (Fashion) {
    function hex2(v) {
        var s = v.toString(16);
        if (s.length < 2) {
            s = '0' + s;
        }
        return s;
    }
    Fashion.hex2 = hex2;
    var ColorRGBA = (function (_super) {
        __extends(ColorRGBA, _super);
        function ColorRGBA(r, g, b, a) {
            _super.call(this);
            //-----------------------------------------------------------------
            // Operations
            this["+.number"] = function (right) {
                var value = right.value, unit = right.unit;
                switch (unit) {
                    case '%':
                        return this.getHSLA().adjustLightness(value).getRGBA();
                    case 'deg':
                        return this.getHSLA().adjustHue(value).getRGBA();
                    default:
                        return this.add(value, value, value, 1);
                }
            };
            this["+.rgba"] = function (right) {
                return this.add(right.r, right.g, right.b, right.a);
            };
            this["+.hsla"] = function (right) {
                return this.getHSLA().add(right.h, right.s, right.l);
            };
            this["-.number"] = function (right) {
                var value = right.value, unit = right.unit;
                switch (unit) {
                    case '%':
                        return this.getHSLA().adjustLightness(-value).getRGBA();
                    case 'deg':
                        return this.getHSLA().adjustHue(-value).getRGBA();
                    default:
                        return this.subtract(value, value, value);
                }
            };
            this["-.rgba"] = function (right) {
                return this.subtract(right.r, right.g, right.b);
            };
            this["-.hsla"] = function (right) {
                return this.getHSLA().subtract(right.h, right.s, right.l);
            };
            this["*.number"] = function (right) {
                return this.multiply(right.value);
            };
            this["/.number"] = function (right) {
                return this.divide(right.value);
            };
            this["*.rgba"] = function (right) {
                return new Fashion.ColorRGBA(this.r * right.r, this.g * right.g, this.b * right.b, this.a * right.a);
            };
            this["/.rgba"] = function (right) {
                return new Fashion.ColorRGBA(Math.floor(this.r / right.r), Math.floor(this.g / right.g), Math.floor(this.b / right.b), Math.floor(this.a / right.a));
            };
            this.r = Math.min(0xff, Math.max(0, r));
            this.g = Math.min(0xff, Math.max(0, g));
            this.b = Math.min(0xff, Math.max(0, b));
            this.a = (a !== undefined) ? Math.min(1.0, Math.max(0.0, a)) : 1;
        }
        ColorRGBA.prototype.doVisit = function (visitor) {
            visitor.rgba(this);
        };
        ColorRGBA.prototype.clone = function () {
            return new Fashion.ColorRGBA(this.r, this.g, this.b, this.a);
        };
        ColorRGBA.prototype.getHSLA = function () {
            return Fashion.ColorHSLA.fromRGBA(this);
        };
        ColorRGBA.prototype.stringify = function () {
            var me = this, round = Math.round, r = round(me.r), g = round(me.g), b = round(me.b), a = me.a, stringified = '';
            // If there is no transparency we will use hex value
            if (a === 1) {
                stringified = '#' + hex2(r) + hex2(g) + hex2(b);
            }
            else {
                // Else use rgba
                stringified = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
            }
            stringified = stringified.toLowerCase();
            return stringified;
        };
        ColorRGBA.prototype.getCompressedValue = function (lowerVal) {
            var name = Fashion.ColorRGBA.stringifiedMap[lowerVal], shortName = Fashion.ColorRGBA.shortFormMap[lowerVal];
            if (name) {
                lowerVal = (lowerVal.length > name.length)
                    ? name
                    : lowerVal;
            }
            if (Fashion.ColorRGBA.useShortValues && shortName) {
                lowerVal = (lowerVal.length > shortName.length)
                    ? shortName
                    : lowerVal;
            }
            return lowerVal;
        };
        ColorRGBA.prototype.toString = function () {
            if (!this.stringified) {
                this.stringified = this.getCompressedValue(this.stringify());
            }
            return this.stringified;
        };
        ColorRGBA.prototype.toIeHexStr = function () {
            var me = this, round = Math.round, r = round(me.r), g = round(me.g), b = round(me.b), a = round(0xff * me.a);
            return '#' + hex2(a) + hex2(r) + hex2(g) + hex2(b);
        };
        ColorRGBA.prototype.add = function (r, g, b, a) {
            return new Fashion.ColorRGBA(this.r + r, this.g + g, this.b + b, this.a * a);
        };
        ColorRGBA.prototype.subtract = function (r, g, b) {
            return new Fashion.ColorRGBA(this.r - r, this.g - g, this.b - b, this.a);
        };
        ColorRGBA.prototype.multiply = function (number) {
            return new Fashion.ColorRGBA(this.r * number, this.g * number, this.b * number, this.a);
        };
        ColorRGBA.prototype.divide = function (number) {
            return new Fashion.ColorRGBA(this.r / number, this.g / number, this.b / number, this.a);
        };
        //------------------------------------------------------------------
        // Statics
        ColorRGBA.fromHex = function (value) {
            if (value.charAt(0) == '#') {
                value = value.substr(1);
            }
            var r, g, b;
            if (value.length === 3) {
                r = parseInt(value.charAt(0), 16);
                g = parseInt(value.charAt(1), 16);
                b = parseInt(value.charAt(2), 16);
                r = (r << 4) + r;
                g = (g << 4) + g;
                b = (b << 4) + b;
            }
            else {
                r = parseInt(value.substring(0, 2), 16);
                g = parseInt(value.substring(2, 4), 16);
                b = parseInt(value.substring(4, 6), 16);
            }
            var result = new Fashion.ColorRGBA(r, g, b);
            if (Fashion.ColorRGBA.preserveInputStrings) {
                result.stringified = "#" + value;
            }
            return result;
        };
        ColorRGBA.fromHSLA = function (color) {
            if (color.$isFashionRGBA) {
                return color.clone();
            }
            var hsla = color, h = hsla.h / 360, s = hsla.s / 100, l = hsla.l / 100, a = hsla.a;
            var m2 = (l <= 0.5) ? (l * (s + 1)) : (l + s - l * s), m1 = l * 2 - m2;
            function hue(h) {
                if (h < 0)
                    ++h;
                if (h > 1)
                    --h;
                if (h * 6 < 1)
                    return m1 + (m2 - m1) * h * 6;
                if (h * 2 < 1)
                    return m2;
                if (h * 3 < 2)
                    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
                return m1;
            }
            var r = Fashion.Color.constrainChannel(hue(h + 1 / 3) * 0xff), g = Fashion.Color.constrainChannel(hue(h) * 0xff), b = Fashion.Color.constrainChannel(hue(h - 1 / 3) * 0xff);
            return new Fashion.ColorRGBA(r, g, b, a);
        };
        ColorRGBA.stringifiedMap = {
            'rgba(0, 0, 0, 0)': 'transparent'
        };
        ColorRGBA.shortFormMap = {};
        ColorRGBA.useShortValues = true;
        ColorRGBA.preserveInputStrings = false;
        return ColorRGBA;
    }(Fashion.Color));
    Fashion.ColorRGBA = ColorRGBA;
    Fashion.apply(ColorRGBA.prototype, {
        type: 'rgba',
        $isFashionRGBA: true
    });
})(Fashion || (Fashion = {}));
(function (ColorRGBA, stringifiedMap, colorMap, shortMap) {
    var colorChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f'
    ], names = Object.keys(colorMap), i;
    names.sort();
    for (i = 0; i < names.length; i++) {
        var name = names[i], val = colorMap[name], color = new ColorRGBA(val[0], val[1], val[2], val[3]), str = color.stringify();
        stringifiedMap[str] = name;
    }
    colorChars.forEach(function (short1) {
        var long1 = short1 + short1;
        colorChars.forEach(function (short2) {
            var long2 = short2 + short2;
            colorChars.forEach(function (short3) {
                var long3 = short3 + short3, short = '#' + short1 + short2 + short3, long = '#' + long1 + long2 + long3;
                if (shortMap[long]) {
                    var curr = shortMap[long];
                    short = (curr.length > short.length) ? short : curr;
                }
                shortMap[long] = short;
            });
        });
    });
})(Fashion.ColorRGBA, Fashion.ColorRGBA.stringifiedMap, Fashion.Color.map, Fashion.ColorRGBA.shortFormMap);
///<reference path="Literal.ts"/>
var Fashion;
(function (Fashion) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(value, quoteChar) {
            _super.call(this, value);
            if (Fashion.Text.preferDoubleQuotes) {
                this.quoteChar = quoteChar === '' ? '' : '"';
            }
            else {
                this.quoteChar = typeof quoteChar === 'undefined' ? '"' : quoteChar;
            }
        }
        Text.prototype.doVisit = function (visitor) {
            visitor.string(this);
        };
        Text.prototype.toString = function () {
            return this.quoteChar + this.value + this.quoteChar;
        };
        Text.prototype.unquote = function () {
            return new Fashion.Literal(this.value);
        };
        Text.prototype.clone = function () {
            return new Fashion.Text(this.value, this.quoteChar);
        };
        Text.prototype['+'] = function (right) {
            return new Fashion.Text(this.value + right.getHash());
        };
        Text.prototype['+.number'] = function (right) {
            return new Fashion.Text(this.value + right.toString());
        };
        Text.prototype['/'] = function (right) {
            return new Fashion.Text(this.value + '/' + right.getHash());
        };
        Text.prototype.slice = function (start, end) {
            return new Fashion.Text(_super.prototype.slice.call(this, start, end).value, this.quoteChar);
        };
        Text.prototype.toUpperCase = function () {
            return new Fashion.Text(this.value.toUpperCase(), this.quoteChar);
        };
        Text.prototype.toLowerCase = function () {
            return new Fashion.Text(this.value.toLowerCase(), this.quoteChar);
        };
        Text.prototype.insert = function (str, startVal) {
            return new Fashion.Text(_super.prototype.insert.call(this, str, startVal).value, this.quoteChar);
        };
        Text.tryCoerce = function (obj) {
            if (obj.$isFashionNumber) {
                return undefined;
            }
            if (obj.$isFashionLiteral) {
                return new Fashion.Text(obj.value);
            }
            return new Fashion.Text(obj.getHash());
        };
        Text.preferDoubleQuotes = false;
        return Text;
    }(Fashion.Literal));
    Fashion.Text = Text;
    Fashion.apply(Text.prototype, {
        type: 'string',
        $isFashionString: true
    });
})(Fashion || (Fashion = {}));
/// <reference path='Type.ts'/>
///<reference path="../Output.ts"/>
var Fashion;
(function (Fashion) {
    var List = (function (_super) {
        __extends(List, _super);
        function List(items, separator) {
            _super.call(this);
            this.items = items || [];
            this.separator = typeof separator === 'undefined' ? ' ' : separator;
        }
        List.prototype.doVisit = function (visitor) {
            visitor.list(this);
        };
        List.prototype.descend = function (visitor) {
            for (var i = 0; i < this.items.length; i++) {
                visitor.visit(this.items[i]);
            }
        };
        List.prototype.clone = function () {
            return new Fashion.List(this.items.slice(0), this.separator);
        };
        List.prototype.add = function (item) {
            return this.items.push(item);
        };
        List.prototype.get = function (index) {
            return this.items[index - 1] || null;
        };
        List.prototype.operate = function (operation, right) {
            switch (operation) {
                case '!=':
                    if (right.$isFashionLiteral) {
                        if (right.value === 'null' || right.value === 'none') {
                            return true;
                        }
                    }
                    break;
                case '==':
                    if (right.$isFashionLiteral) {
                        if (right.value === 'null' || right.value === 'none') {
                            return false;
                        }
                    }
                    break;
            }
            return Fashion.Type.prototype.operate.call(this, operation, right);
        };
        List.prototype.supports = function (prefix) {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.supports(prefix)) {
                    return true;
                }
            }
            return false;
        };
        List.prototype.toBoolean = function () {
            return !!this.items.length;
        };
        List.prototype.getItems = function () {
            return Fashion.filter(this.items, function (item) {
                var unboxed = Fashion.Type.unbox(item);
                return unboxed !== null && unboxed !== undefined;
            });
        };
        List.prototype.toString = function () {
            return this.items.join(this.separator);
        };
        List.prototype.unquote = function () {
            var items = [];
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i]) {
                    items.push(this.items[i].unquote());
                }
            }
            return new List(items, this.separator);
        };
        List.prototype.toPrefixedString = function (prefix) {
            var items = [];
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item) {
                    items.push(item.toPrefixedString(prefix));
                }
            }
            return items.join(this.separator);
        };
        //----------------------------------------------------------------------
        // Operations
        List.prototype['==.list'] = function (right) {
            var equals = this.separator == right.separator &&
                this.items.length == right.items.length;
            for (var i = 0; equals && i < this.items.length; ++i) {
                equals = this.items[i].operate("==", right.items[i]);
            }
            return equals;
        };
        return List;
    }(Fashion.Type));
    Fashion.List = List;
    Fashion.apply(List.prototype, {
        type: 'list',
        $isFashionList: true
    });
})(Fashion || (Fashion = {}));
///<reference path="Type.ts"/>
///<reference path="Ruleset.ts"/>
var Fashion;
(function (Fashion) {
    var Declaration = (function (_super) {
        __extends(Declaration, _super);
        function Declaration(cfg) {
            _super.call(this);
            if (cfg) {
                Fashion.apply(this, cfg);
            }
        }
        Declaration.prototype.doVisit = function (visitor) {
            visitor.declaration(this);
        };
        Declaration.prototype.descend = function (visitor) {
            visitor.visit(this.value);
        };
        return Declaration;
    }(Fashion.Type));
    Fashion.Declaration = Declaration;
    Fashion.apply(Declaration.prototype, {
        type: 'declaration',
        $isFashionDeclaration: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
/// <reference path="Base.ts"/>
var Fashion;
(function (Fashion) {
    Fashion.VariableNameMap = {};
    var NameConverter = (function (_super) {
        __extends(NameConverter, _super);
        function NameConverter() {
            _super.apply(this, arguments);
        }
        NameConverter.prototype.convertName = function (name) {
            if (!Fashion.VariableNameMap.hasOwnProperty(name)) {
                Fashion.VariableNameMap[name] = getJsName(name);
            }
            return Fashion.VariableNameMap[name];
        };
        return NameConverter;
    }(Fashion.Base));
    Fashion.NameConverter = NameConverter;
    function getJsName(name) {
        return name
            .replace(/\-/g, '_')
            .replace(/\//g, '_fs_')
            .replace(/\\/g, '_bs_');
    }
    Fashion.getJsName = getJsName;
})(Fashion || (Fashion = {}));
///<reference path="NameConverter.ts"/>
///<reference path="Runtime.ts"/>
///<reference path="Visitor.ts"/>
var Fashion;
(function (Fashion) {
    var SassVariable = (function (_super) {
        __extends(SassVariable, _super);
        function SassVariable(cfg) {
            _super.call(this, cfg);
            this.references = this.references || [];
        }
        SassVariable.prototype.elevateDynamics = function (variables, elevator) {
            var me = this, dynamicWas = me.dynamic;
            me.dynamic = true;
            if (!dynamicWas) {
                if (this.enableElevationWarning) {
                    Fashion.warn("Elevating variable '" + me.name + "' to dynamic", me.node);
                    Fashion.warn("\tcaused by", elevator.node);
                }
                me.elevationCause = elevator;
                variables.push(me);
            }
            me.references.forEach(function (ref) {
                var variable = me.map[ref];
                if (variable && !variable.dynamic) {
                    variable.elevateDynamics(variables, me);
                }
            });
        };
        SassVariable.prototype.verify = function () {
            if (this.dynamic) {
                if (this.previous) {
                    if (!this.previous.dynamic) {
                        Fashion.error([
                            'Cannot redefine ',
                            this.name,
                            ' as dynamic'
                        ].join(''));
                        Fashion.error('\tfrom ', this.previous.getNode());
                        Fashion.error('\t  at ', this.getNode());
                        this.preprocessor.errors += 1;
                        return false;
                    }
                }
            }
            return true;
        };
        SassVariable.prototype.elevated = function () {
            return this.dynamic && !this.attributes.dynamic;
        };
        SassVariable.prototype.getNode = function () {
            var node = this.node;
            return node;
        };
        return SassVariable;
    }(Fashion.Base));
    Fashion.SassVariable = SassVariable;
    var Preprocessor = (function (_super) {
        __extends(Preprocessor, _super);
        function Preprocessor(cfg) {
            _super.call(this, cfg);
            this.errors = 0;
            this.enableElevationWarning = true;
        }
        Preprocessor.prototype.reset = function () {
            this.variables = {};
            this.functions = [];
            this.currentVariable = null;
            this.functionDeclarations = {};
            this.mixinDeclarations = {};
            this.registeredDeclarations = null;
        };
        Preprocessor.prototype.handleFunc = function (func, collection) {
            var name = Fashion.getJsName(func.id || func.value), parameters = Preprocessor.getFunctionCallArgs(func);
            collection[name] = {
                parameters: parameters
            };
        };
        Preprocessor.prototype.Mixin = function (node) {
            this.handleFunc(node.name, this.mixinDeclarations);
            node.descend(this);
        };
        Preprocessor.prototype.Function = function (node) {
            var isGlobal = this.nodeStack.length == 1;
            if (isGlobal) {
                this.functions.push(node);
            }
            this.handleFunc(node.func, this.functionDeclarations);
            node.descend(this);
        };
        Preprocessor.prototype.Variable = function (node) {
            if (this.currentVariable) {
                this.currentVariable.references.push(Fashion.getJsName(node.name));
            }
        };
        Preprocessor.prototype.Comment = function (comment) {
            if (comment === '//# fashion warn -elevation') {
                this.enableElevationWarning = false;
            }
            else if (comment === '//# fashion warn +elevation') {
                this.enableElevationWarning = true;
            }
        };
        Preprocessor.prototype.VariableAssignment = function (node) {
            var name = Fashion.getJsName(node.name), currVariable = this.variables[name], varWas = this.currentVariable, bangGlobal = !!node.global, bangDynamic = !!node.dynamic, bangDefault = !!node.default, isGlobalVar = this.nodeStack.length === 1, variable, value, funcName;
            if (!isGlobalVar && !bangGlobal) {
                return false;
            }
            if (!!node.dynamic) {
                Fashion.warn("Use of !dynamic has been deprecated", node);
                Fashion.warn("Use dynamic() function instead.");
            }
            //if(node.docs && node.docs.length) {
            //    for (var d = 0; d < node.docs.length; d++) {
            //        var doc = node.docs[d];
            //
            //        if (doc.indexOf('//#') === 0) {
            //            if(doc.indexOf('//#') === 0) {
            //                doc = doc.substring(3);
            //            }
            //
            //            if(doc.indexOf('//') === 0) {
            //                doc = doc.substring(2);
            //            }
            //
            //            if (doc.indexOf('/*') === 0) {
            //                doc = doc.substring(2, doc.length - 3);
            //            }
            //
            //            doc = doc.trim();
            //
            //            if (doc.indexOf('!dynamic') === 0) {
            //                bangDynamic = true;
            //            }
            //        }
            //    }
            //}
            value = node.value;
            if (value.type === 'FunctionCall') {
                funcName = value.id || value.value;
                if (funcName === 'dynamic') {
                    bangDynamic = true;
                    value.visitTarget = value.args;
                    if (value.args.items && value.args.items.length === 1) {
                        value.visitTarget = value.args.items[0];
                    }
                }
            }
            variable = this.variables[name] = new SassVariable({
                name: name,
                node: node,
                previous: currVariable,
                attributes: {
                    global: bangGlobal,
                    "default": bangDefault,
                    dynamic: bangDynamic
                },
                isGlobal: isGlobalVar,
                dynamic: (currVariable && currVariable.dynamic) || bangDynamic,
                map: this.variables,
                preprocessor: this,
                enableElevationWarning: this.enableElevationWarning
            });
            variable.verify();
            this.currentVariable = variable;
            node.descend(this);
            this.currentVariable = varWas;
        };
        Preprocessor.prototype.getRuntime = function () {
            return this.runtime;
        };
        Preprocessor.prototype.getRegisteredFunctions = function () {
            if (!this.registeredFunctions) {
                this.registeredFunctions =
                    (this.runtime && this.runtime.getRegisteredFunctions()) || {};
            }
            return this.registeredFunctions;
        };
        Preprocessor.prototype.loadRegisteredFunctionArgs = function () {
            if (!this.registeredDeclarations) {
                var registered = this.getRegisteredFunctions(), funcArgsRx = /function\s*?(.*?)\((.*?)\)\s*?\{/, paramsMap = {}, name, func, src, params, match, args, i, argName;
                for (name in registered) {
                    func = registered[name];
                    if (Fashion.isFunction(func)) {
                        src = func + '';
                        params = [];
                        if (funcArgsRx.test(src)) {
                            match = funcArgsRx.exec(src);
                            args = (match[2] && match[2].split(/,/g)) || [];
                            for (i = 0; i < args.length; i++) {
                                argName = args[i].trim();
                                params.push({
                                    name: argName,
                                    position: i
                                });
                            }
                        }
                        paramsMap[name] = params;
                    }
                }
                this.registeredDeclarations = paramsMap;
            }
        };
        Preprocessor.prototype.preprocess = function (node, skipRegistrations) {
            this.reset();
            this.visit(node);
            if (!skipRegistrations) {
                this.loadRegisteredFunctionArgs();
            }
            if (this.errors) {
                Fashion.raise([
                    'Encountered ',
                    this.errors,
                    ' error(s) during preprocessing.'
                ].join(''));
            }
        };
        Preprocessor.prototype.getVariables = function () {
            return this.variables;
        };
        Preprocessor.prototype.generateCycleError = function (stack, variables) {
            var referenceTrace = [], r, trace;
            for (r = 0; r < stack.length; r++) {
                trace = [
                    stack[r],
                    " => ",
                    variables[stack[r]].node.file,
                    ":",
                    variables[stack[r]].node.lineNumber
                ].join('');
                referenceTrace.push(trace);
            }
            var msg = [
                "Variable Cycle detected in variable : ",
                referenceTrace.join('\n')
            ].join('\n');
            Fashion.error(msg);
            Fashion.raise(msg);
        };
        Preprocessor.prototype.topoSort = function (variable, variables, sorted, processed, stack) {
            processed = processed || {};
            sorted = sorted || [];
            stack = stack || [];
            var name = variable.name, refs, ref, r, refVariable;
            if (processed[name] !== true) {
                stack.push(name);
                if (processed[name] === 'processing') {
                    this.generateCycleError(stack, variables);
                }
                processed[name] = 'processing';
                refs = variable.references;
                for (r = 0; r < refs.length; r++) {
                    ref = refs[r];
                    refVariable = variables[ref];
                    if (!refVariable) {
                        Fashion.raiseAt('Reference to undeclared variable : ' + ref + ' at ', variable.node);
                    }
                    this.topoSort(refVariable, variables, sorted, processed, stack);
                }
                sorted.push(variable);
                processed[name] = true;
                stack.pop();
            }
        };
        Preprocessor.prototype.getDynamics = function () {
            var variables = this.getVariables(), variableNames = Object.keys(variables), dynamics = [], sorted = [], variable, name, dynamic, d, n;
            // push the dynamic flag to all variables referenced
            for (n = 0; n < variableNames.length; n++) {
                name = variableNames[n];
                variable = variables[name];
                if (variable.dynamic) {
                    variable.elevateDynamics(dynamics);
                    dynamics.push(variable);
                }
            }
            for (d = 0; d < dynamics.length; d++) {
                dynamic = dynamics[d];
                this.topoSort(dynamic, variables, sorted);
            }
            return sorted;
        };
        Preprocessor.prototype.getDynamicsMap = function () {
            var dynamicVariables = this.getDynamics(), map = {}, i, variable;
            for (i = 0; i < dynamicVariables.length; i++) {
                variable = dynamicVariables[i];
                map[variable.name] = variable;
            }
            return map;
        };
        Preprocessor.prototype.getSortedDynamicAstNodes = function () {
            var sortedVariables = this.getDynamics(), sortedAst = [], i;
            for (i = 0; i < sortedVariables.length; i++) {
                sortedAst.push(sortedVariables[i].getNode());
            }
            return sortedAst;
        };
        Preprocessor.prototype.loadPreprocessorCache = function (preprocessor) {
            this.functionDeclarations = preprocessor.functionDeclarations;
            this.mixinDeclarations = preprocessor.mixinDeclarations;
            this.registeredDeclarations = preprocessor.registeredDeclarations;
            this.registeredFunctions = preprocessor.registeredFunctions;
        };
        Preprocessor.loadArgsArray = function (args) {
            if (args && (args.type === 'SelectorList' || args.type === 'List')) {
                args = args.items;
            }
            if (!Array.isArray(args)) {
                args = [args];
            }
            return args;
        };
        Preprocessor.getFunctionCallArgs = function (func) {
            var args = this.loadArgsArray(func.args), parameters = [], arg, a;
            for (a = 0; a < args.length; a++) {
                arg = args[a];
                if (arg) {
                    parameters.push({
                        name: arg.variable || arg.name,
                        value: arg,
                        position: a,
                        varArgs: arg.varArgs
                    });
                }
            }
            return parameters;
        };
        return Preprocessor;
    }(Fashion.Visitor));
    Fashion.Preprocessor = Preprocessor;
})(Fashion || (Fashion = {}));
///<reference path="../../Base.ts"/>
var Fashion;
(function (Fashion) {
    var parse;
    (function (parse) {
        var BaseNode = (function () {
            function BaseNode(cfg) {
                if (cfg) {
                    Fashion.apply(this, cfg);
                }
            }
            BaseNode.prototype.doVisit = function (visitor) { };
            BaseNode.prototype.descend = function (visitor) { };
            return BaseNode;
        }());
        parse.BaseNode = BaseNode;
        Fashion.apply(BaseNode.prototype, {
            visitTarget: undefined
        });
    })(parse = Fashion.parse || (Fashion.parse = {}));
})(Fashion || (Fashion = {}));
///<reference path="BaseNode.ts"/>
var Fashion;
(function (Fashion) {
    var parse;
    (function (parse) {
        var Each = (function (_super) {
            __extends(Each, _super);
            function Each(cfg) {
                _super.call(this, cfg);
            }
            Each.prototype.doVisit = function (visitor) {
                visitor.Each(this);
            };
            Each.prototype.descend = function (visitor) {
                visitor.visit(this.list);
                visitor.visit(this.statements);
            };
            return Each;
        }(parse.BaseNode));
        parse.Each = Each;
        Fashion.apply(Each.prototype, {
            type: 'Each'
        });
        var For = (function (_super) {
            __extends(For, _super);
            function For(cfg) {
                _super.call(this, cfg);
            }
            For.prototype.doVisit = function (visitor) {
                visitor.For(this);
            };
            For.prototype.descend = function (visitor) {
                visitor.visit(this.start);
                visitor.visit(this.end);
                visitor.visit(this.statements);
            };
            return For;
        }(parse.BaseNode));
        parse.For = For;
        Fashion.apply(For.prototype, {
            type: 'For'
        });
        var While = (function (_super) {
            __extends(While, _super);
            function While(cfg) {
                _super.call(this, cfg);
            }
            While.prototype.doVisit = function (visitor) {
                visitor.While(this);
            };
            While.prototype.descend = function (visitor) {
                visitor.visit(this.condition);
                visitor.visit(this.statements);
            };
            return While;
        }(parse.BaseNode));
        parse.While = While;
        Fashion.apply(While.prototype, {
            type: 'While'
        });
        var Charset = (function (_super) {
            __extends(Charset, _super);
            function Charset(cfg) {
                _super.call(this, cfg);
            }
            Charset.prototype.doVisit = function (visitor) {
                visitor.Charset(this);
            };
            return Charset;
        }(parse.BaseNode));
        parse.Charset = Charset;
        Fashion.apply(Charset.prototype, {
            type: 'Charset'
        });
        var Function = (function (_super) {
            __extends(Function, _super);
            function Function(cfg) {
                _super.call(this, cfg);
            }
            Function.prototype.doVisit = function (visitor) {
                visitor.Function(this);
            };
            Function.prototype.descend = function (visitor) {
                visitor.visit(this.func);
                visitor.visit(this.statements);
            };
            return Function;
        }(parse.BaseNode));
        parse.Function = Function;
        Fashion.apply(Function.prototype, {
            type: 'Function'
        });
        var Ruleset = (function (_super) {
            __extends(Ruleset, _super);
            function Ruleset(cfg) {
                _super.call(this, cfg);
            }
            Ruleset.prototype.doVisit = function (visitor) {
                visitor.Ruleset(this);
            };
            Ruleset.prototype.descend = function (visitor) {
                visitor.visit(this.selectors);
                visitor.visit(this.statements);
            };
            return Ruleset;
        }(parse.BaseNode));
        parse.Ruleset = Ruleset;
        Fashion.apply(Ruleset.prototype, {
            type: 'Ruleset'
        });
        var Mixin = (function (_super) {
            __extends(Mixin, _super);
            function Mixin(cfg) {
                _super.call(this, cfg);
            }
            Mixin.prototype.doVisit = function (visitor) {
                visitor.Mixin(this);
            };
            Mixin.prototype.descend = function (visitor) {
                visitor.visit(this.name);
                visitor.visit(this.statements);
            };
            return Mixin;
        }(parse.BaseNode));
        parse.Mixin = Mixin;
        Fashion.apply(Mixin.prototype, {
            type: 'Mixin'
        });
        var Block = (function (_super) {
            __extends(Block, _super);
            function Block(cfg) {
                _super.call(this, cfg);
            }
            Block.prototype.doVisit = function (visitor) {
                visitor.Block(this);
            };
            Block.prototype.descend = function (visitor) {
                visitor.visit(this.statements);
            };
            return Block;
        }(parse.BaseNode));
        parse.Block = Block;
        Fashion.apply(Block.prototype, {
            type: 'Block'
        });
        var Include = (function (_super) {
            __extends(Include, _super);
            function Include(cfg) {
                _super.call(this, cfg);
            }
            Include.prototype.doVisit = function (visitor) {
                visitor.Include(this);
            };
            Include.prototype.descend = function (visitor) {
                visitor.visit(this.include);
                this.content && visitor.visit(this.content);
            };
            return Include;
        }(parse.BaseNode));
        parse.Include = Include;
        Fashion.apply(Include.prototype, {
            type: 'Include'
        });
        var Assignment = (function (_super) {
            __extends(Assignment, _super);
            function Assignment(cfg) {
                _super.call(this, cfg);
            }
            Assignment.prototype.doVisit = function (visitor) {
                visitor.Assignment(this);
            };
            Assignment.prototype.descend = function (visitor) {
                visitor.visit(this.expr);
            };
            return Assignment;
        }(parse.BaseNode));
        parse.Assignment = Assignment;
        Fashion.apply(Assignment.prototype, {
            type: 'Assignment'
        });
        var Declaration = (function (_super) {
            __extends(Declaration, _super);
            function Declaration(cfg) {
                _super.call(this, cfg);
            }
            Declaration.prototype.doVisit = function (visitor) {
                visitor.Declaration(this);
            };
            Declaration.prototype.descend = function (visitor) {
                visitor.visit(this.value);
            };
            return Declaration;
        }(parse.BaseNode));
        parse.Declaration = Declaration;
        Fashion.apply(Declaration.prototype, {
            type: 'Declaration'
        });
        var VariableAssignment = (function (_super) {
            __extends(VariableAssignment, _super);
            function VariableAssignment(cfg) {
                _super.call(this, cfg);
            }
            VariableAssignment.prototype.doVisit = function (visitor) {
                visitor.VariableAssignment(this);
            };
            VariableAssignment.prototype.descend = function (visitor) {
                visitor.visit(this.value);
            };
            return VariableAssignment;
        }(parse.BaseNode));
        parse.VariableAssignment = VariableAssignment;
        Fashion.apply(VariableAssignment.prototype, {
            type: 'VariableAssignment'
        });
        var If = (function (_super) {
            __extends(If, _super);
            function If(cfg) {
                _super.call(this, cfg);
            }
            If.prototype.doVisit = function (visitor) {
                visitor.If(this);
            };
            If.prototype.descend = function (visitor) {
                visitor.visit(this.condition);
                visitor.visit(this.statements);
            };
            return If;
        }(parse.BaseNode));
        parse.If = If;
        Fashion.apply(If.prototype, {
            type: 'If'
        });
        var Else = (function (_super) {
            __extends(Else, _super);
            function Else(cfg) {
                _super.call(this, cfg);
            }
            Else.prototype.doVisit = function (visitor) {
                visitor.Else(this);
            };
            Else.prototype.descend = function (visitor) {
                visitor.visit(this.condition);
                visitor.visit(this.statements);
            };
            return Else;
        }(parse.BaseNode));
        parse.Else = Else;
        Fashion.apply(Else.prototype, {
            type: 'Else'
        });
        var Return = (function (_super) {
            __extends(Return, _super);
            function Return(cfg) {
                _super.call(this, cfg);
            }
            Return.prototype.doVisit = function (visitor) {
                visitor.Return(this);
            };
            Return.prototype.descend = function (visitor) {
                visitor.visit(this.expr);
            };
            return Return;
        }(parse.BaseNode));
        parse.Return = Return;
        Fashion.apply(Return.prototype, {
            type: 'Return'
        });
        var Parenthetical = (function (_super) {
            __extends(Parenthetical, _super);
            function Parenthetical(cfg) {
                _super.call(this, cfg);
            }
            Parenthetical.prototype.doVisit = function (visitor) {
                visitor.ParentheticalExpression(this);
            };
            Parenthetical.prototype.descend = function (visitor) {
                visitor.visit(this.expr);
            };
            return Parenthetical;
        }(parse.BaseNode));
        parse.Parenthetical = Parenthetical;
        Fashion.apply(Parenthetical.prototype, {
            type: 'Parenthetical'
        });
        var SelectorPart = (function (_super) {
            __extends(SelectorPart, _super);
            function SelectorPart(cfg) {
                _super.call(this, cfg);
            }
            SelectorPart.prototype.doVisit = function (visitor) {
                visitor.SelectorPart(this);
            };
            SelectorPart.prototype.descend = function (visitor) {
                visitor.visit(this.value);
            };
            return SelectorPart;
        }(parse.BaseNode));
        parse.SelectorPart = SelectorPart;
        Fashion.apply(SelectorPart.prototype, {
            type: 'SelectorPart'
        });
        var SelectorProperty = (function (_super) {
            __extends(SelectorProperty, _super);
            function SelectorProperty(cfg) {
                _super.call(this, cfg);
            }
            SelectorProperty.prototype.doVisit = function (visitor) {
                visitor.SelectorProperty(this);
            };
            SelectorProperty.prototype.descend = function (visitor) {
                visitor.visit(this.property);
                visitor.visit(this.value);
            };
            return SelectorProperty;
        }(parse.BaseNode));
        parse.SelectorProperty = SelectorProperty;
        Fashion.apply(SelectorProperty.prototype, {
            type: 'SelectorProperty'
        });
        var CompoundSelector = (function (_super) {
            __extends(CompoundSelector, _super);
            function CompoundSelector(cfg) {
                _super.call(this, cfg);
            }
            CompoundSelector.prototype.doVisit = function (visitor) {
                visitor.CompoundSelector(this);
            };
            CompoundSelector.prototype.descend = function (visitor) {
                visitor.visit(this.items);
            };
            return CompoundSelector;
        }(parse.BaseNode));
        parse.CompoundSelector = CompoundSelector;
        Fashion.apply(CompoundSelector.prototype, {
            type: 'CompoundSelector'
        });
        var MultiPartSelector = (function (_super) {
            __extends(MultiPartSelector, _super);
            function MultiPartSelector(cfg) {
                _super.call(this, cfg);
            }
            MultiPartSelector.prototype.doVisit = function (visitor) {
                visitor.MultiPartSelector(this);
            };
            MultiPartSelector.prototype.descend = function (visitor) {
                visitor.visit(this.items);
            };
            return MultiPartSelector;
        }(parse.BaseNode));
        parse.MultiPartSelector = MultiPartSelector;
        Fashion.apply(MultiPartSelector.prototype, {
            type: 'MultiPartSelector'
        });
        var SelectorList = (function (_super) {
            __extends(SelectorList, _super);
            function SelectorList(cfg) {
                _super.call(this, cfg);
            }
            SelectorList.prototype.doVisit = function (visitor) {
                visitor.SelectorList(this);
            };
            SelectorList.prototype.descend = function (visitor) {
                visitor.visit(this.items);
            };
            return SelectorList;
        }(parse.BaseNode));
        parse.SelectorList = SelectorList;
        Fashion.apply(SelectorList.prototype, {
            type: 'SelectorList'
        });
        var BinaryExpression = (function (_super) {
            __extends(BinaryExpression, _super);
            function BinaryExpression(cfg) {
                _super.call(this, cfg);
            }
            BinaryExpression.prototype.doVisit = function (visitor) {
                visitor.BinaryExpression(this);
            };
            BinaryExpression.prototype.descend = function (visitor) {
                visitor.visit(this.left);
                visitor.visit(this.right);
            };
            return BinaryExpression;
        }(parse.BaseNode));
        parse.BinaryExpression = BinaryExpression;
        Fashion.apply(BinaryExpression.prototype, {
            type: 'BinaryExpression'
        });
        var UnaryExpression = (function (_super) {
            __extends(UnaryExpression, _super);
            function UnaryExpression(cfg) {
                _super.call(this, cfg);
            }
            UnaryExpression.prototype.doVisit = function (visitor) {
                visitor.UnaryExpression(this);
            };
            UnaryExpression.prototype.descend = function (visitor) {
                visitor.visit(this.expr);
            };
            return UnaryExpression;
        }(parse.BaseNode));
        parse.UnaryExpression = UnaryExpression;
        Fashion.apply(UnaryExpression.prototype, {
            type: 'UnaryExpression'
        });
        var Variable = (function (_super) {
            __extends(Variable, _super);
            function Variable(cfg) {
                _super.call(this, cfg);
            }
            Variable.prototype.doVisit = function (visitor) {
                visitor.Variable(this);
            };
            return Variable;
        }(parse.BaseNode));
        parse.Variable = Variable;
        Fashion.apply(Variable.prototype, {
            type: 'Variable'
        });
        var Constant = (function (_super) {
            __extends(Constant, _super);
            function Constant(cfg) {
                _super.call(this, cfg);
            }
            Constant.prototype.doVisit = function (visitor) {
                visitor.Constant(this);
            };
            return Constant;
        }(parse.BaseNode));
        parse.Constant = Constant;
        Fashion.apply(Constant.prototype, {
            type: 'Constant'
        });
        var FunctionCall = (function (_super) {
            __extends(FunctionCall, _super);
            function FunctionCall(cfg) {
                _super.call(this, cfg);
            }
            FunctionCall.prototype.doVisit = function (visitor) {
                visitor.FunctionCall(this);
            };
            FunctionCall.prototype.descend = function (visitor) {
                visitor.visit(this.args);
            };
            return FunctionCall;
        }(parse.BaseNode));
        parse.FunctionCall = FunctionCall;
        Fashion.apply(FunctionCall.prototype, {
            type: 'FunctionCall'
        });
        var Extend = (function (_super) {
            __extends(Extend, _super);
            function Extend(cfg) {
                _super.call(this, cfg);
            }
            Extend.prototype.doVisit = function (visitor) {
                visitor.Extend(this);
            };
            return Extend;
        }(parse.BaseNode));
        parse.Extend = Extend;
        Fashion.apply(Extend.prototype, {
            type: 'Extend'
        });
        var List = (function (_super) {
            __extends(List, _super);
            function List(cfg) {
                _super.call(this, cfg);
            }
            List.prototype.doVisit = function (visitor) {
                visitor.List(this);
            };
            List.prototype.descend = function (visitor) {
                visitor.visit(this.items);
            };
            return List;
        }(parse.BaseNode));
        parse.List = List;
        Fashion.apply(List.prototype, {
            type: 'List'
        });
        var Warn = (function (_super) {
            __extends(Warn, _super);
            function Warn(cfg) {
                _super.call(this, cfg);
            }
            Warn.prototype.doVisit = function (visitor) {
                visitor.Warn(this);
            };
            return Warn;
        }(parse.BaseNode));
        parse.Warn = Warn;
        Fashion.apply(Warn.prototype, {
            type: 'Warn'
        });
        var Debug = (function (_super) {
            __extends(Debug, _super);
            function Debug(cfg) {
                _super.call(this, cfg);
            }
            Debug.prototype.doVisit = function (visitor) {
                visitor.Debug(this);
            };
            Debug.prototype.descend = function (visitor) {
                visitor.visit(this.expr);
            };
            return Debug;
        }(parse.BaseNode));
        parse.Debug = Debug;
        Fashion.apply(Debug.prototype, {
            type: 'Debug'
        });
        var Import = (function (_super) {
            __extends(Import, _super);
            function Import(cfg) {
                _super.call(this, cfg);
            }
            Import.prototype.doVisit = function (visitor) {
                visitor.Import(this);
            };
            return Import;
        }(parse.BaseNode));
        parse.Import = Import;
        Fashion.apply(Import.prototype, {
            type: 'Import'
        });
        var Require = (function (_super) {
            __extends(Require, _super);
            function Require(cfg) {
                _super.call(this, cfg);
            }
            Require.prototype.doVisit = function (visitor) {
                visitor.Require(this);
            };
            Require.prototype.descend = function (visitor) {
                visitor.visit(this.source);
            };
            return Require;
        }(parse.BaseNode));
        parse.Require = Require;
        Fashion.apply(Require.prototype, {
            type: 'Require'
        });
        var Content = (function (_super) {
            __extends(Content, _super);
            function Content(cfg) {
                _super.call(this, cfg);
            }
            Content.prototype.doVisit = function (visitor) {
                visitor.Content(this);
            };
            return Content;
        }(parse.BaseNode));
        parse.Content = Content;
        Fashion.apply(Content.prototype, {
            type: 'Content'
        });
        var Debugger = (function (_super) {
            __extends(Debugger, _super);
            function Debugger(cfg) {
                _super.call(this, cfg);
            }
            Debugger.prototype.doVisit = function (visitor) {
                visitor.Debugger(this);
            };
            return Debugger;
        }(parse.BaseNode));
        parse.Debugger = Debugger;
        Fashion.apply(Debugger.prototype, {
            type: 'Debugger'
        });
    })(parse = Fashion.parse || (Fashion.parse = {}));
})(Fashion || (Fashion = {}));
///<reference path="NameConverter.ts"/>
///<reference path="Output.ts"/>
///<reference path="Visitor.ts"/>
///<reference path="parse/Parser.ts"/>
///<reference path="type/Color.ts"/>
///<reference path="Preprocessor.ts"/>
///<reference path="parse/ast/Nodes.ts"/>
var Fashion;
(function (Fashion) {
    var StringCache = (function () {
        function StringCache() {
            this.array = [];
            this.map = {};
        }
        StringCache.prototype.addString = function (string) {
            var idx = this.map[string];
            if (typeof idx === 'undefined') {
                idx = this.array.length;
                this.array.push(string);
                this.map[string] = idx;
            }
            return idx;
        };
        StringCache.prototype.get = function (id) {
            return this.array[id];
        };
        return StringCache;
    }());
    Fashion.StringCache = StringCache;
    var DocCache = (function () {
        function DocCache() {
            this.array = [];
        }
        DocCache.prototype.addDocs = function (docs) {
            var idx = this.array.length;
            this.array.push(docs);
            return idx;
        };
        DocCache.prototype.get = function (id) {
            return this.array[id];
        };
        return DocCache;
    }());
    Fashion.DocCache = DocCache;
    var Transpiler = (function (_super) {
        __extends(Transpiler, _super);
        function Transpiler() {
            _super.apply(this, arguments);
            this.errors = 0;
            this.warnings = 0;
            this.loadArgsArray = Fashion.Preprocessor.loadArgsArray;
            this.colors = Fashion.Color.map;
            this.booleans = {
                'true': true,
                'false': true
            };
            this.nativeCssMethods = {
                'url': true,
                'translate3d': true,
                'rotate': true,
                'scale': true,
                '-webkit-gradient': true,
                'from': true,
                'skew': true,
                'color-stop': true,
                'rect': true,
                'calc': true
            };
        }
        Transpiler.prototype.reset = function () {
            this.output = new Fashion.Output();
            this.currentScope = { __suffix: '' };
            this.globalScope = this.currentScope;
            this.globalVars = {};
            this.errors = 0;
            this.warnings = 0;
            this.stringCache = new StringCache();
            this.docCache = new DocCache();
        };
        Transpiler.prototype.createScope = function (parent) {
            parent = parent || this.currentScope;
            var scope = Fashion.chain(parent);
            scope.__suffix = scope.__suffix + '$';
            return scope;
        };
        Transpiler.prototype.getScopeName = function (name, scope) {
            //scope = scope || this.currentScope;
            //
            //if(scope.hasOwnProperty(name)) {
            //    return scope[name];
            //}
            return Fashion.getJsName(name);
        };
        Transpiler.prototype.getVariableName = function (node) {
            return node.variable || node.name || node.value || node;
        };
        Transpiler.prototype.handleInlineExpression = function (expr) {
            try {
                var outwas = this.output, output = new Fashion.Output(), parser = new Fashion.parse.Parser(), tree;
                if (this.isSelector) {
                    parser.scanner = new Fashion.parse.Scanner(expr);
                    tree = parser.parseSequence();
                }
                else {
                    tree = parser.parse('$foobar: ' + expr + ';');
                    tree = tree[0].value;
                }
                this.output = output;
                this.handleStatement(tree);
                this.output = outwas;
                return output.get().trim();
            }
            catch (error) {
                Fashion.log("failed to evaluate inline expression : " + expr);
                throw error;
            }
        };
        Transpiler.prototype.handleInlineExpressions = function (text, start) {
            text = text + '';
            start = start || 0;
            var out = [], level = 0, outwas, i, ch, ch2;
            outer: for (i = start; i < text.length; i++) {
                ch = text.charAt(i);
                ch2 = (i < text.length - 1)
                    ? text.charAt(i + 1)
                    : undefined;
                switch (ch) {
                    case '\\':
                        if (!outwas) {
                            out.push('\\\\');
                        }
                        else {
                            out.push(ch);
                        }
                        break;
                    case '"':
                        if (!outwas) {
                            out.push('\\"');
                        }
                        else {
                            out.push(ch);
                        }
                        break;
                    case '#':
                        if (ch2 === '{') {
                            level++;
                            if (level < 2) {
                                outwas = out;
                                out = [];
                                i++;
                            }
                            else {
                                out.push(ch);
                            }
                        }
                        else {
                            out.push(ch);
                        }
                        break;
                    case '}':
                        level--;
                        if (!level) {
                            outwas.push('" + __rt.unquote(');
                            outwas.push(this.handleInlineExpression(out.join('')));
                            outwas.push(') + "');
                            out = outwas;
                            outwas = undefined;
                        }
                        else {
                            out.push(ch);
                        }
                        break;
                    default:
                        out.push(ch);
                        break;
                }
            }
            return out.join('');
        };
        Transpiler.prototype.handleStatements = function (statements) {
            this.visit(statements);
        };
        Transpiler.prototype.handleStatement = function (statement) {
            if (statement && statement.hasOwnProperty('visitTarget')) {
                statement = statement.visitTarget;
                if (statement && Array.isArray(statement)) {
                    this.handleStatements(statement);
                }
            }
            if (statement) {
                if (statement instanceof Array) {
                    statement = new Fashion.parse.List({
                        items: statement,
                        separator: ','
                    });
                }
                this.visit(statement);
            }
        };
        Transpiler.prototype.createDefaultScopeMap = function (args, isMixin) {
            args = this.loadArgsArray(args);
            var output = this.output, defaulted = 0, arg, a, varName, jsName, name;
            this.isSignatureDeclaration = true;
            this.generateGets = true;
            for (a = 0; a < args.length; a++) {
                arg = args[a];
                if (arg) {
                    varName = (arg.variable || arg.name);
                    name = varName;
                    jsName = this.getScopeName(varName);
                    this.currentScope[jsName] = jsName;
                    varName = jsName;
                    if (arg.varArgs) {
                        output.addln(varName + ' = __rt.sliceArgs(arguments, ' +
                            (isMixin ? a + 1 : a) +
                            ');');
                        defaulted++;
                    }
                    else if (arg.type !== 'Variable' || arg.variable !== undefined) {
                        output.addln('var ' + varName + ' = ' + varName + ' || ');
                        this.handleStatement(arg);
                        output.add(';');
                        defaulted++;
                    }
                    else {
                        output.addln('var ' + varName + ' = ' + varName + ' || Fashion.Null;');
                    }
                    output.addln('__rt.set("' + jsName + '", ' + varName + ', true);');
                }
            }
            this.generateGets = false;
            this.isSignatureDeclaration = false;
            return defaulted;
        };
        Transpiler.prototype.getRegisteredDeclarationsMap = function (declaredParameters) {
            var map = {}, param;
            for (var d = 0; d < declaredParameters.length; d++) {
                param = declaredParameters[d];
                map[param.name] = param;
            }
            return map;
        };
        Transpiler.prototype.createCallArray = function (args, defaults, id, convertName, addComma) {
            args = this.loadArgsArray(args);
            if (defaults.parameters) {
                defaults = defaults.parameters;
            }
            var me = this, output = me.output, len = args.length > defaults.length ? args.length : defaults.length, declaredMap = me.getRegisteredDeclarationsMap(defaults), actual = new Array(len), arg, a, position;
            for (var a = 0; a < args.length; a++) {
                arg = args[a];
                position = a;
                if (arg && arg.variable) {
                    var argName = arg.variable;
                    if (convertName) {
                        if (argName.indexOf("$") == 0) {
                            argName = argName.substr(1);
                        }
                        argName = argName.replace(/\-/g, '_');
                    }
                    if (!declaredMap[argName]) {
                        var params = [];
                        for (var pName in declaredMap) {
                            params.push(pName);
                        }
                        Fashion.warn("function or mixin '" + id + "' had no parameter named " + argName + " : params were : " + params.join(", "));
                    }
                    else {
                        position = declaredMap[argName].position;
                    }
                }
                actual[position] = arg;
            }
            for (a = 0; a < actual.length; a++) {
                arg = actual[a];
                if (addComma || (a > 0)) {
                    output.add(',');
                    output.space();
                }
                if (arg) {
                    output.addln();
                    if (arg.varArgs) {
                        output.add('__rt.applySplat(');
                        me.handleStatement(arg);
                        output.add(')');
                    }
                    else {
                        me.handleStatement(arg);
                    }
                }
                else {
                    output.addln("__udf");
                }
            }
            return actual.length;
        };
        Transpiler.prototype.escapeString = function (str) {
            return str && str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        };
        //<editor-fold desc="visitor methods">
        Transpiler.prototype.Each = function (statement) {
            var _this = this;
            if (statement.isMap) {
                var me = this, output = me.output, arg = statement.variable, names = statement.variable.items;
                me.eachCount = me.eachCount || 1;
                var jsNames = Fashion.convert(names, function (name) { return me.getScopeName(name); }), jsItrName = '__each_itr_' + me.eachCount, jsListName = '__each__list';
                names.forEach(function (name, i) { return _this.currentScope[jsNames[i]] = jsNames[i]; });
                output.addln("var " + jsListName + " = ");
                me.handleStatement(statement.list);
                output.add(";");
                output.addln("for(var " + jsItrName + " = 0; " + jsItrName + " < " + jsListName + ".items.length - 1; " + jsItrName + "+=2) {");
                output.indent();
                output.addln('__rt.set("' + jsNames[0] + '", ' + jsListName + ".items[" + jsItrName + "]);");
                output.addln('__rt.set("' + jsNames[1] + '", ' + jsListName + ".items[" + jsItrName + " + 1]);");
                me.handleStatements(statement.statements);
                output.unindentln("}");
            }
            else {
                var me = this, output = me.output, arg = statement.variable, name = me.getVariableName(arg), jsName = me.getScopeName(name), jsListName = jsName + "__list", jsItrName = jsName + "__itr";
                this.currentScope[jsItrName] = jsItrName;
                this.currentScope[jsListName] = jsListName;
                this.currentScope[jsName] = jsName;
                output.addln("var " + jsListName + " = ");
                me.handleStatement(statement.list);
                output.add(";");
                output.addln("for(var " + jsItrName + " = 0; " + jsItrName + " < " + jsListName + ".items.length; " + jsItrName + "++) {");
                output.indent();
                output.addln('__rt.set("' + jsName + '", ' + jsListName + ".items[" + jsItrName + "]);");
                me.handleStatements(statement.statements);
                output.unindentln("}");
            }
            return false;
        };
        Transpiler.prototype.For = function (statement) {
            var me = this, output = me.output, arg = statement.variable, name = me.getVariableName(arg), jsName = me.getScopeName(name), jsItrName = jsName + "__itr";
            this.currentScope[jsName] = jsName;
            output.addln('for(var ' + jsItrName + ' = __rt.unbox(');
            me.handleStatement(statement.start);
            output.add('); ' + jsItrName + ' < (__rt.unbox(');
            me.handleStatement(statement.end);
            output.add(')');
            if (!!statement.inclusive) {
                output.add(' + 1');
            }
            output.add('); ' + jsItrName + '++){');
            output.indent();
            output.addln('var ' + jsName + ' = ' + jsItrName);
            output.addln('__rt.set("' + jsName + '", ' + jsItrName + ', true);');
            me.handleStatements(statement.statements);
            output.unindentln('};');
            return false;
        };
        Transpiler.prototype.While = function (statement) {
            var output = this.output;
            output.addln("while(__rt.unbox(");
            this.handleStatement(statement.condition);
            output.add(")) {");
            output.indent();
            this.handleStatements(statement.statements);
            output.unindentln("};");
            return false;
        };
        Transpiler.prototype.Function = function (statement) {
            var me = this, output = me.output, func = statement.func, jsName = Fashion.getJsName(func.id || func.value);
            if (jsName === 'dynamic') {
                me.error("Cannot define function named 'dynamic'", statement);
            }
            if (jsName === 'require') {
                me.error("Cannot define function named 'require'", statement);
            }
            me.nestedDocs = true;
            var scopeWas = me.currentScope;
            me.currentScope = me.createScope();
            output.addln('function ' + jsName + '__fn(');
            var args = me.loadArgsArray(func.args || []);
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                var varName = (arg.variable || arg.name);
                varName = me.getScopeName(varName);
                if (i > 0) {
                    output.add(',');
                    output.space();
                }
                output.add(varName);
            }
            output.add(') {');
            output.indent();
            // load the defaults
            output.addln('__rt.createScope(__rt.functions.' + jsName + ' && __rt.functions.' + jsName + '.createdScope);');
            me.createDefaultScopeMap(func.args);
            this.popScope = true;
            // Handle all the statements within this function
            if (statement.statements.length) {
                me.handleStatements(statement.statements);
            }
            me.currentScope = scopeWas;
            if (this.popScope) {
                output.addln("__rt.popScope();");
                this.popScope = false;
            }
            output.unindentln('};');
            output.addln('__rt.functions.' + jsName + ' = ' + jsName + '__fn;');
            output.addln('__rt.functions.' + jsName + '.createdScope = __rt.getCurrentScope();');
            me.nestedDocs = false;
            return false;
        };
        Transpiler.prototype.Ruleset = function (statement, fnName) {
            fnName = fnName || '__rt.ruleset';
            var me = this, output = me.output, isGlobal = me.nodeStack.length === 1, newScope = false, docIdx = -1, blockDocIdx = -1, hasBlock = !!statement.statements;
            output.addln(fnName + '(');
            this.isSelector = statement.selectors;
            this.handleStatement(statement.selectors);
            this.isSelector = null;
            if (statement.file) {
                var fileIdx = this.stringCache.addString(statement.file);
                output.add(",__rt.getString(" + fileIdx + ") + \":" + statement.lineNumber + "\"");
            }
            else {
                output.add(', null');
            }
            if (statement.docs && statement.docs.length) {
                docIdx = this.docCache.addDocs(statement.docs);
                output.add(',__rt.getDocs(' + docIdx + ')');
            }
            else {
                output.add(', null');
            }
            if (statement.blockDocs && statement.blockDocs.length) {
                blockDocIdx = this.docCache.addDocs(statement.blockDocs);
                output.add(',__rt.getDocs(' + blockDocIdx + ')');
            }
            else {
                output.add(', null');
            }
            output.add(', ' + hasBlock);
            output.add(");");
            if (isGlobal && Fashion.Runtime.uniqueScopesForGlobalRulesets) {
                newScope = true;
            }
            if (Fashion.Runtime.uniqueScopesForAllRulesets) {
                newScope = true;
            }
            if (newScope) {
                var scopeWas = me.currentScope;
                me.currentScope = me.createScope();
                output.addln("__rt.createScope();");
                me.handleStatements(statement.statements);
                output.addln("__rt.popScope();");
                me.currentScope = scopeWas;
            }
            else {
                me.handleStatements(statement.statements);
            }
            output.addln("__rt.rulesetDone();");
            me.nestedDocs = false;
        };
        Transpiler.prototype.Mixin = function (statement) {
            var me = this, output = me.output, name = statement.name, jsName = Fashion.getJsName(name.id || name.value), args, arg, varName, scopeWas, i;
            me.nestedDocs = true;
            me.processingMixin = true;
            scopeWas = me.currentScope;
            me.currentScope = me.createScope();
            output.addln('__rt.mixins.' + jsName + '= function(');
            args = me.loadArgsArray(name.args || []);
            output.add('$$content');
            for (i = 0; i < args.length; i++) {
                arg = args[i];
                varName = (arg.variable || arg.name);
                varName = me.getScopeName(varName);
                output.add(',');
                output.space();
                output.add(varName);
            }
            output.add(') {');
            output.indent();
            // load the defaults
            output.addln('__rt.createScope(__rt.mixins.' + jsName + ' && __rt.mixins.' + jsName + '.createdScope);');
            me.createDefaultScopeMap(name.args, true);
            me.handleStatements(statement.statements);
            me.currentScope = scopeWas;
            output.addln("__rt.popScope();");
            output.unindentln('};');
            output.addln('__rt.mixins.' + jsName + '.createdScope = __rt.getCurrentScope();');
            me.nestedDocs = false;
            me.processingMixin = false;
            return false;
        };
        Transpiler.prototype.Content = function (statement) {
            if (!this.processingMixin) {
                this.error("@content may only be used within a mixin declaration");
            }
            this.output.addln("$$content && $$content();");
            return false;
        };
        Transpiler.prototype.Include = function (statement) {
            var me = this, output = me.output, include = statement.include, id = include.id || include.value, jsId = Fashion.getJsName(id), args = me.loadArgsArray(include.args || []);
            if (!me.mixinDeclarations[jsId]) {
                me.error("unknown definition for mixin named " + id + " : " + statement.file + ":" + statement.lineNumber);
            }
            else {
                output.addln('(__rt.mixins.' + jsId + ' || ' + jsId + '__mix).apply(__rt.mixins, __rt.applySplatArgs([');
                output.indent();
                if (statement.content) {
                    output.addln('(function(scope) { return function(){');
                    output.indent();
                    output.addln("__rt.createScope(scope);");
                    me.handleStatements(statement.content.statements);
                    output.addln("__rt.popScope();");
                    output.unindent();
                    output.addln("}})(__rt.getCurrentScope())");
                }
                else {
                    output.add('__udf');
                }
                me.createCallArray(args, me.mixinDeclarations[jsId], id, false, true);
                output.unindent();
                output.add(']));');
            }
            return false;
        };
        Transpiler.prototype.Declaration = function (statement) {
            var me = this, output = me.output, namespacedRulesets = [], props = [], separator = ' ', docIdx = -1, val = statement.value, i, nsRuleset;
            if (val.type === 'List') {
                separator = val.separator;
                val = val.items;
            }
            else if (!Array.isArray(val)) {
                val = [val];
            }
            for (i = 0; i < val.length; i++) {
                var prop = val[i];
                if (prop.type !== 'Ruleset') {
                    props.push(prop);
                }
                else {
                    namespacedRulesets.push(prop);
                }
            }
            if (props.length) {
                output.addln('__rt.declare("' + me.handleInlineExpressions(statement.property) + '", ');
                if (statement.property === 'font') {
                    me.isFontDecl = statement;
                }
                me.handleStatement(new Fashion.parse.List({
                    separator: separator,
                    items: props
                }));
                output.add(',');
                output.space();
                output.add(!!statement.important + '');
                if (statement.file) {
                    var fileIdx = this.stringCache.addString(statement.file);
                    output.add(",__rt.getString(" + fileIdx + ") + \":" + statement.lineNumber + "\"");
                }
                else {
                    output.add(', null');
                }
                if (statement.docs && statement.docs.length) {
                    docIdx = this.docCache.addDocs(statement.docs);
                    output.add(',__rt.getDocs(' + docIdx + ')');
                }
                else {
                    output.add(', null');
                }
                output.add(');');
            }
            if (namespacedRulesets.length) {
                for (i = 0; i < namespacedRulesets.length; i++) {
                    nsRuleset = namespacedRulesets[i];
                    nsRuleset.selectors = new Fashion.parse.SelectorList({
                        items: [new Fashion.parse.Constant({
                                dataType: 'Literal',
                                value: statement.property
                            })],
                        separator: ', '
                    });
                    me.Ruleset(nsRuleset, '__rt.namespacedRuleset');
                    delete nsRuleset.selectors;
                }
            }
            me.isFontDecl = undefined;
            return false;
        };
        Transpiler.prototype.VariableAssignment = function (statement) {
            var me = this, output = me.output, name = statement.name, bangGlobal = !!statement.global ? 1 : 0, bangDynamic = !!statement.dynamic ? 1 : 0, bangDefault = !!statement.default ? 1 : 0, isGlobalVar = me.nodeStack.length === 1 ? 1 : 0, jsName = me.getScopeName(name), exists = (jsName in me.currentScope), createLocal = me.currentScope.hasOwnProperty(jsName) ? 0 : 1, variable = me.dynamicVariables[jsName], failDynamicAssignment = false, processed = me.processedVariables, prefix;
            if (bangDynamic && !isGlobalVar) {
                failDynamicAssignment = true;
            }
            if (!bangDynamic && variable && !isGlobalVar && (me.currentScope === me.globalScope)) {
                // cannot reassign dynamic vars inside control logic
                failDynamicAssignment = true;
            }
            if (bangGlobal && !bangDynamic && !isGlobalVar && variable) {
                // cannot reassign dynamic vars inside control logic using !global
                failDynamicAssignment = true;
            }
            if (failDynamicAssignment) {
                this.error(["Dynamic variable ",
                    name,
                    " can only be assigned at file scope "
                ].join(''));
                Fashion.error('  at ', statement);
                var v = variable;
                while (v && v.elevationCause) {
                    Fashion.error([
                        '\t',
                        v.name,
                        ' elevated by ',
                        v.elevationCause.name,
                        ' at '
                    ].join(''), v.elevationCause.getNode());
                    v = v.elevationCause;
                }
            }
            if (isGlobalVar && variable && processed[jsName]) {
                return false;
            }
            if (exists) {
                if (bangGlobal) {
                    createLocal = 0;
                }
                else if (Fashion.Runtime.allowSetScopedVariables && !variable) {
                    // do not allow re-assingments of dynamic variables
                    // from a non-global scope
                    createLocal = 0;
                }
            }
            else if (bangGlobal) {
                createLocal = 0;
            }
            if (createLocal) {
                me.currentScope[jsName] = jsName;
            }
            else if (bangGlobal) {
                jsName = me.getScopeName(name, me.globalScope);
            }
            if (isGlobalVar) {
                me.globalScope[jsName] = jsName;
            }
            output.addln('__rt.set("' + jsName + '", ');
            me.handleStatement(statement.value);
            output.add(', ' + createLocal + ', ' + bangGlobal + ', ' + bangDefault + ', __dyn);');
            if (variable) {
                processed[jsName] = true;
            }
            return false;
        };
        Transpiler.prototype.If = function (statement) {
            var output = this.output;
            output.addln('if(__rt.unbox(');
            this.handleStatement(statement.condition);
            output.add(')) {');
            output.indent();
            this.handleStatements(statement.statements);
            output.unindentln('}');
            return false;
        };
        Transpiler.prototype.Else = function (statement) {
            var output = this.output;
            if (statement.condition) {
                output.addln('else if(__rt.unbox(');
                this.handleStatement(statement.condition);
                output.add(')) {');
                output.indent();
            }
            else {
                output.indentln('else {');
            }
            this.handleStatements(statement.statements);
            output.unindentln('}');
            return false;
        };
        Transpiler.prototype.Return = function (statement) {
            var isFunc = false, stack = this.nodeStack;
            for (var i = stack.length - 1; i >= 0; i--) {
                if (stack[i].type == 'Function') {
                    isFunc = true;
                    break;
                }
            }
            if (isFunc) {
                this.popScope = false;
                this.output.addln('var $$$r = ');
                this.handleStatement(statement.expr);
                this.output.add(';');
                this.output.addln("__rt.popScope();");
                this.output.addln('return $$$r;');
            }
            else {
                Fashion.warn('Ingnored @return => ', statement);
            }
            return false;
        };
        Transpiler.prototype.BinaryExpression = function (statement) {
            var me = this, output = me.output, suffix = '';
            if ((statement.operator == '-' || statement.operator == '+') && statement.left === undefined) {
                statement.left = new Fashion.parse.Constant({
                    dataType: 'Number',
                    value: 0
                });
            }
            var divider = ', ';
            switch (statement.operator) {
                case '+':
                case '-':
                case '*':
                case '%':
                case '**':
                case '==':
                case '!=':
                case '>':
                case '<':
                case '>=':
                case '<=':
                    output.add('__rt.operate("' + statement.operator + '", ');
                    break;
                case 'and':
                    output.add('__rt.unbox(');
                    divider = ') && __rt.unbox(';
                    break;
                case 'or':
                    output.add('__rt.box(__rt.unbox(');
                    divider = ') || __rt.unbox(';
                    suffix = ')';
                    break;
                case '/':
                    var doOperator = true, isDeclaration = false, isParenthetical = false, isFunctionCall = false, stack = this.nodeStack, parent;
                    for (var p = stack.length - 1; p >= 0; p--) {
                        parent = stack[p];
                        switch (parent.type) {
                            case 'Declaration':
                                isDeclaration = true;
                                break;
                            case 'ParentheticalExpression':
                                isParenthetical = true;
                                break;
                            case 'FunctionCall':
                                isFunctionCall = true;
                            default:
                                break;
                        }
                    }
                    doOperator = (!isDeclaration || !me.isFontDecl || isParenthetical || isFunctionCall);
                    if (!doOperator) {
                        output.add('new Fashion.Literal(');
                        me.handleStatement(statement.left);
                        output.add(' + "/" + ');
                        me.handleStatement(statement.right);
                        output.add(')');
                        return false;
                    }
                    else {
                        output.add('__rt.operate("' + statement.operator + '", ');
                    }
                    break;
                default:
                    Fashion.log('Unrecognized binary expression operator: ' + statement.operator);
                    break;
            }
            me.handleStatement(statement.left);
            output.add(divider);
            me.handleStatement(statement.right);
            output.add(')');
            output.add(suffix);
            return false;
        };
        Transpiler.prototype.UnaryExpression = function (statement) {
            var output = this.output;
            switch (statement.operator) {
                case 'not':
                    output.add('__rt.not(');
                    this.handleStatement(statement.expr);
                    output.add(')');
                    break;
                default:
                    Fashion.log('Unrecognized unary expression operator ' + statement.operator);
            }
            return false;
        };
        Transpiler.prototype.Variable = function (statement) {
            var name = statement.name, jsName = this.getScopeName(name);
            if (!this.skipWarning && !(jsName in this.currentScope) && !(jsName in this.variables)) {
                this.warn([
                    "Reference to undeclared variable ",
                    name,
                    " => ",
                    statement.file,
                    ":",
                    statement.lineNumber
                ].join(''));
            }
            this.output.add('__rt.get("' + jsName + '")');
            return false;
        };
        Transpiler.prototype.Constant = function (statement) {
            var me = this, output = me.output, value = statement.value, regex;
            value = me.handleInlineExpressions(value);
            switch (statement.dataType) {
                case 'Length':
                case 'Time':
                case 'Angle':
                    regex = /([0-9\.\-]+)([\w]+)$/i;
                    value = value.match(regex);
                    output.add('new Fashion.Numeric(' + value[1] + ', ' + '"' + value[2] + '")');
                    break;
                case 'Number':
                    var s = value + '';
                    if (s.indexOf(".") === 0) {
                        s = '0' + s;
                    }
                    value = s;
                    output.add('new Fashion.Numeric(' + value + ')');
                    break;
                case 'Percentage':
                    var s = value + '';
                    if (s.indexOf(".") === 0) {
                        s = '0' + s;
                    }
                    value = s;
                    output.add('new Fashion.Numeric(' + value.replace('%', '').replace(/\\/g, "") + ', "%")');
                    break;
                case 'String':
                    output.add('new Fashion.Text("' + value + '", "' + me.escapeString(statement.quoteChar) + '")');
                    break;
                case 'Literal':
                    if (me.booleans.hasOwnProperty(value.toLowerCase())) {
                        if (value.toLowerCase() === 'true') {
                            output.add('Fashion.True');
                        }
                        else {
                            output.add('Fashion.False');
                        }
                    }
                    else if (me.colors.hasOwnProperty(value.toLowerCase())) {
                        output.add('__rt.color("' + value + '")');
                    }
                    else if (value == 'null') {
                        output.add('Fashion.Null');
                    }
                    else if (value == 'none') {
                        output.add('Fashion.None');
                    }
                    else {
                        output.add('new Fashion.Literal("' + value + '")');
                    }
                    break;
                case 'Color':
                    output.add('Fashion.ColorRGBA.fromHex("' + value + '")');
                    break;
                default:
                    //Fashion.log(statement.dataType, value);
                    output.add('"' + value + '"');
            }
            return false;
        };
        Transpiler.prototype.FunctionCall = function (statement) {
            var me = this, output = me.output, args = statement.args, id = statement.id || statement.value, jsId, reserved = {
                'if': true,
                'else': true
            };
            id = reserved[id] ? '__' + id : id;
            jsId = Fashion.getJsName(id);
            if (jsId === '__if') {
                var args = me.loadArgsArray(statement.args), skipWarning = this.skipWarning;
                output.add("(__rt.unbox(");
                me.handleStatement(args[0]);
                output.add(") ? ");
                this.skipWarning = true;
                me.handleStatement(args[1]);
                output.add(" : ");
                me.handleStatement(args[2]);
                output.add(")");
                this.skipWarning = skipWarning;
            }
            else if (me.functionDeclarations[jsId]) {
                output.add('__rt.box((__rt.functions.' + jsId + ' || ' + jsId + '__fn).apply(__rt.functions, __rt.applySplatArgs([');
                output.indent();
                me.createCallArray(statement.args, me.functionDeclarations[jsId], id);
                output.unindent();
                output.add('])))');
            }
            else if (me.registeredDeclarations[jsId]) {
                output.add('__rt.box(__rt.registered.' + jsId + '.apply(__rt.registered, __rt.applySplatArgs([');
                output.indent();
                me.createCallArray(statement.args, me.registeredDeclarations[jsId], id, true);
                output.unindent();
                output.add('])))');
            }
            else {
                args = this.loadArgsArray(args);
                output.add('new Fashion.FunctionCall("');
                output.add(me.handleInlineExpressions(id));
                output.add('", new Fashion.List([');
                output.indent();
                output.addln();
                for (var a = 0; a < args.length; a++) {
                    var arg = args[a];
                    me.handleStatement(arg);
                    if (a < (args.length - 1)) {
                        output.add(',');
                        output.space();
                    }
                }
                output.unindentln('], ","))');
            }
            return false;
        };
        Transpiler.prototype.Extend = function (statement) {
            this.output.addln('__rt.extendSelector(');
            this.handleStatement(statement.selector);
            this.output.add(');');
            return false;
        };
        Transpiler.prototype.ParentheticalExpression = function (statement) {
            if (this.isSelector) {
                this.output.addln('new Fashion.ParentheticalExpression(');
                this.handleStatement(statement.expr);
                this.output.add(')');
            }
            else {
                this.handleStatement(statement.expr);
            }
            return false;
        };
        Transpiler.prototype.List = function (statement) {
            var output = this.output, isMap = false;
            if (statement.items.length && statement.items[0].isKVP) {
                isMap = true;
            }
            if (!isMap) {
                output.add('new Fashion.List([');
                for (var i = 0; i < statement.items.length; i++) {
                    var item = statement.items[i];
                    this.handleStatement(item);
                    if (i < (statement.items.length - 1)) {
                        output.add(',');
                        output.space();
                    }
                }
                output.add('], "' + statement.separator + '")');
            }
            else {
                output.add('new Fashion.Map([');
                for (var i = 0; i < statement.items.length; i++) {
                    var item = statement.items[i];
                    this.handleStatement(item.variable);
                    output.add(',');
                    output.space();
                    this.handleStatement(item);
                    if (i < (statement.items.length - 1)) {
                        output.add(',');
                        output.space();
                    }
                }
                output.add('])');
            }
            return false;
        };
        Transpiler.prototype.Warn = function (statement) {
            // ignore
            this.output.addln("Fashion.warn(__rt.unbox(");
            this.handleStatement(statement.expr);
            this.output.add('));');
            return false;
        };
        Transpiler.prototype.Debugger = function (statement) {
            this.output.addln("debugger;");
            return false;
        };
        Transpiler.prototype.Import = function (statement) {
            var _this = this;
            var me = this, output = me.output, source = statement.source;
            if ((source.type === 'List' || source.type === 'SelectorList') && source.separator && source.separator.indexOf(',') === 0) {
                source = source.items;
            }
            else {
                source = [source];
            }
            this.isSelector = statement.source;
            source.forEach(function (source) {
                if (source) {
                    output.addln('__rt.addDirectiveRuleset("@import", ');
                    if (source.type === 'MultiPartSelector' && source.items.length === 1) {
                        source = source.items[0];
                    }
                    if (source && source.type === 'CompoundSelector' && source.items.length === 1) {
                        source = source.items[0];
                    }
                    if (!source.type || source.dataType === 'String' || source.dataType === 'Literal') {
                        if (!source.type) {
                            source = new Fashion.parse.Constant({
                                value: source,
                                dataType: 'String',
                                quoteChar: '"'
                            });
                        }
                        if (source.value.indexOf('http://') !== 0 &&
                            source.value.indexOf('//') !== 0) {
                            source = new Fashion.parse.FunctionCall({
                                id: 'url',
                                args: [new Fashion.parse.FunctionCall({
                                        id: 'unquote',
                                        args: [
                                            source
                                        ]
                                    })]
                            });
                        }
                        _this.handleStatement(source);
                    }
                    else {
                        _this.handleStatement(source);
                    }
                    output.add(');');
                }
            });
            this.isSelector = null;
            return false;
        };
        Transpiler.prototype.Require = function (statement) {
            return false;
        };
        Transpiler.prototype.Assignment = function (statement) {
            this.output.addln('new Fashion.Literal(["');
            this.output.add(this.handleInlineExpressions(statement.id));
            this.output.add(statement.operator + '", ');
            this.handleStatement(statement.expr);
            this.output.add('].join(""))');
            return false;
        };
        Transpiler.prototype.Debug = function (statement) {
            this.output.addln("Fashion.debug(__rt.unbox(");
            this.handleStatement(statement.expr);
            this.output.add("));");
        };
        Transpiler.prototype.Charset = function (statement) {
            //var output = this.output;
            //if (statement.charset) {
            //    output.addln('__rt.addDirectiveRuleset("@charset", \'');
            //    output.add('"' + statement.charset + '"');
            //    output.add('\');');
            //}
            return false;
        };
        Transpiler.prototype.SelectorPart = function (statement) {
            var output = this.output;
            output.add('new Fashion.SelectorPart(');
            this.handleStatement(statement.value);
            output.add(', "' + statement.selectorType + '")');
            return false;
        };
        Transpiler.prototype.CompoundSelector = function (statement) {
            var output = this.output;
            output.add('new Fashion.CompoundSelector([');
            for (var i = 0; i < statement.items.length; i++) {
                var item = statement.items[i];
                this.handleStatement(item);
                if (i < (statement.items.length - 1)) {
                    output.add(',');
                    output.space();
                }
            }
            output.add('], true)');
            return false;
        };
        Transpiler.prototype.MultiPartSelector = function (statement) {
            var output = this.output;
            output.add('new Fashion.MultiPartSelector([');
            for (var i = 0; i < statement.items.length; i++) {
                var item = statement.items[i];
                this.handleStatement(item);
                if (i < (statement.items.length - 1)) {
                    output.add(',');
                    output.space();
                }
            }
            output.add('])');
            return false;
        };
        Transpiler.prototype.SelectorList = function (statement) {
            var output = this.output;
            output.add('new Fashion.SelectorList([');
            for (var i = 0; i < statement.items.length; i++) {
                var item = statement.items[i];
                this.handleStatement(item);
                if (i < (statement.items.length - 1)) {
                    output.add(',');
                    output.space();
                }
            }
            output.add('])');
            return false;
        };
        Transpiler.prototype.SelectorProperty = function (statement) {
            var output = this.output;
            output.add('new Fashion.SelectorProperty(');
            this.handleStatement(statement.property);
            output.add(', ');
            this.handleStatement(statement.value);
            output.add(')');
            return false;
        };
        Transpiler.prototype.Default = function (statement) {
            this.warn('Unrecognized statement type: ' + statement.type + " , " + JSON.stringify(statement, null, 4));
        };
        //</editor-fold>
        Transpiler.prototype.error = function (message, data) {
            Fashion.error(message, data);
            this.errors++;
        };
        Transpiler.prototype.warn = function (message, data) {
            Fashion.warn(message, data);
            this.warnings++;
        };
        Transpiler.prototype.transpile = function (ast, disableGetter) {
            var me = this, preprocessor = this.preprocessor, sortedAst;
            me.reset();
            if (!preprocessor) {
                preprocessor = new Fashion.Preprocessor();
                preprocessor.preprocess(ast);
            }
            me.functionDeclarations = preprocessor.functionDeclarations;
            me.mixinDeclarations = preprocessor.mixinDeclarations;
            me.registeredDeclarations = preprocessor.registeredDeclarations;
            me.variables = preprocessor.getVariables();
            me.dynamicVariables = preprocessor.getDynamicsMap();
            me.processedVariables = {};
            sortedAst = preprocessor.getSortedDynamicAstNodes();
            if (Array.isArray(ast)) {
                sortedAst.push.apply(sortedAst, ast);
            }
            else {
                sortedAst.push(ast);
            }
            me.nestedDocs = false;
            me.handleStatements(sortedAst);
            if (me.warnings) {
                Fashion.warn("Sass compilation encountered " + me.warnings + " warning(s)");
            }
            if (me.errors) {
                Fashion.raise("Sass compilation encountered " + me.errors + " error(s)");
            }
            return me.output.get().trim();
        };
        return Transpiler;
    }(Fashion.Visitor));
    Fashion.Transpiler = Transpiler;
})(Fashion || (Fashion = {}));
///<reference path="../Type.ts"/>
///<reference path="../List.ts"/>
///<reference path="../../Output.ts"/>
///<reference path="../../Transpiler.ts"/>
var Fashion;
(function (Fashion) {
    var BaseSelector = (function (_super) {
        __extends(BaseSelector, _super);
        function BaseSelector() {
            _super.apply(this, arguments);
            this.$canUnbox = false;
        }
        BaseSelector.prototype.clone = function (match, replace) {
            if (match && match === this.toString()) {
                return replace.clone();
            }
            var cloned = _super.prototype.clone.call(this);
            if (this.parent) {
                cloned.setParent(this.parent.clone(match, replace));
            }
            return cloned;
        };
        BaseSelector.prototype.hasHash = function (hash) {
            return this.toString() === hash;
        };
        BaseSelector.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        return BaseSelector;
    }(Fashion.Type));
    Fashion.BaseSelector = BaseSelector;
    var BaseSelectorPart = (function (_super) {
        __extends(BaseSelectorPart, _super);
        function BaseSelectorPart() {
            _super.apply(this, arguments);
        }
        return BaseSelectorPart;
    }(BaseSelector));
    Fashion.BaseSelectorPart = BaseSelectorPart;
    var SelectorProperty = (function (_super) {
        __extends(SelectorProperty, _super);
        function SelectorProperty(property, value) {
            _super.call(this);
            this.property = property;
            this.value = value;
        }
        SelectorProperty.prototype.toString = function () {
            return this.property.toString() + ": " + this.value.toString();
        };
        SelectorProperty.prototype.doVisit = function (visitor) {
            visitor.selectorproperty(this);
        };
        SelectorProperty.prototype.descend = function (visitor) {
            this.value && visitor.visit(this.value);
        };
        return SelectorProperty;
    }(BaseSelectorPart));
    Fashion.SelectorProperty = SelectorProperty;
    Fashion.apply(SelectorProperty.prototype, {
        type: 'selectorproperty'
    });
    var BaseSelectorList = (function (_super) {
        __extends(BaseSelectorList, _super);
        function BaseSelectorList(items, separator) {
            _super.call(this);
            this.items = items;
            this.separator = separator;
        }
        BaseSelectorList.prototype.toString = function () {
            return this.items.join(this.separator);
        };
        BaseSelectorList.prototype.cloneItems = function (match, replace) {
            var cloned = [];
            for (var i = 0; i < this.items.length; i++) {
                cloned.push(this.items[i].clone(match, replace));
            }
            return cloned;
        };
        BaseSelectorList.prototype.unquote = function () {
            var items = [];
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i]) {
                    items.push(this.items[i].unquote());
                }
            }
            return new Fashion.List(items, this.separator);
        };
        BaseSelectorList.prototype.getHash = function () {
            var items = [];
            this.items.forEach(function (i) { return items.push((i && i.getHash()) || ''); });
            items = items.sort();
            return items.join(this.separator);
        };
        return BaseSelectorList;
    }(BaseSelector));
    Fashion.BaseSelectorList = BaseSelectorList;
    Fashion.mixin(BaseSelectorList, Fashion.BaseSet);
    function parseSelectors(selector) {
        return new Fashion.Builder().getContext().parseSelectors(selector);
    }
    Fashion.parseSelectors = parseSelectors;
})(Fashion || (Fashion = {}));
///<reference path="Selectors.ts"/>
var Fashion;
(function (Fashion) {
    var SelectorPart = (function (_super) {
        __extends(SelectorPart, _super);
        function SelectorPart(value, type) {
            _super.call(this);
            this.value = value;
            this.selectorType = type;
        }
        SelectorPart.prototype.doVisit = function (visitor) {
            visitor.selector(this);
        };
        SelectorPart.prototype.descend = function (visitor) {
            this.value && visitor.visit(this.value);
        };
        SelectorPart.prototype.toString = function () {
            switch (this.selectorType) {
                case 'placeholder':
                    return '%' + this.value.toString();
                case 'dash':
                    return '-' + this.value.toString();
                case 'attribute':
                    return '[' + this.value.toString() + ']';
                case 'pseudo':
                    return ':' + this.value.toString();
                default:
                    return this.value.toString();
            }
        };
        SelectorPart.prototype.clone = function (match, replace) {
            if (match && match === this.toString()) {
                return replace.clone();
            }
            var cloned = new SelectorPart(this.value, this.selectorType);
            if (this.parent) {
                cloned.setParent(this.parent.clone(match, replace));
            }
            return cloned;
        };
        SelectorPart.prototype.getTypePriority = function () {
            switch (this.selectorType) {
                case 'class':
                    return 0;
                case 'id':
                    return 1;
                case 'pseudo':
                    var str = this.value.toString();
                    if (str.indexOf(":") === 0) {
                        return 21;
                    }
                    if (str.indexOf('not') === 0) {
                        return 19;
                    }
                    return 20;
                case 'attribute':
                    return 0;
                case 'placeholder':
                    return -100;
                default:
                    return -50;
            }
        };
        return SelectorPart;
    }(Fashion.BaseSelector));
    Fashion.SelectorPart = SelectorPart;
    Fashion.apply(SelectorPart.prototype, {
        type: 'selector',
        $isFashionSelectorPart: true
    });
})(Fashion || (Fashion = {}));
///<reference path="Selectors.ts"/>
///<reference path="SelectorPart.ts"/>
var Fashion;
(function (Fashion) {
    var CompoundSelector = (function (_super) {
        __extends(CompoundSelector, _super);
        function CompoundSelector(items, preserve) {
            _super.call(this);
            this._superSelectorMap = {};
            this.items = items;
            this.preserve = preserve;
        }
        CompoundSelector.prototype.doVisit = function (visitor) {
            visitor.compoundselector(this);
        };
        CompoundSelector.prototype.descend = function (visitor) {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item && visitor.visit(item);
            }
        };
        CompoundSelector.prototype.cloneItems = function (match, replace) {
            var cloned = [];
            for (var i = 0; i < this.items.length; i++) {
                cloned.push(this.items[i].clone(match, replace));
            }
            return cloned;
        };
        CompoundSelector.prototype.clone = function (match, replace) {
            if (match && match === this.toString()) {
                return replace.clone();
            }
            var cloned = new CompoundSelector(this.cloneItems(match, replace));
            if (this.parent) {
                cloned.setParent(this.parent.clone(match, replace));
            }
            return cloned;
        };
        CompoundSelector.prototype.toString = function () {
            return this.items.join('');
        };
        CompoundSelector.prototype.hasPlaceholder = function () {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item instanceof Fashion.SelectorPart) {
                    if (item.selectorType === 'placeholder') {
                        return true;
                    }
                }
            }
            if (this.parent) {
                var parent = this.parent;
                return parent.hasPlaceholder && parent.hasPlaceholder();
            }
            return false;
        };
        CompoundSelector.prototype.flatten = function () {
            if (!this.flattened) {
                this.flattened = true;
                var flattened = [], map = {};
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item instanceof CompoundSelector) {
                        var sel = item, selItems = sel.flatten() && sel.items;
                        for (var s = 0; s < selItems.length; s++) {
                            var sItem = selItems[s];
                            sItem.position = flattened.length;
                            if (!map[sItem.toString()]) {
                                flattened.push(sItem);
                                map[sItem.toString()] = true;
                            }
                        }
                    }
                    else if (item instanceof Fashion.BaseSelectorList) {
                        var list = item;
                        if (list.items.length == 1) {
                            var sItem = list.items[0];
                            sItem.position = flattened.length;
                            if (!map[sItem.toString()]) {
                                flattened.push(sItem);
                                map[sItem.toString()] = true;
                            }
                        }
                        else {
                            item.position = flattened.length;
                            if (!map[sItem.toString()]) {
                                flattened.push(sItem);
                                map[sItem.toString()] = true;
                            }
                        }
                    }
                    else {
                        var sItem = item;
                        sItem.position = flattened.length;
                        if (!map[sItem.toString()] || item instanceof Fashion.Literal || item instanceof Fashion.Numeric) {
                            flattened.push(sItem);
                            map[sItem.toString()] = true;
                        }
                    }
                }
                this.items = flattened;
            }
            return this;
        };
        CompoundSelector.prototype.sort = function () {
            if (!this.sorted) {
                this.sorted = true;
                this.flatten();
                this.items.sort(function (a, b) {
                    var aIsPart = (a instanceof Fashion.SelectorPart), bIsPart = (b instanceof Fashion.SelectorPart), aIsSelector = (a instanceof Fashion.BaseSelector), bIsSelector = (b instanceof Fashion.BaseSelector), aVal = a.toString(), bVal = b.toString(), aPart, bPart;
                    if (bIsSelector) {
                        if (!aIsSelector) {
                            if (a instanceof Fashion.Literal) {
                                if (a.toString().indexOf('-') === 0) {
                                    return 1;
                                }
                            }
                            if (!CompoundSelector.excludeSortOps[bVal]) {
                                return -1;
                            }
                        }
                        if (bIsPart) {
                            if (!aIsPart) {
                                return -1;
                            }
                            aPart = a;
                            bPart = b;
                            var res = aPart.getTypePriority() - bPart.getTypePriority();
                            if (res === 0) {
                                return aPart.position - bPart.position;
                            }
                            return res;
                        }
                        else {
                            if (aIsPart) {
                                return 1;
                            }
                        }
                    }
                    else if (aIsSelector) {
                        if (!CompoundSelector.excludeSortOps[aVal]) {
                            return 1;
                        }
                    }
                    else if (b instanceof Fashion.Literal) {
                    }
                    return a.position - b.position;
                });
            }
            return this;
        };
        CompoundSelector.prototype.base = function () {
            var first = this.first();
            if (first instanceof Fashion.Literal) {
                return first;
            }
            if (first instanceof Fashion.SelectorPart) {
                if (first.selectorType === 'wildcard') {
                    return first;
                }
            }
            return null;
        };
        CompoundSelector.prototype.getHash = function () {
            var base = this.base(), rest = this.rest(), parts = [];
            rest.forEach(function (r) { return parts.push(r.getHash()); });
            parts = parts.sort();
            if (base) {
                parts.unshift(base.getHash());
            }
            return parts.join('');
        };
        CompoundSelector.prototype.rest = function () {
            var base = this.base();
            return Fashion.filter(this.items, function (item) { return base ? item !== base : true; });
        };
        CompoundSelector.prototype.isSuperSelector = function (selector) {
            var key = selector, map = this._superSelectorMap, result = map[key];
            if (result === undefined) {
                result = this.isSubset(selector);
                map[key] = result;
            }
            return result;
        };
        /**
         * returns:
         *  1 == this is subset of other
         * -1 == other is subset of this
         *  0 == different
         */
        CompoundSelector.prototype.isSubset = function (selector) {
            var items = this.items, sItems = selector.items, longItemMap = {}, shortList = items, longList = sItems, item, res = 1;
            if (items.length > sItems.length) {
                shortList = sItems;
                longList = items;
                res = -1;
            }
            for (var i = 0; i < longList.length; i++) {
                item = longList[i];
                longItemMap[item.toString()] = item;
            }
            for (var i = 0; i < shortList.length; i++) {
                item = shortList[i];
                if (!longItemMap[item.toString()]) {
                    return 0;
                }
            }
            return res;
        };
        CompoundSelector.excludeSortOps = {
            '&': true,
            '*': true,
            '~': true,
            '>': true,
            '|': true,
            '+': true
        };
        return CompoundSelector;
    }(Fashion.BaseSelectorPart));
    Fashion.CompoundSelector = CompoundSelector;
    Fashion.mixin(CompoundSelector, Fashion.BaseSet);
    Fashion.apply(CompoundSelector.prototype, {
        type: 'compoundselector',
        $isFashionCompoundSelector: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
///<reference path="Selectors.ts"/>
///<reference path="CompoundSelector.ts"/>
var Fashion;
(function (Fashion) {
    var MultiPartSelector = (function (_super) {
        __extends(MultiPartSelector, _super);
        function MultiPartSelector(items, parent) {
            _super.call(this, items, ' ');
            this._superSelectorMap = {};
            if (parent) {
                this.setParent(parent);
            }
        }
        MultiPartSelector.prototype.doVisit = function (visitor) {
            visitor.multipartselector(this);
        };
        MultiPartSelector.prototype.descend = function (visitor) {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item && visitor.visit(item);
            }
        };
        MultiPartSelector.prototype.clone = function (match, replace) {
            if (match && match === this.toString()) {
                return replace.clone();
            }
            var cloned = new MultiPartSelector(this.cloneItems(match, replace));
            if (this.parent) {
                cloned.setParent(this.parent.clone(match, replace));
            }
            cloned.skipParentPrepend = this.skipParentPrepend;
            return cloned;
        };
        /**
         * returns:
         *  1 == this isSuperSelector of other
         * -1 == other isSuperSelector of this
         *  0 == different
         */
        MultiPartSelector.prototype.calcIsSuperSelector = function (selector) {
            var items = this.items, sItems = selector.items, shortList = items, longList = sItems, res = 1, tmpRes;
            if (items.length > sItems.length) {
                shortList = sItems;
                longList = items;
                res = -1;
            }
            if (this.parent) {
                if (!selector.parent) {
                    return 0;
                }
                tmpRes = this.parent.isSuperSelector(selector.parent);
                if (res !== tmpRes) {
                    return 0;
                }
            }
            else if (selector.parent) {
                return 0;
            }
            for (var i = 0; i < shortList.length; i++) {
                //tmpRes = shortList[i].isSuperSelector(longList[i]);
                var tmpRes;
                if (tmpRes === 0) {
                    return 0;
                }
                else if (tmpRes !== res) {
                    return 0;
                }
            }
            return res;
        };
        MultiPartSelector.prototype.isSuperSelector = function (selector) {
            var key = selector, map = this._superSelectorMap, result = map[key];
            if (result === undefined) {
                result = this.calcIsSuperSelector(selector);
                map[key] = result;
            }
            return result;
        };
        MultiPartSelector.prototype.removeAtRoot = function () {
            var items = Fashion.filter(this.items, function (item) {
                return item.toString() !== '@at-root';
            });
            if (items.length) {
                this.items = items;
                return this;
            }
            return null;
        };
        return MultiPartSelector;
    }(Fashion.BaseSelectorList));
    Fashion.MultiPartSelector = MultiPartSelector;
    Fashion.apply(MultiPartSelector.prototype, {
        type: 'multipartselector'
    });
})(Fashion || (Fashion = {}));
///<reference path="Selectors.ts"/>
///<reference path="MultiPartSelector.ts"/>
var Fashion;
(function (Fashion) {
    var SelectorList = (function (_super) {
        __extends(SelectorList, _super);
        function SelectorList(list) {
            _super.call(this, list, ',');
        }
        SelectorList.prototype.doVisit = function (visitor) {
            visitor.selectorlist(this);
        };
        SelectorList.prototype.descend = function (visitor) {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item && visitor.visit(item);
            }
        };
        SelectorList.prototype.clone = function (match, replace) {
            var cloned = new SelectorList(this.cloneItems());
            if (this.parent) {
                cloned.setParent(this.parent.clone(match, replace));
            }
            return cloned;
        };
        SelectorList.prototype.applyInterpolations = function () {
            if (!this.interpolated) {
                this.interpolated = true;
                var interpolated = [], selectors = this.items, selector, str, parsedSelectors, items, item, i;
                for (var s = 0; s < selectors.length; s++) {
                    selector = selectors[s];
                    str = selector.toString();
                    if (str.indexOf(',') === -1) {
                        interpolated.push(selector);
                    }
                    else {
                        parsedSelectors = Fashion.parseSelectors(str);
                        items = parsedSelectors.items;
                        for (i = 0; i < items.length; i++) {
                            item = items[i];
                            interpolated.push(item);
                        }
                    }
                }
                this.items = interpolated;
            }
        };
        return SelectorList;
    }(Fashion.BaseSelectorList));
    Fashion.SelectorList = SelectorList;
    Fashion.apply(SelectorList.prototype, {
        type: 'selectorlist'
    });
    Fashion.EmptySelectorList = new SelectorList({});
})(Fashion || (Fashion = {}));
///<reference path="Type.ts"/>
///<reference path="Declaration.ts"/>
///<reference path="selectors/SelectorList.ts"/>
var Fashion;
(function (Fashion) {
    var Ruleset = (function (_super) {
        __extends(Ruleset, _super);
        function Ruleset(cfg) {
            _super.call(this);
            this.children = [];
            if (cfg) {
                Fashion.apply(this, cfg);
            }
            this.selectors = this.selectors || new Fashion.SelectorList([]);
            this.declarations = this.declarations || [];
        }
        Ruleset.prototype.doVisit = function (visitor) {
            visitor.ruleset(this);
        };
        Ruleset.prototype.descend = function (visitor) {
            visitor.visit(this.selectors);
            visitor.visit(this.declarations);
            visitor.visit(this.children);
        };
        Ruleset.prototype.addDeclaration = function (declaration, index) {
            declaration.ruleset = this;
            if (typeof index === 'undefined') {
                this.declarations.push(declaration);
            }
            else {
                this.declarations.splice(index, 0, declaration);
            }
        };
        Ruleset.prototype.getDeclarationIndex = function (decl) {
            for (var i = 0; i < this.declarations.length; i++) {
                if (this.declarations[i] === decl) {
                    return i;
                }
            }
            return -1;
        };
        Ruleset.prototype.removeDeclaration = function (decl) {
            this.declarations = Fashion.filter(this.declarations, function (d) { return d !== decl; });
        };
        Ruleset.prototype.lastDeclaration = function () {
            return (this.declarations.length && this.declarations[this.declarations.length - 1]) || null;
        };
        Ruleset.prototype.addChildRuleset = function (ruleset) {
            this.children.push(ruleset);
        };
        Ruleset.prototype.removeChildRuleset = function (child) {
            this.children = Fashion.filter(this.children, function (item) { return item !== child; });
        };
        Ruleset.prototype.getFirstSelector = function () {
            // SelectorList -> MultiPartSelector -> CompoundSelector
            var selectors = this.selectors;
            if (selectors instanceof Fashion.SelectorList) {
                selectors = selectors.items[0];
            }
            if (selectors instanceof Fashion.MultiPartSelector) {
                selectors = selectors.items[0];
            }
            return selectors;
        };
        Ruleset.prototype.getFirstSelectorStr = function () {
            if (this._firstSelectorStr === undefined) {
                this._firstSelectorStr = this.getFirstSelector() + '';
            }
            return this._firstSelectorStr;
        };
        Ruleset.prototype.isAtRule = function () {
            return this.getFirstSelectorStr().indexOf('@') === 0;
        };
        Ruleset.prototype.isMedia = function () {
            return this.getFirstSelectorStr().indexOf('@media') === 0;
        };
        Ruleset.prototype.isKeyFrames = function () {
            return this.getFirstSelectorStr().indexOf('@keyframes') === 0 ||
                this.getFirstSelectorStr().indexOf('@-webkit-keyframes') === 0;
        };
        Ruleset.prototype.isPage = function () {
            return this.isAtRule() && this.getFirstSelectorStr().indexOf("@page") === 0;
        };
        Ruleset.prototype.isAtRoot = function () {
            return this.isAtRule() && this.getFirstSelectorStr().indexOf("@at-root") === 0;
        };
        Ruleset.prototype.isDirective = function () {
            return this.isAtRule() &&
                !this.isMedia() &&
                this.declarations.length === 0 &&
                this.children.length === 0;
        };
        Ruleset.prototype.printAtRoot = function () {
            return this.isMedia() || this.isAtRoot();
        };
        return Ruleset;
    }(Fashion.Type));
    Fashion.Ruleset = Ruleset;
    Fashion.apply(Ruleset.prototype, {
        type: 'ruleset',
        $isFashionRuleset: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
/// <reference path="Base.ts"/>
///<reference path="Output.ts"/>
var Fashion;
(function (Fashion) {
    var CompressedOutput = (function (_super) {
        __extends(CompressedOutput, _super);
        function CompressedOutput() {
            _super.call(this);
            this.isCompressed = true;
        }
        CompressedOutput.prototype.space = function () {
        };
        CompressedOutput.prototype.addComment = function (text) {
        };
        CompressedOutput.prototype.indent = function () {
        };
        CompressedOutput.prototype.unindent = function () {
        };
        CompressedOutput.prototype.addln = function (ln) {
            _super.prototype.add.call(this, ln || '');
        };
        CompressedOutput.prototype.addCommentLn = function (ln) {
        };
        CompressedOutput.prototype.indentln = function (ln) {
            this.addln(ln);
        };
        CompressedOutput.prototype.unindentln = function (ln) {
            this.addln(ln);
        };
        return CompressedOutput;
    }(Fashion.Output));
    Fashion.CompressedOutput = CompressedOutput;
})(Fashion || (Fashion = {}));
///<reference path="Type.ts"/>
///<reference path="../Visitor.ts"/>
var Fashion;
(function (Fashion) {
    var TypeVisitor = (function () {
        function TypeVisitor(cfg) {
            if (cfg) {
                Fashion.apply(this, cfg);
            }
        }
        TypeVisitor.prototype.literal = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.bool = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.string = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.number = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.map = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.functioncall = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.parenthetical = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.list = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.hsla = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.rgba = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.colorstop = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.lineargradient = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.radialgradient = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.selector = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.selectorproperty = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.compoundselector = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.multipartselector = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.selectorlist = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.declaration = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.ruleset = function (obj) {
            obj.descend(this);
        };
        TypeVisitor.prototype.visitItem = function (obj) {
            obj.doVisit(this);
        };
        TypeVisitor.prototype.visit = function (obj) {
            while (obj && (obj.visitTarget !== undefined)) {
                obj = obj.visitTarget;
            }
            if (obj) {
                if (Array.isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        this.visit(obj[i]);
                    }
                }
                else {
                    this.visitItem(obj);
                }
            }
        };
        /**
         * this is an extension point for allowing overrides of the entry visit method
         * when called duing the post-processing mechanism in CSS.ts
         * @param obj
         */
        TypeVisitor.prototype.execute = function (obj, context) {
            this.visit(obj);
        };
        return TypeVisitor;
    }());
    Fashion.TypeVisitor = TypeVisitor;
})(Fashion || (Fashion = {}));
///<reference path="type/Ruleset.ts"/>
var Fashion;
(function (Fashion) {
    var CssPostprocessor = (function (_super) {
        __extends(CssPostprocessor, _super);
        function CssPostprocessor(cfg) {
            _super.call(this, cfg);
        }
        CssPostprocessor.prototype.selector = function (obj) {
            if (obj.selectorType === 'parent' && this.currentParentSelector) {
                obj.visitTarget = this.currentParentSelector;
                this.parentUsed = true;
            }
        };
        CssPostprocessor.prototype.literal = function (obj) {
            if (obj.value === '&' && this.currentParentSelector) {
                obj.visitTarget = this.currentParentSelector;
            }
        };
        CssPostprocessor.prototype.getSelectorArray = function (selectors, applyInterpolations) {
            if (selectors instanceof Fashion.SelectorList) {
                if (applyInterpolations) {
                    selectors.applyInterpolations();
                }
                selectors = selectors.items;
            }
            else {
                var str = selectors.toString();
                if (str.indexOf(',') > -1 && applyInterpolations) {
                    return this.getSelectorArray(this.context.parseSelectors(str));
                }
                selectors = [selectors];
            }
            return selectors;
        };
        CssPostprocessor.prototype.combineSelectors = function (parent, child) {
            var parentSelectors = this.getSelectorArray(parent.selectors), childSelectors = this.getSelectorArray(child.selectors), expandedSelectors = [], plen = parentSelectors.length, clen = childSelectors.length, p, c, parentSelector, childSelector;
            for (p = 0; p < plen; p++) {
                parentSelector = parentSelectors[p];
                this.currentParentSelector = parentSelector;
                for (c = 0; c < clen; c++) {
                    childSelector = childSelectors[c].clone();
                    this.parentUsed = false;
                    this.visit(childSelector);
                    if (!this.parentUsed) {
                        childSelector = new Fashion.MultiPartSelector([parentSelector, childSelector]);
                    }
                    expandedSelectors.push(childSelector);
                }
            }
            this.currentParentSelector = null;
            if (expandedSelectors.length == 1) {
                expandedSelectors = expandedSelectors[0];
            }
            else {
                expandedSelectors = new Fashion.SelectorList(expandedSelectors);
            }
            child.selectors = expandedSelectors;
        };
        CssPostprocessor.prototype.combineMediaSelectors = function (parent, child) {
            var expanded = [], selectors = this.getSelectorArray(parent.selectors), items = this.getSelectorArray(child.selectors), parentSelector, nestedSelector;
            for (var s = 0; s < selectors.length; s++) {
                parentSelector = selectors[s];
                for (var n = 0; n < items.length; n++) {
                    nestedSelector = items[n];
                    if (n === 0) {
                        // remove the @media portion
                        nestedSelector.items = nestedSelector.items.slice(1);
                    }
                    this.currentParentSelector = parentSelector;
                    this.parentUsed = false;
                    this.visit(nestedSelector);
                    this.parentUsed = false;
                    var newSelector = new Fashion.MultiPartSelector([
                        parentSelector,
                        new Fashion.Literal('and'),
                        nestedSelector
                    ]);
                    newSelector.skipParentPrepend = child.isAtRoot();
                    expanded.push(newSelector);
                }
            }
            if (expanded.length === 1) {
                expanded = expanded[0];
            }
            else {
                expanded = new Fashion.SelectorList(expanded);
            }
            child.selectors = expanded;
        };
        CssPostprocessor.prototype.declaration = function (obj) {
            var declWas = this.currDeclaration;
            this.currDeclaration = obj;
            obj.descend(this);
            this.currDeclaration = declWas;
        };
        CssPostprocessor.prototype.ruleset = function (obj) {
            var prevMedia = this.prevMedia, prevAtRoot = this.prevAtRoot, prevAtRule = this.prevAtRule, prevPlain = this.prevPlain, atRoot = false, declaration = this.currDeclaration, parent, ns, d, decl, idx;
            if (obj.isNamespaced) {
                // first, process any nested namespaced rulesets
                this.visit(obj.declarations);
                if (declaration) {
                    ns = declaration.property;
                    parent = declaration.ruleset;
                    idx = parent.getDeclarationIndex(declaration);
                    if (idx === -1) {
                        idx = parent.declarations.length;
                    }
                    for (d = 0; d < obj.declarations.length; d++) {
                        decl = obj.declarations[d];
                        parent.addDeclaration(new Fashion.Declaration({
                            property: ns + '-' + decl.property,
                            value: decl.value,
                            docs: decl.docs,
                            sourceInfo: decl.sourceInfo,
                            important: decl.important
                        }), d + idx);
                    }
                    // prevent this obj from generating css output
                    obj.visitTarget = null;
                    // if this is the immediate child of the declaration
                    // then skip that as well during css gen
                    if (obj.parentNode === declaration) {
                        parent.removeDeclaration(declaration);
                    }
                }
                return false;
            }
            obj.selectors = this.getSelectorArray(obj.selectors, true);
            if (obj.selectors.length === 1) {
                obj.selectors = obj.selectors[0];
            }
            else {
                obj.selectors = new Fashion.SelectorList(obj.selectors);
            }
            if (obj.isAtRule()) {
                this.prevAtRule = obj;
                if (prevPlain && obj.declarations.length) {
                    var newRuleset = new Fashion.Ruleset({
                        parent: obj,
                        declarations: obj.declarations,
                        selectors: prevPlain.selectors,
                        isMediaRoot: true
                    });
                    newRuleset.declarations.forEach(function (d) { return d.ruleset = newRuleset; });
                    obj.declarations = [];
                    obj.children.unshift(newRuleset);
                }
                if (!prevAtRule) {
                    atRoot = true;
                }
            }
            if (obj.isMedia()) {
                if (prevMedia) {
                    this.combineMediaSelectors(prevMedia, obj);
                }
                this.prevMedia = obj;
                atRoot = true;
            }
            else if (obj.isAtRoot()) {
                atRoot = true;
            }
            else if (!obj.isAtRule()) {
                if (prevPlain && !obj.isMediaRoot) {
                    this.combineSelectors(prevPlain, obj);
                }
                this.prevPlain = obj;
                if (!prevAtRule) {
                    atRoot = true;
                }
            }
            if (atRoot) {
                if (obj.parent) {
                    obj.parent.removeChildRuleset(obj);
                }
                // we may want to exlude the ruleset from printing
                if (obj.isAtRule() || obj.declarations.length || obj.isAtDirective) {
                    this.rootCss.push(obj);
                }
            }
            obj.descend(this);
            this.prevMedia = prevMedia;
            this.prevAtRoot = prevAtRoot;
            this.prevPlain = prevPlain;
            this.prevAtRule = prevAtRule;
            return false;
        };
        CssPostprocessor.prototype.visitItem = function (obj) {
            var currParent = this.currParent;
            obj.parentNode = currParent;
            this.currParent = obj;
            _super.prototype.visitItem.call(this, obj);
            this.currParent = currParent;
        };
        CssPostprocessor.prototype.process = function (obj) {
            this.rootCss = [];
            this.visit(obj);
            return this.rootCss;
        };
        return CssPostprocessor;
    }(Fashion.TypeVisitor));
    Fashion.CssPostprocessor = CssPostprocessor;
})(Fashion || (Fashion = {}));
///<reference path="type/Ruleset.ts"/>
var Fashion;
(function (Fashion) {
    var ExtendProcessor = (function (_super) {
        __extends(ExtendProcessor, _super);
        function ExtendProcessor(cfg) {
            _super.call(this, cfg);
        }
        ExtendProcessor.prototype.mergeCompoundSelector = function (match, extendSelector, matchKeys, targetKeys) {
            var compoundSelector = this.currCompoundSelector, multiPartSelector = this.currMultiPartSelector, items = [], newCompoundSelector, matchIndex;
            // first, remove the matched component,
            for (var i = 0; i < compoundSelector.items.length; i++) {
                var item = compoundSelector.items[i], hash = item.getHash();
                if (targetKeys) {
                    if (!targetKeys.hasOwnProperty(hash)) {
                        items.push(item);
                    }
                    else {
                        matchIndex = i;
                        items.push(null);
                    }
                }
                else {
                    if (hash != match.getHash()) {
                        items.push(item);
                    }
                    else {
                        matchIndex = i;
                        items.push(null);
                    }
                }
            }
            // then, if the extending selector is multi part,
            // merge this with the last component of that selector,
            if (extendSelector instanceof Fashion.MultiPartSelector) {
                var newSelector = extendSelector.clone(), last = newSelector.last();
                if (last instanceof Fashion.CompoundSelector) {
                    var cItems = last.items;
                    items = Fashion.filter(items, function (item) {
                        return !!item;
                    });
                    last.items = items.concat(cItems);
                }
                else {
                    last = new Fashion.CompoundSelector([last].concat(items));
                    newSelector.items[newSelector.items.length - 1] = last;
                }
                newCompoundSelector = newSelector;
            }
            else if (extendSelector instanceof Fashion.CompoundSelector) {
                items.splice.apply(items, [matchIndex, 1].concat(extendSelector.items));
            }
            else {
                items[matchIndex] = extendSelector;
            }
            newCompoundSelector = newCompoundSelector || new Fashion.CompoundSelector(items);
            if (multiPartSelector) {
                var newItems = [];
                for (var i = 0; i < multiPartSelector.items.length; i++) {
                    var item = multiPartSelector.items[i];
                    if (item === compoundSelector) {
                        newItems.push(newCompoundSelector);
                    }
                    else {
                        newItems.push(item);
                    }
                }
                this.newSelectors.push(new Fashion.MultiPartSelector(newItems));
            }
            else {
                this.newSelectors.push(newCompoundSelector);
            }
        };
        ExtendProcessor.prototype.mergeMultiPartSelector = function (match, extendSelector) {
            var multiPartSelector = this.currMultiPartSelector, items = multiPartSelector.items, len = items.length, i, item, before, after;
            for (i = 0; i < len; i++) {
                item = items[i];
                if (item.getHash() === match.getHash()) {
                    before = items.slice(0, i);
                    after = items.slice(i + 1);
                    // if we're trying to insert a new multi-part selector,
                    // we need to weave the prefix elements together
                    if (extendSelector instanceof Fashion.MultiPartSelector) {
                        var mpExtendSelector = extendSelector, extendItems = mpExtendSelector.items, elen = extendItems.length, first = extendItems.slice(0, elen - 2), last = extendItems.slice(elen - 1);
                        // weave the two sets of items together
                        this.newSelectors.push(new Fashion.MultiPartSelector(before.concat(first).concat(last).concat(after)));
                        this.newSelectors.push(new Fashion.MultiPartSelector(first.concat(before).concat(last).concat(after)));
                    }
                    else {
                        this.newSelectors.push(new Fashion.MultiPartSelector(before.concat(extendSelector).concat(after)));
                    }
                }
            }
        };
        ExtendProcessor.prototype.checkSelectorPart = function (obj) {
            if (obj.getHash() === this.currTargetHash) {
                if (this.currCompoundSelector) {
                    for (var e = 0; e < this.extendSelectors.length; e++) {
                        var extendSelector = this.extendSelectors[e];
                        this.mergeCompoundSelector(obj, extendSelector);
                    }
                }
                else if (this.currMultiPartSelector) {
                    // need to weave together the current multi-part selector
                    // with the various extending selectors;
                    for (var e = 0; e < this.extendSelectors.length; e++) {
                        var extendSelector = this.extendSelectors[e];
                        this.mergeMultiPartSelector(obj, extendSelector);
                    }
                }
                else {
                    this.appendAllExtendSelectors();
                }
            }
        };
        ExtendProcessor.prototype.appendAllExtendSelectors = function () {
            this.newSelectors.push.apply(this.newSelectors, this.extendSelectors);
        };
        ExtendProcessor.prototype.getCompoundSelectorMap = function (compoundSelector) {
            var map = {};
            compoundSelector.items.forEach(function (i) { return map[i.getHash()] = true; });
            return map;
        };
        //--------------------------------------------------
        // visitor methods
        ExtendProcessor.prototype.literal = function (obj) {
            this.checkSelectorPart(obj);
        };
        ExtendProcessor.prototype.selector = function (obj) {
            this.checkSelectorPart(obj);
        };
        ExtendProcessor.prototype.compoundselector = function (obj) {
            var resetCompoundSelector = this.currCompoundSelector;
            this.currCompoundSelector = obj;
            if (obj.getHash() === this.currTargetHash) {
                this.appendAllExtendSelectors();
            }
            else if (this.currTarget instanceof Fashion.CompoundSelector) {
                // need to check for a subset match
                var objMap = this.getCompoundSelectorMap(obj), targetMap = this.getCompoundSelectorMap(this.currTarget), objKeys = Object.keys(objMap), targetKeys = Object.keys(targetMap), subset = true, targetKey;
                for (var t = 0; t < targetKeys.length; t++) {
                    targetKey = targetKeys[t];
                    if (!objKeys.hasOwnProperty(targetKey)) {
                        subset = false;
                        break;
                    }
                }
                if (subset) {
                    for (var e = 0; e < this.extendSelectors.length; e++) {
                        var extendSelector = this.extendSelectors[e];
                        this.mergeCompoundSelector(obj, extendSelector, objKeys, targetKeys);
                    }
                }
            }
            else {
                obj.descend(this);
            }
            this.currCompoundSelector = resetCompoundSelector;
            return false;
        };
        ExtendProcessor.prototype.multipartselector = function (obj) {
            var resetMultiPartSelector = this.currMultiPartSelector;
            this.currMultiPartSelector = obj;
            if (obj.getHash() === this.currTargetHash) {
                this.appendAllExtendSelectors();
            }
            else {
                obj.descend(this);
            }
            this.currMultiPartSelector = resetMultiPartSelector;
            return false;
        };
        //--------------------------------------------------
        ExtendProcessor.prototype.extend = function (ruleset, targetSelector, extendSelectors) {
            var i, j, newSelector, hash;
            this.currTarget = targetSelector;
            this.currTargetHash = this.currTarget.getHash();
            this.newSelectors = [];
            this.extendSelectors = extendSelectors;
            this.visit(ruleset.selectors);
            // now, add any newly created selectors to the ruleset
            if (this.newSelectors.length) {
                var selectors = ruleset.selectors, map = {};
                if (selectors instanceof Fashion.SelectorList) {
                    selectors = selectors.items;
                }
                else {
                    selectors = [selectors];
                }
                for (i = 0; i < selectors.length; i++) {
                    map[selectors[i].getHash()] = true;
                }
                for (i = 0; i < this.newSelectors.length; i++) {
                    newSelector = this.newSelectors[i];
                    hash = newSelector.getHash();
                    if (!map.hasOwnProperty(hash)) {
                        selectors.push(newSelector);
                        map[hash] = true;
                    }
                }
                for (i = 0; i < selectors.length; i++) {
                    for (j = 0; j < selectors.length; j++) {
                        if (i != j && selectors[i] && selectors[j]) {
                            var comp = this.compareSelectors(selectors[i], selectors[j]);
                            if (comp !== 0) {
                                if (comp > 1) {
                                    selectors[i] = null;
                                }
                                else {
                                    selectors[j] = null;
                                }
                            }
                        }
                    }
                }
                selectors = Fashion.filter(selectors, function (s) { return !!s; });
                ruleset.selectors = new Fashion.SelectorList(selectors);
            }
            for (var c = 0; c < ruleset.children.length; c++) {
                this.extend(ruleset.children[c], targetSelector, extendSelectors);
            }
        };
        /**
         * returns:
         *  1 == sel1 is subset of sel2
         * -1 == sel2 is subset of sel1
         *  0 == different
         */
        ExtendProcessor.prototype.compareSelectors = function (sel1, sel2) {
            if (sel1 instanceof Fashion.MultiPartSelector) {
                if (!(sel2 instanceof Fashion.MultiPartSelector)) {
                    sel2 = new Fashion.MultiPartSelector([sel2]);
                }
                return this.isSuperSelector(sel1, sel2);
            }
            else if (sel2 instanceof Fashion.MultiPartSelector) {
                sel1 = new Fashion.MultiPartSelector([sel1]);
                return this.isSuperSelector(sel1, sel2);
            }
            if (sel1 instanceof Fashion.CompoundSelector) {
                if (!(sel2 instanceof Fashion.CompoundSelector)) {
                    sel2 = new Fashion.CompoundSelector([sel2]);
                }
                return this.isSubset(sel1, sel2);
            }
            else if (sel2 instanceof Fashion.CompoundSelector) {
                sel1 = new Fashion.CompoundSelector([sel1]);
                return this.isSubset(sel1, sel2);
            }
            var h1 = sel1.getHash(), h2 = sel2.getHash();
            if (h1 == h2) {
                return 1;
            }
            return 0;
        };
        /**
         * returns:
         *  1 == this isSuperSelector of other
         * -1 == other isSuperSelector of this
         *  0 == different
         */
        ExtendProcessor.prototype.isSuperSelector = function (sel1, sel2) {
            var items = sel1.items, sItems = sel2.items, shortList = items, longList = sItems, res = 1, tmpRes;
            if (items.length > sItems.length) {
                shortList = sItems;
                longList = items;
                res = -1;
            }
            for (var i = 0; i < shortList.length; i++) {
                tmpRes = this.compareSelectors(shortList[i], longList[i]);
                var tmpRes;
                if (tmpRes === 0) {
                    return 0;
                }
                else if (tmpRes !== res) {
                    return 0;
                }
            }
            return res;
        };
        /**
         * returns:
         *  1 == this is subset of other
         * -1 == other is subset of this
         *  0 == different
         */
        ExtendProcessor.prototype.isSubset = function (sel1, sel2) {
            var items = sel1.items, sItems = sel2.items, longItemMap = {}, shortList = items, longList = sItems, item, res = 1;
            if (items.length > sItems.length) {
                shortList = sItems;
                longList = items;
                res = -1;
            }
            for (var i = 0; i < longList.length; i++) {
                item = longList[i];
                longItemMap[item.getHash()] = item;
            }
            for (var i = 0; i < shortList.length; i++) {
                item = shortList[i];
                if (!longItemMap[item.getHash()]) {
                    return 0;
                }
            }
            return res;
        };
        ExtendProcessor.prototype.extendRulesets = function (rulesets, extenders) {
            var _this = this;
            extenders.forEach(function (extender) {
                extender.extend.forEach(function (extend) {
                    rulesets.forEach(function (ruleset) {
                        var extendSelectors = extender.selectors;
                        if (extendSelectors instanceof Fashion.SelectorList) {
                            extendSelectors = extendSelectors.items;
                        }
                        else {
                            extendSelectors = [extendSelectors];
                        }
                        _this.extend(ruleset, extend, extendSelectors);
                    });
                });
            });
        };
        return ExtendProcessor;
    }(Fashion.TypeVisitor));
    Fashion.ExtendProcessor = ExtendProcessor;
})(Fashion || (Fashion = {}));
///<reference path="../Output.ts"/>
///<reference path="Type.ts"/>
///<reference path="TypeVisitor.ts"/>
///<reference path="Literal.ts"/>
var Fashion;
(function (Fashion) {
    var SourceBuilder = (function (_super) {
        __extends(SourceBuilder, _super);
        function SourceBuilder(cfg) {
            _super.call(this, cfg);
            this.selectorCount = 0;
        }
        SourceBuilder.prototype.list = function (obj) {
            var output = this.output, items = obj.items, len = output.output.length, sep = obj.separator, sepLen = sep && sep.length, hasSpace = sep && sep.indexOf(' ') > -1, prev = output.output, delta;
            for (var i = 0; i < items.length; i++) {
                if (items[i]) {
                    this.visit(items[i]);
                    delta = output.output.length - len;
                    if (!delta && sepLen && i > 0) {
                        output.output = prev;
                    }
                    prev = output.output;
                    if (i < items.length - 1) {
                        if (sepLen) {
                            output.add(sep);
                            if (!hasSpace) {
                                output.space();
                            }
                        }
                    }
                    len = output.output.length;
                }
            }
        };
        SourceBuilder.prototype.map = function (obj) {
            var output = this.output, items = obj.items, key, value;
            if (this.currDeclaration) {
                Fashion.raise('(' + obj.toString() + ") isn't a valid CSS value.");
            }
            for (var i = 0; i < items.length - 1; i += 2) {
                key = items[i];
                value = items[i + 1];
                if (key && value) {
                    if (i > 0) {
                        output.add(',');
                        output.space();
                    }
                    this.visit(key);
                    output.add(': ');
                    //output.space();
                    this.visit(value);
                }
            }
        };
        SourceBuilder.prototype.literal = function (obj) {
            obj.value && this.output.add(obj.value);
        };
        SourceBuilder.prototype.string = function (obj) {
            var output = this.output;
            output.add(obj.quoteChar);
            output.add(obj.value);
            output.add(obj.quoteChar);
        };
        SourceBuilder.prototype.functioncall = function (obj) {
            var output = this.output;
            output.add(obj.name);
            output.add('(');
            this.visit(obj.args);
            output.add(')');
        };
        SourceBuilder.prototype.parenthetical = function (obj) {
            this.output.add('(');
            this.visit(obj.value);
            this.output.add(')');
        };
        SourceBuilder.prototype.number = function (obj) {
            var val = obj.stringify();
            if (val.indexOf('.') === '.' && !this.output.isCompressed) {
                val = "0" + val;
            }
            this.output.add(val);
        };
        SourceBuilder.prototype.bool = function (obj) {
            this.output.add(obj.value ? 'true' : 'false');
        };
        SourceBuilder.prototype.hsla = function (obj) {
            this.output.add(obj.toString());
        };
        SourceBuilder.prototype.rgba = function (obj) {
            this.output.add(obj.toString());
        };
        SourceBuilder.prototype.colorstop = function (obj) {
            var output = this.output, stop = obj.stop;
            this.visit(obj.color);
            if (stop) {
                stop = stop.clone();
                output.add(' ');
                if (!stop.unit) {
                    stop.value *= 100;
                    stop.unit = '%';
                }
                this.visit(stop);
            }
        };
        SourceBuilder.prototype.lineargradient = function (obj) {
            var output = this.output;
            output.add("linear-gradient(");
            if (obj.position) {
                this.visit(obj.position);
                output.add(',');
                output.space();
            }
            this.visit(obj.stops);
            output.add(')');
        };
        SourceBuilder.prototype.radialgradient = function (obj) {
            var output = this.output;
            output.add("linear-gradient(");
            if (obj.position) {
                this.visit(obj.position);
                output.add(',');
                output.space();
            }
            if (obj.shape) {
                this.visit(obj.shape);
                output.add(',');
                output.space();
            }
            this.visit(obj.stops);
            output.add(')');
        };
        SourceBuilder.prototype.selectorlist = function (obj) {
            var items = obj.items, len = items.length, output = this.output, i;
            for (i = 0; i < len; i++) {
                this.visit(items[i]);
                if (i < len - 1) {
                    output.add(',');
                    output.addln();
                    // we increment the selector count here, since
                    // we actually want to skip one of the selectors in the
                    // count, as all non-null ruleset.selectors values will
                    // already have incremented the selector count by one
                    // in the ruleset visitor method
                    this.selectorCount++;
                }
            }
        };
        SourceBuilder.prototype.selectorproperty = function (obj) {
            this.visit(obj.property);
            this.output.add(': ');
            //this.output.space();
            this.visit(obj.value);
        };
        SourceBuilder.prototype.multipartselector = function (obj) {
            this.list(obj);
        };
        SourceBuilder.prototype.compoundselector = function (obj) {
            this.list(obj.sort());
        };
        SourceBuilder.prototype.selector = function (obj) {
            var parentSelector = obj.parent, output = this.output;
            switch (obj.selectorType) {
                case 'parent':
                    if (parentSelector) {
                        this.visit(parent);
                        return false;
                    }
                    this.visit(obj.value);
                    break;
                case 'placeholder':
                    output.add('%');
                    this.visit(obj.value);
                    break;
                case 'dash':
                    output.add('-');
                    this.visit(obj.value);
                    break;
                case 'attribute':
                    output.add('[');
                    this.visit(obj.value);
                    output.add(']');
                    break;
                case 'pseudo':
                    output.add(':');
                    this.visit(obj.value);
                    break;
                default:
                    this.visit(obj.value);
                    break;
            }
        };
        SourceBuilder.prototype.declaration = function (obj) {
            var output = this.output, currDeclarationWas = this.currDeclaration;
            if (obj.docs && obj.docs.length) {
                for (var d = 0; d < obj.docs.length; d++) {
                    output.addCommentLn(obj.docs[d]);
                }
            }
            this.currDeclaration = obj;
            output.addln();
            output.add(obj.property);
            output.add(":");
            output.space();
            this.visit(obj.value);
            if (obj.important) {
                output.add(' !important');
            }
            if (output.isCompressed) {
                // for compressed output, don't need to print the ';'
                // char for the last ruleset
                if (obj !== obj.ruleset.lastDeclaration()) {
                    output.add(';');
                }
            }
            else {
                output.add(';');
            }
            this.currDeclaration = currDeclarationWas;
        };
        SourceBuilder.prototype.ruleset = function (obj) {
            var output = this.output;
            output.addln();
            if (obj.isAtDirective) {
                output.add(obj.atDirectiveName);
                output.add(' ');
                if (obj.atDirectiveValue) {
                    this.visit(obj.atDirectiveValue);
                    output.add(';');
                }
                else {
                    output.add('{}');
                }
                return;
            }
            if (obj.sourceInfo) {
                output.addComment('/* ' + obj.sourceInfo + ' */');
                output.addln();
            }
            if (obj.docs && obj.docs.length) {
                for (var d = 0; d < obj.docs.length; d++) {
                    output.addCommentLn(obj.docs[d]);
                }
            }
            if (obj.selectors) {
                this.selectorCount++;
            }
            this.visit(obj.selectors);
            if (obj.isAtRule() &&
                obj.declarations.length === 0 &&
                obj.children.length === 0 &&
                !obj.hasBlock) {
                output.add(";");
                return;
            }
            output.space();
            output.add('{');
            output.indent();
            this.visit(obj.declarations);
            if (obj.isAtRule() && !obj.isAtRoot()) {
                this.visit(obj.children);
                output.unindent();
                output.addln('}');
            }
            else {
                output.unindent();
                output.addln('}');
                this.visit(obj.children);
            }
        };
        SourceBuilder.prototype.toSource = function (obj, output) {
            this.output = output || new Fashion.Output();
            this.visit(obj);
            return this.output.get();
        };
        SourceBuilder.toSource = function (obj, output) {
            var sb = new SourceBuilder();
            return sb.toSource(obj, output);
        };
        return SourceBuilder;
    }(Fashion.TypeVisitor));
    Fashion.SourceBuilder = SourceBuilder;
})(Fashion || (Fashion = {}));
///<reference path="type/TypeVisitor.ts"/>
///<reference path="type/Ruleset.ts"/>
var Fashion;
(function (Fashion) {
    var PlaceholderProcessor = (function (_super) {
        __extends(PlaceholderProcessor, _super);
        function PlaceholderProcessor(cfg) {
            _super.call(this, cfg);
            this.hasPlaceholder = false;
        }
        PlaceholderProcessor.prototype.literal = function (obj) {
            if (obj.getHash() === '%') {
                this.hasPlaceholder = true;
            }
        };
        PlaceholderProcessor.prototype.selector = function (obj) {
            if (obj.selectorType === 'placeholder') {
                this.hasPlaceholder = true;
            }
        };
        PlaceholderProcessor.prototype.selectorlist = function (obj) {
            var items = obj.items, len = items.length, i, item, newItems = [];
            for (i = 0; i < len; i++) {
                item = items[i];
                this.hasPlaceholder = false;
                this.visit(item);
                if (!this.hasPlaceholder) {
                    newItems.push(item);
                }
            }
            obj.items = newItems;
            return false;
        };
        PlaceholderProcessor.prototype.ruleset = function (obj) {
            this.hasPlaceholder = false;
            this.visit(obj.selectors);
            if (this.hasPlaceholder) {
                obj.selectors = null;
            }
            this.visit(obj.children);
            return false;
        };
        PlaceholderProcessor.prototype.process = function (css) {
            this.visit(css);
            if (!css.selectors || css.selectors.length === 0) {
                return;
            }
            this.outCss.push(css);
        };
        PlaceholderProcessor.prototype.processRulesets = function (css) {
            this.outCss = [];
            for (var i = 0; i < css.length; i++) {
                this.process(css[i]);
            }
            return this.outCss;
        };
        return PlaceholderProcessor;
    }(Fashion.TypeVisitor));
    Fashion.PlaceholderProcessor = PlaceholderProcessor;
})(Fashion || (Fashion = {}));
///<reference path="Base.ts"/>
var Fashion;
(function (Fashion) {
    var Ready = (function () {
        function Ready() {
            this.blocks = 0;
            this.listeners = [];
        }
        Ready.prototype.block = function () {
            this.blocks++;
        };
        Ready.prototype.unblock = function () {
            if (this.blocks && !--this.blocks) {
                this.fireReady();
            }
        };
        Ready.prototype.fireReady = function () {
            for (var i = 0; i < this.listeners.length; i++) {
                var listener = this.listeners[i];
                listener();
                this.listeners[i] = null;
            }
            this.listeners = Fashion.filter(this.listeners, function (l) { return !!l; });
        };
        Ready.prototype.onReady = function (callback) {
            if (!this.blocks) {
                callback();
            }
            else {
                this.listeners.push(callback);
            }
        };
        return Ready;
    }());
    Fashion.Ready = Ready;
})(Fashion || (Fashion = {}));
///<reference path="type/List.ts"/>
///<reference path="type/Ruleset.ts"/>
///<reference path="Output.ts"/>
///<reference path="CompressedOutput.ts"/>
///<reference path="parse/Scanner.ts"/>
///<reference path="type/TypeVisitor.ts"/>
///<reference path="CssPostprocessor.ts"/>
///<reference path="ExtendProcessor.ts"/>
///<reference path="type/SourceBuilder.ts"/>
///<reference path="PlaceholderProcessor.ts"/>
///<reference path="Ready.ts"/>
var Fashion;
(function (Fashion) {
    var CSS = (function (_super) {
        __extends(CSS, _super);
        function CSS(config) {
            _super.call(this, config);
            this.css = [];
            this.extenders = [];
            this.outputs = [];
        }
        CSS.prototype.reset = function () {
            this.css = [];
        };
        CSS.prototype.resetOutputs = function () {
            this.outputs = [];
            this.output = null;
        };
        CSS.prototype.addRuleset = function (ruleset) {
            this.css.push(ruleset);
        };
        CSS.prototype.createOutput = function (compressed, indent, skipComments, split) {
            var output = compressed
                ? new Fashion.CompressedOutput()
                : new Fashion.Output();
            if (indent) {
                output.indentstr = indent;
            }
            if (!compressed && skipComments) {
                output.addComment = function (text) { };
                output.addCommentLn = function (text) {
                    this.addln();
                };
            }
            if (split) {
                output.splitThreshold = split;
            }
            this.output = output;
            this.outputs.push(output);
            return output;
        };
        CSS.prototype.getOutputs = function () {
            var out = [];
            this.outputs.forEach(function (output) {
                out.push(output.get().trim());
            });
            return out;
        };
        CSS.prototype.getText = function (callBack, compressed, indent, skipComments, split) {
            this.resetOutputs();
            var css = this.css, sourceBuilder = new Fashion.SourceBuilder(), proc, extendProc, placeholderProc;
            proc = new Fashion.CssPostprocessor({
                context: this.context
            });
            css = proc.process(css);
            extendProc = new Fashion.ExtendProcessor();
            extendProc.extendRulesets(css, this.extenders);
            placeholderProc = new Fashion.PlaceholderProcessor();
            css = placeholderProc.processRulesets(css);
            // TODO: loop over all registered Type post-processors and allow
            // user defined transformations before css content generation
            // finally, hoist certain @-directives to the front.
            var hostDirectives = {
                '@charset': true,
                '@import': true
            };
            css.forEach(function (r, i) { return r.index = i; });
            css.sort(function (r1, r2) {
                var d1 = !!hostDirectives[r1.atDirectiveName], d2 = !!hostDirectives[r2.atDirectiveName];
                if (d1 && !d2) {
                    return -1;
                }
                if (d2 && !d1) {
                    return 1;
                }
                if (d1 && d2) {
                    if (r1.atDirectiveName != r2.atDirectiveName) {
                        if (r1.atDirectiveName === '@charset') {
                            return -1;
                        }
                        else {
                            return 1;
                        }
                    }
                }
                return r1.index - r2.index;
            });
            var me = this, processors = this.processors || [];
            function postProcess() {
                var proc = processors.shift(), ready;
                if (proc) {
                    ready = new Fashion.Ready();
                    me.ready = ready;
                    proc.execute(css, me);
                    ready.onReady(function () {
                        postProcess();
                    });
                }
                else {
                    var output = me.createOutput(compressed, indent, skipComments, split);
                    for (var c = 0; c < css.length; c++) {
                        var count = sourceBuilder.selectorCount, len = output.output.length, prevOutput = output.output, newCount, newOutput;
                        sourceBuilder.toSource(css[c], output);
                        newCount = sourceBuilder.selectorCount;
                        if (newCount > split) {
                            newOutput = me.createOutput(compressed, indent, skipComments, split);
                            newOutput.output = output.output.substring(len);
                            output.output = prevOutput;
                            sourceBuilder.selectorCount = newCount - count;
                            output = newOutput;
                        }
                    }
                    callBack(me.getOutputs());
                }
            }
            postProcess();
        };
        CSS.prototype.getJSON = function () {
            var ans = {};
            return ans;
        };
        return CSS;
    }(Fashion.Base));
    Fashion.CSS = CSS;
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/Color.ts"/>
///<reference path="../type/Numeric.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Color;
        (function (Color) {
            function init(runtime) {
                runtime.register({
                    adjust_color: function (color, red, green, blue, hue, saturation, lightness, alpha) {
                        var adjusted = color.getRGBA().clone(), adjust = Fashion.Color.adjust, comps = Fashion.Color.comps;
                        red && (adjusted[comps.red] += red.value);
                        blue && (adjusted[comps.blue] += blue.value);
                        green && (adjusted[comps.green] += green.value);
                        alpha && (adjusted[comps.alpha] = Math.max(0, Math.min(1, adjusted[comps.alpha] + alpha.value)));
                        hue && (adjusted = adjust(adjusted, 'hue', hue));
                        lightness && (adjusted = adjust(adjusted, 'lightness', lightness));
                        saturation && (adjusted = adjust(adjusted, 'saturation', saturation));
                        return adjusted;
                    },
                    scale_color: function () {
                    },
                    change_color: function (color, red, green, blue, hue, saturation, lightness, alpha) {
                        var adjusted = color.getRGBA().clone(), adjust = Fashion.Color.adjust, comps = Fashion.Color.comps;
                        red && (adjusted[comps.red] = red.value);
                        blue && (adjusted[comps.blue] = blue.value);
                        green && (adjusted[comps.green] = green.value);
                        alpha && (adjusted[comps.alpha] = Math.max(0, Math.min(1, alpha.value)));
                        hue && (adjusted = adjusted.getHSLA()) && (adjusted.h = hue.value);
                        lightness && (adjusted = adjusted.getHSLA()) && (adjusted.l = lightness.value);
                        saturation && (adjusted = adjusted.getHSLA()) && (adjusted.s = saturation.value);
                        return adjusted;
                    },
                    // def ie_hex_str(color)
                    //   assert_type color, :Color
                    //   alpha = (color.alpha * 255).round
                    //   alphastr = alpha.to_s(16).rjust(2, '0')
                    //   Sass::Script::String.new("##{alphastr}#{color.send(:hex_str)[1..-1]}".upcase)
                    // end
                    ie_hex_str: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            throw color + ' is not a color for \'ie-hex-str\'';
                        }
                        return color.toIeHexStr();
                    }
                });
            }
            Color.init = init;
        })(Color = functions.Color || (functions.Color = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
/// <reference path='Type.ts'/>
var Fashion;
(function (Fashion) {
    var LinearGradient = (function (_super) {
        __extends(LinearGradient, _super);
        function LinearGradient(position, stops) {
            _super.call(this);
            this.vendorPrefixes = {
                webkit: true,
                moz: true,
                svg: true,
                pie: true,
                css2: true,
                o: true,
                owg: true
            };
            this.position = position;
            this.stops = stops;
        }
        LinearGradient.prototype.doVisit = function (visitor) {
            visitor.lineargradient(this);
        };
        LinearGradient.prototype.descend = function (visitor) {
            visitor.visit(this.position);
            visitor.visit(this.stops);
        };
        LinearGradient.prototype.clone = function () {
            return new Fashion.LinearGradient(this.position, this.stops);
        };
        LinearGradient.prototype.gradientPoints = function (position) {
            //position = (position.type == 'list') ? position.clone() : new Fashion.List([position]);
            //console.log('gradientpoints', position);
        };
        LinearGradient.prototype.operate = function (operation, right) {
            switch (operation) {
                case "!=":
                    if (right.type == 'literal' && (right.value == 'null' || right.value == 'none')) {
                        return true;
                    }
                case "==":
                    if (right.type == 'literal' && (right.value == 'null' || right.value == 'none')) {
                        return false;
                    }
            }
            return Fashion.Type.operate(operation, this, right);
        };
        LinearGradient.prototype.supports = function (prefix) {
            return !!(this.vendorPrefixes[prefix.toLowerCase()]);
        };
        LinearGradient.prototype.toString = function () {
            var string = 'linear-gradient(';
            if (this.position) {
                string += (this.position + ', ');
            }
            return string + this.stops + ')';
        };
        LinearGradient.prototype.toOriginalWebkitString = function () {
            // args = []
            // args << grad_point(position_or_angle || Sass::Script::String.new("top"))
            // args << linear_end_position(position_or_angle, color_stops)
            // args << grad_color_stops(color_stops)
            // args.each{|a| a.options = options}
            // Sass::Script::String.new("-webkit-gradient(linear, #{args.join(', ')})")
            //this.gradientPoints(this.position);
            var args = [], stops = this.stops.items, ln = stops.length, i;
            args.push('top');
            args.push('bottom');
            for (i = 0; i < ln; i++) {
                args.push(stops[i].toOriginalWebkitString());
            }
            return '-webkit-gradient(linear, ' + args.join(', ') + ')';
        };
        LinearGradient.prototype.toPrefixedString = function (prefix) {
            if (prefix === 'owg') {
                return this.toOriginalWebkitString();
            }
            return prefix + this.toString();
        };
        return LinearGradient;
    }(Fashion.Type));
    Fashion.LinearGradient = LinearGradient;
    Fashion.apply(LinearGradient.prototype, {
        type: 'lineargradient',
        $isFashionLinearGradient: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
/// <reference path='Type.ts'/>
var Fashion;
(function (Fashion) {
    var RadialGradient = (function (_super) {
        __extends(RadialGradient, _super);
        function RadialGradient(position, shape, stops) {
            _super.call(this);
            this.position = position;
            this.stops = stops;
            this.shape = shape;
        }
        RadialGradient.prototype.doVisit = function (visitor) {
            visitor.radialgradient(this);
        };
        RadialGradient.prototype.descend = function (visitor) {
            visitor.visit(this.position);
            visitor.visit(this.stops);
            visitor.visit(this.shape);
        };
        RadialGradient.prototype.clone = function () {
            return new Fashion.RadialGradient(this.position, this.shape, this.stops);
        };
        RadialGradient.prototype.toString = function () {
            var string = 'radial-gradient(';
            if (this.position) {
                string += (this.position + ', ');
            }
            if (this.shape) {
                string += (this.shape + ', ');
            }
            return string + this.stops + ')';
        };
        RadialGradient.prototype.toOriginalWebkitString = function () {
            var args = [], stops = this.stops.items, ln = stops.length, i;
            args.push('center 0%');
            args.push('center 100%');
            for (i = 0; i < ln; i++) {
                args.push(stops[i].toOriginalWebkitString());
            }
            return '-webkit-gradient(radial, ' + args.join(', ') + ')';
        };
        RadialGradient.prototype.supports = function (prefix) {
            return ['owg', 'webkit'].indexOf(prefix.toLowerCase()) !== -1;
        };
        RadialGradient.prototype.toPrefixedString = function (prefix) {
            if (prefix === 'owg') {
                return this.toOriginalWebkitString();
            }
            return prefix + this.toString();
        };
        RadialGradient.prototype.gradientPoints = function (position) {
            //position = (position.type === 'list') ? position.clone() : new Fashion.List([position]);
            //console.log('gradientpoints', position);
        };
        return RadialGradient;
    }(Fashion.Type));
    Fashion.RadialGradient = RadialGradient;
    Fashion.apply(RadialGradient.prototype, {
        type: 'radialgradient',
        $isFashionRadialGradient: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
///<reference path="Numeric.ts"/>
///<reference path="Color.ts"/>
var Fashion;
(function (Fashion) {
    var ColorStop = (function (_super) {
        __extends(ColorStop, _super);
        function ColorStop(color, stop) {
            _super.call(this);
            this.color = color;
            this.stop = stop;
        }
        ColorStop.prototype.doVisit = function (visitor) {
            visitor.colorstop(this);
        };
        ColorStop.prototype.descend = function (visitor) {
            visitor.visit(this.color);
            visitor.visit(this.stop);
        };
        ColorStop.prototype.toString = function () {
            var string = this.color.toString(), stop = this.stop;
            if (stop) {
                stop = stop.clone();
                string += ' ';
                if (!stop.unit) {
                    stop.value *= 100;
                    stop.unit = '%';
                }
                string += stop.toString();
            }
            return string;
        };
        ColorStop.prototype.toOriginalWebkitString = function () {
            var stop = this.stop;
            if (!stop) {
                stop = new Fashion.Numeric(0, '%');
            }
            stop = stop.clone();
            if (!stop.unit) {
                stop.value *= 100;
                stop.unit = '%';
            }
            return 'color-stop(' + stop.toString() + ', ' + this.color.toString() + ')';
        };
        ColorStop.prototype.clone = function () {
            return new Fashion.ColorStop(this.color, this.stop);
        };
        return ColorStop;
    }(Fashion.Type));
    Fashion.ColorStop = ColorStop;
    Fashion.apply(ColorStop.prototype, {
        type: 'colorstop',
        $isFashionColorStop: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/LinearGradient.ts"/>
///<reference path="../type/RadialGradient.ts"/>
///<reference path="../type/ColorStop.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Gradients;
        (function (Gradients) {
            function init(runtime) {
                runtime.register({
                    linear_gradient: function (position, stops) {
                        stops = this.tailArgs(1, arguments);
                        if (stops && stops.length === 1) {
                            stops = stops[0];
                        }
                        if ((position.type === 'list' && (position.get(1).type === 'rgba' || position.get(1).type === 'hsla')) ||
                            position.type === 'hsla' ||
                            position.type === 'rgba') {
                            stops = this.color_stops.apply(this, arguments);
                            position = null;
                        }
                        else if (position.type == 'list' && position.get(1).type == 'colorstop') {
                            stops = position;
                            position = null;
                        }
                        else if (stops.type === 'hsla' || stops.type === 'rgba') {
                            stops = this.color_stops.call(this, new Fashion.List([stops]));
                        }
                        else {
                            stops = this.color_stops.call(this, stops);
                        }
                        return new Fashion.LinearGradient(position, stops);
                    },
                    radial_gradient: function (position, shape, stops) {
                        stops = this.tailArgs(2, arguments);
                        if (stops && stops.length === 1) {
                            stops = stops[0];
                        }
                        if ((position.type === 'list' && (position.get(1).type === 'rgba' || position.get(1).type === 'hsla')) ||
                            position.type === 'hsla' ||
                            position.type === 'rgba') {
                            stops = this.color_stops.apply(this, arguments);
                            position = null;
                        }
                        else if (position.type == 'list' && position.get(1).type == 'colorstop') {
                            stops = position;
                            position = null;
                        }
                        else if ((shape.type === 'list' && (shape.get(1).type === 'rgba' || shape.get(1).type === 'hsla')) ||
                            shape.type === 'hsla' ||
                            shape.type === 'rgba') {
                            stops = this.color_stops.apply(this, arguments);
                            shape = null;
                        }
                        else if (shape.type == 'list' && shape.get(1).type == 'colorstop') {
                            stops = shape;
                            shape = null;
                        }
                        else if (stops.type === 'hsla' || stops.type === 'rgba') {
                            stops = this.color_stops.call(this, new Fashion.List([stops]));
                        }
                        else {
                            stops = this.color_stops.call(this, stops);
                        }
                        return new Fashion.RadialGradient(position, shape, stops);
                    },
                    color_stops: function () {
                        var args = this.tailArgs(0, arguments), mapped = this.handleArgs(args && args.items || args, [['stops']]), stops = mapped.stops.items, ln = stops.length, list = new Fashion.List(null, ', '), i, arg;
                        for (i = 0; i < ln; i++) {
                            arg = stops[i];
                            if (arg.type === 'list') {
                                if (arg.items.length === 2) {
                                    list.add(new Fashion.ColorStop(arg.get(1), arg.get(2)));
                                }
                                else {
                                    list.items.push.apply(list.items, arg.items);
                                }
                            }
                            else if (arg.type === 'rgba' || arg.type === 'hsla') {
                                list.add(new Fashion.ColorStop(arg));
                            }
                            else if (Array.isArray(arg)) {
                                list.items.push.apply(list.items, arg);
                            }
                            else {
                                list.add(arg);
                            }
                        }
                        return list;
                    }
                });
            }
            Gradients.init = init;
        })(Gradients = functions.Gradients || (functions.Gradients = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/Literal.ts"/>
///<reference path="../type/Text.ts"/>
///<reference path="../type/Bool.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions_1) {
        var Introspection;
        (function (Introspection) {
            function init(runtime) {
                runtime.register({
                    type_of: function (value) {
                        if (value === true || value === false) {
                            return new Fashion.Literal('bool');
                        }
                        if (value === Fashion.Null) {
                            return new Fashion.Literal('null');
                        }
                        if (value.type == 'hsla' || value.type == 'rgba') {
                            return new Fashion.Literal('color');
                        }
                        if (value.type == 'literal' || value.type == 'string') {
                            return new Fashion.Literal('string');
                        }
                        return new Fashion.Literal(value.type);
                    },
                    unit: function (number) {
                        if (!number.$isFashionNumber) {
                            Fashion.raise(number + ' is not a number for \'unit\'');
                        }
                        return new Fashion.Text(number.getUnitStr() || '');
                    },
                    unitless: function (number) {
                        if (number.type != 'number') {
                            Fashion.raise(number + ' is not a number for \'unitless\'');
                        }
                        return new Fashion.Bool(!number.unit);
                    },
                    comparable: function (number_1, number_2) {
                        if (number_1.type != 'number') {
                            Fashion.raise(number_1 + ' is not a number for \'comparable\'');
                        }
                        if (number_2.type != 'number') {
                            Fashion.raise(number_2 + ' is not a number for \'comparable\'');
                        }
                        return new Fashion.Bool(!!number_1.comparable(number_2));
                    },
                    variable_exists: function (name) {
                        var nameStr = name;
                        if (name.$isFashionString || name.$isFashionLiteral) {
                            nameStr = name.value;
                        }
                        nameStr = Fashion.getJsName(nameStr);
                        if (nameStr.indexOf('$') !== 0) {
                            nameStr = "$" + nameStr;
                        }
                        var scope = this.getRuntime().getCurrentScope();
                        return !!scope.get(nameStr);
                    },
                    global_variable_exists: function (name) {
                        var nameStr = name;
                        if (name.$isFashionString || name.$isFashionLiteral) {
                            nameStr = name.value;
                        }
                        nameStr = Fashion.getJsName(nameStr);
                        if (nameStr.indexOf('$') !== 0) {
                            nameStr = "$" + nameStr;
                        }
                        var scope = this.getRuntime().getGlobalScope();
                        return !!scope.get(nameStr);
                    },
                    function_exists: function (name) {
                        var nameStr = name;
                        if (name.$isFashionString || name.$isFashionLiteral) {
                            nameStr = name.value;
                        }
                        nameStr = Fashion.getJsName(nameStr);
                        var extensions = this.getRuntime().getRegisteredFunctions(), functions = this.getRuntime().getFunctions();
                        return (nameStr in extensions) || (nameStr in functions);
                    },
                    mixin_exists: function (name) {
                        var nameStr = name;
                        if (name.$isFashionString || name.$isFashionLiteral) {
                            nameStr = name.value;
                        }
                        nameStr = Fashion.getJsName(nameStr);
                        var mixins = this.getRuntime().getMixins();
                        return (nameStr in mixins);
                    },
                    call: function (name) {
                        if (!name || !name.$isFashionLiteral) {
                            Fashion.raise(name + ' is not a string or literal for \'call\'');
                        }
                        var args = this.sliceArgs(arguments, 1), runtime = this.getRuntime(), functions = runtime.getFunctions(), extensions = runtime.getRegisteredFunctions(), funcName = Fashion.getJsName(name.value);
                        if (functions[funcName]) {
                            return functions[funcName].apply(functions, args);
                        }
                        else if (extensions[funcName]) {
                            return extensions[funcName].apply(this, args);
                        }
                        return Fashion.Null;
                    }
                });
            }
            Introspection.init = init;
        })(Introspection = functions_1.Introspection || (functions_1.Introspection = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/Numeric.ts"/>
///<reference path="../type/List.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var List;
        (function (List) {
            function init(runtime) {
                runtime.register({
                    length: function (list) {
                        if (list.type !== 'list') {
                            return new Fashion.Numeric(arguments.length);
                        }
                        return new Fashion.Numeric(list.items.length);
                    },
                    nth: function (list, index) {
                        if (list.type !== 'list') {
                            list = new Fashion.List([list]);
                        }
                        if (index.type != 'number' || index.value.toFixed(0) != index.value) {
                            Fashion.raise('List index ' + index + ' must be an integer for \'nth\'');
                        }
                        var value = index.value;
                        if (value < 0) {
                            value = Math.max(1, list.items.length + value + 1);
                        }
                        if (value === 0) {
                            Fashion.raise('List index ' + value + ' must be greater than or equal to 1 for \'nth\'');
                        }
                        if (value - 1 >= list.items.length) {
                            Fashion.raise('List index is ' + value + ' but list is only ' + list.items.length + ' item' + (list.items.length === 1 ? '' : 's') + ' long for \'nth\'');
                        }
                        return list.get(value);
                    },
                    first_value_of: function (list) {
                        if (list.type !== 'list') {
                            list = new Fashion.List([list]);
                        }
                        return this.nth(list, new Fashion.Numeric(1));
                    },
                    last_value_of: function (list) {
                        if (list.type !== 'list') {
                            list = new Fashion.List(list);
                        }
                        return this.nth(list, new Fashion.Numeric(list.items.length));
                    },
                    compact: function () {
                        var list = arguments, items, sep = ', ';
                        if (list.type !== 'list') {
                            list = new Fashion.List(list);
                        }
                        items = list.items;
                        if (items.length == 1 && items[0].type == 'list') {
                            list = items[0];
                            items = list.items;
                            sep = list.separator;
                        }
                        list = new Fashion.List(null, sep);
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            if (this.unbox(item)) {
                                list.add(item);
                            }
                        }
                        return list;
                    },
                    _compass_list_size: function () {
                        var list = arguments;
                        if (list.type !== 'list') {
                            list = new Fashion.List(list);
                        }
                        return new Fashion.Numeric(list.items.length);
                    },
                    join: function (list1, list2, separator) {
                        if (list1.type !== 'list') {
                            list1 = new Fashion.List([list1]);
                            list1.separator = null;
                        }
                        if (list2.type !== 'list') {
                            list2 = new Fashion.List([list2]);
                            list2.separator = null;
                        }
                        if (!separator) {
                            separator = (list1.items.length && list1.separator) || (list2.items.length && list2.separator) || ' ';
                        }
                        if (separator.type === 'literal') {
                            switch (separator.value) {
                                case 'comma':
                                    separator = ', ';
                                    break;
                                case 'space':
                                    separator = ' ';
                                    break;
                                case 'auto':
                                    separator = list1.separator || list2.separator || ' ';
                                    break;
                                default:
                                    Fashion.raise('Separator name must be space, comma, or auto for \'join\'');
                                    break;
                            }
                        }
                        if (separator.type === 'string') {
                            separator = separator.value;
                        }
                        return new Fashion.List(list1.items.concat(list2.items), separator);
                    },
                    append: function () {
                        return this.join.apply(this, arguments);
                    },
                    box: function (list, index) {
                        if (!(list instanceof Fashion.List)) {
                            list = new Fashion.List([list]);
                        }
                        list = list.items.slice();
                        if (index >= list.length) {
                            switch (list.length) {
                                case 1:
                                    list[1] = list[2] = list[3] = list[0];
                                    break;
                                case 2:
                                    list[2] = list[0];
                                    list[3] = list[1];
                                    break;
                                case 3:
                                    list[3] = list[1];
                                    break;
                            }
                        }
                        return list[index - 1];
                    },
                    zip: function () {
                        var lists = this.sliceArgs(arguments), output = [], minLen = -1, list;
                        for (var i = 0; i < lists.length; i++) {
                            list = lists[i].items;
                            if (minLen === -1) {
                                minLen = list.length;
                            }
                            else if (list.length < minLen) {
                                minLen = list.length;
                            }
                        }
                        for (var i = 0; i < minLen; i++) {
                            var newList = [];
                            for (var j = 0; j < lists.length; j++) {
                                newList.push(lists[j].items[i]);
                            }
                            output.push(new Fashion.List(newList, ' '));
                        }
                        return new Fashion.List(output, ', ');
                    }
                });
            }
            List.init = init;
        })(List = functions.List || (functions.List = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../type/Literal.ts"/>
///<reference path="../type/Bool.ts"/>
///<reference path="../Runtime.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Misc;
        (function (Misc) {
            function init(runtime) {
                runtime.register({
                    __if: function (condition, if_true, if_false) {
                        return this.unbox(condition) ? if_true : if_false;
                    },
                    theme_image: function (theme, file) {
                        return new Fashion.Literal('url("resources/images/' + theme.value + '/' + file.value + '")');
                    },
                    prefixed: function (prefix, items) {
                        if (arguments.length > 2) {
                            items = Array.prototype.slice.call(arguments, 1);
                        }
                        prefix = this.unbox(prefix);
                        if (prefix.indexOf("-") === 0) {
                            prefix = prefix.substring(1);
                        }
                        if (!Array.isArray(items)) {
                            if (items.supports && items.supports(prefix)) {
                                return Fashion.True;
                            }
                        }
                        else {
                            var ln = items.length, i, arg;
                            for (i = 0; i < ln; i++) {
                                arg = items[i];
                                if (arg.supports && arg.supports(prefix)) {
                                    return Fashion.True;
                                }
                            }
                        }
                        return Fashion.False;
                    },
                    _owg: function (value) {
                        return new Fashion.Literal(value.toPrefixedString('owg'));
                    },
                    _webkit: function (value) {
                        return new Fashion.Literal(value.toPrefixedString('-webkit-'));
                    },
                    _o: function (value) {
                        return new Fashion.Literal(value.toPrefixedString('-o-'));
                    },
                    _moz: function (value) {
                        return new Fashion.Literal(value.toPrefixedString('-moz-'));
                    }
                });
            }
            Misc.init = init;
        })(Misc = functions.Misc || (functions.Misc = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/Numeric.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Numeric;
        (function (Numeric) {
            function init(runtime) {
                runtime.register({
                    percentage: function (value) {
                        if (value.type != 'number' || value.getUnitStr()) {
                            Fashion.raise(value + ' is not a unitless number for \'percentage\'');
                        }
                        return new Fashion.Numeric(value.value * 100, '%');
                    },
                    round: function (value) {
                        if (value.type !== 'number') {
                            Fashion.raise(value + ' is not a number for \'round\'');
                        }
                        return new Fashion.Numeric(Math.round(value.value), value.unit);
                    },
                    ceil: function (value) {
                        if (value.type !== 'number') {
                            Fashion.raise(value + ' is not a number for \'ceil\'');
                        }
                        return new Fashion.Numeric(Math.ceil(value.value), value.unit);
                    },
                    floor: function (value) {
                        if (value.type !== 'number') {
                            Fashion.raise(value + ' is not a number for \'floor\'');
                        }
                        return new Fashion.Numeric(Math.floor(value.value), value.unit);
                    },
                    abs: function (value) {
                        if (value.type !== 'number') {
                            Fashion.raise(value + ' is not a number for \'abs\'');
                        }
                        return new Fashion.Numeric(Math.abs(value.value), value.unit);
                    },
                    min: function () {
                        var args = this.sliceArgs(arguments), arg, i, min;
                        for (i = 0; i < args.length; i++) {
                            arg = args[i];
                            if (!arg || !arg.$isFashionNumber) {
                                Fashion.raise(arg + ' is not a number for \'min\'');
                            }
                            if (!min || this.unbox(arg.operate('<', min))) {
                                min = arg;
                            }
                        }
                        return min && min.clone();
                    },
                    max: function (a, b) {
                        var args = this.sliceArgs(arguments), arg, i, max;
                        for (i = 0; i < args.length; i++) {
                            arg = args[i];
                            if (!arg || !arg.$isFashionNumber) {
                                Fashion.raise(arg + ' is not a number for \'max\'');
                            }
                            if (!max || this.unbox(arg.operate('>', max))) {
                                max = arg;
                            }
                        }
                        return max && max.clone();
                    }
                });
            }
            Numeric.init = init;
        })(Numeric = functions.Numeric || (functions.Numeric = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/Numeric.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Opacity;
        (function (Opacity) {
            function init(runtime) {
                runtime.register({
                    alpha: function (color) {
                        if (color && color.$isFashionNumber) {
                            return new Fashion.Literal('alpha(' + color.toString() + ')');
                        }
                        color = Array.isArray(color) ? color[0] : color;
                        if (color && color.$isFashionLiteral) {
                            return color;
                        }
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'alpha\'');
                        }
                        return Fashion.Color.component(color, 'alpha');
                    },
                    opacity: function (color) {
                        if (color && color.$isFashionNumber) {
                            return new Fashion.Literal('opacity(' + color.toString() + ')');
                        }
                        color = Array.isArray(color) ? color[0] : color;
                        if (color && color.$isFashionLiteral) {
                            return color;
                        }
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'opacity\'');
                        }
                        return Fashion.Color.component(color, 'alpha');
                    },
                    opacify: function (color, amount) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'opacify\'');
                        }
                        if (amount.type !== 'number') {
                            Fashion.raise(amount + ' is not a number for \'opacify\'');
                        }
                        if (amount.unit == '%') {
                            if (amount.value !== Fashion.Color.constrainPercentage(amount.value)) {
                                Fashion.raise('Amount ' + amount + ' must be between 0% and 100% for \'opacify\'');
                            }
                            amount = new Fashion.Numeric(amount.value / 100);
                        }
                        else if (amount.value !== Fashion.Color.constrainAlpha(amount.value)) {
                            Fashion.raise('Amount ' + amount + ' must be between 0 and 1 for \'opacify\'');
                        }
                        var rgba = color.getRGBA().clone();
                        rgba.a = Math.min(((rgba.a * 100) + (amount.value * 100)) / 100, 1);
                        return rgba;
                    },
                    transparentize: function (color, amount) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'transparentize\'');
                        }
                        if (amount.type !== 'number') {
                            Fashion.raise(amount + ' is not a number for \'transparentize\'');
                        }
                        if (amount.unit == '%') {
                            if (amount.value !== Fashion.Color.constrainPercentage(amount.value)) {
                                Fashion.raise('Amount ' + amount + ' must be between 0% and 100% for \'transparentize\'');
                            }
                            amount = new Fashion.Numeric(amount.value / 100);
                        }
                        else if (amount.value !== Fashion.Color.constrainAlpha(amount.value)) {
                            Fashion.raise('Amount ' + amount + ' must be between 0 and 1 for \'transparentize\'');
                        }
                        var rgba = color.getRGBA().clone();
                        rgba.a = Math.max(((rgba.a * 100) - (amount.value * 100)) / 100, 0);
                        return rgba;
                    },
                    fade_in: function (color, amount) {
                        return this.opacify(color, amount);
                    },
                    fade_out: function (color, amount) {
                        return this.transparentize(color, amount);
                    }
                });
            }
            Opacity.init = init;
        })(Opacity = functions.Opacity || (functions.Opacity = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/Numeric.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var RGB;
        (function (RGB) {
            function init(runtime) {
                runtime.register({
                    rgba: function (red, green, blue, alpha, color) {
                        var colorInst;
                        if (!!red && !!color) {
                            Fashion.raise("Unsupported arguments to RGBA");
                        }
                        if (color && !red) {
                            if (color.$isFashionColor) {
                                colorInst = color;
                            }
                            else {
                                Fashion.raise("Unsupported arguments to RGBA");
                            }
                        }
                        else if (red && red.$isFashionColor) {
                            colorInst = red;
                        }
                        if (colorInst) {
                            alpha = green || alpha;
                            colorInst = colorInst.getRGBA();
                            red = new Fashion.Numeric(colorInst.r);
                            green = new Fashion.Numeric(colorInst.g);
                            blue = new Fashion.Numeric(colorInst.b);
                        }
                        if (!red || !red.$isFashionNumber) {
                            Fashion.raise(red + ' is not a number for \'rgba\' red');
                        }
                        if (!green || !green.$isFashionNumber) {
                            Fashion.raise(green + ' is not a number for \'rgba\' green');
                        }
                        if (!blue || !blue.$isFashionNumber) {
                            Fashion.raise(blue + ' is not a number for \'rgba\' blue');
                        }
                        if (!alpha || !alpha.$isFashionNumber) {
                            Fashion.raise(alpha + ' is not a number for \'rgba\' alpha');
                        }
                        if (red.unit == '%') {
                            red = new Fashion.Numeric(Fashion.Color.constrainPercentage(red.value) / 100 * 255);
                        }
                        else if (red.value !== Fashion.Color.constrainChannel(red.value)) {
                            Fashion.raise('Color value ' + red + ' must be between 0 and 255 inclusive for \'rgba\'');
                        }
                        if (green.unit == '%') {
                            green = new Fashion.Numeric(Fashion.Color.constrainPercentage(green.value) / 100 * 255);
                        }
                        else if (green.value !== Fashion.Color.constrainChannel(green.value)) {
                            Fashion.raise('Color value ' + green + ' must be between 0 and 255 inclusive for \'rgba\'');
                        }
                        if (blue.unit == '%') {
                            blue = new Fashion.Numeric(Fashion.Color.constrainPercentage(blue.value) / 100 * 255);
                        }
                        else if (blue.value !== Fashion.Color.constrainChannel(blue.value)) {
                            Fashion.raise('Color value ' + blue + ' must be between 0 and 255 inclusive for \'rgba\'');
                        }
                        if (alpha.unit == '%') {
                            alpha = new Fashion.Numeric(Fashion.Color.constrainPercentage(alpha.value) / 100);
                        }
                        else if (alpha.value !== Fashion.Color.constrainAlpha(alpha.value)) {
                            Fashion.raise('Alpha channel ' + alpha + ' must be between 0 and 1 inclusive for \'rgba\'');
                        }
                        return new Fashion.ColorRGBA(red.value, green.value, blue.value, alpha.value);
                    },
                    rgb: function (red, green, blue, color) {
                        return this.rgba(red, green, blue, new Fashion.Numeric(1), color);
                    },
                    red: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'red\'');
                        }
                        return Fashion.Color.component(color, 'red');
                    },
                    green: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'green\'');
                        }
                        return Fashion.Color.component(color, 'green');
                    },
                    blue: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'blue\'');
                        }
                        return Fashion.Color.component(color, 'blue');
                    },
                    mix: function (color_1, color_2, weight) {
                        weight = (weight !== undefined) ? weight : new Fashion.Numeric(50, '%');
                        if (color_1.type !== 'hsla' && color_1.type !== 'rgba') {
                            Fashion.raise('arg 1 ' + color_1 + ' is not a color for \'mix\'');
                        }
                        if (color_2.type !== 'hsla' && color_2.type !== 'rgba') {
                            Fashion.raise('arg 2 ' + color_2 + ' is not a color for \'mix\'');
                        }
                        if (weight.type !== 'number') {
                            Fashion.raise('arg 3 ' + weight + ' is not a number for \'mix\'');
                        }
                        if (weight.value !== Fashion.Color.constrainPercentage(weight.value)) {
                            Fashion.raise('Weight ' + weight + ' must be between 0% and 100% for \'mix\'');
                        }
                        color_1 = color_1.getRGBA();
                        color_2 = color_2.getRGBA();
                        weight = weight.value / 100;
                        var factor = (weight * 2) - 1, alpha = color_1.a - color_2.a, weight1 = (((factor * alpha == -1) ? factor : (factor + alpha) / (1 + factor * alpha)) + 1) / 2, weight2 = 1 - weight1;
                        return new Fashion.ColorRGBA((weight1 * color_1.r) + (weight2 * color_2.r), (weight1 * color_1.g) + (weight2 * color_2.g), (weight1 * color_1.b) + (weight2 * color_2.b), (weight * color_1.a) + ((1 - weight) * color_2.a));
                    }
                });
            }
            RGB.init = init;
        })(RGB = functions.RGB || (functions.RGB = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Selectors;
        (function (Selectors) {
            function init(runtime) {
                runtime.register({
                    headers: function (from, to) {
                        var fromVal, toVal, headers = [], h;
                        if (from.$isFashionLiteral && from.value == 'all') {
                            fromVal = 1;
                            toVal = 6;
                        }
                        else {
                            fromVal = this.unbox(from);
                            toVal = this.unbox(to);
                        }
                        for (h = fromVal; h < toVal + 1; h++) {
                            headers.push("h" + h);
                        }
                        return new Fashion.Text(headers.join(", "));
                    },
                    headings: function (from, to) {
                        return this.headers(from, to);
                    }
                });
            }
            Selectors.init = init;
        })(Selectors = functions.Selectors || (functions.Selectors = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="../type/Text.ts"/>
///<reference path="../Runtime.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Text;
        (function (Text) {
            function init(runtime) {
                runtime.register({
                    quote: function (string) {
                        if (!string.$isFashionString && !string.$isFashionLiteral) {
                            Fashion.raise(string + ' is not a string or literal for \'quote\'');
                        }
                        return new Fashion.Text(string.value);
                    },
                    unquote: function (string) {
                        //if (!string.$isFashionString && !string.$isFashionLiteral && !string.$isFashionColor) {
                        //    Fashion.raise(string + ' is not a string or literal for \'unquote\'');
                        //}
                        if (string.$isFashionString) {
                            return new Fashion.Literal(Fashion.Literal.deEscape(string.value));
                        }
                        return string;
                    },
                    str_slice: function (string, start_at, end_at) {
                        if (!string.$isFashionLiteral && !string.$isFashionString) {
                            Fashion.raise(string + ' is not a string or literal for \'str-slice\'');
                        }
                        return string.slice(start_at, end_at);
                    },
                    str_length: function (string) {
                        if (!string.$isFashionLiteral && !string.$isFashionString) {
                            Fashion.raise(string + ' is not a string or literal for \'str-slice\'');
                        }
                        return new Fashion.Numeric(string.value.length);
                    },
                    to_upper_case: function (string) {
                        if (!string.$isFashionLiteral && !string.$isFashionString) {
                            Fashion.raise(string + ' is not a string or literal for \'to-lower-case\'');
                        }
                        return string.toUpperCase();
                    },
                    to_lower_case: function (string) {
                        if (!string.$isFashionLiteral && !string.$isFashionString) {
                            Fashion.raise(string + ' is not a string or literal for \'to-lower-case\'');
                        }
                        return string.toLowerCase();
                    },
                    str_index: function (string, substring) {
                        if (!string.$isFashionLiteral && !string.$isFashionString) {
                            Fashion.raise(string + ' is not a string or literal for \'str-insert\'');
                        }
                        if (!substring.$isFashionLiteral && !substring.$isFashionString) {
                            Fashion.raise(substring + ' is not a string or literal for \'str-insert\'');
                        }
                        return string.indexOf(substring);
                    },
                    str_insert: function (string, insert, index) {
                        if (!string.$isFashionLiteral && !string.$isFashionString) {
                            Fashion.raise(string + ' is not a string or literal for \'str-insert\'');
                        }
                        if (!insert.$isFashionLiteral && !insert.$isFashionString) {
                            Fashion.raise(insert + ' is not a string or literal for \'str-insert\'');
                        }
                        return string.insert(insert, index);
                    }
                });
            }
            Text.init = init;
        })(Text = functions.Text || (functions.Text = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="List.ts"/>
///<reference path="Literal.ts"/>
var Fashion;
(function (Fashion) {
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map(pairs) {
            _super.call(this, pairs);
            this.map = {};
            if (pairs) {
                for (var i = 0; i < pairs.length - 1; i += 2) {
                    var key = this.toKey(pairs[i]), value = pairs[i + 1];
                    this.map[key] = i + 1;
                }
            }
        }
        Map.prototype.doVisit = function (visitor) {
            visitor.map(this);
        };
        Map.prototype.descend = function (visitor) {
            for (var i = 0; i < this.items.length; i++) {
                visitor.visit(this.items[i]);
            }
        };
        Map.prototype.get = function (key) {
            if (key instanceof Fashion.Numeric) {
                key = Fashion.Type.unbox(key);
            }
            if (typeof key === 'number') {
                return new Fashion.List([
                    this.items[(2 * key) - 2],
                    this.items[(2 * key) - 1]
                ], ' ');
            }
            key = this.toKey(key);
            return this.items[this.map[key]] || Fashion.Null;
        };
        Map.prototype.getItems = function () {
            var values = [];
            for (var i = 0; i < this.items.length - 1; i += 2) {
                var key = this.toKey(this.items[i]);
                values.push(this.map[key]);
            }
            return values;
        };
        Map.prototype.put = function (key, value) {
            var keyStr = this.toKey(key);
            if (!this.map.hasOwnProperty(keyStr)) {
                this.items.push(key, value);
                this.map[keyStr] = this.items.length - 1;
            }
            else {
                this.items[this.map[keyStr]] = value;
            }
        };
        Map.prototype.toString = function () {
            var str = '', count = 0;
            for (var i = 0; i < this.items.length - 1; i += 2) {
                var key = this.toKey(this.items[i]), value = this.map[key];
                if (value) {
                    if (count > 0) {
                        str += ', ';
                    }
                    str += key + ": " + value.toString();
                    count++;
                }
            }
            return str;
        };
        Map.prototype.toKey = function (key) {
            return this.unquoteKey(key).toString();
        };
        Map.prototype.unquoteKey = function (string) {
            if (string.$isFashionType) {
                return string.unquote();
            }
            return string;
        };
        return Map;
    }(Fashion.List));
    Fashion.Map = Map;
    Fashion.apply(Map.prototype, {
        type: "map",
        $isFashionMap: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../Env.ts"/>
///<reference path="../type/Text.ts"/>
///<reference path="../type/Map.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var Util;
        (function (Util) {
            function init(runtime) {
                runtime.register({
                    map_create: function () {
                        return new Fashion.Map();
                    },
                    map_put: function (map, key, value) {
                        map.put(key, value);
                    },
                    map_get: function (map, key) {
                        return map.get(key);
                    },
                    parsebox: function (list, num) {
                        var ret, size, actual = [], i;
                        num = this.unbox(num);
                        if (list.type === 'list') {
                            list = list.items;
                        }
                        if (!this.isArray(list)) {
                            list = [list];
                        }
                        size = list.length;
                        for (i = 0; i < size; i++) {
                            actual.push(list[i]);
                        }
                        if (num >= size) {
                            if (size === 1) {
                                actual.push(list[0]);
                                actual.push(list[0]);
                                actual.push(list[0]);
                            }
                            else if (size === 2) {
                                actual.push(list[0]);
                                actual.push(list[1]);
                            }
                            else if (size === 3) {
                                actual.push(list[1]);
                            }
                        }
                        ret = actual[num - 1];
                        return ret;
                    },
                    is_null: function (value) {
                        if (value === Fashion.Null) {
                            return true;
                        }
                        switch (value.type) {
                            case 'string':
                            case 'literal':
                                value = value.value;
                                return value == 'null' || value == 'none' || value === null;
                            default:
                                return false;
                        }
                    },
                    file_join: function (value1, value2) {
                        value1 = this.unbox(value1);
                        value2 = this.unbox(value2);
                        var joined = value1 ? value1 + '/' + value2 : value2;
                        return new Fashion.Text(joined, '');
                    },
                    theme_image_exists: function (directory, path) {
                        // don't use this.unbox here, as we need the actual unquoted value
                        directory = directory.value;
                        path = path.value;
                        var fullPath = Fashion.Env.join(directory, path);
                        if (Fashion.Env.isBrowser) {
                            return true;
                        }
                        return Fashion.Env.exists(fullPath);
                    }
                });
            }
            Util.init = init;
        })(Util = functions.Util || (functions.Util = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="Type.ts"/>
///<reference path="List.ts"/>
var Fashion;
(function (Fashion) {
    var FunctionCall = (function (_super) {
        __extends(FunctionCall, _super);
        function FunctionCall(name, args) {
            _super.call(this);
            this.name = name;
            this.args = args;
        }
        FunctionCall.prototype.toString = function () {
            var args = this.args, argsStr;
            if (Array.isArray(args)) {
                argsStr = args.join(', ');
            }
            else {
                argsStr = args.toString();
            }
            return this.name + "(" + argsStr + ')';
        };
        FunctionCall.prototype.doVisit = function (visitor) {
            visitor.functioncall(this);
        };
        FunctionCall.prototype.descend = function (visitor) {
            this.args && visitor.visit(this.args);
        };
        return FunctionCall;
    }(Fashion.Type));
    Fashion.FunctionCall = FunctionCall;
    Fashion.apply(FunctionCall.prototype, {
        type: 'functioncall',
        $isFashionFunctionCall: true,
        $canUnbox: false
    });
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../type/FunctionCall.ts"/>
var Fashion;
(function (Fashion) {
    var processors;
    (function (processors) {
        var NameRegistrations;
        (function (NameRegistrations) {
            function init(runtime) {
                var selectorHooks = {}, styleHooks = {}, atRuleHooks = {}, functionCallHooks = {}, registered = false;
                function register() {
                    if (registered) {
                        return;
                    }
                    registered = true;
                    runtime.registerProcessor({
                        runHooks: function (obj, hooks) {
                            if (hooks) {
                                for (var h = 0; h < hooks.length; h++) {
                                    hooks[h].call(this, obj, this.context);
                                }
                            }
                        },
                        functioncall: function (obj) {
                            this.runHooks(obj, functionCallHooks[obj.name]);
                        },
                        declaration: function (obj) {
                            this.runHooks(obj, styleHooks[obj.property]);
                            obj.descend(this);
                        },
                        // process selectors for registered name watches
                        ruleset: function (obj) {
                            var selectors = obj.selectors;
                            if (selectors instanceof Fashion.SelectorList) {
                                selectors = selectors.items;
                            }
                            else {
                                selectors = [selectors];
                            }
                            for (var s = 0; s < selectors.length; s++) {
                                if (selectors[s]) {
                                    this.runHooks(obj, selectorHooks[selectors[s].toString()]);
                                }
                            }
                            if (obj.isAtRule()) {
                                this.runHooks(obj, atRuleHooks[obj.getFirstSelectorStr()]);
                            }
                            this.visit(obj.declarations);
                            this.visit(obj.children);
                        },
                        execute: function (obj, ctx) {
                            this.context = ctx;
                            this.visit(obj);
                            this.context = null;
                        }
                    });
                }
                ;
                function registerHooks(map, obj) {
                    register();
                    var hooks;
                    for (var key in obj) {
                        hooks = map[key];
                        if (!hooks) {
                            hooks = map[key] = [];
                        }
                        hooks.push(obj[key]);
                    }
                }
                runtime.registerSelectorHooks = function (obj) {
                    registerHooks(selectorHooks, obj);
                };
                runtime.registerAtRuleHook = function (obj) {
                    registerHooks(atRuleHooks, obj);
                };
                runtime.registerStyleHooks = function (obj) {
                    registerHooks(styleHooks, obj);
                };
                runtime.registerFunctionCallHooks = function (obj) {
                    registerHooks(functionCallHooks, obj);
                };
            }
            NameRegistrations.init = init;
        })(NameRegistrations = processors.NameRegistrations || (processors.NameRegistrations = {}));
    })(processors = Fashion.processors || (Fashion.processors = {}));
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
///<reference path="../Base.ts"/>
///<reference path="../type/ColorHSLA.ts"/>
///<reference path="../type/Numeric.ts"/>
var Fashion;
(function (Fashion) {
    var functions;
    (function (functions) {
        var HSL;
        (function (HSL) {
            function init(runtime) {
                runtime.register({
                    hsla: function (hue, saturation, lightness, alpha) {
                        if (arguments.length != 4) {
                            Fashion.raise('Wrong number of arguments (' + arguments.length + ' for 4) for \'hsla\'');
                        }
                        if (!hue.$isFashionNumber) {
                            Fashion.raise(hue + ' is not a number for \'hsla\'');
                        }
                        if (!saturation.$isFashionNumber) {
                            Fashion.raise(saturation + ' is not a number for \'hsla\'');
                        }
                        if (!lightness.$isFashionNumber) {
                            Fashion.raise(lightness + ' is not a number for \'hsla\'');
                        }
                        if (!alpha.$isFashionNumber) {
                            Fashion.raise(alpha + ' is not a number for \'hsla\'');
                        }
                        if (saturation.value !== Fashion.Color.constrainPercentage(saturation.value)) {
                            Fashion.raise('Saturation ' + saturation + ' must be between 0% and 100% for \'hsla\'');
                        }
                        if (lightness.value !== Fashion.Color.constrainPercentage(lightness.value)) {
                            Fashion.raise('Lightness ' + lightness + ' must be between 0% and 100% for \'hsla\'');
                        }
                        if (alpha.value !== Fashion.Color.constrainAlpha(alpha.value)) {
                            Fashion.raise('Alpha channel ' + alpha + ' must be between 0 and 1 for \'hsla\'');
                        }
                        return new Fashion.ColorHSLA(hue.value, saturation.value, lightness.value, alpha.value);
                    },
                    hsl: function (hue, saturation, lightness) {
                        var len = arguments.length;
                        if (len != 3) {
                            Fashion.raise('Wrong number of arguments (' + len + ' for 3) for \'hsl\'');
                        }
                        return this.hsla(hue, saturation, lightness, new Fashion.Numeric(1));
                    },
                    hue: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'hue\'');
                        }
                        return Fashion.Color.component(color, 'hue');
                    },
                    saturation: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'saturation\'');
                        }
                        return Fashion.Color.component(color, 'saturation');
                    },
                    lightness: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'lightness\'');
                        }
                        return Fashion.Color.component(color, 'lightness');
                    },
                    adjust_hue: function (color, degrees) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'adjust-hue\'');
                        }
                        if (degrees.type !== 'number') {
                            Fashion.raise(degrees + ' is not a number for \'adjust-hue\'');
                        }
                        //if (degrees.value < -360 || degrees.value > 360) {
                        //    Fashion.raise('Amount ' + degrees + ' must be between 0deg and 360deg for \'adjust-hue\'');
                        //}
                        return Fashion.Color.adjust(color, 'hue', degrees);
                    },
                    lighten: function (color, amount) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'lighten\'');
                        }
                        if (amount.type !== 'number') {
                            Fashion.raise(amount + ' is not a number for \'lighten\'');
                        }
                        if (amount.value !== Fashion.Color.constrainPercentage(amount.value)) {
                            Fashion.raise('Amount ' + amount + ' must be between 0% and 100% for \'lighten\'');
                        }
                        return Fashion.Color.adjust(color, 'lightness', amount);
                    },
                    darken: function (color, amount) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'darken\'');
                        }
                        if (amount.type !== 'number') {
                            Fashion.raise(amount + ' is not a number for \'darken\'');
                        }
                        if (amount.value !== Fashion.Color.constrainPercentage(amount.value)) {
                            Fashion.raise('Amount ' + amount + ' must be between 0% and 100% for \'darken\'');
                        }
                        amount = amount.clone();
                        amount.value *= -1;
                        return Fashion.Color.adjust(color, 'lightness', amount);
                    },
                    saturate: function (color, amount) {
                        if (!amount) {
                            return new Fashion.Literal('saturate(' + color.toString() + ')');
                        }
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'saturate\'');
                        }
                        if (amount.type !== 'number') {
                            Fashion.raise(amount + ' is not a number for \'saturate\'');
                        }
                        if (amount.value !== Fashion.Color.constrainPercentage(amount.value)) {
                            Fashion.raise('Amount ' + amount + ' must be between 0% and 100% for \'saturate\'');
                        }
                        return Fashion.Color.adjust(color, 'saturation', amount);
                    },
                    desaturate: function (color, amount) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'desaturate\'');
                        }
                        if (amount.type !== 'number') {
                            Fashion.raise(amount + ' is not a number for \'desaturate\'');
                        }
                        if (amount.value !== Fashion.Color.constrainPercentage(amount.value)) {
                            Fashion.raise('Amount ' + amount + ' must be between 0% and 100% for \'desaturate\'');
                        }
                        amount.value *= -1;
                        return Fashion.Color.adjust(color, 'saturation', amount);
                    },
                    grayscale: function (color) {
                        if (color.$isFashionNumber) {
                            return new Fashion.Literal('grayscale(' + color.toString() + ')');
                        }
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'grayscale\'');
                        }
                        return this.desaturate(color, new Fashion.Numeric(100, '%'));
                    },
                    complement: function (color) {
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'complement\'');
                        }
                        return this.adjust_hue(color, new Fashion.Numeric(180, 'deg'));
                    },
                    invert: function (color) {
                        if (color.$isFashionNumber) {
                            return new Fashion.Literal('invert(' + color.toString() + ')');
                        }
                        if (color.type !== 'hsla' && color.type !== 'rgba') {
                            Fashion.raise(color + ' is not a color for \'invert\'');
                        }
                        color = color.getRGBA();
                        return new Fashion.ColorRGBA(255 - color.r, 255 - color.g, 255 - color.b, color.a);
                    }
                });
            }
            HSL.init = init;
        })(HSL = functions.HSL || (functions.HSL = {}));
    })(functions = Fashion.functions || (Fashion.functions = {}));
})(Fashion || (Fashion = {}));
///<reference path="Type.ts"/>
///<reference path="Literal.ts"/>
///<reference path="Text.ts"/>
///<reference path="Numeric.ts"/>
///<reference path="Bool.ts"/>
var Fashion;
(function (Fashion) {
    //---------------------------------------------------------------
    // Statics
    function unboxType(expression) {
        var val = expression;
        if (val && val.$isFashionType && val.$canUnbox) {
            val = val.value;
            if (expression.$isFashionString) {
                if (val === 'none' || val === 'null') {
                    val = null;
                }
            }
            else if (expression.$isFashionLiteral) {
                if (val === 'null') {
                    val = null;
                }
            }
            else if (expression.$isFashionList) {
                val = expression.items;
            }
        }
        return val;
    }
    Fashion.unboxType = unboxType;
    ;
    function boxType(expression) {
        if (expression && expression.$isFashionType) {
            return expression;
        }
        if (expression == null) {
            return Fashion.Null;
        }
        if (expression === true) {
            return Fashion.True;
        }
        if (expression === false) {
            return Fashion.False;
        }
        var typeOf = typeof expression;
        switch (typeOf) {
            case 'string':
                return new Fashion.Text(expression);
            case 'number':
                return new Fashion.Numeric(expression);
            default:
                break;
        }
        return expression;
    }
    Fashion.boxType = boxType;
    ;
    function operateType(operation, left, right) {
        return left.performOperation(operation, right);
    }
    Fashion.operateType = operateType;
    ;
    Fashion.Type.operate = operateType;
    Fashion.Type.unbox = unboxType;
    Fashion.Type.box = boxType;
})(Fashion || (Fashion = {}));
///<reference path="../Runtime.ts"/>
var Fashion;
(function (Fashion) {
    var processors;
    (function (processors) {
        var DataInline;
        (function (DataInline) {
            function init(runtime) {
                var mimeTypeMap = {
                    otf: 'font-opentype',
                    eot: 'application/vnd.ms-fontobject',
                    ttf: 'font/truetype',
                    svg: 'image/svg+xml',
                    woff: 'application/x-font-woff',
                    woff2: 'application/x-font-woff2',
                    gif: 'image/gif',
                    png: 'image/png'
                }, report = false, excludes = [], includes = [], maxItemSize = -1;
                runtime.registerProcessor({
                    getSourceFromCall: function (obj) {
                        var args = obj.args, source;
                        if (args.items) {
                            args = args.items;
                        }
                        if (!Array.isArray(args)) {
                            args = [args];
                        }
                        if (args.length === 1) {
                            source = args[0];
                        }
                        if (source.value) {
                            source = source.value;
                        }
                        else {
                            source = source.toString();
                        }
                        return source;
                    },
                    getSubstring: function (source, char) {
                        var idx = source.indexOf(char);
                        if (idx > -1) {
                            source = source.substring(0, idx);
                        }
                        return source;
                    },
                    detectExtension: function (source) {
                        source = this.getSubstring(source, '#');
                        source = this.getSubstring(source, '?');
                        var idx = source.lastIndexOf('.'), extension = source.substring(idx + 1);
                        return extension;
                    },
                    detectMimeType: function (source) {
                        var extension = this.detectExtension(source), mapped = mimeTypeMap[extension];
                        return mapped || 'application/octet-stream';
                    },
                    encodeBytes: function (bytes) {
                        var str = '';
                        for (var i = 0; i < bytes.length; i++) {
                            str += String.fromCharCode(bytes[i]);
                        }
                        return btoa(str);
                    },
                    isMatch: function (source, filters) {
                        for (var f = 0; f < filters.length; f++) {
                            if (filters[f].test(source)) {
                                return true;
                            }
                        }
                        return false;
                    },
                    isExcluded: function (source) {
                        return this.isMatch(source, excludes);
                    },
                    isIncluded: function (source) {
                        return this.isMatch(source, includes);
                    },
                    inlineUrl: function (obj, mimeType, charset) {
                        var me = this, context = me.context, cache = context.cache || (context.cache = {}), source = me.getSourceFromCall(obj), url, queue, extension, inlineTag, inlineExtensionTag, skip;
                        if (!source) {
                            return;
                        }
                        mimeType = mimeType || me.detectMimeType(source);
                        charset = charset || "UTF-8";
                        url = me.basePath + '/' + source;
                        extension = this.detectExtension(url);
                        inlineTag = obj.hasTag('inline');
                        inlineExtensionTag = obj.hasTag('inline\\:' + extension);
                        skip = false;
                        if (this.isExcluded(source)) {
                            skip = true;
                        }
                        else if (this.isIncluded(source)) {
                            skip = false;
                        }
                        else if (inlineExtensionTag === false) {
                            skip = true;
                        }
                        else if (inlineExtensionTag === null && inlineTag === false) {
                            skip = true;
                        }
                        if (skip) {
                            return;
                        }
                        queue = cache[url] || function () {
                            var token = {
                                nodes: [],
                                url: url
                            };
                            Fashion.Env.doRequest({
                                url: url,
                                async: true,
                                binary: true,
                                params: {
                                    _dc: new Date().getTime()
                                },
                                onComplete: function (options, xhr) {
                                    var bytes, data, arg, optNode;
                                    try {
                                        // 'getBinaryData' method provided on xhr by doRequest
                                        bytes = xhr.getBinaryData();
                                        data = me.encodeBytes(bytes);
                                        arg = new Fashion.Literal(encodeURI([
                                            "data:",
                                            mimeType,
                                            charset ? ';charset=' + charset : '',
                                            ';base64',
                                            ',',
                                            data
                                        ].join('')));
                                        Fashion.debug("creating inline data node for : " + url);
                                        optNode = new Fashion.FunctionCall('url', [arg]);
                                    }
                                    catch (e) {
                                        Fashion.error(e);
                                    }
                                    if (maxItemSize > -1) {
                                        if (arg.value.length > maxItemSize) {
                                            // if we exceeded the limit, disable the optimization node
                                            optNode = null;
                                        }
                                    }
                                    if (optNode && report) {
                                        var size = data.length, num = token.nodes.length;
                                        Fashion.log(num + " * " + size + " bytes for " + url + ".");
                                    }
                                    // loop over all nodes in the nodes array
                                    // using the visitTarget property to override
                                    // the node and call context.ready.unblock()
                                    for (var n = 0; n < token.nodes.length; n++) {
                                        if (optNode) {
                                            var node = token.nodes[n];
                                            node.visitTarget = optNode;
                                        }
                                        context.ready.unblock();
                                    }
                                },
                                onError: function (options, xhr) {
                                    for (var n = 0; n < token.nodes.length; n++) {
                                        context.ready.unblock();
                                    }
                                }
                            });
                            return token;
                        }();
                        queue.nodes.push(obj);
                        context.ready.block();
                    },
                    functioncall: function (obj) {
                        var name = obj.name;
                        if (name === 'url') {
                            if (this.fontFace) {
                                this.inlineUrl(obj);
                            }
                            else if (this.currDeclaration) {
                                var name = this.currDeclaration.property;
                                if (name === 'background-image') {
                                    this.inlineUrl(obj);
                                }
                            }
                        }
                    },
                    declaration: function (obj) {
                        var declWas = this.declaration;
                        this.currDeclaration = obj;
                        obj.descend(this);
                        this.currDeclaration = declWas;
                    },
                    ruleset: function (obj) {
                        var ffWas = this.fontFace, rulesetWas = this.currRuleset;
                        this.currRuleset = obj;
                        if (obj.isAtRule()) {
                            if (obj.getFirstSelectorStr() === '@font-face') {
                                this.fontFace = obj;
                            }
                        }
                        obj.descend(this);
                        this.currRuleset = rulesetWas;
                        this.fontFace = ffWas;
                    },
                    execute: function (obj, ctx) {
                        this.context = ctx;
                        this.basePath = runtime.context.getConfig('basePath');
                        var config = runtime.context.getConfig('inliner');
                        if (config && config.enable) {
                            if (config.report) {
                                report = config.report;
                            }
                            if (config.excludes) {
                                for (var i = 0; i < config.excludes.length; i++) {
                                    excludes.push(new RegExp(config.excludes[i]));
                                }
                            }
                            if (config.includes) {
                                for (var i = 0; i < config.includes.length; i++) {
                                    includes.push(new RegExp(config.includes[i]));
                                }
                            }
                            maxItemSize = config.maxItemSize || -1;
                            this.visit(obj);
                        }
                    }
                });
            }
            DataInline.init = init;
        })(DataInline = processors.DataInline || (processors.DataInline = {}));
    })(processors = Fashion.processors || (Fashion.processors = {}));
})(Fashion || (Fashion = {}));
///<reference path="Base.ts"/>
///<reference path="type/Color.ts"/>
///<reference path="type/ColorRGBA.ts"/>
///<reference path="type/Bool.ts"/>
///<reference path="type/Text.ts"/>
///<reference path="type/Literal.ts"/>
///<reference path="CSS.ts"/>
///<reference path="type/Ruleset.ts"/>
///<reference path="functions/Color.ts"/>
///<reference path="functions/Gradients.ts"/>
///<reference path="functions/Introspection.ts"/>
///<reference path="functions/List.ts"/>
///<reference path="functions/Misc.ts"/>
///<reference path="functions/Numeric.ts"/>
///<reference path="functions/Opacity.ts"/>
///<reference path="functions/RGB.ts"/>
///<reference path="functions/Selectors.ts"/>
///<reference path="functions/Text.ts"/>
///<reference path="functions/Util.ts"/>
///<reference path="processors/NameRegistrations.ts"/>
///<reference path="type/Type.ts"/>
///<reference path="functions/HSL.ts"/>
///<reference path="type/Statics.ts"/>
///<reference path="processors/DataInline.ts"/>
var Fashion;
(function (Fashion) {
    var ChainScope = (function () {
        function ChainScope(prev) {
            this.$isScope = true;
            this.prev = prev;
            this.map = prev ? Fashion.chain(prev.map) : {};
        }
        ChainScope.prototype.get = function (name) {
            return this.map[name];
        };
        ChainScope.prototype.has = function (name) {
            return name in this.map;
        };
        ChainScope.prototype.put = function (name, value) {
            this.map[name] = value;
            return value;
        };
        ChainScope.prototype.addEntries = function (names) {
            for (var name in this.map) {
                names[name] = this.map[name];
            }
        };
        ChainScope.prototype.getEntries = function (entries) {
            entries = entries || {};
            this.addEntries(entries);
            return entries;
        };
        return ChainScope;
    }());
    Fashion.ChainScope = ChainScope;
    var Scope = (function () {
        function Scope(prev) {
            this.$isScope = true;
            this.prev = prev;
            this.map = {};
            //this.map = prev ? chain(prev.map) : {};
        }
        Scope.prototype.get = function (name) {
            //return this.map[name];
            var map = this.map, prev = this, value;
            while (map) {
                value = map[name];
                if (value) {
                    return value;
                }
                prev = prev.prev;
                map = prev && prev.map;
            }
            return value;
        };
        Scope.prototype.has = function (name) {
            //return name in this.map;
            var map = this.map, prev = this;
            while (map) {
                if (name in map) {
                    return true;
                }
                prev = prev.prev;
                map = prev && prev.map;
            }
            return false;
        };
        Scope.prototype.put = function (name, value) {
            this.map[name] = value;
            return value;
        };
        Scope.prototype.addEntries = function (names) {
            if (this.prev) {
                this.prev.addEntries(names);
            }
            for (var name in this.map) {
                names[name] = this.map[name];
            }
        };
        Scope.prototype.getEntries = function (entries) {
            entries = entries || {};
            this.addEntries(entries);
            return entries;
        };
        return Scope;
    }());
    Fashion.Scope = Scope;
    var ValueWrapper = (function () {
        function ValueWrapper(scope, name, value) {
            this.$isWrapper = true;
            this.scope = scope;
            if (name) {
                this.name = name;
                scope.put(name, this);
            }
            if (value) {
                this.value = value;
            }
        }
        ValueWrapper.prototype.toString = function () {
            return this.value + '';
        };
        return ValueWrapper;
    }());
    Fashion.ValueWrapper = ValueWrapper;
    var Runtime = (function (_super) {
        __extends(Runtime, _super);
        function Runtime(config) {
            _super.call(this, config);
            this.isFashionRuntime = true;
            //-----------------------------------------------------------------
            this.mediaTest = /@media/;
            this.keyframesTest = /@.*?keyframes/;
            this.reserved = {
                'if': true,
                'else': true
            };
            this.processors = [];
            this.registered = {
                unbox: Fashion.unboxType,
                isArray: Array.isArray,
                handleArgs: function (args, keys) {
                    var scope = {}, index = 0, key;
                    for (var a = 0; a < args.length; a++) {
                        var arg = args[a];
                        if (arg === undefined) {
                            continue;
                        }
                        // Named arguments
                        if (arg === true || arg === false) {
                            scope[keys[index]] = arg;
                            index++;
                        }
                        else if (arg.type === undefined) {
                            for (key in arg) {
                                scope[key.replace(/^\$/, '')] = arg[key];
                            }
                        }
                        else {
                            key = keys[index];
                            if (key instanceof Array) {
                                key = key[0];
                                scope[key] = scope[key] || new Fashion.List();
                                scope[key].add(arg);
                            }
                            else {
                                scope[key] = arg;
                                index++;
                            }
                        }
                    }
                    return scope;
                },
                sliceArgs: function (args, start, end) {
                    return this.getRuntime().sliceArgs(args, start, end).items;
                },
                tailArgs: function (start, args) {
                    var tail = Array.prototype.slice.call(args, start);
                    if (tail.length == 1 && this.isArray(tail)) {
                        tail = tail[0];
                    }
                    return tail;
                }
            };
            this.mixins = {};
            this.functions = {};
            Fashion.functions.Color.init(this);
            Fashion.functions.Gradients.init(this);
            Fashion.functions.HSL.init(this);
            Fashion.functions.Introspection.init(this);
            Fashion.functions.List.init(this);
            Fashion.functions.Misc.init(this);
            Fashion.functions.Numeric.init(this);
            Fashion.functions.Opacity.init(this);
            Fashion.functions.RGB.init(this);
            Fashion.functions.Selectors.init(this);
            Fashion.functions.Text.init(this);
            Fashion.functions.Util.init(this);
            Fashion.processors.NameRegistrations.init(this);
            Fashion.processors.DataInline.init(this);
            var me = this;
            this.registered.getRuntime = function () {
                return me;
            };
        }
        Runtime.prototype.bool = function (value) {
            return new Fashion.Bool(value);
        };
        Runtime.prototype.color = function (name) {
            var rgb = Fashion.Color.map[name], color = new Fashion.ColorRGBA(rgb[0], rgb[1], rgb[2], rgb[3]);
            color.stringified = name;
            return color;
        };
        Runtime.prototype.quote = function (value) {
            if (value.type === 'string') {
                return value;
            }
            return new Fashion.Text(value.toString());
        };
        Runtime.prototype.unquote = function (value) {
            if (value.$isFashionType) {
                return value.unquote();
            }
            return new Fashion.Literal(value.toString());
        };
        Runtime.prototype.ruleset = function (selectors, sourceInfo, docs, blockDocs, hasBlock) {
            var ruleset = this.openRuleset(selectors);
            ruleset.sourceInfo = sourceInfo;
            ruleset.docs = docs;
            ruleset.blockDocs = blockDocs;
            ruleset.hasBlock = hasBlock;
            return ruleset;
        };
        Runtime.prototype.rulesetDone = function () {
            var current = this.closeRuleset();
            this.printRuleset(current);
            return current;
        };
        Runtime.prototype.namespacedRuleset = function (ns) {
            var ruleset = this.openRuleset(new Fashion.SelectorList([]));
            ruleset.isNamespaced = true;
            ruleset.parent.removeChildRuleset(ruleset);
            ruleset.parent = null;
            ns = ns.toString();
            this.rulesets.pop();
            this.declare(ns, ruleset);
            this.rulesets.push(ruleset);
        };
        Runtime.prototype.declare = function (property, value, important, sourceInfo, docs) {
            var isNull = false;
            if (value.$isFashionList && value.items.length === 1) {
                value = value.items[0];
            }
            if (typeof value === 'undefined' || value === null || value === Fashion.Null) {
                isNull = true;
            }
            //if (value && value.$isFashionLiteral && value.value === 'null') {
            //    isNull = true;
            //}
            if (!isNull || important) {
                this.getCurrentRuleset().addDeclaration(new Fashion.Declaration({
                    property: property,
                    value: value,
                    important: important,
                    sourceInfo: sourceInfo,
                    docs: docs
                }));
            }
        };
        Runtime.prototype.extendSelector = function (selector) {
            var current = this.getCurrentRuleset();
            if (!current.extend) {
                this.extenders.push(current);
                current.extend = [];
            }
            current.extend.push(selector);
        };
        Runtime.prototype.operate = function (operation, left, right) {
            return this.box(left).operate(operation, this.box(right));
        };
        Runtime.prototype.not = function (expression) {
            return this.box(this.unbox(expression) == false);
        };
        Runtime.prototype.unbox = function (val) {
            return Fashion.Type.unbox(val);
        };
        Runtime.prototype.box = function (val) {
            return Fashion.Type.box(val);
        };
        Runtime.prototype.getDefault = function (val) {
            if (val == null || typeof val === 'undefined') {
                return undefined;
            }
            if (val === Fashion.Null) {
                if (Fashion.Runtime.allowNullDefaults) {
                    return val;
                }
                return undefined;
            }
            return this.box(val);
        };
        Runtime.prototype.openRuleset = function (selectors) {
            var current = this.getCurrentRuleset(), ruleset = new Fashion.Ruleset({
                selectors: selectors,
                parent: current
            });
            if (current) {
                current.addChildRuleset(ruleset);
            }
            this.rulesets.push(ruleset);
            return ruleset;
        };
        Runtime.prototype.closeRuleset = function () {
            return this.rulesets.pop();
        };
        Runtime.prototype.getCurrentRuleset = function () {
            var rulesets = this.rulesets;
            return rulesets[rulesets.length - 1];
        };
        Runtime.prototype.getCurrentRulesets = function () {
            return this.rulesets;
        };
        Runtime.prototype.addDirectiveRuleset = function (name, value) {
            this.printRuleset(new Fashion.Ruleset({
                isAtDirective: true,
                atDirectiveName: name,
                atDirectiveValue: value
            }));
        };
        Runtime.prototype.printRuleset = function (ruleset) {
            if (!ruleset.parent && !ruleset.isNamespaced) {
                this.css.addRuleset(ruleset);
            }
        };
        Runtime.prototype.reset = function () {
            this.css = new Fashion.CSS({ context: this.context });
            this.css.processors = this.processors.slice();
            this._currentScope = null;
            this._globalScope = this.createScope();
            this._dynamics = {};
            this.rulesets = [];
            this.extenders = [];
        };
        Runtime.prototype.run = function (code, metadata) {
            this.load(code);
            this.compile(code);
            return this.execute(metadata);
        };
        Runtime.prototype.createWrappedFn = function (code) {
            return new Function('Fashion', '__rt', '__gs', '__udf', '__dyn', code);
        };
        Runtime.prototype.callWrappedFn = function (fn, dynamics) {
            return fn(Fashion, this, this._globalScope, undefined, dynamics || {});
        };
        Runtime.prototype.compile = function (code) {
            var me = this, theFn;
            //code = '"use strict";\n' + code;
            this.code = code;
            new Function();
            theFn = this.createWrappedFn(code);
            this.fn = function (rt, overrides, dyn) {
                var runtime = rt || me, dynamics = dyn || {};
                runtime.reset();
                if (overrides) {
                    if (overrides.$isScope) {
                        runtime._globalScope = overrides;
                    }
                    else {
                        runtime._globalScope.map = overrides;
                    }
                }
                runtime._currentScope = runtime._globalScope;
                runtime._scopeStack = [runtime._currentScope];
                theFn(Fashion, runtime, runtime._globalScope, undefined, dynamics);
                runtime.css.extenders = runtime.extenders;
                return runtime.css;
            };
            return this.fn;
        };
        Runtime.prototype.execute = function (metadata) {
            return this.fn(this, metadata);
        };
        Runtime.prototype.load = function (code) {
            this.code = code;
            return this;
        };
        Runtime.prototype.registerProcessor = function (proc) {
            this.processors.push(new Fashion.TypeVisitor(proc));
        };
        Runtime.prototype.register = function (methods) {
            if (methods['dynamic']) {
                Fashion.error('Cannot register javascript function named "dynamic"');
                delete methods['dynamic'];
            }
            if (methods['require']) {
                Fashion.error('Cannot register javascript function named "require"');
                delete methods['require'];
            }
            Fashion.apply(this.registered, methods);
        };
        Runtime.prototype.isRegistered = function (name) {
            name = this.reserved[name] ? '__' + name : name;
            return !!this.registered[name];
        };
        Runtime.prototype.getGlobalScope = function () {
            return this._globalScope;
        };
        Runtime.prototype.getCurrentScope = function () {
            return this._currentScope;
        };
        Runtime.prototype.getRegisteredFunctions = function () {
            return this.registered;
        };
        Runtime.prototype.getFunctions = function () {
            return this.functions;
        };
        Runtime.prototype.getMixins = function () {
            return this.mixins;
        };
        Runtime.prototype.createScope = function (scope) {
            var currScope = scope || this._currentScope, newScope = new Scope(currScope);
            return this.pushScope(newScope);
        };
        Runtime.prototype.pushScope = function (scope) {
            scope.resetScope = this._currentScope;
            this._currentScope = scope;
            return scope;
        };
        Runtime.prototype.popScope = function () {
            this._currentScope = this._currentScope.resetScope;
            return this._currentScope;
        };
        Runtime.prototype.get = function (name) {
            var res = this._currentScope.get(name);
            if (res) {
                if (res.$isWrapper) {
                    return this.box(res.value);
                }
            }
            if (typeof res === 'undefined') {
                if (!this._currentScope.has(name)) {
                    Fashion.raise('Reference to undeclared variable : ' + name);
                }
            }
            return this.box(res);
        };
        Runtime.prototype.set = function (name, value, createLocal, isGlobal, isDefault, dynamics) {
            var currScope = isGlobal ? this._globalScope : this._currentScope, obj = currScope.get(name) || new ValueWrapper(currScope, name);
            if (createLocal && obj.scope !== currScope) {
                obj = new ValueWrapper(currScope, name);
            }
            if (dynamics) {
                isDefault = isDefault || (name in dynamics && this._globalScope.has(name));
            }
            obj.value = (isDefault) ? this.getDefault(obj.value) || value : value;
            return value;
        };
        Runtime.prototype.getDocs = function (id) {
            if (this.docCache) {
                return this.docCache.get(id);
            }
        };
        Runtime.prototype.getString = function (id) {
            if (this.stringCache) {
                return this.stringCache.get(id);
            }
        };
        Runtime.prototype.applySplat = function (arg) {
            arg.splat = true;
            return arg;
        };
        Runtime.prototype.sliceArgs = function (args, start, end) {
            start = start || 0;
            end = end || args.length;
            var filtered = [], newArgs = [], separator = ', ', splat, a, arg;
            for (a = start; a < end; a++) {
                arg = args[a];
                if (!arg) {
                    if (!splat) {
                        filtered.push(arg);
                    }
                    continue;
                }
                if (arg.splat && arg.$isFashionList) {
                    if (splat) {
                        filtered.push(splat);
                    }
                    splat = arg;
                    separator = splat.separator || separator;
                }
                else {
                    filtered.push(arg);
                }
            }
            for (a = 0; a < filtered.length; a++) {
                arg = filtered[a];
                separator = (arg && arg.splatSeparator) || separator;
                newArgs.push(filtered[a]);
            }
            if (splat) {
                newArgs.push.apply(newArgs, splat.items);
            }
            return new Fashion.List(newArgs, separator);
        };
        Runtime.prototype.applySplatArgs = function (args) {
            var newArgs = [], arg, a, item, i, items;
            for (a = 0; a < args.length; a++) {
                arg = args[a];
                if (arg && arg.splat && arg.$isFashionList) {
                    items = arg.getItems();
                    for (i = 0; i < items.length; i++) {
                        item = items[i];
                        item && (item.splatSeparator = arg.separator);
                        newArgs.push(item);
                    }
                }
                else {
                    newArgs.push(arg);
                }
                // clear the flag indicating the splat argument
                // so subsequent calls using this same variable will not
                // be contaminated
                arg && (arg.splat = undefined);
            }
            return newArgs;
        };
        Runtime.uniqueScopesForGlobalRulesets = true;
        Runtime.uniqueScopesForAllRulesets = true;
        Runtime.allowSetScopedVariables = true;
        Runtime.allowMultipleImports = true;
        Runtime.allowNullDefaults = true;
        Runtime.allowEmptyRulesets = false;
        Runtime.fullExtendWeave = false;
        Runtime.compactSuperSelectors = false;
        return Runtime;
    }(Fashion.Base));
    Fashion.Runtime = Runtime;
})(Fashion || (Fashion = {}));
///<reference path="Base.ts"/>
///<reference path="Env.ts"/>
///<reference path="Visitor.ts"/>
///<reference path="Runtime.ts"/>
///<reference path="Builder.ts"/>
var Fashion;
(function (Fashion) {
    if (typeof System === 'undefined' && typeof require !== 'undefined' && !Fashion.Env.isPhantom) {
        System = require('systemjs');
    }
    Fashion.currentFile = undefined;
    var SassFile = (function (_super) {
        __extends(SassFile, _super);
        function SassFile(cfg) {
            _super.call(this, cfg);
            this.$isSassFile = true;
            this.expanding = false;
            this.readyListeners = [];
            this.state = 0;
            this.imports = {};
            this.importedBy = {};
            if (this.isJsExtension()) {
                this.loadExtension();
            }
            else {
                this.loadSass();
            }
        }
        SassFile.prototype.getLoadPath = function () {
            var loadPath = this.loadPath;
            if (!loadPath) {
                loadPath = this.loadPath = this.path;
            }
            return loadPath;
        };
        SassFile.prototype.loadExtension = function () {
            var me = this, loadPath = me.getLoadPath();
            if (me.state < 5) {
                me.state = 5;
                if (me.state < 9) {
                    me.state = 9;
                    if (!Fashion.Env.isRhino) {
                        System.import(me.originalSource, {
                            name: me.importer.getLoadPath()
                        }).then(function (extension) {
                            extension.init(me.builder.context.runtime);
                            me.state = 10;
                            me.content = '';
                            me.info("file " + loadPath + " is loaded");
                            me.checkImports();
                        }, function (err) {
                            me.error("file " + loadPath + " failed to load");
                            me.error((err.stack || err) + '');
                            me.checkImports();
                        });
                    }
                    else {
                        if (!/\.js$/.test(loadPath)) {
                            loadPath += '.js';
                        }
                        var extension = require(loadPath);
                        extension.init(me.builder.context.runtime);
                        me.state = 10;
                        me.content = '';
                        me.info("file " + loadPath + " is loaded");
                        me.checkImports();
                    }
                }
            }
        };
        SassFile.prototype.loadSass = function () {
            var me = this, loadPath;
            if (me.state < 5) {
                me.state = 5;
                if (me.state < 10) {
                    loadPath = me.getLoadPath();
                    me.info("loading file " + loadPath);
                    Fashion.Env.loadFile(loadPath, function (content) {
                        me.state = 10;
                        me.info("file " + loadPath + " is loaded");
                        me.content = content;
                        me.checkImports();
                    }, function () {
                        var idx = loadPath.lastIndexOf('/'), attempt = loadPath;
                        if (idx > -1) {
                            attempt = attempt.substring(0, idx + 1) + '_' + attempt.substring(idx + 1);
                        }
                        loadPath = me.loadPath = attempt;
                        me.info("retrying with " + loadPath);
                        Fashion.Env.loadFile(loadPath, function (content) {
                            me.state = 10;
                            me.info("file " + loadPath + " is loaded");
                            me.content = content;
                            me.checkImports();
                        }, function () {
                            Fashion.error("failed to download path : " + loadPath);
                            me.content = "";
                            me.checkImports();
                        });
                    });
                }
            }
        };
        SassFile.prototype.getAst = function () {
            var me = this, ast = me.ast, content = me.content, loadPath = me.getLoadPath(), parser;
            if (me.isJsExtension()) {
                return undefined;
            }
            if (!ast && content) {
                parser = me.builder.getParser();
                me.debug("parsing file " + loadPath);
                try {
                    ast = me.ast = parser.parse(content, loadPath);
                }
                catch (err) {
                    Fashion.error(err);
                    return undefined;
                }
            }
            return ast;
        };
        SassFile.prototype.getSassFile = function (basePath, targetPath, origSource, importer) {
            return this.builder.getSassFile(basePath, targetPath, origSource, importer);
        };
        SassFile.prototype.isJsExtension = function () {
            var loadPath = this.getLoadPath();
            return loadPath.indexOf(".js") > 0;
        };
        SassFile.prototype.getImportSource = function (source) {
            var imports = [];
            if ((source.type === 'List' || source.type === 'SelectorList') && source.separator && source.separator.indexOf(',') === 0) {
                imports = source.items;
            }
            else {
                imports.push(source);
            }
            imports = Fashion.convert(imports, function (source) {
                if (source && source.type === 'MultiPartSelector' && source.items.length === 1) {
                    source = source.items[0];
                }
                if (source && source.type === 'CompoundSelector' && source.items.length === 1) {
                    source = source.items[0];
                }
                if (source && source.value) {
                    return source.value;
                }
                return source;
            });
            imports = Fashion.filter(imports, function (source) {
                if (!source) {
                    return false;
                }
                if (!source.indexOf) {
                    return false;
                }
                var idx = source.indexOf('.css');
                if (idx > -1 && idx === (source.length - 4)) {
                    return false;
                }
                idx = source.indexOf('http://');
                if (idx === 0) {
                    return false;
                }
                idx = source.indexOf('//');
                if (idx === 0) {
                    return false;
                }
                return true;
            });
            return imports;
        };
        SassFile.prototype.trimComment = function (comment) {
            if (comment.indexOf('//#') === 0) {
                comment = comment.substring(3);
            }
            if (comment.indexOf('//') === 0) {
                comment = comment.substring(2);
            }
            if (comment.indexOf('/*') === 0) {
                comment = comment.substring(2, comment.length - 3);
            }
            return comment.trim();
        };
        SassFile.prototype.checkImports = function () {
            var me = this, loadPath = me.getLoadPath(), sassFiles = [], missing, i;
            if (me.state < 15) {
                me.info("checking Imports for file " + loadPath);
                me.state = 15;
                // normal scss file
                if (!me.isJsExtension()) {
                    var vis = new Fashion.Visitor({
                        skipBranching: true,
                        loadJsExtension: function (source) {
                            source = source.replace(/;$/, '')
                                .replace(/^'/, '')
                                .replace(/'$/, '')
                                .replace(/\.js$/, '');
                            if (source.indexOf(".") !== 0) {
                                source = "./" + source;
                            }
                            var sassFile = me.getSassFile(me.path, source + ".js", source, me);
                            if (sassFile === me) {
                                Fashion.raise("file " + loadPath + " should not import itself");
                            }
                            me.imports[sassFile.getLoadPath()] = sassFile;
                            sassFile.importedBy[loadPath] = me;
                            if (sassFile.state < 20) {
                                sassFiles.push(sassFile);
                            }
                        },
                        //Comment (comment) {
                        //    if (comment.indexOf('//#') === 0) {
                        //        comment = me.trimComment(comment);
                        //        if (comment.indexOf('@require ') === 0) {
                        //            comment = comment.replace('@require ', '');
                        //            this.loadJsExtension(comment);
                        //        }
                        //    }
                        //},
                        FunctionCall: function (node) {
                            var funcName = node.id || node.value;
                            var handlers = this;
                            if (funcName === 'require') {
                                var sources = me.getImportSource(node.args);
                                sources.forEach(function (source) {
                                    handlers.loadJsExtension(source);
                                });
                                node.visitTarget = null;
                            }
                        },
                        Require: function (node) {
                            var source = me.getImportSource(node.source)[0], isGlobal = this.nodeStack.length == 1;
                            if (source.indexOf) {
                                if (!isGlobal) {
                                    Fashion.raise('Cannot use require() "' + source + '" from non-file-scope location', node);
                                }
                                Fashion.warn("Use of '@require' has been deprecated", node);
                                Fashion.warn("Use require() function call instead");
                                delete node.visitTarget;
                                this.loadJsExtension(source);
                            }
                        },
                        Import: function (node) {
                            var _this = this;
                            delete node.visitTarget;
                            delete node.nodeFiles;
                            var source = me.getImportSource(node.source);
                            source.forEach(function (source) {
                                var sassFile = me.getSassFile(me.path, source, source);
                                if (sassFile === _this) {
                                    Fashion.raise("file " + loadPath + " should not import itself");
                                }
                                me.imports[sassFile.getLoadPath()] = sassFile;
                                sassFile.importedBy[loadPath] = me;
                                if (sassFile.state < 20) {
                                    sassFiles.push(sassFile);
                                }
                            });
                        }
                    });
                    vis.visit(me.getAst());
                }
                else if (Fashion && Fashion.Env && Fashion.Env.isRhino) {
                    var content = me.content + "\n//# sourceURL=" + loadPath;
                    eval(content);
                }
                missing = sassFiles.length;
                if (!missing) {
                    me.fireReady();
                    return;
                }
                for (i = 0; i < sassFiles.length; i++) {
                    sassFiles[i].onReady(function () {
                        missing--;
                        if (missing === 0) {
                            me.fireReady();
                        }
                        else {
                            me.debug("file " + loadPath + " still waiting for " + missing + " other files");
                        }
                    });
                }
            }
        };
        SassFile.prototype.onReady = function (listener) {
            var me = this;
            if (me.state >= 20) {
                listener(me);
            }
            else {
                me.readyListeners.push(listener);
                if (me.state == 10) {
                    me.checkImports();
                }
            }
        };
        SassFile.prototype.fireReady = function () {
            var me = this;
            if (me.state < 20) {
                me.info("file " + me.getLoadPath() + " is ready");
                me.state = 20;
                var listener;
                while ((listener = me.readyListeners.shift()) != null) {
                    listener(me);
                }
            }
        };
        SassFile.prototype.getExpandedAst = function (stamp) {
            stamp = stamp || new Date().getTime();
            var me = this, ast = me.getAst();
            if (me.imported != stamp) {
                me.imported = stamp;
                if (!me.isJsExtension()) {
                    me.debug("expanding ast for file " + me.getLoadPath());
                    var vis = new Fashion.Visitor({
                        skipBranching: true,
                        Import: function (node) {
                            delete node.visitTarget;
                            var source = me.getImportSource(node.source), visitTarget = [];
                            source.forEach(function (source) {
                                if (source && source.indexOf && !node.skipSassImport) {
                                    var sassFile = me.getSassFile(me.path, source), importAst = sassFile.getExpandedAst(stamp);
                                    visitTarget.push(importAst);
                                }
                            });
                            if (visitTarget.length) {
                                node.visitTarget = visitTarget;
                            }
                        }
                    });
                    vis.visit(ast);
                    return ast;
                }
            }
            return Fashion.Runtime.allowMultipleImports ? ast : undefined;
        };
        SassFile.prototype.invalidate = function () {
            var me = this;
            if (me.state >= 10) {
                me.info("invalidating file " + me.getLoadPath());
                me.state = 0;
                delete me.ast;
                delete me.content;
                delete me.imported;
                for (var name in me.importedBy) {
                    me.importedBy[name].unready();
                }
                var loadPath = me.getLoadPath();
                for (name in me.imports) {
                    delete me.imports[name].importedBy[loadPath];
                }
                me.imports = {};
                if (me.isJsExtension()) {
                    me.loadExtension();
                }
                else {
                    me.loadSass();
                }
            }
        };
        SassFile.prototype.unready = function () {
            this.state = 10;
            delete this.ast;
            for (var name in this.importedBy) {
                this.importedBy[name].unready();
            }
        };
        SassFile.prototype.debug = function (message) {
            //Fashion.log(message);
        };
        SassFile.prototype.info = function (message) {
            //Fashion.log(message);
        };
        SassFile.prototype.error = function (message) {
            //Fashion.error(message);
        };
        return SassFile;
    }(Fashion.Base));
    Fashion.SassFile = SassFile;
})(Fashion || (Fashion = {}));
/// <reference path='../Base.ts'/>
///<reference path="../SassFile.ts"/>
var Fashion;
(function (Fashion) {
    var parse;
    (function (parse) {
        function isAlpha(ch) {
            return (ch >= 'a' && ch <= 'z') ||
                (ch >= 'A' && ch <= 'Z');
        }
        parse.isAlpha = isAlpha;
        function isDigit(ch) {
            return (ch >= '0') && (ch <= '9');
        }
        // http://en.wikipedia.org/wiki/Latin-1
        function isNameChar(ch) {
            var c = ch.charCodeAt(0);
            return (ch >= 'a' && ch <= 'z') ||
                (ch >= 'A' && ch <= 'Z') ||
                (ch >= '0' && ch <= '9') ||
                (ch === '-') || (ch === '_') ||
                (c >= 128 && c <= 255 && c !== 215 && c !== 247) ||
                ch === '\\';
        }
        parse.isNameChar = isNameChar;
        function isHexDigit(ch) {
            return (ch >= '0' && ch <= '9') ||
                (ch >= 'a' && ch <= 'f') ||
                (ch >= 'A' && ch <= 'F');
        }
        // px, pt, pc, cm, mm, in, em, rem, ex
        function isLength(unit) {
            var ch1 = unit.charAt(0).toLowerCase(), ch2 = unit.charAt(1).toLowerCase(), ch3 = unit.charAt(2) && unit.charAt(2).toLowerCase();
            if (ch1 === 'p') {
                return (ch2 === 'x' || ch2 === 't' || ch2 === 'c');
            }
            if (ch2 === 'm') {
                return (ch1 === 'c' || ch1 === 'm' || ch1 === 'e');
            }
            if (ch2 === 'x') {
                return ch1 === 'e';
            }
            if (ch3 === 'm') {
                if (ch1 === 'r' && ch2 === 'e') {
                    // return the length of the unit
                    return 3;
                }
            }
            if (ch1 === 'x' && isHexDigit(ch2)) {
                var len = 1;
                while (isHexDigit(unit.charAt(len))) {
                    len++;
                }
                return len;
            }
            return (ch1 === 'i' && ch2 === 'n');
        }
        // s, ms
        function isTime(unit) {
            if (unit.length === 1) {
                return unit === 's';
            }
            else if (unit.length === 2) {
                return unit === 'ms';
            }
            return false;
        }
        // deg, rad
        function isAngle(unit) {
            var ch = unit.charAt(0);
            if (ch === 'd' || ch === 'D') {
                return unit.toLowerCase() === 'deg';
            }
            if (ch === 'r' || ch === 'R') {
                return unit.toLowerCase() === 'rad';
            }
            return false;
        }
        function debug(message) {
            //console.log(message);
        }
        function info(message) {
            //console.log(message);
        }
        var Scanner = (function (_super) {
            __extends(Scanner, _super);
            function Scanner(style, file) {
                _super.call(this);
                this.isFashionScanner = true;
                // The list of SASS directives.  Everything else beginning with "@" will be
                // assumed to be a css @-rule, an treated as an identifier. e.g. @font-face
                // treated as a normal identifier with no special processing for now.
                this.directives = {
                    "@charset": true,
                    "@import": true,
                    "@extend": true,
                    "@debug": true,
                    "@warn": true,
                    "@if": true,
                    "@else": true,
                    "@for": true,
                    "@each": true,
                    "@while": true,
                    "@mixin": true,
                    "@include": true,
                    "@function": true,
                    "@return": true,
                    "@debugger": true,
                    "@elseif": true,
                    "@content": true,
                    "@require": true
                };
                this.index = 0;
                this.style = style;
                this.lineNumber = this.style.length ? 1 : 0;
                this.currentFile = file || Fashion.currentFile;
                this.docs = [];
            }
            Scanner.prototype.next = function (isPeek) {
                var me = this, start = me.index, startLine = me.lineNumber, token = me._next(isPeek);
                if (token) {
                    token.idx = me.index;
                    token.lineNumber = me.lineNumber;
                    token.startIdx = start;
                    token.startLine = startLine;
                }
                return token;
            };
            // Get the next token and return it.
            // Loosely based on http://www.w3.org/TR/CSS2/grammar.html#scanner
            // TODO: nonascii, badcomments, escape
            Scanner.prototype._next = function (isPeek) {
                var style = this.style, length = style.length, ch, ch2, ch3, start, str, level, negate, charOffset, value;
                // Go past white space, block comment, and single-line comment
                while (true) {
                    ch = style.charAt(this.index);
                    // Skip white space or any other control characters
                    while (this.index < length && (ch <= ' ' || ch >= 128)) {
                        if (ch === '\n') {
                            this.lineNumber += 1;
                            this.start = this.index;
                        }
                        this.index += 1;
                        ch = style.charAt(this.index);
                    }
                    ch2 = style.charAt(this.index + 1);
                    // Block comment
                    if (ch === '/' && ch2 === '*') {
                        this.index += 1;
                        start = this.index + 1;
                        while (this.index < length) {
                            ch = style.charAt(this.index);
                            ch2 = style.charAt(this.index + 1);
                            if (ch === '\n') {
                                this.lineNumber += 1;
                                this.start = this.index;
                            }
                            if (ch === '*' && ch2 === '/') {
                                this.index += 2;
                                break;
                            }
                            this.index += 1;
                        }
                        if (!isPeek) {
                            this.docs.push(style.substring(start - 2, this.index));
                        }
                        continue;
                    }
                    // Single-line comment
                    if (ch === '/' && ch2 === '/') {
                        this.index += 1;
                        start = this.index;
                        while (this.index < length) {
                            ch = style.charAt(this.index);
                            if (ch === '\r' || ch === '\n') {
                                break;
                            }
                            this.index += 1;
                        }
                        if (!isPeek) {
                            this.docs.push(style.substring(start - 1, this.index));
                        }
                        continue;
                    }
                    break;
                }
                start = this.index;
                if (start >= length) {
                    return undefined;
                }
                ch = style.charAt(this.index);
                ch2 = style.charAt(this.index + 1);
                ch3 = style.charAt(this.index + 2);
                // Identifier
                if ((isNameChar(ch) && !isDigit(ch) && ch !== '-') ||
                    (ch === '-' && isNameChar(ch2) && !isDigit(ch2)) ||
                    (ch === '#' && ch2 === '{')) {
                    level = 0;
                    this.index += 1;
                    if (ch === '#' && ch2 === '{') {
                        level += 1;
                        this.index += 1;
                    }
                    if (ch === '\\') {
                        // automatically consume the escaped character
                        this.index += 1;
                    }
                    while (this.index < length) {
                        ch = style.charAt(this.index);
                        ch2 = style.charAt(this.index + 1);
                        if (isNameChar(ch)) {
                            this.index += 1;
                            continue;
                        }
                        if (ch === '\\') {
                            this.index += 2;
                            continue;
                        }
                        if (ch == ">") {
                            this.index += 1;
                            //level += 1;
                            continue;
                        }
                        if (ch === '#' && ch2 === '{') {
                            level += 1;
                            this.index += 2;
                            continue;
                        }
                        if (level > 0) {
                            this.index += 1;
                            if (ch === '}') {
                                level -= 1;
                            }
                            continue;
                        }
                        break;
                    }
                    str = style.substring(start, this.index).toLowerCase();
                    if (str === 'or' || str === 'and' || str === 'not') {
                        return {
                            type: 'operator',
                            isOperator: true,
                            value: str,
                            lineNumber: this.lineNumber
                        };
                    }
                    return {
                        type: 'ident',
                        value: style.substring(start, this.index),
                        lineNumber: this.lineNumber
                    };
                }
                // String
                if ((ch === '\'' || ch === '"') ||
                    (ch === '\\' && (ch2 === "'" || ch2 === '"'))) {
                    charOffset = (ch === '\\') ? 2 : 1;
                    // quotes may be escaped.
                    this.index += charOffset;
                    start = this.index;
                    var openCh = (ch === '\\') ? ch2 : ch;
                    level = 0;
                    var buff = '';
                    while (this.index < length) {
                        ch = style.charAt(this.index);
                        this.index++;
                        if (ch === '\\') {
                            ch2 = style.charAt(this.index);
                            if (ch2 === '\n' || ch2 === "\r") {
                                this.index++;
                                continue;
                            }
                            buff += ch;
                            ch = style.charAt(this.index);
                            this.index++;
                            if (!level && charOffset === 2 && openCh === style.charAt(this.index)) {
                                break;
                            }
                        }
                        else if (ch === '#') {
                            if (style.charAt(this.index) === '{') {
                                level++;
                            }
                        }
                        else if (ch === '}') {
                            if (level) {
                                level--;
                            }
                        }
                        else if (!level && ch === openCh) {
                            break;
                        }
                        buff += ch;
                    }
                    return {
                        type: 'string',
                        value: buff,
                        quoteChar: style.charAt(start - 1),
                        lineNumber: this.lineNumber
                    };
                }
                // Number
                if (isDigit(ch) || (ch === '.' && isDigit(ch2)) || (ch === '-' && isDigit(ch2)) || (ch === '-' && ch2 === '.' && isDigit(ch3))) {
                    if (ch === '-') {
                        this.index += 1;
                    }
                    this.index += 1;
                    while (this.index < length) {
                        ch = style.charAt(this.index);
                        if (ch < '0' || ch > '9') {
                            break;
                        }
                        this.index += 1;
                    }
                    if (ch === '\\') {
                        this.index += 1;
                        ch = style.charAt(this.index);
                    }
                    if (ch === '.') {
                        this.index += 1;
                        while (this.index < length) {
                            ch = style.charAt(this.index);
                            if (ch < '0' || ch > '9') {
                                break;
                            }
                            this.index += 1;
                        }
                    }
                    // Percentage
                    if (ch === '%') {
                        this.index += 1;
                        return {
                            type: 'percentage',
                            value: style.substring(start, this.index),
                            start: start,
                            end: this.index,
                            lineNumber: this.lineNumber
                        };
                    }
                    // Length
                    if (ch !== ' ') {
                        var unitLen = isLength(style.substr(this.index, 10));
                        if (unitLen) {
                            this.index += (unitLen === true) ? 2 : unitLen;
                            return {
                                type: 'length',
                                value: style.substring(start, this.index),
                                lineNumber: this.lineNumber
                            };
                        }
                        if (isTime(style.substr(this.index, 1))) {
                            this.index += 1;
                            return {
                                type: 'time',
                                value: style.substring(start, this.index),
                                lineNumber: this.lineNumber
                            };
                        }
                        if (isTime(style.substr(this.index, 2))) {
                            this.index += 2;
                            return {
                                type: 'time',
                                value: style.substring(start, this.index),
                                lineNumber: this.lineNumber
                            };
                        }
                        if (isAngle(style.substr(this.index, 3))) {
                            this.index += 3;
                            return {
                                type: 'angle',
                                value: style.substring(start, this.index),
                                lineNumber: this.lineNumber
                            };
                        }
                    }
                    return {
                        type: 'number',
                        value: style.substring(start, this.index),
                        lineNumber: this.lineNumber
                    };
                }
                // Class
                if (ch === '.') {
                    level = 0;
                    this.index += 1;
                    ch = style.charAt(this.index);
                    if (ch === '{') {
                        level += 1;
                        this.index += 1;
                    }
                    while (this.index < length) {
                        ch = style.charAt(this.index);
                        ch2 = style.charAt(this.index + 1);
                        if (isNameChar(ch)) {
                            this.index += 1;
                            continue;
                        }
                        if (ch === '#' && ch2 === '{') {
                            level += 1;
                            this.index += 2;
                            continue;
                        }
                        if (level > 0) {
                            this.index += 1;
                            if (ch === '}') {
                                level -= 1;
                            }
                            continue;
                        }
                        break;
                    }
                    return {
                        //                   id: ".",
                        type: 'class',
                        value: style.substring(start, this.index),
                        lineNumber: this.lineNumber
                    };
                }
                // Hash
                if (ch === '#') {
                    level = 0;
                    this.index += 1;
                    ch = style.charAt(this.index);
                    if (ch === '{') {
                        level += 1;
                        this.index += 1;
                    }
                    while (this.index < length) {
                        ch = style.charAt(this.index);
                        ch2 = style.charAt(this.index + 1);
                        if (isNameChar(ch)) {
                            this.index += 1;
                            continue;
                        }
                        if (ch === '#' && ch2 === '{') {
                            level += 1;
                            this.index += 2;
                            continue;
                        }
                        if (level > 0) {
                            this.index += 1;
                            if (ch === '}') {
                                level -= 1;
                            }
                            continue;
                        }
                        break;
                    }
                    return {
                        //                   id: '#',
                        type: 'hash',
                        value: style.substring(start, this.index),
                        lineNumber: this.lineNumber
                    };
                }
                // Variable
                if (ch === '$' || (ch === '-' && ch2 === '$')) {
                    if (ch === '-') {
                        negate = true;
                        start += 1;
                        this.index += 1;
                    }
                    this.index += 1;
                    while (this.index < length) {
                        ch = style.charAt(this.index);
                        if (isNameChar(ch)) {
                            this.index += 1;
                        }
                        else {
                            break;
                        }
                    }
                    return {
                        //                   id: id,
                        type: 'variable',
                        value: style.substring(start, this.index),
                        negate: negate,
                        lineNumber: this.lineNumber
                    };
                }
                // Directive, e.g. @import
                if (ch === '@') {
                    this.index += 1;
                    while (this.index < length) {
                        ch = style.charAt(this.index);
                        if (!isAlpha(ch) && ch !== '-') {
                            break;
                        }
                        this.index += 1;
                    }
                    value = style.substring(start, this.index);
                    return {
                        // If the value is not a SASS directive, then treat it as an identifier
                        // This prevents a parsing error on CSS @-rules like @font-face
                        //                   id: "@",
                        type: this.directives[value] ? 'directive' : 'ident',
                        value: value,
                        lineNumber: this.lineNumber
                    };
                }
                // Fallback to single-character or two-character operator
                this.index += 1;
                str = ch;
                if (ch === '=' && ch2 === '=') {
                    str = '==';
                    this.index += 1;
                }
                if (ch === '~' && ch2 === '=') {
                    str = '~=';
                    this.index += 1;
                }
                if (ch === '|' && ch2 === '=') {
                    str = '|=';
                    this.index += 1;
                }
                if (ch === '^' && ch2 === '=') {
                    str = '^=';
                    this.index += 1;
                }
                if (ch === '$' && ch2 === '=') {
                    str = '$=';
                    this.index += 1;
                }
                if (ch === '*' && ch2 === '=') {
                    str = '*=';
                    this.index += 1;
                }
                if (ch === '!' && ch2 === '=') {
                    str = '!=';
                    this.index += 1;
                }
                if (ch === '<' && ch2 === '=') {
                    str = '<=';
                    this.index += 1;
                }
                if (ch === '>' && ch2 === '=') {
                    str = '>=';
                    this.index += 1;
                }
                return {
                    type: 'operator',
                    isOperator: true,
                    value: str,
                    lineNumber: this.lineNumber
                };
            }; // next()
            Scanner.prototype.flushDocs = function () {
                if (this.docs.length > 0) {
                    var docs = this.docs;
                    this.docs = [];
                    return docs;
                }
                return null;
            };
            // Lookahead the next token (without consuming it).
            Scanner.prototype.peek = function (i) {
                var start = this.index, lineNo = this.lineNumber, token;
                i = i || 1;
                while (i > 0) {
                    token = this.next(true);
                    i -= 1;
                }
                if (token) {
                    token.idx = this.index;
                }
                this.index = start;
                this.lineNumber = lineNo;
                return token;
            };
            // Check if the next token matches the expected operator.
            // If not, throw an exception.
            Scanner.prototype.expect = function (op) {
                var token = this.next(), lineNo = this.lineNumber - 1, fileName = this.currentFile || "sass-content", message = [
                    'Expected \'',
                    op,
                    '\' but saw \'',
                    token ? token.value : '(null token)',
                    '\'',
                    ' => ',
                    fileName,
                    ':',
                    lineNo,
                    ':',
                    this.index - this.start
                ].join('');
                if (!token) {
                    Fashion.error(message);
                    throw message;
                }
                if (!token.isOperator || token.value !== op) {
                    Fashion.error(message);
                    throw message;
                }
            };
            return Scanner;
        }(Fashion.Base));
        parse.Scanner = Scanner; // Scanner
    })(parse = Fashion.parse || (Fashion.parse = {}));
})(Fashion || (Fashion = {}));
/// <reference path='Scanner.ts'/>
var Fashion;
(function (Fashion) {
    var parse;
    (function (parse) {
        var Tokenizer = (function (_super) {
            __extends(Tokenizer, _super);
            function Tokenizer() {
                _super.apply(this, arguments);
            }
            Tokenizer.prototype.tokenize = function (config) {
                var scanner = new Fashion.parse.Scanner(config), tokens = this.tokens, token;
                if (!tokens) {
                    this.tokens = tokens = [];
                    while ((token = scanner.next()) !== undefined) {
                        tokens.push(token);
                    }
                }
                return tokens;
            };
            return Tokenizer;
        }(Fashion.Base));
        parse.Tokenizer = Tokenizer;
    })(parse = Fashion.parse || (Fashion.parse = {}));
})(Fashion || (Fashion = {}));
/// <reference path='Tokenizer.ts'/>
var Fashion;
(function (Fashion) {
    var parse;
    (function (parse) {
        function debug(message) {
            //console.log(message);
        }
        var Parser = (function (_super) {
            __extends(Parser, _super);
            function Parser(lax) {
                if (lax === void 0) { lax = false; }
                _super.call(this);
                this.lax = lax;
                this.keywords = {
                    "no-repeat": true
                };
                this.isSelector = false;
                this.isParenthetical = false;
                this.isSelectorParen = false;
            }
            // Constant ::= Number |
            //              String |
            //              Length |
            //              Time |
            //              Angle |
            //              Percentage |
            //              Color;
            Parser.prototype.parseConstant = function () {
                var scanner = this.scanner, t = scanner.peek();
                if (t && t.isOperator) {
                    return undefined;
                }
                if (t.type === 'number') {
                    t = scanner.next();
                    if (t.value.indexOf('\\') > -1) {
                        var t2 = scanner.peek();
                        if (t2.type === 'number') {
                            scanner.next();
                            return new parse.Constant({
                                value: t.value + t2.value,
                                dataType: 'Literal',
                                lineNumber: t.lineNumber,
                                docs: scanner.flushDocs(),
                                token: t,
                                file: scanner.currentFile
                            });
                        }
                    }
                    return new parse.Constant({
                        value: t.value,
                        dataType: 'Number',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                if (t.type === 'string') {
                    t = scanner.next();
                    return new parse.Constant({
                        value: t.value,
                        quoteChar: t.quoteChar,
                        dataType: 'String',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                if (t.type === 'length') {
                    t = scanner.next();
                    return new parse.Constant({
                        value: t.value,
                        dataType: 'Length',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                if (t.type === 'time') {
                    t = scanner.next();
                    return new parse.Constant({
                        value: t.value,
                        dataType: 'Time',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                if (t.type === 'angle') {
                    t = scanner.next();
                    return new parse.Constant({
                        value: t.value,
                        dataType: 'Angle',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                if (t.type === 'percentage') {
                    t = scanner.next();
                    return new parse.Constant({
                        value: t.value,
                        dataType: 'Percentage',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                if (t.type === 'hash') {
                    t = scanner.next();
                    return new parse.Constant({
                        value: t.value,
                        dataType: 'Color',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                return undefined;
            };
            // Stylesheet ::= Statement*
            Parser.prototype.parseStylesheet = function () {
                var stat, statements = [];
                while (true) {
                    stat = this.parseStatement();
                    if (typeof stat === 'undefined') {
                        break;
                    }
                    this.scanner.flushDocs();
                    statements.push(stat);
                }
                return statements;
            };
            // Statement ::= Documentation |
            //               VariableAssignment |
            //               Directive |
            //               Directive ';' |
            //               Ruleset
            Parser.prototype.parseStatement = function () {
                var me = this, scanner = me.scanner, t = scanner.peek(), stat;
                if (typeof t === 'undefined') {
                    return undefined;
                }
                if (t.type === 'variable') {
                    return me.parseVariableAssignment();
                }
                if (t.type === 'directive' && t.value[1] !== '-') {
                    stat = me.parseDirective();
                    t = scanner.peek();
                    if (t && t.isOperator && t.value === ';') {
                        scanner.next();
                    }
                    return stat;
                }
                if (t.type === 'ident') {
                    var start = scanner.index, fn = me.parseFunctionCall();
                    t = scanner.peek();
                    if (!!fn && t.value === ';') {
                        scanner.next();
                        return fn;
                    }
                    else {
                        scanner.index = start;
                    }
                }
                return me.parseRuleset();
            };
            // Directive ::= Charset |
            //               Debug |
            //               Each |
            //               For |
            //               Function |
            //               If |
            //               Else |
            //               Extend |
            //               Mixin |
            //               Import |
            //               Include |
            //               While |
            //               Return
            Parser.prototype.parseDirective = function () {
                var me = this, scanner = me.scanner, t = scanner.peek();
                if (t.value === '@charset') {
                    return me.parseCharset();
                }
                if (t.value === '@debug') {
                    return me.parseDebug();
                }
                if (t.value === '@each') {
                    return me.parseEach();
                }
                if (t.value === '@for') {
                    return me.parseFor();
                }
                if (t.value === '@function') {
                    return me.parseFunction();
                }
                if (t.value === '@if') {
                    return me.parseIf();
                }
                if (t.value === '@elseif') {
                    return me.parseElse();
                }
                if (t.value === '@else') {
                    return me.parseElse();
                }
                if (t.value === '@extend') {
                    return me.parseExtend();
                }
                if (t.value === '@import') {
                    return me.parseImport();
                }
                if (t.value === '@require') {
                    return me.parseRequire();
                }
                if (t.value === '@debugger') {
                    return me.parseDebugger();
                }
                if (t.value === '@content') {
                    return me.parseContent();
                }
                if (t.value === '@mixin') {
                    return me.parseMixin();
                }
                if (t.value === '@include') {
                    return me.parseInclude();
                }
                if (t.value === '@return') {
                    return me.parseReturn();
                }
                if (t.value === '@while') {
                    return me.parseWhile();
                }
                if (t.value === '@warn') {
                    return me.parseWarn();
                }
                Fashion.raiseAt('Unknown directive ' + t.value, scanner);
            };
            // Function ::= '@function' FunctionCall '{' ScopedStatement* '}'
            Parser.prototype.parseFunction = function () {
                var me = this, scanner = me.scanner, t, func, statements;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@function') {
                    func = me.parseFunctionCall(true);
                    statements = me.parseBlock().statements;
                    return new parse.Function({
                        func: func,
                        statements: statements,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                return undefined;
            };
            // Charset ::= '@charset' String
            Parser.prototype.parseCharset = function () {
                var me = this, scanner = me.scanner, t, charset;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@charset') {
                    t = scanner.next();
                    if (t && t.type === 'string') {
                        charset = t.value;
                        return new parse.Charset({
                            charset: charset,
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    Fashion.raiseAt('Expected a string after @charset', scanner);
                }
                return undefined;
            };
            // Debug ::= '@debug' Expression
            Parser.prototype.parseDebug = function () {
                var me = this, scanner = me.scanner, t, expr;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@debug') {
                    expr = me.parseExpression();
                    if (typeof expr !== 'undefined') {
                        return new parse.Debug({
                            expr: expr,
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    Fashion.raiseAt('Expected an expression after @debug', scanner);
                }
                return undefined;
            };
            // Warn ::= '@warn' Expression
            Parser.prototype.parseWarn = function () {
                var me = this, scanner = me.scanner, t, expr;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@warn') {
                    expr = me.parseExpression();
                    if (typeof expr !== 'undefined') {
                        return new parse.Warn({
                            expr: expr,
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    Fashion.raiseAt('Expected an expression after @debug', scanner);
                }
                return undefined;
            };
            // Each ::= '@each' Variable 'in' Sequence '{' ScopedStatement* '}'
            Parser.prototype.parseEach = function () {
                var me = this, scanner = me.scanner, t, id, seq, statements = [], stat, isMap;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@each') {
                    t = scanner.next();
                    if (typeof t === 'undefined' || t.type !== 'variable') {
                        Fashion.raiseAt('Expected variable name after @each', scanner);
                    }
                    id = t.value;
                    t = scanner.next();
                    if (t && t.value === ',') {
                        t = scanner.next();
                        if (typeof t === 'undefined' || t.type !== 'variable') {
                            Fashion.raiseAt('Expected variable name after "," in @each', scanner);
                        }
                        id = new parse.List({
                            items: [
                                id,
                                t.value
                            ],
                            separator: ', '
                        });
                        isMap = true;
                        t = scanner.next();
                    }
                    if (typeof t === 'undefined' || t.type !== 'ident' || t.value !== 'in') {
                        Fashion.raiseAt('Expected "in" after variable in @each', scanner);
                    }
                    seq = me.parseSequence();
                    if (seq.items) {
                        seq = seq.items;
                    }
                    if (typeof seq === 'undefined') {
                        Fashion.raiseAt('Expected value sequence after "in" in @each', scanner);
                    }
                    scanner.expect('{');
                    while (true) {
                        debug("parsing each");
                        t = scanner.peek();
                        if (t && t.isOperator && t.value === '}') {
                            break;
                        }
                        stat = me.parseScopedStatement();
                        if (typeof stat === 'undefined') {
                            break;
                        }
                        statements.push(stat);
                    }
                    scanner.expect('}');
                    return new parse.Each({
                        variable: id,
                        list: seq,
                        statements: statements,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile,
                        isMap: isMap
                    });
                }
                return undefined;
            };
            // For ::= '@for' Variable 'from' Expression 'to' Expression '{' ScopedStatement* '}' |
            //         '@for' Variable 'from' Expression 'through' Expression '{' ScopedStatement* '}' |
            Parser.prototype.parseFor = function () {
                var me = this, scanner = me.scanner, t, id, start, end, inclusive, statements = [], stat;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@for') {
                    t = scanner.next();
                    if (typeof t === 'undefined' || t.type !== 'variable') {
                        Fashion.raiseAt('Expected variable name after @for', scanner);
                    }
                    id = t.value;
                    t = scanner.next();
                    if (typeof t === 'undefined' || t.type !== 'ident' || t.value !== 'from') {
                        Fashion.raiseAt('Expected "from" after variable in @for', scanner);
                    }
                    start = me.parseExpression();
                    if (typeof start === 'undefined') {
                        Fashion.raiseAt('Expected an expression after "from" in @for', scanner);
                    }
                    t = scanner.next();
                    if (typeof t === 'undefined' || t.type !== 'ident' ||
                        (t.value !== 'to' && t.value !== 'through')) {
                        Fashion.raiseAt('Expected "to" or "through" in @for', scanner);
                    }
                    inclusive = t.value === 'through';
                    end = me.parseExpression();
                    if (typeof start === 'undefined') {
                        Fashion.raiseAt('Expected a terminating expression in @for', scanner);
                    }
                    scanner.expect('{');
                    while (true) {
                        debug("parse for");
                        t = scanner.peek();
                        if (t && t.isOperator && t.value === '}') {
                            break;
                        }
                        stat = me.parseScopedStatement();
                        if (typeof stat === 'undefined') {
                            break;
                        }
                        statements.push(stat);
                    }
                    scanner.expect('}');
                    return new parse.For({
                        variable: id,
                        start: start,
                        end: end,
                        inclusive: inclusive,
                        statements: statements,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                return undefined;
            };
            // While ::= '@while' Expression '{' ScopedStatement* '}'
            Parser.prototype.parseWhile = function () {
                var me = this, scanner = me.scanner, t, condition, stat, statements = [];
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@while') {
                    condition = me.parseExpression();
                    scanner.expect('{');
                    while (true) {
                        debug("parse while");
                        t = scanner.peek();
                        if (t && t.isOperator && t.value === '}') {
                            break;
                        }
                        stat = me.parseScopedStatement();
                        if (typeof stat === 'undefined') {
                            break;
                        }
                        statements.push(stat);
                    }
                    scanner.expect('}');
                    return new parse.While({
                        condition: condition,
                        statements: statements,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                return undefined;
            };
            // If ::= '@if' Expression '{' ScopedStatement* '}'
            Parser.prototype.parseIf = function () {
                var me = this, scanner = me.scanner, t, condition, stat, statements = [];
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@if') {
                    condition = me.parseSequence();
                    scanner.expect('{');
                    while (true) {
                        debug("parse if");
                        t = scanner.peek();
                        if (t && t.isOperator && t.value === '}') {
                            break;
                        }
                        stat = me.parseScopedStatement();
                        if (typeof stat === 'undefined') {
                            break;
                        }
                        statements.push(stat);
                    }
                    scanner.expect('}');
                    return new parse.If({
                        condition: condition,
                        statements: statements,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                return undefined;
            };
            // Else ::= '@else'   Expression '{' ScopedStatement* '}' |
            //          '@else'   If |
            //          '@elseif' Expression '{' ScopedStatement* '}'
            Parser.prototype.parseElse = function () {
                var me = this, scanner = me.scanner, t, condition, stat, statements = [], isElseIf;
                t = scanner.next();
                if (t && t.type === 'directive' && (t.value === '@else' || t.value == '@elseif')) {
                    isElseIf = t.value == '@elseif';
                    t = scanner.peek();
                    if (isElseIf) {
                        condition = me.parseExpression();
                    }
                    else if (t.type === 'ident' && t.value === 'if') {
                        scanner.next();
                        condition = me.parseExpression();
                    }
                    scanner.expect('{');
                    while (true) {
                        debug("parse else");
                        t = scanner.peek();
                        if (t && t.isOperator && t.value === '}') {
                            break;
                        }
                        if (typeof t === undefined) {
                            break;
                        }
                        stat = me.parseScopedStatement();
                        if (stat) {
                            statements.push(stat);
                        }
                        else {
                            break;
                        }
                    }
                    scanner.expect('}');
                    return new parse.Else({
                        condition: condition,
                        statements: statements,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                return undefined;
            };
            // Extend ::= '@extend' Selector
            Parser.prototype.parseExtend = function () {
                var me = this, scanner = me.scanner, t, selector;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@extend') {
                    selector = me.parseSelectors();
                    if (typeof selector !== 'undefined') {
                        return new parse.Extend({
                            selector: selector,
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else {
                        Fashion.raiseAt('Expecting attribute name', scanner);
                    }
                }
            };
            // Import ::= '@import' Argument
            Parser.prototype.parseImport = function () {
                var scanner = this.scanner, t = scanner.next(), expr, t2;
                if (t && t.type === 'directive' && t.value === '@import') {
                    t = scanner.peek();
                    t2 = scanner.peek(2);
                    if (t.type === 'string' && t2.value == ';') {
                        scanner.next();
                        return new parse.Import({
                            source: new parse.Constant({
                                value: t.value,
                                dataType: 'Literal'
                            }),
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else {
                        expr = this.parseSelectorSequence();
                        return new parse.Import({
                            source: expr,
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                }
                return undefined;
            };
            // Import ::= '@require' Argument
            Parser.prototype.parseRequire = function () {
                var scanner = this.scanner, t = scanner.next(), expr, t2;
                if (t && t.type === 'directive' && t.value === '@require') {
                    t = scanner.peek();
                    t2 = scanner.peek(2);
                    if (t.type === 'string' && t2.value == ';') {
                        scanner.next();
                        return new parse.Require({
                            source: new parse.Constant({
                                value: t.value,
                                dataType: 'Literal'
                            }),
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else {
                        expr = this.parseSequence();
                        return new parse.Require({
                            source: expr,
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                }
                return undefined;
            };
            Parser.prototype.parseDebugger = function () {
                var scanner = this.scanner, t = scanner.next();
                return new parse.Debugger({
                    lineNumber: t.lineNumber,
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile
                });
            };
            Parser.prototype.parseContent = function () {
                var scanner = this.scanner, t = scanner.next();
                return new parse.Content({
                    type: "Content",
                    lineNumber: t.lineNumber,
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile
                });
            };
            // Mixin ::= '@mixin' FunctionCall '{' ScopedStatements* '}'
            Parser.prototype.parseMixin = function () {
                var scanner = this.scanner, t, stat, mixin;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@mixin') {
                    mixin = new parse.Mixin({
                        name: this.parseFunctionCall(true),
                        statements: [],
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                    mixin.statements = this.parseBlock().statements;
                    t = scanner.peek();
                    if (t && t.isOperator && t.value === ';') {
                        scanner.next();
                    }
                }
                return mixin;
            };
            // Include ::= '@include' Identifier
            Parser.prototype.parseInclude = function () {
                var scanner = this.scanner, t, inc, block;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@include') {
                    inc = this.parseFunctionCall(true);
                    if (scanner.peek().value == '{') {
                        block = this.parseBlock();
                    }
                    return new parse.Include({
                        include: inc,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile,
                        content: block
                    });
                }
                return undefined;
            };
            Parser.prototype.parseBlock = function () {
                var scanner = this.scanner, t, stat, statements = [];
                t = scanner.peek();
                if (!t) {
                    return undefined;
                }
                if (t.value === ';') {
                    scanner.next();
                    return undefined;
                }
                scanner.expect('{');
                while (true) {
                    debug("parse block");
                    t = scanner.peek();
                    if (t === null || t === undefined) {
                        break;
                    }
                    if (t.value === ';') {
                        scanner.next();
                        continue;
                    }
                    if (t === null || t === undefined) {
                        break;
                    }
                    if (t && t.isOperator && t.value === '}') {
                        break;
                    }
                    stat = this.parseScopedStatement();
                    if (stat) {
                        statements.push(stat);
                    }
                    else {
                        break;
                    }
                }
                debug("done parsing block");
                scanner.expect('}');
                return new parse.Block({
                    statements: statements,
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile
                });
            };
            // Return ::= '@return' Identifier
            Parser.prototype.parseReturn = function () {
                var scanner = this.scanner, t, expr;
                t = scanner.next();
                if (t && t.type === 'directive' && t.value === '@return') {
                    expr = this.parseSequence();
                    return new parse.Return({
                        expr: expr,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                return undefined;
            };
            // VariableAssignment ::= VariableName ':' Expression ';' |
            //                        VariableName ':' Expression !default ';'
            Parser.prototype.parseVariableAssignment = function () {
                var scanner = this.scanner, t, assignment;
                t = scanner.next();
                assignment = new parse.VariableAssignment({
                    name: t.value,
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile,
                    lineNumber: t.lineNumber
                });
                try {
                    scanner.expect(':');
                    var start = scanner.index;
                    assignment.value = this.parseValue();
                    t = scanner.peek();
                    while (t && t.isOperator && t.value === '!') {
                        t = scanner.next();
                        t = scanner.next();
                        if (t.value === 'default') {
                            assignment['default'] = true;
                        }
                        else if (t.value === 'global') {
                            assignment['global'] = true;
                        }
                        else if (t.value === 'dynamic') {
                            assignment['dynamic'] = true;
                        }
                        t = scanner.peek();
                    }
                    t = scanner.peek();
                    if (t && t.value === ';') {
                        scanner.expect(';');
                        var end = t.idx;
                        assignment.valueText = scanner.style.substring(start, end);
                    }
                }
                catch (e) {
                    if (!this.lax) {
                        throw e;
                    }
                }
                return assignment;
            };
            // Ruleset ::= Selectors '{' ScopedStatement* '}'
            Parser.prototype.parseRuleset = function () {
                var scanner = this.scanner, t, selectors, statements, block;
                t = scanner.peek();
                selectors = this.parseSelectors();
                block = this.parseBlock();
                statements = block && block.statements;
                return new parse.Ruleset({
                    selectors: selectors,
                    statements: statements,
                    blockDocs: block && block.docs,
                    lineNumber: t.lineNumber,
                    docs: ((selectors && selectors.docs) || []).concat(scanner.flushDocs() || []),
                    token: t,
                    file: scanner.currentFile
                });
            };
            // Selectors ::= Selector |
            //               Selectors ',' Selector
            Parser.prototype.parseSelectors = function () {
                var scanner = this.scanner, t, selectors;
                selectors = this.parseSelectorSequence();
                return selectors;
            };
            // Attempt to parse the incoming tokens as if they form a selector.
            // Returns the token right after the parse can't move anymore.
            Parser.prototype.tryParseSelectors = function () {
                var scanner = this.scanner, lineNo = scanner.lineNumber, index = scanner.index, docs = scanner.docs, token;
                try {
                    this.parseSelectors();
                }
                catch (e) {
                    this.isSelector = false;
                }
                token = scanner.peek();
                scanner.lineNumber = lineNo;
                scanner.index = index;
                scanner.docs = docs;
                return token;
            };
            // ScopedStatement ::= Ruleset |
            //                     Declaration |
            //                     VariableAssignment |
            //                     Directive
            Parser.prototype.parseScopedStatement = function () {
                var me = this, scanner = me.scanner, t = scanner.peek(), stat;
                if (t.type === 'hash' || t.type === 'class') {
                    return me.parseRuleset();
                }
                if (t && t.isOperator && (t.value === '&' || t.value === '>' || t.value === '~' || t.value === ':' || t.value === '%')) {
                    return me.parseRuleset();
                }
                if (t.type === 'variable') {
                    return me.parseVariableAssignment();
                }
                if (t.type === 'directive') {
                    stat = me.parseDirective();
                    t = scanner.peek();
                    if (t && t.isOperator && t.value === ';') {
                        scanner.next();
                    }
                    return stat;
                }
                // Handle things like '-webkit-foobar: value'
                if (t && t.isOperator && t.value === '-') {
                    return me.parseDeclaration();
                }
                // This could be Declaration or Ruleset
                if (t.type === 'ident' ||
                    t.type === 'number' ||
                    t.type === 'percentage' ||
                    (t.isOperator && t.value !== '}')) {
                    //var idx = t.idx;
                    //if(scanner.style.charAt(idx) === ':') {
                    //    if(scanner.style.charAt(idx+1) !== ' ') {
                    //        return me.parseRuleset();
                    //    }
                    //}
                    t = me.tryParseSelectors();
                    if (t && t.isOperator && t.value === '{') {
                        //system.print('tryParse: treat as selector');
                        return me.parseRuleset();
                    }
                    return me.parseDeclaration();
                }
                return undefined;
            };
            // Declaration ::= Identifier ':' Value |
            //                 Identifier ':' Value '!important'
            Parser.prototype.parseDeclaration = function () {
                var me = this, scanner = me.scanner, decl = new parse.Declaration({
                    property: '',
                    docs: scanner.flushDocs(),
                    lineNumber: scanner.lineNumber,
                    token: t,
                    file: scanner.currentFile
                }), t;
                t = scanner.next();
                if (t && t.isOperator && (t.value === '*' || t.value === '-')) {
                    decl.property = t.value;
                    t = scanner.next();
                    // special case for property name like '-#{prefix}-box-shadow'
                    if (t && t.type === 'hash') {
                        t.type = 'ident';
                    }
                }
                if (t && t.type === 'ident') {
                    decl.property += t.value;
                    scanner.expect(':');
                    //special hack for IE
                    if (decl.property === 'filter' || decl.property === '-ms-filter' || decl.property === '_filter') {
                        decl.value = me.parseFilterValue();
                    }
                    else {
                        decl.value = me.parseValue();
                    }
                    t = scanner.peek();
                    if (typeof t !== 'undefined') {
                        if (t.isOperator && t.value === '!') {
                            scanner.next();
                            t = scanner.next();
                            if (t.type === 'ident' && t.value === 'important') {
                                decl.important = true;
                            }
                        }
                    }
                    t = scanner.peek();
                    if (typeof t !== 'undefined') {
                        if (t.isOperator && t.value === ';') {
                            scanner.next();
                        }
                    }
                    return decl;
                }
                else {
                    var message = [
                        'Property declaration: expected identifier but saw ',
                        JSON.stringify(t),
                        ' instead : ',
                        scanner.lineNumber,
                        ":",
                        scanner.index - scanner.start
                    ].join('');
                    Fashion.error(message);
                    Fashion.raiseAt(message, scanner);
                }
            };
            // Value ::= Sequence |
            //           Value Sequence
            Parser.prototype.parseValue = function () {
                var scanner = this.scanner, t, stat, statements = [], sequence, ruleset;
                sequence = this.parseSequence();
                t = scanner.peek();
                if (t && t.isOperator && t.value == '{') {
                    scanner.next();
                    while ((stat = this.parseScopedStatement()) != null) {
                        statements.push(stat);
                    }
                    scanner.expect('}');
                    ruleset = new parse.Ruleset({
                        statements: statements,
                        selectors: [],
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                if (ruleset) {
                    if (sequence.items) {
                        sequence.items.push(ruleset);
                    }
                    else if (sequence) {
                        sequence = new parse.List({
                            items: [sequence, ruleset],
                            separator: ' '
                        });
                    }
                    else {
                        sequence = ruleset;
                    }
                }
                return sequence;
            };
            Parser.prototype.parseFilterFunctionCall = function () {
                var scanner = this.scanner, t, args, pos;
                t = scanner.peek();
                if (typeof t === 'undefined') {
                    return;
                }
                if (t.type == 'ident' && (t.value == 'progid' || t.value == 'chroma')) {
                    pos = scanner.index;
                    while (true) {
                        t = scanner.next();
                        if (t && t.isOperator && t.value === ')') {
                            break;
                        }
                    }
                    return new parse.Constant({
                        value: this.style.substring(pos, scanner.index)
                            .replace(/\r/g, '')
                            .replace(/\n/g, '')
                            .replace(/\s+/g, ' ')
                            .trim(),
                        dataType: 'Literal',
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
            };
            // Value ::= Sequence |
            //           Value Sequence
            Parser.prototype.parseFilterValue = function () {
                var scanner = this.scanner, t, args, value = [], pos, separator = ' ';
                while (true) {
                    debug("parse filter value");
                    t = scanner.peek();
                    if (t.value == ',') {
                        separator = ',';
                        scanner.next();
                        continue;
                    }
                    if (typeof t === 'undefined') {
                        break;
                    }
                    if (t.type == 'ident' && (t.value == 'progid' || t.value == 'chroma')) {
                        value.push(this.parseFilterFunctionCall());
                        continue;
                    }
                    if (t.isOperator) {
                        if (t.value === ';' || t.value === '{' || t.value === '!' || t.value === '}') {
                            break;
                        }
                    }
                    args = this.parseSequence();
                    if (args.items) {
                        separator = args.separator;
                        args = args.items;
                    }
                    else {
                        args = [args];
                    }
                    if (args.length === 0) {
                        break;
                    }
                    else if (args.length === 1) {
                        value.push(args[0]);
                    }
                    else {
                        value.push.apply(value, args);
                    }
                }
                if (value.length === 0) {
                    return null;
                }
                // Simplify if there is only one value in the array
                while (value.length === 1) {
                    value = value[0];
                }
                if (value.length) {
                    value = new parse.List({
                        items: value,
                        separator: separator
                    });
                }
                return value;
            };
            // Expression ::= Relational |
            //                Identifier '=' Relational
            Parser.prototype.parseExpression = function () {
                var scanner = this.scanner, id, t = scanner.peek();
                if (t.type === 'ident') {
                    t = scanner.peek(2);
                    if (t && t.isOperator) {
                        switch (t.value) {
                            case '=':
                            case '~=':
                            case '|=':
                            case '^=':
                            case '$=':
                            case '*=':
                                id = scanner.next().value;
                                scanner.expect(t.value);
                                return new parse.Assignment({
                                    id: id,
                                    expr: this.parseRelational(),
                                    operator: t.value,
                                    lineNumber: t.lineNumber,
                                    docs: scanner.flushDocs(),
                                    token: t,
                                    file: scanner.currentFile
                                });
                            default:
                                break;
                        }
                    }
                }
                else if (t && t.isOperator && t.value === '!') {
                    var t2 = scanner.peek(2);
                    if (t2 && t2.value === 'important') {
                        t = scanner.next();
                        t = scanner.next();
                        return new parse.Constant({
                            value: '!important',
                            dataType: 'Literal',
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                }
                return this.parseDisjunction();
            };
            // Disjunction ::= Conjunction |
            //                 Disjunction 'or' Conjunction
            Parser.prototype.parseDisjunction = function () {
                var scanner = this.scanner, factor, or, t;
                or = this.parseConjunction();
                factor = or;
                while (true) {
                    debug("parse disjunction");
                    t = scanner.peek();
                    if (t && t.isOperator && t.value === 'or' && !this.isSelector) {
                        t = scanner.next();
                        or = this.parseConjunction();
                        if (typeof or === 'undefined') {
                            break;
                        }
                        factor = new parse.BinaryExpression({
                            operator: 'or',
                            left: factor,
                            right: or,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else {
                        break;
                    }
                }
                return factor;
            };
            // Conjunction ::= LogicalAnd |
            //                 Conjunction 'and' LogicalAnd
            Parser.prototype.parseConjunction = function () {
                var scanner = this.scanner, or, and, t;
                and = this.parseComplement();
                or = and;
                while (true) {
                    debug("parse conjunction");
                    t = scanner.peek();
                    if (t && t.isOperator && t.value === 'and' && !this.isSelector) {
                        t = scanner.next();
                        and = this.parseComplement();
                        if (typeof and === 'undefined') {
                            break;
                        }
                        or = new parse.BinaryExpression({
                            operator: 'and',
                            left: or,
                            right: and,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else {
                        break;
                    }
                }
                return or;
            };
            // Complement ::= Primary |
            //                'not' Primary
            Parser.prototype.parseComplement = function () {
                var scanner = this.scanner, t;
                t = scanner.peek();
                if (t && t.isOperator && t.value === 'not') {
                    if (this.isSelectorParen) {
                        scanner.next();
                        return new parse.Constant({
                            dataType: 'Literal',
                            value: 'not',
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    if (!this.isSelector) {
                        scanner.next();
                        return new parse.UnaryExpression({
                            operator: 'not',
                            expr: this.parseRelational(),
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                }
                return this.parseRelational();
            };
            // Relational ::= Additive |
            //                Relational '==' Additive |
            //                Relational '!=' Additive |
            //                Relational '<' Additive |
            //                Relational '>' Additive |
            //                Relational '<=' Comparison |
            //                Relational '>=' Comparison
            Parser.prototype.parseRelational = function () {
                var scanner = this.scanner, cmp, expr, t;
                cmp = this.parseAdditive();
                expr = cmp;
                while (true) {
                    debug("parse relational");
                    t = scanner.peek();
                    if (t && t.isOperator && (t.value === '==' || t.value === '!=' ||
                        t.value === '<' || t.value === '<=' || t.value === '>=' ||
                        (t.value === '>' && !this.isSelector))) {
                        t = scanner.next();
                        cmp = this.parseAdditive();
                        if (typeof cmp === 'undefined') {
                            break;
                        }
                        expr = new parse.BinaryExpression({
                            operator: t.value,
                            left: expr,
                            right: cmp,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else {
                        break;
                    }
                }
                return expr;
            };
            // Additive ::= Multiplicative |
            //              Additive '+' Multiplicative |
            //              Additive '-' Multiplicative
            Parser.prototype.parseAdditive = function () {
                var scanner = this.scanner, term, cmp, t;
                term = this.parseMultiplicative();
                cmp = term;
                while (true) {
                    debug("parse additive");
                    t = scanner.peek();
                    if (t && t.isOperator && (t.value === '+' || t.value === '-') && !this.isSelector) {
                        t = scanner.next();
                        term = this.parseMultiplicative();
                        if (typeof term === 'undefined') {
                            break;
                        }
                        cmp = new parse.BinaryExpression({
                            operator: t.value,
                            left: cmp,
                            right: term,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else {
                        break;
                    }
                }
                return cmp;
            };
            // Multiplicative ::= Disjunction |
            //                    Multiplicative '*' Disjunction |
            //                    Multiplicative '/' Disjunction |
            //                    Multiplicative '%' Disjunction
            Parser.prototype.parseMultiplicative = function () {
                var term, factor, t;
                factor = this.parsePrimary();
                term = factor;
                while (true) {
                    debug("parse multiplicative");
                    t = this.scanner.peek();
                    if (t && t.isOperator && (t.value === '*' || t.value === '/' || (t.value === '%' && !this.isSelector))) {
                        t = this.scanner.next();
                        factor = this.parsePrimary();
                        if (typeof factor === 'undefined') {
                            break;
                        }
                        term = new parse.BinaryExpression({
                            operator: t.value,
                            left: term,
                            right: factor,
                            docs: this.scanner.flushDocs()
                        });
                    }
                    else {
                        break;
                    }
                }
                return term;
            };
            // Primary ::= '(' Value ')' |
            //             FunctionCall |
            //             Variable |
            //             Constant
            Parser.prototype.parsePrimary = function () {
                var scanner = this.scanner, t, t2, expr;
                t = scanner.peek();
                t2 = scanner.peek(2);
                if (typeof t === 'undefined') {
                    return undefined;
                }
                if (t && t.isOperator && t.value === '(') {
                    return this.parseParenthetical();
                }
                if (t.type === 'ident') {
                    if (this.keywords[t.value]) {
                        scanner.next();
                        return new parse.Constant({
                            value: t.value,
                            dataType: 'Literal',
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    else if (t.value === 'progid' && t2.value === ':') {
                        return this.parseFilterFunctionCall();
                    }
                    else {
                        return this.parseFunctionCall();
                    }
                }
                if (t.type === 'variable') {
                    t = scanner.next();
                    if (t.negate) {
                        return new parse.BinaryExpression({
                            operator: '-',
                            right: new parse.Variable({
                                name: t.value,
                                lineNumber: t.lineNumber,
                                docs: scanner.flushDocs(),
                                token: t,
                                file: scanner.currentFile
                            }),
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                    return new parse.Variable({
                        name: t.value,
                        lineNumber: t.lineNumber,
                        docs: scanner.flushDocs(),
                        token: t,
                        file: scanner.currentFile
                    });
                }
                t = this.parseConstant();
                return t;
            };
            Parser.prototype.parseParenthetical = function () {
                var scanner = this.scanner, t = scanner.next(), selWas = this.isSelector, parWas = this.isParenthetical, selParWas = this.isSelectorParen, expr;
                this.isSelector = false;
                this.isParenthetical = true;
                this.isSelectorParen = selWas;
                expr = this.isSelector
                    ? this.parseSelectorSequence(true)
                    : this.parseSequence();
                this.isSelector = selWas;
                this.isParenthetical = parWas;
                this.isSelectorParen = selParWas;
                scanner.expect(')');
                if (expr && expr.isKVP) {
                    expr = new parse.List({
                        items: [expr],
                        separator: ', '
                    });
                }
                return new parse.Parenthetical({
                    expr: expr,
                    lineNumber: t.lineNumber,
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile
                });
            };
            // FunctionCall ::= Identifier '(' Arguments ')' |
            //                  Identifier '(' ')' |
            //                  Literal
            Parser.prototype.parseFunctionCall = function (allowSpaceBeforeParen) {
                var scanner = this.scanner, t = scanner.next(), id = t.value, start = scanner.index, end, ch = '', prev, args = [], passThroughNames = {
                    'expression': 1,
                    'calc': 1,
                    '-moz-calc': 1,
                    '-webkit-calc': 1,
                    '-ms-calc': 1
                }, temp;
                t = scanner.peek();
                if (typeof t !== 'undefined') {
                    prev = scanner.style.charAt(start);
                    if (t.isOperator && t.value === '(' && (prev !== ' ' || allowSpaceBeforeParen)) {
                        scanner.next();
                        t = scanner.peek();
                        if (id in passThroughNames) {
                            // unquoted URL, e.g. url(http://foo.bar.com/baz.png)
                            // just consume everything until we get to ')'
                            start = scanner.index;
                            end = start;
                            var parenCount = 0;
                            while (true) {
                                debug("parsing function call");
                                ch = scanner.style.charAt(end);
                                end += 1;
                                if (ch === '(') {
                                    parenCount++;
                                }
                                if (typeof ch === 'undefined' || !ch) {
                                    end = start;
                                    break;
                                }
                                if (ch === ')') {
                                    if (parenCount === 0) {
                                        break;
                                    }
                                    parenCount--;
                                }
                            }
                            debug("done parsing function call");
                            if (end != start) {
                                scanner.index = end;
                                args.push(new parse.Constant({
                                    value: scanner.style.substring(start, end - 1),
                                    dataType: 'Literal'
                                }));
                                return new parse.FunctionCall({
                                    id: id,
                                    args: args,
                                    lineNumber: t.lineNumber,
                                    docs: scanner.flushDocs(),
                                    token: t,
                                    file: scanner.currentFile
                                });
                            }
                        }
                        else if ((id === 'url' || id === 'url-prefix') && t && ((!t.isOperator || t.value === '/') && t.type !== 'string')) {
                            // unquoted URL, e.g. url(http://foo.bar.com/baz.png)
                            // just consume everything until we get to ')'
                            start = scanner.index;
                            end = start;
                            var tpl = 0, ch2;
                            while (true) {
                                ch = scanner.style.charAt(end);
                                ch2 = scanner.style.charAt(end + 1);
                                if (ch === '#' && ch2 === '{') {
                                    tpl++;
                                }
                                if (ch === '}') {
                                    if (tpl) {
                                        tpl--;
                                    }
                                    else {
                                        end = start;
                                        break;
                                    }
                                }
                                if (ch === '(' || ch == "$") {
                                    // if we detect an open paren, $, or an operator, this is probably
                                    // an expression of some sort, so bail and defer
                                    // to parseArguments
                                    if (!tpl) {
                                        end = start;
                                        break;
                                    }
                                }
                                if (ch === '+') {
                                    if (!tpl &&
                                        (scanner.style.indexOf("data:", start) != start) &&
                                        (scanner.style.indexOf("http:", start) != start)) {
                                        end = start;
                                        break;
                                    }
                                }
                                if (typeof ch === 'undefined' || ch === ')') {
                                    break;
                                }
                                if (!ch) {
                                    end = start;
                                    break;
                                }
                                end += 1;
                            }
                            if (end != start) {
                                scanner.index = end;
                                args.push(new parse.Constant({
                                    value: scanner.style.substring(start, end),
                                    dataType: 'String',
                                    quoteChar: ''
                                }));
                                scanner.next();
                                return new parse.FunctionCall({
                                    id: id,
                                    args: args,
                                    lineNumber: t.lineNumber,
                                    docs: scanner.flushDocs(),
                                    token: t,
                                    file: scanner.currentFile
                                });
                            }
                        }
                        if (t && (t.type !== 'operator' || t.value !== ')')) {
                            temp = this.isSelector
                                ? this.parseSelectorSequence()
                                : this.parseArguments();
                        }
                        else {
                            temp = args;
                        }
                        t = scanner.peek();
                        scanner.expect(')');
                        return new parse.FunctionCall({
                            id: id,
                            args: temp,
                            lineNumber: t.lineNumber,
                            docs: scanner.flushDocs(),
                            token: t,
                            file: scanner.currentFile
                        });
                    }
                }
                return new parse.Constant({
                    value: id,
                    dataType: 'Literal',
                    lineNumber: t && t.lineNumber,
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile
                });
            };
            Parser.prototype.parseSelectorPart = function () {
                var scanner = this.scanner, t;
                t = scanner.peek();
                if (t) {
                    if (t.type === 'class') {
                        t = scanner.next();
                        return new parse.SelectorPart({
                            selectorType: 'class',
                            value: new parse.Constant({
                                dataType: 'Literal',
                                value: t.value
                            })
                        });
                    }
                    else if (t.type === 'hash') {
                        t = scanner.next();
                        return new parse.SelectorPart({
                            selectorType: 'id',
                            value: new parse.Constant({
                                dataType: 'Literal',
                                value: t.value
                            })
                        });
                    }
                    else if (t.isOperator) {
                        switch (t.value) {
                            case 'and':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'and',
                                    value: new parse.Constant({
                                        type: 'Constant',
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case 'or':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'or',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '*':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'wildcard',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '!':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'bang',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '|':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'pipe',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '>':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'direct',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '+':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'after',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '~':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'before',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '&':
                                scanner.next();
                                return new parse.SelectorPart({
                                    selectorType: 'parent',
                                    value: new parse.Constant({
                                        dataType: 'Literal',
                                        value: t.value
                                    })
                                });
                                break;
                            case '-':
                                scanner.next();
                                var expr = this.parseSelectorPart();
                                return new parse.SelectorPart({
                                    selectorType: 'dash',
                                    value: expr
                                });
                                break;
                            case '%':
                                scanner.next();
                                var expr = this.parseSelectorPart();
                                return new parse.SelectorPart({
                                    selectorType: 'placeholder',
                                    value: expr
                                });
                                break;
                            case '[':
                                scanner.next();
                                var expr = this.parseSelectorPart();
                                scanner.expect(']');
                                return new parse.SelectorPart({
                                    selectorType: 'attribute',
                                    value: expr
                                });
                                break;
                            case ':':
                                t = scanner.next();
                                var idx = scanner.index;
                                t = scanner.peek();
                                if ((t && t.value === '{') || scanner.style.charAt(idx) === ' ') {
                                    // namespaced declaration
                                    return undefined;
                                }
                                return new parse.SelectorPart({
                                    selectorType: 'pseudo',
                                    value: this.parseSelectorPart()
                                });
                                break;
                            case 'not':
                                return new parse.SelectorPart({
                                    selectorType: 'not',
                                    value: this.parseFunctionCall()
                                });
                            default:
                                break;
                        }
                    }
                }
                return this.parseExpression();
            };
            // Sequence ::= Expression |
            //              Sequence ',' Expression
            Parser.prototype.parseSequence = function () {
                var scanner = this.scanner, args = [], arg, t;
                while (true) {
                    debug("parse sequence");
                    arg = this.parseTuple();
                    if (typeof arg === 'undefined') {
                        break;
                    }
                    args.push(arg);
                    t = scanner.peek();
                    if (typeof t === 'undefined') {
                        break;
                    }
                    if (t.value === ':') {
                        scanner.next();
                        arg = this.parseTuple();
                        arg.variable = args.pop();
                        arg.isKVP = true;
                        args.push(arg);
                        t = scanner.peek();
                    }
                    if (t.type !== 'operator' || t.value !== ',') {
                        break;
                    }
                    scanner.next();
                }
                if (args.length === 1) {
                    return args[0];
                }
                return new parse.List({
                    items: args,
                    separator: ', ',
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile
                });
            };
            // Sequence ::= Expression |
            //              Sequence ',' Expression
            Parser.prototype.parseSelectorSequence = function (isParenthetical) {
                var scanner = this.scanner, args = [], sequence = new parse.SelectorList({
                    items: args,
                    separator: ', '
                }), arg, t, t2;
                while (true) {
                    debug("parse sequence");
                    arg = this.parseSelectorTuple();
                    if (typeof arg === 'undefined') {
                        break;
                    }
                    if (arg && (!arg.items || arg.items.length)) {
                        args.push(arg);
                    }
                    t = scanner.peek();
                    if (typeof t === 'undefined') {
                        break;
                    }
                    if (t.value === ':' && isParenthetical) {
                        t2 = scanner.peek(2);
                        if (t && t.value !== '{' && t.value !== ';') {
                            scanner.next();
                            //var selWas = this.isSelector;
                            //this.isSelector = false;
                            arg = new parse.SelectorProperty({
                                property: args.pop(),
                                value: this.parseSelectorTuple()
                            });
                            args.push(arg);
                            t = scanner.peek();
                        }
                    }
                    if (t.type !== 'operator' || t.value !== ',') {
                        break;
                    }
                    scanner.next();
                }
                if (args.length === 1) {
                    return args[0];
                }
                return sequence;
            };
            Parser.prototype.parseSelectorTuple = function () {
                var scanner = this.scanner, separator = ' ', exprs = [], expr, t, idx, ch, startIdx, last, selectorWas = this.isSelector;
                this.isSelector = true;
                while (true) {
                    debug("parse selector tuple");
                    t = scanner.peek();
                    if (typeof t === 'undefined') {
                        break;
                    }
                    idx = scanner.index;
                    last = exprs[exprs.length - 1];
                    expr = this.parseSelectorPart();
                    if (typeof expr === 'undefined') {
                        scanner.index = idx;
                        break;
                    }
                    ch = scanner.style.charAt(idx);
                    if (ch !== ' ' && ch !== '\t' && ch !== '\r' && ch !== '\n') {
                        if (!last) {
                            exprs.push(expr);
                        }
                        else if (last.type !== 'CompoundSelector') {
                            last = new parse.CompoundSelector({
                                separator: '',
                                items: [last, expr]
                            });
                            exprs[exprs.length - 1] = last;
                        }
                        else {
                            var items = last.items;
                            items.push(expr);
                        }
                    }
                    else {
                        exprs.push(expr);
                    }
                }
                this.isSelector = selectorWas;
                if (exprs.length === 1) {
                    return exprs[0];
                }
                return new parse.MultiPartSelector({
                    items: exprs,
                    separator: separator
                });
            };
            Parser.prototype.parseTuple = function () {
                var scanner = this.scanner, separator = ' ', exprs = [], expr, t, idx, ch, last;
                while (true) {
                    debug("parse tuple");
                    t = scanner.peek();
                    if (typeof t === 'undefined') {
                        break;
                    }
                    idx = scanner.index;
                    last = exprs[exprs.length - 1];
                    expr = this.parseExpression();
                    if (typeof expr === 'undefined') {
                        //scanner.index = idx;
                        break;
                    }
                    ch = scanner.style.charAt(idx);
                    if (ch !== ' ' && ch !== '\t' && ch !== '\r' && ch !== '\n') {
                        if (!last) {
                            exprs.push(new parse.List({
                                separator: '',
                                items: [expr]
                            }));
                        }
                        else if (last.type !== 'List') {
                            last = new parse.List({
                                separator: '',
                                items: [exprs.pop(), expr]
                            });
                            exprs.push(last);
                        }
                        else {
                            var items = last.items;
                            items.push(expr);
                        }
                    }
                    else {
                        exprs.push(expr);
                    }
                }
                if (exprs.length === 1) {
                    exprs = exprs[0];
                    if (exprs.items && exprs.items.length === 1) {
                        return exprs.items[0];
                    }
                    return exprs;
                }
                if (exprs.length) {
                    return new parse.List({
                        items: exprs,
                        separator: separator
                    });
                }
            };
            // Arguments ::= Argument |
            //               Arguments ',' Argument
            Parser.prototype.parseArguments = function () {
                var scanner = this.scanner, args = [], arg, t;
                while (true) {
                    debug("parse arguments");
                    arg = this.parseArgument();
                    if (typeof arg === 'undefined') {
                        break;
                    }
                    args.push(arg);
                    t = scanner.peek();
                    if (typeof t === 'undefined') {
                        break;
                    }
                    if (t.type !== 'operator' || t.value !== ',') {
                        break;
                    }
                    scanner.next();
                }
                return new parse.List({
                    items: args,
                    separator: ', ',
                    docs: scanner.flushDocs(),
                    token: t,
                    file: scanner.currentFile
                });
            };
            Parser.prototype.parseVarArgs = function (expr) {
                var scanner = this.scanner, t, t2, t3;
                t = scanner.peek();
                if (t && t.value === '.') {
                    t2 = scanner.peek(2);
                    t3 = scanner.peek(3);
                    if (t2 && t2.value === '.') {
                        if (t3 && t3.value === '.') {
                            expr.varArgs = true;
                            scanner.next();
                            scanner.next();
                            scanner.next();
                        }
                    }
                }
                return expr;
            };
            // Argument ::= Expression |
            //              Variable ':' Expression
            Parser.prototype.parseArgument = function () {
                var scanner = this.scanner, arg = [], expr, t, t2, t3;
                while (true) {
                    debug("parse argument");
                    t = scanner.peek();
                    if (typeof t === 'undefined') {
                        break;
                    }
                    if (t.type === 'variable' || t.type === 'identifier') {
                        t = scanner.peek(2);
                        if (t && t.isOperator && t.value === ':') {
                            t = scanner.next();
                            scanner.next();
                            expr = this.parseTuple();
                            if (expr) {
                                expr.variable = t.value;
                            }
                            arg.push(expr);
                            continue;
                        }
                    }
                    expr = this.parseExpression();
                    if (typeof expr === 'undefined') {
                        break;
                    }
                    this.parseVarArgs(expr);
                    arg.push(expr);
                }
                if (arg.length == 1) {
                    return arg[0];
                }
                return new parse.List({
                    items: arg,
                    separator: ' '
                });
            };
            Parser.prototype.parse = function (content, file) {
                var me = this, scanner;
                me.scanner = scanner = new Fashion.parse.Scanner(content, file);
                me.style = scanner.style;
                var result = me.parseStylesheet();
                // null out the tokenizer to allow GC to kick in
                me.scanner = me.style = null;
                return result;
            };
            return Parser;
        }(Fashion.Base));
        parse.Parser = Parser; // Parser
    })(parse = Fashion.parse || (Fashion.parse = {}));
})(Fashion || (Fashion = {}));
/// <reference path="Base.ts"/>
///<reference path="Runtime.ts"/>
///<reference path="Transpiler.ts"/>
///<reference path="Preprocessor.ts"/>
var Fashion;
(function (Fashion) {
    var Context = (function (_super) {
        __extends(Context, _super);
        function Context(config) {
            _super.call(this, config);
            this._fnMap = {};
            this.runtime = this.runtime || new Fashion.Runtime({
                context: this
            });
            this.preprocessor = this.preprocessor || new Fashion.Preprocessor({
                runtime: this.runtime
            });
            this.transpiler = this.transpiler || new Fashion.Transpiler({
                preprocessor: this.preprocessor
            });
        }
        Context.prototype.convert = function (ast, file) {
            var node, parser, jsCode;
            var transpiler = this.transpiler;
            if (typeof ast === 'string') {
                parser = new Fashion.parse.Parser();
                node = parser.parse(ast, file);
            }
            else {
                node = ast;
            }
            this.preprocessor.preprocess(node);
            jsCode = this.transpiler.transpile(node);
            this.runtime.docCache = this.transpiler.docCache;
            this.runtime.stringCache = this.transpiler.stringCache;
            this.lastVariables = transpiler.variables;
            return jsCode;
        };
        Context.prototype.getVariables = function () {
            return this.lastVariables;
        };
        Context.prototype.compile = function (jsCode) {
            return this.func = this.runtime.compile(jsCode);
        };
        Context.prototype.getFunc = function () {
            return this.func;
        };
        Context.prototype.run = function (code) {
            return this.runtime.run(code);
        };
        Context.prototype.parseSelectors = function (selector) {
            var fn = this._fnMap[selector], runtime = this.runtime;
            if (!fn) {
                var parser = new Fashion.parse.Parser(), transpiler = new Fashion.Transpiler(), ast, jsCode, parsedSelectors;
                parser.scanner = new Fashion.parse.Scanner(selector);
                parser.style = parser.scanner.style;
                ast = parser.parseSelectors();
                jsCode = transpiler.transpile(ast, true);
                jsCode = "return " + jsCode + ";";
                fn = runtime.createWrappedFn(jsCode);
                this._fnMap[selector] = fn;
            }
            parsedSelectors = runtime.callWrappedFn(fn, {});
            return parsedSelectors;
        };
        Context.prototype.getConfig = function (name) {
            return this[name];
        };
        Context.prototype.setConfig = function (name, value) {
            if (typeof name === 'string') {
                var prev = this[name];
                this[name] = value;
                return prev;
            }
            Fashion.apply(this, name);
            return null;
        };
        return Context;
    }(Fashion.Base));
    Fashion.Context = Context;
})(Fashion || (Fashion = {}));
/// <reference path="Base.ts"/>
/// <reference path='parse/Parser.ts'/>
///<reference path="Context.ts"/>
///<reference path="SassFile.ts"/>
var Fashion;
(function (Fashion) {
    var Builder = (function (_super) {
        __extends(Builder, _super);
        function Builder(config) {
            _super.call(this, config);
            this.scripts = {};
            Fashion.lastBuilder = this;
            this.context = new Fashion.Context(this.context);
            this.context.libraries = this.context.libraries || {
                compass: "../lib/compass/stylesheets/",
                blueprint: "../lib/blueprint/stylesheets/"
            };
        }
        Builder.prototype.getContext = function () {
            return this.context;
        };
        Builder.prototype.compile = function (scss) {
            var context = this.getContext(), jsCode = context.convert(scss), fn = context.compile(jsCode), css = fn();
            return css;
        };
        Builder.prototype.createSetters = function (vars) {
            var setters = '', varName;
            if (typeof vars === 'string') {
                setters = vars;
            }
            else {
                for (varName in vars) {
                    setters += varName + ": dynamic(" + vars[varName] + ");\n";
                }
            }
            return setters;
        };
        Builder.prototype.createVarsScope = function (vars) {
            var context = this.context, parser = new Fashion.parse.Parser(), preprocessor = new Fashion.Preprocessor({
                runtime: context.runtime
            }), newContext = new Fashion.Context({
                runtime: context.runtime,
                preprocessor: preprocessor
            }), setters = this.createSetters(vars), allVariables = Fashion.chain(context.getVariables()), setterAst, setterVariables, sortedAst, settersCode, settersFunc, newGlobals;
            setterAst = parser.parse(setters);
            preprocessor.preprocess(setterAst, true);
            preprocessor.loadPreprocessorCache(context.preprocessor);
            setterVariables = preprocessor.getVariables();
            Fashion.apply(allVariables, setterVariables);
            preprocessor.variables = allVariables;
            context.dynamicsMap = preprocessor.getDynamicsMap();
            sortedAst = preprocessor.getSortedDynamicAstNodes();
            settersCode = newContext.convert(sortedAst);
            settersFunc = newContext.compile(settersCode);
            // execute the generated fn to setup a global scope that
            // has all the parsed values;
            settersFunc(context.runtime, null, context.dynamicsMap);
            newGlobals = context.runtime.getGlobalScope();
            return newGlobals;
        };
        Builder.prototype.rebuildCss = function (vars) {
            var context = this.context, func = context.getFunc(), css;
            // now, re-executed the cached fn using the provided setters
            // as initial state
            css = func(context.runtime, vars, context.dynamicsMap);
            return css;
        };
        Builder.prototype.build = function (file, callback) {
            var me = this, context, sassFile, split, vars;
            if (typeof file !== 'string') {
                split = file.split;
                me.compressed = file.compress;
                vars = file.variables;
                file = file.path;
            }
            context = me.getContext();
            sassFile = me.getSassFile(file);
            sassFile.invalidate();
            sassFile.onReady(function () {
                Fashion.log("Building " + file);
                try {
                    var ast = sassFile.getExpandedAst(), converted = context.convert(ast), func = context.compile(converted), css = func();
                    if (vars) {
                        var scope = me.createVarsScope(vars);
                        css = me.rebuildCss(scope);
                    }
                    css.getText(function (cssContent) {
                        callback && callback(cssContent);
                        Fashion.log("Build complete for " + file);
                    }, me.compressed, me.indent, me.skipComments, split);
                }
                catch (error) {
                    Fashion.log("Build error for " + file);
                    var message = error + "";
                    console.trace();
                    Fashion.error(message);
                    if (callback) {
                        callback(["/* " + message + " */"], message);
                    }
                }
            });
        };
        Builder.prototype.getSassFile = function (path, relPath, origSource, importer) {
            var scripts = this.scripts, script;
            path = this.getSassFilePath(path, relPath);
            script = scripts[path];
            if (!script) {
                script = new Fashion.SassFile({
                    path: path,
                    builder: this,
                    originalSource: origSource,
                    importer: importer
                });
                scripts[path] = script;
            }
            return script;
        };
        Builder.prototype.getSassFilePath = function (path, relPath) {
            if (relPath) {
                path = this.getPath(path, relPath);
            }
            path = path.replace(/\\/g, "/");
            path = this.resolveUrl(path);
            return path;
        };
        Builder.prototype.getParser = function () {
            return new Fashion.parse.Parser();
        };
        Builder.prototype.getPath = function (baseFile, relPath) {
            if (relPath) {
                var separatorIndex = relPath.indexOf('/'), libraryPaths = this.context.libraries, root, libpath;
                if (separatorIndex !== 0) {
                    if (separatorIndex === -1) {
                        // no path separator found e.g. "@import 'compass';"
                        root = relPath;
                    }
                    else {
                        // path separator found e.g. "@import 'compass/css3"
                        root = relPath.substring(0, separatorIndex !== -1
                            ? separatorIndex
                            : relPath.length);
                    }
                    libpath = libraryPaths[root];
                    if (libpath) {
                        return this.calcPath(libpath, relPath);
                    }
                }
            }
            return this.calcPath(baseFile, relPath);
        };
        Builder.prototype.calcPath = function (baseFile, relPath) {
            var sep = baseFile.lastIndexOf("/"), path;
            if (sep > -1) {
                path = baseFile.substring(0, sep + 1) + relPath;
            }
            else {
                path = baseFile + "/" + relPath;
            }
            if (path.indexOf(".scss") === -1 && path.indexOf(".js") === -1) {
                path = path + ".scss";
            }
            return path;
        };
        Builder.prototype.getResolverEl = function () {
            if (!this.resolverEl) {
                this.resolverEl = document.createElement("a");
            }
            return this.resolverEl;
        };
        Builder.prototype.getCanonicalPath = function (path) {
            var parts = path.split('/'), out = [], part, p;
            for (p = 0; p < parts.length; p++) {
                part = parts[p];
                if (part == '.') {
                    continue;
                }
                else if (part == '..') {
                    if (out.length === 0) {
                        Fashion.raise("bad path for getCanonicalPath : " + path);
                    }
                    out.pop();
                }
                else {
                    out.push(part);
                }
            }
            return out.join('/');
        };
        Builder.prototype.resolveUrl = function (path) {
            // firefox won't automatically convert \ chars to / chars
            // so need to do that here
            path = path.replace(/\\/g, "/");
            if (Fashion.Env.isBrowser) {
                var resolverEl = this.getResolverEl();
                resolverEl.href = path;
                return resolverEl.href;
            }
            else {
                path = this.getCanonicalPath(path);
            }
            return path;
        };
        Builder.prototype.createStyleEl = function (href, content, before) {
            var head = document.getElementsByTagName('head')[0], base = document.createElement('base'), styleEl, ieMode;
            Fashion.log("Using base href : " + href);
            base.href = href;
            if (head.firstChild) {
                head.insertBefore(base, head.firstChild);
            }
            else {
                head.appendChild(base);
            }
            // IE hack to force re-processing of the href
            base.href = base.href;
            styleEl = document.createElement("style");
            styleEl.type = 'text/css';
            ieMode = ('styleSheet' in styleEl);
            if (ieMode) {
                if (before) {
                    head.insertBefore(styleEl, before);
                }
                else {
                    head.appendChild(styleEl);
                }
                styleEl.styleSheet.cssText = content;
            }
            else {
                styleEl.textContent = content;
                if (before) {
                    head.insertBefore(styleEl, before);
                }
                else {
                    head.appendChild(styleEl);
                }
            }
            head.removeChild(base);
            return styleEl;
        };
        Builder.prototype.injectCss = function (cssPath, cssContent) {
            var _this = this;
            this.lastCssPath = cssPath;
            if (!Array.isArray(cssContent)) {
                cssContent = [cssContent];
            }
            cssPath = this.resolveUrl(cssPath);
            var me = this, currEls = me.styleEls || [], href = cssPath.substring(0, cssPath.lastIndexOf("/") + 1);
            me.styleEls = [];
            cssContent.forEach(function (content, idx) {
                content += "\n/*# sourceURL=" + cssPath + "_" + idx + " */";
                var before = (currEls.length && currEls[0]) || null, styleEl = _this.createStyleEl(href, content, before);
                me.styleEls.push(styleEl);
            });
            var head = document.getElementsByTagName('head')[0];
            currEls.forEach(function (el) {
                head.removeChild(el);
            });
        };
        return Builder;
    }(Fashion.Base));
    Fashion.Builder = Builder; // Builder
})(Fashion || (Fashion = {}));

//# sourceMappingURL=fashion.js.map
