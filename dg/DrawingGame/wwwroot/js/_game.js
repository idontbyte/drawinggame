var ζ = extend(true, {}, ζ);

ζ.Game = {
    State: {},
    Element_GameContainer: document.getElementsByClassName("game")[0],
    Element_GameWait: document.getElementById("gamewait"),
    Element_AllParticles: document.getElementsByClassName("particle"),
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
            var particle = new Particle(ζ.Shared.DateToTicks(new Date()), ζ.Game.MouseX, ζ.Game.MouseY);
            ζ.Game.Particles.push(particle);
        }
    },

    StateUpdate: function () {
        ζ.Lobby.Players = ζ.Game.State.players;
        ζ.Lobby.UpdatePlayers();
        if (ζ.Lobby.Players.length > 1) {
            ζ.Game.Element_GameWait.style.display = 'none';
            ζ.Game.GameOn = true;
        } else {
            ζ.Game.Element_GameWait.style.display = 'block';
            ζ.Game.GameOn = false;
        }

        if (ζ.Game.MyDraw === false) {
            for (var i = 0; i < ζ.Game.Element_AllParticles.length; i++) {
                ζ.Game.Element_AllParticles[i].parentNode.removeChild(ζ.Game.Element_AllParticles[i]);
            }
            for (var i = 0; i < ζ.Game.State.particles.length; i++) {
                var particle = new Particle(ζ.Game.State.particles[i].id, ζ.Game.State.particles[i].left, ζ.Game.State.particles[i].top);
                ζ.Game.Particles.push(particle)
            }
        }
    },

    ClientLoop: function () {
        ζ.Game.CheckInWithServer();
    },

    CheckInWithServer: function () {
        if (ζ.Game.MyDraw === true) {

            var particlesToSend = ζ.Game.Particles.filter(function (x) {
                if (x.Sent === false) {
                    x.Sent = true;
                    return true;
                }
                return false;
            });

            ζ.Shared.Connection.invoke("CheckInDraw", ζ.Lobby.LobbyName, ζ.Lobby.PlayerName, particlesToSend).catch(function (err) {
                return alert(err.toString());
            });


        } else {
            ζ.Shared.Connection.invoke("CheckIn", ζ.Lobby.LobbyName, ζ.Lobby.PlayerName).catch(function (err) {
                return alert(err.toString());
            });
        }
    },

    Init: function () {
        ζ.Game.SetupListeners();
        setInterval(ζ.Game.ClientLoop, 1000);
        setInterval(ζ.Game.DrawLoop, 1);
    }
};