require("purecss/build/pure-min.css");
require("c3/c3.min.css");
require("flatpickr/dist/flatpickr.css");
import css from 'Styles/main.scss';
import d3 from 'd3';
import c3 from 'c3';
import flatpickr from "flatpickr";

/* var now = new Date().toISOString();
 * var two_days_ago = new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString();
 * */

function generate_tooltip_title(data_point) {
  return data_point;/* default, Date object */
}

function generate_tooltip_content(name, ratio, id, index) {
  return name;/* default */
}


var chart = c3.generate({
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
      label: {
        text: "Date/Time"
      },
      type: 'timeseries',
      tick: {
        format: '%e %b between %H:00 and %H:59',
        count: 5,
      }
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


var range_pickr = flatpickr("#range_pickr", {
  mode: "range",
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  enable: [
    {
      from: "2017-11-04",
      to: new Date()
    }
  ],
  locale: {
    firstDayOfWeek: 1
  },
  onClose: update_timeline
});

function update_timeline(selectedDates, dateStr, instace) {
  var start_time = selectedDates[0].toISOString();
  var end_time = selectedDates[1].toISOString();
  fetch(API_URL + "/api/bikes?start_time=" + start_time + "&end_time=" + end_time).then(function(response) {
    return response.json();
  }).then(function(data) {
    var numbers = data.map(x => x.thishour);
    var timeseries = data.map(x => x.ts);
    chart.load({
      columns: [
        ['Number of bikes'].concat(numbers),
        ['Time'].concat(timeseries)
      ]
    });
  });
}
