function xml2json(xml) {
   var obj = {};
   if (xml.nodeType == 1) { 
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
         for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
         }
      }
   } else if (xml.nodeType == 3) {
      obj = xml.nodeValue;
   }
   if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
         var item = xml.childNodes.item(i);
         var nodeName = item.nodeName;
         if (typeof(obj[nodeName]) == "undefined") {
            obj[nodeName] = xml2json(item);
         } else {
            if (typeof(obj[nodeName].push) == "undefined") {
               var old = obj[nodeName];
               obj[nodeName] = [];
               obj[nodeName].push(old);
            }
            obj[nodeName].push(xml2json(item));
         }
      }
   }
   return obj;
};

$(document).ready( function () {
	var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1nx3gnYf6jmYdSZdHxlsh034ovOhi4ZtsmAcvM6xio6M/ouvvy6g/public/full';
   var params = "?min-col=1&max-col=1"; // All cells in column 1 except the first (title of column)
	$.ajax({
		type: 'GET',
		url: sheetUrl + params,
		success: function (response) {
			displayAnnouncements(xml2json(response).feed.entry);
		},
		error: function (response) {
			console.log("Unsuccessful Request")
			console.log(response)
		}
	});
});

function formatDate (eventDateTime) {
	var formattedStarttime = eventDateTime.substring(5,7) + "-" 
         + eventDateTime.substring(8,10) + "-" + eventDateTime.substring(0,4); 
	return formattedStarttime;
};

function displayAnnouncements(announcements) {
   if (typeof(announcements) == 'undefined') {
      console.log("here")
		document.getElementById("announcementTable").innerHTML = "<p> There have been no recent announcements. </p>"; 
		return;
	}

   var openingHTML = "<div class=\"singleAnnouncement\"> <span class=\"announcementDate\">";
   var betweenInfoHTML = "</span> <div class=\"announcementData\">";
   var closingHTML = "</div></div>";

   var html = []; 
   announcements = announcements.slice(announcements.length-3, announcements.length);
	for (var i = announcements.length - 1; i >= 0; --i) {
      html.push(openingHTML, formatDate(announcements[i].updated['#text']),
            betweenInfoHTML, announcements[i].content['#text'], closingHTML); 
	}
	document.getElementById("announcementTable").innerHTML = html.join(""); 
}
