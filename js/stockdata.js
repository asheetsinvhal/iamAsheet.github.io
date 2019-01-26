/* Stock table data that shows price changes*/

var old_data = [0];
var new_data = [0];
var last_refresh = 'NEVER';
var country_name1;
var country_name2;
var stocks_data; 
var tableData;
var cell1, cell2, cell3, cell4;
var updatePriceRun = 0;
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
        ranges: ['Stock_Prices'],   

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'UNFORMATTED_VALUE', // TODO: Update placeholder value.

    };

    var request = gapi.client.sheets.spreadsheets.values.batchGet(params); // to read data
    request.then(function(response) {
        if (response.status == 200) {
            var all_data = response.result;
            stocks_data = all_data.valueRanges[0].values;
        }
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}


loadStockTable = function() {
	  tableData = document.getElementById('stockTable').getElementsByTagName('tbody');
	  resetTable(tableData);
    var stock_count = 1; 
	  country_name1 = document.getElementById('country_name1').value;
	  country_name2 = document.getElementById('country_name2').value;
    for (var k = 1; k < stocks_data.length; k += 1) {
				if(stocks_data[k][10] == country_name1 || stocks_data[k][10] == country_name2 ){
								var cmp = Math.round(parseFloat(stocks_data[k][6]) * 100) / 100;
								//main_p.innerHTML += '<div style="display: table-row">' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + portfolio_data[k][1] + '</div>' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + portfolio_data[k][2] + '</div>' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + current_value + '</div>' + '</div>';
								var row = tableData.insertRow(stock_count);
								cell1 = row.insertCell(0);
								cell1.innerHTML = stocks_data[k][0];
								cell2 = row.insertCell(1);
								cell2.innerHTML = stocks_data[k][1];
								cell3 = row.insertCell(2);
								cell4 = row.insertCell(3);
								cell3.innerHTML = cmp;
								cell4.innerHTML = 0.00;
								stock_count += 1;
				}
				if( stock_count == 10){
					break;
				}
    }
	  /*if( updatePriceRun == 0){
			   updatePriceRun = 1;
			   setInterval(updatePriceData, 10000);
		}*/
}

/*	function checkLastUpdate(country) {
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
	}*/

	function resetTable(tableData) {
		 var rowCount = tableData.rows.length;
		for (var i = rowCount - 1; i > 0; i--) {
		    tableData.deleteRow(i);
		}
	}

	function updatePriceData() {
		  var stk_table = document.getElementById('stockTable');
			for (var r = 1, n = stk_table.rows.length; r < n; r+=1) {
						old_data.push(stk_table.rows[r].cells[2].innerHTML);
			}
			
		  makeApiCall();
		  for(var j = 1; j < stocks_data.length; j += 1){
				 if(stocks_data[j][10] == country_name1 || stocks_data[j][10] == country_name2 ){
					    var new_cmp= Math.round(parseFloat(stocks_data[j][6]) * 100)/100;
				 			new_data.push(new_cmp);
				 }
		  }
	    for(var i=1; i<new_data.length; i+=1 ) {
	      var curr = new_data[i];
	      var old  = old_data[i];
	      if(curr < old) {
					 stk_table.rows[i].cells[3].innerHTML = '&darr;' + Math.round((old-curr)*100)/100;
					 stk_table.rows[i].cells[3].style.background = '#e63900';
					 stk_table.rows[i].cells[3].style.color = '#f0f0f5';
	      }
	      if(curr > old) {
					 stk_table.rows[i].cells[3].innerHTML = '&uarr;' + Math.round((curr-old)*100)/100;
					 stk_table.rows[i].cells[3].style.background = '#47d147';
					 stk_table.rows[i].cells[3].style.color = '#f0f0f5';
	      }
	    }
	    //old_data = new_data;
	}
