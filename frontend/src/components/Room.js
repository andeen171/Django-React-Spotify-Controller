import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";


export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votes_to_skip: 2,
            guest_can_pause: false,
            is_host: false,
            show_setting: false,
            spotify_authenticated: false,
            song: {},
        };
        this.RoomCode = this.props.match.params.RoomCode;
        this.getRoomDetails();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSetting = this.updateShowSetting.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    getRoomDetails() {
        fetch('/api/get-room?code=' + this.RoomCode).then((response) => {
            if (!response.ok) {
                this.props.leaveRoomCallback();
                this.props.history.push("/");
            }else {
                return response.json()
            }
        }).then((data) => {
                this.setState({
                    votes_to_skip: data.votes_to_skip,
                    guest_can_pause: data.guest_can_pause,
                    is_host: data.is_host
                });
                if (this.state.is_host) {
                    this.authenticateSpotify();
                }
            });
    }
    authenticateSpotify() {
        fetch('/spotify/is-authenticated').then((_response) => _response.json()).then((data) => {
            this.setState({ spotifyAuthenticated: data.status });
            if (!data.status) {
                fetch('/spotify/get-auth-url')
                    .then((response) => response.json())
                    .then((_data) => {
                        window.location.replace(_data.url);
                    })
            }
        });
    }
    getCurrentSong() {
        fetch('/spotify/current-song')
            .then((response) => {
                if (!response.ok) {
                    return {};
                } else {
                    return response.json();
                }
            }).then((data) => {
                this.setState({song: data});
                console.log(data)
            })
    }
    leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        };
        fetch('/api/leave-room/', requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push("/");
        });
    }
    updateShowSetting(value) {
        this.setState({
            show_setting: value,
        });
    }
    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSetting(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }
    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={this.state.votes_to_skip}
                        guestCanPause={this.state.guest_can_pause}
                        roomCode={this.RoomCode}
                        updateCallback={this.getRoomDetails}
                      />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => this.updateShowSetting(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        )
    }

    render() {
        if (this.state.show_setting) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.RoomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song}/>
                {this.state.is_host ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
            )
    }
}