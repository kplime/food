import json

from channels.generic.websocket import AsyncWebsocketConsumer


class PostsConsumer(AsyncWebsocketConsumer):
    """Broadcasts when a post is created — the board page listens on this."""

    group_name = 'posts'

    async def connect(self):
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def posts_changed(self, event):
        await self.send(text_data=json.dumps({'type': 'posts_changed'}))


class PostRoomConsumer(AsyncWebsocketConsumer):
    """Broadcasts new comments for one post — the post detail page listens on this."""

    async def connect(self):
        self.post_id = self.scope['url_route']['kwargs']['post_id']
        self.group_name = f'post_{self.post_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def post_room_changed(self, event):
        await self.send(text_data=json.dumps({'type': event['kind']}))
