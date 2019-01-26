
	var old_data = [];
	var new_data = [];
	var last_refresh = 'NEVER';
	function fetchCountryData(country) {
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
	}
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
