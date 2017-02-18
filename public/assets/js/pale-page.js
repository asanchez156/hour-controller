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

var paleTable = $('#paleTable').DataTable( {
        "scrollY":        "200px",
        "scrollCollapse": true,
        columns: [
            { title : "ID PALE", data: "paleId", visible: false },
            { title : "ID EMPRESA", data: "companyId", visible: false },
            { title : "EMPRESA", data: "companyName" },
            { title : "FECHA", data: "dateString" },
            { title : "FECHA_DB", data: "date", visible: false  },
            { title : "PALES", data: "pales" },
            { title : "NOTAS", data: "description" },
            { title : "FUNCIONES", data: "functions" }
        ],
        "language": {
            "url": "/assets/locales/dataTables-spanish.json"
        },
        select: true
    } );

var paleRow = {}

function setTableRowDataAvailable(){
	$('#paleTable tbody').on( 'click', 'button', function () {
	        paleRow = paleTable.row( $(this).parents('tr') ).data();
			fillPaleEditPanelComponents();
	    } );
}

function populatePaleDatatable(jsonData){
    paleTable.clear();
    paleTable.rows.add(JSON.parse(jsonData));
    paleTable.draw();
}

function searchPale(){
	var initialDate = $(`.date[data-id="datepickerInitial"]`).datepicker("getUTCDate");
	var endDate = $(`.date[data-id="datepickerEnd"]`).datepicker("getUTCDate");
	var companyId = $('#companySearch').val();

	var search = {
		companyId : companyId,
		initialDate : initialDate,
		endDate : endDate
	}

	$.post('/pale/find', search , function(jsonData) {
		populatePaleDatatable(jsonData);
	});;
}

function fillPaleEditPanelComponents(){
	$(`#paleForm .selectpicker[data-id="company"]`).selectpicker('val', paleRow.companyId);
	$(`#paleForm .selectpicker[data-id="company"]`).prop('disabled', true);
	$(`#paleForm .selectpicker[data-id="company"]`).selectpicker('refresh');

	var date = new Date(paleRow.date.substr(0,4),parseInt(paleRow.date.substr(5,2))-1,paleRow.date.substr(8,2));
	$(`#paleForm .date[data-id="datepicker"]`).datepicker('update', date);
	$(`#paleForm #date`).prop('disabled', true);
	$(`#paleForm #description`).val(paleRow.description);
}

function newPale(){
	removeMessage("#paleMessageDiv");
	$('#paleModalLbl').html("Creando pale");
	$('#savePaleBtn').html("Guardar");
	$('#palePanelContent').html(getModalPanelContent());
	loadPale("");
	loadDate("");
	loadCompanySelect("");
	$('#savePaleBtn').attr( "onclick",`saveNewPale()`);
	$('#paleModal').modal('show');
}

function editPale(id){
	removeMessage("#paleMessageDiv");
	$('#paleModalLbl').html("Editando pale");
	$('#savePaleBtn').html("Guardar");
	$('#palePanelContent').html(getModalPanelContent());
	loadPale("");
	loadDate("");
	loadCompanySelect("");
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
		companyId : $(`#paleForm #company`).val(),
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
		pales : $(`#paleForm #pales`).val(),
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

function getModalPanelContent(){
	return `<div class="row">
			<div class="form-group">
				<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<label for="company">Empresa</label>
				</div>
				<div class="form-item col-md-3 col-sm-6 col-xs-6" id="companySelectDiv">
						<input type="text" class="form-control" id="company" name="company">
				</div>
				<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<label for="date">Fecha</label>
				</div>
				<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<div class="input-group date" data-provide="datepicker" data-id="datepicker">
								<input type="text" class="form-control" id="date" name="date">
								<div class="input-group-addon">
										<span class="glyphicon glyphicon-th"></span>
								</div>
						</div>
				</div>
				<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<label for="pales">Numero de pales</label>
				</div>
				<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<div class="input-group">
								<span class="input-group-btn">
										<button type="button" class="btn btn-danger btn-number" data-type="minus" data-field="pales">
												<span class="glyphicon glyphicon-minus"></span>
										</button>
									</span>
								<input id="pales" name="pales" class="form-control input-number" value="11" min="1" max="20" type="text">
								<span class="input-group-btn">
										<button type="button" class="btn btn-success btn-number" data-type="plus" data-field="pales">
												<span class="glyphicon glyphicon-plus"></span>
										</button>
								 </span>
						</div>
				</div>
				<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<label for="description">Nota</label>
				</div>
				<div class="form-item col-md-3 col-sm-6 col-xs-6">
						<input type="text" class="form-control" id="description" name="description">
				</div>
			</div>
	</div>`;
}
