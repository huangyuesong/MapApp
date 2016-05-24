window.onload = function(){
	// 清空本地缓存
	localStorage.clear();
	// 为登录按钮添加监听事件
	var loginBtn = document.getElementById('login-btn');
	loginBtn.addEventListener("click",login); 
	// 监听事件
	function login(){
		var userName = document.getElementById('user-name').value,
			userPassword = document.getElementById('user-password').value;

		if( '' === userName || '' === userPassword){
			alert("用户名或密码不能为空");
		}else{
			ajax({
				url : 'http://127.0.0.1:8080/EnergySystem/mobileLoginIn',
				type : 'POST',
				data : {username : userName , password : userPassword},
				success : function(responseText, responsexml){
					var jsonData = JSON.parse(responseText);
        			if(false === jsonData.success){
        				openPop(jsonData.errors);
        			}else{
        				window.localStorage.cId = JSON.stringify(jsonData.cId);
        				window.localStorage.companyLevel = JSON.stringify(jsonData.companyLevel);
        				window.localStorage.dataPlace = jsonData.dataPlace;
        				
        				if (jsonData.isAdministrator) {
        					location.href = '/manager/site';
        				} else {
	        				location.href = '/map';
        				}
        			}
				},
				fail : function(status){
					alert(status);
					var popText = '出现未知错误，请联系管理员';
					openPop(popText);
				}
			});
		}	
	}
}