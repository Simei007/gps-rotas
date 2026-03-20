let map = L.map("map").setView([-23.5505,-46.6333],18)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{maxZoom:19}
).addTo(map)

let marker = L.marker([-23.5505,-46.6333]).addTo(map)

let routingControl=null
let watchID=null

function startGPS(){

watchID=navigator.geolocation.watchPosition(pos=>{

let lat=pos.coords.latitude
let lng=pos.coords.longitude
let heading=pos.coords.heading
let speed=pos.coords.speed

marker.setLatLng([lat,lng])

map.setView([lat,lng])

/* velocidade */

if(speed){

let kmh=Math.round(speed*3.6)

document.getElementById("speed").innerHTML=kmh+" km/h"

}

/* rotação mapa */

if(heading!==null){

map.getPane("mapPane").style.transform=
`rotate(${-heading}deg)`

}

},{
enableHighAccuracy:true
})

}

function stopGPS(){

if(watchID){

navigator.geolocation.clearWatch(watchID)

}

}

function centerGPS(){

navigator.geolocation.getCurrentPosition(pos=>{

map.setView([pos.coords.latitude,pos.coords.longitude],18)

})

}

/* busca endereço */

async function searchPlace(){

let query=document.getElementById("search").value

if(!query) return

let url=`https://nominatim.openstreetmap.org/search?format=json&q=${query}`

let res=await fetch(url)

let data=await res.json()

if(data.length==0){

alert("Endereço não encontrado")

return

}

let lat=data[0].lat
let lon=data[0].lon

createRoute(lat,lon)

}

/* criar rota */

function createRoute(lat,lon){

navigator.geolocation.getCurrentPosition(pos=>{

let lat1=pos.coords.latitude
let lon1=pos.coords.longitude

if(routingControl){

map.removeControl(routingControl)

}

routingControl=L.Routing.control({

waypoints:[

L.latLng(lat1,lon1),
L.latLng(lat,lon)

],

routeWhileDragging:false

}).addTo(map)

/* voz */

speak("Rota iniciada")

})

}

/* voz */

function speak(text){

let msg=new SpeechSynthesisUtterance(text)

msg.lang="pt-BR"

speechSynthesis.speak(msg)

}