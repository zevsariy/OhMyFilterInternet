var _adult = true;
var _racy = true;
var _adultScore = 0.9;
var _racyScore = 0.9;

function ReCheck()
{
$.ajax({
            url: "https://filter.2tsy.ru/?action=get",

            type: "GET",
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            console.log(data);
			_adult = data.adult;
			_racy = data.racy;
			_adultScore = data.adult_score;
			_racyScore = data.racy_score;
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            //alert(errorString);
        });
}

ReCheck();

function processImage(image_src, img, cb) {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "72753092a76047b9a1308276e8185c62";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        //var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";
		var uriBase = "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze";

        // Request parameters.  Categories,Description,Color,
        var params = {
            "visualFeatures": "adult",
            "details": "",
            "language": "en",
        };


        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",
			
			//beforeSend: () => {console.log(image_src);},

            // Request body.
            data: '{"url": ' + '"' + image_src + '"}',
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
			
            cb(data, img);
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            //alert(errorString);
			return 1;
        });
    };
	

function main()
{
	ReCheck();
	if (!$("img").length) {$('body').css({filter: 'blur(0)'});}
	for(var i = 0; i < $("img").length; i++){
		
		if ($("img")[i].dataset.status != 1) {
			if (parseInt($($("img")[i]).css('width')) >= 50) {
				
				$($("img")[i]).css({filter: 'blur(15px)'});
				
				$('body').css({filter: 'blur(0)'});
				
				$("img")[i].dataset.status = 1;
				
				console.log($("img")[i].src);
				
				processImage($("img")[i].src, $("img")[i], function(data, img) {
					
					if(data.adult.isAdultContent == true && _adult == 'true'|| data.adult.isRacyContent == true && _racy == 'true')
					{
						//console.log('yes!It is erotik!!!! or racy!');
						//$(img).parent().parent().hide();
						$(img).css({opacity: '0.3'});
					} else {
						$(img).css({filter: 'blur(0px)'});
					}
					
				});
			} else {
				$('body').css({filter: 'blur(0)'});
			}
		}
	}
}

setInterval(() => {
	main();
}, 500);

main();