
function populateHourDatatable(data){
	var table = $('#hoursTable').DataTable({
        "bAutoWidth" : false,
        "aaData" : data,
        "columns" : [ {
            "data" : "id"
        }, {
            "data" : "name"
        }, {
            "data" : "lat"
        }, {
            "data" : "lon"
        }]
    });
}

function searchWorkingday(){
	var employee = $('#employee').val();
	var initialDate = $('#initialDate').val();
	var endDate = $('#endDate').val();
	
	var search = {
		employee : employee,
		initialDate : initialDate,
		endDate : endDate
	}

	$.post('/hour', search , function(data) {
		populateHourDatatable(data);
	})
	.done(function() {
	    //alert( "second success" );
	})
	.fail(function() {
	    //alert( "error" );
	})
	.always(function() {
	    //alert( "finished" );
	});
}

function newWorkingdayFormSend(){

}

function newWorkingday(){
	var user = '<%= user.username %>';
	var date = $('#date').val();
	var endDate = $('#endDate').val();

	var workingdayDataList = [];
	$('#newworkingDayPanel').forEach(function(value, index){
		var workingdayData = {
			employee : $('#employee'+index).val(),
			date : $('#employee'+index).val(),
		}
	});


	workingdayDataList.push(workingdayData);

	$.post('/hour/create', workingdayDataList , function(data) {
		
	})
	.done(function() {
	    //alert( "second success" );
	})
	.fail(function() {
	    //alert( "error" );
	})
	.always(function() {
	    //alert( "finished" );
	});
}

function newPale(){
	var paleData = {

	}

	$.post('/pale/create', paleData , function(data) {
		
	})
	.done(function() {
	    //alert( "second success" );
	})
	.fail(function() {
	    //alert( "error" );
	})
	.always(function() {
	    //alert( "finished" );
	});
}