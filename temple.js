				/*function seStr(st) {
					if (fs != '<') {
						var arr = st.split(' '),
							arrfs = [],
							arrmain = [],
							i,j;
						for (var i = 0, j = 0; i < arr.length; i++) {
							arrfs[j] = arr[i].match(/\#|\./);
							arrmain[j] = arr[i].match(/[^(\#|\.)]+/ig);
							j++;
						}
						return {
							fs: arrfs,
							node: arrmain
						}
					}else{
						return {
							fs: '<',
							node: st
						}
					}
				}
				for(var i = 0;i<length;i++){
					if(opt[i] instanceof Array){
						tempopt = opt[i][0];
					}else
						tempopt = opt[i];
					tempo = swIC(tempopt,name[i],tempo);
				}
				return tempo;
				function swIC(opt, name, obj) {
					var o = {};
					switch (opt) {
						case '#':
							if (obj) {
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
							} else {
								return document.getElementById(name);
							}
							break;
						case '.':
							if (obj) {
								return xtx.getElementsByClassName(obj, name);
							} else {
								return xtx.getElementsByClassName(document, name);
							}
							break;
						case '<':
							var s = opt.split(/ |\>/),
								i = 0,
								htm = document.createElement(s[0]);
							return htm;
							break;
						default:
							if(obj){
								return obj.getElementsByTagName(name);		
							}else
								return document.getElementsByTagName(name);
							break;
					}
				}*/