var artistData = null;
var trackData = null;
var streamingHistory = null;
var streamingHirarchy = null;
var streamingByDate = null;
var streamingByArtist = null;
var streamingByTrack = null;
function getTopTracks() {
    return fetch("https://raw.githubusercontent.com/pillowinacoma/printify/main/myTopTracks.json")
    // return fetch("../ilseTopTracks.json")
        .then(response => response.json());
}

function getTopArtists() {
    return fetch("https://raw.githubusercontent.com/pillowinacoma/printify/main/myTopArtists.json")
    // return fetch("../ilseTopArtists.json")
        .then(response => response.json());
}
function getStreamingHistory(fileNb) {
    return fetch(`https://raw.githubusercontent.com/pillowinacoma/printify/main/StreamingHistory${fileNb}.json`)
        .then(response => response.json());
}

function getAllStreamingHistories() {
    return Promise.all([getStreamingHistory(0), getStreamingHistory(1), getStreamingHistory(2), getStreamingHistory(3)])
}

function getTracksAndArtists() {
    return Promise.all([getTopTracks(), getTopArtists()]);
}

getTracksAndArtists().then(([tracks, artists]) => {
    console.log("tracks", tracks);
    console.log("artists", artists);
    trackData = tracks;
    artistData = artists;
})

getAllStreamingHistories().then((f1) => {
    return f1[0].concat(f1[1], f1[2], f1[3])
}).then((data) => {
    streamingHistory = data.map((deez) => {
        return {
            artistName: deez.artistName,
            endTime: strToDate(deez.endTime),
            msPlayed: deez.msPlayed,
            trackName: deez.trackName
        }
    })
    console.log("streaming History ", streamingHistory);
    return streamingHistory;
}).then((data) => {
    streamingHirarchy = data.reduce((acc, curr) => {
        let idx = acc.findIndex(x => x.name === curr.artistName)
        if (idx === -1) {
            acc.push({
                name: curr.artistName,
                value: curr.msPlayed,
                children: [{
                    name: curr.trackName,
                    value: curr.msPlayed,
                }]
            })
        } else {
            acc[idx].value += curr.msPlayed;
            let ideex = acc[idx].children.findIndex(x => x.name === curr.trackName);
            if (ideex === -1) {
                acc[idx].children.push({
                    name: curr.trackName,
                    value: curr.msPlayed,
                })
            } else {
                acc[idx].children[ideex].value += curr.msPlayed;
            }
        }

        return acc;
    }, []
    ).sort((a, b) => - a.value + b.value)
    //.slice(0, 500)

    console.log("streamingHirarchy", streamingHirarchy);
}).then(() => {
    streamingByDate = reduceHistoryToDay();
})

function reduceHistoryToTrack() {
    return streamingHistory.reduce((acc, curr) => {
        let idx = acc.findIndex(x => x.trackName === curr.trackName);

        if (idx === -1) {
            acc.push({
                trackName: curr.trackName,
                msPlayed: curr.msPlayed,
            });
        } else {
            acc[idx].msPlayed += curr.msPlayed;
        }
        return acc;
    }, []
    ).slice(0, 100);
}

function reduceHistoryToDay() {
    const parseTime = d3.timeParse("%Y/%m/%d");
    return streamingHistory.reduce((acc, curr) => {
        let idx = acc.findIndex(x => x.date === dateToYearMonthDay(curr.endTime));

        if (idx === -1) {
            acc.push({
                date: dateToYearMonthDay(curr.endTime),
                value: curr.msPlayed,
            });
        } else {
            acc[idx].value += curr.msPlayed;
        }
        return acc;
    }, []
    ).map(daton => {
        return {
            date: parseTime(daton.date),
            value: Math.floor(daton.value / 1000 / 60),
        }
    }).sort((a, b) => {
        return - b.date + a.date;
    })
}

function reduceHistoryToArtist() {
    return streamingHistory.reduce((acc, curr) => {
        let idx = acc.findIndex(x => x.artistName === curr.artistName);

        if (idx === -1) {
            acc.push({
                artistName: curr.artistName,
                msPlayed: curr.msPlayed,
            });
        } else {
            acc[idx].msPlayed += curr.msPlayed;
        }
        return acc;
    }, [])
}

function strToDate(str) {
    str.replace(" ", "T");
    return new Date(str + "Z");
}

function dateToYearMonthDay(dateObj) {

    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    return year + "/" + month + "/" + day;
}

function removeDateHours(date) {
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSecondes(0);

    return date
}