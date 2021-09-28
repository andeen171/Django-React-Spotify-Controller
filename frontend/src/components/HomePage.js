import React, { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core'

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          RoomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }
    async componentDidMount() {
        fetch("/api/user-in-room/")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    RoomCode: data.code,
                });
            });
    }
    clearRoomCode() {
        this.setState({
            roomCode: null,
        });
    }

    renderHomePage(){
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">House Party</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>Join a Room</Button>
                        <Button color="secondary" to="/create" component={Link}>Create a Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
    render () {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={
                        () => {return this.state.RoomCode ? (<Redirect to={`/room/${this.state.RoomCode}`}/>) : this.renderHomePage()}
                    }/>
                    <Route path="/join" component={RoomJoinPage}/>
                    <Route path="/create" component={CreateRoomPage}/>
                    <Route path="/room/:RoomCode" render={(props) => {
                        return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
                    }}/>
                </Switch>
            </Router>
        )
    }
}
