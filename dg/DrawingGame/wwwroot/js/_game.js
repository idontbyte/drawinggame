var ζ = extend(true, {}, ζ);

ζ.Game = {
    State: {},
    Element_GameContainer: document.getElementsByClassName("game")[0],
    Element_GameWait: document.getElementById("gamewait"),
    Element_DrawingSection: document.getElementById("drawingsection"),
    Element_PlayerIsDrawing: document.getElementById("sectionName"),
    Element_AllParticles: document.getElementsByClassName("particle"),
    Element_DoneButton: document.getElementById("saveImage"),
    Element_DrawingPanel: document.getElementById("drawingpanel"),
    Element_Head: document.getElementById("head"),
    Element_Body: document.getElementById("body"),
    Element_Legs: document.getElementById("legs"),
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
                ζ.Game.Element_DoneButton.style.display = 'block';
            } else {
                ζ.Game.MyDraw = false;
                ζ.Game.Element_DoneButton.style.display = 'none';
            }
            ζ.Game.StateUpdate();
        });

        ζ.Shared.Connection.on('HeadSend', function (state) {
            while (ζ.Game.Element_AllParticles.length > 0) {
                ζ.Game.Element_AllParticles[0].parentNode.removeChild(ζ.Game.Element_AllParticles[0]);
            }
            ζ.Game.Element_DrawingPanel.style.display = 'block';
            console.log(state)
            var parsedParticles = JSON.parse(state.particles);
            console.log(parsedParticles)
            for (var x = 0; x < 200; x++) {
                for (var y = 0; y < 150; y++) {
                    if (parsedParticles[x][y] === 1) {
                        var particle = new ParticleInElement(x, y, ζ.Game.Element_Head);
                    }
                }
            }
        });

        ζ.Shared.Connection.on('BodySend', function (state) {
            var parsedParticles = JSON.parse(state.particles);
            for (var x = 0; x < 200; x++) {
                for (var y = 0; y < 150; y++) {
                    if (parsedParticles[x][y] === 1) {
                        var particle = new ParticleInElement(x, y, ζ.Game.Element_Body);
                    }
                }
            }
        });

        ζ.Shared.Connection.on('LegsSend', function (state) {
            var parsedParticles = JSON.parse(state.particles);
            for (var x = 0; x < 200; x++) {
                for (var y = 0; y < 150; y++) {
                    if (parsedParticles[x][y] === 1) {
                        var particle = new ParticleInElement(x, y, ζ.Game.Element_Legs);
                    }
                }
            }
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
            if (x > 0 && y > 0) {
                if (ζ.Game.Particles[x][y] === 0) {
                    ζ.Game.Particles[x][y] = 1;
                    var particle = new Particle(x, y);
                }
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
        ζ.Game.DrawingSection = ζ.Game.State.drawing;


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

    FinishedDraw: function () {
        ζ.Shared.Connection.invoke("FinishedDraw", ζ.Lobby.LobbyName, ζ.Lobby.PlayerName, JSON.stringify(ζ.Game.Particles)).catch(function (err) {
            return console.log(err)
        });
        while (ζ.Game.Element_AllParticles.length > 0) {
            ζ.Game.Element_AllParticles[0].parentNode.removeChild(ζ.Game.Element_AllParticles[0]);
        }
        for (var x = 0; x < 200; x++) {
            ζ.Game.Particles[x] = new Array(2);
        }
        for (var x = 0; x < 200; x++) {
            for (var y = 0; y < 150; y++) {
                ζ.Game.Particles[x][y] = 0;
            }
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