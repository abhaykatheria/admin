import React, { useState } from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import firebase from "firebase";
import 'firebase/firebase-firestore'
import app from 'firebase/app'
import { useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker';
import 'firebase/firebase-storage'

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

function AddAssignment(props) {
    const { classes } = props


    const [student, setstudent] = useState('')
    const [tutor, setTutor] = useState('')
    const [allTutors, setAllTutors] = useState([])
    const [subject, setSubject] = useState('')
    const [price, setPrice] = useState('')
    const [amount_paid, setAmountPaid] = useState()
    const [tutor_fee, setTutorFee] = useState('')
    const [due_date, setDueDate] = useState(new Date())
    const [comments, setComments] = useState('')
    const [assigned_date, setAssignedDate] = useState(new Date())
    const [payment_pending, setPaymentPending] = useState(true)
    const [satus, setStatus] = useState("ongoing")
    const [assURL, setAssURL] = useState('')
    const [file, setFile] = useState('')

    const changeHandler = value => {
        setTutor(value)
    }


    useEffect(() => {
        const db = app.firestore();
        return db.collection('tutors').onSnapshot((snapshot) => {
            const data = [];
            snapshot.forEach((doc) => data.push({ ...doc.data() }));
            let data1 = []
            for (var i = 0; i < data.length; i++) {
                data1.push(data[i].name);
                // console.log(data[i]).name);
            }
            data1 = data1.map((dat) => {
                return {
                    value: dat,
                    label: dat
                }
            })
            setAllTutors(data1);
        });
    }, []);

    // console.log(allTutors);

    const onChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        console.log(file)
    }



    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Add Tutor
       			</Typography>
                <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Student's name</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus value={student} onChange={e => setstudent(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <p>Tutor</p>
                        <Select
                            options={allTutors}
                            value={tutor}
                            onChange={changeHandler}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Subject</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus value={subject} onChange={e => setSubject(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Price</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus value={price} onChange={e => setPrice(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Amount Paid</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus value={amount_paid} onChange={e => setAmountPaid(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Tutor Fee</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus value={tutor_fee} onChange={e => setTutorFee(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Comments</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus value={comments} onChange={e => setComments(e.target.value)} />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <p>Due Date</p>
                        <DateTimePicker
                            onChange={setDueDate}
                            value={due_date}
                        />
                    </FormControl>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload File
                        <input type="file" hidden onChange={onChange} />
                    </Button>
                    {file && <p>{file.name}</p>}
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

    async function upload() {
        const storageRef = app.storage().ref('assignments')
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file).then((url) => {
        });
        const url = await fileRef.getDownloadURL().catch((error) => { throw error });
        if(url!=''){
            setAssURL(url)
            console.log(url);
        }
    }

    async function onRegister() {
        if (tutor == '' || tutor == '' || subject == '' || price == '' || amount_paid == ''
            || tutor_fee == '' || comments == '' || due_date == '' || file == '') {
            alert("Please Fill All Required Field");
            return;
        }
        console.log(student, tutor.value, subject, price, amount_paid, tutor_fee, comments);
        // console.log(name, email, country.label)
        try {
            upload();
            if(assURL!=''){
                const db = app.firestore()
                try{
                await db.collection('assignments').add({
                    amount_paid: amount_paid,
                    assigned_date: assigned_date,
                    comments: comments,
                    due_date: due_date,
                    payment_pending: payment_pending,
                    price: price,
                    satus: satus,
                    student: student,
                    subject: subject,
                    tutor: tutor.value,
                    tutor_fee: tutor_fee,
                    assURL: assURL
                })
            } catch(error){
                alert(error.message)
            }
            }
        } catch (error) {
            alert(error.message)
        }
    }
}

export default withStyles(styles)(AddAssignment)