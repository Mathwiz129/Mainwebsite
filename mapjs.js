document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([35.85, -86.66], 7);
    var markers;
    var data;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function fetchData() {
        fetch('data.JSON')
            .then(response => response.json())
            .then(dataResponse => {
                data = dataResponse;
                markers = L.layerGroup().addTo(map);

                data.forEach(function (team) {
                    var teamsAtLocation = getTeamsAtLocation(team.lat, team.lon);

                    var marker = L.marker([team.lat, team.lon]).addTo(markers);

                    if (teamsAtLocation.length > 1) {
                        var teamCountDiv = document.createElement('div');
                        teamCountDiv.className = 'teamCount';
                        teamCountDiv.innerHTML = teamsAtLocation.length;
                        marker.bindTooltip(teamCountDiv, { permanent: true }).openTooltip();
                    }

                    marker.bindPopup(`<b>${team.name}</b><br>Team Number: ${team.number}<br>Location: ${team.location}<br>Rookie Year: ${team.rookie}<br>Website: <a href="${team.website}" target="_blank">${team.website}</a>`);

                    marker.on('click', function () {
                        var latlng = marker.getLatLng();
                        console.log('Marker Clicked:');
                        console.log('Coordinates:', latlng);

                        teamsAtLocation = getTeamsAtLocation(latlng.lat, latlng.lng);
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

                    marker.on('mouseover', function () {
                        marker.openPopup();
                        var popup = marker.getPopup();
                        popup.on('mouseout', function () {
                            marker.closePopup();
                        });
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
