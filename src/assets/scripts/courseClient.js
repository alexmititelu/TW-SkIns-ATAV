
var xmlhttp = new XMLHttpRequest();
var url = "http://127.0.0.1:8052/getAllCourses";

var coursesJSON;
xmlhttp.open("GET", url, true);
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        coursesJSON = JSON.parse(this.responseText);
        console.log("Arrayul este : " + JSON.stringify(coursesJSON));
        update();
    }
};
xmlhttp.send();
console.log("In afara : " + JSON.stringify(coursesJSON));


function createHTML(){
    var html = "<div class=\"box tilt\">\
    <div class=\"upper\">\
        <img alt=\"Gigele, s-a stricat ceva la casca\" class=\"image\" src=\"../images/guitar.jpg\">\
    </div>TEST TEST\
    <div class=\"bottom\">\
        <span class=\"price\">15 lei</span>\
        <img alt=\"Gigele, s-a stricat ceva la casca\" class=\"availability\" src=\"../images/bought.png\">\
        <form action=\"#curs1\">\
            <button class=\"fa fa-question-circle\"></button>\
        </form>\
    </div>\
    </div>";
    return html;
    
}

function search(index, searchString){
    return coursesJSON[index].includes(searchString);
}

function sort(sortParam){
    //sortam dupa sortParam
}

function filter(filterTags){
    //filtram dupa tagurile alese
}

function update(){
    document.getElementById('courseView').innerHTML = createHTML();
}

