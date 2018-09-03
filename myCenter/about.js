mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	// 获取关于我们内容
	getContent();
	
	// parentWebView = plus.webview.currentWebview().parent();
	// touxiangimg = document.getElementById('touxiangimg');
	// logoutBtn = document.getElementById('logoutBtn');
	// trueimg = document.getElementById('trueimg');
	// touxiangword = document.getElementById('touxiangword');
	// //检测是否已经登录
	// trueimg.style.display = 'none';
	// logoutBtn.style.display = 'none'
	// touxiangimg.style.display = 'inline'
	// touxiangword.style.color = 'indianred'
	
	// //点击头像事件
	// addHeadevent();
	// //接收登录成功事件
	// window.addEventListener('loginSuccess', function() {
	// 	//登出按钮显示出来 头像图片显示出来名字显示出来
	// 	logoutBtn.style.display = 'block';
	// 	touxiangimg.style.display = 'none';
	// 	trueimg.style.display = 'inline';
	// 	touxiangword.innerText = "测试号";
	// 	touxiangword.style.color = 'black';
	// }, false);
	// logoutBtn.addEventListener('tap', function() {
	// 	var btnArray = ['否', '是'];
	// 	mui.confirm('确认要退出登录吗？', 'Hello MUI', btnArray, function(e) {
	// 		if (e.index == 1) {
	// 			//确定
	// 			trueimg.style.display = 'none';
	// 			logoutBtn.style.display = 'none';
	// 			touxiangimg.style.display = 'inline';
	// 			touxiangword.style.color = 'indianred';
	// 			localStorage.removeItem('user');
	// 			mui.toast("退出登录")
	// 			//发出退出登录给wishlish和cart页面
	// 			var cartwebview = plus.webview.getWebviewById('appCart/cart.html');
	// 			var xinyuandanwebview = plus.webview.getWebviewById('mallTicket/ticket.html');
	// 			mui.fire(cartwebview,'logout',{});
	// 			mui.fire(xinyuandanwebview,'logout',{})
	// 		} else {
	// 			//取消
	// 		}
	// 	});
	// }, false)
})


//注册列表的点击事件
function getContent() {
	$.ajax({
		url: prefix + "/sys/getSysValue/1",
		type: 'GET',
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				$("#container").html(res.result);
			}
		}
	});
}

