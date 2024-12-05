import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMap.css"
import { HiLocationMarker } from "react-icons/hi";


const WorldMap = () => {

    const [query, setQuery] = useState("");
    const [locationData, setLocationData] = useState(null);
    const [toDoList, setToDoList] = useState(() => {
        // Load initial data from localStorage
        const savedList = localStorage.getItem("toDoList");
        return savedList ? JSON.parse(savedList) : [];
    });

    useEffect(() => {
        // Update localStorage when toDoList changes
        localStorage.setItem("toDoList", JSON.stringify(toDoList));
    }, [toDoList]);

    const handleSearch = async () => {
        if (!query.trim()) {
            alert("Please enter a valid address!");
            return;
        }

        try {
            const response = await axios.get(
                `http://api.positionstack.com/v1/forward?access_key=518f42f7583f290adeeca101fd24629f&query=${query}`
            );

            const { data } = response;
            if (data?.data?.length > 0) {
                const location = data.data[0];
                setLocationData({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    label: location.label,
                });

                // Save to database via API (mock backend call)
                //   await axios.post("http://localhost:5000/api/locations", {
                //     latitude: location.latitude,
                //     longitude: location.longitude,
                //     label: location.label,
                //   });

                // Add to to-do list
                setToDoList((prevList) => [
                    ...prevList,
                    {
                        id: Date.now(),
                        latitude: location.latitude,
                        longitude: location.longitude,
                        label: location.label,
                    },
                ]);
            } else {
                alert("No location data found!");
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
            alert("Error fetching location data. Please try again.");
        }
    };

    const handleDelete = (id) => {
        setToDoList((prevList) => prevList.filter((item) => item.id !== id));
    };

    return (

        <>
            <div style={{ padding: "20px" }}>

                <h1 className="primaryText">Real Estate Project Listing for MagicBricks</h1>
                <div>
                    <div className="flexCenter search-bar" style={{maxWidth:"400px"}}>
                        <HiLocationMarker color="var(--blue)" size={25} />
                        <input
                            placeholder="Search by title/city/country..."
                            type="text"
                            value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        />
                         <button className="button" onClick={handleSearch} >
                        Search
                    </button>
                    </div>


                    

                </div>

                {locationData && (
                    <div style={{ marginTop: "20px" }}>
                        <h2>Map</h2>
                        <MapContainer
                            center={[locationData.latitude, locationData.longitude]}
                            zoom={13}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[locationData.latitude, locationData.longitude]}>
                                <Popup>{locationData.label}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                )}

                <div style={{ width: "95%", margin: "auto", paddingTop: "20px" }} >
                    <h2 className="primaryText">Similar City</h2>

                    <main className="table" id="customers_table">

                        <section className="table__body">
                            <table>
                                <thead>
                                    <tr>

                                        <th> Address<span className="icon-arrow">↑</span></th>

                                        <th> Lang <span className="icon-arrow">↑</span></th>
                                        <th> Long <span className="icon-arrow">↑</span></th>
                                        <th> Delete <span className="icon-arrow">↑</span></th>
                                    </tr>
                                </thead>
                                <tbody>


                                    {toDoList.map((item) => (
                                        <tr key={item.id} style={{}}>


                                            <td> <strong>{item.label}</strong> </td>
                                            <td> Lat: {item.latitude} </td>
                                            <td>
                                                Lon: {item.longitude}
                                            </td>
                                            <td> <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{
                                                    marginLeft: "10px",
                                                    padding: "5px 10px",
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    border: "none",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Delete
                                            </button></td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </section>
                    </main>



                </div>
            </div>
        </>

    );
}

export default WorldMap