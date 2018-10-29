const csv = require('csvtojson');
const fs = require('fs');

const houseCSVPath = './house.csv';
const senateCSVPath = './senate.csv';

var jsonOutput = {};

csv().fromFile(houseCSVPath).then((house) => {
    for (i in house) {
        let row = house[i];
        let date = row.forecastdate.split("-").map(val => Number(val)); //[2018, 10, 28]
        
        if (date[1] < 10) {
            continue;
        }

        let state = row.state;
        let district = row.district;
        let candidate = row.candidate;
        let party = row.party;
        let voteShare = row.voteShare;

        if (jsonOutput.state && jsonOutput.state.house && jsonOutput.state.house.district
            && !isNewData(date, jsonOutput.state.house.district.date)) {
            continue;
        }

        if (row !== 'classic') {continue;}
        
        jsonOutput.state.house.district = {
            "date": date,
            "D": {
                "candidate": candidate,
                "voteShare": voteShare
            },
            "R": {
                "candidate": candidate,
                "voteShare": voteShare
            }
        };
    }

});


csv().fromFile(senateCSVPath).then((senateData) => {
    for (i in senateData) {
        let row = senateData[i];
        let date = row.forecastdate.split("-").map(val => Number(val)); //[2018, 10, 28]

        jsonOutput.state = {
            "senate":{
                "date": date,
                "D": {
                    "candidate": candidate,
                    "voteShare": voteShare
                },
                "R": {
                    "candidate": candidate,
                    "voteShare": voteShare
                }
            }
        };

    }
});

let data = JSON.stringify(jsonOutput);
fs.writeFileSync('test.json', data);

//is date more recent than targetDate?
function isNewData(date, targetDate) {
    return (date[0] >= targetDate[0]) && (date[1] >= targetDate[1]) && (date[2] >= date[2]);
}





/*
csv().fromFile(houseCSVPath).then((house) => {
    let jsonOutput = {};
    for (i in jsonObject) {
        let date = jsonObject[i].forecastdate.split("-").map(val => Number(val)); //[2018, 10, 28]
        
        if (date[1] < 10) {
            continue;
        }

        let state = jsonObject[i].state;
        let party = jsonObject[i].party;
        let model = jsonObject[i].model;
        let winProb = jsonObject[i].win_probability;
        let seats = jsonObject[i].median_seats;
    
        jsonOutput.state = {
            "house":[{
                "date": date,
                "party": party
            }, {
                "date": date,
                "party": party
            }]
            "senate":[{
                "date": date,
                "party": party
            }]
        };
    }

    let data = JSON.stringify(jsonOutput);
    fs.writeFileSync('test.json', data);

});*/



