let map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let markers = [];
    let cabIcon = L.icon({
    iconUrl: "/static/images/taxi.png", //Taxi Icon (Can use a URL)
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
});

    function clearSearch() {
        document.getElementById("location").value = "";
        document.getElementById("result").innerHTML = "";
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        map.setView([20.5937, 78.9629], 5);
    }

    async function findCabs() {
        const location = document.getElementById("location").value.trim();
        if (!location) {
            alert("Please enter a location.");
            return;
        }
    
        document.querySelector(".loader").style.display = "block";
        document.getElementById("result").innerHTML = "";
    
        try {
            const response = await fetch("/find_cabs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ location })
            });
    
            const data = await response.json();
            document.querySelector(".loader").style.display = "none";
            document.getElementById("result").innerHTML = data.result.replace(/\n/g, "<br>");
    
            updateMap(data.cabs);
            showRecommendedCab(data.recommended_cab);
    
        } catch (error) {
            document.querySelector(".loader").style.display = "none";
            document.getElementById("result").innerHTML = "<span class='text-danger'>An error occurred.</span>";
        }
    }

    function showRecommendedCab(cab) {
        if (!cab) return;
    
        const recommendationDiv = document.createElement("div");
        recommendationDiv.classList.add("recommendation-card");
        recommendationDiv.innerHTML = `
            <h5>🚖 Recommended Cab</h5>
            <p><b>${cab.name}</b></p>
            <p>🆔 ${cab.id}</p>
            <p>📞 ${cab.phone}</p>
            <p>📏 ${cab.distance.toFixed(2)} km away</p>
            <button class="btn btn-success" onclick="confirmCab(${cab.id})">Confirm</button>
            <button class="btn btn-danger" onclick="rejectCab()">Reject</button>
        `;
    
        document.getElementById("result").prepend(recommendationDiv);
    }
    
    function confirmCab(cabId) {
        alert(`✅ Cab ID ${cabId} confirmed!`);
    }    
    
    function rejectCab() {
        document.querySelector(".recommendation-card").remove();
    }

    function updateMap(cabs) {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    
        if (cabs.length === 0) {
            alert("No nearby cabs found.");
            return;
        }
    
        cabs.forEach(cab => {
            let estimatedTime = (cab.distance / 40).toFixed(1); // Assuming avg speed = 40 km/h
            let estimatedFare = (cab.distance * 15).toFixed(2); // Assuming ₹15 per km
            
            let marker = L.marker([cab.lat, cab.lon], { icon: cabIcon }).addTo(map)
                .bindPopup(`<b>${cab.name}</b><br>
                            Driver ID: ${cab.id}<br>
                            Phone: ${cab.phone}<br>
                            Distance: ${cab.distance.toFixed(2)} km<br>
                            ⏳ Estimated Time: ${estimatedTime} hrs<br>
                            💰 Estimated Base Fare: ₹${estimatedFare}`);
    
            markers.push(marker);
        });
    
        map.setView([cabs[0].lat, cabs[0].lon], 12);
    }

    function displayCabs(cabs) {
        let cabList = document.getElementById("cab-list");
        cabList.innerHTML = "";
    
        cabs.forEach((cab) => {
            let cabCard = document.createElement("div");
            cabCard.classList.add("card", "p-2", "mt-2", "text-dark");
            cabCard.style.cursor = "pointer";
            cabCard.innerHTML = `
                <strong>🚖 ${cab.name}</strong> <br> 
                📏 ${cab.distance.toFixed(2)} km away <br> 
                💰 ₹${cab.estimated_fare} | ⏳ ${cab.estimated_time} hrs <br>
                <button class="btn btn-primary mt-1" onclick="confirmCab('${cab.id}')">Confirm</button>
            `;
            cabList.appendChild(cabCard);
        });
    }

    function detectLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                let resultDiv = document.getElementById("result");
                resultDiv.innerHTML = "Detecting location...";

                try {
                    let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                        headers: { "User-Agent": "MyCabFinderApp/1.0 (cabfinder50@gmail.com)" } //Make changes here
                    });
                    let data = await response.json();
                    let detectedLocation = data.display_name || "Your location";
                    document.getElementById("location").value = detectedLocation;
                    resultDiv.innerHTML = `Detected Location: ${detectedLocation}`;
                    map.setView([latitude, longitude], 12);
                } catch (error) {
                    resultDiv.innerHTML = "<span class='text-danger'>Failed to detect location.</span>";
                }
            }, () => {
                alert("Location access denied.");
            });
        } else {
            alert("Geolocation is not supported.");
        }
    }

    map.on('click', async function (e) {
        const { lat, lng } = e.latlng;
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
                headers: { "User-Agent": "MyCabFinderApp/1.0 (cabfinder50@gmail.com)" } //Make changes here
            });
            let data = await response.json();
            let selectedLocation = data.display_name || `${lat}, ${lng}`;
            document.getElementById("location").value = selectedLocation;
        } catch (error) {
            alert("Failed to fetch location details.");
        }
    });
