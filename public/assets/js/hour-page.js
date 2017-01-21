$( document ).ready(function() {
	$('#newWorkingDayPanelCounter').val(0);
	
    loadDate("Initial");
    loadDate("End");
    $(`.date[data-id="datepickerInitial"]`).datepicker('update', '');
    $(`.date[data-id="datepickerEnd"]`).datepicker('update', '');
    loadDate("0");
    //Add to Employees by default
    searchEmployees(init);

    setTableRowDataAvailable();
    searchWorkingday();
})

function init(){
	loadEmployeeSelect(0);
    addEmployeePanel();
    addEmployeePanel();
	$(`#newWorkingDayForm .selectpicker[data-id="employee1"]`).selectpicker('val', 1);
	$(`#newWorkingDayForm .selectpicker[data-id="employee2"]`).selectpicker('val', 2);
    $('.selectpicker').selectpicker('refresh');
}

var hourTable = $('#hoursTable').DataTable( {
        "scrollY":        "200px",
        "scrollCollapse": true,
        columns: [
            { title : "ID JORNADA", data: "workingdayId", visible: false },
            { title : "ID EMPLEADO", data: "employeeId", visible: false },
            { title : "EMPLEADO", data: "employeeName" },
            { title : "FECHA", data: "dateString" },
            { title : "FECHA_DB", data: "date", visible: false  },
            { title : "JORNADA", data: "workingday" },
            { title : "HORAS", data: "hours" },
            { title : "", data: "functions" }
        ],
        "language": {
            "url": "/assets/locales/dataTables-spanish.json"
        },
        select: true,
        buttons: [
            { extend: "edit"},
            { extend: "remove" }
        ]
    } );

var workingdayRow = {}
var listEmployee = []

function setTableRowDataAvailable(){
	$('#hoursTable tbody').on( 'click', 'button', function () {
	        workingdayRow = hourTable.row( $(this).parents('tr') ).data();
	        console.log(workingdayRow);
			fillEmployeePanelComponents();
	    } );
}

function searchEmployees(callback){
	$.get("/employee/find", function(data) {
		listEmployee = JSON.parse(data);
		callback();
	}).fail(function(jqXHR) {
	});
}

function addMessage(div,type,text){
	var content = '';
	switch (type) {
	  	case 0:
	  		content = ` <div class="alert alert-info">
		 					<strong>Info: </strong> ${text}
	 		  			</div>`;
	    	break;
	  	case 1:
	  		content = ` <div class="alert alert-danger">
		 					<strong>Error: </strong> ${text}
	 		  			</div>`;
	    	break;
	}
    $(div).html(content);
}

function removeMessage(div){
    $(div).html('');
}

function populateHourDatatable(jsonData){
    hourTable.clear();
    hourTable.rows.add(JSON.parse(jsonData));
    hourTable.draw();
}

function searchWorkingday(){
	var employeeId = $('#employee0').val();
	var initialDate = $(`.date[data-id="datepickerInitial"]`).datepicker("getUTCDate");
	var endDate = $(`.date[data-id="datepickerEnd"]`).datepicker("getUTCDate");
	
	var search = {
		employeeId : employeeId,
		initialDate : initialDate,
		endDate : endDate
	}

	$.post('/hour/find', search , function(jsonData) {
		populateHourDatatable(jsonData);
	});;
}

function fillEmployeePanelComponents(){
	$(`#workingDayForm .selectpicker[data-id="employeeEdit${workingdayRow.workingdayId}"]`).selectpicker('val', workingdayRow.employeeId);
	$(`#workingDayForm .selectpicker[data-id="employeeEdit${workingdayRow.workingdayId}"]`).prop('disabled', true);
	$(`#workingDayForm .selectpicker[data-id="employeeEdit${workingdayRow.workingdayId}"]`).selectpicker('refresh');

	var date = new Date(workingdayRow.date.substr(0,4),parseInt(workingdayRow.date.substr(5,2))-1,workingdayRow.date.substr(8,2));
	$(`#workingDayForm .date[data-id="datepickerEdit${workingdayRow.workingdayId}"]`).datepicker('update', date);
	$(`#workingDayForm #dateEdit${workingdayRow.workingdayId}`).prop('disabled', true);
	$(`#workingDayForm #hoursEdit${workingdayRow.workingdayId}`).val(workingdayRow.hours);

	//$(`#editWorkingDayForm #description${workingdayRow.workingdayId}`).val(workingdayRow.description);
}

