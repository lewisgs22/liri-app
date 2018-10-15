require("dotenv").config();

// var keys = require('./keys.js');

// var spotify = new Spotify(keys.spotify);

//-------------------VARIABLES----------------------------------------------------

//Loading modules
// var Twitter = require('twitter');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var fs = require('fs');

// var tweetsArray = [];
var inputCommand = process.argv[2];
var commandParam = process.argv[3];
var defaultMovie = "Ex Machina";
var defaultSong = "Radioactive";




var omdbKey = keys.omdbKey;





//-----------------------FUNCTIONS-----------------------------------------------

//This function processes the input commands
function processCommands(command, commandParam){

	//console.log(commandParam);

	switch(command){

	case 'spotify-this-song':
		//If user has not specified a song , use default
		if(commandParam === undefined){
			commandParam = defaultSong;
		}     
		spotifyThis(commandParam); break;
	case 'movie-this':
		//If user has not specified a movie Name , use default
		if(commandParam === undefined){
			commandParam = defaultMovie;
		}    
		movieThis(commandParam); break;
	case 'do-what-it-says':
		doWhatItSays(); break;
	default: 
		console.log("Invalid command. Please type any of the following commnds: my-tweets spotify-this-song movie-this or do-what-it-says");
}


}

function spotifyThis(song){

	//If user has not specified a song , default to "Radioactive" imagine dragons
	if(song === ""){
		song = "Radioactive";
	}

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

}

function movieThis() {
	// OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
	var movieName = commandParam;
	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=" + omdbKey;

	request(queryUrl, function (error, response, body) {

		// If the request is successful = 200
		if (!error /*&& response.statusCode === 200*/) {
			var body = JSON.parse(body);

	    	console.log("-----Title-----");
	    	console.log(body.Title);

	    	console.log("-----Year-----");
	    	console.log(body.Year);

	   		console.log("-----IMDB Rating-----");
			console.log(body.imdbRating);
			   
			// console.log("-----Rotten Tomatoes Rating-----");
			// console.log(body.Ratings[2].Value);

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
		}
		//Response if user does not type in a movie title
		if (movieName === "Mr. Nobody") {
			console.log("-----------------------");
			console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
			console.log("It's on Netflix!");
		}
	});
};

function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		processCommands(dataArr[0], dataArr[1]);
	});
}



//-------------------------MAIN PROCESS-------------------------------------------

processCommands(inputCommand, commandParam);