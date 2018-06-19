
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

const URL = 'https://localhost:8050/Cookie';
const TIME = 5000;


try { // trying to instantiate a XMLHttpRequest object
var xhr = new XMLHttpRequest();
} catch (e) {
console.log('XMLHttpRequest cannot be instantiated: ' + e.message);
} finally {
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {   // data arrived
        if (xhr.status === 200) { // response Ok from Web service
            //    callback(xhr.responseText.trim());
            
            var res = xhr.responseText;

            console.log(res);
            if(!res)
            {
              var x = document.getElementById('ach');
              var y = document.getElementById('lib');
              var z = document.getElementById('profilus');
              x.style.display = "none";
              y.style.display = "none";
              z.style.display = "none";

              var o = document.getElementById('ach2');
              var p = document.getElementById('lib2');
              var l = document.getElementById('profilus2');
              o.style.display = "none";
              p.style.display = "none";
              l.style.display = "none";

              t= document.getElementById('log');
              t.style.display = "block";
              u = document.getElementById('registerus');
              u.style.display = "block";
              y = document.getElementById('log2');
              y.style.display = "block";

            }
            else
            {
              var t = document.getElementById('log');
              var u = document.getElementById('registerus');
              var y = document.getElementById('log2');
              t.style.display = "none";
              u.style.display = "none";
              y.style.display = "none";

                 document.getElementById('ach2').style.display = "block";
                 document.getElementById('lib2').style.display = "block";
               document.getElementById('profilus2').style.display = "block";
                document.getElementById('ach').style.display = "block";
                document.getElementById('lib').style.display = "block";
                document.getElementById('profilus').style.display = "block";
            }
           
        }
      }
    };
    xhr.open("GET", URL, true); // opening connection
    xhr.timeout = TIME;         // setting the response time
    xhr.send();             // sending the HTTP request (no data is provided)
}