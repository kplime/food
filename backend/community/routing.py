from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/posts/(?P<post_id>\d+)/$', consumers.PostRoomConsumer.as_asgi()),
    re_path(r'^ws/posts/$', consumers.PostsConsumer.as_asgi()),
]
