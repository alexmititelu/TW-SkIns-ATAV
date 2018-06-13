// 404 Error page
//Responsive: Large desktop (1800px), Standard, Mobile (568px)


// iPhone pull addressbar (Optional)
// /mobile/i.test(navigator.userAgent) && !window.location.hash && setTimeout(function () {
//     window.scrollTo(0, 1);
//     }, 1000);
    

var quotes = new Array();
quotes.push("\"The world is a university and everyone in it is a teacher. Make sure when you wake up in the morning, you go to school.\" - T. D. Jakes");
quotes.push("\"The whole purpose of education is to turn mirrors into windows.\" - Sydney J. Harris");
quotes.push("\"Education is the passport to the future, for tomorrow belongs to those who prepare for it today.\" - Malcolm X");
quotes.push("\"“Knowledge, like air, is vital to life. Like air, no one should be denied it.\” ―Alan Moore");
quotes.push("\"All those moments will be lost in time, like tears in rain.\"");

window.onload = function() {
//    displayQuote() {
var displayedQuote = document.getElementById('motivational-quote');
var randomIndex = Math.floor(Math.random()*5);
displayedQuote.textContent = quotes[randomIndex];
}
