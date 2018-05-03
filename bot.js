var TelegramBot = require('node-telegram-bot-api');
var token = '523946695:AAHLgLMtqSDQgjflsxKPwpBV6P7lHHZouh8';
var Q = require('q');
var request = Q.denodeify(require("request"));


var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function (me) {
    console.log('Salut je mon nom est : %s!', me.username);
});

bot.onText(/\/start/, function (msg, match) {
    var fromId = msg.from.id; // get the id, of who is sending the message
    var message = "Bienvenue dans votre bot Meteo\n"
    message += "Obtenez la méteo via la commande /weather [la_ville]."
    bot.sendMessage(fromId, message);
});

// match /weather [whatever]
bot.onText(/\/weather (.+)/, function (msg, match) {
    var fromId = msg.from.id; // get the id, of who is sending the message
    var postcode = match[1];
    getWeatherData(postcode)
        .then(function(data){
            var message = "Voilà la météo à "+postcode+"\n";
            message += data.wx_desc+"\n"
            message += "temp: "+data.temp_c+"C or "+data.temp_f+"F"
            bot.sendMessage(fromId, message);
        });

});

function getWeatherData(postcode){
    var app_id = "b59cf63e"
    var app_key = "2bd0242e44b87eb875660ad9fbde90e5"
    var url = "http://api.weatherunlocked.com/api/current/us."+postcode
    url += "?app_id="+app_id+"&app_key="+app_key

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