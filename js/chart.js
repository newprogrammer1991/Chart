var startDate = "01.01.2017";
var endDate = "31.03.2017";
var canvas = document.getElementById("myChart");
var ctx = canvas.getContext("2d");
var btns = document.querySelectorAll(".btn");
var positionY;
var positionX;
Chart.defaults.global.defaultFontColor = '#ffffff';
function fillLine() {
    var gradientLine = ctx.createLinearGradient(0, 0, 500, 0);
    var colors = [
        '#c6c764',
        '#c4ed84',
        '#4b6657',
        '#75bb85',
        '#7bdf9e',
        '#7ee09d',
        '#539074',
        '#70dda2',
        '#66daa5',
        '#5ad8a9',
        '#2bd0bb',
        '#1ec7ba',
        '#16c8c1',
        '#00bdd2',
        '#01aef2',
        '#12a1f0'
    ];
    gradientLine.addColorStop(0, colors[0]);
    gradientLine.addColorStop(0.2, colors[1]);
    gradientLine.addColorStop(0.6, colors[5]);
    gradientLine.addColorStop(0.8, colors[9]);
    gradientLine.addColorStop(1, colors[15]);

    console.log(colors);
    return gradientLine;
};

function getCountDays(count=1, type='d', end) {
    var days;
    if (end) {
        var newDates = moment(endDate, "DD.MM.YYYY");
        days = newDates.diff(startDate, 'days');
    }
    else {
        var newDates = moment(startDate, "DD.MM.YYYY");
        newDates.add(count, type);
        days = newDates.diff(startDate, 'days');
    }
    return days;
};

function newDate() {
    var days = getCountDays(undefined, undefined, endDate);
    var dates = [];
    for (var i = 0; i <= days; i++) {
        var newDates = moment(startDate, "DD.MM.YYYY");
        dates.push(newDates.add(i, 'd').toDate());
    }
    return dates;
}

function getAmount() {
    var days = getCountDays(undefined, undefined, endDate);
    var number = 100;
    var amounts = [];
    var result;
    while (days >= 0) {
        result = number + random();
        if (result > 100) {
            amounts.push(result);
            days--;

        }
    }
    return amounts.sort(function (a, b) {
        return a - b;
    });
};

function random(min=-50, max=300) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

var customTooltips = function (tooltip) {
        var tooltipEl = document.querySelector('.chartjs-tooltip');
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            document.querySelector("body").classList.remove("tip");
            return;
        }
        else {
            document.querySelector("body").classList.add("tip");
        }

        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltip.yAlign) {
            tooltipEl.classList.add(tooltip.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
            return bodyItem.lines;
        };

        if (tooltip.body) {
            var titleLines = [];
            var bodyLines = tooltip.body.map(getBody);
            var innerHtml = '<span>';
            titleLines.forEach(function (title) {
                innerHtml += title;
            });
            innerHtml += '</span>';

            bodyLines.forEach(function (body, i) {
                innerHtml += '<span>' + body + '</span>';
            });
            tooltipEl.innerHTML = innerHtml;
        }

        positionY = this._chart.canvas.offsetTop;
        positionX = this._chart.canvas.offsetLeft;

        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY - tooltip.height + 'px';
        tooltipEl.style.fontFamily = tooltip._fontFamily;
        tooltipEl.style.fontSize = tooltip.fontSize;
        tooltipEl.style.fontStyle = tooltip._fontStyle;
        tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
        tooltipEl.style.backgroundColor = "#3cc182";
    }
;

var config = {
    type: 'line',
    data: {
        labels: newDate(),
        datasets: [{
            data: getAmount(),
            borderColor: fillLine(),
            fill: false
        }]
    },
    options: {
        tooltips: {
            enabled: false,
            mode: 'index',
            intersect: false,
            callbacks: {
                label: function (tooltipItems, data) {
                    return tooltipItems.yLabel + ' USD';
                }
            },
            custom: customTooltips
        },
        scales: {
            xAxes: [{
                type: "time",
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM D'
                    }
                },
                gridLines: {
                    display: false,
                    tickMarkLength: 35
                },
                ticks: {
                    fontSize: 14
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 100,
                    maxTicksLimit: 2,
                    suggestedMax: 500,
                    callback: function (value, index, values) {
                        return value + ' USD'
                    },
                    padding: 15
                },
                gridLines: {
                    lineWidth: 2,
                    color: '#444b5f',
                    drawBorder: false,
                    borderDashOffset: 1,
                    zeroLineWidth: 2,
                    zeroLineColor: '#444b5f'
                }
            }]
        },
        layout: {
            padding: {
                left: 12,
                right: 84,
                top: 25,
                bottom: 0
            }
        },
        legend: {
            display: false
        },
        elements: {
            point: {
                radius: 0,
                borderWidth: 0,
                hitRadius: 0,
                hoverRadius: 0,
                borderColor: 'transparent',
                backgroundColor: 'transparent'
            }
        },
        annotation: {
            events: ['click'],
            annotations: [{
                drawTime: 'afterDraw',
                type: 'line',
                value: 0,
                mode: 'vertical',
                scaleID: 'x-axis-0',
                borderColor: '#4a90e2',
                borderWidth: 3
            }]
        }
    }

};


btns.forEach(function (btn) {
    btn.addEventListener("click", change);
});

const data = config.data.datasets[0].data;
const labels = config.data.labels;

var line = new Chart(ctx, config);

function change(event) {
    var elem = event.target;
    var active = document.querySelector(".active");
    active.classList.remove("active");
    elem.classList.add("active");
    var set = elem.dataset.period.split('-');
    var count = set[0];
    var type = set[1];
    var days = getCountDays(count, type);
    config.data.datasets[0].data = data.slice(0, days);
    config.data.labels = labels.slice(0, days);
    line.update();

};

var circle = document.querySelector(".circle");

canvas.onmousemove = function (evt) {
    var points = line.getElementsAtXAxis(evt);
    config.options.annotation.annotations[0].value = new Date(line.config.data.labels[points[0]._index]);
    config.options.elements.point.radius = 1;
    circle.style.top = positionY + points[0]._view.y - circle.offsetHeight / 2 + "px";
    circle.style.left = positionX + points[0]._view.x + "px";
    line.update();
};
canvas.onmouseout = function (evt) {
    config.options.annotation.annotations[0].value = new Date(0);
    line.update();
};


