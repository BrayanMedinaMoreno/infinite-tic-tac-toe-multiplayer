from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

