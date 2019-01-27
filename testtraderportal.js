/**
 * TEST file for Trader
 */
//var team_data = {"1": ["Affluentia", 19909.610000000033], "2": ["Sparrow", 50000.0], "3": ["Valu-ed", 606212.3499999999], "4": ["The Brainaics", 392853.30000000005], "5": ["Addicts", 1327163.0], "6": ["Enigma", 632385.9000000001], "7": ["Think Big", 671726.9], "8": ["White collar crew", 132343.3], "9": ["Revolution", 832237.5], "10": ["Bright sparks", 262476.19999999995], "11": ["Fingeeks", 500593.5], "12": ["wizards", 374245.86], "13": ["Midnight warriors", 1844.6600000000326], "14": ["Achievers", 18007.300000000047], "15": ["Backbencher", 39599.39999999998], "16": ["Super Saiyan", 692623.6]};
var shares_data = [
    ["AUSTRALIA", "ANZ Group", "ANZ Group", 531.5024121295662, 1509],
    ["JAPAN", "Aerozone", "Aerozone", 2615.0, 2280],
    ["CHINA", "Alibaba", "Alibaba", 1609.8985679747072, 1910],
    ["USA", "Apple", "Apple", 2668.8899990642244, 2304],
    ["INDIA", "BHEL", "BHEL", 88.66002961856086, 764],
    ["AUSTRALIA", "BHP Billiton", "BHP Billiton", 1161.2500000036819, 1650],
    ["GERMANY", "BMW", "BMW AG", 941.2, 1960],
    ["ENGLAND", "Barclays", "Barclays", 1341.3, 2010],
    ["ENGLAND", "Brirish Airways", "British Airways", 1923.0, 2175],
    ["GERMANY", "Continental", "Continental", 1736.3639674699116, 2245],
    ["GERMANY", "Deutsche", "Deutsche AG", 1897.999999708374, 1960],
    ["ENGLAND", "Diageo", "Diageo", 1836.899401848831, 2235],
    ["USA", "Drone CO", "Drone CO", 2451.042508829539, 1944],
    ["USA", "Google", "Google", 382.0, 70],
    ["INDIA", "ICICI", "ICICI Bank", 165.69526690517813, 1355],
    ["INDIA", "Idea", "Idea Celluar", 421.3, 1778],
    ["CHINA", "Jigzena Ltd", "Jigzena Ltd", 904.0, 2330],
    ["AUSTRALIA", "K&S Corp.", "K&S Corporation Ltd.", 329.30000000000007, 1990],
    ["AUSTRALIA", "Karmanta Bank", "Karmanta Bank", 849.0, 1650],
    ["JAPAN", "Krayota Motor", "Krayota Motor Corp", 2149.0, 2210],
    ["USA", "Microsoft", "Microsoft Corp.", 1348.0, 1850],
    ["JAPAN", "Nippon Steel", "Nippon Steel", 1248.0, 1940],
    ["USA", "Petrologistics", "Petrologistic LP", 1437.5399999999984, 2080],
    ["INDIA", "Reliance", "Reliance Industries Limited", 1242.2500000112082, 1965],
    ["JAPAN", "Samurai Corp", "Samurai Corp", 1153.59, 2050],
    ["CHINA", "Sany Group", "Sany Group", 703.4000000000001, 1990],
    ["GERMANY", "Siemens", "Siemens AG", 450.3, 1340],
    ["CHINA", "Soft Bank", "Soft Bank", 400.8700000001181, 840],
    ["JAPAN", "Sony", "Sony", 1072.86, 1521],
    ["INDIA", "Sun Pharma", "Sun Pharma", 732.3799954811025, 1507],
    ["AUSTRALIA", "Telstra", "Telstra", 1289.9499647467978, 2158],
    ["ENGLAND", "Tesco", "Tesco", 999.66, 1680],
    ["ENGLAND", "Vodafone", "Vodafone", 1672.5799973146472, 1735],
    ["GERMANY", "Volkswagen", "Volkswagen AG", 1848.8986578554513, 2310],
    ["CHINA", "Xiomi", "Xiomi", 1410.0, 2050]
];
var country_data = {
    "AUSTRALIA": ["ANZ", "BHP", "KAS", "KRMB", "TELS"],
    "ENGLAND": ["BCL", "BAR", "DAG", "TSCO", "VODA"],
    "USA": ["APPL", "DRCO", "GOOG", "MSFT", "PLP"],
    "INDIA": ["BHEL", "ICIC", "IDEA", "RIL", "SUN"],
    "CHINA": ["ALI", "JIGZ", "SANG", "SOFT", "XOMI"],
    "GERMANY": ["BMW", "CONT", "DESH", "SMNS", "VWG"],
    "JAPAN": ["ARZ", "KMC", "NPPO", "SAM", "SONY"]
};