function newWorkingDay(){
	removeMessage("#workingDayMessageDiv");
	$('#workingDayModalLbl').html("Creando jornada");
	$('#saveWorkingDayBtn').val("Guardar");
	$('#workingDayPanelContent').html(getEmployeePanelHtml(`New`));
	loadEmployeePanelComponents(`New`);
	$('#saveWorkingDayBtn').attr( "onclick",`saveNewWorkingDay()`);
	$('#workingDayModal').modal('show');
}

function editWorkingDay(id){
	removeMessage("#workingDayMessageDiv");
	$('#workingDayModalLbl').html("Editando jornada");
	$('#saveWorkingDayBtn').val("Guardar");
	$('#workingDayPanelContent').html(getEmployeePanelHtml(`Edit${id}`));
	loadEmployeePanelComponents(`Edit${id}`);
	$('#saveWorkingDayBtn').attr( "onclick",`saveEditWorkingDay(${id})`);
	$('#workingDayModal').modal('show');
}

function deleteWorkingDay(id){
	removeMessage("#workingDayMessageDiv");
	$('#workingDayModalLbl').html("Eliminando jornada");
	$('#saveWorkingDayBtn').val("Eliminar");
	$('#workingDayPanelContent').html("La jornada va a ser eliminada. ¿Estás seguro?");
	$('#saveWorkingDayBtn').attr( "onclick",`saveDeleteWorkingDay(${id})`);
	$('#workingDayModal').modal('show');
}

function saveNewWorkingDayBatch(){
	$('#saveNewWorkingdayBtn').prop('disabled', true);
	$('#saveNewWorkingdayBtn').html('<div class="loader"></div>');
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
		$('#saveNewWorkingdayBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#newWorkingDayMessageDiv",1,responseText.message);
	}).always(function() {
		$('#saveNewWorkingdayBtn').removeAttr('disabled');
		$('#saveNewWorkingdayBtn').html('Guardar');
	});
}

