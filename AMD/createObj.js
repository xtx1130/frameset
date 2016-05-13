//创建基类
define('createObj',function(klass,obj){
	function class(){
		this.init.call(this,arguments)
	}
	class.prototype.init=function(){}
	klass = new class()
	return klass;
});