
  $( document ).ready(function() {
  	$('#newWorkingDayPanelCounter').val(0);
      loadDate("Batch");
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
    addEmployeePanel();
    addEmployeePanel();
		loadEmployeeSelect("Search");
    $('.selectpicker').selectpicker('refresh');
  }

  function addEmployeePanel(){
  	var id = parseInt($('#newWorkingDayPanelCounter').val());
  	id+=1;
  	$('#newWorkingDayPanelCounter').val(id);
  	$('#newWorkingDayPanelContent').append(getEmployeePanelHtmlBatch(`Batch${id}`));
  	loadEmployeeSelect(`Batch${id}`);
  	loadHour(`Batch${id}`);
  	$(`#newWorkingDayForm .selectpicker[data-id="employeeBatch${id}"]`).selectpicker('val', parseInt(id));
    $(`#newWorkingDayForm #dateBatch${id}`).prop('disabled', true);
  }

  function removeEmployeePanel(){
  	var id = parseInt($('#newWorkingDayPanelCounter').val());
  	if(id > 0){
  		$('#workingDayPanelBatch'+id).remove();
  		$('#newWorkingDayPanelCounter').val(id-1);
  	}
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
      	   		if($(this).attr("id").includes("dateBatch")){
      	   			   inputsData["dateBatch"] = $(`.date[data-id="datepickerBatch"]`).datepicker("getUTCDate");
      	   		}else{
      				      inputsData[$(this).attr("id")] = $(this).val();
      	   		}
    	   	}
  	});
    console.log(inputsData);
  	$.post('/hour/create/batch', inputsData , function(data) {
  		removeMessage("#newWorkingDayMessageDiv");
  		if(data.status==0){
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
