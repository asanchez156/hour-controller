$( document ).ready(function() {
    searchPaleStatistics();
})


function searchPaleStatistics(){
		var companyId = $('#companySearch').val();
		var employeeId = $('#employeeSearch').val();

		var search = {
				companyId : companyId,
				employeeId : employeeId
		}

		$.post('/statistics/find/pale', search , function(jsonData) {
				console.log(jsonData);
				fillPaleStatistics(JSON.parse(jsonData));
		});;
}

function fillPaleStatistics(data){
	$("#paleTablePanel").html("");
	data.forEach(function(company, index, array){
			$(`#paleTablePanel`).append(`<div id="paleTablePanelGroup${company.companyId}" class="panel-group"/>`);
			$(`#paleTablePanelGroup${company.companyId}`).append(`<div class="panel-heading"><h2>${company.companyName}</h2></div>`);
			$(`#paleTablePanelGroup${company.companyId}`).append(`<div id="paleTablePanelCompany${company.companyId}" class="panel panel-default"/>`);
			$(`#paleTablePanelCompany${company.companyId}`).append(`<div id="paleTablePanelCompanyYears${company.companyId}" class="row"></div>`);
			company.result.forEach(function(yyyy, index, array){
					$(`#paleTablePanelCompanyYears${company.companyId}`).append(`<div class="col-md-4 col-sm-6 col-xs-6">
							<div id="panelPaleBodyCompany${company.companyId}" class="panel panel-default"/>`);

					$(`#panelPaleBodyCompany${company.companyId}`).append(`<div class="panel-heading"><h3>Año ${yyyy.year}</h3></div>`);
					$(`#panelPaleBodyCompany${company.companyId}`).append(`<div class="panel-body"><table id="paleTableCompany${company.companyId}Year${yyyy.year}"/>`);
					$(`#paleTableCompany${company.companyId}Year${yyyy.year}`).append($('<theader>')
							.append($('<th>')
									.append('Mes')
							).append($('<th>')
									.append('Total')
							).append($('<tbody>'))
					);
					yyyy.month.forEach(function(mm, index, array){
						$(`#paleTableCompany${company.companyId}Year${yyyy.year}`).find('tbody')
						    .append($('<tr>')
						        .append($('<td>').append(monthString(index)))
										.append($('<td>').append(mm))
						    );
					});
					$(`#paleTableCompany${company.companyId}Year${yyyy.year}`).find('tbody')
							.append($('<tr>')
									.append($('<td>').append("<b>Total</b>"))
									.append($('<td>').append(`<b>${yyyy.total}</b>`))
					);
			});
	});
}


function monthString(mm){
	var month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
			"Julio", "Agosto", "Septiembre", "Octubre", "Nobiembre", "Diciembre"];
	return month[mm];
}
