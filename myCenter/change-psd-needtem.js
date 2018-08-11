mui.init({
	swipeBack:true
});

var inputList;
var changepwdWebview;
mui.plusReady(function(){
	//选出所有input
	inputList = document.querySelectorAll('input[type="password"]');
	changepwdWebview = plus.webview.currentWebview();
	
	document.querySelector('button[type="button"]').addEventListener('tap',function(){
		for (var i = 0;i < inputList.length; i++) {
			if (inputList[i].value.length <= 0) {
				var alertMSG;
				if (i == 0) {
					alertMSG = '请输入旧密码';
				} else if(i == 1){
					alertMSG = '请输入新密码';
				}else if(i == 2 ) {
					alertMSG = '两次输入密码必须一致';
				}
				mui.toast(alertMSG);
				return;
			}
		}
		if (inputList[1].value != inputList[2].value) {
			mui.toast('两次输入密码必须一致');
			return;
		}
		
		//开始执行修改密码联网
		ajax_change_pwd({
			confirm_pwd:inputList[2].value,
			new_pwd:inputList[1].value,
			old_pwd:inputList[0].value
		});
		
		
		
		
	},false);
	
	//为页面添加事件监听hide
	changepwdWebview.addEventListener('hide',function(){
		//将所有的之前输入过的密码全部清空
		mui.each(inputList,function(index,item){
			item.value = '';
		});
	},false);
	
});

//密码修改返回函数
function changePwdSuccess(data){
	if (data.code == '000000') {
		//成功修改
		//删除本地user信息
		//将页面返回显示修改成功需要从新登陆
		localStorage.removeItem('user');
		mui.toast('修改成功，需要重新登录');
		mui.back();
	}
}