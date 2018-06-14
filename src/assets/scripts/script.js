'use strict'


var contorExercitiu = 0;
var exercitiuForm = document.getElementById('formUnseen');
exercitiuForm.value = contorExercitiu; 

let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;


gUMbtn.onclick = e => {
  let mv = id('mediaVideo'),
      mediaOptions = {
        video: {
          tag: 'video',
          type: 'video/webm',
          ext: '.mp4',
          gUM: {video: true, audio: true}
        },
        audio: {
          tag: 'audio',
          type: 'audio/ogg',
          ext: '.ogg',
          gUM: {audio: true}
        }
      };
  media = mv.checked ? mediaOptions.video : mediaOptions.audio;
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    id('gUMArea').style.display = 'none';
    id('btns').style.display = 'inherit';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if(recorder.state == 'inactive')  makeLink();
    };
    log('got media successfully');
  }).catch(log);
}

start.onclick = e => {
  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks=[];
  recorder.start();
}


stop.onclick = e => {
  stop.disabled = true;
  recorder.stop();
  start.removeAttribute('disabled');
}



function makeLink(){
  let blob = new Blob(chunks, {type: media.type })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
  ;


  var reader = new FileReader();
  reader.readAsDataURL(blob); 
  reader.onloadend = function() {
      var base64data = reader.result;                
      console.log(base64data);

      var raspunsParagraf = document.getElementById('response');

      const URL = 'http://localhost:9010/postAudio';
      const TIME = 2000;

      try { // trying to instantiate a XMLHttpRequest object
        var xhr = new XMLHttpRequest();
    } catch (e) {
      raspunsParagraf.textContent = 'XMLHttpRequest cannot be instantiated: ' + e.message;
    } finally {
       xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {   // data arrived
                if (xhr.status === 200) { // response Ok from Web service
                //    callback(xhr.responseText.trim());
                    var jsonResponse = JSON.parse(xhr.responseText);
                    raspunsParagraf.innerHTML = jsonResponse.content;
                    contorExercitiu++;
                }
            }
        };
        xhr.open("POST", URL, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("content="+base64data + '&exerciseNr='+contorExercitiu);
        
        xhr.timeout = TIME;         // setting the response time
        xhr.send();             // sending the HTTP request (no data is provided)
    }

  }




  mt.controls = true;
  mt.src = url;
  hf.href = url;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;
  li.appendChild(mt);
  li.appendChild(hf);
  li.id= `${counter++}fisier`
  ul.appendChild(li);


}


nextExercise.onclick = e => {
  
    var exercitiuCurent = document.getElementById('currentExercise');

    const URL = 'http://localhost:9010/getExercitiu';
    const TIME = 4000;

    try { // trying to instantiate a XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    } catch (e) {
      exercitiuCurent.textContent = 'XMLHttpRequest cannot be instantiated: ' + e.message;
    } finally {
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {   // data arrived
              if (xhr.status === 200) { // response Ok from Web service
              //    callback(xhr.responseText.trim());
                  var jsonResponse = xhr.responseText;

                  console.log(jsonResponse);
                  
                  exercitiuCurent.innerHTML = jsonResponse;
                  contorExercitiu++;
                  exercitiuForm.value = contorExercitiu; 
              }
          }
      };
      xhr.open("GET", URL + `?exNr=${contorExercitiu+1}`, true); // opening connection
      xhr.timeout = TIME;         // setting the response time
      xhr.send();             // sending the HTTP request (no data is provided)
    }
}

$("#formogus").submit(function(event) {

  /* stop form from submitting normally */
  event.preventDefault();
  var raspunsulLaEx = document.getElementById('response');
  /* get the action attribute from the <form action=""> element */
  var $form = $( this ),
      url = $form.attr( 'action' );

  /* Send the data using post with element id name and name2*/
  var postData = { message: $('#mesajDeTradus').val(), nrEx: $('#formUnseen').val() }

      $.ajax({
            type: "post",
            url: url,
            data: postData,
            contentType: "application/x-www-form-urlencoded",
            success: function(responseData, textStatus, jqXHR) {
                alert("data saved")
                raspunsulLaEx.innerHTML = responseData;
                if(responseData === 'Bravo! Traducerea este corecta.')
                {
                  raspunsulLaEx.style.cssText = "color:green; font-weight: bold;";
                }
                else{
                  raspunsulLaEx.style.cssText = "color:red; font-weight: bold;";
                }
                 
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
  


});