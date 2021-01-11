$(document).ready(function() {
  function addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  var dati = [];
  // Constructs the suggestion engine
  $.get('./dati/stationList.json', function(data) {
    $.map(data, function(v, i) {
      var valori = {};
      valori = v;
      $.each(valori, function(key, val) {
        //console.log(key);
        dati.push(key);
      });
    });
  });

  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  };

  $('.typeahead').typeahead(
    {
      hint: true,
      highlight: true /* Enable substring highlighting */,
      minLength: 1 /* Specify minimum characters required for showing suggestions */
    },
    {
      name: 'stazioni',
      source: substringMatcher(dati)
    }
  );
  var datepicker, config;
  config = {
    locale: 'it-it',
    format: 'dd/mm/yyyy',
    uiLibrary: 'bootstrap4'
  };

  datepicker = $('#datepicker').datepicker(config);
  var soluzioni = {};
  $('#cercaTreni').click(function() {
    //alert('ecco');
    var params = {};
    params.origin = $('#stazionePartenza').typeahead('val');
    params.destination = $('#stazioneArrivo').typeahead('val');
    params.arflag = 'A';
    params.adate = $('#datepicker').val();
    params.atime = $('.oraPartenza').val();
    params.adultno = '1';
    params.childno = '0';
    params.direction = 'A';
    params.frecce = 'false';
    params.onlyRegional = 'false';
    console.log(params);
    $.getJSON('https://www.lefrecce.it/msite/api/solutions', params, function(
      json
    ) {
      soluzioni = json;
      console.log(soluzioni);
      $('#risultati').html(function() {
        var htm = '';
        var idsoluzione;
        $.each(soluzioni, function(key, value) {
          //console.log(value);
          htm += '<div class="row">';
          $.each(value, function(chiave, valore) {
            switch (chiave) {
              case 'idsolution':
                idsoluzione = valore;
                break;
              case 'departuretime':
                var jsDate = new Date(valore);
                htm +=
                  '<div class="col"><span onclick="cercaSoluzione(\'' +
                  idsoluzione +
                  '\');"><h1>' +
                  addZero(jsDate.getHours()) +
                  ':' +
                  addZero(jsDate.getMinutes()) +
                  '</h1></button></div>';
                break;
              case 'arrivaltime':
                var jsDateA = new Date(valore);
                htm +=
                  '<div class="col"><h5>' +
                  addZero(jsDateA.getHours()) +
                  ':' +
                  addZero(jsDateA.getMinutes()) +
                  '</h5></div>';
                break;
              case 'duration':
                htm += '<div class="col"><h6>durata: ' + valore + '</h6></div>';
                break;
              case 'changesno':
                htm += '<div class="col"><h6>Cambi: ' + valore + '</h6></div>';
                break;
            }
          });
          htm +=
            '<div id="' + idsoluzione + '" class="infoSoluzione"></div></div>';
        });
        return htm;
      });
    });
  });
});

function cercaSoluzione(id) {
  const url = 'https://www.lefrecce.it/msite/api/solutions/' + id + '/details';
  $.getJSON(url, function(json) {
    var treni = {};
    treni = json;
    console.log(treni);
    $('#' + id).html(function() {
      var htm = '';
    });
    console.log(id);
  });
}
