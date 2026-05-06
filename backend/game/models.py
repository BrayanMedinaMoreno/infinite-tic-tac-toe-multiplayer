from django.db import models
from django.conf import settings

class Game(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting for player'),
        ('playing', 'Playing'),
        ('finished', 'Finished'),
    ]
    
    player1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='games_as_p1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='games_as_p2', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='games_won', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Game {self.id} - {self.status}"

class Move(models.Model):
    game = models.ForeignKey(Game, related_name='moves', on_delete=models.CASCADE)
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    x = models.IntegerField()
    y = models.IntegerField()
    is_active = models.BooleanField(default=True) # False when the piece is removed due to >3 pieces rule
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        
    def __str__(self):
        return f"Move ({self.x}, {self.y}) by {self.player.username}"
