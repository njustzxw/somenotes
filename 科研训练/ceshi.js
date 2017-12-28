
var Vm_calendar = new Vue({
	el: '#info_calendar',
	data: {
		head_list: ['全部', '财经事件', '宏观事件', '交易提示', '财务报告'],
		head_choose: 0,
		//日历头部
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		day: new Date().getDate(),
		pull_down_fag: 0,
		yearList: [2014, 2015, 2016, 2017, 2018],
		dayList: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(), //当月天数
		monthList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		weekList: ['一', '二', '三', '四', '五', '六|日'],
		dateList: [], //四个参数：月，日，时间戳，星期
		dateList_ew: [],
		mj_data: '', //财经事件
		macro_data: '', //宏观事件
		trade_tip_info_data: '',
		performance_report_info_data: '',
		clickday:new Date().getDate(),

		popclass: '', //标志
		title: '',
		table_head5: ['股票名称', '股票代码', '停牌时间', '预计复牌日期', '停牌原因', '停牌期限'],
		table_list5: [],
		table_head6: ['股票名称', '股票代码', '复牌时间', '停牌日期', '停牌截止日期', '停牌原因', '停牌期限'],
		table_list6: [],
		table_head78: ['股票名称', '股票代码', '每股收益(元)', '送股比例', '转增股比例', '分红对象'],
		table_list78: [],
		table_head1: ['股票名称', '股票代码', '截止日期', '业绩变动说明', '业绩变动幅度', '预告类型', '上年同期净利润(万元)'],
		table_list1: [],
		table_head23: ['股票名称', '股票代码', '截止日期', '每股收益', '营收', '营收同比', '净利润', '净利润同比', '每股净资产', '净资产收益率'],
		table_list23: [],
		table_head4: ['股票名称', '股票代码', '截止日期', '预约披露起始日', '预约披露截止日', '实际披露时间'],
		table_list4: [],
		pagelist: [],
		pagelist_l: [1, 2, 3, 4, 5],
		page_persent: 0,
		page_persent_per: 1,
		obj1: '', //当前对象
		num: '', //数量
		hgt500: { //弹框高度
			height: '500px'
		},
		hgtauto: { //弹框高度
			height: 'auto'
		},
		s_id: [],
		s_name: {},

		persent_day: '',
		totaldata:[],

	},
	mounted: function() {
		this.$nextTick(function() {
			// 代码保证 this.$el 在 document 中
			this.get_dateList();
			this.chg_moudle();
			this.layoutWeek();
		})
	},
	watch: {
		year: function() {
			this.dayList = new Date(this.year, this.month, 0).getDate();
			this.get_dateList();  //日期布局
			this.chg_moudle(); //请求数据
			this.layoutWeek();
		},
		month: function() {
			this.dayList = new Date(this.year, this.month, 0).getDate();
			this.get_dateList();  //日期布局
			this.chg_moudle(); //请求数据
			this.layoutWeek();
		}
	},
	filters: {
		weekend: function(day) {
			if(day == 0) {
				return "日"
			} else {
				return '六'
			}
		}
	},
	methods: {
		chg_event: function(headindex) {
			var that = this;
			that.head_choose = headindex;
			this.get_dateList();
			that.chg_moudle(); //请求数据
			this.layoutWeek();
		},
		scroll:function(item,obj){
			var that = this;
			that.clickday = item;
			console.log(item,that.clickday)
			var obj = obj.currentTarget;
			var tz_obj=$(obj).parent().parent().parent().parent().find(".sc-month[date='" + item + "']")[that.head_choose];
			var tz_objall=$(obj).parent().parent().parent().parent().find(".sc-month");
			$(tz_objall).removeClass('selectday2');
			$(tz_obj).addClass('selectday2');
			$('html, body').animate({
				scrollTop: $(tz_obj).offset().top - 200
			}, 500);
		},
		layoutWeek:function(){
			$('.day-item').removeAttr("style");
			setTimeout(function(){
				for ( var i = 0; i < $('.weekend').length; i++){
					console.log($('.weekend').eq(i).height())   //父元素的高度
					console.log($($('.weekend').eq(i).children('div').get(0)).height() ) //获取第一个子元的高度
					console.log($($('.weekend').eq(i).children('div').get(1)).height() ) //获取第一个子元的高度
					var par_height = $('.weekend').eq(i).height();    //初始状态
					var child_1_height = $($('.weekend').eq(i).children('div').get(0)).height();//初始状态
					var child_2_height = $($('.weekend').eq(i).children('div').get(1)).height();//初始状态
					
					var last_child_1_height = child_1_height/(child_2_height+child_1_height)*par_height;
					var last_child_2_height = par_height - last_child_1_height;
//					console.log(par_height,last_child_1_height,last_child_2_height);
					$($('.weekend').eq(i).children('div').get(0)).css('height',last_child_1_height+'px')
					$($('.weekend').eq(i).children('div').get(1)).css('height',last_child_2_height+'px')
				}
			},100)
		},
		showmore:function(data,fag){
			if(fag == 0){
				if(data.length>6){
					return true;
				}else{
					return false;
				}
			}
			
		},
		returnToday:function(){
			var that = this;
			that.year = new Date().getFullYear();
			that.month = new Date().getMonth() + 1;
			that.day = new Date().getDate();
			that.clickday = new Date().getDate();
			that.get_dateList();
			that.chg_moudle();
		},
		get_dateList: function() {
			var that = this;
			that.dateList = [];
			var firstDay = that.year + '-' + that.month + '-' + '01';
			var firstdayWeek = new Date(firstDay).getDay(); //第一天星期几
			if(firstdayWeek == 0) {
				firstdayWeek = 7
			}
			for(var i = 1; i < firstdayWeek; i++) { //添加上月数据
				if(that.month == 1) {
					var year = that.year - 1;
					var lastmonth = 12;
				} else {
					var year = that.year;
					var lastmonth = that.month - 1;
				}
				var weekday = new Date(new Date(firstDay).getTime() - ((firstdayWeek - i) * 86400000)).getDay()
				var day = new Date(new Date(firstDay).getTime() - ((firstdayWeek - i) * 86400000)).getDate()
				var timefag = new Date(year + '-' + lastmonth + '-' + day + ',' + '08:00').getTime() / 86400000
				that.dateList.push([lastmonth, day, timefag, weekday])
			}
			for(var j = 1; j <= that.dayList; j++) { //添加本月数据
				if(that.dateList.length < 42) {
					var weekday = new Date(that.year + '-' + that.month + '-' + j + ',' + '08:00').getDay();
					var timefag = new Date(that.year + '-' + that.month + '-' + j + ',' + '08:00').getTime() / 86400000
					that.dateList.push([that.month, j, timefag, weekday]);
				}
			}
			if(that.dateList.length <= 42) { //添加下月数据
				var lastmonthday = 42 - that.dateList.length;
				for(var m = 1; m <= lastmonthday; m++) {
					if(that.month == 12) {
						var nextmonth = 1;
						var year = that.year + 1;
					} else {
						var year = that.year;
						var nextmonth = that.month + 1;
					}
					var weekday = new Date(year + '-' + nextmonth + '-' + m + ',' + '08:00').getDay();
					var timefag = new Date(year + '-' + nextmonth + '-' + m + ',' + '08:00').getTime() / 86400000
					that.dateList.push([nextmonth, m, timefag, weekday])
				}
			}
			that.split_array(that.dateList, 7)
			//			console.log(that.dateList);
		},
		split_array: function(arr, len) { //划分数组
			var that = this;
			var a_len = arr.length;
			var result = [];
			for(var i = 0; i < a_len; i += len) {
				result.push(arr.slice(i, i + len));
			}
			that.dateList = result
			return that.dateList;
		},
		chg_moudle: function() {
			var that = this;
			//			console.log(that.head_choose)
			var year_month = that.year + '-' + that.month; //当前年月
			if(that.head_choose == 0) {
				that.mj_data = '';
				that.macro_data = '';
				that.trade_tip_info_data = '';
				that.performance_report_info_data = '';
				show_loading();
				doRequest_finance_calendar({time: year_month}, function(result) {
//					console.log(result)
					hide_loading();
					that.macro_data = result.data.macro_data; //宏观事件
					that.mj_data = result.data.major_event; //财经事件
					that.performance_report_info_data = result.data.performance_report; //财务报告
					that.trade_tip_info_data = result.data.trade_tip_info; //交易提示
					that.getEvent(3); //根据数字改内容 交易提示
					that.getEvent(4); //根据数字改内容  财务报告
					console.log(that.trade_tip_info_data)
				})
			} else if(that.head_choose == 1) {
				that.mj_data = '';
				show_loading()
				doRequestCalendar_major_event({
					time: year_month
				}, function(result) {
					hide_loading();
					that.mj_data = result.data.major_event;
					console.log(that.mj_data)
				})
			} else if(that.head_choose == 2) {
				that.macro_data = '';
				show_loading()
				doRequestCalendar_macro({
					time: year_month
				}, function(result) {
					hide_loading();
					that.macro_data = result.data.macro_data;
				})
			} else if(that.head_choose == 3) {
				that.trade_tip_info_data = '';
				show_loading();
				doRequest_get_trade_tip_info({
					time: year_month
				}, function(result) {
					hide_loading();
					that.trade_tip_info_data = result.data.trade_tip_info;
					that.getEvent(3); //根据数字改内容
				})
			} else if(that.head_choose == 4) {
				that.performance_report_info_data = '';
				show_loading();
				doRequestCalendar_performance({
					time: year_month
				}, function(result) {
					hide_loading();
					that.performance_report_info_data = result.data.performance_report_info;
					that.getEvent(4); //根据数字改内容
				})
			}
		},
		line: function(L) {
			var week_height = $(".day-item[ii=6]").height() + $(".day-item[ii=7]").height(); //计算周末高度
			console.log($(".day-item[ii=6]").height())
		},
		ent: function(yf, xq, list, obj) { //参数分别是月份，星期，内容列表，对象，
			var obj = obj.currentTarget;
			var that = this;
			if(yf == that.month && list != null) { //当前月份
				$(".box_event").empty();
				var W = $(obj).width() //弹框定位
				var H = $(obj).height()
				var L = $("#calendar").offset().left
				var T = $("#calendar").offset().top
				var left = 0;
				var top = 0;
				if(xq == 6 || xq == 7) {
					$('#blockdiv').css('width', '300px')
					left = $(obj).offset().left - L - 300;
					top = $(obj).offset().top - T + 0.66 * H;
				} else {
					left = $(obj).offset().left - L + W;
					top = $(obj).offset().top - T + 0.66 * H
				}
				var content = '';
				for(var i = 0; i < list.length; i++) {
					content = content + '<li>' + list[i] + '<li>'
				}
				$(".box_event").append("" + content + "");
				$(".box_event li").css('display', 'block')
				that.ShowInfo(left, top)
			}
		},
		ShowInfo: function(left, top) { //弹出框
			$("#blockdiv").addClass('show').removeClass('hidden')
			$("#blockdiv").css({
				"left": left + 'px',
				"top": top + 'px'
			});
		},
		HiddenInfo: function() { //隐藏框
			$("#blockdiv").addClass('hidden').removeClass('show')
		},
		getEvent: function(fag) { //改内容
			var that = this;
			if(fag == 3) {
				var data = that.trade_tip_info_data
			} else {
				var data = that.performance_report_info_data
			}
			for(item in data) {
				//				console.log(that.trade_tip_info_data[item])
				for(var i = 0; i < data[item].length; i++) {
					//					console.log(data[item][i])
					if(data[item][i][1] == 1) {
						var con = '';
					} else {
						var con = '等' + data[item][i][1] + '家';
					}
					var fag;
					switch(data[item][i][0]) {
						case 1:
							fag = "发布业绩预告";
							break;
						case 2:
							fag = "发布业绩报表";
							break;
						case 3:
							fag = "发布业绩快报";
							break;
						case 4:
							fag = "发布业绩披露";
							break;
						case 5:
							fag = "停牌";
							break;
						case 6:
							fag = "复牌";
							break;
						case 7:
							fag = "分红转增股权登记日";
							break;
						case 8:
							fag = "分红转增除权除息日";
							break;
					}
					data[item][i].push(con + fag)
					var name = get_stock_name(js_zfill(data[item][i][2]))
					data[item][i].push(name)

				}
			}
			console.log(data)
		},
		getEvent1: function(fag, num, more) { //弹框部分内容
			console.log(fag, num, more)
			if(more == 1) {
				var con = num > 1 ? '等' + num + '家' : '';
			} else {
				var con = num + '家';
			}
			switch(fag) {
				case 1:
					fag = "发布业绩预告";
					break;
				case 2:
					fag = "发布业绩报表";
					break;
				case 3:
					fag = "发布业绩快报";
					break;
				case 4:
					fag = "发布业绩披露";
					break;
				case 5:
					fag = "停牌";
					break;
				case 6:
					fag = "复牌";
					break;
				case 7:
					fag = "分红转增股权登记日";
					break;
				case 8:
					fag = "分红转增除权除息日";
					break;
			}
			return con + fag;
		},
		change_page_style: function(index, fag) {
			var that = this;
			that.page_persent = index;
			if(fag == 1) { //超过5页的情况
				if(index >= 2 && index < that.pagelist.length - 2) {
					that.pagelist_l = that.pagelist.slice(index - 2, index + 3);
				}
			}
			that.popbox(that.persent_day, that.popclass, that.num, that.page_persent, false);
		},
		tz: function(fag) { //跳转
			var that = this;
			if(fag == 1) { //跳转首页   
				that.pagelist_l = [1, 2, 3, 4, 5]
				that.page_persent = 0;
			} else if(fag == 2) { //跳转末页 
				that.pagelist_l = that.pagelist.slice(-5);
				that.page_persent = that.pagelist.length - 1;
			} else if(fag == 3) { //跳转指定页 
				that.page_persent = that.page_persent_per - 1;
				if(that.page_persent <= 1) {
					that.pagelist_l = [1, 2, 3, 4, 5];
				} else if(that.page_persent >= that.pagelist.length - 2) {
					that.pagelist_l = that.pagelist.slice(-5);
				} else {
					that.pagelist_l = that.pagelist.slice(that.page_persent - 2, that.page_persent + 3)
				}
			}
			that.popbox(that.persent_day, that.popclass, that.num, that.page_persent, false);
		},
		fy: function(num) {
			var that = this;
			that.pagelist = []; //分页
			if(num > 20) {
				$('#box_body').css('height', '500px')
				var pagenum = Math.ceil(num / 20);
				var i = 1;
				while(i <= pagenum) {
					that.pagelist.push(i);
					i++;
				}
			}
		},
		get_s_name: function(list, final_data, lx) { //找股票名称
			var that = this;
			doRequest_get_code_name({
				code_list: JSON.stringify(that.s_id)
			}, function(result) {
				for(var j = 0; j < result.data.name.length; j++) {
					that.s_name = $.extend(that.s_name, result.data.name[j])
				}
				for(var i = 0; i < list.length; i++) {
					if(lx < 5) {
						list[i].name = that.s_name[js_zfill(final_data[i].SecuCode)]
					} else {
						list[i].name = that.s_name[js_zfill(final_data[i][0])]
					}
				}
			})
		},
		popbox: function(day, data, num, page, fag) { //data是类型12345678  num是数量  day是几号   弹框
			var that = this;
			that.persent_day = day;
			var year_month_day = that.year + '-' + that.month + '-' + day;
			var weekday = new Date(year_month_day).getDay();
			if(fag) {
				that.num = num;
				that.popclass = data;
			}
			switch(weekday) {
				case 1:
					weekday = '一';
					break;
				case 2:
					weekday = '二';
					break;
				case 3:
					weekday = '三';
					break;
				case 4:
					weekday = '四';
					break;
				case 5:
					weekday = '五';
					break;
				case 6:
					weekday = '六';
					break;
				case 0:
					weekday = '日';
					break;
			}
			if(data == 1) { //业绩预告
				that.table_list1 = [];
				doRequest_get_performance_forecast_info({
					time: year_month_day,
					page: page
				}, function(result) {
					if(result.error == 0) {
						var final_data = result.data.performance_forecast_info;
						that.s_name = []
						that.s_id = []
						that.title = that.year + '年' + that.month + '月' + day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
						for(var i = 0; i < final_data.length; i++) {
							if(that.s_id.indexOf(js_zfill(final_data[i].SecuCode)) > -1) {} else {
								that.s_id.push(js_zfill(final_data[i].SecuCode));
							}
							that.table_list1.push({
								name: "",
								id: js_zfill(final_data[i].SecuCode),
								ggdate: formatDate((new Date(final_data[i].EndDate * 86400 * 1000)), true, true, true),
								yjbdsm: final_data[i].ForecastContent,
								yjbdfdfag: final_data[i].EGrowthRateFloor,
								yjbdfd: final_data[i].EGrowthRateFloor + '%~' + final_data[i].EGrowthRateCeil + '%',
								yglx: final_data[i].ForecastType,
								jlr: final_data[i].NetProfit,
							})
						}
						that.get_s_name(that.table_list1, final_data, data);
						that.fy(num) //分页
					}
				})
			} else if(data == 2) { //业绩报表
				that.table_list23 = [];
				doRequest_get_performance_report_info({
					time: year_month_day,
					page: page
				}, function(result) {
					if(result.error == 0) {
						//						console.log(result)
						that.title = that.year + '年' + that.month + '月' + day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
						var final_data = result.data.performance_report_info;
						that.s_name = []
						that.s_id = []
						for(var i = 0; i < final_data.length; i++) {
							if(that.s_id.indexOf(js_zfill(final_data[i].SecuCode)) > -1) {} else {
								that.s_id.push(js_zfill(final_data[i].SecuCode));
							}
							that.table_list23.push({
								name: "",
								id: js_zfill(final_data[i].SecuCode),
								mgsy: final_data[i].EPS != null ? final_data[i].EPS.toFixed(4) : '--',
								ys: final_data[i].OperatingRevenue != null ? (final_data[i].OperatingRevenue / 100000000).toFixed(4) : '--',
								ystb: final_data[i].OperatingRevenueGrowRate,
								yshb: final_data[i].OperatingRevenueMOM,
								jlr: final_data[i].NetProfit != null ? (final_data[i].NetProfit / 100000000).toFixed(4) : '--',
								jlrtb: final_data[i].NetProfitGrowRate,
								yshbjd: final_data[i].OperatingRevenueMOM,
								mgjzc: final_data[i].NAPS,
								jzcsyl: final_data[i].ROE,
								ggdate: formatDate((new Date(final_data[i].EndDate * 86400 * 1000)), true, true, true),
								jlrhbjd: final_data[i].NetProfitMOM,
							})
						}
						that.get_s_name(that.table_list23, final_data, data);
						that.fy(num) //分页
					}
				})
				//									console.lo g(that.s_id)
			} else if(data == 3) { //业绩快报
				that.table_list23 = [];
				doRequest_get_performance_letter_info({
					time: year_month_day,
					page: page
				}, function(result) {
					that.title = that.year + '年' + that.month + '月' + that.day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
					var final_data = result.data.performance_letter_info;
					that.s_name = []
					that.s_id = []
					//					console.log(final_data)
					for(var i = 0; i < final_data.length; i++) {
						//						console.log(get_stock_name(js_zfill(final_data[i].SecuCode)))
						if(that.s_id.indexOf(js_zfill(final_data[i].SecuCode)) > -1) {} else {
							that.s_id.push(js_zfill(final_data[i].SecuCode));
						}
						that.table_list23.push({
							name: "",
							id: js_zfill(final_data[i].SecuCode),
							mgsy: final_data[i].BasicEPS.toFixed(4),
							ys: final_data[i].OperatingRevenue != null ? (final_data[i].OperatingRevenue / 100000000).toFixed(4) : '--',
							ystb: final_data[i].OperatingRevenueYOY,
							//							yshb: final_data[i].OperatingRevenueMOM*100,
							jlr: final_data[i].NPParentCompanyOwners != null ? (final_data[i].NPParentCompanyOwners / 100000000).toFixed(4) : '--',
							jlrtb: final_data[i].NPParentCompanyOwnersYOY,
							//							jlrhbjd: final_data[i].NPParentCompanyOwnersMOM*100,
							mgjzc: final_data[i].NetAssetPS,
							jzcsyl: final_data[i].ROE,
							ggdate: formatDate((new Date(final_data[i].EndDate * 86400 * 1000)), true, true, true),

						})
					}
					that.get_s_name(that.table_list23, final_data, data);
					that.fy(num) //分页
				})
			} else if(data == 4) { //业绩披露
				that.table_list4 = [];
				doRequest_get_performance_expose_info({
					time: year_month_day,
					page: page
				}, function(result) {
					console.log(result)
					that.title = that.year + '年' + that.month + '月' + day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
					var final_data = result.data.performance_expose_info;
					that.s_name = []
					that.s_id = []
					//					console.log(final_data)
					for(var i = 0; i < final_data.length; i++) {
						if(that.s_id.indexOf(js_zfill(final_data[i].SecuCode)) > -1) {} else {
							that.s_id.push(js_zfill(final_data[i].SecuCode));
						}
						that.table_list4.push({
							name: "",
							id: js_zfill(final_data[i].SecuCode),
							starttime: formatDate((new Date(final_data[i].NoticeStartDate * 86400 * 1000)), true, true, true),
							endtime: formatDate((new Date(final_data[i].NoticeEndDate * 86400 * 1000)), true, true, true),
							actuallytime: final_data[i].ActualDate != 0 ? formatDate((new Date(final_data[i].ActualDate * 86400 * 1000)), true, true, true) : '未披露',
							ggdate: formatDate((new Date(final_data[i].EndDate * 86400 * 1000)), true, true, true),
						})
					}
					that.get_s_name(that.table_list4, final_data, data);
					that.fy(num) //分页
				})
			} else if(data == 5) { //停牌信息
				that.table_list5 = [];
				doRequest_get_halt_info({
					time: year_month_day,
					page: page
				}, function(result) {
					that.title = that.year + '年' + that.month + '月' + day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
					//					console.log(result);
					var final_data = result.data.halt_info;
					that.s_name = []
					that.s_id = []
					for(var i = 0; i < final_data.length; i++) {
						if(that.s_id.indexOf(js_zfill(final_data[i][0])) > -1) {} else {
							that.s_id.push(js_zfill(final_data[i][0]));
						}
						that.table_list5.push({
							name: "",
							id: js_zfill(final_data[i][0]),
							halt_time: final_data[i][1],
							resumption_time: final_data[i][2],
							halt_reason: final_data[i][3],
							halt_term: final_data[i][4],
						})
					}
					that.get_s_name(that.table_list5, final_data, data);
					that.fy(num) //分页
				})
			} else if(data == 6) { //复牌信息
				that.table_list6 = [];
				doRequest_get_resumption_info({
					time: year_month_day,
					page: page
				}, function(result) {
					that.title = that.year + '年' + that.month + '月' + day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
					console.log(result);
					var final_data = result.data.resumption_info;
					that.s_name = []
					that.s_id = []
					for(var i = 0; i < final_data.length; i++) {
						if(that.s_id.indexOf(js_zfill(final_data[i][0])) > -1) {} else {
							that.s_id.push(js_zfill(final_data[i][0]));
						}
						that.table_list6.push({
							name: "",
							id: js_zfill(final_data[i][0]),
							fp_time: final_data[i][1],
							tp_time: final_data[i][2],
							tpjz_time: final_data[i][3],
							halt_reason: final_data[i][4],
							halt_term: final_data[i][5],
						})
					}
					that.get_s_name(that.table_list6, final_data, data);
					that.fy(num) //分页
				})
			} else if(data == 7) { //分红转增股权登记日信息
				that.table_list78 = [];
				doRequest_get_right_reg_date_info({
					time: year_month_day,
					page: page
				}, function(result) {
					that.title = that.year + '年' + that.month + '月' + day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
					var final_data = result.data.right_reg_date_info;
					that.s_name = []
					that.s_id = []
					for(var i = 0; i < final_data.length; i++) {
						if(that.s_id.indexOf(js_zfill(final_data[i][0])) > -1) {} else {
							that.s_id.push(js_zfill(final_data[i][0]));
						}
						that.table_list78.push({
							name: "",
							id: js_zfill(final_data[i][0]),
							profit_per: final_data[i][1],
							s_percent: final_data[i][2],
							z_percent: final_data[i][3],
							fh_obj: final_data[i][5],
						})
					}
					that.get_s_name(that.table_list78, final_data, data);
					that.fy(num) //分页
				})
			} else if(data == 8) { //分红转增股权除权除息日信息
				that.table_list78 = [];
				doRequest_get_ex_divi_date_info({
					time: year_month_day,
					page: page
				}, function(result) {
					that.title = that.year + '年' + that.month + '月' + day + '日' + '星期' + weekday + that.getEvent1(data, num, 0)
					var final_data = result.data.ex_divi_date_info;
					that.s_name = []
					that.s_id = []
					for(var i = 0; i < final_data.length; i++) {
						if(that.s_id.indexOf(js_zfill(final_data[i][0])) > -1) {} else {
							that.s_id.push(js_zfill(final_data[i][0]));
						}
						that.table_list78.push({
							name: "",
							id: js_zfill(final_data[i][0]),
							profit_per: final_data[i][1],
							s_percent: final_data[i][2],
							z_percent: final_data[i][3],
							fh_obj: final_data[i][5],
						})
					}
					that.get_s_name(that.table_list78, final_data, data);
					that.fy(num) //分页
				})
			}
			if(fag) {
				that.page_persent = 0;
				that.page_persent_per = 1;
				modal_msg_top('popbox_event', 'popbox_event_msg');
				that.pagelist = []
				that.pagelist_l = [1, 2, 3, 4, 5]
			} else {
				return;
			}
		}
	}

})