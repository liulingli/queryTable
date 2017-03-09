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
						isEditY:false,//是否可以拖动改变行高，默认false
						isDragChoosed:false, //是够允许拖动选中td,默认false
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
	                    leftClickTable:function(){}, //左键单击事件
	                    rightClickTable:function(){} //右键单击事件
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
				if($(".ajaxLoading",window.top.document).length == 0){
					$(window.top.document.body).append(ajaxLoadingDiv); //添加等待加载容器
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
							$("#headDiv"+suffix,parentDiv).css("width",(winWidth-10)+'px');//调整headDiv的宽度 10为滚动条宽度
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
				//	
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
					   	   	dataDivHeight = $event.height()-10;//10为x轴滚动条的高度
					   	}
					   	if(contentHeight-dataDivHeight -scrollTop<=10&&scrollTop>0){
					   	 	isScroll = true;
					   	 	if(curPage>=totalPage){
					   	 	    clearInterval(scrollAjax);					   	 	   
					   	 	    return;
					   	 	}
					   	 	
					   	    if(isLoadCompl&&(curPage<totalPage)){
					   	    	console.log(setting.scrollAjaxUrl)
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
										console.log(status)
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
					$this.find("#querySubmit" + setting.suffix).on("click", function() {
						$this.find("#curPage").val(1);
						RULES.goAjaxData();
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
					$this.find("#querySubmit" + setting.suffix).on("click", function() {
						$this.find("#curPage").val(1);
						$("."+setting.dataClass,$this).submit();
					})
				}
			})
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
					          + "#"+dataTableId+" tbody tr.hignBgColor:nth-child(even){background-color:"+_highColor+"}</style>"
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
					if($(this).attr("initWidth")!=undefined&&$(this).attr("initWidth")!=''){ //保存初始宽度
						this.width = $(this).attr("initWidth");
					}else{
						$(this).attr("initWidth",this.width);	
					}
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
					$("#"+dataDivId).css("overflow-y","hidden");
				}else{
					trs = $("#"+dataTableId+" tr:not([id='hiddenTR'"+setting.suffix+"])");
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
				})
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
				
			    /*左键单击事件*/
				$(datatable).on("click","tr",function(event){
					var $this = $(this);
					if(setting.isGroupHigh){//tbody分组高亮显示
					    $this.parents("tbody").addClass("hignBgColor").siblings("tbody").removeClass("hignBgColor");//背景高亮	
					}else{
						$this.parents("table").find("tr").removeClass("hignBgColor");//背景高亮
						$this.addClass("hignBgColor");
					}
				    setting.leftClickTable($this);								
				});
                /*右键单击事件*/
				$(datatable).on("contextmenu","tr",function(event){
					var $this = $(this);
					if(setting.isGroupHigh){//tbody分组高亮显示
					    $this.parents("tbody").addClass("hignBgColor").siblings("tbody").removeClass("hignBgColor");//背景高亮	
					}else{
						$this.parents("table").find("tr").removeClass("hignBgColor");//背景高亮
						$this.addClass("hignBgColor");
					}					
				    setting.rightClickTable($this);						
					return false;
				});
				
				/**
				 * 解决表头拖动时mouseup和排序click事件的冲突
				 * 定义一个全局变量，是否mousemove
				 * */
				var ismousemoveX = true;
				// 定义表格事件方法
				var _Event = {
			        RedrawBorder:function(dataDiv,dataTable,type,dis){ //重新绘制边框
			        	$(document).off("mousemove.resizeTableY");
					    $(document).off("mouseup.resizeTableY");	   
					    $(document).off("mousemove.resizeTableX");
					    $(document).off("mouseup.resizeTableX");
					    $(".ColumnResizer").css("background","")
					    $(".ColumnResizerGuide").css("display","none");
					    $(".RowResizer").css("background","")
					    $(".RowResizerGuide").css("display","none");
						$(dataDiv).removeClass("noselect");
						$(headDiv).removeClass("noselect");	
						
					     //获取选中区域
					   	var choosedArray = $(dataTable).find(".hignlight"),
					        FirstTd = choosedArray[0],
					        LastTd = choosedArray[choosedArray.length-1];
					        $ondown = $(dataTable).find(".ondown");
					    //当页面没有选中和单击时不执行以下方法    
					    if(choosedArray.length>0){ 
							//当有选中区域时重新绘制选中区域的边框值
						   	var cellInit = FirstTd.cellIndex,
						   	    rowInit  = FirstTd.parentNode.rowIndex,
						   	    cellEnd = LastTd.cellIndex,
						   	    rowEnd = LastTd.parentNode.rowIndex,
						   	    left = FirstTd.offsetLeft,
						   	    top = FirstTd.offsetTop;
						   	var totalW = 0,totalH = 0;
						   	for(var i=rowInit;i<=rowEnd;i++){
						   	    var height = $(dataTable.rows[i].cells[cellInit]).outerHeight();
						   	    totalH += height;
						   	}
						   	for(var i=cellInit;i<=cellEnd;i++){
						   		var width = $(dataTable.rows[rowInit].cells[i]).outerWidth();
						   		totalW += width;
						   	}
						   	//边框样式
						   	var borderHtml = "<div class='border'>"
					            +"<div style='width:"+totalW+"px;height:1px;left:"+left+"px;top:"+top+"px;' ></div>"
					            +"<div style='width:"+totalW+"px;height:1px;left:"+left+"px;top:"+(top+totalH)+"px;'></div>"
					            +"<div style='width:1px;height:"+totalH+"px;left:"+left+"px;top:"+top+"px;'></div>"
					            +"<div style='width:1px;height:"+totalH+"px;left:"+(left+totalW)+"px;top:"+top+"px;'></div>"
					            +"</div>";
					        $(dataDiv).find(".border").replaceWith(borderHtml);
						}
					    if($ondown.length>0){
					    	//当前点击的td样式
					        var onWidth = $ondown.outerWidth(),
					            onHeight = $ondown.outerHeight(),
					            onLeft = $ondown[0].offsetLeft,
					            onTop =  $ondown[0].offsetTop;				    
						    var hignHtml = "<div class='hight'>"
					            +"<div style='width:"+(onWidth-1)+"px;height:2px;left:"+(onLeft)+"px;top:"+onTop+"px;'></div>"
					            +"<div style='width:"+(onWidth-1)+"px;height:2px;left:"+(onLeft)+"px;top:"+(onTop+onHeight-1)+"px;'></div>"
					            +"<div style='width:2px;height:"+onHeight+"px;left:"+(onLeft)+"px;top:"+onTop+"px;'></div>"
					            +"<div style='width:2px;height:"+onHeight+"px;left:"+(onLeft+onWidth-1)+"px;top:"+onTop+"px;'></div>"
					            +"</div>";			    
						    $(dataDiv).find(".hight").replaceWith(hignHtml);
					    }                
			            if($ondown.length>0||choosedArray.length>0){
			            	var cornerTop = parseFloat($(dataDiv).find(".corner").css("top")),
						        cornerLeft = parseFloat($(dataDiv).find(".corner").css("left"));
						    if(type=='x'){
						    	$(dataDiv).find(".corner").css("left",(cornerLeft-dis)+"px");
						    }else if(type='y'){
						    	$(dataDiv).find(".corner").css("top",(cornerTop-dis-1)+"px");
						    }	
			           }		    	    
				   	},
				    resizeTableX:function(suffix){ //拖曳改变列宽度
				    	var dataDiv =document.getElementById("dataDiv"+suffix),
						    headDiv = document.getElementById("headDiv"+suffix),
						    datatable = document.getElementById("dataTable"+suffix),
						    headtable = document.getElementById("headTable"+suffix);
						//鼠标放在上面显示可拖动区域 
						$(headtable).on("mouseover.resizeTableX","th",function(){
							var $this = $(this),
							    left = this.offsetLeft+$this.outerWidth()-5,
							    initHeight = $this[0].offsetHeight;
						    //重新定位参考线位置
							$(".ColumnResizer").css({"left":left+"px","top":"0px","height":initHeight+"px"});
							$(".ColumnResizerGuide").css({"left":(left+5)+"px","top":"0px"});	
							//给当前th添加添加class,记录当前th
							$(this).addClass("onresize").siblings("th").removeClass("onresize");
						});
						//给拖动div注册mousedown事件，记录初始位置
						$("body").on("mousedown.resizeTableX",".ColumnResizer",function(e){
							$(dataDiv).addClass("noselect");
							$(headDiv).addClass("noselect");
							var disX = 0,disY = 0, //初始化移动距离
							    initX = e.clientX,
							    initY = e.clientY;
							var $this = $(this),
							    $th = $(".onresize"),
							    index = $th[0].cellIndex,
							    initWidth = parseFloat($th[0].width),
							    initHeight = $th.outerHeight(),
							    minWidth = parseFloat($("#minWidth"+suffix).val()),
							    totalHeight = $(dataDiv).outerHeight()+initHeight;
							$(".ColumnResizer").css("background","darkgray");
							$(".ColumnResizerGuide").css("display","block");
							var left = parseInt($(".ColumnResizerGuide").css("left")); //记录初始left值
							//注册mousemove事件，记录移动距离
							$(document).on("mousemove.resizeTableX",function(e){
								//解决Chrome浏览器mousedown事件触发mousemove的bug
								if(initX==e.clientX){
									return;
								}
								//当鼠标移动时当前表格内容不可选中
							    $(dataDiv).addClass("noselect");
							    $(headDiv).addClass("noselect");
								disX = initX - e.clientX,
								$(".ColumnResizerGuide").css("left",(left-disX)+"px")
								$(".ColumnResizer").css("left",(left-disX)+"px")
							});
							//注册mouseup事件，鼠标释放时改变列宽，并解绑mousemove事件
							$(document).on("mouseup.resizeTableX",function(){				    
							    //重新计算宽度
							    $th[0].width = initWidth-disX;
							    for(var i=0;i<datatable.rows.length;i++){
							    	datatable.rows[i].cells[index].width = initWidth-disX;
							    }
							    //当有选中区域时重新计算选中区域的width,left值
							    $("#headTable"+suffix+",#dataTable"+suffix).css({"min-width":(minWidth-disX)+'px',"width":(minWidth-disX)+'px'});
					            $("#minWidth"+suffix).val(minWidth-disX);		            
					            _Event.RedrawBorder(dataDiv,datatable,'x',disX);//重新绘制
							    disX = 0; //还原移动距离为0
							});
						});
				    },
				    resizeTableY:function(suffix){//拖曳改变行高度
				        var dataDiv =document.getElementById("dataDiv"+suffix),
						    headDiv = document.getElementById("headDiv"+suffix),
						    datatable = document.getElementById("dataTable"+suffix),
						    headtable = document.getElementById("headTable"+suffix);
						//鼠标放在上面显示可拖动区域 	
						$(datatable).on("mouseover.resizeTableY","td",function(){ //只有第列可以拖
							if(this.cellIndex!=0){
								return;
							}
							
							var $this = $(this),
							    width = $this.outerWidth(),
							    left = this.offsetLeft,
							    top = this.offsetTop+$this.outerHeight()-5;       
							$(".RowResizer").css({"width":width+"px","left":left+"px","top":top+"px"});
							$(".RowResizerGuide").css({"left":"0","top":top+"px"});
							//记录当前th
							$(".onresize").removeClass("onresize");
							$(this).addClass("onresize");
						});
						$(dataDiv).on("mousedown.resizeTableY",".RowResizer",function(e){
							//鼠标按下拖动过程中，解绑td的mouseover事件，避免获取当前td不正确
							$(datatable).find("td").off("mouseover.resizeTableY");
							var disX = 0,disY = 0,
							    initX = e.clientX,
							    initY = e.clientY;
							var $this = $(this),
							    $th = $(".onresize"),
							    index = $th[0].parentNode.rowIndex,
							    initHeight = $th.height();
							$(".RowResizer").css("background","darkgray")
							$(".RowResizerGuide").css("display","block");
							var top = parseInt($(".RowResizer").css("top"));//记录初始left值
							//注册mousemove事件，记录移动距离
							$(document).on("mousemove.resizeTableY",function(e){
								//解决Chrome浏览器mousedown事件触发mousemove的bug
								if(initY == e.clientY){
									return;
								}
								//当鼠标移动时当前表格内容不可选中
							    $(dataDiv).addClass("noselect");
							    $(headDiv).addClass("noselect");
								disY = initY - e.clientY;
								$(".RowResizerGuide").css("top",(top-disY)+"px")
								$(".RowResizer").css("top",(top-disY)+"px")
							});
							$(document).on("mouseup.resizeTableY",function(){
								//重新绑定mouseover事件
								$(datatable).find("td").trigger("mouseover.resizeTableY");
								//重新计算高度
								$th.css("height",(initHeight-disY)+"px");
					   		    $(datatable).find("tr").eq(index).find("td").css("height",(initHeight-disY)+"px");
							   	_Event.RedrawBorder(dataDiv,dataTable,'y',disY); //重新绘制
			 					disY = 0; //还原移动距离为0  
							});
						});
				    },
				    dragChoosed:function(suffix){
					    var dataDiv =document.getElementById("dataDiv"+suffix),
						    headDiv = document.getElementById("headDiv"+suffix),
						    datatable = document.getElementById("dataTable"+suffix),
						    headtable = document.getElementById("headTable"+suffix);
						if(datatable.rows.length<=1){
							return;
						}
						$(datatable).on("mousedown.dragChoosed","td",function(e){
							var mouseNum = e.button;
						    if(mouseNum==0||(mouseNum==2&&!$(this).hasClass("hignlight"))){ //鼠标按下左键
						        $(".corner").remove();
						        $(".hight").remove();
							    $(".border").remove();	
							    $(datatable).find("td").removeClass("hignlight");
						    }		  				
							var $this= $(this),
							    cellInit= this.cellIndex, //列号
							    rowInit =this.parentNode.rowIndex, //行号
							    initX = e.clientX, 
							    initY = e.clientY;
							//获取td的宽高
							var width = $this.outerWidth(),
							    height = $this.outerHeight();				    
							//获取位置position
						    var left = this.offsetLeft,
						        top = this.offsetTop;
							var hignHtml = "<div class='hight'>"
					                +"<div style='width:"+(width-1)+"px;height:2px;left:"+(left)+"px;top:"+top+"px;'></div>"
					                +"<div style='width:"+(width-1)+"px;height:2px;left:"+(left)+"px;top:"+(top+height-1)+"px;'></div>"
					                +"<div style='width:2px;height:"+height+"px;left:"+(left)+"px;top:"+top+"px;'></div>"
					                +"<div style='width:2px;height:"+height+"px;left:"+(left+width-1)+"px;top:"+top+"px;'></div>"
					                +"</div>";
					            var cornerHtml = "<div class='corner' style='left:"+(left+width-4)+"px;top:"+(top+height-4)+"px;'></div>"
						    if(mouseNum==2&&!$(this).hasClass("hignlight")||mouseNum==0){
						    	$(dataDiv).append(hignHtml+cornerHtml);
						    }
						    //给当前mousedown的元素添加class
						    $(datatable).find(".ondown").removeClass("ondown");
						    $this.addClass("ondown");
							//注册mousemove事件
						    $(datatable).find("td").on("mousemove.dragChoosed",function(e){			    	
						    	//判断是否mousemove,解决chrome浏览器下mousedown触发mousemove的bug
			    				var nowX = e.clientX,
						    	    nowY = e.clientY;
						    	if(initX==nowX&&initY==nowY){
						    		return;
						    	}
						    	//当鼠标移动时当前表格内容不可选中
								$(dataDiv).addClass("noselect");
								$(headDiv).addClass("noselect");
			
			                    var mouseNum = e.button;
			                    var cellIndex= this.cellIndex, //获取当前列号
						            rowIndex =this.parentNode.rowIndex; //获取当前行号
			                	$(".corner").remove();
				    		    $(".border").remove();
				    		    $(datatable).find("td").removeClass("hignlight");                   	   
			                   	      
						        if(cellIndex<cellInit&&rowIndex<rowInit){ //左上选择
					        	    for(i=rowInit;i>=rowIndex;i--){
						        		for(j=cellInit;j>=cellIndex;j--){				        	
						        			var td = datatable.rows[i].cells[j]; //选中的td
						        			$(td).addClass("hignlight");
						        		}
						        	}
						        	//计算选中区域边框的width、height
						        	var totalW = 0,totalH = 0;
						        	for(j=rowInit;j>=rowIndex;j--){			
					        			var height = $(datatable.rows[j].cells[cellInit]).outerHeight();
						        		totalH += height;
							        }
					        		for(i=cellInit;i>=cellIndex;i--){
					        			var width = $(datatable.rows[rowInit].cells[i]).outerWidth();
					        			totalW += width;
					        		}
					        		//选中td的宽高
					        		var $tdFirst = $(datatable.rows[rowInit].cells[cellInit]);
						        	var firstWidth = $tdFirst.outerWidth(),
						        	    firstHeight = $tdFirst.outerHeight();
						        	var div = "<div class='border'>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+(left-totalW+firstWidth)+"px;top:"+(top+firstHeight)+"px;' ></div>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+(left-totalW+firstWidth)+"px;top:"+(top-totalH+firstHeight)+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+(left+firstWidth)+"px;top:"+(top-totalH+firstHeight)+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+(left-totalW+firstWidth)+"px;top:"+(top-totalH+firstHeight)+"px;'></div>"
						                +"</div>";
						            var cornerHtml ="<div class='corner' style='left:"+(left-totalW+firstWidth-2)+"px;top:"+(top-totalH+firstHeight-2)+"px;'></div>";
						        }else if(cellIndex<cellInit&&rowIndex>rowInit){ //左下选择
						        	console.log("左下选择")
						        	for(i=rowInit;i<=rowIndex;i++){
						        		for(j=cellInit;j>=cellIndex;j--){				        	
						        			var td = datatable.rows[i].cells[j]; //选中的td
						        			$(td).addClass("hignlight");
							        	}
						       	    }
						        	//计算选中区域边框的width、height
						        	var totalW = 0,totalH = 0;
						        	for(j=rowInit;j<=rowIndex;j++){			
					        			var height = $(datatable.rows[j].cells[cellInit]).outerHeight();
						        		totalH += height;
							        }
					        		for(i=cellInit;i>=cellIndex;i--){
					        			var width = $(datatable.rows[rowInit].cells[i]).outerWidth();
					        			totalW += width;
					        		}
					        		//选中td的宽高
					        		var $tdFirst = $(datatable.rows[rowInit].cells[cellInit]);
						        	var firstWidth = $tdFirst.outerWidth(),
						        	    firstHeight = $tdFirst.outerHeight();
						        	var div = "<div class='border' prame='rowIndex:"+rowIndex+"cellIndex:+"+cellIndex+"'>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+(left-totalW+firstWidth)+"px;top:"+top+"px;' ></div>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+(left-totalW+firstWidth)+"px;top:"+(top+totalH)+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+(left+firstWidth)+"px;top:"+top+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+(left-totalW+firstWidth)+"px;top:"+top+"px;'></div>"
						                +"</div>";
						            var cornerHtml ="<div class='corner' style='left:"+(left-totalW+firstWidth-4)+"px;top:"+(top+totalH-4)+"px;'></div>";
						        }else if(cellIndex>cellInit&&rowIndex<rowInit){ //右上选择
						        	console.log("右上选择") 	
						        	for(i=rowInit;i>=rowIndex;i--){
						        		for(j=cellInit;j<=cellIndex;j++){				        	
						        			var td = datatable.rows[i].cells[j]; //选中的td
						        			$(td).addClass("hignlight");
							        	}
						       	    }
						        	//计算选中区域边框的width、height
						        	var totalW = 0,totalH = 0;
						        	for(j=rowInit;j>=rowIndex;j--){				        	
					        			var height = $(datatable.rows[j].cells[rowInit]).outerHeight();
						        		totalH += height;
							        }
					        		for(i=cellInit;i<=cellIndex;i++){
					        			var width = $(datatable.rows[rowInit].cells[i]).outerWidth();
					        			totalW += width;
					        		}
					        		//选中td的宽高
					        		var $tdFirst = $(datatable.rows[rowInit].cells[cellInit]);
						        	var firstWidth = $tdFirst.outerWidth(),
						        	    firstHeight = $tdFirst.outerHeight();
						        	var div = "<div class='border'>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+left+"px;top:"+(top-totalH+firstHeight)+"px;' ></div>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+left+"px;top:"+(top+firstHeight)+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+left+"px;top:"+(top-totalH+firstHeight)+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+(left+totalW)+"px;top:"+(top-totalH+firstHeight)+"px;'></div>"
						                +"</div>";
						            var cornerHtml ="<div class='corner' style='left:"+(left+totalW-4)+"px;top:"+(top-totalH+firstHeight-2)+"px;'></div>";
						        }else{  //右下选择
						        	console.log("右下选择")
						        	for(i=rowInit;i<=rowIndex;i++){
						        		for(j=cellInit;j<=cellIndex;j++){				        	
						        			var td = datatable.rows[i].cells[j]; //选中的td
						        			$(td).addClass("hignlight");
							        	}
						       	    }
						        	//计算选中区域边框的width、height
						        	var totalW = 0,totalH = 0;
						        	for(j=rowInit;j<=rowIndex;j++){				        	
					        			var height = $(datatable.rows[j].cells[cellInit]).outerHeight();
						        		totalH += height;
							        }
					        		for(i=cellInit;i<=cellIndex;i++){
					        			var width = $(datatable.rows[rowInit].cells[i]).outerWidth();
					        			totalW += width;
					        		}
						        	var div = "<div class='border'>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+left+"px;top:"+top+"px;' ></div>"
						                +"<div style='width:"+totalW+"px;height:1px;left:"+left+"px;top:"+(top+totalH)+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+left+"px;top:"+top+"px;'></div>"
						                +"<div style='width:1px;height:"+(totalH)+"px;left:"+(left+totalW)+"px;top:"+top+"px;'></div>"
						                +"</div>";
						            var cornerHtml ="<div class='corner' style='left:"+(left+totalW-4)+"px;top:"+(top+totalH-4)+"px;'></div>";
						        }
			
						        if($this.hasClass("hignlight")){
						        	$(dataDiv).append(div+cornerHtml);
						        }
						        
						    });
						});
						//点击其他地方，清除
						$(document).on("mouseup.dragChoosed",function(){
							//当鼠标释放时恢复当前表格内容可选中
							$(dataDiv).removeClass("noselect");
							$(headDiv).removeClass("noselect");
							$(datatable).find("td").off("mousemove.dragChoosed");			   
						});
					
				        //单击表头th选中整列
				        $(headtable).on("click","th",function(){
				        	$(".hight").remove();
				        	$(".border").remove();
				        	$(".corner").remove();
				        	$(".hignlight").removeClass("hignlight");
				        	$(".ondown").removeClass("ondown");
				        	var $this = $(this),
				        	    cellInit= this.cellIndex, //获取当前列号								   
			                    left = this.offsetLeft,//获取位置position-letf
			                    top = this.offsetTop,//获取位置position-top
			                    totalH = 0,//初始化选中区域高度
			                    trsLength = datatable.rows.length; //总行数
							//给当前列的第一行添加样式//当前有隐藏栏的情况
							var $firstRow = $(datatable.rows[0]);
							if($firstRow.attr('id')=='hiddenTr'+suffix){
								var $fristTd = $(datatable.rows[1].cells[cellInit]);
							}else{
								var $fristTd = $(datatable.rows[0].cells[cellInit]);
							}
							$fristTd.addClass("ondown");
							var firstW = $fristTd.outerWidth(),	//获取宽度
							    firstH = $fristTd.outerHeight(); //获取高度
							var hignHtml = "<div class='hight'>"
					                +"<div style='width:"+(firstW-1)+"px;height:2px;left:"+left+"px;top:"+top+"px;'></div>"
					                +"<div style='width:"+(firstW-1)+"px;height:2px;left:"+left+"px;top:"+(top+firstH-1)+"px;'></div>"
					                +"<div style='width:2px;height:"+firstH+"px;left:"+left+"px;top:"+top+"px;'></div>"
					                +"<div style='width:2px;height:"+firstH+"px;left:"+(left+firstW-1)+"px;top:"+top+"px;'></div>"
					                +"</div>";
			                
			                for(var i=0;i<trsLength;i++){
			                	var td = datatable.rows[i].cells[cellInit];
			                	$(td).addClass("hignlight"); //给选中区域添加高亮
			                	//计算高度
			                	totalH += $(td).outerHeight();
			                }
			                var borderDiv = "<div class='border'>"
				                +"<div style='width:"+firstW+"px;height:1px;left:"+left+"px;top:"+top+"px;' ></div>"
				                +"<div style='width:"+firstW+"px;height:1px;left:"+left+"px;top:"+(top+totalH)+"px;'></div>"
				                +"<div style='width:1px;height:"+(totalH)+"px;left:"+left+"px;top:"+top+"px;'></div>"
				                +"<div style='width:1px;height:"+(totalH)+"px;left:"+(left+firstW)+"px;top:"+top+"px;'></div>"
				                +"</div>"; 
			                var cornerHtml = "<div class='corner' style='left:"+(left+firstW-4)+"px;top:"+(top+totalH-4)+"px;'></div>"
				            $(dataDiv).append(hignHtml+cornerHtml+borderDiv);
				        })
				    },
				    changeSort:function(){
				    	$("table").on("click","th[data-sort]",function(){
					   	  	if(ismousemoveX){ //解决mouseup和click事件的冲突
						   	   	var dataSort = $(this).attr("data-sort");
						   	   	var dataType = $(this).attr("data-type");
						   	   	$("th[data-sort").attr("data-sort","normal"); 
						   	   	if(dataSort=='normal'){
						   	   	 	$(this).attr("data-sort","asc");
						   	   	 	sort(dataType,"asc");
						   	   	}else if(dataSort=='asc'){
						   	   	 	$(this).attr("data-sort","desc");
						   	   	 	sort(dataType,"desc");
						   	   	}else{
						   	   	 	$(this).attr("data-sort","normal");
						   	   	 	sort(dataType,"normal");
						   	   	}
					   	   	}
					   	});
					   	function sort(dataType,dataSort){
					   	  	$("#sortMethod").val(dataType);
					   	  	$("#sortType").val(dataSort); 
					   	  	$("#querySubmit").click();
					   	}
				   	}
				};	
				//通用样式
				var styleCss= "<style>.noselect{ -moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;}"
			        + ".control div{position:absolute;z-index:10;}.RowResizer{width:100px;height:5px;cursor:row-resize;}"
			        + ".ColumnResizer{width:5px;cursor:col-resize;}.RowResizerGuide{width:100%;border-top:1px dashed #00BFFF;display:none;}"
			        + ".ColumnResizerGuide{height:100%;border-left:1px dashed #00BFFF;display:none;}"
			        + ".RowResizer:hover,.control .ColumnResizer:hover{background:darkgray;}"
			        + "[id^='dataDiv']::-webkit-scrollbar{width: 10px;height: 10px;}"
			        + "[id^='dataDiv']::-webkit-scrollbar-thumb{border-radius: 0;background-color: rgba(0, 0, 0, .3);}"
			        + "[id^='dataDiv']::-webkit-scrollbar-corner, [id^='dataDiv']::-webkit-scrollbar-track{background-color:#b7b7b7;}"
			        + "#"+dataDivId+",#"+headDivId+"{position:relative;}table td.hignlight{background:#fff;}"
			        + ".border div{background:deepskyblue;position:absolute;}"
		            + ".hight div{background:deepskyblue;position:absolute;z-index:10;}"
		            + ".corner{position:absolute;width:5px;height:5px;background:deepskyblue;z-index:11;border:1px solid #fff;cursor: crosshair;}"
		            + ".tableDiv{position:absolute;top:100px;left:100px;}</style>";
				//当table可以拖动改变列宽或行高时添加该html
				var editHtmlY = "<div class='control controlY'>"
				    +"<div class='RowResizer'></div>"
				    +"<div class='RowResizerGuide'></div></div>";
				var editHtmlX = "<div class='control controlX'>"
				    +"<div class='ColumnResizer'></div>"
				    +"<div class='ColumnResizerGuide'></div>"
				    +"</div>";
				var referenceLine = "<div class='ColumnResizerGuide' style='height:100%;position:absolute;z-index:10;'></div><div class='RowResizerGuide'></div>";
				$("head").append(styleCss);
			
			    //参考线
			    setting.isEditX&&$("#"+dataDivId).append(referenceLine);
			    setting.isEditX&&$("#"+headDivId).append(editHtmlX).css("position","relative");
				setting.isEditY&&$("#"+dataDivId).append(editHtmlY).css("position","relative");
				
				//拖动时禁止选中文字	
				(setting.isDragChoosed||setting.isEditX||setting.isEditY)&&$("#"+dataDivId+",#"+headDivId).addClass("noselect");
				
				//根据所传参数执行方法
				setting.isEditX&&_Event.resizeTableX(setting.suffix,setting.isDragChoosed);//是否可以拖动改变列宽
				setting.isEditY&&_Event.resizeTableY(setting.suffix);//是否可以拖动改变行高
				setting.isDragChoosed&&_Event.dragChoosed(setting.suffix);//是否可拖动选中
			    _Event.changeSort(); //单击表头排序
			})
		}
	}
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
	}
})(jQuery);