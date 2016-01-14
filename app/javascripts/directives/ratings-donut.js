angular.module('kuato')
.directive('ratingsDonut', [function(){
    return {
        restrict: 'EA',
        template:   '<div class="deck__donut">' +
                        '<div class="deck__stats">' +
                            '<section class="deck__schedule">' +
                                '<table>' +
                                    //'<tr>' +
                                    //    '<td><strong>2</strong></td>' + // Give this a scope parameter for due
                                    //    '<td><i class="material-icons">notifications</i></td>' +
                                    //    '<td>Due</td>' +
                                    //'</tr>' +
                                    '<tr>' +
                                        '<td><strong>{{stats.new}}</strong></td>' +  // Give this a scope parameter for new
                                        '<td><i class="material-icons">star</i></td>' +
                                        '<td>New</td>' +
                                    '</tr>' +
                                '</table>' +
                                //'<p><strong>2 </strong>Due</p>' +
                                //'<p><strong>1 </strong>New</p>' +
                            '</section>' +
                            '<section class="deck__legend__container">' +
                            '</section>' +
                        '</div>' +
                        '<div class="deck__canvas__container">' +
                            '<canvas></canvas>' +
                        '</div>' +
                    '</div>',
        scope: {
            ratings: "@"
        },
        link: function (scope, element, attrs) {
            // Set colors for charts
            var color1 = "#02E4B0",
                color2 = "#1380B1",
                color3 = "#E74E3C";


            // Convert data passed in back to JSON
            var json = JSON.parse(scope.ratings);
            scope.stats = JSON.parse(scope.ratings);
            console.log(scope);

            // Get the card count
            var cardCount = 0;
            for (var rating in json) {
                cardCount += json[rating];
            }


            // Build the data object to be given to the charting function
            var data = [];
            for (var key in json) {
                switch (Number(key)) {
                    case 1 : // Rating of 1 => AKA 'Mature' or 'Learned'
                        data.push({
                            value: json[key],
                            color: color1,
                            label: "Learned"
                        });
                        break;
                    case 2 : // Rating of 2 => AKA 'Young' or 'Learning'
                        data.push({
                            value: json[key],
                            color: color2,
                            label: "Learning"
                        });
                        break;
                    case    3 : // Rating of 3 => AKA 'Learn' or 'Learning'
                        data.push({
                            value: json[key],
                            color: color3,
                            label: "Forgetting"
                        });
                        break;
                }
            }


            // Instantiate a donut chart
            var options = {
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke : false,

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

                // Boolean - Change the size of the chart as the viewport changes
                responsive: true,

                // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
                maintainAspectRatio: false,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><strong><%if(segments[i].value){%><%=segments[i].value%><%}%><%if(!segments[i].value){%><%=0%><%}%></strong><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
            };


            // Instantiate the Donut Chart passing in our data and options objects
            var canvas = element.find('canvas'); // gets a jQuery Object
            var ctx = canvas.get(0).getContext("2d");
            ctx.canvas.width = 96;
            ctx.canvas.height = 96;
            var donut = new Chart(ctx).Doughnut(data, options);

            // Add the card count and legend to the donut directive element
            var legend = donut.generateLegend();
            var container = element.find('.deck__legend__container');
            container.append(legend);

            // Write the cardCount to the center of the rendered canvas element
            var canvasContainer = element.find('.deck__canvas__container');
            canvasContainer.append('<h3 class="deck__card-count">' + cardCount + '</h3>');

            // todo — chart is squished vertically on mobile browsers (iOS Safari & Chrome)
            // This is happening because we are appending the h3 to the canvas container.  No fix yet.
        }
    }
}]);