import getopt
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Album, Artist, Song, Playlist
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from .forms import PlaylistForm
@csrf_exempt
def home(request):
    artists = Artist.objects.all()
    albums = Album.objects.all()
    songs = Song.objects.all()
    return render(request, 'music/home.html', {'artists': artists, 'albums': albums, 'songs': songs})

def artist_detail(request, artist_id):
    artist = Artist.objects.get(id=artist_id)
    albums = artist.albums.all()
    return render(request, 'music/artist_detail.html', {'artist': artist, 'albums': albums})

def album_detail(request, album_id):
    album = Album.objects.get(id=album_id)
    songs = album.songs.all()
    return render(request, 'music/album_detail.html', {'album': album, 'songs': songs})

def song_detail(request, song_id):
    song = get_object_or_404(Song, id=song_id)
    return render(request, 'music/song_detail.html', {'song': song})

def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'music/signup.html', {'form': form})

@login_required
def playlist_list(request):
    playlists = Playlist.objects.filter(user=request.user)
    return render(request, 'music/playlist_list.html', {'playlists': playlists})

@login_required
def create_playlist(request):
    if request.method == 'POST':
        form = PlaylistForm(request.POST)
        if form.is_valid():
            playlist = form.save(commit=False)
            playlist.user = request.user
            playlist.save()
            return redirect('playlist_list')
    else:
        form = PlaylistForm()
        return render(request, 'music/create_playlist.html', {'form': form})

@login_required
def playlist_detail(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
    all_songs = Song.objects.all()  # Get all available songs

    if request.method == "POST":
        song_id = request.POST.get("song_id")
        song = get_object_or_404(Song, id=song_id)
        playlist.songs.add(song)
        return redirect("playlist_detail", playlist_id=playlist.id)

    return render(request, "music/playlist_detail.html", {"playlist": playlist, "all_songs": all_songs})
