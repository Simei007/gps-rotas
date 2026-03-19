let map = L.map('map').setView([-23.5505,-46.6333],13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map)

let marker
let watchId
let trilha=[]

let linha = L.polyline([],{
color:"red",
weight:5
}).addTo(map)

let carro = L.icon({

iconUrl:"https://cdn-icons-png.flaticon.com/512/61/61168.png",
iconSize:[40,40],
iconAnchor:[20,20]

})

function startGPS(){

watchId = navigator.geolocation.watchPosition(pos=>{

let lat = pos.coords.latitude
let lon = pos.coords.longitude
let heading = pos.coords.heading || 0

let posicao=[lat,lon]

if(!marker){

marker=L.marker(posicao,{icon:carro}).addTo(map)

}else{

marker.setLatLng(posicao)

}

map.setView(posicao,18)

rotateMap(heading)

registrarTrilha(lat,lon)

})

}

function rotateMap(heading){

let pane = map.getPane('mapPane')

pane.style.transform = `rotate(${-heading}deg)`

}

function registrarTrilha(lat,lon){

trilha.push([lat,lon])

linha.setLatLngs(trilha)

}

function startRecording(){

trilha=[]

}

function exportGPX(){

let gpx='<?xml version="1.0"?><gpx><trk><trkseg>'

trilha.forEach(p=>{

gpx+=`<trkpt lat="${p[0]}" lon="${p[1]}"></trkpt>`

})

gpx+='</trkseg></trk></gpx>'

let blob=new Blob([gpx])

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="rota.gpx"

a.click()

}

function setDestino(){

alert("Clique no mapa para escolher destino")

map.once("click",e=>{

L.marker(e.latlng).addTo(map)

})

}