$( document ).ready(function() {
	$('#newWorkingDayPanelCounter').val(0);
    loadDate("Initial");
    loadDate("End");
    $(`.date[data-id="datepickerInitial"]`).datepicker('update', '');
    $(`.date[data-id="datepickerEnd"]`).datepicker('update', '');
    //Add to Employees by default
    setTableRowDataAvailable();
    searchWorkingday();
})

var hourTable = $('#hoursTable').DataTable( {
        "scrollY":        "200px",
        "scrollCollapse": true,
        columns: [
            { title : "ID JORNADA", data: "workingdayId", visible: false },
            { title : "ID EMPLEADO", data: "employeeId", visible: false },
            { title : "EMPLEADO", data: "employeeName" },
            { title : "FECHA", data: "dateString"},
            { title : "FECHA_DB", data: "date", visible: false  },
            { title : "JORNADA", data: "workingday" },
            { title : "HORAS", data: "hours" },
            { title : "NOTAS", data: "description" },
            { title : "", data: "functions" , width: "60px"}
        ],
        "language": {
            "url": "/assets/locales/dataTables-spanish.json"
        },
        select: true
    } );

var workingdayRow = {}

function setTableRowDataAvailable(){
	$('#hoursTable tbody').on( 'click', 'button', function () {
	        workingdayRow = hourTable.row( $(this).parents('tr') ).data();
			fillWorkingDayEditPanelComponents();
	    } );
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

function fillWorkingDayEditPanelComponents(){
	$(`#workingDayForm .selectpicker[data-id="employeeEdit${workingdayRow.workingdayId}"]`).selectpicker('val', workingdayRow.employeeId);
	$(`#workingDayForm .selectpicker[data-id="employeeEdit${workingdayRow.workingdayId}"]`).prop('disabled', true);
	$(`#workingDayForm .selectpicker[data-id="employeeEdit${workingdayRow.workingdayId}"]`).selectpicker('refresh');

	var date = new Date(workingdayRow.date.substr(0,4),parseInt(workingdayRow.date.substr(5,2))-1,workingdayRow.date.substr(8,2));
	$(`#workingDayForm .date[data-id="datepickerEdit${workingdayRow.workingdayId}"]`).datepicker('update', date);
	$(`#workingDayForm #dateEdit${workingdayRow.workingdayId}`).prop('disabled', true);
	$(`#workingDayForm #hoursEdit${workingdayRow.workingdayId}`).val(workingdayRow.hours);
	$(`#workingDayForm #descriptionEdit${workingdayRow.workingdayId}`).val(workingdayRow.description);
}

function newWorkingDay(){
	removeMessage("#workingDayMessageDiv");
	$('#workingDayModalLbl').html("Creando jornada");
	$('#saveWorkingDayBtn').html("Guardar");
	$('#workingDayPanelContent').html(getEmployeePanelHtml(`New`));
	loadEmployeeSelect(`New`);
	loadHour(`New`);
	loadDate(`New`);
	$('#saveWorkingDayBtn').attr( "onclick",`saveNewWorkingDay()`);
	$('#workingDayModal').modal('show');
}

function editWorkingDay(id){
	removeMessage("#workingDayMessageDiv");
	$('#workingDayModalLbl').html("Editando jornada");
	$('#saveWorkingDayBtn').html("Guardar");
	$('#workingDayPanelContent').html(getEmployeePanelHtml(`Edit${id}`));
	loadHour(`Edit${id}`);
	loadDate(`Edit${id}`);
	loadEmployeeSelect(`Edit${id}`);
	$('#saveWorkingDayBtn').attr( "onclick",`saveEditWorkingDay(${id})`);
	$('#workingDayModal').modal('show');
}

function deleteWorkingDay(id){
	removeMessage("#workingDayMessageDiv");
	$('#workingDayModalLbl').html("Eliminando jornada");
	$('#saveWorkingDayBtn').html("Eliminar");
	$('#workingDayPanelContent').html("La jornada va a ser eliminada. ¿Estás seguro?");
	$('#saveWorkingDayBtn').attr( "onclick",`saveDeleteWorkingDay(${id})`);
	$('#workingDayModal').modal('show');
}

function saveNewWorkingDay(){
	$('#saveWorkingDayBtn').prop('disabled', true);
	$('#saveWorkingDayBtn').html('<div class="loader"></div>');
	var inputsData = {
		employeeId : $(`#workingDayForm .selectpicker[data-id="employeeNew"]`).selectpicker('val'),
		date: $(`#workingDayForm .date[data-id="datepickerNew"]`).datepicker("getUTCDate"),
		hours: $(`#workingDayForm #hoursNew`).val(),
		description: $(`#workingDayForm #descriptionNew`).val()
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
		description: $(`#workingDayForm #descriptionEdit${id}`).val()
	};

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
