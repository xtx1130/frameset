
define('LETcore', function() {
	var LET = (function() {
		return {
			_extend: function(destination, source) {
				for (var property in source) {
					destination[property] = source[property];
				}
				return destination;
			},
			ext: function(o) {
				var extended = o._extended || function() {};
				LET._extend(this, o);
				if (extended) extended(this);
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
			}
		}
	}());
	LET.ext({
		Callback: function(str) {
			str = str || 'base';
			var CallbackQueue = {};
			var opt = CallbackQueue[str] ? CallbackQueue[str] : CallbackQueue[str] = [],
				reg = /oncememory/ig,
				self = {
					add: function() {
						LET.each(arguments, function(e) {
							if (this && typeof this == 'function') {
								var tem = this;
								opt.push(tem);
							}
						});
					},
					fire: function(obj,data) {
						obj = obj || window;
						data = data || window;
						var temlist = [];
						if (opt && opt.length != 0 && str.match(reg)) {
							opt.shift().call(obj,data);
						} else if (opt && opt.length != 0 && !str.match(reg)) {
							while (opt.length) {
								var tem = opt.shift();
								tem.call(obj,data);
								temlist.push(tem);
							}
							opt = temlist;
						}
					},
					disable: function() {
						if (opt)
							opt = undefined;
					}
				};
			return self;
		},
		Deferred: function() {
			var _this,
				fired,
				str = str||'',
				donemem = LET.Callback('doneoncememory'),
				failmem = LET.Callback('failoncememory'),
				mem = LET.Callback('memory');

			function deferred() {
				_this = this;
			};
			deferred.prototype = {
				resolve: function(obj,data) {
					donemem.fire(obj,data);
					return this;
				},
				reject: function(obj,data) {
					failmem.fire(obj,data);
					return this;
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
					func = func;
					if (mem.queue().length != 1)
						mem.add(func);
					mem.fire();
					return _this.promise();
				},
				_done: function(func) {
					donemem.add(func);
					delete _this._always;
					delete _this._fail;
					delete _this._done;
					return _this.promise();
				},
				_fail: function(func) {
					failmem.add(func);
					delete _this._always;
					delete _this._done;
					delete _this._fail;
					return _this.promise();
				}
			};
			deferred.prototype.constructor = deferred;
			return new deferred();
		},
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
		 * @description 判断ie浏览器
		 * @return {Bool} 是ie为1
		 */
		isIE: function() {
			return !-[1, ];
		},
		isEmptyObject: function(obj) {
			for (var p in obj) {
				return false;
			}
			return true;
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
		promise: function() {
			return LET.Deferred().promise.call(this);
		},
		setCookie: function(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
		},
		trim: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, '');
		}
	})
	window.LET = LET;
});