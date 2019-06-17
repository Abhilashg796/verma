$(document).ready(function(){
	ClearAllBindedValues();
	var waybillno=getParameterByName("WaybillNo");
	$("#txtWayBillno").val(waybillno);
	$(".tracking-container").modal("show");
	if(waybillno!=null && waybillno!=""){
		OnChangeWayBillTracking();
	}
	else{
		alert("Please Enter Waybill Number to Track Live Loation");
	}
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.href);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function progressAnimation(StatusLength)
	{
		var width=10;
		var scrollPercentage=[10,40,65,100,100]
		
			if(StatusLength==4){
				width=65
			}
			else{
				width=scrollPercentage[StatusLength-1];
				
			}
			$('.linear-chart').each(function() {
			$(this).find('.linear-value').animate({
			  width:width+"%"
			},2000);
		});
	
		
	}	
	
	//Way bill tracking Web Service Call
function OnChangeWayBillTracking(){
	var waybillno=$("#txtWayBillno").val();
		if(waybillno!=null && waybillno!=""){

			var WaybillDetails = {
            WAYBILLNO: waybillno.trim()
			}
			$.ajax({
			    url: "http://13.234.222.174:9001/Operations/Service/Operations.svc/WaybillMovement_WaybillStatus",
				type: 'post',
				dataType: 'json',
				contentType: 'application/json',
				success: onResponeServiceCall,/*function (data) {
              console.log(data);
            },*/
            data: JSON.stringify(WaybillDetails)
			});
		
		
		/*$(".modal").on("show.bs.modal", function () {
		progressAnimation();
		});	*/
		
	}else{
		alert("Please Enter Waybill Number to Track Live Loation");
	}
}
function onResponeServiceCall(ResponceData){
	//Success Responce
	ClearAllBindedValues();
	if(ResponceData!=null){
		
		if(ResponceData.lstErrorDetails.length >0){
			if(ResponceData.lstErrorDetails[0].success=="YES"){
				
				var StatusDetails=ResponceData.lstWaybillNo_StatusDetails;
				BindValuesInTheDom(StatusDetails)
				var GPSDetails =ResponceData.lstWaybillNo_VehicleDetails;
			
				if(GPSDetails.length > 0){
					BindGPSValuesInMap(GPSDetails);
				}
					
				  console.log(ResponceData);
			}
			else{
				// Invalid Waybill Number
				
			}
			
		}
	}

}

// to assign the values

function BindValuesInTheDom (StatusDetails){
	
	var length=StatusDetails.length;

	for(var index=0;index<=length-1;index++){
		var datetime=StatusDetails[index].operationDate+" "+StatusDetails[index].operationTime;
		var branchname=StatusDetails[index].branchName
	    var wayBillStatus=StatusDetails[index].wayBillStatus
		if(wayBillStatus!="OGPL Dropped @"){
			
			$("#pg"+index).html(branchname+"<br>"+datetime);
		
      console.log(wayBillStatus+ " at "+ branchname+" on "+datetime);
		}
		
	}
	progressAnimation(length);
	
}
function BindGPSValuesInMap (GPSDetails){
	var lat=GPSDetails[0].Lat;
	var Long=GPSDetails[0].Long;
	  var myCenter = new google.maps.LatLng(lat,Long);
                            var mapCanvas = document.getElementById("map");
                            var mapOptions = { center: myCenter, zoom: 18 };
                            var map = new google.maps.Map(mapCanvas, mapOptions);
                            var marker = new google.maps.Marker({ position: myCenter });
                            marker.setMap(map);

                            // Zoom to 9 when clicking on marker
                            google.maps.event.addListener(marker, 'click', function () {
                                map.setZoom(9);
                                map.setCenter(marker.getPosition());
                            });
	
}
function ClearAllBindedValues(){

	$(".clsParagraph").html("Status Yet to be Updated")
	
}



