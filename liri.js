require("dotenv").config();
//-------------------VARIABLES----------------------------------------------------

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdbKey;
var request = require('request');
var fs = require('fs');
var moment = require('moment')
var inputCommand = process.argv[2];
var commandParam = process.argv[3];
var defaultMovie = "Get Out";
var defaultSong = "Disciples";


//-----------------------FUNCTIONS-----------------------------------------------

//This function processes the input commands
function processCommands(command, commandParam){

	switch(command){

	case 'spotify-this-song':
		if(commandParam === undefined){
			commandParam = defaultSong;
		}     
		spotifyThis(commandParam); break;
	case 'movie-this':
		if(commandParam === undefined){
			commandParam = defaultMovie;
		}    
		movieThis(commandParam); break;
	case 'concert-this':
		concertThis(); break;
	case 'do-what-it-says':
		doWhatItSays(); break;
	default: 
		console.log("Invalid command. Please type any of the following commnds: spotify-this-song movie-this or do-what-it-says");
}
};

function spotifyThis(song){

	// if(song === ""){
	// 	song = defaultSong;
	// }

	spotify.search({ type: 'track', query: song}, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }

    var song = data.tracks.items[0];
    console.log("------Artists-----");
    for(i=0; i<song.artists.length; i++){
    	console.log(song.artists[i].name);
    }

    console.log("------Song Name-----");
    console.log(song.name);

	console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);

	});
};

function movieThis() {

	var movieName = commandParam;
	
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

	request(queryUrl, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			var body = JSON.parse(body);

			// console.log(body);

	    	console.log("-----Title-----");
	    	console.log(body.Title);

	    	console.log("-----Year-----");
	    	console.log(body.Year);

	   		console.log("-----IMDB Rating-----");
			console.log(body.imdbRating);
			   
			console.log("-----Rotten Tomatoes Rating-----");
			console.log(body.Ratings[2].Value);

	   		console.log("-----Country Produced-----");
	   		console.log(body.Country);
	   	
	   		console.log("-----Language-----");
			console.log(body.Language);
			   
	   		console.log("-----Plot-----");
	   		console.log(body.Plot);

	   		console.log("-----Actors-----");
			console.log(body.Actors);

	    } else {
			//else - throw error
			console.log("Error occurred.")
		};
	});
};

function concertThis() {
	var artist = commandParam;
	var queryURL = "https://rest.bandsintown.com/artists/" + artist +"/events?app_id=codingbootcamp";
	request(queryURL, function (error, response, body) {
        if (error) console.log(error);
		var result  =  JSON.parse(body)[0];
        console.log("Venue name: " + result.venue.name);
        console.log("Venue location: " + result.venue.city);
        console.log("Date of Event: " +  moment(result.datetime).format("MM/DD/YYYY"));
})
};

function doWhatItSays() {
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		processCommands(dataArr[0], dataArr[1]);
	});
};



//-------------------------MAIN PROCESS-------------------------------------------

processCommands(inputCommand, commandParam);