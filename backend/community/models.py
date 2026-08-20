import os
import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
VIDEO_EXTENSIONS = {'.mp4', '.webm', '.mov', '.m4v'}
MAX_MEDIA_SIZE = 50 * 1024 * 1024  # 50MB


def validate_media_file(file):
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in IMAGE_EXTENSIONS | VIDEO_EXTENSIONS:
        raise ValidationError(f'지원하지 않는 파일 형식이에요: {ext}')
    if file.size > MAX_MEDIA_SIZE:
        raise ValidationError('파일이 너무 커요 (최대 50MB).')


def media_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    return f'posts/{instance.post_id}/{uuid.uuid4().hex}{ext}'


class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=80)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PostMedia(models.Model):
    IMAGE = 'image'
    VIDEO = 'video'
    KIND_CHOICES = [(IMAGE, 'Image'), (VIDEO, 'Video')]

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to=media_upload_path, validators=[validate_media_file])
    kind = models.CharField(max_length=5, choices=KIND_CHOICES, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def save(self, *args, **kwargs):
        ext = os.path.splitext(self.file.name)[1].lower()
        self.kind = self.VIDEO if ext in VIDEO_EXTENSIONS else self.IMAGE
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.kind}: {self.file.name}'


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    body = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.author}: {self.body[:20]}'


class ChatMessage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='chat_messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    body = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.author}: {self.body[:20]}'
