var ζ = extend(true, {}, ζ);

ζ.App = {
    Init: function () {
        console.log("application init.");

        ζ.Shared.EstablishServerConnection();

        ζ.Lobby.Init();
    }
};

ζ.App.Init();