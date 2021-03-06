var currentWebview;
var type = 0; // -1 == 全部， -2 == 待付款， -3 == 待发货， -4 == 待收货， -5 == 已完成, 默认为-1
var pageNo = 1;
var pageNoOld;
var pageSize = 20;
var loadFlag = 1; // 上拉加载标志
var _LoadNumber={};
mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();

	//获取退款列表
	getRefundLogList();

	// 绑定事件
	bindEvent();
});

function bindEvent() {
	// 屏幕滚动后加载列表
	$("#scroll").scroll(function() {
		var scrollTop = $(this).scrollTop(); // 滚动高度		    
		var scrollHeight = $(this).height(); // 文档高度
		var windowHeight = $(window).height(); // 文档窗口高度

		if (scrollTop + windowHeight >= scrollHeight - 300) {
			if (loadFlag == 1) {
				loadFlag = 0;
				console.log("pageNo:" + pageNo);
				getRefundLogList();
			}
		}

	});


	/**
	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();	// 滚动高度		    
		var scrollHeight = $(document).height(); // 文档高度
		var windowHeight = $(window).height(); // 文档窗口高度
			
		if (scrollTop + windowHeight >= scrollHeight - 300) {
			if(loadFlag == 1){
				loadFlag == 0;
				console.log("aaaa");
				getRefundLogList();
			}
		}

	});
	**/
	window.addEventListener('editData', function(event) {
		var data = event.detail;
		var type = parseInt(data["type"]);
		if (type == 0) {
			$("#orderListID").html("");
			pageNo = data["pageNo"];
			getRefundLogList();
		} else if (type == 1) {


		}
	}, false);
};

/**
 * 获取退款列表
 * @author xuezhenxiang
 */
function getRefundLogList() {
	$("#top2").show();
	var userId = localStorage.getItem(userId);
	var formData = new FormData();
	formData.append("strBuyerId", userId);
	pageNoOld = pageNo;
	formData.append("pageNo", pageNo);
	formData.append("pageSize", pageSize);
	$.ajax({
		url: prefix + "/refund/list",
		type: 'POST',
		data: formData,
		contentType: false,
		processData: false,
		dataType: "json",
		success: function(res) {
			// 打印请求报错日志
			ajaxLog(res);

			if (res.resCode == 0) {
				var list = res.result.list; // 列表数据
				var count = res.result.count; // 数据总量
				$("#top2").hide();
				//$("#top2").hide();
				if (count == 0) {
					$("#orderNullTemp").show();
					return false;
				} else {
					$("#orderNullTemp").hide();
				}

				if (list.length <= 0) {
					return false;
				}

				for (var i = 0, len = list.length; i < len; i++) {
					var item = list[i];
					var strStateName = item.strStateName
					var id = item.id; //退款ID
					var order = item.mallOrder;
					if (!order) {
						continue;
					}
					var lOrderId = order.id; // 订单id
					var orderListTemp = $("#orderListTemp").html();
					orderListTemp = orderListTemp.replace("#refundStateName#", strStateName);
					orderListTemp = orderListTemp.replace("#id#", id);
					var orderList = $(orderListTemp);

					;(function(orderList, item) {
						orderList.find(".go-to-detail").on("click", function() {
							pushWebView({
								webType: 'newWebview_First',
								id: 'appOrder/afterSaleDetail.html',
								href: 'appOrder/afterSaleDetail.html',
								aniShow: getaniShow(),
								title: "退款详情",
								isBars: false,
								barsIcon: '',
								extendOptions: {
									refundItem: item,
									"pageNo": pageNoOld
								}
							});

						});
					})(orderList, item);
					var mallOrderDetailList = order.mallOrderDetailList;
					for (var i1 = 0, len1 = mallOrderDetailList.length; i1 < len1; i1++) {
						var itemGoods = mallOrderDetailList[i1];
						var id = itemGoods.id;
						var strGoodsName = itemGoods.strSkuName;
						var strGoodsImg = itemGoods.strGoodsImg;
						var strGoodsSKUDetail = itemGoods.strSkuAttr;
						var skuPrice = itemGoods.skuPrice;
						var count = itemGoods.count;
						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsTitle#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#strGoodsSKUDetail#", commonNameSubstr(strGoodsSKUDetail, 28));
						goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
						goodsTemplate = goodsTemplate.replace("#count#", count);

						var goods = $(goodsTemplate);
						orderList.find(".goods-list").append(goods);
					}

					$("#orderListID").append(orderList);

				}
				pageNo++;
				loadFlag = 1;
				_LoadNumber.a = true;
			}
		}
	})
};


