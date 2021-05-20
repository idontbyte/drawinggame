using DrawingGame.GameCode;
using DrawingGame.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DrawingGame.Hubs
{
    public class GameHub : Hub
    {
        private readonly HubService _hubService;

        public GameHub(HubService hubService, LobbyStateSender lobbyStateSender)
        {
            _hubService = hubService;
        }

        public async Task CheckName(string name)
        {
            if (_hubService.GetHubState().Players.Contains(name))
            {
                await Clients.Caller.SendAsync("CheckName", false);
            }
            else
            {
                _hubService.AddPlayer(name);
                await Groups.AddToGroupAsync(Context.ConnectionId, "lobby");
                await Clients.Caller.SendAsync("LobbyUpdate", _hubService.GetHubState().Lobbies);
                await Clients.Caller.SendAsync("CheckName", true);
            }
        }

        public async Task CheckLobbyName(string lobbyName, string playerName)
        {
            if (_hubService.GetHubState().Lobbies.Any(l => l.Name == lobbyName) && lobbyName != "lobby")
            {
                await Clients.Caller.SendAsync("CheckLobbyName", false);
            }
            else
            {
                _hubService.AddLobby(new Lobby()
                {
                    Name = lobbyName,
                    State = new GameState() { Players = new List<Player>() { new Player(playerName) } }
                });
                var lobby = _hubService.GetHubState().Lobbies.Where(l => l.Name == lobbyName).Single();
                await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, "lobby");
                await Clients.Caller.SendAsync("CheckLobbyName", true, lobby.State);
                await Clients.Groups("lobby").SendAsync("LobbyUpdate", _hubService.GetHubState().Lobbies);
            }
        }

        public async Task JoinExistingLobby(string lobbyName, string playerName)
        {
            _hubService.GetLobby(lobbyName).State.Players.Add(new Player(playerName));
            var lobby = _hubService.GetHubState().Lobbies.Where(l => l.Name == lobbyName).Single();

            await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "lobby");
            await Clients.Caller.SendAsync("JoinExistingLobby", lobby.State);
            await Clients.Groups(lobbyName).SendAsync("StateUpdate", lobby.State);
        }


        public async Task CheckIn(string lobbyName, string playerName)
        {
            _hubService.PlayerCheckIn(lobbyName, playerName);
        }
    }
}
