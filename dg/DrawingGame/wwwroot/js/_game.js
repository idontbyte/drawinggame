var ζ = extend(true, {}, ζ);

ζ.Game = {
    State: {},
    Element_GameContainer: document.getElementsByClassName("game")[0],
    Element_GameWait: document.getElementById("gamewait"),
    Element_DrawingSection: document.getElementById("drawingsection"),
    Element_PlayerIsDrawing: document.getElementById("sectionName"),
    Element_AllParticles: document.getElementsByClassName("particle"),
    DrawingSection: 1,
    DrawingSectionName: function () {
        switch (ζ.Game.DrawingSection) {
            case 1:
                return "Head";
            case 2:
                return "Body";
            case 3:
                return "Legs";
        }
    },
    MouseX: 0,
    MouseY: 0,
    Particles: [],
    Drawing: false,
    MyDraw: false,
    GameOn: false,

    SetupListeners: function () {
        // Server sent lobby state update
        ζ.Shared.Connection.on('StateUpdate', function (state) {
            ζ.Game.State = state;
            var myPlayer = state.players.filter(function (e) {
                if (e.playerName === ζ.Lobby.PlayerName) {
                    return true;
                }
                return false;
            })[0];
            if (myPlayer.myDraw === true) {
                ζ.Game.MyDraw = true;
            } else {
                ζ.Game.MyDraw = false;
            }
            ζ.Game.StateUpdate();
        });

        ζ.Game.Element_GameContainer.onmousemove = function (e) {
            var rect = e.target.getBoundingClientRect();
            ζ.Game.MouseX = e.clientX - rect.left - 12;
            ζ.Game.MouseY = e.clientY - rect.top - 21;
        }

        ζ.Game.Element_GameContainer.onmousedown = function (e) {
            ζ.Game.Drawing = true;
        }
        ζ.Game.Element_GameContainer.onmouseup = function (e) {
            ζ.Game.Drawing = false;
        }
    },

    DrawLoop: function () {
        if (ζ.Game.Drawing === true && ζ.Game.GameOn === true && ζ.Game.MyDraw === true) {
            var x = Math.round(ζ.Game.MouseX / 4);
            var y = Math.round(ζ.Game.MouseY / 4);
            if (ζ.Game.Particles[x][y] === 0) {
                ζ.Game.Particles[x][y] = 1;
                var particle = new Particle(x, y);
            }
        }
    },

    StateUpdate: function () {
        ζ.Lobby.Players = ζ.Game.State.players;
        ζ.Lobby.UpdatePlayers();
        if (ζ.Lobby.Players.length > 1) {
            ζ.Game.Element_GameWait.style.display = 'none';
            ζ.Game.Element_DrawingSection.style.display = 'block';
            ζ.Game.Element_PlayerIsDrawing.innerHTML = ζ.Game.DrawingSectionName();
            ζ.Game.GameOn = true;
        } else {
            ζ.Game.Element_GameWait.style.display = 'block';
            ζ.Game.Element_DrawingSection.style.display = 'none';
            ζ.Game.GameOn = false;
        }

        if (ζ.Game.MyDraw === false) {
            for (var i = 0; i < ζ.Game.Element_AllParticles.length; i++) {
                ζ.Game.Element_AllParticles[i].parentNode.removeChild(ζ.Game.Element_AllParticles[i]);
            }

            var parsedParticles = JSON.parse(ζ.Game.State.particles);
            for (var x = 0; x < 200; x++) {
                for (var y = 0; y < 150; y++) {
                    ζ.Game.Particles[x][y] = parsedParticles[x][y];
                    if (parsedParticles[x][y] === 1) {
                        var particle = new Particle(x, y);
                    } 
                }
            }
        }
    },

    ClientLoop: function () {
        ζ.Game.CheckInWithServer();
    },

    CheckInWithServer: function () {
        if (ζ.Game.MyDraw === true) {
            ζ.Shared.Connection.invoke("CheckInDraw", ζ.Lobby.LobbyName, ζ.Lobby.PlayerName, JSON.stringify(ζ.Game.Particles)).catch(function (err) {
                return console.log(err)
            });
        } else {
            ζ.Shared.Connection.invoke("CheckIn", ζ.Lobby.LobbyName, ζ.Lobby.PlayerName).catch(function (err) {
                return console.log(err)
            });
        }
    },

    Init: function () {
        for (var x = 0; x < 200; x++) {
            ζ.Game.Particles[x] = new Array(2);
        }
        for (var x = 0; x < 200; x++) {
            for (var y = 0; y < 150; y++) {
                ζ.Game.Particles[x][y] = 0;
            }
        }
        ζ.Game.SetupListeners();

        setInterval(ζ.Game.ClientLoop, 1000);
        setInterval(ζ.Game.DrawLoop, 1);
    }
};