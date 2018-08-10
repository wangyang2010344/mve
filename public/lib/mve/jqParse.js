({
    baseUrl:cp.libUrl(),
    data:{
        parse_base:"mve/parse/index.js",
        $:function(notice){
            mb.ajax.require.getTxt(
                    cp.libUrl()+"jquery/jquery-1.3.2.min.js",
                    notice
            );
        }
    },
    delay:true,
    success:function(){
        eval(lib.$);
        return lib.parse_base({
            createElement:function(type){
                return $(document.createElement(type));
            },
            createTextNode:function(json){
                return json;
            },
            appendChild:function(el,child){
                el.append(child);
            },
            replaceWith:function(el,newEL){
                el.replaceWith(newEL);
            },
            removeChild:function(el,child){
                child.remove();
            },
            attr:function(el,key,value){
                if(value==undefined){
                    el.removeAttr(key);
                }else{
                    el.attr(key,value);
                }
            },
            style:function(el,key,value){
                //IE下如果设置负值，会导致错误
                el.css(key,value);
            },
            prop:function(el,key,value){
                if(key=='scrollTop'){
                    //并不能解决mve_grid在IE8下隐藏滚动条后滚动的问题，得用别的方法保留滚动效果
                    el.scrollTop(value);
                }else
                if(key=='scrollLeft'){
                    el.scrollLeft(value);
                }
            },
            action:function(el,key,value){
                el.bind(key,value);
            },
            text:function(el,value){
                el.text(value);
            },
            value:function(el,value){
                el.val(value);
            },
            html:function(el,value) {
                el.html(value);
            }
        });
    }
});