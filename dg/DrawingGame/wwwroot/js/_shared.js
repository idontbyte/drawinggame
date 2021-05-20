var ζ = extend(true, {}, ζ);

ζ.Shared = {
    Connection: {},

    EstablishServerConnection: function () {
        ζ.Shared.Connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();
        ζ.Shared.Connection.start().then(function () {
            document.getElementById("connecting").style.display = "none";
            document.getElementsByClassName("lobbies")[0].style.display = "block";
        }).catch(function (err) {
            return alert(err.toString());
        });
    },
    DateToTicks: function (date) {
        return (date.getTime() * 10000) + 621355968000000000;
    }
};