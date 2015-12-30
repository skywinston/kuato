angular.module('kuato')
.directive('ratingsDonut', [function(){
    return {
        restrict: 'EA',
        template: '<div class="deck__donut"><canvas width="80" height="80"></canvas></div>',
        scope: {
            ratings: "@"
        },
        link: function (scope, element, attrs) {

            // Convert data passed in back to JSON
            var json = JSON.parse(scope.ratings);

            // Build the data object to be given to the charting function
            var data = [];
            for (var key in json) {
                switch (Number(key)) {
                    case 1 : // Rating of 1 => AKA 'Mature' or 'Learned'
                        data.push({
                            value: json[key],
                            color: "#02E4B0",
                            label: "Learned"
                        });
                        break;
                    case 2 : // Rating of 2 => AKA 'Young' or 'Learning'
                        data.push({
                            value: json[key],
                            color: "#1380B1",
                            label: "Learning"
                        });
                        break;
                    case    3 : // Rating of 3 => AKA 'Learn' or 'Learning'
                        data.push({
                            value: json[key],
                            color: "#E74E3C",
                            label: "Learn"
                        });
                        break;
                }
            }

            // Instantiate a donut chart
            var options = {
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke : true,

                //String - The colour of each segment stroke
                segmentStrokeColor : "#fff",

                //Number - The width of each segment stroke
                segmentStrokeWidth : 2,

                //Number - The percentage of the chart that we cut out of the middle
                percentageInnerCutout : 50, // This is 0 for Pie charts

                //Number - Amount of animation steps
                animationSteps : 40,

                //String - Animation easing effect
                animationEasing : "easeInOutExpo",

                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate : true,

                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale : true,

                // Boolean - Whether to show labels on the scale
                scaleShowLabels: false,

                // Boolean - Determines whether to draw tooltips on the canvas or not
                showTooltips: false,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

            };
            //console.log(element);
            var canvas = element.find('canvas');
            var ctx = canvas.get(0).getContext("2d");
            var donut = new Chart(ctx).Doughnut(data,options);
            donut.generateLegend();
        }
    }
}]);