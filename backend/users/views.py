from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class RecordGameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        result = request.data.get('result')
        user = request.user
        
        if result == 'win':
            user.wins += 1
        elif result == 'loss':
            user.losses += 1
        else:
            return Response({"error": "Invalid result"}, status=status.HTTP_400_BAD_REQUEST)
            
        user.save()
        return Response({"message": "Game recorded successfully", "wins": user.wins, "losses": user.losses})

class LeaderboardView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get_queryset(self):
        # Return top 10 users ordered by wins descending, then losses ascending
        return User.objects.all().order_by('-wins', 'losses')[:10]
