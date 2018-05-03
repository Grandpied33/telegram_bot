var TelegramBot = require('node-telegram-bot-api');
var token = '523946695:AAHLgLMtqSDQgjflsxKPwpBV6P7lHHZouh8';
var Q = require('q');
var request = Q.denodeify(require("request"));
//var player = require('https://kaamelott-soundboard.2ec0b4.fr/sounds/meteo.mp3')(opts = {});
//var audio = new Audio('https://kaamelott-soundboard.2ec0b4.fr/sounds/meteo.mp3');

var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function (me) {
    console.log('Wesh, moi c\'est %s!', me.username);
});

bot.onText(/\/start/, function (msg, match) {
    var fromId = msg.from.id; // get the id, of who is sending the message
    var message = "Bienvenue sur MeteoBot\n"
    message += "Obtenez la méteo en entrant la command '/meteo [code_postal]'."
    bot.sendMessage(fromId, message);

});

// match /weather [whatever]
bot.onText(/\/meteo (.+)/, function (msg, match) {
    var fromId = msg.from.id; // get the id, of who is sending the message
    var postcode = match[1];
    getWeatherData(postcode)
        .then(function(data){
            var message = "La méteo d'aujourd'hui dans le "+postcode+"\n";
            message += data.wx_desc+"\n"
            message += "température: "+data.temp_c
            bot.sendMessage(fromId, message);
        });

});


function getWeatherData(postcode){
    var app_id = "b59cf63e"
    var app_key = "2bd0242e44b87eb875660ad9fbde90e5"
    var url = "http://api.weatherunlocked.com/api/current/fr."+postcode
    url += "?lang=fr&app_id="+app_id+"&app_key="+app_key

    var options ={
        url: url,
        method: "GET",
        json:true,
    }
    var response = request(options);
    return response.then(function (r){
        return r[0].body
    })
}