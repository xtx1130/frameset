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
				var that = this,
					key;
				for (var i = 0, len = name.length; i < len, key = name[i]; i++) {
					that = (that[key] = that[key] || {});
				}
				return that;
			},
			/**
			 *@description 动态加载js方法，可加载多个js
			 *@param src {string||array} 需要动态加载的js
			 *@param callback {function} 加载完成的回调
			 */
			load: function(src, callback) {
				var baseobj = {},
					fsobj = {},
					arr = [];

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
					for (var i = 0; i < xtx.LOAD_ARR.length; i++) {
						baseobj[xtx.LOAD_ARR[i]] = i + 1;
						fsobj[xtx.LOAD_ARR[i]] = 1;
					}
					for (var j = 0; j < src.length; j++) {
						if (!baseobj[src[j]]) {
							baseobj[src[j]] = i + 1;
							i++;
						}
					}
					for (var k in baseobj) {
						if (!fsobj[k]) {
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
	//view 相关东西beginning,内容中绑定了界面元素
	xtx.namespace('view');
	xtx.view.formHanderConfig = {
		commitstate:'status',
		ajaxstate:'status',
		ajaxtype:'post'
	}
	xtx.view.formHandler =function(id) {
		/**
		 *@description form提交控制函数，
		 class：submit是提交，
		 reset是重置，
		 back返回上一个页面
		 on 值不能为空
		 *@param id {string} 绑定的form的id
	     *@param {function} ajax完成后的回调
		 *@param {function} 提交之前的回调
		 *@author tianxin@leju.com
		*/
		var that = $(id),
			commit = that.find('.submit'),
			reset = that.find('.reset'),
			back = that.find('.back'),
			input = that.find('input'),
			action = that.attr('action'),
			re = /(rNumber)|(rUrl)|(rWeibo)|(rEmail)|(rPhoneNumber)|(rQQ)|(rEnglish)/ig,
			option = arguments,
			method = $(that).attr('method') || 'post',
			o = {};

		function doCheckErrortext(obj,str){
			if(obj.next('.error_text').length){
				obj.next('.error_text').html(str);
			}else{
				that.find('.error_text').html(str);
			}
		}

		function doCheckNull() {
			var text = that.find(".on"),
				length = text.length;
			while (--length >= 0) {
				if (text.eq(length).val() == '') {
					text.eq(length).addClass('error');
					doCheckErrortext(text.eq(length),'此项不能为空！');
				} else {
					text.eq(length).removeClass('error');
					doCheckErrortext(text.eq(length),'');
				}
			}
		}

		function doCheckReg(_this, cla) {
			//正则验证
			if (xtx.reg[cla](String(_this.val()))) {
				doCheckErrortext(_this,'');
				_this.removeClass('error');
			} else {
				doCheckErrortext(_this,'您书写的格式不符合规范！');
				_this.addClass('error');
			}
		}

		function ajaxConform(obj) {
			var url = obj.attr('url_check'),
				d = obj.attr('data').split(' '),
				o = {},
				dstr = [];
			for (var i = 0; i < d.length; i++) {
				dstr[i] = d[i].split(':');
				if (dstr[i][1]) {
					o[dstr[i][0]] = dstr[i][1];
				} else {
					o[dstr[i][0]] = obj.val();
				}
			}
			$.ajax({
				url: url,
				type: xtx.view.formHanderConfig.ajaxtype,
				dataType: "json",
				data: o,
				success: function(result) {
					if (typeof result != 'object')
						result = $.parseJSON(result);
					if (!result[xtx.view.formHanderConfig.ajaxstate]) {
						obj.addClass('error');
						var str = result.msg;
						doCheckErrortext(obj,str);
					} else {
						obj.removeClass('error');
						doCheckErrortext(obj,'');
					}
				}
			});
		}

		$.merge(input, that.find('select'));
		if (input) {
			input.each(function() {
				if ($(this).attr('class')) {
					var cla = String($(this).attr('class').match(re));
					if (cla != 'null') {
						$(this).on('blur', function() {
							doCheckReg($(this), cla);
						});
					}
				}
			})
		}
		if (that.find('[url_check]')) {
			that.find('[url_check]').each(function() {
				$(this).on('blur', function() {
					ajaxConform($(this));
				});
			})
		}
		back.on('click', function(e) {
			e.preventDefault();
			window.history.back();
		});
		commit.on('click', function(e) {
			e.preventDefault();
			doCheckNull();
			if (option[2]) {
				option[2].call(that)
			}
			if (!that.find('.error').length) {
				if (that.hasClass('Ajax')) {
					for (var i = 0; i < input.length; i++) {
						o[input.eq(i).attr('name')] = input.eq(i).val();
					}
					$.ajax({
						type: method,
						url: action,
						data: o,
						success: function(opt) {
							if (typeof opt != 'object')
								opt = $.parseJSON(opt);
							if (!opt[xtx.view.formHanderConfig.commitstate]) {
								alert(opt.error);
							} else {
								if (option[1]) {
									option[1].call(that, opt);
								}
							}
						}
					});
				} else {
					that.submit();
				}
			} else {
				return false;
			}
		});
		reset.on('click', function(e) {
			e.preventDefault();
			that.find("input[type='text']").each(function() {
				$(this).val('');
			});
		});
	} //formhander end
	_.xtx = xtx;
})(jQuery, window);