import React, { useState, useEffect } from "react";
import config from "../config";
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { icon } from "leaflet";

const URL = `${config.WEBSOCKET_URL}`;
let connect_message = '{"type": "join", "id": "user id", "username": "Skinny Pete"}';
const originAirportIcon = new L.Icon({
    iconUrl: require("../assets/images/oAirport.png"),
    iconSize: [30, 30],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  const destinationAirportIcon = new L.Icon({
    iconUrl: require("../assets/images/dAirport.png"),
    iconSize: [30, 30],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  const planeIcon = new L.Icon({
    iconUrl: require("../assets/images/plane2.png"),
    iconSize: [30, 30],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  const dotIcon = new L.Icon({
    iconUrl: require("../assets/images/punto.png"),
    iconSize: [30, 30],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  const takeoffIcon = new L.Icon({
    iconUrl: require("../assets/images/takeoff.png"),
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  const landingIcon = new L.Icon({
    iconUrl: require("../assets/images/landing.png"),
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

const Flights = () => {
    const [ws, setWs] = useState(new WebSocket(URL));
    // const [message, setMessage] = useState([]);
    // const [messages, setMessages] = useState([]);
    const [flights, setFlights] = useState({});
    const [flights2, setFlights2] = useState([]);
    const [positions] = useState({});
    const [takeOff, setTakeOff] = useState({});
    const [takeOff2, setTakeOff2] = useState([]);
    const [takeOff3, setTakeOff3] = useState([]);
    const [landing, setLanding] = useState({});
    const [landing2, setLanding2] = useState([]);
    const [landing3, setLanding3] = useState([]);
    const [crashed, setCrashed] = useState({});

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState([]);

    const submitMessage = (msg) => {
      // const txt = `${usr}: ${msg}`
      const message = { type: "chat", content: msg};
      ws.send(JSON.stringify(message));
    }
    useEffect(() => {
      if (takeOff3.length > 0 ) {
        setTimeout(() => {
          takeOff3.splice(takeOff3.length - 1);
        }, 5000)
      }

      if (landing3.length > 0 ) {
        setTimeout(() => {
          landing3.splice(landing3.length - 1);
        }, 5000)
      }
	    ws.onopen = () => {
	      console.log('WebSocket Connected');
        ws.send(connect_message);
	    }
        ws.onmessage = function (event) {
            const message = JSON.parse(event.data);
            try {
                if (message.type === "flights") {
              
                    setFlights(message["flights"]);
                    setFlights2(Object.keys(message["flights"]));
                    Object.keys(message["flights"]).forEach((element) => {
                      if (element in positions) {
                    
                      } else {
                        positions[element] = {element};
                        positions[element].positions = []; 
                        positions[element].positionsDefined = "false"
                      }
                    });
                }

                if (message.type === "plane") {
                  positions[message["plane"].flight_id].ETA = message["plane"].ETA;
                  positions[message["plane"].flight_id].airline = message["plane"].airline;
                  positions[message["plane"].flight_id].arrival = message["plane"].arrival;
                  positions[message["plane"].flight_id].distance = message["plane"].distance;
                  positions[message["plane"].flight_id].captain = message["plane"].captain;
                  positions[message["plane"].flight_id].heading = message["plane"].heading;
                  positions[message["plane"].flight_id].position = message["plane"].position;
                  positions[message["plane"].flight_id].status = message["plane"].status;
                  const x = message["plane"].position["lat"];
                  const y = message["plane"].position["long"];
                  if (positions[message["plane"].flight_id].positions.length === 0) {
                    positions[message["plane"].flight_id].positions.push([x, y]);
                  }
                  if (positions[message["plane"].flight_id].positions.length > 0) {
                    var x0 = positions[message["plane"].flight_id].positions[positions[message["plane"].flight_id].positions.length - 1][0];
                    var y0 = positions[message["plane"].flight_id].positions[positions[message["plane"].flight_id].positions.length - 1][1];
                    if (x0 !== x) {
                      if (y0 !== y) {
                        positions[message["plane"].flight_id].positions.push([x, y]);
                      }
                    }
                    // console.log(flights);
                    
                  }
                  positions[message["plane"].flight_id].positionsDefined = "true";
                  // console.log(positions[`${message["plane"].flight_id}`]);
                }

                if (message.type === "take-off") {
                    // console.log(message);
                    if (message["flight_id"] in flights) {
                      setTakeOff(flights[`${message["flight_id"]}`].departure.location);
                      setTakeOff2(Object.keys(takeOff));
                      takeOff3.push([flights[`${message["flight_id"]}`].departure.location]);
                      
                    } else {
                      // console.log("no esta");
                    }
                }

                if (message.type === "landing") {
                  if (message["flight_id"] in flights) {
                    setLanding(flights[`${message["flight_id"]}`].destination.location);
                    setLanding2(Object.keys(landing));
                    landing3.push([flights[`${message["flight_id"]}`].destination.location]);
                    
                  } else {
                    // console.log("no esta");
                  }
                }

                if (message.type === "crashed") {
                  console.log("crashed");
                  console.log(message["flight_id"]);
                  if (message["flight_id"] in flights) {
                    // setear algo con la posicion de choque
                    // setCrashed(positions[flights[`${message["flight_id"]}`]].position);
                    // positions[flights[`${message["flight_id"]}`]].status = "crashed";
                    console.log(positions[message["flight_id"]].position);
                    console.log(crashed);
                    console.log(positions[flights[`${message["flight_id"]}`]]);
                    console.log(crashed["lat"]);
                  }
                
                }

                if (message.type === "message") {
                    // console.log(message);
                    // console.log(message["message"].content);
                    messages.push([message["message"].name, message["message"].content, message["message"].date, message["message"].level]);
                    if (messages.length > 5) {
                      setMessages([messages[messages.length - 5], messages[messages.length - 4], messages[messages.length - 3],
                        messages[messages.length - 2], messages[messages.length - 1]]);
                    }
                    // console.log(messages);
                    // mensaje
                    // fecha y hora
                    // emisor
                }

            } catch (err) {
                // whatever you wish to do with the err
            }
            
            };

	    return () => {
	      ws.onclose = () => {
	        console.log('WebSocket Disconnected');
	        setWs(new WebSocket(URL));
	      }
	    }
  	}, [ws.onmessage, ws.onopen, ws.onclose]);
    return (
      <div className="main">
          <div className="map">
            <MapContainer center={[51.505, -0.09]} zoom={1.5} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {flights2.length > 0 && 
                  flights2.map( (element, index) => (
                    <Marker position={[flights[element].departure.location["lat"], flights[element].departure.location["long"]]} key={index} icon={originAirportIcon} >
                      <Popup>
                        <p>ID vuelo ORIGEN: {flights[element].id}</p>
                        <p>Nombre: {flights[element].departure.name}</p>
                        <p>Pais: {flights[element].departure.city.country["name"]}</p>
                        <p>ciudad: {flights[element].departure.city.name}</p>
                      </Popup>
                    </Marker>
                  ))
                }
              
                {flights2.length > 0 && 
                  flights2.map( (element, index) => (
                    <Marker position={[flights[element].destination.location["lat"], flights[element].destination.location["long"]]} key={index} icon={destinationAirportIcon} >
                      <Popup>
                        <p>ID vuelo DESTINO: {flights[element].id}</p>
                        <p>Nombre: {flights[element].destination.name}</p>
                        <p>Pais: {flights[element].destination.city.country["name"]}</p>
                        <p>ciudad: {flights[element].destination.city.name}</p>
                      </Popup>
                    </Marker>
                  ))
                }

                {flights2.length > 0 && 
                  flights2.map( (element, index) => (
                    <Polyline positions={[[flights[element].departure.location["lat"], flights[element].departure.location["long"]],[flights[element].destination.location["lat"], flights[element].destination.location["long"]]]} weight={5} opacity={0.3} pathOptions={{ color: "red" }} ></Polyline>
                  ))
                }  

                {flights2.length > 0 &&
                  flights2.map( (vuelo, index) => {
                    if (positions[vuelo].positionsDefined === "true" && positions[vuelo].status === "flying") {
                        return <Marker position={[positions[vuelo].positions[positions[vuelo].positions.length - 1][0], positions[vuelo].positions[positions[vuelo].positions.length - 1][1]]} key={index} icon={planeIcon}>
                        <Popup>
                          <p>ID vuelo: {vuelo}</p>
                          <p>Aerolinea: {positions[vuelo].airline["name"]}</p>
                          <p>capitan: {positions[vuelo].captain}</p>
                          <p>ETA: {positions[vuelo].ETA}</p>
                          <p>Estado: {positions[vuelo].status}</p>
                        </Popup>
                      </Marker>
                    } else {
                      return false
                    }
                  })
                }
                {flights2.length > 0 &&
                  // flights2.map( (vuelo, index) => {
                  //   if (positions[vuelo].positionsDefined === "true") {
                  //     // positions[vuelo].positions.map( (posicion, index2) => {
                  //     //   <Marker position={[posicion[0], posicion[1]]} key={index2} icon={takeoffIcon}></Marker>
                  //     //   // console.log(`${vuelo} ${posicion[0]}, ${posicion[1]}`)
                  //     //   // console.log(posicion)
                  //     // })
                  //   } else {
                  //     return true
                  //   }
                  // })
                  flights2.forEach( function(valor, indice, array) {
                    if (positions[valor].positionsDefined === "true") {
                      positions[valor].positions.map( (posicion, index) => {
                        return <Marker position={[posicion[0], posicion[1]]} key={index} icon={dotIcon}></Marker>
                      })
                    }
                  })
                }

                {takeOff3.length > 0 &&
                  takeOff3.map( (element, index) => {
                    return <Marker position={[element[0]["lat"], element[0]["long"]]} key={index} icon={takeoffIcon}>
                      <Popup>
                        <p>Take off</p>
                      </Popup>
                    </Marker>
                  })
                }

                {landing3.length > 0 &&
                  landing3.map( (element, index) => {
                    return <Marker position={[element[0]["lat"], element[0]["long"]]} key={index} icon={landingIcon}>
                      <Popup>
                        <p>Landing</p>
                      </Popup>
                    </Marker>
                  })
                }
      
            </MapContainer>
            <div className="tabla">
              <div className="fila">
                  <div className="fila-element">ID vuelo</div>
                  <div className="fila-element">Origen</div>
                  <div className="fila-element">Destino</div>
                </div>
              {flights2.length > 0 &&
                flights2.map( (vuelo, index) => {
                  return <div className="fila">
                      <div className="fila-element">{vuelo}</div>
                      <div className="fila-element">{flights[`${vuelo}`].departure.name}</div>
                      <div className="fila-element">{flights[`${vuelo}`].destination.name}</div>
                    </div>
                })
              }
            </div>
          </div>
          <div className="chat">
            <div>
              {messages.length > 0 &&
                messages.map( (element, index) => {
                  if (element[3] === "warn") {
                    return <p className="warning">{element[0]}: {element[1]} ({element[2]})</p>
                  } else {
                    return <p className="mensajes">{element[0]}: {element[1]} ({element[2]})</p>
                  }
                  
                })
              }
            </div>
            <div className="btn">
              <form
                action=""
                onSubmit={e => {
                  e.preventDefault();
                  submitMessage(message);
                  setMessage([]);
                }}
              >
                <input
                  type="text"
                  className="textfield"
                  placeholder={'Escribe un mensaje'}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <input type="submit" value={'Enviar'} className="send"/>
              </form>
            </div>
          </div>
    </div>
    )
}

export default Flights;

/*

- en take off se me esta demorando en agregar a useState

- probar mostrar avion en pos de primer elemento de lista positions
- ver si se estan superponiendo elementos, esa wea webiaba al poner pings encimas
- en vola se superpone icon de avion con icon de aeropuerto
- revisar si se superponen iconos qls

*/