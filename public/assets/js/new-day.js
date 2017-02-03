$( document ).ready(function() {
	$('#newWorkingDayPanelCounter').val(0);
    loadDate("0");
    //Add to Employees by default
    searchEmployees(init);
})

function searchEmployees(callback){
	$.get("/employee/find", function(data) {
		listEmployee = JSON.parse(data);
		callback();
	}).fail(function(jqXHR) {
	});
}

function init(){
	loadEmployeeSelect(0);
  addEmployeePanel();
  addEmployeePanel();
	$(`#newWorkingDayForm .selectpicker[data-id="employee1"]`).selectpicker('val', 1);
	$(`#newWorkingDayForm .selectpicker[data-id="employee2"]`).selectpicker('val', 2);
  $('.selectpicker').selectpicker('refresh');
}

function workingdayModal(){
  $('#newWorkingDayModal').modal('show');
}

function saveNewWorkingDayBatch(){
	$('#saveNewWorkingDayBtn').prop('disabled', true);
	$('#saveNewWorkingDayBtn').html('<div class="loader"></div>');
	var inputsData = {};
	$("#newWorkingDayForm :input").each(function(){
	   if($(this)[0].name!=""){
	   		if($(this).attr("id").includes("date")){
	   			id = $(this).attr("id").substring(4, 5);
	   			inputsData[$(this).attr("id")] = $(`.date[data-id="datepicker${id}"]`).datepicker("getUTCDate");
	   		}else{
				inputsData[$(this).attr("id")] = $(this).val();
	   		}
	   	}
	});
	$.post('/hour/create/batch', inputsData , function(data) {
		removeMessage("#newWorkingDayMessageDiv");
		if(data.status==0){
			searchWorkingday();
			$('#newWorkingDayModal').modal('hide');
		}else if (data.status==1){
			addMessage("#newWorkingDayMessageDiv", data.status, data.message);
		}
	}).fail(function(jqXHR) {
		$('#saveNewWorkingDayBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#newWorkingDayMessageDiv",1,responseText.message);
	}).always(function() {
		$('#saveNewWorkingDayBtn').removeAttr('disabled');
		$('#saveNewWorkingDayBtn').html('Guardar');
	});
}
