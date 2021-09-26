import React, { Component } from 'react';

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votes_to_skip: 2,
            guest_can_pause: false,
            is_host: false,
        };
        this.RoomCode = this.props.match.params.RoomCode;
        this.getRoomDetails();
    }
    getRoomDetails() {
        fetch('/api/get-room?code=' + this.RoomCode).then((response) =>
            response.json()
        ).then((data) => {
            this.setState({
                votes_to_skip: data.votes_to_skip,
                guest_can_pause: data.guest_can_pause,
                is_host: data.is_host
            });
        });
    }
    render() {
        return <div>
            <h3>{this.RoomCode}</h3>
            <p>Votes: {this.state.votes_to_skip}</p>
            <p>Guest can pause: {this.state.guest_can_pause.toString()}</p>
            <p>Host: {this.state.is_host.toString()}</p>
        </div>
    }
}