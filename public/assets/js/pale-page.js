$( document ).ready(function() {
	$('#newPalePanelCounter').val(0);
    loadDate("Initial");
    loadDate("End");
    $(`.date[data-id="datepickerInitial"]`).datepicker('update', '');
    $(`.date[data-id="datepickerEnd"]`).datepicker('update', '');
    //Add to Employees by default

    setTableRowDataAvailable();
    searchPale();

})

var paleTable = $('#PaleTable').DataTable( {
        "scrollY":        "200px",
        "scrollCollapse": true,
        columns: [
            { title : "ID PALE", data: "paleId", visible: false },
            { title : "ID EMPRESA", data: "companyId", visible: false },
            { title : "EMPRESA", data: "companyName" },
            { title : "FECHA", data: "dateString" },
            { title : "FECHA_DB", data: "date", visible: false  },
            { title : "PALE", data: "pale" },
            { title : "", data: "functions" }
        ],
        "language": {
            "url": "/assets/locales/dataTables-spanish.json"
        },
        select: true
    } );

var paleRow = {}

function setTableRowDataAvailable(){
	$('#PaleTable tbody').on( 'click', 'button', function () {
	        paleRow = paleTable.row( $(this).parents('tr') ).data();
			fillPaleEditPanelComponents();
	    } );
}

function searchEmployees(callback){
	$.get("/employee/find", function(data) {
		listEmployee = JSON.parse(data);
		callback();
	}).fail(function(jqXHR) {
	});
}

function populatePaleDatatable(jsonData){
    paleTable.clear();
    paleTable.rows.add(JSON.parse(jsonData));
    paleTable.draw();
}

function searchPale(){
	var initialDate = $(`.date[data-id="datepickerInitial"]`).datepicker("getUTCDate");
	var endDate = $(`.date[data-id="datepickerEnd"]`).datepicker("getUTCDate");

	var search = {
		initialDate : initialDate,
		endDate : endDate
	}

	$.post('/pale/find', search , function(jsonData) {
		populatePaleDatatable(jsonData);
	});;
}

function fillPaleEditPanelComponents(){
	$(`#paleForm .selectpicker[data-id="employee${paleRow.paleId}"]`).selectpicker('val', paleRow.employeeId);
	$(`#paleForm .selectpicker[data-id="employee${paleRow.paleId}"]`).prop('disabled', true);
	$(`#paleForm .selectpicker[data-id="employee${paleRow.paleId}"]`).selectpicker('refresh');

	var date = new Date(paleRow.date.substr(0,4),parseInt(paleRow.date.substr(5,2))-1,paleRow.date.substr(8,2));
	$(`#paleForm .date[data-id="datepicker${paleRow.paleId}"]`).datepicker('update', date);
	$(`#paleForm #date${paleRow.paleId}`).prop('disabled', true);
	$(`#paleForm #description${paleRow.paleId}`).val(paleRow.description);
}

function newPale(){
	removeMessage("#paleMessageDiv");
	$('#paleModalLbl').html("Creando pale");
	$('#savePaleBtn').html("Guardar");
	loadHour("");
	loadDate("");
	$('#savePaleBtn').attr( "onclick",`saveNewPale()`);
	$('#paleModal').modal('show');
}

function editPale(id){
	removeMessage("#paleMessageDiv");
	$('#paleModalLbl').html("Editando pale");
	$('#savePaleBtn').html("Guardar");
	loadHour("");
	loadDate("");
	$('#savePaleBtn').attr( "onclick",`saveEditPale(${id})`);
	$('#paleModal').modal('show');
}

function deletePale(id){
	removeMessage("#paleMessageDiv");
	$('#paleModalLbl').html("Eliminando pale");
	$('#savePaleBtn').html("Eliminar");
	$('#palePanelContent').html("El pale va a ser eliminado. ¿Estás seguro?");
	$('#savePaleBtn').attr( "onclick",`saveDeletePale(${id})`);
	$('#paleModal').modal('show');
}

function saveNewPale(){
	$('#savePaleBtn').prop('disabled', true);
	$('#savePaleBtn').html('<div class="loader"></div>');
	var inputsData = {
		pales : $(`#paleForm #pales`).val(),
		date: $(`#paleForm .date[data-id="datepicker"]`).datepicker("getUTCDate"),
		description: $(`#paleForm #description`).val()
	};
	console.log(inputsData);
	$.post('/pale/create', inputsData , function(data) {
		removeMessage("#newPaleMessageDiv");
		if(data.status==0){
			searchPale();
			$('#paleModal').modal('hide');
		}else if (data.status==1){
			addMessage("#paleMessageDiv", data.status, data.message);
		}
	}).fail(function(jqXHR) {
		$('#savePaleBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#paleMessageDiv",1,responseText.message);
	}).always(function() {
		$('#savePaleBtn').removeAttr('disabled');
		$('#savePaleBtn').html('Guardar');
	});
}

function saveEditPale(id){
	$('#savePaleBtn').prop('disabled', true);
	$('#savePaleBtn').html('<div class="loader"></div>');

	var inputsData = {
		paleId: id,
		pales : $(`#paleForm pales`).val(),
		description: $(`#paleForm #description`).val()
	};
	console.log(inputsData);
	$.post('/pale/update', inputsData , function(data) {
		removeMessage("#paleMessageDiv");
		if(data.status==0){
			searchPale();
			$('#paleModal').modal('hide');
		} else if (data.status==1){
			addMessage("#paleMessageDiv", data.status, data.message);
		}
	}).fail(function(jqXHR) {
		$('#savePaleBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#paleMessageDiv",1,responseText.message);
	}).always(function() {
		$('#savePaleBtn').removeAttr('disabled');
		$('#savePaleBtn').html('Guardar');
	});
}

function saveDeletePale(id){
	$('#savePaleBtn').prop('disabled', true);
	$('#savePaleBtn').html('<div class="loader"></div>');

	$.post('/pale/delete', {paleId : id} , function(data) {
		removeMessage("#paleErrorsDiv");
		if(data.status==0){
			searchPale();
			$('#paleModal').modal('hide');
		}else if (data.status==1){
			addMessage("#paleMessageDiv",data.status,responseText.message);
		}
	}).done(function() {
	}).fail(function(jqXHR) {
		$('#savePaleBtn').prop('enable', true);
		var responseText =  JSON.parse(jqXHR.responseText);
		addMessage("#paleMessageDiv",1,responseText.message);
	}).always(function() {
		$('#savePaleBtn').removeAttr('disabled');
		$('#savePaleBtn').html('Eliminar');
	});
}