function saveNewWorkingDay(){
	$('#saveNewWorkingdayBtn').prop('disabled', true);
	$('#saveNewWorkingdayBtn').html('<div class="loader"></div>');
	var inputsData = {
		employeeId : $(`#workingDayForm .selectpicker[data-id="employeeNew"]`).selectpicker('val'),
		date: $(`#workingDayForm .date[data-id="datepickerNew"]`).datepicker("getUTCDate"),
		hours: $(`#workingDayForm #hoursNew`).val(),
		description: ""
	};
	
	$.post('/hour/create', inputsData , function(data) {
		removeMessage("#newWorkingDayMessageDiv");
		if(data.status==0){
			searchWorkingday();
			$('#workingDayModal').modal('hide');
		}else if (data.status==1){
			addMessage("#workingDayMessageDiv", data.status, data.message);
		}
	}).fail(function(jqXHR) {
		$('#saveWorkingDayBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#workingDayMessageDiv",1,responseText.message);
	}).always(function() {
		$('#saveWorkingDayBtn').removeAttr('disabled');
		$('#saveWorkingDayBtn').html('Guardar');
	});
}

function saveEditWorkingDay(id){
	$('#saveWorkingDayBtn').prop('disabled', true);
	$('#saveWorkingDayBtn').html('<div class="loader"></div>');

	var inputsData = {
		workingdayId: workingdayRow.workingdayId,
		hours: $(`#workingDayForm #hoursEdit${id}`).val(),
		description: ""
	};
	
	//console.log("Update data: ",inputsData);
	$.post('/hour/update', inputsData , function(data) {
		removeMessage("#workingDayMessageDiv");
		if(data.status==0){
			searchWorkingday();
			$('#workingDayModal').modal('hide');
		} else if (data.status==1){
			addMessage("#workingDayMessageDiv", data.status, data.message);
		}
	}).fail(function(jqXHR) {
		$('#saveWorkingDayBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#workingDayMessageDiv",1,responseText.message);
	}).always(function() {
		$('#saveWorkingDayBtn').removeAttr('disabled');
		$('#saveWorkingDayBtn').html('Guardar');
	});
}

function saveDeleteWorkingDay(id){
	$('#saveWorkingDayBtn').prop('disabled', true);
	$('#saveWorkingDayBtn').html('<div class="loader"></div>');

	$.post('/hour/delete', {workingdayId : id} , function(data) {
		removeMessage("#workingDayErrorsDiv");
		if(data.status==0){
			searchWorkingday();
			$('#workingDayModal').modal('hide');
		}else if (data.status==1){
			addMessage("#workingDayMessageDiv",data.status,responseText.message);
		}
	}).done(function() {
	}).fail(function(jqXHR) {
		$('#saveWorkingDayBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#workingDayMessageDiv",1,responseText.message);
	}).always(function() {
		$('#saveWorkingDayBtn').removeAttr('disabled');
		$('#saveWorkingDayBtn').html('Eliminar');
	});
}

function loadDate(id){
	$(`.date[data-id="datepicker${id}"]`).datepicker(dateInit());
    $(`.date[data-id="datepicker${id}"]`).datepicker('update', '-1d');
}	

function dateInit (){
	return {
	    language: 'es',
    	autoclose: true
	};
} 

function loadEmployeeSelect(id){
	var inputSelectHtml = `	<select class="selectpicker" data-id="employee${id}" id="employee${id}" name="employee${id}">
							  	<option></option>`;
	listEmployee.forEach(function(element, index, array){
		inputSelectHtml += `<option value="${element.employeeId}">${element.name}</option>`;
	});
	inputSelectHtml += `</select>`;

	$(`#employeeSelectDiv${id}`).html(inputSelectHtml);
	$(`.selectpicker[data-id="employee${id}"]`).selectpicker({
		  style: 'btn-primary',
		  width: 'fit'
	});
}
function getEmployeePanelHtml(id){
	return `<div class="panel panel-primary" id="workingDayPanel${id}">
                <div class="panel-heading">
                    <h3 class="panel-title" id="employeeTitle">Jornada</h3></div>
                <div class="panel-body">
                    <div class="row">
                        <div class="form-group">
                            <div class="col-md-1 col-sm-6 col-xs-6">
                                <label for="employee${id}">Empleado</label>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-6" id="employeeSelectDiv${id}">
                                <input type="text" class="form-control" id="employee${id}" name="employee${id}">
                            </div>
                            <div class="col-md-1 col-sm-6 col-xs-6">
                                <label for="date${id}">Fecha</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <div class="input-group date" data-provide="datepicker" data-id="datepicker${id}">
                                    <input type="text" class="form-control" id="date${id}" name="date${id}">
                                    <div class="input-group-addon">
                                        <span class="glyphicon glyphicon-th"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-1 col-sm-6 col-xs-6">
                                <label for="hours${id}">Horas</label>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-6">
                                <div class="input-group">
                                    <span class="input-group-btn">
                                       <button type="button" class="btn btn-danger btn-number" data-type="minus" data-field="hours${id}">
                                            <span class="glyphicon glyphicon-minus"></span>
                                        </button>
                                      </span>
                                    <input id="hours${id}" name="hours${id}" class="form-control input-number" value="8" min="1" max="20" type="text">
                                    <span class="input-group-btn">
                                        <button type="button" class="btn btn-success btn-number" data-type="plus" data-field="hours${id}">
                                            <span class="glyphicon glyphicon-plus"></span>
                                        </button>
                                     </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

function loadEmployeePanelComponents(id){
	$(`.btn-number[data-field="hours${id}"]`).click(numberSpinner);
	$(`.input-number[data-field="hours${id}"]`).focusin(numberSpinnerFocusIn);
	$(`.input-number[data-field="hours${id}"]`).change(numberSpinnerChange);
	$(`.input-number[data-field="hours${id}"]`).keydown(numberSpinnerKeydown);

	loadDate(id);
	loadEmployeeSelect(id);
}

function addEmployeePanel(){
	var id = parseInt($('#newWorkingDayPanelCounter').val());
	id+=1;
	$('#newWorkingDayPanelCounter').val(id);
	$('#newWorkingDayPanelContent').append(getEmployeePanelHtml(id));
	loadEmployeePanelComponents(id);

}

function removeEmployeePanel(){
	var id = parseInt($('#newWorkingDayPanelCounter').val());
	if(id > 0){
		$('#workingDayPanel'+id).remove();
		$('#newWorkingDayPanelCounter').val(id-1);
	}

}

function numberSpinner(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseFloat(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 0.5).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 0.5).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
}

function numberSpinnerFocusIn(){
   $(this).data('oldValue', $(this).val());
}

function numberSpinnerChange(e){
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    
    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Lo siento, se ha alcanzado el número mínimo');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Lo siento, se ha alcanzado el número máximo');
        $(this).val($(this).data('oldValue'));
    }

}

function numberSpinnerKeydown (e){
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
         // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) || 
         // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             // let it happen, don't do anything
             return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
    
}


//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(numberSpinner);
$('.input-number').focusin(numberSpinnerFocusIn);
$('.input-number').change(numberSpinnerChange);
$(".input-number").keydown(numberSpinnerKeydown);