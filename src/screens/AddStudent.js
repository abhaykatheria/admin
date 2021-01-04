import React, { useState } from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import 'firebase/firebase-firestore'
import app from 'firebase/app'
import TimezoneSelect from 'react-timezone-select'


const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
})

function AddStudent(props) {
    const { classes } = props

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [time_zone, setTime_Zone] = useState('')
    const [selectedTimezone, setSelectedTimezone] = useState({})

    

    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Add Student
       			</Typography>
                <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus value={name} onChange={e => setName(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input id="email" name="email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
                    </FormControl>
                        <p>Time zone</p>
                        <div className='select-wrapper'>
                            <TimezoneSelect
                                value={selectedTimezone}
                                onChange={setSelectedTimezone}
                            />
                        </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={onRegister}
                        // component={Link}
                        // to="/register"
                        className={classes.submit}>
                        Register
          			</Button>
                </form>
            </Paper>
        </main>
    )


    async function onRegister() {
        
        if(name=='' || email=='' || selectedTimezone==''){
            return
        }
        console.log(name, email,time_zone)
        try {
            const db = app.firestore()
            db.collection("students").add({
                name: name,
                email: email,
                time_zone: selectedTimezone.value,
                collections: 0
            })
        } catch (error) {
            alert(error.message)
        }
    }
}

export default withStyles(styles)(AddStudent)