//下拉刷新
function PullRefresh(id, callback) {
	var Tween = {
		Linear: function(t, b, c, d) {
			return c * t / d + b;
		},
		Quad: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t + b;
			},
			easeOut: function(t, b, c, d) {
				return -c * (t /= d) * (t - 2) + b;
			},
			easeInOut: function(t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t + b;
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		},
		Cubic: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t * t + b;
			},
			easeOut: function(t, b, c, d) {
				return c * ((t = t / d - 1) * t * t + 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t + 2) + b;
			}
		},
		Quart: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t * t * t + b;
			},
			easeOut: function(t, b, c, d) {
				return -c * ((t = t / d - 1) * t * t * t - 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
			}
		},
		Quint: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t * t * t * t + b;
			},
			easeOut: function(t, b, c, d) {
				return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
			}
		},
		Sine: {
			easeIn: function(t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			},
			easeOut: function(t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			},
			easeInOut: function(t, b, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			}
		},
		Expo: {
			easeIn: function(t, b, c, d) {
				return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
			},
			easeOut: function(t, b, c, d) {
				return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if (t == 0) return b;
				if (t == d) return b + c;
				if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
			}
		},
		Circ: {
			easeIn: function(t, b, c, d) {
				return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
			},
			easeOut: function(t, b, c, d) {
				return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
			},
			easeInOut: function(t, b, c, d) {
				if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
			}
		},
		Elastic: {
			easeIn: function(t, b, c, d, a, p) {
				if (t == 0) return b;
				if ((t /= d) == 1) return b + c;
				if (!p) p = d * .3;
				if (!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			},
			easeOut: function(t, b, c, d, a, p) {
				if (t == 0) return b;
				if ((t /= d) == 1) return b + c;
				if (!p) p = d * .3;
				if (!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
			},
			easeInOut: function(t, b, c, d, a, p) {
				if (t == 0) return b;
				if ((t /= d / 2) == 2) return b + c;
				if (!p) p = d * (.3 * 1.5);
				if (!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
			}
		},
		Back: {
			easeIn: function(t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * (t /= d) * t * ((s + 1) * t - s) + b;
			},
			easeOut: function(t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			},
			easeInOut: function(t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
				return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
			}
		},
		Bounce: {
			easeIn: function(t, b, c, d) {
				return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
			},
			easeOut: function(t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
				}
			},
			easeInOut: function(t, b, c, d) {
				if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
				else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
			}
		}
	}

	function xround(x, num) {
		return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
	}
	var scrollElement = document.getElementById(id);
	/**1滚动条状态，3touch接管状态 */
	var topState = 1;
	//var isTop = false;
	var startClientY = 0;
	var prevMoveY = 0;
	var refreshHeight = 44;
	var isRefres = false;
	//刷新状态1正常，2松手刷新，3刷新中
	var refresState = 1;
	//移动距离
	var distance = 0;
	scrollElement.addEventListener('scroll', function(event) {
		//console.log(event);

	}, false);
	scrollElement.addEventListener('touchstart', function(event) {
		var touch = event.targetTouches[0];
		startClientY = xround(touch.clientY, 2);
		prevMoveY = startClientY;
	}, false);
	var touchmove = function(event) {
		var touch = event.targetTouches[0];
		var clientY = xround(touch.clientY, 2);
		var direction = 'down';
		if (prevMoveY > clientY) {
			direction = 'up'
		}
		console.log("topState：" + topState + ",scroll:+" + $("#scroll").scrollTop() + "direction:" + direction);
		//触碰到下滑临界值
		if (topState === 1 && $("#scroll").scrollTop() <= 0 && direction == 'down') {
			event.preventDefault();
			startClientY = clientY;
			topState = 3;
			console.log('到顶了', event)
			return;
		}
		console.log("bbbb");
		if (topState == 3) {
			if (window.swiper && window.swiper.autoplaying == true) {
				window.swiper.stopAutoplay();
			}
			if (direction == 'down') {
				event.preventDefault();
				distance = (clientY - startClientY) / 2 - refreshHeight;
				setState(distance);
				scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
				scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			} else {
				distance = clientY - startClientY - refreshHeight;
				if (distance > -refreshHeight) {
					event.preventDefault();
					distance = (clientY - startClientY) / 2 - refreshHeight;
					setState(distance);
					scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
					scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
				} else {
					topState = 1;
					setState(-refreshHeight)
					scrollElement.style.webkitTransform = 'translate3d(0,' + -refreshHeight + 'px,0)';
					scrollElement.style.transform = 'translate3d(0,' + -refreshHeight + 'px,0)';
				}
			}

		}
		prevMoveY = clientY;
	}

	function setState(distance) {
		if (refresState != 2 && distance >= 0) {
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'block';
			refresState = 2;
		}
		if (refresState != 1 && distance < 0) {
			refresState = 1;
			document.getElementById('top1').style.display = 'block';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'none';
		}
	}
	scrollElement.addEventListener('touchmove', touchmove, false);
	var touchend = function(event) {
		scrollElement.removeEventListener('touchmove', touchmove, false);
		scrollElement.removeEventListener('touchend', touchend, false);
		var touch = event.targetTouches[0];
		if (refresState == 2) {
			refresState = 3;
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'block';
			document.getElementById('top3').style.display = 'none';
			an(0);
			_LoadNumber = {
				a: false
			};
			_isPullRefresh = true;
			var loadNumberTimeId = setInterval(function() {
				if (_LoadNumber.a) {
					_isPullRefresh = false;
					refresState = 1;
					an(-refreshHeight);
					clearInterval(loadNumberTimeId);
				}
			}, 1000);
			// 请求接口数据
			callback();
		} else {

			if (topState == 3) {
				an(-refreshHeight);
			} else {
				scrollElement.addEventListener('touchmove', touchmove, false);
				scrollElement.addEventListener('touchend', touchend, false);
			}
		}
		topState = 1;
	}
	scrollElement.addEventListener('touchend', touchend, false);
	scrollElement.addEventListener('touchcancel', touchend, false);


	var an = function(position) {
		position = +position;
		var tdistance = +distance
		var start = 0,
			during = 35;
		var _run = function() {
			start++;
			distance = Tween.Cubic.easeOut(start, tdistance, position - tdistance, during);
			scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
			scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			if (start < during) {
				requestAnimationFrame(_run);
			} else {
				if (refresState !== 3) {
					scrollElement.addEventListener('touchmove', touchmove, false);
					scrollElement.addEventListener('touchend', touchend, false);
				} else {}
				if (position == (-refreshHeight)) {
					document.getElementById('top1').style.display = 'block';
					document.getElementById('top2').style.display = 'none';
					document.getElementById('top3').style.display = 'none';
				}

				topState = 1;
			}
		};
		_run();
	}
}
//下拉刷新调用
PullRefresh('scroll', function() {
	pageNo = 1;
	loadFlag = 1;
	$("#orderListID").html("");
	$("#load").hide();
	// 获取数据
	getRefundLogList();
});