var country;
var stocks;
var portfolio_data;
var team_data;
var upper_ckt;
var lower_ckt;
var max_stk_qty = 0;

function initClient() {
    var API_KEY = 'AIzaSyCr8id8gmmgCSr28P3PxWNiKvga6im2P1s'; // TODO: Update placeholder with desired API key.
    var CLIENT_ID = '288596195086-4kckr5a3iaus4qeo28t4qleoegq0bffd.apps.googleusercontent.com'; // TODO: Update placeholder with desired client ID.

    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
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
    gapi.auth2.getAuthInstance()
        .signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance()
        .signOut();
}

function makeApiCall() { //Google sheets api
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '11hJrOFXSRW0a7Nmfbi9yfQUfl6-kmTscyYOc-29w8gQ',
        // The A1 notation of the values to retrieve.
        ranges: ['Stock_Names', 'Stock_Prices', 'PortfolioR1', 'TeamScoresR1'],
        //ranges: ['Stock_Names','Stock_Prices','PortfolioR2','TeamScoresR2'],  // For ROund2
        //ranges: ['Stock_Names','Stock_Prices','PortfolioR3','TeamScoresR3'],  // For ROund3    

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'UNFORMATTED_VALUE', // TODO: Update placeholder value.

        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        dateTimeRenderOption: 'FORMATTED_STRING', // TODO: Update placeholder value.
    };

    var request = gapi.client.sheets.spreadsheets.values.batchGet(params); // to read data
	return new Promise((resolve, reject) => {
		 request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
        if (response.status == 200) {
            var all_data = response.result;
            country = all_data.valueRanges[0].values;
            stocks = all_data.valueRanges[1].values;
            portfolio_data = all_data.valueRanges[2].values;
            team_data = all_data.valueRanges[3].values;
        }
			 resolve();
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
			 reject();
    });
	});
}

putTeamData = function() { //ELIMINATE
    hidePort();
};

putCountryData = function() { //change to putTeamData
    team_id = document.getElementById('team_id')
        .value;
    country_name = document.getElementById('country_name')
        .value;
    // Team name  & Balance 
    document.getElementById('team_name')
        .innerHTML = team_data[team_id][1];
    document.getElementById('team_balance')
        .innerHTML = Math.round(team_data[team_id][8] * 100) / 100;

    main_content = document.getElementById('main');
    main_content.innerHTML = '<option>-</option>';
    for (var i in country_data[country_name]) {
        main_content.innerHTML += '<option>' + country_data[country_name][i] + '</option>';
    }
    team_id = document.getElementById('team_id')
        .value;
    if (team_id != -1 && country_name != -1) {
        getPortfolio();
    }
}

getPortfolio = function() {
    main_p = document.getElementById('main_p');
    main_p.innerHTML = '';
    main_p.innerHTML += '<div style="display: table">';
    main_p.innerHTML += '<div style="display: table-row"><div style="display: table-cell;padding: 4px;border: 1px solid black;">StockID</div><div style="display: table-cell;padding: 4px;border: 1px solid black;"> QTY </div> <div style="display: table-cell;padding: 4px;border: 1px solid black;"> VALUE </div></div> '
    var stock_count = 0;
    for (var k = 1; k < portfolio_data.length; k += 1) {
        if (portfolio_data[k][0] == team_id) {
            var current_value = Math.round(parseFloat(portfolio_data[k][4]) * 100) / 100;
            main_p.innerHTML += '<div style="display: table-row">' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + portfolio_data[k][1] + '</div>' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + portfolio_data[k][2] + '</div>' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' + current_value + '</div>' + '</div>';
            stock_count += 1;
        }
        if (stock_count == 5)
            break;
    }
    main_p.innerHTML += '</div>';
    showPort();
}

function showPort() {
    document.getElementById('portfolio-popup')
        .style.display = 'block';
}

function hidePort() {
    document.getElementById('portfolio-popup')
        .style.display = 'none';
}
/*
function refreshTeamData() { //write to sheets api
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            team_data = JSON.parse(this.responseText);
        }
    }
    xhttp.open("GET", "/teamdata", true);
    xhttp.send();
}*/


