/**
 *@description 简单的AMD依赖关系
 *@version 1.0
 *@author tianxin@leju.com
 *@method require
 *@param {Array|String} [id] 引入的文件（文件组）的路径
 *@param {Function|null} [callback] 引入文件后的回调
 *@method define
 *@param {String} [id] 定义的文件（函数）id
 *@param {Array|null} [deps] 依赖关系,所依赖的文件 
 *@param {Function} [factory] define定义的函数
 *@description 有全局参数ex.modules.name.exports来选择模块中的return值进行调用
*/
(function(_) {
	var modules = {},//存储全部define信息
		exports = [],//存储define的依赖返回值
		exportsrequire = [],//存储require的文件的返回值
		ex = {
			define: function(id, deps, factory) {
				if (modules[id]) {
					throw "module " + id + " 模块已存在!";
				}
				if (arguments.length > 2) {
					modules[id] = {
						id: id,
						deps: deps,
						factory: factory,
						exports:''
					};
				} else {
					factory = deps;
					modules[id] = {
						id: id,
						factory: factory
					};
					modules[id].exports = factory.call()||'';
				}
			},
			require: function(id, callback) {
				if (isArray(id)) {
					if (id.length > 1) {
						return makeRequire(id, callback);
					}
					id = id[0];
					loadScript(id, function(loadmodule) {
						if (!modules[loadmodule]) {
							throw "module " + loadmodule + " not found";
						}
						if (callback) {
							var module = build(modules[loadmodule], callback);
							return module;
						} else {
							if (modules[id].factory) {
								return build(modules[loadmodule]);
							}
							return modules[loadmodule].exports;
						}
					})
				}
			}
		};

	function each(obj, fn) {
		if (obj.length == undefined) {
			for (var i in obj)
				fn.call(obj[i], obj);
		} else {
			for (var i = 0, ol = obj.length; i < ol; i++) {
				if (fn.call(obj[i], obj) === false)
					break;
			}
		}
	}

	function isFunction(it) {
		return Object.prototype.toString.call(it) === '[object Function]';
	}

	function isArray(it) {
		return Object.prototype.toString.call(it) === '[object Array]';
	}

	function loadScript(path, callback) {
		var def = path.split('/').pop();
		if (def.match('.js')) {
			def = def.split('.js')[0];
			path = path.split('.js')[0];
		}
		var Head = document.getElementsByTagName('HEAD').item(0),
			Script = document.createElement('script'),
			done = document.dispatchEvent;
		Script.type = 'text/javascript';
		Script.src = path + '.js';
		Head.appendChild(Script);
		Script[done ? 'onload' : 'onreadystatechange'] = function() {
			if (done || /load|complete/i.test(Script.readyState)) {
				callback.call(window,def)
			}
		}
	}
	//解析依赖关系。**核心函数**
	function parseDeps(module, callback) {
		var deps = module['deps'],
			arr = deps.slice(0),
			cb = callback || function() {};
		(function recur(singlemodule) {
			loadScript(singlemodule, function(loadmodule) {
				if (modules[loadmodule]['deps']) {
					parseDeps(modules[loadmodule], function() {
						modules[loadmodule]['exports'] = modules[loadmodule].factory.call()||'';
						//TO DO:返回暂时没用，用遍历deps来确定参数
						exports.push(modules[loadmodule]['exports']);
						if (arr.length == 0) {
							cb.call();
							return;
						} else {
							recur(arr.shift());
						}
					})
				} else {
					if (arr.length == 0) {
						cb.call();
						return;
					} else {
						recur(arr.shift());
					}
				}
			})
		})(arr.shift())
		//返回函数return值供callback调用
		return exports;
	}
	//对require的解析
	function build(module, callback) {
		var depsList, existMod,
			factory = module['factory'],
			id = module['id'];
		if (module['deps']) {
			depsList = parseDeps(module, function() {
				var tem = [];
				for(var i=0,len= module['deps'].length;i<len;i++){
					modules[module['deps'][i]]['exports']?tem.push(modules[module['deps'][i]]['exports']):tem;
				}
				exportsrequire.push(module['exports']=factory.apply(module, tem));
				if (callback) {
					callback.apply(module, exportsrequire);
					ex.modules = modules;
				}
			});
		} else {
			if (callback) {
				callback.call()
			}
		}
		return exportsrequire;
	}

	function makeRequire(ids, callback) {
		var arr = ids.slice(0),
			tem = [],
			fn,
			factory = callback;
		(function recur(singlemodule) {
			loadScript(singlemodule, function(loadmodule) {
				if (modules[loadmodule]['deps']) {
					tem = build(modules[loadmodule],function(){
						if(arr.length==0){
							if(factory)
								factory.apply(window, tem)
						}else{
							recur(arr.shift());
						}
					})
				}else{
					tem = build(modules[loadmodule],function(){
						if(arr.length==0){
							if(factory)
								factory.apply(window, tem)
						}else{
							recur(arr.shift());
						}
					})
				}
				if (arr.length == 0) {
					return;
				}
			})
		})(arr.shift());
	}

	window.exmodules = modules;
	if (typeof module === "object" && typeof require === "function") {
		module.exports.require = ex.require;
		module.exports.define = ex.define;
	} else {
		_.require = ex.require;
		_.define = ex.define;
	}
})(window);