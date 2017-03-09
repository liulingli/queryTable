/**
 * jQuery.inputQuery 下拉选框模糊查询
 * author:liulingli
 * date : 2017-03-07
 * Instructions:
 * 用法：多个input共用，必须添加ID名,前缀必须相同，id格式为string_num
 * <input type="text" id="diagnosisName_1" class="diagnosisName">
 * <input type="text" id="diagnosisName_2" class="diagnosisName">
 * <input type="text" id="diagnosisName_3" class="diagnosisName">
 * var json =[{"administrationCode":"10","administrationName":"吸入","inpOutpFlag":"","inputCode":"XR","serialNo":10}]
 * $(".diagnosisName").inputQuery({
		divId :"diagnosisName",
		isOne:true,
		postParam:{"arg1":"diagnosisName"},//参数，获取模糊查询的关键字
		postUrl:'ajaxTable.json',
		JSON : json,  //json格式字符串
		setConfig:'[{text:"床号"},{hide:true,returnId:"diagnosisCode"},{text:"名称", returnId:"diagnosisName",query:true},{text:"输入码",query:true},{hide:true}]',
	    callback:'callback2' //选择成功后的回调函数 ，支持字符串
   	});
   	注：postUrl,JSON 二选一
 * */
;(function(){
    var methods={
        init:function(options){
	        return this.each(function(){
	            var $this = $(this);
	            var defaluts = {
	            	divId:"", //容器id
				    postUrl: "",//获取选项的地址，如果传了该值则不需要传JSON
				    JSON: "",//前方传json格式数据，如果传了该值则不需要传postUrl
				    postParam : '', //参数
				    setConfig:'',
 				    minHeight:200, //最小高度
				  //设置显示配置，以表头为基础，在每一个表头上附加参数，指明是否隐藏hide、表头文字text、表头宽度width、填充控件IDreturnId
		            isFocus: true,//默认由onfocus触发
		            isClick : false,//是否由onclick触发
		            isOne :false,//当数据只有一条的时候是否自动将数据填充到对应字段中去
		            evenColor : "#EFEFEF",//偶数行背景颜色
		            oddColor : "#EFEFEF",//奇数行背景颜色
		            headColor : "#CCCCCC",//表头背景颜色
		            highlightColor : "#04BFEA",//高亮行背景颜色
		            isEnter : true,//点击enter键时,没有选中的情况下,是否默认选中第一行      
		            isDbclick : true,//默认双击的时候,清空数据
		            parent : null,
		            callback :''//选中之后的回调函数
	            };
	      		//合并默认参数opt和defaluts
	            settings = $.extend({},defaluts,options);
				methods.inputselectMain.call($this, settings);  
	      	});
      	},
	  	inputselectMain:function(){
		  	return this.each(function(){
		  	   	var $this = $(this);
		  	   	var setting = settings; //缓存settings	
		  	   	var bindId = setting.divId;
		  	   	var bindDivId = bindId+"_div";
		  	   	var $bindDiv= $("#"+bindId+"_div");
		  	   	var totalPage = 1; //默认总共有1页
		  	   	//给inputSelect添加class属性"inputslect",用于enter转tab键区分
		  	   	$this.addClass("inputselect");
		  	   	//不记住输入记录
		  	   	$this.attr("autocomplete","off");
		  	   	//生成样式style
		  	   	var cssStyle = "<style>#"+bindDivId+" tbody tr:nth-of-type(even){background-color:"+setting.evenColor+"}"
		  	   	             + "#"+bindDivId+" tbody tr{cursor:pointer;}"
		  	   	             + "#"+bindDivId+" tbody tr:nth-of-type(odd){background-color:"+setting.oddColor+"}"
		  	   	             + "#"+bindDivId+" thead tr{background-color:"+setting.headColor+"}"
		  	   	             + "#"+bindDivId+" tbody tr:nth-of-type(even).selected,#"+bindDivId+" tbody tr:nth-of-type(odd).selected{background-color:"+setting.highlightColor+"}"
		  	   	             + "#"+bindDivId+" table.si_table_fixed{position:absolute;top:0;left:0;}</style>";
		  	   	$("head").append(cssStyle);
		  	   	function getUUID(len,radix){ //随机生成全局唯一标识符,len为长度，radix为基数
		  	   	   	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
					var uuid = [], i;
					radix = radix || chars.length;
					if (len) {
					   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
					} else {
					    var r;
					    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
					    uuid[14] = '4';
					    for (i = 0; i < 36; i++) {
						    if (!uuid[i]) {
						    	 r = 0 | Math.random()*16;
						     	uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
						    }
					  	 }	
					}				 
				  	return uuid.join('');
	  	   	    };
		  	   	/*** 公共方法 ***/
		  	   	var pubMethod = {
		  	   		getOffset:function (e,parent){ //e为htmlElement对象 ，parent为父元素(可选)如果未传值，则默认为顶层window，获取元素距离父元素边缘的top值与left值，解决jquery offset()获取的值不兼容
						var x = e.offsetLeft;  
						var y = e.offsetTop; 
						if(parent){
							while(e = e.offsetParent){
								if(e != parent){
									x += e.offsetLeft;  
									y += e.offsetTop;
								}							  
						    }  
						}else{
							x = $(e).offset().left;
							y = $(e).offset().top;
						}
						return {"left": x, "top": y};  
					},
		  	   		checkTrue:function(array){ //判断数组内元素是否都为true,是返回true，不是返回false
			  	    	if(array.length==0){
			  	    		return true;	  	    		
			  	    	}else{
			  	    	    var bool =true;
		                    for(var i=0;i<array.length;i++){
			                    if(array[i]==false||array[i]=='false') {
			                    	bool = false;
			                    	break;
			                    }
		                	}
		                    return bool;
		               }     
		  	    	},
		  	   		getIdNum:function($this){ //获取当前对象id的序号
		  	   			var num = $this.attr("id").split("_")[1];
		  	   			if(num!=undefined&&num!='undefined'){
		  	   				return "_"+num;
		  	   			}
		  	   			return '';
		  	   		},
		  	       	getKeyword:function($input){ //获取即时的模糊查询的关键字       
			  	       	var keyword = "";
				        if(setting.postParam!=null&&setting.postParam!=''){
				        	 var num = pubMethod.getIdNum($input); //下标号   	  
					        for(var key in setting.postParam){
						    	keyword += $("#"+setting.postParam[key]+num).val();
				            }
				        }else{
				          	keyword += $input.val();
				        }
				        return keyword;
		  	       	},
		  	       	keywordQuery:function($input){ //根据关键字显示查询信息
		  	       		//查询条件不区分大小写 ，将查询条件的所有字母转换成大写
		  	       		var keyword = pubMethod.getKeyword($input).toLocaleUpperCase();
		  	       		var $trs = $("#"+bindId+"_div table tbody tr");//获取所有tr
		  	       		var $ths = $("#"+bindId+"_div table thead th"); //获取所有th                   
	                   
	                    if(keyword.length==0){ //查询字符为空时
	                   		$trs.css("display","").attr("show",true);
	                   		return;
	                   	}
	                   	$trs.css("display","none").attr("show",false);
	                    //遍历列表
	                    $trs.each(function(index){
	                    	var $this = $(this),
	                    	    $tds = $this.find("td");
	                    	var tdStr= "";
	                        $tds.each(function(e){ 
	                    		if($ths.eq(e).attr("query")==="undefined"||$ths.eq(e).attr("query")===undefined){//该列是否可模糊查询
	                    		   return ;
	                    		}
	                    		tdStr += $(this).text();
	                        });
	                        //将需要字符串转换成大写
	                        tdStr = tdStr.toLocaleUpperCase();
	            			var returnValue  = tdStr.indexOf(keyword)>-1;
	            			returnValue&&$trs.eq(index).css("display","").attr("show",true);
	                    });
		  	       	},
		  	       	parseSetConfig:function(){
		  	       	  	var setConfig = eval("("+setting.setConfig+")");
		  	       	     	theadHtml="<thead id='"+bindId+"_head' class='si_head'>";    
		  	       	  	for(i=0;i<setConfig.length;i++){
		  	       	  	 	var config = setConfig[i], 
		  	       	  	 	    isFuzzyQuery = config.query?"query='true'":"";
		  	       	  	 	if(config.hide==true){
		  	       	  	 		theadHtml += "<th style='display:none;' "+isFuzzyQuery+">"+config.text+"</th>";
		  	       	  	 	}else if(config.hide==undefined||config.hide=='undefined'){
		  	       	  	  		if(config.width!=undefined){
		  	       	  	 			theadHtml += "<th width='80px' "+isFuzzyQuery+">"+config.text+"</th>";
		  	       	  	 		}else{
		  	       	  	 	 		theadHtml += "<th "+isFuzzyQuery+">"+config.text+"</th>";
		  	       	  	 		}	  	       	  	 	
		  	       	  	 	}		  	       	  	
		  	       	  	} 
		  	       	 	theadHtml +="</thead>";
		  	       	    return theadHtml;
		  	       	},
		  	       	parsePostData:function(){
		  	       		var tobyHtml = "";
		  	       		function parseData(data){
		  	       			var datas = data;
	  	       				var setConfig = eval("("+setting.setConfig+")");
			  	       	   	for(var i=0;i<datas.length;i++){
			  	       	   	 	var htmlTR = "<tr id='"+bindId+"_body_tr_"+i+"' index='"+i+"' cursor:pointer'>";
			  	       	   	    var data = datas[i];
			  	       	   	    var x = 0;//初始化data的数字下标
			  	       	   	    for(j in data){
			  	       	   	    	if(setConfig[x].hide=='undefined'||setConfig[x].hide==undefined||setConfig[x].hide==false||setConfig[x].hide=='false'){
			  	       	   	  	 		if(setConfig[x].width!=undefined){
			  	       	   	  	 			htmlTR+="<td title='"+data[j]+"' width='"+setConfig[x].width+"px'>"+data[j]+"</td>";
			  	       	   	  	 		}else{
			  	       	   	  	 			htmlTR+="<td title='"+data[j]+"'>"+data[j]+"</td>";
			  	       	   	  	 		}	
			  	       	   	  	 	}else{
			  	       	   	  	 		htmlTR+="<td style='display:none'>"+data[j]+"</td>";
			  	       	   	  	 	}
			  	       	   	  	 	x++;
			  	       	   	    }
			  	       	   	    htmlTR+="</tr>";
			  	       	   	  	tobyHtml += htmlTR;	
			  	       	   	}
		  	       		}
		  	       		if(setting.postUrl!=""){
		  	       			$.ajax({
			  	       			type:"GET",
			  	       			async:false, //同步
			  	       			url:setting.postUrl,
			  	       			data:{"time":new Date().getMilliseconds()},
			  	       			success:function(data){
					  	       	  	var datas =data;
					  	       	    parseData(datas);	  	       	   	  	
					  	       	}
		                    });
		  	       		}else if(setting.JSON!=""){
		  	       			parseData(setting.JSON);
		  	       		}
	                    return tobyHtml;
		  	        },
		  	        appendTo:function(obj){//容器对象，未定义时添加至body
		  	       	   //获取left和top值
		  	       	   var top = pubMethod.getOffset($this[0]).top+$this.outerHeight(),
		  	       	       left = pubMethod.getOffset($this[0]).left;
		  	       	   var setConfig = eval("("+setting.setConfig+")");
		  	       	   var bindDiv= "<div id='"+bindId+"_div' style='position:absolute;left:"+left+"px;top:"+top+"px;display:block;' class='si_div'>";
		  	       	       bindDiv+="<table class='si_table_fixed' id='"+bindId+"_table_fixed'>";
		  	       	       bindDiv+= pubMethod.parseSetConfig(); //表头
		  	       	       bindDiv+= "</table>"; //表头
		  	       	       bindDiv+="<div class='si_table_div' id='si_table_div"+bindId+"' style='overflow:auto;max-height:"+setting.minHeight+"px;'><table class='si_table_1' id='"+bindId+"_table'>";
		  	       	       bindDiv+= pubMethod.parseSetConfig(); //表头
		  	       	       bindDiv+="<tbody id='"+bindId+"_body' class='si_body'>";
		  	       	       bindDiv+= pubMethod.parsePostData();
		  	       	       //bindDiv+="<tr><td colspan='"+setConfig.length+"'>加载中...</td></tr></tbody>";
		  	       	       bindDiv+="</tbody></table></div></div>";
		  	       	    if($("#"+bindId+"_div").length<1){ //判断有没有添加
		  	       	    	if(obj!=undefined){
		  	       	    	    $(obj).append(bindDiv);
		  	       	        }else{
		  	       	    	    $("body").append(bindDiv);
		  	       	        }
		  	       	    };	
		  	       	    if(setting.isOne){ //当只有一行的时候是否默认填充
	  	    	    		if($("#"+bindId+"_body tr").length==1){
	  	    	        	    pubMethod.enter($this);
	  	    	        	    $("#"+bindId+"_body tr").addClass("selected");
	  	    	            }
		  	   			}
		  	    	    //计算table每列的宽度
	  	       	    	var $ths = $("#"+bindId+"_div table.si_table_1 thead th"); //获取所有th   
	  	       	    	var $thsFixed = $("#"+bindId+"_div table.si_table_fixed thead th");
		  	    	    var totalWidth = 0;
		  	    	    $ths.each(function(i){
		  	    	    	if(this.width==undefined||this.width==""){
		  	    	    		var width = $(this).width();		  	    	    		
		  	    	    	}else{
		  	    	    		var width = parseInt(this.width);
		  	    	    	}
	  	       	    		$(this).attr("width",width+"px");
	  	       	    		$thsFixed.eq(i).attr("width",width+"px");
	  	       	    		totalWidth += width;
	  	       	        });
	  	       	        $("#"+bindId+"_div table.si_table_1").attr("width",totalWidth+"px")
	  	       	        $("#"+bindId+"_div table.si_table_fixed").attr("width",totalWidth+"px");
	  	       	    	pubMethod.hide();
		  	        },
		  	        hide:function(){ //隐藏容器对象
		  	       	    if($("#"+bindId+"_div").length>0){ //存在时隐藏
		  	       	        $("#"+bindId+"_div").css("display","none");
		  	       	        $("#"+bindId+"_div tbody").find("tr").removeClass("selected");
		  	       	    }
		  	        },
		  	        show:function(){ //显示容器对象
		  	       	    if($("#"+bindId+"_div").length>0){ //存在时显示
		  	       	        $("#"+bindId+"_div").css("display","");
		  	       	    }
		  	        },
		  	        clearSelect:function($input){ //清除选中内容
		  	       	    var setConfig = eval("("+setting.setConfig+")");
		  	       	    if(setting.postParam!=null&&setting.postParam!=''){
		  	       	    	for(i=0;i<setConfig.length;i++){		  	       	    	
			  	       	   	    var num = pubMethod.getIdNum($input);
			  	       	  	    var returnId = num!=''?(setConfig[i].returnId+num):setConfig[i].returnId;   	  	       
			  	       	  	    $("#"+returnId).val(''); 
		  	       	        }
		  	       	    }else{
		  	       	    	$input.val("");
		  	       	    }
		  	       	    pubMethod.keywordQuery($input);
		  	        },
		  	        singgleSelect:function($input,$tr){ //选中
			  	       	$tr.siblings("tr").each(function(){
			  	       	 	$(this).removeClass("selected");
			  	       	});
			  	       	$tr.addClass("selected");
			  	       	pubMethod.enter($input);	  	      
		  	        },
		  	        enter:function($input){
		  	       	    var selectedTR = $("#"+bindId+"_body tr.selected"),
		  	       	        setConfig = eval("("+setting.setConfig+")");
		  	       	    var returnValue;
		  	       	    if(selectedTR.length>0){
		  	       	  	    selectedTR.each(function(){	  
		  	       	  	        var td = $(this).find("td");
		  	       	  	        for(i=0;i<setConfig.length;i++){
		  	       	  	        	var num = pubMethod.getIdNum($input);
		  	       	  	        	if(setConfig[i].returnId!=undefined&&setConfig[i].returnId!="undefined"){
		  	       	  	        		var returnId = num!=''?(setConfig[i].returnId+num):setConfig[i].returnId;
                                        var returnValue = td.eq(i).text();
			  	       	  	            $("#"+returnId).val(returnValue.replace(/^,/,'')); //删除字符前面的“,”
		  	       	  	        	} 	       	  	            
		  	       	            }
		  	       	        });
		  	       	 	}else if($input.val()==''||$input.val()==null){
			  	       	  	if(setting.isEnter){
			  	       	  	    var selectedTR = $("#"+bindId+"_body tr").eq(0),
			  	       	            td = selectedTR.find("td");
			  	       	  	    for(i=0;i<setConfig.length;i++){
			  	       	  	    	var num = pubMethod.getIdNum($input);
			  	       	  	        var returnId = num!=''?(setConfig[i].returnId+num):setConfig[i].returnId; 
			  	       	  	            returnValue = td.eq(i).text();//单选
			  	       	  	        $("#"+returnId).val(returnValue.replace(/^,/,'')); //删除字符前面的“,”
			  	       	        }
			  	       	  	}	  	       	  	 
			  	       	}	  	       	
			  	       	pubMethod.hide(); 
			  	       	if(setting.callback!=''){
			  	       	  	//callback传值
			  	       	  	var callValue = $this.attr("data-string");
			  	       	  	if(typeof setting.callback == 'string'){
			  	       	  		eval("window."+setting.callback+"(callValue)");//this的指向
			  	       	  		return;
			  	       	  	}
			  	       	  	setting.callback(callValue);
			  	       	}
		  	       	},
		  	        getPosition:function($input){
	    	    		var showHeight = $("#"+bindId+"_div").outerHeight(),  //获取table的高度
	  	       	       	 	showWidth = $("#"+bindId+"_div").outerWidth(), //获取table的宽度
	  	       	        	disTop = $(window.top).height() - pubMethod.getOffset($input[0]).top - $input.outerHeight(),
	  	       	        	disLeft = $(window.top).width() - pubMethod.getOffset($input[0]).left;
	  	       	    	$("#"+bindId+"_div").css("width",showWidth+"px");
	  	       	    	if(showHeight>disTop){ //如果下方区域不足以放下则置于上方
	  	       	    		if(($(window.top).height() - pubMethod.getOffset($input[0]).top)>showHeight){ //上方区域
								var top = $input[0].offsetTop - showHeight;
	  	       	    			$("#"+bindId+"_div").css("top",top+"px");
	  	       	    		}else{
	  	       	    			var top = pubMethod.getOffset($input[0]).top + $input.outerHeight();
	  	       	    			$("#"+bindId+"_div").css("top",top+"px");
	  	       	    		}  	       	    		
	  	       	    	}else{
	  	       	    		var top = pubMethod.getOffset($input[0]).top + $input.outerHeight();
	  	       	    		$("#"+bindId+"_div").css("top",top+"px");
	  	       	    	}
	  	       	   		if(showWidth>disLeft){ //如果左方区域放不下
	  	       	    		$("#"+bindId+"_div").css("left","");
	  	       	    		$("#"+bindId+"_div").css("right",0);
	  	       	   		}else{
	  	       	   			$("#"+bindId+"_div").css("left",pubMethod.getOffset($input[0]).left+"px");
	  	       	   		}
	  	       	   		$("#"+bindId+"_div").find("tr").removeClass("selected");
	  	       	   		$("#si_table_div"+bindId).scrollTop(0);
	    	    	}
		  	    };	
		  	    		  	    
		  	    //添加事件方法
		  	    $("body").on("inputQuery","."+bindId,function(){ //点击事件显示
		  	    	var $this = $(this);
		  	    	if($("#"+bindId+"_div").length==0){  	
		  	    		pubMethod.appendTo();
		  	    	}
		  	    	if($this.attr("data-id")==undefined||$this.attr("data-id")=="undefined"){
		  	    		var uuid = getUUID(4,10);
		  	    		$this.attr("data-id",uuid+"_inputQuery");	
		  	    	}		  	    		
		  	    });
		  	    $this.trigger("inputQuery");
		  	    		  	  
		  	    //焦点事件解绑
		  	    $("body").off("focus.inputQuery","."+bindId);
		  	    $("body").on("focus.inputQuery","."+bindId,function(){		  	    	
		  	    	var $input = $(this);
		  	    	$input.trigger("click.inputQuery");		  	    	
		  	    });
		  	    
		  	    //click解绑
		  	    $this.off("click.inputQuery");
		  	    $("body").on("click.inputQuery","."+bindId,function(){
		  	    	var $input = $(this);
		  	    	$input.trigger("inputQuery");
		  	    	var dataId = $input.attr("data-id");
		  	    	$("#"+bindId+"_div").attr("input",dataId);
		  	    	pubMethod.getPosition($input); //定位位置	
		  	    	pubMethod.keywordQuery($input);
		  	    	pubMethod.show();
		  	    });
		  	  
		  	    $(window).resize(function(){ //resize事件重新计算位置
		  	    	var dataID = $("#"+bindId+"_div").attr("input");
		  	    	var $input = $("input[data-id='"+dataID+"']");
		  	    	if($input.length>0){
		  	    	    pubMethod.getPosition($input); //定位位置		
		  	    	}		  	       
		  	    });
		  	    
		  	    $("body").on("dblclick.inputQuery","."+bindId,function(){ //双击清楚选框内的内容
		  	    	var $input = $(this);
		  	    	setting.isDbclick&&pubMethod.clearSelect($input);
		  	    });
		  	    $(document).on("click.inputQuery",function(e){ //点击select选框外的元素，则隐藏容器
		  	        var $thisOwn = $this;
		  	    	var $target= $(e.target);
		  	    	var dataID = $target.attr("data-id");
		  	    	var isInput = (dataID||"").indexOf("_inputQuery")>-1; //点击的是否是当前inputselect下拉框
		  	    	var isThis = $target.parents("#"+bindId+"_div").length;
		  	    	if(isThis==0&&!isInput){
		  	    		pubMethod.hide(); //隐藏容器
		  	    	}
		  	    	if(isInput){
		  	    		$("[input*='_inputQuery']").css("display","none");
		  	    		$("[input='"+dataID+"']").css("display","block");
		  	    	}
		  	    });

		        $(document).off("click.inputQuery","#"+bindId+"_body tr");
		  	    $(document).on("click.inputQuery","#"+bindId+"_body tr",function(){
		  	    	var $this = $(this),
		  	    	    _index = $(this).attr("index");
		  	    	var inputID = $(this).parents(".si_div").attr("input");
		  	    	var $input = $("[data-id='"+inputID+"']");
	  	    		pubMethod.singgleSelect($input,$this);	
	  	    		//$("[data-id='"+inputID+"']").trigger("blur");
	  	    		//$("[data-id='"+inputID+"']").trigger("focus");
		  	    });
		  	    var timer = ""; //缓存定时器
		  	    $("body").off("keydown.inputQuery","."+bindId);
		  	    $("body").off("keyup.inputQuery","."+bindId);
		  	   	$("body").on("keydown.inputQuery","."+bindId,function(){
		  	   	 	var e = event||window.event;
		  	   	 	var $input = $(this);
			        var keyCode = e.keyCode||e.which;
		  	   	 	var index = -1;
		  	   	    var $trs = $("#"+bindId+"_body").find("tr");
		  	   	    var trH = $trs.eq(0).outerHeight();
		  	   	    var length = $trs.length;
		  	   	    var PARENT = $("#"+bindId+"_div")[0];
	  	   	     	for(var i=0; i<$trs.length; i++){
			            var $tr = $trs.eq(i);
			            if($tr.hasClass("selected")){
				            index = parseInt($tr.attr("index"));
				            $next = $tr.nextAll("[show='true']").eq(0);
				            $prev = $tr.prevAll("[show='true']").eq(0);
				            if(!setting.isMultChoose){ break;}//单选
				            //break;
			            }
		            }
			        if(keyCode==40){ //键盘向下
	                    $trs.each(function(){$(this).removeClass("selected");});
	                    if(index==-1||index==(length-1)){
	                    	$trs.eq(0).addClass("selected");
			            	$("#si_table_div"+bindId).scrollTop(0);
			        	}else{
			        		var $true = $("#"+bindId+"_body tr[show='true']");
			        		if($next.length==0){
				        	  	$next = $true.eq(0);
			        	    }
			        	    $next.addClass("selected");
			        	    if($next.length==1){
				        	    var offsetTop = pubMethod.getOffset($next[0],PARENT).top+trH;
				        	    if(offsetTop>setting.minHeight){ //内容超出不在可视区域，则滚动滚动条
				        	    	var disxTop = offsetTop-setting.minHeight;  	
				        	    	var scrollTop = $("#si_table_div"+bindId).scrollTop();
				        	        $("#si_table_div"+bindId).scrollTop(disxTop);
				        	    }  	
			        	    }
			        	}
			        }else if(keyCode==38){ //键盘向上
			        	$trs.each(function(){$(this).removeClass("selected");});
			        	if(index==-1||$prev.length==0){			        		
			        		$last =  $trs.eq(length-1);
			        	    $last.addClass("selected");	
			        	    var offsetTop = pubMethod.getOffset($last[0],PARENT).top;
			        	    $("#si_table_div"+bindId).scrollTop(offsetTop-setting.minHeight+trH);
			        	}else{
			        	    $prev.addClass("selected");
			        	    var offsetTop = pubMethod.getOffset($prev[0],PARENT).top;
			        	    var disxTop = offsetTop-setting.minHeight; 
			        	    $("#si_table_div"+bindId).scrollTop(disxTop+trH);
			        	} 
			       }else if(keyCode==13){ //enter键	
			       	   if($("#"+bindId+"_div").length>0){
			       	   	 pubMethod.enter($input);
			       	   	 $("[data-id='"+bindId+"_input']").trigger("blur");
		  	    		 $("[data-id='"+bindId+"_input']").trigger("focus");
		  	    		 return false;
			       	   }		       	  
			       }else if(keyCode==17){ //ctrl键
			           //isCtrl = false; 
			       }else if(keyCode==27){ //esc键
			       	   pubMethod.hide();
			       }else if(keyCode==8||keyCode==46){		       	  
			       }else{  //其他键 输入内容
			       }
		  	   }).on("keyup.inputQuery","."+bindId,function(){
		  	   	    clearTimeout(timer);//节流，减少计算频度    	
		  	   	    var e = event||window.event;
			        var keyCode = e.keyCode||e.which;
			        var $input = $(this);
			        if(keyCode==8||keyCode==46){ //backspace||delete
			       	    $("#"+bindId+"_div tbody").find("tr").removeClass("selected");
			       	    keyCode==8&&pubMethod.show(); //显示容器
	    				timer = setTimeout(pubMethod.keywordQuery($input),100);//延迟500毫秒执行
			        }else if(!(keyCode==38||keyCode==40||keyCode==27||keyCode==17||keyCode==13)){
			        	timer = setTimeout(pubMethod.keywordQuery($input),500);//延迟500毫秒执行
			        }else{
			        	return false;
			        }
		  	   });
		  	});
		}
    };
	$.fn.inputQuery= function(){
		var method = arguments[0];
		if(methods[method]){
			method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
		}
		else if(typeof(method)=='object'||!method){
            method = methods.init;
		}else{
            $.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
            return this;
		}
        return method.apply(this, arguments);
	};
})(jQuery);
