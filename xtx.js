!function(_){
	var xtx=(function(){
		return{
			extend: function (destination, source) {
				for ( var property in source) {
				    destination[property] = source[property];
				}
				return destination;
			},
			ext: function (o) {
                var extended = o.extended || function(){};
                xtx.extend(this, o);
                if (extended) extended(this);
            }
		}
	})();
	xtx.ui={};
	xtx.ext({
        setCookie: function (c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
        },
        getCookie: function (c_name) {
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
        isMobileDevice: function (parameter) {
            return _.getCookie(parameter);
        },
        getLength : function(str, shortUrl) {
		    str = str + '';
		    if (true == shortUrl) {
		    // 一个URL当作十个字长度计算
		     	return Math.ceil(str.replace(/((news|telnet|nttp|file|http|ftp|https):\/\/){1}(([-A-Za-z0-9]+(\.[-A-Za-z0-9]+)*(\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\.[0-9]{1,3}){3}))(:[0-9]*)?(\/[-A-Za-z0-9_\$\.\+\!\*\(\),;:@&=\?\/~\#\%]*)*/ig, 'sxooxxooxxsxooxxooxx')
		            .replace(/^\s+|\s+$/ig,'').replace(/[^\x00-\xff]/ig,'xx').length/2);
		        } else {
		            return Math.ceil(str.replace(/^\s+|\s+$/ig,'').replace(/[^\x00-\xff]/ig,'xx').length/2);
		        }
		},
		/**
		* @description 去除字符串首尾空格
		* @param {String} str 需要去空格的字符串
		* @return {String} 去掉空格后的字符串
		*/
		trim:function(str){
			return str.replace(/(^\s*)|(\s*$)/g,'');
		},
		/**
		* @description 给html赋予新的class
		* @param {Object} obj html对象
		* @param {String} newclass 需要赋予的class
		*/
		setAttr:function(obj, newclass){
			obj.className=newclass;
		},
		/**
		* @description 兼容ie移除基础事件
		* @param {Object} e event对象
		*/
		preventDefault:function(e) {
	     	if(e && e.preventDefault){
	        	e.preventDefault();
	    	}else{ 
	        	window.event.returnValue = false;
	    	}
	    	return false;
		},
		/**
		* @description 添加一个class
		* @param {Object} obj 需要绑定的对象
		* @param {Object} cla 需要添加的class
		*/
		addClass:function(obj, cla){
			var clas = obj.getAttribute('class')||obj.getAttribute("className"),
				newclass = clas+' '+cla;
			if(clas.indexOf(cla) < 0){
				this.setAttr(obj, newclass);
			}else{
				return false;
			}
		},
		/**
		* @description 删除一个class
		* @param {Object} obj 需要绑定的对象
		* @param {String} cla 需要删除的class
		*/
		delClass:function(obj, cla){
			var clas = obj.getAttribute('class')||obj.getAttribute("className"),
				str = cla,
				arr = clas.split(str),
				tmplarr = [];
			if(clas.indexOf(str)){
				for(var i in arr){
					tmplarr.push(arr[i]);
				}
				clas = this.trim(tmplarr.join(''));
				this.setAttr(obj, clas);
			}
			else{
				return false;
			}
		},
        /**
		* @description 获取html元素的class
		* @param {String} node 开始遍历的节点
		* @param {String} classname 查找的class
		*/
		getStyle:function(obj, attr){  
		    if(obj.currentStyle){  
		        return obj.currentStyle[attr];  
		    }else{  
		        return getComputedStyle(obj,false)[attr];  
		    }  
		}, 
        getElementsByClassName:function(node, classname){
			if(node.getElementsByClassName){
			    return node.getElementsByClassName(classname);
			}else{
			    return (function getElementsByClass(searchClass, node){
			        if(node == null)
			        	node = document;
			        var classElements = [],
			        els = node.getElementsByTagName('*'),
			        elsLen = els.length,
			        pattern = new RegExp('(^|\\s)'+searchClass+'(\\s|$)'), i, j;
			        for (i = 0, j = 0; i < elsLen; i++){
			            if(pattern.test(els[i].className)){
			            	classElements[j] = els[i];
			            	j++;
			            }
			        }
			        return classElements;
			    })(classname, node);
			}
		},
		nextSibling:function(node){
		   	var tempLast = node.parentNode.lastChild,
		   		tempObj = node.nextSibling;
		   	if(node == tempLast)
		   		return null;
		  	while(tempObj.nodeType != 1 && tempObj.nextSibling != null)
		   		tempObj = tempObj.nextSibling;
		  	return (tempObj.nodeType == 1) ? tempObj : null;
		},
		prevSibling:function(node){
		  	var tempFirst = node.parentNode.firstChild,
		  		tempObj = node.previousSibling;
		  	if(node == tempFirst)
		   		return null;
		  	while(tempObj.nodeType != 1 && tempObj.previousSibling != null)
				tempObj = tempObj.previousSibling;
		return (tempObj.nodeType == 1) ? tempObj : null;
		},
		/**
		* @description js钩子
		* @param {String} ho 钩子名称
		*/
		hooks:function(ho){
			function Hook(){
				Hook.prototype.init.call(this,arguments);
				//Hook.prototype.init.prototype=Hook.prototype;
			}
			Hook.prototype={
				init:function(arrho){
					this.queue = {};
					this.queue[arrho[0]] = new Array();
				},
				addAction:function(){
					var i = arguments.length;
					while(i >= 0){
						if(typeof arguments[i] == 'function'){
							this.queue[ho].push(arguments[i])
						}else{
						}
						i--;
					}
					return this;
				},
				doAction:function(){
					var arrFunc = this.queue[ho],
						i=0,
						func;
					while(arrFunc[0]&&!i){
						i=1;
						eval('~'+arrFunc.pop()+'()');
						i=0;
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
		bindEvent:function(obj, type, fn){
			if ( obj.attachEvent ) {
			    obj['e'+type+fn] = fn;
			    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
			    obj.attachEvent( 'on'+type, obj[type+fn] );
			  } else
			    obj.addEventListener( type, fn, false );
		},
		/**
		* @description 取消事件
		* @param {Object} obj 绑定事件的对象
		* @param {String} type 绑定的操作
		* @param {function} fn 事件处理函数
		*/
		delEvent:function(obj, type, fn){
		     if ( obj.detachEvent ) {
			    obj.detachEvent( 'on'+type, obj[type+fn] );
			    obj[type+fn] = null;
			  } else
			    obj.removeEventListener( type, fn, false );
		},
		/**
		* @description 兼容ie的事件移除
		* @param {Object} obj 绑定事件的对象
		* @param {String} handler 被注销的函数名
		* @param {String} type 移除的操作
		*/
		removeEvent:function(obj, handler, type){
	        if(window.removeEventListener) {
	            obj.removeEventListener(type, handler, false);
	        }else if(window.detachEvent) {
	            obj.detachEvent("on" + type, handler);
	        }
		},
		/**
		* @description 去除字符串首尾空格
		* @param {String} str 需要去空格的字符串
		* @return {String} 去掉空格后的字符串
		*/
		trim:function(str){
			return str.replace(/(^\s*)|(\s*$)/g,'');
		},
		/**
		* @description 判断ie浏览器
		* @return {Bool} 是ie为1
		*/
		isIE:function(){
			return !-[1,];
		},
		/**
		* @description 兼容ie移除基础事件
		* @param {Object} e event对象
		*/
		preventDefault:function(e) {
	     	if(e && e.preventDefault){
	        	e.preventDefault();
	    	}else{ 
	        	window.event.returnValue = false;
	    	}
	    	return false;
		},
		/**
		* @description js手动触发事件
		* @param {Object} obj 需要绑定的对象
		*/
		dispatchEvent:function(obj){
			var e=this.change;
			if(document.createEvent){
		        var evObj = document.createEvent('MouseEvents');
		        evObj.initEvent(e, true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null);
			    obj.dispatchEvent(evObj);
			}else if(document.createEventObject){
			    obj.fireEvent('on'+e);
			}
		},
		/**
		* @description 检查mouseover，mouseout的冒泡
		* @param {this} target 需要绑定的对象
		*/
		checkHover:function (e,target){
			function getEvent(e){
    			return e||window.event;
			}
		    if (getEvent(e).type=="mouseover")  {
		        return !contains(target,getEvent(e).relatedTarget||getEvent(e).fromElement) && 
		        !((getEvent(e).relatedTarget||getEvent(e).fromElement)===target);
		    } else {
		        return !contains(target,getEvent(e).relatedTarget||getEvent(e).toElement) && 
		        !((getEvent(e).relatedTarget||getEvent(e).toElement)===target);
		    }
		},
		/**
		* @description js动态加载
		* @param {String} url 需要加载的script路径
		* @param {Function} callback callback函数
		*/
		loadScript:function(url, callback){
		    var script = document.createElement ("script");
		    script.type = "text/javascript";
		    callback=callback||function(){};
		    if(script.readyState){
		        script.onreadystatechange = function(){
		            if (script.readyState == "loaded" || script.readyState == "complete"){
		                script.onreadystatechange = null;
		                callback();
		            }
		        };
		    }else{
		        script.onload = function(){
		            callback();
		        };
		    }
		    script.src = url;
		    document.getElementsByTagName("head")[0].appendChild(script);
		},
		/**
		* @description 简易div拖动
		* @param {object} obj 需要拖动的div对象
		* @TODO 边界判断，完善程序
		*/
		dragDiv:function(obj){
			this.bindEvent(obj,'mousedown',function(event){
				var e=event||window.event,
					t=e.target||e.srcElement,
					//鼠标按下时的坐标x1,y1
					x1=e.clientX,
					y1=e.clientY,
					//鼠标按下时的左右偏移量
					dragLeft=this.offsetLeft,
					dragTop=this.offsetTop;
				document.onmousemove=function(event){
					var e=event||window.event,
						t=e.target||e.srcElement,
						//鼠标移动时的动态坐标
						x2=e.clientX,
						y2=e.clientY,
						//鼠标移动时的坐标的变化量
						x=x2-x1,
						y=y2-y1;
					dragDiv.style.left=(dragLeft+x)+'px';
					dragDiv.style.top=(dragTop+y)+'px';
				}
				document.onmouseup=function(){
					this.onmousemove=null;	
					this.onmouseup=null;
				}
			});
		},
		carousel:function(options){
			function Carousel(o){
				Carousel.prototype.init.call(this,arguments);
			}
			Carousel.prototype={
				init:function(opt){
					opt = opt[0];
					this.car = xtx.getElementsByClassName(document,opt.car)||'car';
					this.change = xtx.getElementsByClassName(document,opt.change)||'change';
					this.next = opt.next||'';
					this.prev = opt.prev||'';
					this.stop = opt.stop||'';
					this.doMain();
				},
				doMain:function(){
					var that=this,
						scroll=that.car,
						control=that.change;
					window.onload=function(){
				 	    setTimeout(function(){
				 	    	that.silde(scroll[0],'left',440);
				 	    	that.doNext(scroll[0]);
				 		},1000);
					}
				},
				doBegin:function(){
				    		
				},
				doStop:function(){

				},
				doNext:function(o){
					xtx.addClass(xtx.nextSibling(o)?xtx.nextSibling(o):that.car[0],'next');
					var ne=xtx.getElementsByClassName(document,'next')[0],
						that=this;
					ne.style.display='block';
					console.log(that)
					that.silde(ne,'left',440,function(){
						xtx.delClass(ne,'next');
						that.doNext(ne)});
				},
				doPrev:function(o){
					xtx.addClass(xtx.prevSibling(o)?xtx.prevSibling(o):that.car[that.car.length-1],'prev');
					var ne=xtx.getElementsByClassName(document,'prev')[0],
						that=this;
					ne.style.display='block';
					that.silde(ne,'left',440);
					xtx.delClass(ne,'prev');
				},
				/**
				*@description 左右滑动
				*@param obj {object} 滑动对象
				*@param direct {string} 方向
				*@param distence {number} 距离
				*/
				silde:function(obj,direct,distence,func){
					var that=obj,
						sty=xtx.getStyle(that,'left'),
						dis=parseInt(sty)||0;
					func=func||function(){};
					function _a(){
						dis-=10;
						that.style.left=dis+'px';
						if(!arguments[0]&&Math.abs(dis)==distence){
							clearInterval(s);
							func();	
						}else if(arguments[0]&&Math.abs(dis)==0){
							clearInterval(s);
							func();
						}
					}
					function _b(){
						dis+=10;
						that.style.left=dis+'px';
						if(!arguments[0]&&Math.abs(dis)==distence){
							clearInterval(s);
							func();
						}else if(arguments[0]&&Math.abs(dis)==0){
							clearInterval(s);
							func();
						}
					}
					if(direct=='left'){//from right to left
						if(dis==0){
					   		var s=setInterval(function(){_a(0);},20);
						}else if(dis>0){
							var s=setInterval(function(){_a(1);},20);
						}
					}else if(direct=='right'){//from left to right
						if(dis==0){
					   		var s=setInterval(function(){_b(0);},20);
						}else if(!dis){
							var s=setInterval(function(){_b(1);},20);
						}
					}else{
						return false;
					}
				}
			}
			return new Carousel(options);
		}
    });
    window.xtx=_.xtx=xtx;
}(window);
!function(){
	//hook测试用例
	var that=xtx.hooks('load');
	that.addAction(function(){for(var i=0;i<11;i++){console.log(i)}},function(){console.log(2)});
	that.addAction('asdas');
	that.doAction();
	var dragDiv=document.getElementById('dragDiv');
	xtx.dragDiv(dragDiv);
	xtx.carousel({car:'car',change:'tab'});
	//xtx.bindEvent(document.getElementById('sd'),'click',function(){alert(this)})
}()
