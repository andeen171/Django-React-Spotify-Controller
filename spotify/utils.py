from requests import post, put, get
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_SECRET, CLIENT_ID


BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    return None


def update_or_create_user_token(session_key, access_token, token_type, expires_in, refreshed_token):
    tokens = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refreshed_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken()
        tokens.user = session_key
        tokens.access_token = access_token
        tokens.refresh_token = refreshed_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save()


def is_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_token(session_key)
        return True
    return False


def refresh_token(session_key):
    refreshed_token = get_user_tokens(session_key).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant-type': refreshed_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    update_or_create_user_token(session_key, access_token, token_type, expires_in, refreshed_token)


def execute_spotify_api_call(session_key, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_key)
    headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + tokens.access_token}
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)
    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except Exception as err:
        return {f'Error: {err}': 'Failed to GET spotify api call'}


def play_song(session_id):
    return execute_spotify_api_call(session_id, 'player/play', put_=True)


def pause_song(session_id):
    return execute_spotify_api_call(session_id, 'player/pause', put_=True)


def skip_song(session_id):
    return execute_spotify_api_call(session_id, 'player/next', post_=True)

