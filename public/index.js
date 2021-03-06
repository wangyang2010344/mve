({
	data:{
		conf:function(suc){
			mb.task.all({
				data:{
					jsdom:function(notice){
						require("/lib/front-lib/jsdom.js",notice);
					},
					mve:function(notice){
						require("/lib/mve-DOM/index.js",notice);
					},
					JSON:function(notice){
						if(window.JSON){
							notice(window.JSON);
						}else{
							mb.ajax.require.getTxt(cp.baseUrl()+"/lib/front-lib/json2.js",function(txt){
								eval(txt);
								notice(JSON);
							});
						}
					}
				},
				success:suc
			});
		}
	},
	/**
	 * init:最终执行的方法
	 */
	success:function(p){
		window.JSON=lib.conf.JSON;
		window.jsdom=lib.conf.jsdom;
		window.mve=lib.conf.mve();
		p.init(function(success){
			var obj=success();
			var root=document.getElementById("root");
			var body=root.parentElement;
			
			var rpd;
			if(mb.DOM.isMobile() || mb.ext){
				rpd=0;
			}else{
				rpd=10;
			}
			root.style.padding=rpd+"px";
			if(typeof(obj)=="function"){
				obj=obj({
					pel:root,
					replaceChild:function(e,old_el,new_el){
						mb.log("尚未实现");
					}
				});
			}

			if(obj.element){
				//传统的jsdom
				var el=obj.element;
				window.onresize=function(){
					var _w=body.clientWidth-(rpd*2);
					var _h=body.clientHeight-(rpd*2);
					el.style.width=_w+'px';
					el.style.height=_h+'px';
					
					var out=obj;
					//兼容mve的情况
					if(obj.out){
						out=obj.out;
					}
					if(out.height){
						out.height(_h);
					}
					if(out.width){
						out.width(_w);
					}
				};
				root.appendChild(el);
				if(obj.init){
					obj.init();
				}
				window.onresize();
				if(obj.destroy){
					mb.DOM.addEvent(window,"unload",function(){
						obj.destroy();
					});
				}
			}else{
				root.appendChild(obj);
			}
			mb.log("加载完成");
		});
	}
});