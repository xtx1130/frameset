var LET = {
	/**
 	 *@descripttion:可用选择器：#id,.class,tag,[attr]
	*/
	$$: function(str) {
		var tempo = document,
			tempopt,
			regEncoding = "(?:\\\\.|[\\w\-?\\d*]|[^\\x00-\\xa0])+",
			whitespace = "[\\x20\\t\\r\\n\\f]",
			attr = "(?:\\[(.*)\\])?",
			selector,//内部私有，暂时无法扩展fn方法
			RE = {
				"ID": new RegExp("^#(" + regEncoding + ")" + attr),
				"CLASS": new RegExp("^\\.(" + regEncoding + ")" + attr),
				"TAG": new RegExp("^(" + regEncoding.replace("w", "w*") + ")" + attr)
			},
			order = ['ID', 'CLASS', 'TAG'],
			FIND = {
				ID: function(obj, name) {
					if (arguments[2])
						obj = doAttr(obj, arguments[2]);
					if (obj && !doChklen(obj)) {
						return (function getElementsByClass(searchId, node) {
							var els = node.getElementsByTagName('*'),
								elsLen = els.length,
								i;
							for (i = 0; i < elsLen; i++) {
								if (els[i].getAttribute('id') == searchId) {
									var idElements = els[i];
									break;
								}
							}
							return idElements;
						})(name, obj);
					} else if (obj) {
						LET.each(obj, function() {
							var that = this;
							return (function getElementsByClass(searchId, node) {
								var els = node.getElementsByTagName('*'),
									elsLen = els.length,
									i;
								for (i = 0; i < elsLen; i++) {
									if (that.getAttribute('id') == searchId) {
										var idElements = that;
										break;
									}
								}
								return idElements;
							})(name, obj[i]);
						})


					} else {
						return document.getElementById(name);
					}
				},
				CLASS: function(obj, name) {
					if (obj) {
						return getElementsByClassName(obj, name, arguments[2]);
					} else {
						return getElementsByClassName(document, name, arguments[2]);
					}
				},
				TAG: function(obj, name) {
					obj = obj || document;
					if (arguments[2])
						obj = doAttr(obj, arguments[2]);
					var temarr = [];
					if (obj && !doChklen(obj)) {
						var temo = obj.getElementsByTagName(name)
						return temo.length == 1 ? temo[0] : temo;
					} else if (obj) {
						LET.each(obj, function() {
							var temo = this.getElementsByTagName(name);
							if (temo) {
								for (var o=0;o<temo.length;o++) {
									if (typeof temo[o] == 'object') //.constructor.toString().match(/html/ig))
										temarr.push(temo[o])
								}
							}
						})
						return temarr.length == 1 ? temarr[0] : temarr;
					} else {
						var temo = obj.getElementsByTagName(name);
						return temo.length == 1 ? temo[0] : temo;
					}
				}
			};
		//main selector
		selector = function(str) {
			return new selector.fn.init(str)
		};
		selector.fn = selector.prototype = {
			init: function(str) {
				if (str) {
					if (Object.prototype.toString.call(str) == '[object Object]') {
						if (str.length&&str.splice) {
							return str;
						} else {
							this[0] = str;
						}
					} else if (Object.prototype.toString.call(str) != '[object String]') {
						if (!str.length) {
							this[0] = str;
						} else if (str.length == 1) {
							this[0] = str[0];
						} else {
							for (var i = 0; i < str.length; i++) {
								this[i] = str[i]
							}
						}
					} else {
						var temobj = jselemSelected(str); //jselemSelected is the method deal with string
						if (temobj.length > 1) {
							for (var i = 0; i < temobj.length; i++) {
								this[i] = temobj[i];
							}
						} else {
							this[0] = temobj;
							var i = 1;
						}
					}
				}
				this.length = i || 1;
				this.context = document;
			},
			splice: [].splice,
			/**
			 *@description 返回LET.$对象
			 *@param {number} num 索引
			 */
			eq: function(num) {
				var that = this;
				return LET.$(that[num]);
			},
			/**
			 *@description 内部方法过滤多余标签。eg:<script><link><meta>
			 *@return 过滤后的LET.$对象
			 */
			_rejection: function() {
				var that = this,
					r = [];
				for (var i = 0, len = that.length; i < len; i++) {
					if (that[i].nodeName&&!that[i].nodeName.match(/script|meta|title|link/ig)) {
						r.push(that[i]);
					}
				}
				return LET.$(r);
			},
			/**
			 *@description 下一个元素
			 */
			next: function() {
				var nx = this[0];
				if (node.nextSibling.nodeType == 3) {
					node = node.nextSibling.nextSibling;
				} else {
					node = node.nextSibling;
				}
				return LET.$(node);
			},
			/**
			 *@description 上一个元素
			 */
			prev: function() {
				var nx = this[0];
				if (node.previousSibling.nodeType == 3) {
					node = node.previousSibling.previousSibling;
				} else {
					node = node.previousSibling;
				}
				return LET.$(node);
			},
			/**
			 *@description 相邻元素
			 */
			siblings: function() {
				var r = [],
					that = this[0],
					n = that,
					k = that;
				for (; k; k = k.previousSibling) {
					if (k.nodeType === 1 && k != this[0]) {
						r.push(k)
					}
				}
				for (; n; n = n.nextSibling) {
					if (n.nodeType === 1 && n != this[0]) {
						r.push(n)
					}
				}
				return LET.$(r)._rejection();
			},
			children: function() {
				var r = [],
					that = this[0],
					chidren = that.childNodes;
				for (var i = 0, len = chidren.length; i < len; i++) {
					if (chidren[i].nodeType === 1) {
						r.push(chidren[i])
					}
				}
				return LET.$(r)._rejection();
			},
			parent: function() {
				var that = this[0],
					parent = that.parentNode;
				return LET.$(parent)._rejection();
			},
			//TO DO
			_find: function(str) {},
			bind: function(type, fn) {
				var that = this;
				LET.each(that, function() {
					var that = this;
					if (window.addEventListener) {
						that.addEventListener(type, fn, false);
					} else if (window.attachEvent) {
						that['e' + type + fn] = fn;
						that[type + fn] = function() {
							that['e' + type + fn](window.event);
						}
						that.attachEvent('on' + type, that[type + fn]);
					}
				})
			},
			on: function(type, elem, fn) {
				LET.$(document).bind(type, function(e) {
					e=event||e;
					var target = e.target||e.srcElement;
					var that = LET.$(elem);
					LET.each(that, function() {
						if(this==target)
							fn.call(LET.$(target))
						else {
							for(var i in LET.$(this).children()){
								if (LET.$(this).children()[i] == target){
									//console.log(LET.$(this).children()[i],target)
									fn.call(LET.$(target));
									break;
								}
							}
						}
					})
				});
			},
			trigger: function(type) {
				var kind = '';
				if (type.match(/abort|blur|change|error|focus|load|reset|resize|scroll|select|submit|unload/ig)) {
					kind = 'HTMLEvents';
				} else if (type.match(/DOMActivate|DOMFocusIn|DOMFocusOut|keydown|keypress|keyup/ig)) {
					kind = 'UIEevents';
				} else if (type.match(/click|mousedown|mousemove|mouseout|mouseover|mouseup/ig)) {
					kind = 'MouseEvents';
				}
				try {
					var evObj = document.createEvent(kind);
					evObj.initEvent(type, true, false);
					this[0].dispatchEvent(evObj);
				} catch (e) {
					this[0].fireEvent('on' + type);
				}
			},
			/**
			 *@description 获取元素内部的文本
			*/
			text: function() {
				var node,
					ret = "",
					i = 0,
					that = this[0],
					nodeType = that.nodeType;
				if (!nodeType) {
					for (;(node = that[i]); i++) {
						ret += LET.$(node).text();
					}
				} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
					if (typeof that.textContent === "string") {
						return LET.trim(that.textContent);
					} else {
						for (that = that.firstChild; that; that = that.nextSibling) {
							ret += LET.$(that).text();
						}
					}
				} else if (nodeType === 3 || nodeType === 4) {
					return LET.trim(that.nodeValue);
				}
				return LET.trim(ret);
			}
		}
		selector.fn.init.prototype = selector.fn;
		return selector(str);

		function jselemSelected(str) {
			str = LET.trim(str).split(' ') || 'window';

			for (var i = 0, tempj = ''; i < str.length; i++) {
				if (i < str.length - 1) {
					tempj = doFind(tempj, str[i]);
				} else if (i == str.length - 1) {
					return doFind(tempj, str[i]);
				}
			}
		}

		function getElementsByClassName(node, classname) {
			function getClass(searchClass, node) {
				if (node == null)
					node = document;
				var classElements = [],
					els = node.getElementsByTagName('*'),
					elsLen = els.length,
					pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)'),
					k, j;
				for (k = 0, j = 0; k < elsLen; k++) {
					if (pattern.test(els[k].className)&&els[k].nodeType==1) {
						classElements[j] = els[k];
						j++;
					}
				}
				if (arguments[2])
					classElements = doAttr(classElements, arguments[2]);
				return classElements.length == 1 ? classElements[0] : classElements;
			}
			if (node == document) {
				if (node.getElementsByClassName) {
					var tempcla = node.getElementsByClassName(classname);
					if (arguments[2])
						tempcla = doAttr(tempcla, arguments[2]);
					return tempcla.length == 1 ? tempcla[0] : tempcla;
				} else {
					return getClass(classname, node, arguments[2]);
				}
			} else {
				if (!node.length) {
					if (node.getElementsByClassName) {
						var tempcla = node.getElementsByClassName(classname);
						if (arguments[2])
							tempcla = doAttr(tempcla, arguments[2]);
						return tempcla.length == 1 ? tempcla[0] : tempcla;
					} else {
						return getClass(classname, node, arguments[2]);
					}
				} else {
					for (var i = 0; i < node.length; i++) {
						if (node[i].getElementsByClassName) {
							var tempcla = node.getElementsByClassName(classname);
							if (arguments[2])
								tempcla = doAttr(tempcla, arguments[2]);
							return tempcla.length == 1 ? tempcla[0] : tempcla;
						} else {
							return getClass(classname, node[i], arguments[2]);
						}
					}
				}
			}
		}

		function doFind(obj, st) { //main function about HTMLElements target
			var arr = [],
				match,
				obj = obj || '';
			for (var i = 0, len = order.length; i < len; i++) {
				if (match = RE[order[i]].exec(st)) {
					return FIND[order[i]](obj, match[1], match[2]);
				}
			}
		}

		function doAttr(obj, attr) {
			var temarr = [];
			if (obj && !doChklen(obj)) {
				if (obj.getAttribute(attr)) {
					return obj;
				}
			} else if (obj) {
				for (var i = 0; i < obj.length; i++) {
					if (obj[i].getAttribute(attr) != null) {
						temarr.push(obj[i]);
					}
				}
				return temarr.length == 1 ? temarr[0] : temarr;
			}
		}

		function doChklen(obj) {
			if (obj.length > 1)
				return true;
			return false;
		}

	},
	trim: function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, '');
	},
	each: function(obj, fn) {
		if (obj.length == undefined) {
			for (var i in obj)
				fn.call(obj[i], obj);
		} else {
			for (var i = 0, ol = obj.length; i < ol; i++) {
				//console.log(obj[i],i)
				if (fn.call(obj[i], obj) === false)
					break;
			}
		}
	}
}