/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Non Innovel Sign in"], "isController": false}, {"data": [0.0, 500, 1500, "Innovel Checkout Shipping"], "isController": false}, {"data": [0.0, 500, 1500, "Staging Login"], "isController": false}, {"data": [0.0, 500, 1500, "Non Innovel Add to Cart"], "isController": false}, {"data": [0.0, 500, 1500, "Innovel Test"], "isController": true}, {"data": [0.0, 500, 1500, "Innovel Review & Place Order"], "isController": false}, {"data": [0.0, 500, 1500, "Non Innovel Review & Place Order"], "isController": false}, {"data": [0.0, 500, 1500, "Non Innovel Test"], "isController": true}, {"data": [0.0, 500, 1500, "Welcome Page"], "isController": false}, {"data": [1.0, 500, 1500, "Non Innovel Search Results Page"], "isController": false}, {"data": [0.0, 500, 1500, "Non Innovel Payment & Billing"], "isController": false}, {"data": [0.0, 500, 1500, "Innovel Sign in"], "isController": false}, {"data": [0.0, 500, 1500, "Non Innovel Product Search"], "isController": false}, {"data": [0.0, 500, 1500, "Innovel Zip Code Search"], "isController": false}, {"data": [0.5, 500, 1500, "Innovel Homepage"], "isController": false}, {"data": [0.0, 500, 1500, "Innovel Product Search"], "isController": false}, {"data": [1.0, 500, 1500, "Innovel Search Results"], "isController": false}, {"data": [0.0, 500, 1500, "Non Innovel Checkout Shipping"], "isController": false}, {"data": [0.0, 500, 1500, "Innovel Payment & Billing"], "isController": false}, {"data": [0.5, 500, 1500, "Innovel My Cart"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18, 0, 0.0, 4816.388888888889, 311, 14586, 3738.0, 13890.300000000001, 14586.0, 14586.0, 0.20478281644633553, 50.92622672373092, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Non Innovel Sign in", 1, 0, 0.0, 2950.0, 2950, 2950, 2950.0, 2950.0, 2950.0, 2950.0, 0.33898305084745767, 38.803959216101696, 0.0], "isController": false}, {"data": ["Innovel Checkout Shipping", 1, 0, 0.0, 2696.0, 2696, 2696, 2696.0, 2696.0, 2696.0, 2696.0, 0.370919881305638, 93.92531760014836, 0.0], "isController": false}, {"data": ["Staging Login", 1, 0, 0.0, 6257.0, 6257, 6257, 6257.0, 6257.0, 6257.0, 6257.0, 0.159821000479463, 34.505260358398594, 0.0], "isController": false}, {"data": ["Non Innovel Add to Cart", 1, 0, 0.0, 4053.0, 4053, 4053, 4053.0, 4053.0, 4053.0, 4053.0, 0.2467308166790032, 45.6425506569208, 0.0], "isController": false}, {"data": ["Innovel Test", 1, 0, 0.0, 38189.0, 38189, 38189, 38189.0, 38189.0, 38189.0, 38189.0, 0.026185550813061353, 65.62641156484851, 0.0], "isController": true}, {"data": ["Innovel Review & Place Order", 1, 0, 0.0, 13813.0, 13813, 13813, 13813.0, 13813.0, 13813.0, 13813.0, 0.07239556939115326, 17.58689165098096, 0.0], "isController": false}, {"data": ["Non Innovel Review & Place Order", 1, 0, 0.0, 14586.0, 14586, 14586, 14586.0, 14586.0, 14586.0, 14586.0, 0.06855889208830385, 16.638988692067734, 0.0], "isController": false}, {"data": ["Non Innovel Test", 1, 0, 0.0, 48506.0, 48506, 48506, 48506.0, 48506.0, 48506.0, 48506.0, 0.020616006267265907, 40.61572682374345, 0.0], "isController": true}, {"data": ["Welcome Page", 1, 0, 0.0, 1769.0, 1769, 1769, 1769.0, 1769.0, 1769.0, 1769.0, 0.5652911249293385, 16.55905525720746, 0.0], "isController": false}, {"data": ["Non Innovel Search Results Page", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 562.7599939123377, 0.0], "isController": false}, {"data": ["Non Innovel Payment & Billing", 1, 0, 0.0, 7413.0, 7413, 7413, 7413.0, 7413.0, 7413.0, 7413.0, 0.13489815189531904, 55.5589367917847, 0.0], "isController": false}, {"data": ["Innovel Sign in", 1, 0, 0.0, 2719.0, 2719, 2719, 2719.0, 2719.0, 2719.0, 2719.0, 0.3677822728944465, 96.83771894538434, 0.0], "isController": false}, {"data": ["Non Innovel Product Search", 1, 0, 0.0, 5417.0, 5417, 5417, 5417.0, 5417.0, 5417.0, 5417.0, 0.1846040243677312, 47.61035138222263, 0.0], "isController": false}, {"data": ["Innovel Zip Code Search", 1, 0, 0.0, 9194.0, 9194, 9194, 9194.0, 9194.0, 9194.0, 9194.0, 0.10876658690450294, 42.60261872552751, 0.0], "isController": false}, {"data": ["Innovel Homepage", 1, 0, 0.0, 1057.0, 1057, 1057, 1057.0, 1057.0, 1057.0, 1057.0, 0.9460737937559129, 203.59803689687797, 0.0], "isController": false}, {"data": ["Innovel Product Search", 1, 0, 0.0, 4003.0, 4003, 4003, 4003.0, 4003.0, 4003.0, 4003.0, 0.2498126405196103, 71.15415391581314, 0.0], "isController": false}, {"data": ["Innovel Search Results", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 925.7247286977492, 0.0], "isController": false}, {"data": ["Non Innovel Checkout Shipping", 1, 0, 0.0, 5599.0, 5599, 5599, 5599.0, 5599.0, 5599.0, 5599.0, 0.1786033220217896, 45.18629163689945, 0.0], "isController": false}, {"data": ["Innovel Payment & Billing", 1, 0, 0.0, 3473.0, 3473, 3473, 3473.0, 3473.0, 3473.0, 3473.0, 0.28793550244745175, 110.03269642600058, 0.0], "isController": false}, {"data": ["Innovel My Cart", 1, 0, 0.0, 923.0, 923, 923, 923.0, 923.0, 923.0, 923.0, 1.0834236186348862, 200.42173110780064, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
