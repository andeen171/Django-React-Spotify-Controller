import React, { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <Router>
                <Switch>
                    <Route exact path={"/"}>
                        <p> Home Page Cria</p>
                    </Route>
                    <Route path={"/join"} component={RoomJoinPage}>
                    </Route>
                    <Route path={"/create"} component={CreateRoomPage}>
                    </Route>
                    <Route path={"/room/:RoomCode"} component={Room}>
                    </Route>
                </Switch>
            </Router>
        )
    }
}
