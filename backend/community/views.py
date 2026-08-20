from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatMessage, Comment, Post, PostMedia, validate_media_file
from .serializers import (
    ChatMessageSerializer,
    CommentSerializer,
    PostDetailSerializer,
    PostListSerializer,
)


def broadcast(group_name, event):
    layer = get_channel_layer()
    async_to_sync(layer.group_send)(group_name, event)


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        return PostListSerializer

    def create(self, request, *args, **kwargs):
        files = request.FILES.getlist('media')
        for f in files:
            try:
                validate_media_file(f)
            except DjangoValidationError as e:
                raise DRFValidationError({'media': e.messages})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(author=request.user)
        for f in files:
            PostMedia.objects.create(post=post, file=f)

        broadcast('posts', {'type': 'posts_changed'})

        output = self.get_serializer(post)
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostDetailSerializer


class CommentListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        comments = post.comments.all()
        return Response(CommentSerializer(comments, many=True).data)

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(post=post, author=request.user)
        broadcast(f'post_{post_id}', {'type': 'post_room_changed', 'kind': 'comment_changed'})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatMessageListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        messages = post.chat_messages.all()
        return Response(ChatMessageSerializer(messages, many=True).data)

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(post=post, author=request.user)
        broadcast(f'post_{post_id}', {'type': 'post_room_changed', 'kind': 'chat_changed'})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
