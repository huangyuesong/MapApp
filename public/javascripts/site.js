var PAGE_SIZE = 10,
	PAGE_INDEX = parseUrlQuery().get('pageIndex') || 1;

window.onload = function(){
	setDistrictPicker();
	setSites(PAGE_INDEX);

	document.getElementById('search').addEventListener('click', function(evt){
		setSites(PAGE_INDEX);
	});

	document.getElementById('go-back').addEventListener('click', function(evt){
		location.href = '/login';
	});

	document.getElementById('go-to-map').addEventListener('click', function(evt){
		location.href = '/map';
	});

	document.getElementById('to-mac-room').addEventListener('click', function(evt){
		location.href = '/manager/macRoom';
	});
};

function setSites(pageIndex){
	var keyword = document.getElementById('keyword').value,
		province = document.getElementById('province').value,
		city = document.getElementById('city').value,
		county = document.getElementById('county').value;

	ajax({
		url : 'http://127.0.0.1:8080/EnergySystem/searchSite',
		type : 'POST',
		data: {
			keyword: keyword,
			province: province,
			city: city,
			county: county,
			pageIndex: pageIndex,
			pageSize: PAGE_SIZE,
		},
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText);

			document.getElementById('site-wrapper').innerHTML = '';
			jsonData.sites.map(function(_site){
				var entry = document.createElement('div'),
					name = document.createElement('p'),
					location = document.createElement('p');
				name.innerText = _site.name;
				location.innerText = _site.city;
				entry.setAttribute('class', 'entry');
				entry.appendChild(name);
				entry.appendChild(location);
				document.getElementById('site-wrapper').appendChild(entry);
			});

			var buttonWrapper = document.createElement('div');
			buttonWrapper.setAttribute('class', 'button-wrapper');
			document.getElementById('site-wrapper').appendChild(buttonWrapper);

			if (PAGE_INDEX > 1) {
				var buttonPrev = document.createElement('button');
				buttonPrev.innerText = '上一页';

				buttonPrev.addEventListener('click', function(evt){
					location.search = 'pageIndex='.concat(Number(PAGE_INDEX) - 1);
				});

				buttonWrapper.appendChild(buttonPrev);
			}

			if (jsonData.sites.length >= PAGE_SIZE) {
				var buttonNext = document.createElement('button');
				buttonNext.innerText = '下一页';

				buttonNext.addEventListener('click', function(evt){
					location.search = 'pageIndex='.concat(Number(PAGE_INDEX) + 1);
				});

				buttonWrapper.appendChild(buttonNext);
			}
		},
		fail : function(status){
			alert(status);
			var popText = '出现未知错误，请联系管理员';
			openPop(popText);
		}
	});
}

function setDistrictPicker(){
	ajax({
		url : 'http://127.0.0.1:8080/EnergySystem/getDistrictList',
		type : 'GET',
		success : function(responseText, responsexml){
			var jsonData = JSON.parse(responseText),
				districts = {};

			jsonData.districts.map(function(_district){
				if (districts[_district.province] === undefined) {
					districts[_district.province] = {};
				}

				if (districts[_district.province][_district.city] === undefined) {
					districts[_district.province][_district.city] = [];
				} else {
					districts[_district.province][_district.city].push(_district.county);
				}
			});

			Object.keys(districts).map(function(key){
				var option = document.createElement('option');
				option.value = key;
				option.innerText = key;
				document.getElementById('province').appendChild(option);
			});

			document.getElementById('province').addEventListener('change', function(evt){
				document.getElementById('city').innerHTML = '';
				document.getElementById('city').selectedIndex = 0;
				document.getElementById('county').selectedIndex = 0;

				var province = evt.target.value,
					option = document.createElement('option');
				option.value = '';
				option.innerText = '-';
				document.getElementById('city').appendChild(option);
				districts[province] && Object.keys(districts[province]).map(function(key){
					var option = document.createElement('option');
					option.value = key;
					option.innerText = key;
					document.getElementById('city').appendChild(option);
				});

				setSites(PAGE_INDEX);
			});

			document.getElementById('city').addEventListener('change', function(evt){
				document.getElementById('county').innerHTML = '';
				document.getElementById('county').selectedIndex = 0;

				var province = document.getElementById('province').value,
					city = evt.target.value,
					option = document.createElement('option');
				option.value = '';
				option.innerText = '-';
				document.getElementById('county').appendChild(option);
				districts[province][city] && districts[province][city].map(function(key){
					var option = document.createElement('option');
					option.value = key;
					option.innerText = key;
					document.getElementById('county').appendChild(option);
				});

				setSites(PAGE_INDEX);
			});

			document.getElementById('county').addEventListener('change', function(evt){
				setSites(PAGE_INDEX);
			});
		},
		fail : function(status){
			alert(status);
			var popText = '出现未知错误，请联系管理员';
			openPop(popText);
		}
	});
}