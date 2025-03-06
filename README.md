🚖 Nearby Cabs Finder<br>
A web application to find nearby cabs based on user location using Flask, Leaflet.js, and OpenStreetMap.<br>
![Screenshot 2025-03-06 202358](https://github.com/user-attachments/assets/35e2d8a2-9434-44c7-910f-4e399bd7402c)
<br>
📌 Features<br>
✅ Search for cabs by entering a city or address<br>
✅ Detect current location automatically<br>
✅ Display cab locations on an interactive map<br>
✅ Show driver details and contact info<br>
✅ Get recommended to the nearest cab (Confirm or reject it!)<br>
✅ Clear search and reset map easily<br>

🛠️ Technologies Used<br>
Frontend: HTML, CSS (Bootstrap), JavaScript<br>
Backend: Flask (Python)<br>
Mapping: Leaflet.js, OpenStreetMap API<br>
Geolocation: Nominatim API<br>
<br>
🗺️ How It Works<br>
NOTE: Make changes in the index.html file before execution to resolve error 403 i.e. OpenStreetMap’s Nominatim API blocks requests from scripts that don’t include a proper User-Agent header.<br>
1️⃣ Enter a city or address in the input field.<br>
2️⃣ Click Find Cabs to search for nearby cabs.<br>
3️⃣ Click 📍 to detect your current location.<br>
4️⃣ View available cabs marked on the interactive map.<br>
5️⃣ Click on a cab marker for details (driver name, phone, etc.).<br>
<br>
📜 API Usage<br>
This app uses:<br>
OpenStreetMap (Nominatim API) for geolocation<br>
Custom Flask API to fetch cab data<br>
<br>
🏆 Contributing<br>
Pull requests are welcome! Open an issue if you find bugs or have feature requests.<br>
<br>
MIT License © 2025 Sumeet Otihal
