window.onload = function(){
    var cId = JSON.parse(window.localStorage.cId);
    var geocoder,map,marker = null;
    initMap();

    // 初始化地图
    function initMap() {
        geocoder = new qq.maps.Geocoder({
            complete : function(result){
                 window.map = new qq.maps.Map(document.getElementById('container'), {
                    center: result.detail.location,       //设置地图中心点
                    zoom: (JSON.parse(window.localStorage.companyLevel)*3)+1  
                });
                 zoomPre = window.map.getZoom();
                 // 最开始的时候监听bounds_changed
                 qq.maps.event.addListenerOnce(window.map, 'bounds_changed', function(){
                        ajaxGetLocation(cId);
                })
                 // 监听拖拽事件
                qq.maps.event.addListener(window.map, 'dragend', function() {
                        ajaxGetLocation(cId);
                });
                // 监听地图范围变大事件
                qq.maps.event.addListener(window.map, 'zoom_changed', function() {
                        var zoomCurrent = window.map.getZoom();
                        if(zoomCurrent <= zoomPre){
                            ajaxGetLocation(cId);
                        }
                        zoomPre = zoomCurrent;
                });
            },
            error : function(){
                var center = new qq.maps.LatLng(39.916527,116.397128);
                window.map = new qq.maps.Map(document.getElementById('container'));
                var popText = '出现未知错误，请联系管理员';
                    openPop(popText);
            }
        });
        //定位至默认地区
        var address = window.localStorage.dataPlace;;
        geocoder.getLocation(address);     
    }

    // 渲染坐标
    function ajaxGetLocation(cId){
        openSpinner();
        var bounds = window.map.getBounds();
        if(bounds){
            var northeast = [bounds.getNorthEast().getLng() , bounds.getNorthEast().getLat()],
                southwest = [bounds.getSouthWest().getLng() , bounds.getSouthWest().getLat()];

            var mapCenter = [];
            mapCenter.push(window.map.getCenter().lng);
            mapCenter.push(window.map.getCenter().lat);
        }

        var data = {cId : JSON.stringify(cId), 
                    center : JSON.stringify(mapCenter),
                    southwest : JSON.stringify(southwest),
                    northeast : JSON.stringify(northeast),
                    distance : 1.5 
                    };
        ajax({
            url : 'http://10.108.217.190:8080/EnergySystem2/nodeLocation',/*http://10.108.217.190*/
            type : 'POST',
            data : data,
            success : function(responseText, responsexml){
                        var jsonData = JSON.parse(responseText);

                        var macRooms = jsonData.macRooms;
                        var sites = jsonData.sites;

                        var anchor = new qq.maps.Point(6, 6),
                            size = new qq.maps.Size(24, 24),
                            origin = new qq.maps.Point(0, 0),
                            icon = new qq.maps.MarkerImage('images/site.gif', size, origin, anchor);

                        for (var i = 0; i < macRooms.length; i++) {
                            var latitude = macRooms[i].latitude,
                                longitude = macRooms[i].longitude,
                                id = macRooms[i].id;
                            var markerLocation = new qq.maps.LatLng(latitude,longitude);
                                createMarker(markerLocation,id);
                            };

                        for (var i = 0; i < sites.length; i++) {
                            var latitude = sites[i].latitude,
                                longitude = sites[i].longitude;
                                id = sites[i].id;
                            var markerLocation = new qq.maps.LatLng(latitude,longitude);
                                createMarker(markerLocation,id,icon);
                            };
                        closeSpinner();

            },
            fail : function(status){
                var popText = '出现未知错误，请联系管理员';
                openPop(popText);
            }
        });        
    }

    function createMarker(markerLocation,id_,icon_){
        var markerInfo = null;
        if(icon_){
            var marker = new qq.maps.Marker({
                icon: icon_,
                map: window.map,
                position:markerLocation
            });

            markerInfo = {
                url : "siteKPI",
                data: {siteId : id_},
                name: '基站',
                markerLocation: markerLocation
            }
        }else{
            var marker = new qq.maps.Marker({
                    map:window.map,
                    position:markerLocation
            });

            markerInfo = {
                url : "macRoomKPI",
                data: {macRoomId : id_},
                name: '机房',
                markerLocation: markerLocation
            }
        }

        marker.setTitle(JSON.stringify(markerInfo));

            qq.maps.event.addListener(marker, 'click', function() {
                var markerInfo = this.getTitle();
                ajaxOpenInfoWindow (markerInfo);
            });

    }

    function ajaxOpenInfoWindow (markerInfo_){
        var markerInfo = JSON.parse(markerInfo_);
        var url = markerInfo.url;
        var data = markerInfo.data;
        var name = markerInfo.name;
        var markerLocation = markerInfo.markerLocation;

        var latLng = new qq.maps.LatLng(markerLocation.lat, markerLocation.lng);

        ajax({
                url : 'http://10.108.217.190:8080/EnergySystem2/'+url,
                type : 'POST',
                data : data,
                success : function(responseText, responsexml){
                            var jsonData = JSON.parse(responseText);
                            var PowerExpend = jsonData.PowerExpend;

                            var infoWin = new qq.maps.InfoWindow({
                                map: window.map
                            });
                            infoWin.setContent('<div class="info-win">该'+name+'的能耗为'+PowerExpend+'</div>');
                            infoWin.setPosition(latLng);
                            infoWin.open();
                },
                fail : function(status){
                   var popText = '出现未知错误，请联系管理员';
                    openPop(popText);
                }
            }); 
    }



}


