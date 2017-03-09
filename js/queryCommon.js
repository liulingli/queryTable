 $(function(){
 	//校验表单查询条件的宽度
 	function getFormWidth(){
		//初始化基准宽度
		var referWidth = $(".query-item input[type='text']").eq(0).parent().width();
		var queryArray = $(".query-item");
		queryArray.each(function(){
			var width = $(this).width()-1;
			var remainder = width%referWidth;
			if(remainder<25){
				var Multiple = Math.floor(width/referWidth);
			}else{
				var Multiple = Math.ceil(width/referWidth);	
			}
			$(this).css("width",((referWidth+1)*Multiple)+"px");
		})
	}
	getFormWidth();
	/**
	  *查询数据方法调用
	  * 注意事项*
	  * 1.不要改变页面DOM结构和对应的ID及CLASS*
	  * 2.调用form查询方法需要页面返回 curPage、totalPage、totalRecord 三个值" *
	*/
	$("#queryContent").queryMethod({
		suffix:'', //当页面有多个table表格，需要传一个stuff
		getMethod: 'form',//获取查询数据的方法有1.form表单,2.ajax,默认ajax
		url:"ajaxTable.html", //后台处理查询数据地址
		dataClass:"queryform",
		//isCovered:false,
		isDragChoosed:true,//是否拖动选中
		isShowPage:false, //是否显示分页器
		isGroupHigh:false,//左右键单击时是否显示分组高亮
		isRClickHign:true,//右键单击时是否显示高亮
		isLClickHign:true,//左键单击时是否显示高亮
		scrollAjaxUrl:'ajaxTable.html',//滚动加载数据时的请求地址
		initQueryTable:function(data){}, //自定义渲染table数据
		rightClickTable:function(tr){ //自定义tr右键单击事件，参数tr是jquery对象
		},
		leftClickTable:function(tr){ // 自定义tr左键单击事件，参数tr是jquery对象			
		}
	});
	
	//checkbox全选
    $("#doneDiv").on("click","input[name='checkAll']",function(){
		$(this).parents("#doneDiv").find("input[type='checkbox']").prop("checked",$(this).prop("checked"));
    });
});