function updateMarketPrice() { //Google sheets api
    shares = [];
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '11hJrOFXSRW0a7Nmfbi9yfQUfl6-kmTscyYOc-29w8gQ',
        // The A1 notation of the values to retrieve.
        ranges: 'Stock_Prices', // TODO: Update placeholder value.

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'UNFORMATTED_VALUE', // TODO: Update placeholder value.

        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        dateTimeRenderOption: 'FORMATTED_STRING', // TODO: Update placeholder value.
    };

    var request = gapi.client.sheets.spreadsheets.values.batchGet(params); // to read data
    request.then(function(response) {
        var stk_price = 0;
        var stockId = document.getElementById('main')
            .value;
        if (response.status == 200 && response.result.valueRanges[0] != null) {
            shares = response.result.valueRanges[0].values; // refreshed values of stocks
            for (var k = 1; k < shares.length; k += 1) {
                if (shares[k][0] == stockId) {
                    max_stk_qty = shares[k][5];
                    stk_price = shares[k][6];
                    break;
                }
            }
            upper_ckt = Math.round(parseFloat(1.20 * stk_price) * 100) / 100;
            lower_ckt = Math.round(parseFloat(0.80 * stk_price) * 100) / 100;
            document.getElementById('price')
                .value = stk_price ? Math.round(parseFloat(stk_price) * 100) / 100 : 0;
            document.getElementById('quantity')
                .setAttribute('placeholder', 'MAX BUY ' + max_stk_qty ? max_stk_qty : 0);
        }
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

/* var $form = $('form#test-form'),
      url = 'https://script.google.com/a/imi.edu/macros/s/AKfycbyAeh_5252xghfdNs1Je9MlLQ9OmiuKz-TUxO7fmzkjCAqJdha_/exec' //App script url

	$('#submit-form').on('click', function(e) {
	  e.preventDefault();
	  var jqxhr = $.ajax({
	    url: url,
	    method: "GET",
	    dataType: "json",
	    data: $form.serializeObject()
	  }).success(
	    // do something
	  );
	})*/
stock_action = function(buttonId) {
    var teamId = document.getElementById('team_id')
        .value;
    var country = document.getElementById('country_name')
        .value;
    var stockId = document.getElementById('main')
        .value; //main-> stock ID
    var qty = document.getElementById('quantity')
        .value;
    var price = document.getElementById('price')
        .value;
    if (teamId == "-1" || country == "-1" || stockId == "" || qty == "" || price == "") {
        showNotif('	DATA MISSING!');
        return;
    }
    showNotif('PLACING ' + buttonId + ' ORDER');
    if (parseFloat(price) > upper_ckt || parseFloat(price) < lower_ckt) {
        showNotif('PRICE EXCEEDS ±20% !');
        return;
    }

    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '11hJrOFXSRW0a7Nmfbi9yfQUfl6-kmTscyYOc-29w8gQ',
        // The A1 notation of the values to retrieve.
        range: 'TestUIn1!A2', // TODO: Update placeholder value.
        // How the input data should be interpreted.
        valueInputOption: 'USER_ENTERED', // TODO: Update placeholder value.
    };
    if (buttonId == "BUY") {
        var valueRangeBody = {
            "values": [
                [
                    qty, price, 0, 0, stockId, teamId
                ]
            ]
        };
    } else {
        var valueRangeBody = {
            "values": [
                [
                    0, 0, qty, price, stockId, teamId
                ]
            ]
        };
    }

    var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    request.then(function(response) {
            if (response.status == 200) {
                showNotif(buttonId + ' ORDER SUCCESFUL');
						
								makeApiCall().then(putCountryData);
							
                //setTimeout( putCountryData, 1000);
            } else {
                showNotif('! TRY AGAIN !');
                //setTimeout(function() {
                // document.getElementById('team_name').innerHTML = '';
                // document.getElementById('team_balance').innerHTML = '';
                //  hidePort()}, 2000);
            }
            showPort();
	    			document.getElementById('country_name').value = '';
            document.getElementById('main').value = -1;
            document.getElementById('quantity').setAttribute('placeholder', '');
            document.getElementById('quantity').value = '';
            document.getElementById('team_id').value = '';
            document.getElementById('price').value = '';
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
	
}

function showNotif(text, background = "white", color = "black") {
    if (document.getElementById('notif').style.display == 'block') {
        setTimeout(function() {
            showNotif(text, background)
        }, 2000);
    } else {
        document.getElementById('notif').innerHTML = text;
        document.getElementById('notif').style.background = background;
        document.getElementById('notif').style.display = 'block';
        document.getElementById('notif').style.color = color;
        setTimeout(function() {
            document.getElementById('notif').style.display = 'none'
        }, 1800);
    }
}

/*var myVar = setInterval(myTimer, 1000);
	
	var $form = $('form#test-form'),
      scriptURL = 'https://script.google.com/a/imi.edu/macros/s/AKfycbyAeh_5252xghfdNs1Je9MlLQ9OmiuKz-TUxO7fmzkjCAqJdha_/exec' //App script url
	const form = document.forms['contact'] 
	form.addEventListener('submit', e => {  
	   e.preventDefault()  
	   fetch(scriptURL, { method: 'POST', body: new FormData(form)})  
	    .then(response => console.log('Success!', response))  
	    .catch(error => console.error('Error!', error.message))  
	 })  */
