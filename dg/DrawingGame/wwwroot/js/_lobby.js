var ζ = extend(true, {}, ζ);

ζ.Lobby = {
    PlayerName: '',
    LobbyName: '',
    Players: [],

    Element_LobbyContainer: document.getElementsByClassName("lobbies")[0],
    Element_NameSubmit: document.getElementById("nameSubmit"),
    Element_LobbiesPlayer: document.getElementsByClassName("lobbies-player")[0],
    Element_LobbiesPanel: document.getElementsByClassName("lobbies-panel")[0],
    Element_NameDisplay: document.getElementById("name-display"),
    Element_LobbiesList: document.getElementsByClassName("lobbies-list")[0],
    Element_CreateLobbyButton: document.getElementById("newLobbyCreate"),
    Element_LobbyPlayersContainer: document.getElementById("lobby"),
    Element_LobbyPlayersList: document.getElementById("lobbyplayers"),

    SetupEvents: function () {
        // Confirm Name Button
        ζ.Lobby.Element_NameSubmit.onclick = (function () {
            if (ζ.Lobby.PlayerName.length < 3)
                return alert("Name must be three characters or more.");
            ζ.Shared.Connection.invoke("CheckName", ζ.Lobby.PlayerName).catch(function (err) {
                return alert(err.toString());
            });
        });

        // Create Lobby Button
        ζ.Lobby.Element_CreateLobbyButton.onclick = (function () {
            if (ζ.Lobby.LobbyName.length < 3)
                return alert("Name must be three characters or more.");

            ζ.Shared.Connection.invoke("CheckLobbyName", ζ.Lobby.LobbyName, ζ.Lobby.PlayerName).catch(function (err) {
                return alert(err.toString());
            });
        });
    },

    SetupListeners: function () {
        // Server sent New Player Name response
        ζ.Shared.Connection.on("CheckName", function (ok) {
            if (ok === true) {
                ζ.Lobby.Element_NameSubmit.style.display = "none";
                ζ.Lobby.Element_LobbiesPlayer.style.display = "none";
                ζ.Lobby.Element_LobbiesPanel.style.display = "block";
                ζ.Lobby.Element_NameDisplay.innerText = ζ.Lobby.PlayerName;
            } else {
                alert("Sorry, that name is taken.. please try another.")
            }
        });

        // Server sent Lobby Update
        ζ.Shared.Connection.on("LobbyUpdate", function (lobbies) {
            ζ.Lobby.Element_LobbiesList.innerHTML = "";
            lobbies.forEach(function (lobby) {
                ζ.Lobby.LobbyName = lobby.name;
                ζ.Lobby.Element_LobbiesList.innerHTML +=
                    "<li>"
                    + lobby.name
                    + "<button id=\"join" + lobby.name + "\" "
                    + "onclick=\"ζ.Lobby.JoinLobby('" + lobby.name + "')\">Join</button></li>";
            })
        });

        // Server sent Create Lobby response (Player 1)
        ζ.Shared.Connection.on("CheckLobbyName", function (ok, state) {
            if (ok === true) {
                ζ.Game.State = state;
                ζ.Lobby.Element_LobbyContainer.style.display = "none";
                ζ.Game.Element_GameContainer.style.display = "block";
                ζ.Lobby.Element_LobbyPlayersContainer.style.display = "block";
                ζ.Game.Init();
            } else {
                alert("Sorry, that lobby already exists.. please try another name.")
            }
        });

        // Server sent Join Existing Lobby response
        ζ.Shared.Connection.on("JoinExistingLobby", function (state) {
            ζ.Game.State = state;
            ζ.Lobby.Element_LobbyContainer.style.display = "none";
            ζ.Game.Element_GameContainer.style.display = "block";
            ζ.Lobby.Element_LobbyPlayersContainer.style.display = "block";
            ζ.Game.Init();
        });
    },

    UpdatePlayers: function () {
        ζ.Lobby.Element_LobbyPlayersList.innerHTML = '';
        for (var i = 0; i < ζ.Lobby.Players.length; i++) {
            if (ζ.Lobby.Players[i].myDraw === true) {
                var player = '<li class="active">' + ζ.Lobby.Players[i].playerName + '</li>';
            } else {
                var player = '<li>' + ζ.Lobby.Players[i].playerName + '</li>';
            }
            ζ.Lobby.Element_LobbyPlayersList.innerHTML += player;
        }
    },

    JoinLobby: function (lobbyName) {
        ζ.Shared.Connection.invoke("JoinExistingLobby", lobbyName, ζ.Lobby.PlayerName).catch(function (err) {
            return alert(err.toString());
        });
    },

    Init: function () {
        ζ.Lobby.SetupEvents();

        ζ.Lobby.SetupListeners();
    }
};