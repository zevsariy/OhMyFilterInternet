// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';


var _adult = true;
var _racy = true;
var _adultScore = 0.9;
var _racyScore = 0.9;

$( document ).ready(function() {
    $.ajax({
            url: "https://filter.2tsy.ru/?action=get",

            type: "GET",
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            console.log(data);
			
			if(data.adult == 'false') _adult = false;
			else _adult = true;
			
			if(data.racy == 'false') _racy = false;
			else _racy = true;
			
			//_adult = data.adult;
			//_racy = data.racy;
			
			_adultScore = data.adult_score;
			_racyScore = data.racy_score;
			
			$('#inAdultScore')[0].value = _adultScore;
			$('#inRacyScore')[0].value = _racyScore;
			$('#chAdult')[0].checked = _adult;
			console.log(_adult);
			$('#chRacy')[0].checked = _racy;
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            //alert(errorString);
        });

});




function SaveFilter() {
  chrome.browserAction.setBadgeText({text: 'saved'});
  
  console.log('yeee');
 
fetch("http://filter.2tsy.ru/?action=set&adult=" + document.getElementById('chAdult').checked + "&racy=" + document.getElementById('chRacy').checked + "&adult_score=" + document.getElementById('inAdultScore').value + "&racy_score=" + document.getElementById('inRacyScore').value)
  .then(function(response) {
    console.log(response);
   })
   .catch((e)=>{console.log(e);})
  //window.close();
}

let btn = document.getElementById('savebtn');
btn.addEventListener('click', SaveFilter);