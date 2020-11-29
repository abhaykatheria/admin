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
        backgroundColor: "lightBlue",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
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
    const [price, setPrice] = useState(0)
    const [amount_paid, setAmountPaid] = useState(0)
    const [tutor_fee, setTutorFee] = useState(0)
    const [due_date, setDueDate] = useState(new Date())
    const [comments, setComments] = useState('')
    const [assigned_date, setAssignedDate] = useState(new Date())
    const [payment_pending, setPaymentPending] = useState(true)
    const [satus, setStatus] = useState("ongoing")
    const [assURL, setAssURL] = useState('')
    const [file, setFile] = useState('')
    const [tutorId, setTutorId] = useState('')
    const [dues, setDues] = useState(0)
    const [assId, setAssId] = useState('')


    const changeHandler = value => {
        setTutor(value)
    }


    useEffect(() => {
        const db = app.firestore();
        window.scrollTo(0, 0);
        return db.collection('tutors').onSnapshot((snapshot) => {
            const data = [];
            const ids = [];
            snapshot.forEach((doc) => {
                data.push({ ...doc.data() })
                ids.push(doc.id)
                // console.log(doc.id);
            }
            );
            console.log(ids);
            let data1 = []
            for (var i = 0; i < data.length; i++) {
                data1.push({ name: data[i].name, id: ids[i] });
                // console.log(data[i]);
            }
            data1 = data1.map((dat) => {
                return {
                    value: dat.id,
                    label: dat.name
                }
            })
            // console.log(data1);
            setAllTutors(data1);
        });
    }, []);

    // console.log(allTutors);

    const onChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        // console.log(file)
    }



    return (
        <div style={{ backgroundColor: "#dee4e3" }}>
            <main className={classes.main}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Assignment
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
        </div>
    )

    async function upload() {
        const storageRef = app.storage().ref('assignments')
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file).then((url) => {
        });
        const url = await fileRef.getDownloadURL().catch((error) => { throw error });
        if (url != '') {
            setAssURL(url)
            // console.log(url);
        }
    }

    async function onRegister() {
        if (tutor == '' || tutor == '' || subject == '' || price == '' || amount_paid == ''
            || tutor_fee == '' || comments == '' || due_date == '' || file == '') {
            alert("Please Fill All Required Field");
            return;
        }
        console.log(student, tutor.label, subject, price, amount_paid, tutor_fee, comments);
        console.log(allTutors);
        for (var i = 0; i < allTutors.length; i++) {
            if (allTutors[i].label == tutor.label) {
                setTutorId(allTutors[i].value)
                console.log(tutorId);
                break
            }
        }

        // console.log(name, email, country.label)
        try {
            upload();
            if (assURL != '') {
                const db = app.firestore()
                try {
                    await db.collection('assignments').add({
                        amount_paid: parseInt(amount_paid),
                        assigned_date: assigned_date,
                        comments: comments,
                        due_date: due_date,
                        payment_pending: payment_pending,
                        price: parseInt(price),
                        satus: satus,
                        student: student,
                        subject: subject,
                        tutor: tutor.label,
                        tutor_fee: parseInt(tutor_fee),
                        assURL: assURL
                    }).then((doc) => {
                        console.log(doc.id, due_date, price - amount_paid, student);
                        console.log(doc.id, due_date, "pending", tutor.label, tutor_fee, tutorId);
                        setAssId(doc.id)
                    })

                    db.collection('tutors').onSnapshot((snapshot) => {
                        snapshot.forEach((doc) => {
                            if (doc.data().name === tutor.label) {
                                var temp = doc.data()
                                temp.dues += parseInt(tutor_fee)
                                setTutorId(doc.id)
                                setDues(temp.dues)
                            }
                            // console.log(doc.id, doc.data(), tutor.value);
                        });
                    })
                } catch (error) {
                    alert(error.message)
                }
            }
        } catch (error) {
            alert(error.message)
        }
        updateDues()
        updateDuesCollection()
        updatePayment()
    }

    async function updateDues() {
        try {
            if (tutorId != '') {
                // console.log(dues);
                await app.firestore().collection('tutors').doc(tutorId).update({
                    dues: dues
                })

            }
        }
        catch (error) {
            alert(error.message)
        }
    }

    async function updateDuesCollection() {
        try {
            // console.log(dues);
            await app.firestore().collection('dues').add({
                assg_id: assId,
                due_date: due_date,
                status: "pending",
                tutor: tutor.label,
                tutor_fee: tutor_fee,
                tutorId: tutorId
            })
        }
        catch (error) {
            alert(error.message)
        }
    }

    async function updatePayment() {
        try {
            // console.log(dues);
            await app.firestore().collection('payment_collection').add({
                assg_id: assId,
                due_date: due_date,
                pending: price-amount_paid,
                status: "pending",
                student: student
            })
        }
        catch (error) {
            alert(error.message)
        }
    }


}

export default withStyles(styles)(AddAssignment)