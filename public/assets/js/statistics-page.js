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
  for (var employeeId in data) {
    var employee = data[employeeId];
    var employeeTotalHours = [];
			$(`#workingDayTablePanel`).append(`<div id="workingDayTablePanelGroup${employee.employeeId}" class="panel-group"/>`);
			$(`#workingDayTablePanelGroup${employee.employeeId}`).append(`<div class="panel-heading"><h2>${employee.employeeName} - ${employee.companyName}</h2></div>`);
			$(`#workingDayTablePanelGroup${employee.employeeId}`).append(`<div id="workingDayTablePanelEmployee${employee.employeeId}" class="panel panel-default"/>`);
			$(`#workingDayTablePanelEmployee${employee.employeeId}`).append(`<div id="workingDayTablePanelEmployee${employee.employeeId}Years" class="row"></div>`);
			employee.result.forEach(function(yyyy, index, array){
					$(`#workingDayTablePanelEmployee${employee.employeeId}Years`).append(`<div class="col-md-4 col-sm-6 col-xs-12">
							<div id="panelWorkingDayBodyEmployee${employee.employeeId}Year${yyyy.year}" class="panel-body"/></div>`);

					$(`#panelWorkingDayBodyEmployee${employee.employeeId}Year${yyyy.year}`).append(`<div class="panel-heading"><h3>Año ${yyyy.year}</h3></div>`);
					$(`#panelWorkingDayBodyEmployee${employee.employeeId}Year${yyyy.year}`).append($(`<div class="panel-body">`)
                .append($(`<div class="table-responsive">`)
                .append($(`<table class="table" id="workingDayTableEmployee${employee.employeeId}Year${yyyy.year}"/>`))));
					$(`#workingDayTableEmployee${employee.employeeId}Year${yyyy.year}`).append($('<thead>')
              .append($('<tr>')
							.append($('<th>').append('Mes'))
              .append($('<th>').append('Total jornada'))
              .append($('<th>').append('Total horas'))
              .append($('<th>').append('Diferencia'))))
              .append($('<tbody>')
					);
          employeeTotalHours.push({year:yyyy.year, totalWorkingday:yyyy.total[0] , totalHours:yyyy.total[1] , totalDifference:yyyy.total[2] });

					yyyy.month.forEach(function(mm, index, array){
						$(`#workingDayTableEmployee${employee.employeeId}Year${yyyy.year}`).find('tbody')
						    .append($('<tr>')
						        .append($('<td>').append(monthString(index)))
										.append($('<td>').append(mm[0]))
										.append($('<td>').append(mm[1]))
										.append($('<td>').append(mm[2])));
  					});
					$(`#workingDayTableEmployee${employee.employeeId}Year${yyyy.year}`).find('tbody')
							.append($('<tr>')
									.append($('<td>').append("<b>Total</b>"))
									.append($('<td>').append(`<b>${yyyy.total[0]}</b>`))
                  .append($('<td>').append(`<b>${yyyy.total[1]}</b>`))
                  .append($('<td>').append(`<b>${yyyy.total[2]}</b>`))
          );
      });

      //Years summary
      $(`#workingDayTablePanelEmployee${employee.employeeId}Years`).append(`<div class="col-md-4 col-sm-6 col-xs-12">
          <div id="panelWorkingDayBodyEmployee${employee.employeeId}AllYears" class="panel-body"/></div>`);
      $(`#panelWorkingDayBodyEmployee${employee.employeeId}AllYears`).append(`<div class="panel-heading">
          <h3>Total ${employee.employeeName}</h3></div>`);
      $(`#panelWorkingDayBodyEmployee${employee.employeeId}AllYears`).append($(`<div class="panel-body">`)
            .append($(`<div class="table-responsive">`)
            .append($(`<table class="table" id="workingDayTableEmployee${employee.employeeId}AllYears"/>`))));
      $(`#workingDayTableEmployee${employee.employeeId}AllYears`).append($('<thead>')
          .append($('<tr>')
          .append($('<th>').append('Año'))
          .append($('<th>').append('Total jornada'))
          .append($('<th>').append('Total horas'))
          .append($('<th>').append('Diferencia'))))
          .append($('<tbody>')
      );
      var total = {totalWorkingday:0, totalHours:0, totalDifference:0}
      employeeTotalHours.forEach(function(year, index, array){
          $(`#workingDayTableEmployee${employee.employeeId}AllYears`).find('tbody')
              .append($('<tr>')
                  .append($('<td>').append(year.year))
                  .append($('<td>').append(year.totalWorkingday))
                  .append($('<td>').append(year.totalHours))
                  .append($('<td>').append(year.totalDifference)));
          total.totalWorkingday +=year.totalWorkingday;
          total.totalHours +=year.totalHours;
          total.totalDifference +=year.totalDifference;
      });
      $(`#workingDayTableEmployee${employee.employeeId}AllYears`).find('tbody')
          .append($('<tr>')
              .append($('<td>').append('<b>TOTAL</b>'))
              .append($('<td>').append(`<b>${total.totalWorkingday}</b>`))
              .append($('<td>').append(`<b>${total.totalHours}</b>`))
              .append($('<td>').append(`<b>${total.totalDifference}</b>`)));
	}
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
  for (var companyId in data) {
      var company = data[companyId];
      var companyTotalPales = [];
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

          companyTotalPales.push({year:yyyy.year, totalPales:yyyy.total});

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

      //Years summary
      $(`#paleTablePanelCompany${company.companyId}Years`).append(`<div class="col-md-4 col-sm-6 col-xs-12">
          <div id="panelPaleBodyCompany${company.companyId}AllYears" class="panel-body"/></div>`);
      $(`#panelPaleBodyCompany${company.companyId}AllYears`).append(`<div class="panel-heading">
          <h3>Total ${company.companyName}</h3></div>`);
      $(`#panelPaleBodyCompany${company.companyId}AllYears`).append($(`<div class="panel-body">`)
            .append($(`<div class="table-responsive">`)
            .append($(`<table class="table" id="paleTableCompany${company.companyId}AllYears"/>`))));
      $(`#paleTableCompany${company.companyId}AllYears`).append($('<thead>')
          .append($('<tr>')
          .append($('<th>').append('Año'))
          .append($('<th>').append('Total pales'))))
          .append($('<tbody>')
      );
      var sumAllPales = 0;
      companyTotalPales.forEach(function(year, index, array){
          $(`#paleTableCompany${company.companyId}AllYears`).find('tbody')
              .append($('<tr>')
                  .append($('<td>').append(year.year))
                  .append($('<td>').append(year.totalPales)));
          sumAllPales +=year.totalPales;
      });
      $(`#paleTableCompany${company.companyId}AllYears`).find('tbody')
          .append($('<tr>')
              .append($('<td>').append('<b>TOTAL</b>'))
              .append($('<td>').append(`<b>${sumAllPales}</b>`)));
	}
}


function monthString(mm){
	var month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
			"Julio", "Agosto", "Septiembre", "Octubre", "Nobiembre", "Diciembre"];
	return month[mm];
}
