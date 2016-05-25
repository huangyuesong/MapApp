window.onload = function(){
	var site = JSON.parse(window.localStorage.site);

	if (!site.new) {
		document.getElementById('identity-no').value = site.identityNo;
		document.getElementById('name').value = site.name;
		document.getElementById('type-id').value = site.typeId;
		document.getElementById('area').value = site.area;
		document.getElementById('power-id').value = site.powerId;
		document.getElementById('power-price').value = site.powerPrice;
		document.getElementById('latitude').value = site.latitude;
		document.getElementById('longitude').value = site.longitude;
		document.getElementById('wall-info').value = site.wallInfo;
		document.getElementById('use-date').value = site.useDate.substring(0, 10);
		document.getElementById('carrier-count').value = site.carrierCount;
		document.getElementById('is-flag').selectedIndex = Number(site.isFlag);
	}

	setLocation(site.city);

	document.getElementById('go-back').addEventListener('click', function(evt){
		location.href = '/manager/site';
	});

	document.getElementById('save').addEventListener('click', function(evt){
		site.new ? newSite() : saveSite();
	});

	document.getElementById('delete').addEventListener('click', function(evt){
		deleteSite();
	});
};

function newSite(){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/insertSite',
		type : 'POST',
		data: {
			city: document.getElementById('location').value,
			identityNo: document.getElementById('identity-no').value,
			name: document.getElementById('name').value,
			typeId: document.getElementById('type-id').value,
			area: document.getElementById('area').value,
			powerId: document.getElementById('power-id').value,
			powerPrice: document.getElementById('power-price').value,
			latitude: document.getElementById('latitude').value,
			longitude: document.getElementById('longitude').value,
			wallInfo: document.getElementById('wall-info').value,
			useDate: document.getElementById('use-date').value,
			carrierCount: document.getElementById('carrier-count').value,
			isFlag: document.getElementById('is-flag').selectedIndex,
		},
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText);

			if (jsonData.success) {
				alert('新建成功');
			} else {
				alert(jsonData.errors)
			}
		},
		fail : function(status){
			alert(status);
			var popText = '出现未知错误，请联系管理员';
			openPop(popText);
		}
	});
}

function saveSite(){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/updateSite',
		type : 'POST',
		data: {
			id: JSON.parse(window.localStorage.site).id,
			city: document.getElementById('location').value,
			identityNo: document.getElementById('identity-no').value,
			name: document.getElementById('name').value,
			typeId: document.getElementById('type-id').value,
			area: document.getElementById('area').value,
			powerId: document.getElementById('power-id').value,
			powerPrice: document.getElementById('power-price').value,
			latitude: document.getElementById('latitude').value,
			longitude: document.getElementById('longitude').value,
			wallInfo: document.getElementById('wall-info').value,
			useDate: document.getElementById('use-date').value,
			carrierCount: document.getElementById('carrier-count').value,
			isFlag: document.getElementById('is-flag').selectedIndex,
		},
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText);

			if (jsonData.success) {
				alert('修改成功');
			} else {
				alert(jsonData.errors)
			}
		},
		fail : function(status){
			alert(status);
			var popText = '出现未知错误，请联系管理员';
			openPop(popText);
		}
	});
}

function deleteSite(){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/deleteSite',
		type : 'POST',
		data: {
			siteId: JSON.parse(window.localStorage.site).id,
		},
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText);

			if (jsonData.success) {
				alert('删除成功');
				location.href = '/manager/site';
			} else {
				alert(jsonData.errors)
			}
		},
		fail : function(status){
			alert(status);
			var popText = '出现未知错误，请联系管理员';
			openPop(popText);
		}
	});
}

function setLocation(location){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/getDistrictList',
		type : 'GET',
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText);

			jsonData.districts.map(function(_district, idx){
				var option = document.createElement('option'),
				select = document.getElementById('location');
				option.value = _district.province.concat(_district.city).concat(_district.county);
				option.innerText = _district.province.concat(_district.city).concat(_district.county);
				select.appendChild(option);

				if (location === option.innerText) {
					select.selectedIndex = idx;
				}
			});
		},
		fail : function(status){
			alert(status);
			var popText = '出现未知错误，请联系管理员';
			openPop(popText);
		}
	});
}