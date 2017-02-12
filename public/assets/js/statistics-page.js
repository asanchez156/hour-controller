$( document ).ready(function() {
    initSearchModeDiv();
})
function initSearchModeDiv(){
  $(`.selectpicker[data-id="searchMode"]`).selectpicker({
      style: 'btn-primary',
      width: 'fit'
  });

  $('.selectpicker[data-id="searchMode"]').on('change', function(){
    clearStatisticsPanels();
    var selected = $(this).find("option:selected").val();
    console.log(selected);
    switch (selected) {
      case '1':
          showEmployeeSearchDiv();
          showCompanySearchDiv();
          showSearchButtonDiv();
          $('#statisticsSearchButton').attr( "onclick",`searchWorkingDayStatistics()`);
          $("#paleTablePanel").html("");
          break;
      case '2':
          hideEmployeeSearchDiv();
          showCompanySearchDiv();
          showSearchButtonDiv();
          $('#statisticsSearchButton').attr( "onclick",`searchPaleStatistics()`);
          break;
      default:
          hideCompanySearchDiv();
          hideEmployeeSearchDiv();
          hideSearchButtonDiv();
          $('#statisticsSearchButton').attr( "onclick",'');
          break;
    }
  });
}

function hideEmployeeSearchDiv(){
  $('#employeeSearchDiv').hide()
}

function showEmployeeSearchDiv(){
  $('#employeeSearchDiv').show()
}

function hideCompanySearchDiv(){
  $('#companySearchDiv').hide()
}

function showCompanySearchDiv(){
  $('#companySearchDiv').show()
}

function hideSearchButtonDiv(){
  $('#searchButtonDiv').hide()
}

function showSearchButtonDiv(){
  $('#searchButtonDiv').show()
}

function clearStatisticsPanels(){
  $("#paleTablePanel").html("");
  $("#workingDayTablePanel").html("");
}

function searchWorkingDayStatistics(){
		var companyId = $('#companySearch').val();
		var employeeId = $('#employeeSearch').val();

		var search = {
				companyId : companyId,
				employeeId : employeeId
		}

		$.post('/statistics/find/workingday', search , function(jsonData) {
				console.log(jsonData);
				fillWorkingDayStatistics(JSON.parse(jsonData));
		});;
}

function fillWorkingDayStatistics(data){
	$("#workingDayTablePanel").html("");
	data.forEach(function(company, index, array){
			$(`#workingDayTablePanel`).append(`<div id="workingDayTablePanelGroup${company.companyId}" class="panel-group"/>`);
			$(`#workingDayTablePanelGroup${company.companyId}`).append(`<div class="panel-heading"><h2>${company.companyName}</h2></div>`);
			$(`#workingDayTablePanelGroup${company.companyId}`).append(`<div id="workingDayTablePanelCompany${company.companyId}" class="panel panel-default"/>`);
			$(`#workingDayTablePanelCompany${company.companyId}`).append(`<div id="workingDayTablePanelCompany${company.companyId}Years" class="row"></div>`);
			company.result.forEach(function(yyyy, index, array){
					$(`#workingDayTablePanelCompany${company.companyId}Years`).append(`<div class="col-md-4 col-sm-6 col-xs-12">
							<div id="panelWorkingDayBodyCompany${company.companyId}Year${yyyy.year}" class="panel-body"/></div>`);

					$(`#panelWorkingDayBodyCompany${company.companyId}Year${yyyy.year}`).append(`<div class="panel-heading"><h3>Año ${yyyy.year}</h3></div>`);
					$(`#panelWorkingDayBodyCompany${company.companyId}Year${yyyy.year}`).append($(`<div class="panel-body">`)
                .append($(`<div class="table-responsive">`)
                .append($(`<table class="table" id="workingDayTableCompany${company.companyId}Year${yyyy.year}"/>`))));
					$(`#workingDayTableCompany${company.companyId}Year${yyyy.year}`).append($('<thead>')
              .append($('<tr>')
							.append($('<th>').append('Mes'))
              .append($('<th>').append('Total'))))
              .append($('<tbody>')
					);
					yyyy.month.forEach(function(mm, index, array){
						$(`#workingDayTableCompany${company.companyId}Year${yyyy.year}`).find('tbody')
						    .append($('<tr>')
						        .append($('<td>').append(monthString(index)))
										.append($('<td>').append(mm))
						    );
					});
					$(`#workingDayTableCompany${company.companyId}Year${yyyy.year}`).find('tbody')
							.append($('<tr>')
									.append($('<td>').append("<b>Total</b>"))
									.append($('<td>').append(`<b>${yyyy.total}</b>`))
					);
			});
	});
}

function searchPaleStatistics(){
		var companyId = $('#companySearch').val();

		var search = {
				companyId : companyId
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
			$(`#paleTablePanelCompany${company.companyId}`).append(`<div id="paleTablePanelCompany${company.companyId}Years" class="row"></div>`);
			company.result.forEach(function(yyyy, index, array){
					$(`#paleTablePanelCompany${company.companyId}Years`).append(`<div class="col-md-4 col-sm-6 col-xs-12">
							<div id="panelPaleBodyCompany${company.companyId}Year${yyyy.year}" class="panel-body"/></div>`);

					$(`#panelPaleBodyCompany${company.companyId}Year${yyyy.year}`).append(`<div class="panel-heading"><h3>Año ${yyyy.year}</h3></div>`);
					$(`#panelPaleBodyCompany${company.companyId}Year${yyyy.year}`).append($(`<div class="panel-body">`)
                .append($(`<div class="table-responsive">`)
                .append($(`<table class="table" id="paleTableCompany${company.companyId}Year${yyyy.year}"/>`))));
					$(`#paleTableCompany${company.companyId}Year${yyyy.year}`).append($('<thead>')
              .append($('<tr>')
							.append($('<th>').append('Mes'))
              .append($('<th>').append('Total'))))
              .append($('<tbody>')
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
