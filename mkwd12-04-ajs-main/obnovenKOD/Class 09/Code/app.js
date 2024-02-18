let header = document.getElementById("header");
header.innerText = "Weather Alert App";

let greetingResult = document.getElementById("greetingResult");
greetingResult.innerText = "Welcome to the most accurate weather app!";

//navigation service is responsible for the navigation in our app. This is why we are keeping all the info 
//and functionalities about the navigation here
let navigationService = {
    navItems: document.getElementsByClassName("nav-item"),
    pages: document.getElementsByClassName("page"),
    activateItem: function (item) {
        for (let navItem of this.navItems) {
            navItem.classList.remove("active");
        }
        item.classList.add("active");
    },
    displayPage: function (index) {
        //we hide all the pages, beacuse we don't know which one is active
        for (let page of this.pages) {
            page.style.display = "none";
        }
        this.pages[index].style.display = "block";
    },
    registerClickEventListeners: function () {
        for (let i = 0; i < this.navItems.length; i++) {
            this.navItems[i].addEventListener("click", function (e) {
                navigationService.displayPage(i);
                navigationService.activateItem(this); // this => target of the event, the navItem that is clicked
            })
        }
    }
}

let weatherApiService = {
    apiKey: "31b3375edaaf1a0b94cb96483eb94296",
    getWeatherData: async function (city) {
        // fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${this.apiKey}`)
        // .then(function(response){
        //     return response.json();
        // })
        // .then(function(data){ //this then is for the .json() promise
        //         console.log(data);
        //      //calculate the statistics
        //      let statiscsResult = statisticsService.calculateStatistics(data);
        //      console.log(statiscsResult);
        //      //display the statistics
        //      uiService.displayStatistcs(statiscsResult);

        // })
        // .catch(function(error){
        //     console.log(error);
        // })
        try {
            let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${this.apiKey}`;
            let response = await fetch(url);
            let data = await response.json();
            console.log(data);
            //find statistics
            let statisticsResult = statisticsService.calculateStatistics(data);
            uiService.displayStatistcs(statisticsResult);

            let secondStatisticsRes = secondPageStatSer.calculateHourly(data);
            uiService2.displayHourly(secondStatisticsRes);
        } catch (error) {
            console.log(`An error: ${error} occured`)
        }
    }
}


let statisticsService = {
    calculateStatistics: function (data) {
        // let tempSum = 0;
        // let humiditySum = 0;
        // let minTemp = data.list[0].main.temp;
        // let maxTemp = data.list[0].main.temp;
        // let minHumidity = data.list[0].main.humidity;
        // let maxHumidity = data.list[0].main.humidity;

        // for(let listItem of data.list){
        //     tempSum += listItem.main.temp;
        //     humiditySum += listItem.main.humidity;

        //     if(listItem.main.temp < minTemp){
        //         minTemp = listItem.main.temp;
        //     }

        //     if(listItem.main.temp > maxTemp){
        //         maxTemp = listItem.main.temp;
        //     }
        //     if(listItem.main.humidity < minHumidity){
        //         minHumidity = listItem.main.humidity;
        //     }

        //     if(listItem.main.humidity > maxHumidity){
        //         maxHumidity = listItem.main.humidity;
        //     }
        // }

        // let avgTemp = tempSum / data.list.length;
        // let avgHumidity = humiditySum / data.list.length;

        // let result = {
        //     averageTemp: avgTemp.toFixed(3),
        //     averageHumidity: avgHumidity,
        //     minTemperature: minTemp,
        //     maxTemperature: maxTemp,
        //     minHumidity: minHumidity,
        //     maxHumidity: maxHumidity
        // }

        // return result;

        let initialValues = {
            tempSum: 0,
            humiditySum: 0,
            minTemp: data.list[0].main.temp,
            maxTemp: data.list[0].main.temp,
            minHumidity: data.list[0].main.humidity,
            maxHumidity: data.list[0].main.humidity,
        }

        //let resultInitialValues = initialValues; //PASSED BY REFERENCE
        //the function inside reduce takes two params: the inital values and each item of the array (data.list)
        let res = data.list.reduce(function (resultInitialValues, listItem) {
            resultInitialValues.tempSum += listItem.main.temp;
            resultInitialValues.humiditySum += listItem.main.humidity;

            if (listItem.main.temp < resultInitialValues.minTemp) {
                resultInitialValues.minTemp = listItem.main.temp;
            }

            if (listItem.main.temp > resultInitialValues.maxTemp) {
                resultInitialValues.maxTemp = listItem.main.temp;
            }
            if (listItem.main.humidity < resultInitialValues.minHumidity) {
                resultInitialValues.minHumidity = listItem.main.humidity;
            }

            if (listItem.main.humidity > resultInitialValues.maxHumidity) {
                resultInitialValues.maxHumidity = listItem.main.humidity;
            }

            return resultInitialValues;
        }, initialValues)

        //initial values is the object which we use as initial value for reduce
        //it is being passed in each iteration of reduce
        //in each iteration of reduce, the values of its properties change 
        //at the end we have sums and mins and maxs in initialValues properties
        //initalValues is passed by reference in each iteration
        console.log(initialValues);


        let result = {
            averageTemp: initialValues.tempSum / data.list.length,
            averageHumidity: initialValues.humiditySum / data.list.length,
            minTemperature: initialValues.minTemp,
            maxTemperature: initialValues.maxTemp,
            minHumidity: initialValues.minHumidity,
            maxHumidity: initialValues.maxHumidity
        }
        return result;
    }
}
let secondPageStatSer = {
    calculateHourly: function (data) {
        let icon = [];
        let desc = [];
        let date = [];
        let hourlyTemp = [];
        let hourlyHumid = [];
        let windSpeed = [];
        for (i = 0; i < 40; i++) {
            icon.push(data.list[i].weather[0].icon);

            desc.push(data.list[i].weather[0].description);

            date.push(data.list[i].dt_txt);

            hourlyTemp.push(data.list[i].main.temp);

            hourlyHumid.push(data.list[i].main.humidity);

            windSpeed.push(data.list[i].wind.speed);

        }
        return { icon, desc, date, hourlyTemp, hourlyHumid, windSpeed };
    }

}

let uiService = {
    displayStatistcs: function (statiscsResult) {
        document.getElementById("statisticsResult").innerHTML = "";
        document.getElementById("statisticsResult").innerHTML = `
        <div class="container">
            <div class="row">
                <h2 class="col">AVG TEMP: ${statiscsResult.averageTemp} C </h2>
                <h2 class="col">AVG HUMIDITY: ${statiscsResult.averageHumidity} % </h2>
            </div>
            <div class="row">
                <h2 class="col-sm-6">MIN TEMP: ${statiscsResult.minTemperature} C </h2>
                <h2 class="col-sm-6">MIN HUMIDITY: ${statiscsResult.minHumidity} % </h2>
             </div>
          <div class="row">
                <h2 class="col-sm-6">MAX TEMP: ${statiscsResult.maxTemperature} C </h2>
                <h2 class="col-sm-6">MAX HUMIDITY: ${statiscsResult.maxHumidity} % </h2>
            </div>
        </div>
        `
    }
}
let uiService2 = {
    displayHourly: function (secondStatisticsRes) {
        let hourlyTableResult = document.getElementById("hourlyTableResult");
        hourlyTableResult.innerHTML = `
        <div class="container text-center">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-6">
                <div class="col">Icon</div>
                <div class="col">Description</div>
                <div class="col">Date and time</div>
                <div class="col">Temp <button id ="tempAsc">ASC</button> <button id ="tempDec">DEC</button></div>
                <div class="col">Humidity <button id ="humidAsc">ASC</button> <button id ="humidDec">DEC</button></div>
                <div class="col">Wind speed</div>
           </div>
        </div>
        `;

        this.addingTable(secondStatisticsRes, hourlyTableResult);
        this.listener(secondStatisticsRes, hourlyTableResult);
    },
    
    addingTable: function (secondStatisticsRes, hourlyTableResult) {
        let rows = [];
        for (let i = 0; i < 40; i++) {
            rows.push({
                icon: secondStatisticsRes.icon[i],
                desc: secondStatisticsRes.desc[i],
                date: secondStatisticsRes.date[i],
                temp: secondStatisticsRes.hourlyTemp[i],
                humidity: secondStatisticsRes.hourlyHumid[i],
                windSpeed: secondStatisticsRes.windSpeed[i]
            });
        }
        this.updateTable(hourlyTableResult, rows);
    },
    updateTable: function (hourlyTableResult, rows) {
        let tableHTML = `
        <div class="container text-center">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-6">
                <div class="col">Icon</div>
                <div class="col">Description</div>
                <div class="col">Date and time</div>
                <div class="col">Temp <button id ="tempAsc">ASC</button> <button id ="tempDec">DEC</button></div>
                <div class="col">Humidity <button id ="humidAsc">ASC</button> <button id ="humidDec">DEC</button></div>
                <div class="col">Wind speed</div>
            </div>
        `;
        rows.forEach(row => {
            tableHTML += `
            <div class="container text-center"> 
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-6">
                    <div>${row.icon}</div>
                    <div>${row.desc}</div>
                    <div>${row.date}</div>
                    <div>${row.temp}</div>
                    <div>${row.humidity}</div>
                    <div>${row.windSpeed}</div>
                </div>
            </div>
            `;
        });
        tableHTML += '</div>';
        hourlyTableResult.innerHTML = tableHTML;
    },
    
    listener : function (secondStatisticsRes,hourlyTableResult, bootTable, newTableDiv,){
        document.getElementById("tempAsc").addEventListener("click",function(e){
            //newTableDiv.innerHTML = "";
            let sortedRows = secondStatisticsRes.hourlyTemp.map((temp, index) => {
                return {
                    icon: secondStatisticsRes.icon[index],
                    desc: secondStatisticsRes.desc[index],
                    date: secondStatisticsRes.date[index],
                    temp: temp,
                    humidity: secondStatisticsRes.hourlyHumid[index],
                    windSpeed: secondStatisticsRes.windSpeed[index]
                };
            }).sort((a, b) => a.temp - b.temp);
            uiService2.updateTable(hourlyTableResult, sortedRows);
            uiService2.listener(secondStatisticsRes, hourlyTableResult);
        });

        document.getElementById("tempDec").addEventListener("click",function(e){
            let sortedRows = secondStatisticsRes.hourlyTemp.map((temp, index) => {
                return {
                    icon: secondStatisticsRes.icon[index],
                    desc: secondStatisticsRes.desc[index],
                    date: secondStatisticsRes.date[index],
                    temp: temp,
                    humidity: secondStatisticsRes.hourlyHumid[index],
                    windSpeed: secondStatisticsRes.windSpeed[index]
                };
            }).sort((a, b) => b.temp - a.temp);
            uiService2.updateTable(hourlyTableResult, sortedRows);
            uiService2.listener(secondStatisticsRes, hourlyTableResult);
        })
        document.getElementById("humidAsc").addEventListener("click",function(e){
            let sortedRows = secondStatisticsRes.hourlyHumid.map((humidity, index) => {
                return {
                    icon: secondStatisticsRes.icon[index],
                    desc: secondStatisticsRes.desc[index],
                    date: secondStatisticsRes.date[index],
                    temp: secondStatisticsRes.hourlyTemp[index],
                    humidity: humidity,
                    windSpeed: secondStatisticsRes.windSpeed[index]
                };
            }).sort((a, b) => a.humidity - b.humidity);
            uiService2.updateTable(hourlyTableResult, sortedRows);
            uiService2.listener(secondStatisticsRes, hourlyTableResult);

        })
        document.getElementById("humidDec").addEventListener("click",function(e){
            let sortedRows = secondStatisticsRes.hourlyHumid.map((humidity, index) => {
                return {
                    icon: secondStatisticsRes.icon[index],
                    desc: secondStatisticsRes.desc[index],
                    date: secondStatisticsRes.date[index],
                    temp: secondStatisticsRes.hourlyTemp[index],
                    humidity: humidity,
                    windSpeed: secondStatisticsRes.windSpeed[index]
                };
            }).sort((a, b) => b.humidity - a.humidity);
            uiService2.updateTable(hourlyTableResult, sortedRows);
            uiService2.listener(secondStatisticsRes, hourlyTableResult);

        })
    }
}

navigationService.registerClickEventListeners();
weatherApiService.getWeatherData("Skopje");
