/**
 *@description jQuery 插件库，整合一些jquery插件用
 *@author tianxin@leju.com
 */
(function($, _) {
	//基类，提供封装插件的一些方法
	var xtx = (function() {
		//私有属性
		var url = window.location.href,
			BASE_URL = url.substring(0, url.indexOf('/', 7) + 1);
		return {
			extend: function(o) {
				var extended = o.extended || function() {};
				$.extend(this, o);
				if (extended) extended(this);
			},
			BASE_URL: BASE_URL,
			LOAD_ARR: [],
			/**
			 *@description 开辟子命名空间，支持开辟多级空间
			*/
			namespace: function(name) {
				if (typeof name != 'string') {
					return false;
				}
				name = name.split('.');
				var o = this,
					n;
				for (var i = 0, len = name.length; i < len, n = name[i]; i++) {
					o = (o[n] = o[n] || {});
				}
				return o;
			},
			/**
			 *@description 动态加载js方法，可加载多个js
			 *@param src [string||array] 需要动态加载的js
			 *@param callback [function] 加载完成的回调
			 */
			load: function(src, callback) {
				function load(s) {
					xtx.LOAD_ARR.push(arr[s]);
					if (s == arr.length - 1) {
						$.getScript(arr[s]).done(function() {
							if (callback)
								callback.call()
						});
					} else {
						$.getScript(arr[s]).done(function() {
							s++;
							load(s);
						}).progress(function() {
							xtx.LOAD_ARR.pop();
							load(s)
						})
					}
				}
				if (Object.prototype.toString.call(src) == '[object String]') {
					for (var i = 0; i < xtx.LOAD_ARR.length; i++) {
						if (xtx.LOAD_ARR[i] == src) {
							callback.call();
							return;
						}
					}
					xtx.LOAD_ARR.push(src);
					$.getScript(src).done(function() {
						callback.call()
					});
				} else if (Object.prototype.toString.call(src) == '[object Array]') {
					var o = {}, o1 = {}, arr = [];
					for (var i = 0; i < xtx.LOAD_ARR.length; i++) {
						o[xtx.LOAD_ARR[i]] = i + 1;
						o1[xtx.LOAD_ARR[i]] = 1;
					}
					for (var j = 0; j < src.length; j++) {
						if (!o[src[j]]) {
							o[src[j]] = i + 1;
							i++;
						}
					}
					for (var k in o) {
						if (!o1[k]) {
							arr.push(k);
						}
					}
					load(0);
				}
			},
			/**
			 *@description 提供reg匹配方法，表单中会用到
			*/
			reg: {
				rUrl: function(url) {
					var regExp = /(?:(?:http[s]?|ftp):\/\/)?[^\/\.]+?(\.)?[^\.\\\/]+?\.\w{2,}.*$/i;
					if (url.match(regExp)) {
						return true;
					} else {
						return false;
					}
				},
				rWeibo: function(url) {
					var regExp = /^((https|http):\/\/)?([\w-]+\.)?weibo\.com\/?[u\/]+?[^\/\.]+?(\.)?[^\.\\\/]+.*$/i;
					if (url.match(regExp)) {
						return true;
					} else {
						return false;
					}
				},
				rEmail: function(email) {
					var regExp = /^([a-zA-Z0-9_\-\.\+])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
					if (!regExp.exec(email)) {
						return false;
					}
					var Table = new Array("\"", "\'", "<", ">", "~", "\\", ";", ",", "?", "/"),
						I, J;
					for (I = 0; I < email.length; I++) {
						for (J = 0; J < Table.length; J++) {
							if (email.charAt(I) == Table[J]) {
								return false;
							}
						}
					}
					return true;
				},
				rNumber: function(words) {
					var patrn = /^\d*$/;
					return patrn.test(words);
				},
				rPhoneNumber: function(words) {
					var patrn = /^\+{0,1}(\d+\-{0,}\d+)+$/g;
					if (!patrn.test(words)) {
						return false;
					} else {
						return true;
					}
				},
				rQQ: function(words) {
					var patrn = /^\d{5,11}$/g;
					if (!patrn.test(words) || words.length > 11 || words.length < 5) {
						return false;
					} else {
						return true;
					}
				},
				rEnglish: function(words) {
					var patrn = /(\?|\>|\<|\(|\&|\!|\#|[\u4E00-\u9FBF])+/g;
					if (patrn.test(words) || words.length < 5) {
						return false;
					} else {
						return true;
					}
				},
			}
		};
	}());
	_.xtx = xtx;
})(jQuery, window);