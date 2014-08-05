define('base',['test1'],function() {
	/**
	 *@author tianxin@leju.com
	 */
	console.log('base');
	var CallbackQueue = {};
	xtx = (function() {
		return {
			extend: function(destination, source) {
				for (var property in source) {
					destination[property] = source[property];
				}
				return destination;
			},
			ext: function(o) {
				var extended = o.extended || function() {};
				xtx.extend(this, o);
				if (extended) extended(this);
			},
			/**
			 * @description ajax settings
			 * @param {object} obj 传入的对象参数
			 */
			ajaxSettings: function(obj) {
				return;
			},
			/**
			 *@version:0.2
			 *@description:selector
			 *@change:增加一些选择器扩展方法，内部封装selector，不可使用fn添加方法！！
			 */
			$$: function(str) {
				var tempo = document,
					tempopt,
					regEncoding = "(?:\\\\.|[\\w\-?\\d*]|[^\\x00-\\xa0])+",
					whitespace = "[\\x20\\t\\r\\n\\f]",
					attr = "(?:\\[(.*)\\])?",
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
								xtx.each(obj, function() {
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
								xtx.each(obj, function() {
									var temo = this.getElementsByTagName(name);
									if (temo) {
										for (var o = 0; o < temo.length; o++) {
											if (typeof temo[o] == 'object')
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
								if (str.length) {
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
					 *@description 返回xtx.$对象
					 *@param {number} num 索引
					 */
					eq: function(num) {
						var that = this;
						return xtx.$(that[num]);
					},
					/**
					 *@description 内部方法过滤多余标签。eg:<script><link><meta>
					 *@return 过滤后的xtx.$对象
					 */
					_rejection: function() {
						var that = this,
							r = [];
						for (var i = 0, len = that.length; i < len; i++) {
							if (that[i].nodeName && !that[i].nodeName.match(/script|meta|title|link/ig)) {
								r.push(that[i]);
							}
						}
						return xtx.$(r);
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
						return xtx.$(node);
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
						return xtx.$(node);
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
						return xtx.$(r)._rejection();
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
						return xtx.$(r)._rejection();
					},
					parent: function() {
						var that = this[0],
							parent = that.parentNode;
						return xtx.$(parent)._rejection();
					},
					//TO DO
					_find: function(str) {},
					bind: function(type, fn) {
						var that = this[0];
						if (window.addEventListener) {
							that.addEventListener(type, fn, false);
						} else if (window.attachEvent) {
							that['e' + type + fn] = fn;
							that[type + fn] = function() {
								that['e' + type + fn](window.event);
							}
							that.attachEvent('on' + type, that[type + fn]);
						}
					},
					on: function(type, elem, fn) {
						xtx.$(document).bind(type, function(e) {
							e = event || e;
							var that = xtx.$(elem),
								target = e.target || e.srcElement;
							xtx.each(that, function() {
								if (this == target)
									fn.call(xtx.$(target))
								else {
									for (var i in xtx.$(this).children()) {
										if (xtx.$(this).children()[i] == target) {
											fn.call(xtx.$(target));
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
					text: function() {
						var node,
							ret = "",
							i = 0,
							that = this[0],
							nodeType = that.nodeType;
						if (!nodeType) {
							for (;
								(node = that[i]); i++) {
								ret += xtx.$(node).text();
							}
						} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
							if (typeof that.textContent === "string") {
								return xtx.trim(that.textContent);
							} else {
								for (that = that.firstChild; that; that = that.nextSibling) {
									ret += xtx.$(that).text();
								}
							}
						} else if (nodeType === 3 || nodeType === 4) {
							return xtx.trim(that.nodeValue);
						}
						return xtx.trim(ret);
					}
				}
				selector.fn.init.prototype = selector.fn;
				return selector(str);

				function jselemSelected(str) {
					str = xtx.trim(str).split(' ') || 'window';

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
							if (els[k].nodeType == 1 && pattern.test(els[k].className)) {
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
			/**
			 *@version:0.1
			 *@description 数组，对象等统一处理方法
			 *@chagne:更改判断循环方法
			 */
			each: function(obj, fn) {
				if (obj.length == undefined) {
					for (var i in obj)
						fn.call(obj[i], obj);
				} else {
					for (var i = 0, ol = obj.length; i < ol; i++) {
						if (fn.call(obj[i], obj) === false)
							break;
					}
				}
			},
			Callback: function(str) {
				str = str || 'base';
				var opt = CallbackQueue[str] ? CallbackQueue[str] : CallbackQueue[str] = [],
					reg = /oncememory/ig,
					self = {
						add: function() {
							xtx.each(arguments, function(e) {
								if (this && typeof this == 'function') {
									var tem = this;
									opt.push(tem);
								}
							});
						},
						fire: function() {
							var temlist = [];
							if (opt && opt.length != 0 && str.match(reg)) {
								opt.shift().call(this);
								opt = [];
							} else if (opt && opt.length != 0 && !str.match(reg)) {
								while (opt.length) {
									var tem = opt.shift();
									tem.call(this);
									temlist.push(tem);
								}
								opt = temlist;
							}
						},
						disable: function() {
							if (opt)
								opt = undefined;
						},
						queue: function() {
							return opt;
						}
					};
				return self;
			},
			Deferred: function() {
				var _this,
					fired,
					donemem = xtx.Callback('doneoncememory'),
					failmem = xtx.Callback('failoncememory'),
					mem = xtx.Callback('memory');

				function deferred() {
					_this = this;
				};
				deferred.prototype = {
					resolve: function(fn) {
						fired = 1;
						return this;
						//_this._always.apply(this);
						//_this._done.call(this, fn);
					},
					reject: function(fn) {
						fired = 0;
						return this;
						//_this._always.call(this);
						//_this._fail.call(this, fn);
					},
					state: (function() {
						return {
							pending: function(fn) {
								if (fn && typeof fn == 'function')
									fn.call(this)
							},
							resolved: function(fn) {
								if (fn && typeof fn == 'function')
									_this.resolve.call(this, fn)
							},
							rejected: function(fn) {
								if (fn && typeof fn == 'function')
									_this.reject.call(this, fn)
							}
						}
					})(),
					promise: function() {
						return {
							then: (function() {
								return new deferred();
							}()),
							state: _this.state,
							promise: arguments.callee,
							fail: _this._fail,
							done: _this._done,
							always: _this._always
						}
					},
					progress: function(callback) {
						return callback();
					},
					notify: function() {
						return {
							progress: _this.progress.call(this)
						}
					},
					_always: function(func) {
						if (mem.queue().length != 1)
							mem.add(func);
						mem.fire();
						return _this;
					},
					_done: function(func) {
						if (fired == 1) {
							donemem.add(func);
							donemem.fire();
							delete _this._always;
							delete _this._fail;
							delete _this._done;
							return _this;
						}
					},
					_fail: function(func) {
						if (fired == 0) {
							failmem.add(func);
							failmem.fire();
							delete _this._always;
							delete _this._done;
							delete _this._fail;
							return _this;
						}
					}
				};
				deferred.prototype.constructor = deferred;
				return new deferred();
			},
			promise: function() {
				return xtx.Deferred().promise.call(this);
			}
		}
	})();
	xtx.ui = {};
	xtx.reg = {
		//匹配html中自关闭标签用replace替换为成对标签eg:<div/> -> <div></div>
		rxhtmlTag: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig

	};
	xtx.ext({
		setCookie: function(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
		},
		getCookie: function(c_name) {
			if (document.cookie.length > 0) {
				var c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start += c_name.length + 1;
					var c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1)
						c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return false;
		},
		/**
		 * @description 元素触发事件队列，可以进行一次事件触发绑定或者多次触发事件的绑定
		 * @param {string} arguments[0] 可有可无，如果不写则默认为click事件
		 * @param {object} arguments[1] 绑定事件的对象
		 * @param {function} arguments[2] 绑定的事件函数
		 * @paran {boolean} arguments[3] 是否为触发一次的函数，默认为否
		 */
		superAddEvent: function() {
			var method, obj, func, flag, list, str;
			if (arguments[0].constructor == String) {
				method = arguments[0];
				obj = arguments[1];
				func = arguments[2];
				flag = arguments[3] || 0;
			} else {
				method = 'click';
				obj = arguments[0];
				func = arguments[1];
				flag = arguments[2] || 0;
			}
			if (flag) {
				str = 'Cdoc_' + method + 'oncememory';
			} else {
				str = 'Cdoc_' + method;
			}
			list = xtx.Callback(str);
			list.add(func);
			if (list.queue()) {
				xtx.each(obj, function() {
					xtx.bindEvent(this, method, function() {
						list.fire();
					});
				})
			}
		},
		getLength: function(str, shortUrl) {
			str = str + '';
			if (true == shortUrl) {
				// 一个URL当作十个字长度计算
				return Math.ceil(str.replace(/((news|telnet|nttp|file|http|ftp|https):\/\/){1}(([-A-Za-z0-9]+(\.[-A-Za-z0-9]+)*(\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\.[0-9]{1,3}){3}))(:[0-9]*)?(\/[-A-Za-z0-9_\$\.\+\!\*\(\),;:@&=\?\/~\#\%]*)*/ig, 'sxooxxooxxsxooxxooxx')
					.replace(/^\s+|\s+$/ig, '').replace(/[^\x00-\xff]/ig, 'xx').length / 2);
			} else {
				return Math.ceil(str.replace(/^\s+|\s+$/ig, '').replace(/[^\x00-\xff]/ig, 'xx').length / 2);
			}
		},
		/**
		 * @description 开辟命名空间
		 * @param {object} o 全局变量
		 * @param {string} name 命名空间
		 */
		namespace: function(o, name) {
			if (typeof name != 'string') {
				return false;
			}
			name = name.split('.');
			var n;
			o = _.o;
			for (var i = 0, len = name.length; i < len, n = name[i]; i++) {
				o = (o[n] = o[n] || {});
			}
			return o;
		},
		/**
		 * @description 去除字符串首尾空格
		 * @param {String} str 需要去空格的字符串
		 * @return {String} 去掉空格后的字符串
		 */
		trim: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, '');
		},
		/**
		 * @description 给html赋予新的class
		 * @param {Object} obj html对象
		 * @param {String} newclass 需要赋予的class
		 */
		setAttr: function(obj, newclass) {
			obj.className = newclass;
		},
		/**
		 * @description 兼容ie移除基础事件
		 * @param {Object} e event对象
		 */
		preventDefault: function(e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			} else {
				window.event.returnValue = false;
			}
			return false;
		},
		/**
		 * @description 添加一个class
		 * @param {Object} obj 需要绑定的对象
		 * @param {Object} cla 需要添加的class
		 */
		addClass: function(obj, cla) {
			var clas = obj.getAttribute('class') || obj.getAttribute("className"),
				newclass = clas + ' ' + cla;
			if (clas.indexOf(cla) < 0) {
				this.setAttr(obj, newclass);
			} else {
				return false;
			}
		},
		/**
		 * @description 删除一个class
		 * @param {Object} obj 需要绑定的对象
		 * @param {String} cla 需要删除的class
		 */
		delClass: function(obj, cla) {
			var clas = obj.getAttribute('class') || obj.getAttribute("className"),
				str = cla,
				arr = clas.split(str),
				tmplarr = [];
			if (clas.indexOf(str)) {
				for (var i in arr) {
					tmplarr.push(arr[i]);
				}
				clas = this.trim(tmplarr.join(''));
				this.setAttr(obj, clas);
			} else {
				return false;
			}
		},
		/**
		 * @description 获取html元素的class
		 * @param {String} node 开始遍历的节点
		 * @param {String} classname 查找的class
		 */
		getStyle: function(obj, attr) {
			if (obj.currentStyle) {
				return obj.currentStyle[attr];
			} else {
				return getComputedStyle(obj, false)[attr];
			}
		},
		nextSibling: function(node) {
			var tempLast = node.parentNode.lastChild,
				tempObj = node.nextSibling;
			if (node == tempLast)
				return null;
			while (tempObj.nodeType != 1 && tempObj.nextSibling != null)
				tempObj = tempObj.nextSibling;
			return (tempObj.nodeType == 1) ? tempObj : null;
		},
		prevSibling: function(node) {
			var tempFirst = node.parentNode.firstChild,
				tempObj = node.previousSibling;
			if (node == tempFirst)
				return null;
			while (tempObj.nodeType != 1 && tempObj.previousSibling != null)
				tempObj = tempObj.previousSibling;
			return (tempObj.nodeType == 1) ? tempObj : null;
		},
		/**
		 * @description js钩子
		 * @param {String} ho 钩子名称
		 */
		hooks: function(ho) {
			function Hook() {
				Hook.prototype.init.call(this, arguments);
				//Hook.prototype.init.prototype=Hook.prototype;
			}
			Hook.prototype = {
				init: function(arrho) {
					this.queue = {};
					this.queue[arrho[0]] = new Array();
				},
				addAction: function() {
					var i = arguments.length;
					while (i >= 0) {
						if (typeof arguments[i] == 'function') {
							this.queue[ho].push(arguments[i])
						} else {}
						i--;
					}
					return this;
				},
				doAction: function() {
					var arrFunc = this.queue[ho],
						i = 0,
						func;
					while (arrFunc[0] && !i) {
						i = 1;
						eval('~' + arrFunc.pop() + '()');
						i = 0;
					}
				}
			}
			return new Hook(ho);
		},
		/**
		 * @description 兼容ie的事件绑定
		 * @param {Object} obj 绑定事件的对象
		 * @param {String} type 绑定的操作
		 * @param {function} fn 事件处理函数
		 */
		bindEvent: function(obj, type, fn) {
			if (window.addEventListener) {
				obj.addEventListener(type, fn, false);
			} else if (window.attachEvent) {
				obj['e' + type + fn] = fn;
				obj[type + fn] = function() {
					obj['e' + type + fn](window.event);
				}
				obj.attachEvent('on' + type, obj[type + fn]);
			}
		},
		/**
		 * @description 兼容ie的事件移除
		 * @param {Object} obj 绑定事件的对象
		 * @param {String} handler 被注销的函数名
		 * @param {String} type 移除的操作
		 */
		removeEvent: function(obj, handler, type) {
			if (window.removeEventListener) {
				obj.removeEventListener(type, handler, false);
			} else if (window.detachEvent) {
				obj.detachEvent("on" + type, handler);
			}
		},
		/**
		 * @description 去除字符串首尾空格
		 * @param {String} str 需要去空格的字符串
		 * @return {String} 去掉空格后的字符串
		 */
		trim: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, '');
		},
		/**
		 * @description 判断ie浏览器
		 * @return {Bool} 是ie为1
		 */
		isIE: function() {
			return !-[1, ];
		},
		/**
		 * @description 兼容ie移除基础事件
		 * @param {Object} e event对象
		 */
		preventDefault: function(e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			} else {
				window.event.returnValue = false;
			}
			return false;
		},
		/**
		 * @description js手动触发事件
		 * @param {Object} obj 需要绑定的对象
		 */
		dispatchEvent: function(obj) {
			var e = this.change;
			if (document.createEvent) {
				var evObj = document.createEvent('MouseEvents');
				evObj.initEvent(e, true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null);
				obj.dispatchEvent(evObj);
			} else if (document.createEventObject) {
				obj.fireEvent('on' + e);
			}
		},
		/**
		 * @description 检查mouseover，mouseout的冒泡
		 * @param {this} target 需要绑定的对象
		 */
		checkHover: function(e, target) {
			function getEvent(e) {
				return e || window.event;
			}
			if (getEvent(e).type == "mouseover") {
				return !contains(target, getEvent(e).relatedTarget || getEvent(e).fromElement) && !((getEvent(e).relatedTarget || getEvent(e).fromElement) === target);
			} else {
				return !contains(target, getEvent(e).relatedTarget || getEvent(e).toElement) && !((getEvent(e).relatedTarget || getEvent(e).toElement) === target);
			}
		},
		/**
		 * @description js动态加载
		 * @param {String} url 需要加载的script路径
		 * @param {Function} callback callback函数
		 */
		loadScript: function(url, callback) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			callback = callback || function() {};
			if (script.readyState) {
				script.onreadystatechange = function() {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				script.onload = function() {
					callback();
				};
			}
			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		ajax: function(obj) {
			obj = obj || {};
			obj.url = obj.url || '';
			obj.method = obj.method || 'get';
			obj.async = obj.async || true;
			obj.data = obj.data || {};
			obj.success = (typeof obj.success == 'function') ? obj.success : function() {};
			obj.error = (typeof obj.success == 'function') ? obj.success : function() {};
			obj.beforeSend = (typeof obj.beforeSend == 'function') ? obj.success : function() {};
			var XMLHttpReq,
				def = xtx.Deferred();
			try {
				XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (E) {
				try {
					XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (E) {
					XMLHttpReq = new XMLHttpRequest();
				}
			}
			XMLHttpReq.open(obj.method, obj.url, obj.async);
			//XMLHttpReq.onreadystatechange = processResponse;
			XMLHttpReq.send(obj.data);
			if (XMLHttpReq.readyState == 4) {
				if (XMLHttpReq.status == 200) {
					var text = XMLHttpReq.responseText;
					text = window.decodeURI(text);
					def.resolve();
					return def;
				} else {
					def.reject();
					return def;
				}
			} else {
				def.reject();
				return def;
			}
		},
		/**
		 * @description 简易div拖动
		 * @param {object} obj 需要拖动的div对象
		 * @TODO 边界判断，完善程序
		 */
		dragDiv: function(obj) {
			this.bindEvent(obj, 'mousedown', function(event) {
				var e = event || window.event,
					t = e.target || e.srcElement,
					//鼠标按下时的坐标x1,y1
					x1 = e.clientX,
					y1 = e.clientY,
					//鼠标按下时的左右偏移量
					dragLeft = this.offsetLeft,
					dragTop = this.offsetTop;
				document.onmousemove = function(event) {
					var e = event || window.event,
						t = e.target || e.srcElement,
						//鼠标移动时的动态坐标
						x2 = e.clientX,
						y2 = e.clientY,
						//鼠标移动时的坐标的变化量
						x = x2 - x1,
						y = y2 - y1;
					dragDiv.style.left = (dragLeft + x) + 'px';
					dragDiv.style.top = (dragTop + y) + 'px';
				}
				document.onmouseup = function() {
					this.onmousemove = null;
					this.onmouseup = null;
				}
			});
		},
		carousel: function(options) {
			function Carousel(o) {
				Carousel.prototype.init.call(this, arguments);
			}
			Carousel.prototype = {
				init: function(opt) {
					opt = opt[0];
					this.car = xtx.getElementsByClassName(document, opt.car) || 'car';
					this.change = xtx.getElementsByClassName(document, opt.change) || 'change';
					this.next = opt.next || '';
					this.prev = opt.prev || '';
					this.stop = opt.stop || '';
					this.doMain();
				},
				doMain: function() {
					var that = this,
						scroll = that.car,
						control = that.change;
					window.onload = function() {
						setTimeout(function() {
							that.silde(scroll[0], 'left', 440);
							that.doNext(scroll[0]);
						}, 1000);
					}
				},
				doBegin: function() {

				},
				doStop: function() {

				},
				doNext: function(o) {
					xtx.addClass(xtx.nextSibling(o) ? xtx.nextSibling(o) : that.car[0], 'next');
					var ne = xtx.getElementsByClassName(document, 'next')[0],
						that = this;
					ne.style.display = 'block';
					that.silde(ne, 'left', 440, function() {
						xtx.delClass(ne, 'next');
						that.doNext(ne)
					});
				},
				doPrev: function(o) {
					xtx.addClass(xtx.prevSibling(o) ? xtx.prevSibling(o) : that.car[that.car.length - 1], 'prev');
					var ne = xtx.getElementsByClassName(document, 'prev')[0],
						that = this;
					ne.style.display = 'block';
					that.silde(ne, 'left', 440);
					xtx.delClass(ne, 'prev');
				},
				/**
				 *@description 左右滑动
				 *@param obj {object} 滑动对象
				 *@param direct {string} 方向
				 *@param distence {number} 距离
				 */
				silde: function(obj, direct, distence, func) {
					var that = obj,
						sty = xtx.getStyle(that, 'left'),
						dis = parseInt(sty) || 0;
					func = func || function() {};

					function _a() {
						dis -= 10;
						that.style.left = dis + 'px';
						if (!arguments[0] && Math.abs(dis) == distence) {
							clearInterval(s);
							func();
						} else if (arguments[0] && Math.abs(dis) == 0) {
							clearInterval(s);
							func();
						}
					}

					function _b() {
						dis += 10;
						that.style.left = dis + 'px';
						if (!arguments[0] && Math.abs(dis) == distence) {
							clearInterval(s);
							func();
						} else if (arguments[0] && Math.abs(dis) == 0) {
							clearInterval(s);
							func();
						}
					}
					if (direct == 'left') { //from right to left
						if (dis == 0) {
							var s = setInterval(function() {
								_a(0);
							}, 20);
						} else if (dis > 0) {
							var s = setInterval(function() {
								_a(1);
							}, 20);
						}
					} else if (direct == 'right') { //from left to right
						if (dis == 0) {
							var s = setInterval(function() {
								_b(0);
							}, 20);
						} else if (!dis) {
							var s = setInterval(function() {
								_b(1);
							}, 20);
						}
					} else {
						return false;
					}
				}
			}
			return new Carousel(options);
		}
	});
	return '1base'
})