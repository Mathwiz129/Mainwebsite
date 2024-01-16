document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([35.85, -86.66], 7);
    var markers;
    var data;
    var selectedLocation;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function fetchData() {
        // Fetch data from the JSON file
        fetch('data.JSON')
            .then(response => response.json())
            .then(dataResponse => {
                data = dataResponse;
                // Add markers for each robotics team
                markers = L.layerGroup().addTo(map);

                data.forEach(function (team) {
                    var marker = L.marker([team.lat, team.lon]).addTo(markers);

                    // Customize the popup content with team information
                    marker.bindPopup(`<b>${team.name}</b><br>Team Number: ${team.number}<br>Location: ${team.location}<br>Rookie Year: ${team.rookie}<br>Website: <a href="${team.website}" target="_blank">${team.website}</a>`);

                    // Handle click event on marker
                    marker.on('click', function () {
                        var teamsAtLocation = getTeamsAtLocation(team.lat, team.lon);
                        if (teamsAtLocation.length > 1) {
                            clearSidebar();
                            updateSidebar(teamsAtLocation);
                        } else {
                            resetSidebar();
                        }
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

    // Call the fetchData function
    fetchData();

    // Add an event listener to the document body for clicks outside the map
    document.body.addEventListener('click', function (event) {
        if (!event.target.closest('#mapside')) {
            resetSidebar();
        }
    });

    function resetSidebar() {
        selectedLocation = null;
        // Clear existing teams in the sidebar
        document.getElementById('teamInfo').innerHTML = '';

        // Populate the sidebar with all teams
        data.forEach(function (team) {
            var teamBox = createTeamBox(team);
            document.getElementById('teamInfo').appendChild(teamBox);
        });
    }

    function clearSidebar() {
        // Clear existing teams in the sidebar
        document.getElementById('teamInfo').innerHTML = '';
    }

    function updateSidebar(teams) {
        // Populate the sidebar with teams at the specified location
        teams.forEach(function (team) {
            var teamBox = createTeamBox(team);
            document.getElementById('teamInfo').appendChild(teamBox);
        });
    }

    // Function to get teams at a specific location
    function getTeamsAtLocation(lat, lon) {
        selectedLocation = { lat, lon };
        return data.filter(team => team.lat === lat && team.lon === lon);
    }

    // Function to create a team box (reuse it for initial population)
    function createTeamBox(team) {
        var teamBox = document.createElement('div');
        teamBox.className = 'teamBox';
        teamBox.innerHTML = `<b>${team.name}</b><br>Team Number: ${team.number}<br>Location: ${team.location}<br>Rookie Year: ${team.rookie}<br>Website: <a href="${team.website}" target="_blank">${team.website}</a>`;
        teamBox.addEventListener('click', function () {
            zoomToTeam(team);
        });

        return teamBox;
    }

    function zoomToTeam(team) {
        map.setView([team.lat, team.lon], 15);  // Zoom to the selected team's location
    }

    function resetMap() {
        map.setView([35.85, -86.66], 7);
        resetSidebar(); // Reset sidebar when clicking the reset map button
    }

    // Expose necessary functions or variables globally if needed
    window.resetMap = resetMap;
});
