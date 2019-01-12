/**
 * TEST file for Trader
 */

 //var team_data = {"1": ["Affluentia", 19909.610000000033], "2": ["Sparrow", 50000.0], "3": ["Valu-ed", 606212.3499999999], "4": ["The Brainaics", 392853.30000000005], "5": ["Addicts", 1327163.0], "6": ["Enigma", 632385.9000000001], "7": ["Think Big", 671726.9], "8": ["White collar crew", 132343.3], "9": ["Revolution", 832237.5], "10": ["Bright sparks", 262476.19999999995], "11": ["Fingeeks", 500593.5], "12": ["wizards", 374245.86], "13": ["Midnight warriors", 1844.6600000000326], "14": ["Achievers", 18007.300000000047], "15": ["Backbencher", 39599.39999999998], "16": ["Super Saiyan", 692623.6]};
 var shares_data = [["AUSTRALIA", "ANZ Group", "ANZ Group", 531.5024121295662, 1509], ["JAPAN", "Aerozone", "Aerozone", 2615.0, 2280], ["CHINA", "Alibaba", "Alibaba", 1609.8985679747072, 1910], ["USA", "Apple", "Apple", 2668.8899990642244, 2304], ["INDIA", "BHEL", "BHEL", 88.66002961856086, 764], ["AUSTRALIA", "BHP Billiton", "BHP Billiton", 1161.2500000036819, 1650], ["GERMANY", "BMW", "BMW AG", 941.2, 1960], ["ENGLAND", "Barclays", "Barclays", 1341.3, 2010], ["ENGLAND", "Brirish Airways", "British Airways", 1923.0, 2175], ["GERMANY", "Continental", "Continental", 1736.3639674699116, 2245], ["GERMANY", "Deutsche", "Deutsche AG", 1897.999999708374, 1960], ["ENGLAND", "Diageo", "Diageo", 1836.899401848831, 2235], ["USA", "Drone CO", "Drone CO", 2451.042508829539, 1944], ["USA", "Google", "Google", 382.0, 70], ["INDIA", "ICICI", "ICICI Bank", 165.69526690517813, 1355], ["INDIA", "Idea", "Idea Celluar", 421.3, 1778], ["CHINA", "Jigzena Ltd", "Jigzena Ltd", 904.0, 2330], ["AUSTRALIA", "K&S Corp.", "K&S Corporation Ltd.", 329.30000000000007, 1990], ["AUSTRALIA", "Karmanta Bank", "Karmanta Bank", 849.0, 1650], ["JAPAN", "Krayota Motor", "Krayota Motor Corp", 2149.0, 2210], ["USA", "Microsoft", "Microsoft Corp.", 1348.0, 1850], ["JAPAN", "Nippon Steel", "Nippon Steel", 1248.0, 1940], ["USA", "Petrologistics", "Petrologistic LP", 1437.5399999999984, 2080], ["INDIA", "Reliance", "Reliance Industries Limited", 1242.2500000112082, 1965], ["JAPAN", "Samurai Corp", "Samurai Corp", 1153.59, 2050], ["CHINA", "Sany Group", "Sany Group", 703.4000000000001, 1990], ["GERMANY", "Siemens", "Siemens AG", 450.3, 1340], ["CHINA", "Soft Bank", "Soft Bank", 400.8700000001181, 840], ["JAPAN", "Sony", "Sony", 1072.86, 1521], ["INDIA", "Sun Pharma", "Sun Pharma", 732.3799954811025, 1507], ["AUSTRALIA", "Telstra", "Telstra", 1289.9499647467978, 2158], ["ENGLAND", "Tesco", "Tesco", 999.66, 1680], ["ENGLAND", "Vodafone", "Vodafone", 1672.5799973146472, 1735], ["GERMANY", "Volkswagen", "Volkswagen AG", 1848.8986578554513, 2310], ["CHINA", "Xiomi", "Xiomi", 1410.0, 2050]];
 var country_data = {"AUSTRALIA": ["ANZ Group", "BHP Billiton", "K&S Corporation Ltd.", "Karmanta Bank", "Telstra"], "ENGLAND": ["Barclays", "British Airways", "Diageo", "Tesco", "Vodafone"], "USA": ["Apple", "Drone CO", "Google", "Microsoft Corp.", "Petrologistic LP"], "INDIA": ["BHEL", "ICICI Bank", "Idea Celluar", "Reliance Industries Limited", "Sun Pharma"], "CHINA": ["Alibaba", "Jigzena Ltd", "Sany Group", "Soft Bank", "Xiomi"], "GERMANY": ["BMW AG", "Continental", "Deutsche AG", "Siemens AG", "Volkswagen AG"], "JAPAN": ["Aerozone", "Krayota Motor Corp", "Nippon Steel", "Samurai Corp", "Sony"]}
 
 var country;
 var stocks;
 var team_data;
 function initClient() {
     var API_KEY = 'AIzaSyCr8id8gmmgCSr28P3PxWNiKvga6im2P1s';  // TODO: Update placeholder with desired API key.
     var CLIENT_ID = '288596195086-4kckr5a3iaus4qeo28t4qleoegq0bffd.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

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
     }).then(function() {
       gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
       updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
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
       spreadsheetId: '1f_loFgviaOT7HavKmgFwn02a1zbFG66GHQ5qvOF6Wj8', 
       // The A1 notation of the values to retrieve.
       ranges: ['Stock_Names','Stock_Prices','Portfolios','TeamScores'],  // TODO: Update placeholder value.

       // How values should be represented in the output.
       // The default render option is ValueRenderOption.FORMATTED_VALUE.
       valueRenderOption: 'UNFORMATTED_VALUE',  // TODO: Update placeholder value.

       // How dates, times, and durations should be represented in the output.
       // This is ignored if value_render_option is
       // FORMATTED_VALUE.
       // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
       dateTimeRenderOption: 'FORMATTED_STRING',  // TODO: Update placeholder value.
     };

     var request = gapi.client.sheets.spreadsheets.values.batchGet(params); // to read data
     request.then(function(response) {
       // TODO: Change code below to process the `response` object:
       console.log(response.result);
       if(response.status == 200){
    	   var all_data = response.result;
    		country = all_data.valueRanges[0].values;
    		stocks =  all_data.valueRanges[1].values;
    		portfolio_data = all_data.valueRanges[2].values;
    		team_data = all_data.valueRanges[3].values;
       }
     }, function(reason) {
       console.error('error: ' + reason.result.error.message);
     });
   } 
  
 putTeamData = function() {
    team_id = document.getElementById('team_id').value;
    document.getElementById('team_name').innerHTML = team_data[team_id][1];
    document.getElementById('team_balance').innerHTML  = Math.round(team_data[team_id][2]*100)/100;
 };
 
 putCountryData = function() {
    country_name = document.getElementById('country_name').value;
    main_content = document.getElementById('main');
    main_content.innerHTML = '<option>-</option>';
    for(i in country_data[country_name]) {
           main_content.innerHTML += '<option>' + country_data[country_name][i] + '</option>';
    }
    team_id = document.getElementById('team_id').value;
    console.log(team_id);
    if(team_id != -1 && country_name != -1) { 
    	getPortfolio(); 
    }
 }
 
 getPortfolio = function() {
	 main_p = document.getElementById('main_p');
	  main_p.innerHTML = '';
	 /** var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {*/
		   
	   // portfolio_data = JSON.parse(this.responseText);
	    main_p.innerHTML += '<div style="display: table">';
	    for(i=1; i <= portfolio_data.length; i++) {
	       main_p.innerHTML += '<div style="display: table-row">' +
	       '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' +
	       portfolio_data.values[i][1] +
	       '</div>' + '<div style="display: table-cell;padding: 4px;border: 1px solid black;">' +
	       portfolio_data.values[i][2] +
	       '</div>' + '</div>';
	    }
	    main_p.innerHTML += '</div>';
	    showPort();
	    /** }
	  };
	  xhttp.open("GET", "portfolio?c="+country_name+"&t="+team_id, true);
	  xhttp.send();*/
	 }
 
 function showPort() { document.getElementById('portfolio-popup').style.display = 'block'; }
 function hidePort() { document.getElementById('portfolio-popup').style.display = 'none'; }
 
 function refreshTeamData() {
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	    team_data = JSON.parse(this.responseText);
	   }
	  }
	  xhttp.open("GET", "/teamdata", true);
	  xhttp.send();
}
 
 function showNotif(text, background="white",color="black") {
	  if(document.getElementById('notif').style.display == 'block') {
	   setTimeout(function(){showNotif(text, background)},2000);
	  } else {
	   document.getElementById('notif').innerHTML = text.toUpperCase();
	   document.getElementById('notif').style.background = background;
	   document.getElementById('notif').style.display = 'block';
	   document.getElementById('notif').style.color = color;
	   setTimeout(function(){document.getElementById('notif').style.display = 'none'},2000);
	  }
 }
	 

 function updateMarketPrice() {
  stock = document.getElementById('main').value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
    document.getElementById('price').value = Math.round(parseFloat(this.responseText.split('|')[0])*100)/100;;
    document.getElementById('quantity').setAttribute('placeholder','MAX BUY '+this.responseText.split('|')[1]);
   }
  };
  xhttp.open("GET", "mrkt?stock="+encodeURIComponent(stock), true);
  xhttp.send();
 }
 
 
 buy_stock = function() {    //buying
	  showNotif('PLACING BUY ORDER');
	  stock = document.getElementById('main').value;
	  quantity = document.getElementById('quantity').value;
	  price = document.getElementById('price').value;
	  team_id = document.getElementById('team_id').value;
	  country = document.getElementById('country_name').value;
	  document.getElementById('main').value = -1;
	  document.getElementById('price').value = '';
	  document.getElementById('quantity').setAttribute('placeholder','');
	  document.getElementById('quantity').value = '';
	  document.getElementById('country_name').value = '';
	  document.getElementById('team_id').value = '';
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	    getPortfolio();
	    response = this.responseText;
	    if(!response.includes('ERROR')) { document.getElementById('team_balance').innerHTML  = Math.round(parseFloat(response)*100)/100; showNotif('BUY ORDER SUCCESFUL');}
	    else { showNotif(response, "#ff0035", "white"); }
	    setTimeout(function() {document.getElementById('team_name').innerHTML = '';document.getElementById('team_balance').innerHTML = '';hidePort()}, 5000);
	    refreshTeamData();
	   }
	  };
	  xhttp.open("GET", "buy?stock="+encodeURIComponent(stock)+"&quantity="+quantity+"&price="+price+"&team_id="+team_id+"&country="+country, true);
	  xhttp.send();
 }
 sell_stock = function() { //selling
	  showNotif('PLACING SELL ORDER');
	  stock = document.getElementById('main').value;
	  quantity = document.getElementById('quantity').value;
	  price = document.getElementById('price').value;
	  team_id = document.getElementById('team_id').value;
	  country = document.getElementById('country_name').value;
	  document.getElementById('main').value = -1;
	  document.getElementById('price').value = '';
	  document.getElementById('quantity').setAttribute('placeholder','');
	  document.getElementById('quantity').value = '';
	  document.getElementById('country_name').value = '';
	  document.getElementById('team_id').value = '';
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	    getPortfolio();
	    response = this.responseText;
	    if(!response.includes('ERROR')) { document.getElementById('team_balance').innerHTML  = Math.round(parseFloat(response)*100)/100;showNotif('SELL ORDER SUCCESFUL'); }
	    else { showNotif(response, "#ff0035", "white"); }
	    setTimeout(function() {document.getElementById('team_name').innerHTML = '';document.getElementById('team_balance').innerHTML = '';hidePort()} , 5000);
	    refreshTeamData();
	   }
	  };
	  xhttp.open("GET", "sell?stock="+encodeURIComponent(stock)+"&quantity="+quantity+"&price="+price+"&team_id="+team_id+"&country="+country, true);
	  xhttp.send();
}
