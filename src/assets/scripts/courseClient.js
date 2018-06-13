
document.getElementById("searchBar").style.width = "40%";

var xmlhttp = new XMLHttpRequest();
//var url = "http://127.0.0.1:8050/getAllCourses";
var url = "http://127.0.0.1:8054/getAllCourses"; //TEST , cel comentat e ok
var coursesJSON;

var willSearch = 0;
var willFilter = 0;
var filterTags = [];



xmlhttp.open("GET", url, true);
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("searchBar").style.width = "40%";
        console.log(this.responseText);
        coursesJSON = JSON.parse(this.responseText);
        console.log("Arrayul este : " + coursesJSON);
        update();
    }
};
xmlhttp.send();





function createHTML(title,details){
    var html = "<div class=\"box tilt\">\
    Titlu curs : " + title + 
    "<div class=\"bottom\">\
        Detalii curs : " + details + 
    "</div>\
    </div>";
    return html;
    
}

function search(index, searchString){
    var val = 0;
    val += coursesJSON[index].titlu_curs.toLowerCase().includes(searchString)?1:0;
    console.log(coursesJSON[index].titlu_curs.toLowerCase() + " " + searchString);
    val += coursesJSON[index].descriere.toLowerCase().includes(searchString)?1:0;
    console.log(coursesJSON[index].descriere.toLowerCase() + " " + searchString);
    console.log("val : " + val);
    return val;
}

function sort(sortParam){
    //sortam dupa sortParam
}

function filter(filterTags){
    //filtram dupa tagurile alese
}

function setSearch(){
    console.log("Searching...");
    update();
    console.log("WillSearch : " + willSearch);
}

function setFilterTags(){
    console.log("Setting tags...");
    willFilter = 1;
    var tag;
    //sets filter tags
    filterTags = [];
    tag = document.getElementById("gtr");
    if (tag.checked == true)
        filterTags.push(tag.id);
    tag = document.getElementById("python");
    if (tag.checked == true)
        filterTags.push(tag.id);
    tag = document.getElementById("lang");
    if (tag.checked == true)
        filterTags.push(tag.id);
    console.log("filterTags : " + filterTags);
    update();
    willFilter = 0;
    console.log("WillFilter : " + willFilter);
}

function update(){
    var coursesView = "";
    var searchString = document.getElementById("searchBar").value;
    if (searchString != "")
        searchString = searchString.toString().toLowerCase();
    console.log("Search string : " + searchString);
    console.log("Filter tags : " + filterTags);
    document.getElementById("searchBar").value = null;
    for (var i = 0; i < coursesJSON.length; i++){
        if (searchString != "" && search(i,searchString) != 0){
            if (filterTags.length != 0){
                if(filterTags.includes(coursesJSON[i].tag))
                    coursesView += createHTML(coursesJSON[i].titlu_curs,coursesJSON[i].descriere);
            }
            else
                coursesView += createHTML(coursesJSON[i].titlu_curs,coursesJSON[i].descriere);
        }
        else if (filterTags.length != 0 && filterTags.includes(coursesJSON[i].tag)){
            if (searchString != ""){
                if (search(i,searchString) != 0)
                    coursesView += createHTML(coursesJSON[i].titlu_curs,coursesJSON[i].descriere);
            }
            else
                coursesView += createHTML(coursesJSON[i].titlu_curs,coursesJSON[i].descriere);
        }
        else if (searchString == "" && filterTags.length == 0){
            console.log("NU SE FILTREAZA");
            coursesView += createHTML(coursesJSON[i].titlu_curs,coursesJSON[i].descriere);
        }
    }
    document.getElementById('courseView').innerHTML = coursesView;
}

