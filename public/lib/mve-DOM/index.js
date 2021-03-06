({
	data:{
		util:"../mve/util.js",
		exp:"../mve/exp.js",
		parse:"../mve/parse.js",
		buildChildren:"../mve/buildChildren.js",
		jsdom:"../front-lib/jsdom.js",
		DOM:"./DOM.js"
	},
	success:function(p){
		p=p||{};
		var cache=p.cache||function(){
			if(arguments.length==0){
				return window.top._Dep_;
			}else{
				window._Dep_=arguments[0];
			}
		};
		var util=lib.util(cache);
		/**
		 * repeat生成json结果是被观察的，受哪些影响，重新生成，替换原来的节点。
		 * 生成过程，而json叶子结点里的函数引用，如style,attr，则受具体的影响
		 */
		var buildChildren=lib.buildChildren({
			Value:util.Value,
			Watcher:util.Watcher,
			key:"children",
			appendChild:lib.DOM.appendChild,
			removeChild:lib.DOM.removeChild,
			insertChildBefore:lib.DOM.insertChildBefore
		});
		var bindEvent=function(map,f){
			if(map){
				mb.Object.forEach(map,function(v,k){
					f(k,v);
				});
			}
		};
		var bindKV=function(bind,key,value,f){
			bind(value,function(v){
				f(key,v);
			});
		};
		var bindMap=function(bind,map,f){
			if(map){
				mb.Object.forEach(map,function(v,k){
					bindKV(bind,k,v,f);
				});
			}
		};
		var replaceChild=function(e,old_el,new_el){
			lib.DOM.replaceWith(old_el,new_el);
		};

		var makeUp=function(e,x,json){   
			bindMap(x.bind,json.attr,function(key,value){
				lib.DOM.attr(e,key,value);
			});
			
			x.if_bind(json.cls,function(cls){
				lib.DOM.attr(e,"class",cls);
			});
			
			bindMap(x.bind,json.prop,function(key,value){
				lib.DOM.prop(e,key,value);
			});
			
			bindMap(x.bind,json.style,function(key,value){
				lib.DOM.style(e,key,value);
			});
			
			bindEvent(json.action,function(key,value){
				lib.DOM.action(e,key,value);
			});
			
			x.if_bind(json.text,function(value){
				lib.DOM.text(e,value);
			});
			
			x.if_bind(json.value,function(value){
				lib.DOM.value(e,value);
			});

			x.if_bind(json.html,function(html){
				lib.DOM.html(e,html);
			});
			
			x.if_bind(json.fragment,function(cs){
				lib.DOM.empty(e);
				var me={};
				mb.Array.forEach(cs,function(c){
					lib.DOM.appendChild(e,lib.jsdom.parseElement(c,me));
				});
			});

			x.if_bind(json.element,function(element){
				lib.DOM.empty(e);
				lib.DOM.appendChild(e,lib.jsdom.parseElement(element));
			});
		};

		var create=function(v){
			return lib.exp(
				util,
				function(user_func,user_result){
					if(p.debug){
						alert("不友好的元素节点"+user_func);
					}
					mb.log("顶层user_result目前是:",user_func,user_result);
					if(user_result && typeof(user_result)=="object"){
						//如果是生成元素结点
						var user_result_element={type:"div",element:user_func};
					}else{
						//如果是生成普通节点
						var user_result_element={type:"span",text:user_func};
					}
					return user_result_element;
				},
				lib.parse(
					{
						createTextNode:function(x,o){
							return {
								element:lib.DOM.createTextNode(o.json||""),
								k:o.k,
								inits:o.inits,
								destroys:o.destroys
							};
						},
						buildElement:function(x,o){
							var e=v.createElement(o);
							var obj=buildChildren({
								pel:e,
								replaceChild:replaceChild
							},x,o);
							/*像select，依赖子元素先赋值再触发*/
							makeUp(e,x,o.json);
							return {
								element:e,
								k:obj.k,
								inits:obj.inits,
								destroys:obj.destroys
							};
						}
					}
				)
			);
		};
		var mve=create({
			createElement:function(o){
				var NS=o.json.NS;
				if(NS){
					return lib.DOM.createElementNS(o.json.type,o.json.NS);
				}else{
					return lib.DOM.createElement(o.json.type);
				}
			}
		});
		mve.svg=create({
			createElement:function(o){
				return lib.DOM.createElementNS(o.json.type,"http://www.w3.org/2000/svg");
			}
		});
		return mve;
	}
});