window.onload = function(){
	var macRoom = JSON.parse(window.localStorage.macRoom);

	if (!macRoom.new) {
		document.getElementById('identity-no').value = macRoom.identityNo;
		document.getElementById('name').value = macRoom.name;
		document.getElementById('type-id').value = macRoom.typeId;
		document.getElementById('area').value = macRoom.area;
		document.getElementById('power-id').value = macRoom.powerId;
		document.getElementById('power-price').value = macRoom.powerPrice;
		document.getElementById('latitude').value = macRoom.latitude;
		document.getElementById('longitude').value = macRoom.longitude;
		document.getElementById('floor').value = macRoom.floor;
		document.getElementById('floor-height').value = macRoom.floorHeight;
		document.getElementById('device-percent').value = macRoom.devicePercent;
		document.getElementById('is-flag').selectedIndex = Number(macRoom.isFlag);
	}

	setBuilding(macRoom.buildingId);

	document.getElementById('go-back').addEventListener('click', function(evt){
		location.href = '/manager/macRoom';
	});

	document.getElementById('save').addEventListener('click', function(evt){
		macRoom.new ? newMacRoom() : saveMacRoom();
	});

	document.getElementById('delete').addEventListener('click', function(evt){
		deleteMacRoom();
	});
};

function newMacRoom(){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/insertMacRoom',
		type : 'POST',
		data: {
			buildingId: document.getElementById('building').value,
			identityNo: document.getElementById('identity-no').value,
			name: document.getElementById('name').value,
			typeId: document.getElementById('type-id').value,
			area: document.getElementById('area').value,
			powerId: document.getElementById('power-id').value,
			powerPrice: document.getElementById('power-price').value,
			latitude: document.getElementById('latitude').value,
			longitude: document.getElementById('longitude').value,
			floor: document.getElementById('floor').value,
			floorHeight: document.getElementById('floor-height').value,
			devicePercent: document.getElementById('device-percent').value,
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

function saveMacRoom(){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/updateMacRoom',
		type : 'POST',
		data: {
			id: JSON.parse(window.localStorage.macRoom).id,
			identityNo: document.getElementById('identity-no').value,
			name: document.getElementById('name').value,
			typeId: document.getElementById('type-id').value,
			floor: document.getElementById('floor').value,
			area: document.getElementById('area').value,
			powerId: document.getElementById('power-id').value,
			powerPrice: document.getElementById('power-price').value,
			latitude: document.getElementById('latitude').value,
			longitude: document.getElementById('longitude').value,
			floorHeight: document.getElementById('floor-height').value,
			devicePercent: document.getElementById('device-percent').value,
			isFlag: document.getElementById('is-flag').selectedIndex,
			buildingId: document.getElementById('building').value,
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

function deleteMacRoom(){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/deleteMacRoom',
		type : 'POST',
		data: {
			macRoomId: JSON.parse(window.localStorage.macRoom).id,
		},
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText);

			if (jsonData.success) {
				alert('删除成功');
				location.href = '/manager/macRoom';
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

function setBuilding(buildingId){
	ajax({
		url : 'http://10.108.217.190:8080/EnergySystem2/getBuildingList',
		type : 'GET',
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText);

			jsonData.buildings.map(function(_building, idx){
				var option = document.createElement('option'),
				select = document.getElementById('building');
				option.value = _building.id;
				option.innerText = _building.name.concat(',').concat(_building.city);
				select.appendChild(option);

				if (String(buildingId) === String(option.value)) {
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