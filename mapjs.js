document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([35.85, -86.66], 7);
    var markers;
    var data;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fetch GeoJSON data for Tennessee outline
    fetch('https://tnmap.tn.gov/arcgis/rest/services/ADMINISTRATIVE_BOUNDARIES/COUNTY_BOUNDARIES_AND_CITY_BOUNDARIES/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json')
        .then(response => response.json())
        .then(tennesseeData => {
            // Add Tennessee outline to the map
            L.geoJSON(tennesseeData, {
                style: {
                    color: 'red',  // You can customize the color of the outline
                    weight: 2,
                    opacity: 1
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error fetching Tennessee outline data:', error);
        });

    function fetchData() {
        fetch('data.JSON')
            .then(response => response.json())
            .then(dataResponse => {
                data = dataResponse;
                markers = L.layerGroup().addTo(map);

                data.forEach(function (team) {
                    var marker = L.marker([team.lat, team.lon]).addTo(markers);

                    marker.bindPopup(`<b>${team.name}</b><br>Team Number: ${team.number}<br>Location: ${team.location}<br>Rookie Year: ${team.rookie}<br>Website: <a href="${team.website}" target="_blank">${team.website}</a>`);

                    marker.on('click', function () {
                        var latlng = marker.getLatLng();
                        console.log('Marker Clicked:');
                        console.log('Coordinates:', latlng);

                        var teamsAtLocation = getTeamsAtLocation(latlng.lat, latlng.lng);
                        console.log('Teams at Location:', teamsAtLocation);

                        resetSidebar();

                        if (teamsAtLocation.length > 0) {
                            updateSidebar(teamsAtLocation);
                        } else {
                            resetSidebar();
                        }
                        zoomToTeam(team);
                    });

                    marker.on('mouseover', function () {
                        marker.openPopup();
                    });

                    marker.on('mouseout', function () {
                        marker.closePopup();
                    });
                });

                resetSidebar();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Handle the error here, e.g., display an error message to the user
            });
    }

    fetchData();

    document.body.addEventListener('click', function (event) {
        if (!event.target.closest('#map') && !event.target.closest('#mapside')) {
            resetSidebar();
        }
    });

    function clearSidebar() {
        document.getElementById('teamInfo').innerHTML = '';
    }

    function resetSidebar() {
        clearSidebar();

        data.forEach(function (team) {
            var teamBox = createTeamBox(team);
            document.getElementById('teamInfo').appendChild(teamBox);
        });
    }

    function updateSidebar(teams) {
        clearSidebar();

        teams.forEach(function (team) {
            var teamBox = createTeamBox(team);
            document.getElementById('teamInfo').appendChild(teamBox);
        });
    }

    function getTeamsAtLocation(lat, lon) {
        return data.filter(team => team.lat == lat && team.lon == lon);
    }

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
        map.setView([team.lat, team.lon], 15);
    }

    function resetMap() {
        map.setView([35.85, -86.66], 7);
        resetSidebar();
    }

    window.resetMap = resetMap;
});
