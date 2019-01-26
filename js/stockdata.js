
	var old_data = [];
	var new_data = [];
	var last_refresh = 'NEVER';
	var country;
        var stocks_data; 
function initClient() {
    var API_KEY = 'AIzaSyCr8id8gmmgCSr28P3PxWNiKvga6im2P1s'; // TODO: Update placeholder with desired API key.
    var CLIENT_ID = '288596195086-4kckr5a3iaus4qeo28t4qleoegq0bffd.apps.googleusercontent.com'; // TODO: Update placeholder with desired client ID.
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

    gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        })
        .then(function() {
            gapi.auth2.getAuthInstance()
                .isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance()
                .isSignedIn.get());
        });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        makeApiCall();
    }
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function makeApiCall() { //Google sheets api
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '11hJrOFXSRW0a7Nmfbi9yfQUfl6-kmTscyYOc-29w8gQ',
        // The A1 notation of the values to retrieve.
        range: 'Stock_Prices',   

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'UNFORMATTED_VALUE', // TODO: Update placeholder value.

        majorDimension: 'ROWS', // TODO: Update placeholder value.
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params); // to read data
    request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
        if (response.status == 200) {
            var all_data = response.result;
            stocks_data = all_data.valueRanges[0].values;
	          loadStockTable();
        }
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

var tableData = document.getElementById('stockTable');
var cell1, cell2, cell3, cell4;

loadStockTable = function() {
    var stock_count = 0; //validate country
	  var country_name1 = "India";//document.getElementById('country-1')
		var country_name2 ="";//document.getElementById('country-2')
    for (var k = 1; k < stocks_data.length; k += 1) {
			if(stocks_data[k][7] == country_name1 || stocks_data[k][7] == country_name2 ){
					if (stocks_data[k][0]) {
							var cmp = Math.round(parseFloat(stocks_data[k][6]) * 100) / 100;
							//main_p.innerHTML += '<div style="display: table-row">' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + portfolio_data[k][1] + '</div>' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + portfolio_data[k][2] + '</div>' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + current_value + '</div>' + '</div>';
							var row = tableData.insertRow(1);
							cell1 = row.insertCell(0);
							cell2 = row.insertCell(1);
							cell3 = row.insertCell(2);
							cell4 = row.insertCell(3);
							cell1.innerHTML = stocks_data[k][0];
							cell2.innerHTML = stocks_data[k][1];
							cell3.innerHTML = cmp;
							cell4.innerHTML = 0.00;
							stock_count += 1;
					}
					if (stock_count == 5) //keep 10 for round 2,3
							break;
			}
    }
    //showPort();
}
	/*function fetchCountryData(country) {
	 document.getElementById('overlap-1').style.display = 'none';
	 var xhttp = new XMLHttpRequest();
	 xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	    old_data = JSON.parse(this.responseText);
	    main_body = document.getElementById('main-body');
	    console.log(old_data);
	    for(i in old_data) {
	     main_body.innerHTML += '<div class="mb-row"><div class="mb-col1">' + old_data[i][0].toUpperCase() + '</div><div class="mb-col2">' + Math.round((old_data[i][1])*100)/100  + '</div><div class="mb-col3"></div></div>';
	    }
	    setInterval(function(){checkLastUpdate(country)}, 1000*20);
	   }
	  };
	  xhttp.open("GET", "data?country="+country, true);
	  xhttp.send();
	}*/
	function checkLastUpdate(country) {
	 var xhttp = new XMLHttpRequest();
	 xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	    if(last_refresh != this.responseText) {
	     updateCountryData(country);
	    }
	    last_refresh = this.responseText;
	   }
	  };
	  xhttp.open("GET", "last", true);
	  xhttp.send();
	}
	function reset() {
	 main_body_childer = document.getElementById('main-body').children;
	 for(j in main_body_childer) {
	  main_body_childer[j].style.background = 'inherit';
	  main_body_childer[j].style.color = 'black';
	  main_body_childer[j].children[2].innerHTML = '';
	 }
	}
	function updateCountryData(country) {
	 var xhttp = new XMLHttpRequest();
	 xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	    new_data = JSON.parse(this.responseText);
	    main_body_childer = document.getElementById('main-body').children;
	    for(i in new_data) {
	      curr = new_data[i][1];
	      old  = old_data[i][1];
	      if(curr < old) {
	       main_body_childer[i].children[2].innerHTML = '-' + Math.round((old-curr)*100)/100;
	       main_body_childer[i].children[1].innerHTML = Math.round((new_data[i][1])*100)/100;
	       main_body_childer[i].style.background = 'red';
	       main_body_childer[i].style.color = 'white';
	       ele = main_body_childer[i];
	       setTimeout(function(){reset();}, 1000*5);
	      }
	      if(curr > old) {
	       main_body_childer[i].children[2].innerHTML = '+' + Math.round((curr-old)*100)/100;
	       main_body_childer[i].children[1].innerHTML = Math.round((new_data[i][1])*100)/100;
	       main_body_childer[i].style.background = '#00ff4e';
	       main_body_childer[i].style.color = 'white';
	       ele = main_body_childer[i];
	       setTimeout(function(){reset();}, 1000*5);
	      }
	    }
	    old_data = new_data;
	   }
	  };
	  xhttp.open("GET", "data?country="+country, true);
	  xhttp.send();
	}
