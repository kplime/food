from rest_framework import serializers

from .models import ChatMessage, Comment, Post, PostMedia


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'body', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'author', 'body', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class PostMediaSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PostMedia
        fields = ['id', 'url', 'kind']
        read_only_fields = ['id', 'url', 'kind']

    def get_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if request else obj.file.url


class PostListSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)
    media = PostMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'body', 'created_at', 'comment_count', 'media']
        read_only_fields = ['id', 'author', 'created_at', 'comment_count', 'media']


class PostDetailSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    media = PostMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'body', 'created_at', 'comments', 'media']
        read_only_fields = ['id', 'author', 'created_at', 'comments', 'media']
