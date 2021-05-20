using DrawingGame.Hubs;
using DrawingGame.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace DrawingGame.GameCode
{
    public class LobbyStateSender
    {
        private HubService _hubService;
        private IHubContext<GameHub> _gameHubContext;
        Timer _tm;

        public LobbyStateSender(HubService hubService, IHubContext<GameHub> gameHubContext)
        {
            _gameHubContext = gameHubContext;
            _hubService = hubService;
            _tm = new Timer(
                UpdateLobbies,
                null,
                1000,
                1000);
        }

        protected void UpdateLobbies(object state)
        {
            SendStates(_hubService.GetLobbies());
            _hubService.RemoveDeadLobbies();
            _gameHubContext.Clients.Groups("lobby").SendAsync("LobbyUpdate", _hubService.GetHubState().Lobbies);
        }
        internal void SendStates(List<Lobby> lobbies)
        {
            foreach (var lobby in lobbies)
            {
                // remove old lobbies
                if (lobby.LastUpdate < DateTime.Now.Subtract(TimeSpan.FromSeconds(60)))
                {
                    lobby.RemoveMe = true;
                }

                // remove old players
                foreach (var player in lobby.State.Players)
                {
                    if (player.LastUpdate < DateTime.Now.Subtract(TimeSpan.FromSeconds(10)))
                    {
                        player.RemoveMe = true;
                    }
                }
                
                _gameHubContext.Clients.Groups(lobby.Name).SendAsync("StateUpdate", lobby.State);
            }
        }
    }
}
