({
	success:function(util,compatible,Parse){
		var forEach_run=function(array){
			mb.Array.forEach(array,function(r){r();});
		};
		var mvvm=function(user_func){
			/**
			pel
			replaceChild(pel,old,new){
				old是第一次
			}
			*/
			return function(e){
				var watchPool=[];
				var Watch=function(p){
					var w=util.Watcher(p);
					watchPool.push(w);
					return w;
				};
				var Cache=function(exp){
					return util.Cache(Watch,exp);
				};
				/**
				element
				init
				destroy

				out:附加到生成的实体上
				*/
				var user_params={
					Value:util.Value,
					ReadValue:util.ReadValue,
					ArrayModel:util.ArrayModel,
					Watch:Watch,
					Cache:Cache,
					children:mb.Function.quote.one
				};
				var user_result=user_func(user_params);
				//这个函数应该返回布局，而不再显式提供Parse

				var me={};

				if(user_result.element && typeof(user_result.element)=="object"){
					var user_result_element=user_result.element;
				}else{
					var user_result_element=compatible(user_func,user_result);
				}
				var element_result=Parse(
					e,
					user_result_element,
					Watch,
					mvvm,
					{}
				);
				me.element=element_result.element;
				user_params.k=element_result.k;
				var user_init=user_result.init||mb.Function.quote.one;
				var user_destroy=user_result.destroy||mb.Function.quote.one;

				me.out=user_result.out;//一些一次性指令，但是组件应该维护自身的状态如关闭之类
				me.init=function() {
					forEach_run(element_result.inits);
					user_init();
				};
				me.destroy=function() {
					user_destroy();
					forEach_run(element_result.destroys);
					var w;
					while((w=watchPool.shift())!=null){
						w.disable();
					}
				};
				return me;
			 };
		 };
		 mvvm.NS={
			svg:"http://www.w3.org/2000/svg"
		 };
		 mvvm.Value=util.Value;
		 return mvvm;
	}
})