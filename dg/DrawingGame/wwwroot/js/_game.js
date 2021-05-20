var ζ = extend(true, {}, ζ);

ζ.Game = {
    State: {},
    Element_GameContainer: document.getElementsByClassName("game")[0],

    SetupListeners: function () {
        // Server sent lobby state update
        ζ.Shared.Connection.on('StateUpdate', function (state) {
            ζ.Game.State = state;
            ζ.Game.StateUpdate();
        });
    },

    StateUpdate: function () {
        ζ.Lobby.Players = ζ.Game.State.players;
        ζ.Lobby.UpdatePlayers();
    },

    ClientLoop: function () {
        ζ.Game.CheckInWithServer();
    },

    CheckInWithServer: function () {
        ζ.Shared.Connection.invoke("CheckIn", ζ.Lobby.LobbyName, ζ.Lobby.PlayerName).catch(function (err) {
            return alert(err.toString());
        });
    },

    Init: function () {
        ζ.Game.SetupListeners();
        setInterval(ζ.Game.ClientLoop, 1000);
    }
};