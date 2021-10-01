import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, IconButton } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link } from 'react-router-dom';

const pages = {
    JOIN: "pages.join",
    CREATE: "pages.create",
};

// testing functional components functions
export default function Info(props) {
    const [page, setPage] = useState(pages.JOIN);
    function joinInfo() {
        return "Join a Room with your friends using their code or link,\n" +
               " but dont forget you should have a valid Spotify account";
    }
    function createInfo() {
        return "Create a room and let your friends listen to the same music as you,\n" +
               "you can set their permissions and how many votes need to skip a song";
    }
    useEffect(() => {
        console.log("rodou")
        return () => console.log("limpou");
    })
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is spotify controller?
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    { page === pages.JOIN ? joinInfo() : createInfo() }
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={() => {page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE)}}>
                    {page === pages.CREATE ? ( <NavigateBeforeIcon/>) : (<NavigateNextIcon/>)}
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    )
}
