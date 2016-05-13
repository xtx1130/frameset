define('LETui',function(){
	LET.initClass=function(){
		var f = function(){
			return f.prototype.init.apply(this,arguments)
		}
		f.prototype.init = function(){
			//return function(){
				console.log(arguments[0])
				for(var i=0;i<arguments[0].length;i++){
					this[arguments[0][i]]='';
				}
			//}
		}
		f.prototype.valueOf=function(){
			return this.memory
		}
		f.prototype.memory=function(fn){
			if(arguments.length)
				this.memory.valueOf=function(){return fn.call();}
			else return this.memory
		}
		return new f(arguments);
	}
});