import json
from channels.generic.websocket import AsyncWebsocketConsumer

room_players = {}

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'game_{self.game_id}'

        if self.room_group_name not in room_players:
            room_players[self.room_group_name] = {'X': None, 'O': None}
        
        room = room_players[self.room_group_name]
        
        # Assign roles based on available seats
        if room['X'] is None:
            self.role = 'X'
            room['X'] = self.channel_name
        elif room['O'] is None:
            self.role = 'O'
            room['O'] = self.channel_name
        else:
            self.role = None # Spectator
            
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        if self.role:
            await self.send(text_data=json.dumps({
                'action': 'assign_role',
                'role': self.role
            }))

    async def disconnect(self, close_code):
        if self.room_group_name in room_players:
            room = room_players[self.room_group_name]
            if room['X'] == self.channel_name:
                room['X'] = None
            elif room['O'] == self.channel_name:
                room['O'] = None

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action in ['place_move', 'reset_game']:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_message',
                    'message': data
                }
            )

    async def game_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
