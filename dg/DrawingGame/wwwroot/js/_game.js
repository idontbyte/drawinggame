var ζ = extend(true, {}, ζ);

ζ.Game = {
    State: {},

    Element_GameContainer: document.getElementsByClassName("game")[0],

    StateUpdate: function () {
        
    },

    SetupListeners: function () {
        // Server sent lobby state update
        ζ.Shared.Connection.on('StateUpdate', function (state) {
            ζ.Game.State = state;
            ζ.Game.StateUpdate();
        });
    },

    ClientLoop: function () {

    },

    Init: function () {
        ζ.Game.SetupListeners();
        setInterval(ζ.Game.ClientLoop, 10);
    }
};