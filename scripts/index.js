require("c3/c3.min.css");
require("flatpickr/dist/flatpickr.css");
var moment = require("moment-timezone");
import css from 'Styles/main.scss';
import c3 from 'c3';
import flatpickr from "flatpickr";

function generate_tooltip_title(data_point) {
  let title = data_point.toLocaleDateString('fr-BE') + " at ";
  title = title.concat(data_point.getHours() + "h-" + (data_point.getHours() + 1) + "h");
  return title;/* default, Date object */
}

function generate_tooltip_content(name, ratio, id, index) {
  return name;/* default */
}

let chart = c3.generate({
  data: {
    x: 'Time',
    xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
    columns: [
      ['Time'],
      ['Number of bikes']
    ]
  },
  tooltip: {
    format: {
      title: generate_tooltip_title,
      name: generate_tooltip_content,
    }
  },
  axis: {
    x: {
      localtime: false,/* importante!! */
      label: {
        text: "Date/Time"
      },
      type: 'timeseries',
      tick: {
        format: '%e %b at %Hh',
        count: 5,
      },
    },
    y: {
      default: [0, 500],
      padding: {
        top: 25,
        bottom: 0
      },
      label: {
        text: "Amount"
      },
      min: 0,
    }
  },
  grid: {
    x: {
      show: true
    }
  }
});


let range_pickr = flatpickr("#range_pickr", {
  mode: "range",
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  weekNumbers: true,
  enable: [
    {
      from: "2017-11-04",
      to: "2018-04-14"
    },
    {
      from: "2018-05-3",
      to: "2018-05-17"
    }
  ],
  locale: {
    firstDayOfWeek: 1
  },
  onClose: update_timeline
});

range_pickr.changeMonth(2, false);


function update_timeline(selectedDates, dateStr, instace) {
  // Fetch number of bikes from API and update chart
  var start_time = selectedDates[0].toISOString();
  var end_time = selectedDates[1].toISOString();
  document.getElementById("loading_text").innerHTML = "Waking up Heroku...";
  fetch(API_URL + "/api/bikes?start_time=" + start_time + "&end_time=" + end_time).then(function(response) {
    return response.json();
  }).then(function(data) {
    document.getElementById("loading_text").innerHTML = "";
    var numbers = data.map(x => x.thishour);
    /* by casting x.ts to a moment object, C3 gets the correct timezone info */
    var timeseries = data.map(x => moment(x.ts));
    chart.load({
      columns: [
        ['Number of bikes'].concat(numbers),
        ['Time'].concat(timeseries)
      ]
    });
  });
}
