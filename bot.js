const Twit = require("twit");
const http = require("http");
const chalk = require("chalk");
const fs = require("fs");

const config = require("./config.js");  
const apixu = require("./apixu.js");
const twitterAcc = require("./twitterAc.js"); 

/// Auth
const T = new Twit(config);
const tweetCount = 10;


const intTimeTweet = 1000*60*15;
const intTimeWeather = 1000*60*60*6;

const trish = {
	screen_name: "trishapaytas",
	count: tweetCount,
	exclude_replies: true,
	include_rts: false
};

const shane = {
	screen_name: "shanedawson",
	count: tweetCount,
	exclude_replies: true,
	include_rts: false
};

const star = {
	screen_name: "JeffreeStar",
	count: tweetCount,
	exclude_replies: true,
	include_rts: false
};

const bern = {
	screen_name: "BernieSanders",
	count: tweetCount,
	exclude_replies: true,
	include_rts: false
};

const cody = {
	screen_name: "codyko",
	count: tweetCount,
	exclude_replies: true,
	include_rts: false
};

///// Web Server ( DISABLED FOR NOW )
// let server = http.createServer(function(req, res){
// 	//root url
// 	fs.readFile(__dirname + "/index.html", function(err, home){
// 		if(err){
// 			res.writeHead(404);
// 		}else{
// 			res.writeHead(200, {'Content-Type': 'text/html'});
// 			res.write(home);
// 			res.end();
// 		};
// 	});
// });

// server.listen(3000);

function postMotivation(user){
	let tweet = [
		user, "good luck today on your test.",
		"As a robot, my creator has great faith in you", 
		"therefore I must as well. To provide the best results",
		"we will provide a weather update to keep you fashionable! XoXo"
	];

	let status = { status: tweet.join(" ")};

	T.post("statuses/update", status, function(err, tweet){
		if(err){
			console.log(chalk.red(err.message));
		}else{
			console.log(chalk.green("Successfully Motivated!"));

		};
	});
};

function getTimelineAction(userParam){
	let favoritedList = []
	T.get("statuses/user_timeline", userParam, function(err, data){
		console.log(chalk.yellow.bold("Initializing Request For " + userParam.screen_name));
		console.log(chalk.magenta("Recieved " + data.length + " tweets from filters"));
		console.log(chalk.whiteBright.italic("Checking tweets for favorites...."));
		console.log(chalk.whiteBright.italic("Scanning for youtube URLs..."));

		//Each new Tweet up to count...
		for(let i = 0; i < data.length; i++){
			let id = data[i].id_str;
			//Link Checking Logic
			if(typeof data[i].entities.urls[0] !== "undefined"){
				let urlRaw = data[i].entities.urls[0].expanded_url;
				let slicedUrl = urlRaw.slice(8);
				//Checking for youtube Link
				console.log(slicedUrl)
				if(slicedUrl.slice(0,3) == "you"){
					console.log("RETWEETING");
					T.post("statuses/retweet", {id: id}, function(err, tweet){
						if(err){
							console.log(chalk.red(err.message));
						}else{
							console.log(chalk.green("Tweet ID:" + id + " successfully retweeted!"));
						};
					});
				};
			}else{
				console.log("NO URL!");
			};

			
			//Favorite Logic
			T.post("favorites/create", {id: id}, function(err, tweet){
				if(err){
					console.log(chalk.red(err.message));
				}else{
					favoritedList.push(id);
					console.log(chalk.green("Tweet ID:" + id + " added to favorites"));
					return true;
				};
			});
		};
		
	});
};

function tweetWeather(user){
	console.log(chalk.magenta("PREPARING TO PROVIDE WEATHER"));
	const baseUrl = "http://api.apixu.com/v1/current.json?key=";
	const api = apixu.api;
	let queryStr = "&q=florence";

	http.get(baseUrl + api + queryStr, function(res){
		let body = '';
		res.on('data', function(data){
			body += data;
		});

		res.on('end', function(){
			let weather = JSON.parse(body)

			let tweetArr = [
				user, "today in", weather.location.name, "it is", weather.current.temp_f + "°F",
				"but it feels like", weather.current.feelslike_f + "°F.",
				"The sky seems to be", weather.current.condition.text + ".",
				"I hope this helped you prepare for the day! You got this"
			];

			let tweetParams = { status: tweetArr.join(" ")}; //Creates our new Tweet

			T.post("statuses/update", tweetParams, function(err, tweet){
				if(err){
					console.log(chalk.red(err.message));
				}else{
					console.log(chalk.blueBright("Successfully Tweeted Weather Update!"));
				};
			});
			
		});

		res.on('error', function(err){
			console.log(chalk.red("An Error Has Occurred!"));
			console.log(chalk.red(err.message));
		});
	});
};


getTimelineAction(trish);
getTimelineAction(shane);
getTimelineAction(star);
getTimelineAction(bern);
getTimelineAction(cody);

setInterval(getTimelineAction, intTimeTweet, trish);
setInterval(getTimelineAction, intTimeTweet, shane);
setInterval(getTimelineAction, intTimeTweet, star);
setInterval(getTimelineAction, intTimeTweet, bern);
setInterval(getTimelineAction, intTimeTweet, cody);

setInterval(tweetWeather, intTimeWeather, twitterAcc.twitter);









