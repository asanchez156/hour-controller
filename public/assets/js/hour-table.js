$( document ).ready(function() {
	$('#newWorkingDayPanelCounter').val(0);
	loadEmployeeSelect(0);
    loadDate("Initial");
    loadDate("End");
    $(`.date[data-id="datepickerInitial"]`).datepicker('update', '');
    $(`.date[data-id="datepickerEnd"]`).datepicker('update', '');
    loadDate("0");
    //Add to Employees by default
    addEmployeePanel();
    addEmployeePanel();
    //$('#employee1').val('1');
    //$('#employee2').val('2');
    $('.selectpicker').selectpicker('refresh');

    
})

var hourTable = $('#hoursTable').DataTable( {
        "scrollY":        "200px",
        "scrollCollapse": true,
        columns: [
            { title : "ID JORNADA", data: "workingdayId", visible: false },
            { title : "ID EMPLEADO", data: "employeeId", visible: false },
            { title : "EMPLEADO", data: "employeeName" },
            { title : "FECHA", data: "date" },
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

function addError(div,errorText){
    $(`#${div}`).html(` <div class="alert alert-danger">
						 					<strong>Error: </strong> ${errorText}
					 		  			</div>`);
}

function removeError(div){
    $(`#${div}`).html('');
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
	console.log(search);
	$.post('/hour/find', search , function(jsonData) {
		populateHourDatatable(jsonData);
	});;
}

function editWorkingDay(id,employeeId){
	$('#editWorkingDayPanelContent').html(getEmployeePanelHtml(id));
	loadEmployeePanelComponents(id,employeeId);
	$('#saveEditWorkingdayBtn').on("click", function(){
		saveEditWorkingday(id);
	});
	$('#editWorkingDayModal').modal('show');
}

function removeWorkingDay(id){
	$('#removeWorkingDayModal').modal('show');
}

function saveNewWorkingday(){
	$('#saveNewWorkingdayBtn').prop('disabled', true);
	$('#saveNewWorkingdayBtn').html('<div class="loader"></div>');
	var inputsData = {};
	var id = "";
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
	console.log(inputsData);
	$.post('/hour/create', inputsData , function(data) {
		console.log(data);
		if(data.status==0){
			$('#newWorkingDayModal').modal('hide');
			removeError("newWorkingDayErrorsDiv");
		}else if (data.status==5){
			addError("newWorkingDayErrorsDiv",data.message);
		}
	}).done(function() {
	}).fail(function(jqXHR) {
		$('#saveNewWorkingdayBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addError(responseText.message);
	}).always(function() {
		$('#saveNewWorkingdayBtn').removeAttr('disabled');
		$('#saveNewWorkingdayBtn').html('Guardar');
	});
}

function saveEditWorkingday(id){
	$('#editNewWorkingdayBtn').prop('disabled', true);
	$('#editNewWorkingdayBtn').html('<div class="loader"></div>');
	var inputsData = [];
	var id = "";
	$("#editWorkingDayForm :input").each(function(){
	   if($(this)[0].name!=""){ 
	   		if($(this).attr("id").includes("date")){
	   			id = $(this).attr("id").substring(4, 5);
	   			inputsData[$(this).attr("id")] = $(`.date[data-id="datepicker${id}"]`).datepicker("getUTCDate");
	   		}else{
				inputsData[$(this).attr("id")] = $(this).val();
	   		}
	   	}
	});
	$.post('/hour/update', inputsData , function(data) {
		console.log(data);
		if(data.status==0){
			$('#editWorkingDayModal').modal('hide');
			removeError("editWorkingDayErrorsDiv");
		}else if (data.status==5){
			addError("editWorkingDayErrorsDiv",data.message);
		}
	}).done(function() {
	}).fail(function(jqXHR) {
		$('#saveNewWorkingdayBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addError(responseText.message);
	}).always(function() {
		$('#saveNewWorkingdayBtn').removeAttr('disabled');
		$('#saveNewWorkingdayBtn').html('Guardar');
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
							  	<option></option>
							  	<option value="1">Paco</option>
							  	<option value="2">Javi</option>
							  	<option value="3">Pepelu</option>
							</select>`	;
	$(`#employeeSelectDiv${id}`).html(inputSelectHtml);
	$(`.selectpicker[data-id="employee${id}"]`).selectpicker({
		  style: 'btn-primary',
		  width: 'fit'
	});
}
function getEmployeePanelHtml(id){
	return `<div class="panel panel-primary" id="workingDayPanel${id}">
	                        <div class="panel-heading">
	                            <h3 class="panel-title" id="employeeTitle">Jornada ${id}</h3></div>
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

function loadEmployeePanelComponents(id, employeeId){
	$(`.btn-number[data-field="hours${id}"]`).click(numberSpinner);
	$(`.input-number[data-field="hours${id}"]`).focusin(numberSpinnerFocusIn);
	$(`.input-number[data-field="hours${id}"]`).change(numberSpinnerChange);
	$(`.input-number[data-field="hours${id}"]`).keydown(numberSpinnerKeydown);

	loadDate(id);
	loadEmployeeSelect(id);
	$(`.selectpicker[data-id="employee${id}"]`).selectpicker('val', employeeId);
	$(`.selectpicker[data-id="employee${id}"]`).prop('disabled', true);
	$(`.selectpicker[data-id="employee${id}"]`).selectpicker('refresh');
}

function addEmployeePanel(){
	var id = parseInt($('#newWorkingDayPanelCounter').val());
	id+=1;
	$('#newWorkingDayPanelCounter').val(id);
	$('#newWorkingDayPanelContent').append(getEmployeePanelHtml(id));
	loadEmployeePanelComponents(id, id);

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