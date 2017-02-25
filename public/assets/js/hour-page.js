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
            { title : "FUNCIONES", data: "functions"}
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

function searchAllWorkingday(){
	$.post('/hour/find', {} , function(jsonData) {
			populateHourDatatable(jsonData);
	});
}

function searchWorkingday(){
	var employeeId = $('#employeeSearch').val();
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
		employeeId : $(`#workingDayForm #employeeNew`).val(),
		date: $(`#workingDayForm .date[data-id="datepickerNew"]`).datepicker("getUTCDate"),
		hours: $(`#workingDayForm #hoursNew`).val(),
		description: $(`#workingDayForm #descriptionNew`).val()
	};

	$.post('/hour/create', inputsData , function(data) {
		removeMessage("#newWorkingDayMessageDiv");
		if(data.status==0){
			searchAllWorkingday();
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
			searchAllWorkingday();
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
			searchAllWorkingday();
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

// IMPORTAR EXCEL

function importWorkingDay(){
		removeMessage("#excelMessageDiv");
		$('#excelModalLbl').html("Importando jornadas");
		$('#excelPanelContent').html(`
			<div class="row">
				<div class="form-group">
					<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<label for="excelFile">Fichero a importar</label>
					</div>
					<div class="form-item col-md-6 col-sm-6 col-xs-6">
							<input class="button" type="file" id="excelFile" name="excelFile"/>
					</div>
				</div>
			</div>`);
		$('#excelImportExportBtn').html("Importar");
		$('#excelImportExportBtn').attr( "onclick",`excelImportWorkingDay()`);
		$('#excelModal').modal('show');

		var xlsFile = document.getElementById('excelFile');
		if(xlsFile.addEventListener) xlsFile.addEventListener('change', handleFile, false);
}

function excelImportWorkingDay(){
		$('#excelImportExportBtn').prop('disabled', true);
		$('#excelImportExportBtn').html('<div class="loader"></div>');

		$.post('/excel/import/workingday', {"excelFile" : excelFile} , function(data) {
			removeMessage("#excelMessageDiv");
			if(data.status==0){
				searchAllWorkingday();
				$('#excelModal').modal('hide');
			}else if (data.status==1){
				addMessage("#excelMessageDiv", data.status, data.message);
			}
		}).fail(function(jqXHR) {
			$('#excelImportExportBtn').prop('enable', true);
			var responseText =  JSON.parse(jqXHR.responseText);
			addMessage("#excelMessageDiv",1,responseText.message);
		}).always(function() {
			$('#excelImportExportBtn').removeAttr('disabled');
			$('#excelImportExportBtn').html('Importar');
		});

}

function downloadWorkingDayExcelExample(){
	location.href = 'assets/excel/exampleWorkingday.xlsx';
}

var excelFile = {};
function handleFile(e) {
	var files = e.target.files;
	var f = files[0];
	{
			var reader = new FileReader();
			reader.onload = function(e) {
					var data = e.target.result;
			    var arr = fixdata(data);
					try{
			    	excelFile = XLSX.read(btoa(arr), {type: 'base64'});
						removeMessage("#excelMessageDiv");
					} catch (e){
						document.getElementById("excelFile").value = '';
						excelFile = {}
						addMessage("#excelMessageDiv", 1, "El fichero seleccionado no es un fichero excel.");
					}
			};
			reader.readAsArrayBuffer(f);
	}
}

function fixdata(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
	return o;
}

// EXPORTAR EXCEL

function exportWorkingDay(){
		removeMessage("#excelMessageDiv");
		$('#excelModalLbl').html("Exportando jornadas");
		$('#excelPanelContent').html("Vas a exportar todas las jornadas");
		$('#excelImportExportBtn').html("Exportar");
		$('#excelImportExportBtn').attr( "onclick",`excelExportWorkingDay()`);
		$('#excelModal').modal('show');
}

function excelExportWorkingDay(){
	$('#excelImportExportBtn').prop('disabled', true);
	$('#excelImportExportBtn').html('<div class="loader"></div>');
	var inputsData = {};
	$.post('/excel/export/workingday', inputsData , function(data) {
		removeMessage("#excelMessageDiv");
		if(data.status==0){
			$('#excelModal').modal('hide');
		}else if (data.status==1){
			addMessage("#excelMessageDiv", data.status, data.message);
		}
	}).fail(function(jqXHR) {
		$('#excelImportExcportBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#excelMessageDiv",1,responseText.message);
	}).always(function() {
		$('#excelImportExportBtn').removeAttr('disabled');
		$('#excelImportExportBtn').html('Exportar');
	});
}
