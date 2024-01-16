function fetchData() {
    // Fetch data from the JSON file
    fetch('data.JSON')
        .then(response => response.json())
        .then(dataResponse => {
            data = dataResponse;

            // Reset sidebar when the page is loaded
            resetSidebar();

            // Add markers for each robotics team
            markers = L.layerGroup().addTo(map);

            data.forEach(function (team) {
                var teamsAtLocation = getTeamsAtLocation(team.lat, team.lon);

                var marker = L.marker([team.lat, team.lon], {
                    icon: L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div class="marker-pin">${teamsAtLocation.length}</div>`,
                        iconSize: [30, 30], // Adjusted icon size
                        iconAnchor: [15, 30], // Adjusted icon anchor
                        popupAnchor: [0, -30]
                    })
                }).addTo(markers);

                // Customize the popup content with team information
                marker.bindPopup(`<b>${team.name}</b><br>Team Number: ${team.number}<br>Location: ${team.location}<br>Rookie Year: ${team.rookie}<br>Website: <a href="${team.website}" target="_blank">${team.website}</a>`);

                // Handle click event on marker
                marker.on('click', function () {
                    clearSidebar();
                    updateSidebar(teamsAtLocation);
                    zoomToTeam(team);
                });

                // Handle hover events
                marker.on('mouseover', function () {
                    marker.openPopup();
                });

                marker.on('mouseout', function () {
                    marker.closePopup();
                });
            });

            // Close sidebar when clicking on map background
            map.on('click', function () {
                resetSidebar();
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
