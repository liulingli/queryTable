/* *
 *jquery.queryTable 封装查询页面方法
 *date 2017-01-04*
 *author liuingli*
 * */
;
(function() {
	  var methods = {
		init: function(options) {
			return this.each(function() {
				$this = $(this);
				var defaluts = {
						suffix: '', //当页面有多个table时，传入一个stuff便于区分
						async: true, //是否异步，默认为true
						type: 'GET', //请求方式，默认GET
						getMethod: 'ajax', //获取查询数据的方法有1.form表单,2.ajax,默认ajax
						isReCount: false, //是否重新获取分页数据
						srcPath: '', //配置地址
						contextPath:'',//图片存放地址
						url: '', //后台处理查询数据地址
						data: '', //发送到后台的数据，即查询条件						
						headColor:'#ECECFF',//表头背景色
						oddColor:'#f7f7f7',//表体奇数行背景色
						evenColor:'#f1f1f1',//表体偶数行背景色
						highColor:'#04bfea',//高亮背景色
						hoverColor:'#00cda2',//鼠标放上去时的背景色
						borderColor:'#bebebe',//边框线颜色
						isShowPage:true,//是否显示分页器，默认true
						isGroupHigh:false,//左右键单击时是否显示分组高亮,默认false
						isRClickHign:true,//右键单击时是否显示高亮,默认true
						isLClickHign:true,//左键单击时是否显示高亮，默认true
						isScroll:true,// 是否显示滚动条，默认true
						isEditX:true,// 是否可以拖动改变列宽，默认true
						isDragChoosed:false, //是否可以拖动选中多行
						isHasCheckbox:false,//是否tr中含有checkbox
						isTrClickCheckbox:false,//点击时是否默认选中checkbox
						isCovered:true,//当表格宽度小于屏幕时是否铺满，默认true
						topBorder :true, //是否显示上边框线，默认true
	                    bottomBorder :true, //是否显示下边框线，默认true
	                    leftBorder :true, // 是否显示左边框线，默认true
	                    rightBorder:true, //是否显示右边框线，默认true
	                    tdMinWidth:50, //拖动的时候最小宽度，默认50px
	                    isScrollAjax:true, //表格容器滚动是是否加载数据，默认true
	                    scrollAjaxUrl:'', //滚动加载数据时的请求地址
	                    isSort:false, //是否显示排序，默认false
	                    dataClass:null, //查询条件class
	                    initQueryTable: function(data) {}, //自定义ajax请求下数据渲染方法
	                    scrollTop:function(){},//滚动至顶部事件
	                    leftClickTable:null, //左键单击事件
	                    rightClickTable:null, //右键单击事件
	                    loadDataAfter:null
					};
				//合并默认参数opt和defaluts
				settings = $.extend({}, defaluts, options);
				methods.queryContentHeight.call($this, settings);
				methods.queryMethod.call($this, settings);
				methods.tableRender.call($this, settings);
			});
		},
		queryContentHeight:function(){
		    return this.each(function(){
		    	var $this = $(this),
					setting = settings; //缓存settings
			    var ajaxLoadingDiv = "<div class='ajaxLoading' style='display:none;width:100%;height:100%;background:rgba(255, 255, 255, .4);position:absolute;z-index:9999;"
                   + "top:0;left:0;text-align:center;line-height:100%;display:none;font-size:14px;'><div style='display:table-cell;"
                   + "vertical-align:middle;'><image src='"+setting.contextPath+"/include/img/loading-default.gif' style='vertical-align:middle;'><span style='vertical-align:middle;'>正在加载数据......</span></div></div>";
			    if($(".ajaxLoading",window.top.document).length==0){ //当页面没有加载等待加载容器时添加
		    	   $(window.top.document.body).append(ajaxLoadingDiv); 
		        }			   
				var METHOD = {
					inH : function(div){return div.length>0?parseInt(div.innerHeight()):0;},
					inW : function(div){return div.length>0?parseInt(div.innerWidth()):0;},
				    //** 获取表格自适应高度和宽度
					getTableAutoHeight:function(parentDiv,suffix){
						!setting.isShowPage&&$("#pagination",parentDiv).css({"height":"0","padding-top":"6px"});//不显示分页器时高度设为0
						var winWidth = METHOD.inW(parentDiv.parent()),//获取主体父元素宽度,
						    contentWidth = METHOD.inW($("#headTable"+suffix,parentDiv)),
						    winHeight = METHOD.inH(parentDiv),//获取主体高度
						    headTitleHeight = METHOD.inH($(".headTitle"+suffix,parentDiv)),
						    queryCriteriaH = METHOD.inH($(".queryCriteria",parentDiv)),
						    resultTitleH = METHOD.inH($(".resultTitle",parentDiv)),
						    headDivH = METHOD.inH($("#headDiv"+suffix,parentDiv)),
						    paginationH = METHOD.inH($("#pagination",parentDiv)),//分页器高度
						    maxTableHeight = winHeight-headTitleHeight-queryCriteriaH-resultTitleH-paginationH-headDivH-4;
						if(METHOD.inH($("#dataTable",parentDiv))>maxTableHeight){ //判断是否显示y轴滚动条，
							$("#headDiv"+suffix,parentDiv).css("width",(winWidth-12)+'px');//调整headDiv的宽度 12为滚动条宽度
						    $("#dataDiv"+suffix,parentDiv).css("width",(winWidth)+'px');
							$("#dataDiv"+suffix,parentDiv).css({"height":maxTableHeight+'px',"max-height":maxTableHeight+'px'});
							$("#dataDiv"+suffix,parentDiv).css({"overflow-y":'scroll'});
						}else{
							$("#headDiv"+suffix,parentDiv).css("width",(winWidth)+'px');
							$("#dataDiv"+suffix,parentDiv).css("width",(winWidth)+'px');
							$("#dataDiv"+suffix,parentDiv).css({"height":maxTableHeight+'px',"max-height":maxTableHeight+'px'});
							$("#dataDiv"+suffix,parentDiv).css("overflow-y","hidden");
						}
						//计算宽度
						var headDivW = METHOD.inW($("#headDiv"+suffix,parentDiv));
						if((headDivW>contentWidth)&&isresize){
							$("#headTable"+suffix,parentDiv).css("width",(headDivW)+'px');
							$("#dataTable"+suffix,parentDiv).css("width",(headDivW)+'px');							
							$("#minWidth"+suffix,parentDiv).val(headDivW);
							//重新分配宽度
							var headtable = document.getElementById("headTable"+suffix),
							    datatable = document.getElementById("dataTable"+suffix);
							for(var i=0; i<headtable.rows[0].cells.length; i++){
								if(datatable.rows.length>0){
									datatable.rows[0].cells[i].width = (headtable.rows[0].cells[i].offsetWidth-1)+"px";		
								}
								headtable.rows[0].cells[i].width = (headtable.rows[0].cells[i].offsetWidth-1)+"px";		
							}
						}
					}
					
			   };  
				isresize = false; //定义一个全局变量判断是否已经执行resize事件
				METHOD.getTableAutoHeight($this,setting.suffix);
				//浏览器大小改变重新获取表格高度
				$(window).resize(function() {
					isresize = true;
   			 		METHOD.getTableAutoHeight($this,setting.suffix); 
				});
		    });
		},
		queryMethod: function() {
			return this.each(function() {
				var $this = $(this),
					setting = settings; //缓存settings
				/******** 公共方法 ********/
				var RULES = {
					goAjaxData: function() {
						$.ajax({
							async: setting.async,
							type: setting.type,
							url: setting.url,
							data: $("."+setting.dataClass,$this).serialize(),
							dataType:'json',
							success: function(data) {
							    //var data = settings.initQueryTable(data.list);//处理获取的数据
							    var hiddenTr =  $("#headTable"+setting.suffix,$this).find("tr").clone().css("visibility","hidden").attr("id","hiddenTR"+setting.suffix);//缓存hiddenTR占位
							    $("#dataDiv"+setting.suffix,$this).scrollTop(0);// 滚动至顶部
							    $("#dataTable"+setting.suffix,$this).html(""); //清空数据
								$("#dataTable"+setting.suffix,$this).append(hiddenTr).find("#hiddenTR" + setting.suffix).after(data.list);
							    if(data.list.length>0) { //判断是否为空
									$("#hiddenTR"+setting.suffix,$this).find("th").css({"height":"0px","border-top":"none"}).text(""); //隐藏占位tr
								}else{
							    	$("#hiddenTR"+setting.suffix,$this).find("th").css({"height":"24px","border-top":"none"}).text(""); //隐藏占位tr
							    }
							    $(window).trigger("resize"); //模拟resize事件重新计算table容器高度
							    RULES.initPageHtml(data.page); //初始化页面器
								!setting.isShowPage&&$("#pagination",$this).css({"height":"0","padding-top":"6px"});
								$(".ajaxLoading",window.top.document).css("display","none");
								if(typeof setting.loadDataAfter=="function"){
									setting.loadDataAfter();
								}
							},
							error: function(error) {},				
							beforeSend: function() {
								$(".ajaxLoading",window.top.document).css("display","table");//加载等待动画
							}
						});
					},
					ajaxLoadMore:function(event){
						var $event = $(event),
					    	scrollTop = $event.scrollTop(),
						    dataDivHeight = $event.height(),
					        contentHeight = $event.find("#dataTable"+setting.suffix).height(),
					        curPage = parseInt($("#curPage",$this).val()), //获取当前页面
					        totalPage= parseInt($("#scrollTotalPage",$this).val()),//获取总页码，当最后一页时不继续加载
					        isloadAll = true; //定义一个全部变量判断是否加载完成，避免多次加载
					    //判断是否有x轴滚动条
					   	if($event.css("overflow")=='auto'||$event.css("overflow-x")=='auto'){
					   	   	dataDivHeight = $event.height()-12;//12为x轴滚动条的高度
					   	}
					   	if(contentHeight-dataDivHeight -scrollTop<=12&&scrollTop>0){
					   	 	isScroll = true;
					   	 	if(curPage>=totalPage){
					   	 	    clearInterval(scrollAjax);					   	 	   
					   	 	    return;
					   	 	}
					   	 	
					   	    if(isLoadCompl&&(curPage<totalPage)){
								var scrollNextPage =  parseInt($("#curPage").val());
								$("#curPage",$this).val(scrollNextPage+1);
								$.ajax({
									type:'get',
									url:setting.scrollAjaxUrl, //加载数据地址
									data:$("."+setting.dataClass,$this).serialize(),
									dataType:'json',
									success:function(data){
									  	$("#dataTable",$this).append(data.list);										
										RULES.initPageHtml(data.page);
										!setting.isShowPage&&$("#pagination",this).css({"height":"0","padding-top":"6px"});
										isScroll = false;
										isLoadCompl = true;
										$(".ajaxLoading",window.top.document).css("display","none"); //正在加载样式
									},
									beforeSend:function(){
									   $(".ajaxLoading",window.top.document).css("display","table");
									   isLoadCompl = false;
									},
									error:function(status){
										console.log(status);
									}//请求数据失败
								});
							}
				   	 	}
					},
					/**
					 * 分布加载数据
					 * 当dataDiv滚动至底部时加载数据 
					 * ajax请求数据添加
					 * 为避免滚动至底部时多次加载，定义一个全局变量
					 **/
					scrollAjaxLoadMore:function(target){ //target为滚动对象
						var isScroll = false;	
						var targetDiv=null;
						isLoadCompl= true; //定义一个全局变量判断ajax是否加载完成，未加载完成时不可重复加载
						target.off("scroll.dataDiv");
						target.on("scroll.dataDiv",function(event){
							targetDiv = event.target;
							var curPage = parseInt($("#curPage",$this).val()), //获取当前页面
					            totalPage= parseInt($("#scrollTotalPage",$this).val()),//获取总页码，当最后一页时不继续加载
							    height = $(target).find("td").outerHeight(),
						        innerInder = Math.ceil($(target).outerHeight()/height),
						        lastIndex =$(target).find("tr").length;
							    scrollTop = $(this).scrollTop(),
							    index = Math.round(scrollTop/height); 
							if(index+innerInder>lastIndex-2){
						    	$(this).scrollTop(scrollTop);
							    return false;
							}else if(scrollTop>index*height){
								if(index+innerInder+2==lastIndex&&(curPage>=totalPage)){
									index = Math.floor(scrollTop/height); //滚动至顶部的元素的index
									$(this).scrollTop(scrollTop);
								}else{
									index = Math.ceil(scrollTop/height);
									scrollT = index*height;
									$(this).scrollTop(scrollT);
								}								
							}else{
								index = Math.floor(scrollTop/height),
								scrollT = index*height;
								$(this).scrollTop(scrollT);
							}
							scrollAjax = setInterval(ajaxSroll,1500); //避免ajax多次加载	
					    });
						function ajaxSroll(){
							!isScroll&&RULES.ajaxLoadMore(targetDiv);	
						};					   				    						  
				    },
					initPageHtml: function(page) {	
						if(typeof page == 'string'){
							page = JSON.parse(page);
						}
						var _this = $this.find("#pagination" + setting.suffix); //页码器盒子
						var curPage = page.curPage,
							totalPage = page.totalPage,
							totalRecord = page.totalRecord;	
						if(_this.length>0) { //判断分页器是否存在
							$("#pagination" + setting.suffix).html("");
							_EVENT.destoryClickLinks(_this);
							RULES.creatLinks(page,_this);							
							RULES.addEllipsis(page.curPage, page.totalPage,_this);
							_EVENT.clickLinks(_this);
						}
					},
					creatLinks: function(page,ele) {
						if(typeof page == 'string'){
							page = JSON.parse(page);
						}
						var links = "";
						if(page.totalPage > 1) {
							for(var i = 1; i <= page.totalPage; i++) {
								links += '<span data-page="' + i + '">' + i + '</span>';
							}
							ele.append(links);
							if(page.curPage > 1) {
								var prev = '<a href="javascript:void(0);" class="prev" data-page="' + (page.curPage - 1) + '">上一页</a>';
							}
							if(page.curPage < page.totalPage) {
								var next = '<a href="javascript:void(0);" class="next" data-page="' + (parseInt(page.curPage) + 1) + '">下一页</a>';
							}
							ele.prepend(prev);
							ele.append(next);
						}
						if(page.totalPage > 6) {
							ele.find("span").eq(page.totalPage - 1).after("<label id='ellipsis'>...</label>");
						}
						if(page.curPage == 1) {
							ele.find(".prev").addClass("disabled");
						}
						ele.find("span").eq(page.curPage - 1).addClass("current");
						var totalHtml = '| 共<em style="font-style:normal;color:red;">' + page.totalRecord + '</em>条数据<input type="hidden" value='+ page.totalPage +' id="scrollTotalPage">';
						ele.append(totalHtml);
					},
					addEllipsis: function(current, length,ele) {
						if(current >= 7) {
							if(ele.find("#beforeellipsis").length == 0) {
								ele.find("span").eq(1).after("<label id='beforeellipsis''>...</label>");
							}
							ele.find("#afterellipsis").remove();
							if(current < length - 5) {
								ele.find("span").eq(parseInt(current) + 1).after("<label id='afterellipsis''>...</label>");
							} else {
								ele.find("#ellipsis").remove();
							}
							ele.find("span").css("display", "none");
							ele.find("span").eq(0).css("display", "inline-block");
							ele.find("span").eq(1).css("display", "inline-block");
							for(var i = current - 3; i <= parseInt(current) + 2; i++) {
								ele.find("span").eq(i).css("display", "inline-block");
							}
						} else {
							ele.find("span").css("display", "inline-block");
							for(var i = length - 1; i >= 7; i--) {
								ele.find("span").eq(i).remove();
							}
							ele.find("#beforeellipsis").remove();
						}
					}
				};
				var _EVENT = {
					clickLinks: function(ele) {
						ele.off("click", "span,a");
						ele.on("click", "span,a", function() {
							var current = $(this).attr("data-page");
							if(current != undefined && current != '') {
								$this.find("#curPage").val(current);
								if(setting.getMethod == 'ajax') {
									RULES.goAjaxData();//加载数据
								} else if(setting.getMethod == 'form') {
									$("."+setting.dataClass,$this).submit();
								}
							}
						});
					},
					destoryClickLinks:function(ele){
						ele.off("click", "span,a");//解除事件绑定
					}					
				};
				//滚动时加载数据
				setting.isScrollAjax&&RULES.scrollAjaxLoadMore($("#dataDiv"+setting.suffix,$this));
				/**** 执行加载数据 *****/
				if(setting.getMethod == 'ajax') {
					$this.find("#querySubmit" + setting.suffix).off("click.query");
					$this.find("#querySubmit" + setting.suffix).on("click.query", function() {
						//验证查询条件是否通过
						var returnValue = $(this).attr("sub-disabled");
						if(!(returnValue==false||returnValue=='false')){
							$this.find("#curPage").val(1);
							RULES.goAjaxData();
						}						
					});					
				}else if(setting.getMethod == 'form') {
					$("#pagination"+setting.suffix).html("");
					var page = {
							"curPage": $this.find("#curPage").val(),
							"totalPage": $this.find("#totalPage").val(),
							"totalRecord": $this.find("#totalRecord").val()
					    };
					RULES.initPageHtml(page);
					!setting.isShowPage&&$("#pagination",this).css({"height":"0","padding-top":"6px"});
					$this.find("#querySubmit" + setting.suffix).off("click.query");
					$this.find("#querySubmit" + setting.suffix).on("click.query", function() {
						//验证查询条件是否通过
						var returnValue = $(this).attr("sub-disabled");
						if(!(returnValue==false||returnValue=='false')){
							$this.find("#curPage").val(1);
							$("."+setting.dataClass,$this).submit();
						}
					});
				}
			});
		},
		tableRender:function(){
			return this.each(function(){
				var setting = settings; //缓存settings
				//定义表格初始化信息
			  	var _headColor = setting.headColor,
				    _oddColor = setting.oddColor,
				    _evenColor = setting.evenColor,
				    _highColor = setting.highColor,
				    _hoverColor = setting.hoverColor,
				    _borderColor = setting.borderColor,
				    highTr = null;	
				//获取元素id
				var headDivId = "headDiv"+setting.suffix,
				    headTableId = "headTable"+setting.suffix,
				    dataDivId = "dataDiv"+setting.suffix,
				    dataTableId = "dataTable"+setting.suffix;
				
				var totalWidth = 0;//表头列总宽度
				//动态表格动态加载style标签，添加css控制鼠标放上去改变背景色，和动态加入的页面的样式
				function createStyle(){
					cssString = "<style>#"+dataTableId+" tbody tr:nth-child(odd):hover,"
					          + "#"+dataTableId+" tbody tr:nth-child(even):hover{background-color:"+_hoverColor+";cursor:pointer}"
					          + "#"+dataTableId+" tbody tr:nth-child(odd){background-color:"+_oddColor+"}"
					          + "#"+dataTableId+" tbody tr:nth-child(even){background-color:"+_evenColor+"}"
					          + "#"+dataTableId+" tbody.hignBgColor tr:nth-child(odd),"
					          + "#"+dataTableId+" tbody.hignBgColor tr:nth-child(even),"
					          + "#"+dataTableId+" tbody tr.hignBgColor:nth-child(odd),"
					          + "#"+dataTableId+" tbody tr.hignBgColor:nth-child(even){background-color:"+_highColor+"}</style>";
					$("head").append(cssString);
				}
				createStyle();
	            //一、先着奇偶行基本色，同时计算表头的总宽度
	            var ths = $("#"+headTableId+" th");
	            var thLen = ths.length;
	            ths.each(function(index){
					$(this).css({"background":"-webkit-gradient(linear,0% 0%,0% 100%,from(#fff), to(#ccc))", "text-align":"center"});
					if(setting.topBorder) $(this).css({"border-top":"1px solid "+_borderColor});
					if(setting.bottomBorder) $(this).css({"border-bottom":"1px solid "+_borderColor});
					if(index==0 && setting.leftBorder) $(this).css({"border-left":"1px solid "+_borderColor});//第一格
					if(index==thLen-1 && setting.rightBorder) $(this).css({"border-right":"1px solid "+_borderColor});//最后一格
					else $(this).css({"border-right":"1px solid "+_borderColor});
					var width = this.width;	//获取宽度
					width = index==0?(parseInt(width.replace(/px/,''))+2):(parseInt(width.replace(/px/,''))+1);
					totalWidth += width;
				});
				//二、根据表头th宽度计算表体td宽度
			    var trs = $("#"+dataTableId+" tr");
				var trLen = trs.length;
				if(trLen==0){//如果表体里没有数据，那么构造一个不可见但占位的空表体数据行，如果表头超出可见范围时，表体才会出现横向的滚动条
					var hiddenTr =  $("#"+headTableId).find("tr").clone().css("visibility","hidden").attr("id","hiddenTR"+setting.suffix);
					$("#"+dataTableId).html(hiddenTr);
				}else{
					trs = $("#"+dataTableId+" tr:not([id='hiddenTR'])");
					trs.each(function(index){
						$(this).attr("trindex", index);
						//处理行内td的边框样式
						var tds = $(this).find("td");
						var len2 = tds.length;
						tds.each(function(ind){
							/**
							 * 原：默认 tdAlign="left";
							 * 改（包）：默认 tdAlign="center",且可由工程师设置其水平位置;
							 * 原因：大多数据需要居中显示，但有些特殊的需要居左显示。
							 */
							var tdAlign=$(this).attr("align");
							if(typeof(tdAlign)=="undefined"||tdAlign==null||tdAlign==""){
								tdAlign="center";
							}
							$(this).css({"text-align":tdAlign});
							if(setting.topBorder) $(this).css({"border-top":"1px solid "+_borderColor});
							if(setting.bottomBorder) $(this).css({"border-bottom":"1px solid "+_borderColor});
							if(ind==0 && setting.leftBorder) $(this).css({"border-left":"1px solid "+_borderColor});//第一格
							if(ind==trLen-1 && setting.rightBorder) $(this).css({"border-right":"1px solid "+_borderColor});//最后一格
							else $(this).css({"border-right":"1px solid "+_borderColor});
						});
					});
				};
				//2、校对width
				var datatable = document.getElementById(dataTableId),
				    headtable = document.getElementById(headTableId),
				    widthArray = new Array(); //定义一个数组保存width
			    //给table添加属性table-layout = fixed属性
				datatable.style.tableLayout = 'fixed';
				headtable.style.tableLayout = 'fixed';
				if(datatable!=null && datatable.rows.length>0){
					for(var i=0; i<datatable.rows[0].cells.length; i++){ //缓存width
			           widthArray.push(headtable.rows[0].cells[i].offsetWidth-1); 
					}
					for(var i=0; i<widthArray.length; i++){ //赋值
						datatable.rows[0].cells[i].width = widthArray[i]+"px";
						headtable.rows[0].cells[i].width = widthArray[i]+"px";
					}
				}
				//二、再调整滚动条
				var flowX = false;//是否应该有横向滚动条
				var flowY = false;//是否应该有纵向滚动条
				//添加滚动条样式
				var scrollBarStyle = "<style>#"+dataDivId+"::-webkit-scrollbar{width:0;}</style>";
				var dataTableIdHeight = 0; //dataTable的高度
				$("#"+dataTableId+" tr").each(function(){
					if(!($(this).css("visibility")=="hidden")){
						var height = parseInt($(this)[0].style.height)||parseInt($(this).height());
						var border = parseInt($(this).find("td").eq(0).css("border-bottom"));
						dataTableIdHeight += height+border;
					}		
				});
				if(totalWidth>$("#"+headDivId).parent().width()) flowX = true;
				if(dataTableIdHeight>$("#"+dataDivId).height()) flowY = true;
				/*当isCovered为true时，如果表头宽度没有占满div的宽度，则调整为div的宽度*/
				if(setting.isCovered){
				    var width = parseInt($("#"+dataDivId).parent().width()),
					    totalw = parseInt($("#"+dataTableId).width());
					  //console.log(totalw)
				    if(totalw>width){
					    $("#minWidth"+setting.suffix).val(totalw-10);
					    if(setting.isScroll){
						    if(flowY){
							    $("#"+headDivId).css('width',width-10+"px");
							    $("#"+headTableId).css('width',totalw-10+"px");
							    $("#"+dataTableId).css('width',totalw+"px");  
						    }else{
							    $("#"+headDivId).css('width',width+"px");
							    $("#"+headTableId).css('width',totalw-10+"px");
							    $("#"+dataTableId).css('width',totalw+"px");   
						    }			  
					    }else{
						    $("head").append(scrollBarStyle); //添加滚动条样式，不显示y轴滚动条
						    $("#"+headDivId).css('width',"100%");
						    /*$("#"+headDivId).css('width',width+"px");*/
						    $("#"+headTableId).css('width',totalw+"px");
						    $("#"+dataTableId).css('width',totalw+"px");  
					    }  	 
				    }else{
					    $("#minWidth"+setting.suffix).val(width-10);
					    if(setting.isScroll){			 
						    if(flowY){ //当有纵向滚动条时
							    $("#"+headDivId).css('width',width-10+"px"); 
							    $("#"+headTableId).css('width',width-10+"px");         
							    $("#"+dataTableId).css('width',width-10+"px");
						    }else{			 
							    $("#"+headDivId).css('width',width+"px");
							    $("#"+headTableId).css('width',width+"px");         
							    $("#"+dataTableId).css('width',width+"px");
						    }		  
					    }else{			 
			                $("head").append(scrollBarStyle); //添加滚动条样式，不显示y轴滚动条
			                $("#"+headDivId).css('width',"100%");
						    //$("#"+headDivId).css('width',width+"px");
						    $("#"+headTableId).css('width',width+"px");         
						    $("#"+dataTableId).css('width',width+"px"); 
					  }		    
				    }
				    //重定义宽度
				    var widthArray = [];//缓存宽度
				    if(datatable!=null && datatable.rows.length>0){
					    for(var i=0; i<headtable.rows[0].cells.length; i++){ //赋值
					    	var width = $(headtable.rows[0].cells[i]).width();
					        widthArray.push(width);
						}
					    for(var i=0; i<headtable.rows[0].cells.length; i++){ //赋值
					    	datatable.rows[0].cells[i].width = widthArray[i]+"px";
							headtable.rows[0].cells[i].width = widthArray[i]+"px";
						} 
					}
				}else{
					var width = parseInt($("#"+dataDivId).parent().width());
					    totalw = totalWidth;
					$("#minWidth"+setting.suffix).val(totalw-10);
					if(isScroll){			
						if(flowY){
							 $("#"+headTableId).css('width',totalw+"px");
							 $("#"+headDivId).css('width',width-10+"px");
						}else{
							 $("#"+headTableId).css('width',totalw+"px");
							 $("#"+headDivId).css('width',width+"px");
						}	
					}else{
						 $("head").append(scrollBarStyle); //添加滚动条样式，不显示y轴滚动条
						 $("#"+headDivId).css('width',"100%");
						 $("#"+headTableId).css('width',totalw+"px");
						 $("#"+headDivId).css('width',width+"px");
					}			
					$("#"+dataDivId).css('width',width+"px");		
					$("#"+dataTableId).css('width',totalw+"px");
				}	
				
				$("#"+dataDivId).scroll(function(){
					$("#"+headDivId).scrollLeft($("#"+dataDivId).scrollLeft());
				});					
				setting.isEditX&&resizeTableX(setting.suffix);//是否可以拖动改变列宽				
				setting.isDragChoosed&&dragChoosed(setting.suffix); //是否可以拖动选择多行
			    /*左键单击事件*/
				//$(datatable).off("click","tr");
				$(datatable).on("click","tr",function(event){
					var $this = $(this);
				    $this.css("color","red")
					if(typeof setting.leftClickTable =="function"){
						 setting.leftClickTable($this);
					}else{
						//判断tr中是否有checkbox
						/**
						 * 1.是否支持多选行
						 * 2.是否选中时选中checkbox
						 */
						if(setting.isGroupHigh){//tbody分组高亮显示
							if(setting.isDragChoosed){//可多选
								var isClass=$this.parents("tbody").hasClass(hignBgColor);
								if(isClass){
									$this.parents("tbody").removeClass("hignBgColor");
								}else{
									$this.parents("tbody").addClass("hignBgColor");//背景高亮
								}
								if(setting.isTrClickCheckbox){
									$this.parents("tbody").find("tr input[type='checkbox'][name='check']")
														  .prop("checked",!isClass);
								}
							}else{
								$this.parents("table").find("tbody").removeClass("hignBgColor");
								$this.parents("table").find("tr input[type='checkbox'][name='check']")
								  					  .prop("checked",false);
								$this.parents("tbody").addClass("hignBgColor");//背景高亮
								if(setting.isTrClickCheckbox){
									$this.parents("tbody").find("tr input[type='checkbox'][name='check']")
														  .prop("checked",true);
								}
							}
						}else{
							if(setting.isDragChoosed){//可多选
								var isClass=$this.parents("tr").hasClass(hignBgColor);
								if(isClass){
									$this.parents("tr").removeClass("hignBgColor");
								}else{
									$this.parents("tr").addClass("hignBgColor");//背景高亮
								}
								if(setting.isTrClickCheckbox){
									$this.parents("tr").find("tr input[type='checkbox'][name='check']")
														  .prop("checked",!isClass);
								}
							}else{
								$this.parents("table").find("tr").removeClass("hignBgColor");
								$this.parents("table").find("tr input[type='checkbox'][name='check']")
								  					  .prop("checked",false);
								$this.parents("tr").addClass("hignBgColor");//背景高亮
								if(setting.isTrClickCheckbox){
									$this.parents("tr").find("tr input[type='checkbox'][name='check']")
														  .prop("checked",true);
								}
							}
						}
					}
				});
                /*右键单击事件*/
				//$(datatable).off("contextmenu","tr");
				$(datatable).on("contextmenu","tr",function(event){
					var $this = $(this);
					if(typeof setting.rightClickTable =="function"){
						setting.rightClickTable($this);		
					}else{
						if(setting.isGroupHigh){//tbody分组高亮显示
						    $this.parents("tbody").addClass("hignBgColor").siblings("tbody").removeClass("hignBgColor");//背景高亮	
						}else{
							$this.parents("table").find("tr").removeClass("hignBgColor");//背景高亮
							$this.addClass("hignBgColor");
						}
					}
					return false;
				});
				
				
				/**
				 * 解决表头拖动时mouseup和排序click事件的冲突
				 * 定义一个全局变量，是否mousemove
				 * */
				var ismousemoveX = true;
				/*表格可以拖放*/
				function resizeTableX(suffix){				
					var handleDiv = $("#headTable"+suffix+",#dataTable"+suffix),
					    headTable = document.getElementById("headTable"+suffix),
					    dataTable = $("#dataTable"+suffix),
					    table = document.getElementById("dataTable"+suffix),
					    pressedX= false,
				        start = undefined;
				    var startX, startWidth,minWidth,_index;
				    if(setting.isDragChoosed){ //当可以拖动选中多行时，只能通过拖动表头改变列宽
				    	handleDiv = $("#headTable"+suffix);
				    }
				    //解绑
				    handleDiv.find("th,td").off("mousedown.resizeTableX");
				  	handleDiv.find("th,td").on("mousedown.resizeTableX",function(e) {   
				        if(e.offsetX<15){
				        	start = $(this).prev();
				        	_index=$(this).prev().index();
				        }else{
				            start = $(this);
				           _index=$(this).index();          	
				        }      
				        pressedX = true;
				        startX = e.pageX;
				        startWidth = $(start).width(),
				        minWidth = parseFloat($("#minWidth"+suffix).val());   				
				    });
				    //解绑
				    handleDiv.find("th,td").off("mousemove.resizeTableX");
				    handleDiv.find("th,td").on("mousemove.resizeTableX",function(e) {
				        var _index2 = $(this).index();
				        if(e.offsetX>$(this).width()-15){
				        	ismousemoveX = false;
				        	isL = true;
				        }else if(e.offset<15){
				        	ismousemoveX = false;
				            isL=false;
				        }else{
				        	ismousemoveX = true;
				        }
				        if(e.offsetX>$(this).width()-8||e.offsetX<8){
				            $(this).css("cursor","col-resize");	
				        }else{
				            $(this).css("cursor","");
				        }
				        if(pressedX&($(this).width()-15>e.offsetX&&e.offsetX>15)){
				            pressedX = false;
				        }
				    });
				    //解绑
				    $(document).off("mousemove.resizeTableX");
				    $(document).on("mousemove.resizeTableX",function(e) {
				        if(pressedX) {
				        	var disX = e.pageX-startX;
				        	if(setting.tdMinWidth<startWidth+disX){
				        		table.rows[0].cells[_index].width = startWidth+disX;   
				            	$(start).get(0).width = startWidth+disX;
				            	if($(start).get(0).tagName=='TD'||$(start).get(0).tagName=='td'){  //判断target
				            		table.rows[0].cells[_index].width = startWidth+disX;  
				            		headTable.rows[0].cells[_index].width = startWidth+disX;
				            	}           
				           		$("#headTable"+suffix).css("min-width",(minWidth+disX)+'px').css("width",(minWidth+disX)+'px');
				            	$("#dataTable"+suffix).css("min-width",(minWidth+disX)+'px').css("width",(minWidth+disX)+'px');
				            	$("#minWidth"+suffix).val(minWidth+(disX));
				        	}				            
				        }
				    });
				    //解绑
				    handleDiv.off("mouseup.resizeTableX");
				    handleDiv.on("mouseup.resizeTableX",function() {
				        if(pressedX) {
				            pressedX = false;
				        }
				    });
				}	
				//拖动选择多行
				function dragChoosed(suffix){
					var dataTable = $("#dataTable"+suffix),
					    dataDiv = ("#dataDiv"+suffix),
					    table = document.getElementById("dataTable"+suffix),
					    $trs = $("#dataTable"+suffix).find("tr");
					//给checkbox阻止事件冒泡
					$(dataTable).on("click","input[type='checkbox']",function(event){
						event.stopPropagation();
					});
					$(dataTable).off("mousedown.dragChoosed");//解绑
					$(dataTable).on("mousedown.dragChoosed","tr",function(event){
						$(dataDiv).addClass("noselect");
						var $tr = $(this);
						var rowInit = this.rowIndex;
						var fixInit =  this.rowIndex;
						var mouseNum = event.button; //0鼠标左键，1鼠标中间吗，2鼠标右键
						var initY = event.clientY;
						var $initTR = $tr;
						var isHign = $initTR.hasClass("hignBgColor");
						var initX = event.clientX;
						var initY = event.clientY;
						$(dataTable).on("mousemove.dragChoosed","tr",function(event){
							//解决Chrome浏览器mousedown事件触发mousemove的bug
							if(initX==event.clientX&&initY==event.clientY){
								return;
							}
						    if(isHign&&this.rowIndex!=rowInit){
								$initTR.removeClass("hignBgColor");
								$initTR.find("td").eq(0).find("input[type='checkbox']").prop("checked",false);
							}else{
								$initTR.addClass("hignBgColor");
								$initTR.find("td").eq(0).find("input[type='checkbox']").prop("checked",true);
						    }
							var $tr = $(this);
							var rowIndex = this.rowIndex;
							var disY = event.clientY - initY;	
							if(Math.abs(rowIndex-rowInit)==1){
								if($tr.hasClass("hignBgColor")){
									$tr.removeClass("hignBgColor");
									$tr.find("td").eq(0).find("input[type='checkbox']").prop("checked",false);
								}else{
									$tr.addClass("hignBgColor");
									$tr.find("td").eq(0).find("input[type='checkbox']").prop("checked",true);
								}
							}else{
								if($tr.eq(rowInit).hasClass("hignBgColor")){
									$tr.eq(rowInit).removeClass("hignBgColor");
									$tr.eq(rowInit).find("td").eq(0).find("input[type='checkbox']").prop("checked",false);
								}else{
									$tr.eq(rowInit).addClass("hignBgColor");
									$tr.eq(rowInit).find("td").eq(0).find("input[type='checkbox']").prop("checked",true);
								}
							}
							if(rowIndex-rowInit==-1&&disY>0){
								$trs.eq(rowIndex+1).removeClass("hignBgColor");
								$trs.eq(rowIndex+1).find("td").eq(0).find("input[type='checkbox']").prop("checked",false);
							}
							rowInit = rowIndex;
						});
						$(document).on("mouseup.dragChoosed",function(event){
										
							$(dataTable).off("mousemove.dragChoosed"); //解绑
							$(document).off("mouseup.dragChoosed");//解绑
							$(dataDiv).removeClass("noselect");
					    });
					});	
					
				}
				//给需要排序的表头th加样式  正常排序normal，asc升序，desc降序
				function changeSort(){
			    	var callback ="";
			    	$("table th[data-sort]").each(function(){
			    		if(callback==""){
			    			callback = $(this).attr("callback");
			    		}
			    		var sortHtml = "<i class='sort_up' sort='1'></i><i class='sort_down' sort='-1'></i>";
		 	  	 		$(this).append(sortHtml);
		 	  		});
			    	$("table").on("click.changeSort","th[data-sort] i",function(event){
			    		var type = $(this).attr("sort");
			    		$(this).parent().attr("data-sort",type);
			    		eval("("+callback+"())");
				   	    event.stopPropagation(); //阻止事件冒泡
				   	});
                }   
				!setting.isSort&&changeSort();
			});
		}
	};
	$.fn.queryMethod = function() {
		var method = arguments[0];
		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if(typeof(method) == 'object' || !method) {
			method = methods.init;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.pluginName');
			return this;
		}
		return method.apply(this, arguments);
	};
})(jQuery);