const csv = require('csvtojson');
const fs = require('fs');

//const houseCSVPath = './../../data/house-forecast-2018/house.csv';
const senateCSVPath = './senate.csv';

/*csv().fromFile(houseCSVPath).then((house) => {
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
}); */


csv().fromFile(senateCSVPath).then((senateData) => {
    var jsonOutput = {};
    for (i in senateData) {
        (function() {
            let row = senateData[i];
            let date = row.forecastdate.split("-").map(val => Number(val)); //[2018, 10, 28]
            let state = row.state;
            let party = row.party;
            if (party !== 'D' && party !== 'R') {return;}
            let candidate = row.candidate;
            let voteShare = row.voteshare;

            if (!jsonOutput[state]) {
                jsonOutput[state] = {
                    'senate': {
                        'date': date,
                        'D': {
                            'candidate': "",
                            'voteShare': ""
                        },
                        'R': {
                            'candidate': "",
                            'voteShare': ""
                        }
                    }
                };
            } else {
                //console.log(jsonOutput);
                //console.log(party);
                //console.log(jsonOutput[state]);
                jsonOutput[state].senate.date = date;
                jsonOutput[state].senate[party].candidate = candidate;
                jsonOutput[state].senate[party].voteShare = voteShare;
            }
        }) ();
    }
    fs.writeFileSync('senate.json', JSON.stringify(jsonOutput));
});




//is date more recent than targetDate?
function isNewData(date, targetDate) {
    return (date[0] >= targetDate[0]) && (date[1] >= targetDate[1]) && (date[2] >= date[2]);
}

