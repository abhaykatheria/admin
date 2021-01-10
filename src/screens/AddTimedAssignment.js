import React, { useState } from "react";
import {
    Typography,
    Paper,
    Avatar,
    Button,
    FormControl,
    Input,
    InputLabel,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "react-select";
import firebase from "firebase";
import 'firebase/firebase-firestore'
import app from 'firebase/app'
import { useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker';
import 'firebase/firebase-storage'
import { FilePond, } from 'react-filepond'
import TimezoneSelect from 'react-timezone-select'
import * as emailjs from 'emailjs-com'
import DurationPicker from 'react-duration-picker'
import DatePicker from 'react-date-picker';



const styles = (theme) => ({
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    paper: {
        backgroundColor: "lightBlue",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 3
            }px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

function AddTimedAssignment(props) {
    const { classes } = props;

    const [tutor, setTutor] = useState('')
    const [allTutors, setAllTutors] = useState([])
    const [student, setstudent] = useState('')
    const [allStudents, setAllStudents] = useState([])
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
    const [studentCollections, setStudentCollections] = useState('')
    const [files, setFiles] = useState([])
    const [fileAr, setFileAr] = useState([])
    const [selectedTimezone, setSelectedTimezone] = useState({})
    const [tutorEmail, setTutorEmail] = useState('')
    const [downloadLinks, setDownloadLinks] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const [duration, setDuration] = useState()
    const [studentTimezone, setStudentTimezone] = useState('')


    const map = {
        'Pacific/ Honolulu': -10,
        'America/Juneau': -9,
        'America/Tijuana': -8,
        'America/Boise': -7,
        'America/Chihuahua': -7,
        'America/Phoenix': -7,
        'America/Chicago': -6,
        'America/Regina': -6,
        'America/Mexico_City': -6,
        'America/Belize': -6,
        'America/Detroit': -5,
        'America/Bogota': -5,
        'America/Caracas': -4,
        'America/St_Johns': -3.50,
        'America/Sao_Paulo': -3,
        'America/Argentina/Buenos_Aires': -3,
        'America/Godthab': -3,
        'Atlantic/Azores': -1,
        'Atlantic/Cape_Verde': -1,
        GMT: 0,
        'Africa/Casablanca': 0,
        'Atlantic/Canary': 0,
        'Europe/Belgrade': 1,
        'Europe/Sarajevo': 1,
        'Europe/Brussels': 1,
        'Europe/Amsterdam': 1,
        'Africa/Algiers': 1,
        'Europe/Bucharest': 2,
        'Africa/Cairo': 2,
        'Europe/Helsinki': 2,
        'Europe/Athens': 2,
        'Asia/Jerusalem': 2,
        'Africa/Harare': 2,
        'Europe/Moscow': 3,
        'Asia/Kuwait': 3,
        'Africa/Nairobi': 3,
        'Asia/Baghdad': 3,
        'Asia/Tehran': 3.5,
        'Asia/Dubai': 4,
        'Asia/Baku': 4.5,
        'Asia/Kabul': 4.5,
        'Asia/Yekaterinburg': 5,
        'Asia/Karachi': 5,
        'Asia/Kolkata': 5.5,
        'Asia/Kathmandu': 5.75,
        'Asia/Dhaka': 6,
        'Asia/Colombo': 5.5,
        'Asia/Almaty': 6,
        'Asia/Rangoon': 6.5,
        'Asia/Bangkok': 7,
        'Asia/Krasnoyarsk': 7,
        'Asia/Shanghai': 8,
        'Asia/Kuala_Lumpur': 8,
        'Asia/Taipei': 8,
        'Australia/Perth': 8,
        'Asia/Irkutsk': 8,
        'Asia/Seoul': 9,
        'Asia/Tokyo': 9,
        'Asia/Yakutsk': 10,
        'Australia/Darwin': 9.5,
        'Australia/Adelaide': 10.5,
        'Australia/Sydney': 11,
        'Australia/Brisbane': 10,
        'Australia/Hobart': 11,
        'Asia/Vladivostok': 10,
        'Pacific/Guam': 10,
        'Asia/Magadan': 11,
        'Pacific/Fiji': 13,
        'Pacific/Auckland': 13,
        'Pacific/Tongatapu': 14,
    }

    const changeTutorHandler = value => {
        setTutor(value)
        console.log({ value }, value.dues)
        setTutorId(value.id)
        setTutorEmail(value.email)
    }

    const changeStudentHandler = value => {
        setstudent(value)
        console.log({ value });
        setStudentTimezone(value.time_zone)
    }


    useEffect(() => {
        const db = app.firestore();
        window.scrollTo(0, 0);
        db.collection('tutors').onSnapshot((snapshot) => {
            const data = [];
            const ids = [];
            snapshot.forEach((doc) => {
                data.push({ ...doc.data() })
                ids.push(doc.id)
                // console.log(doc.id);
            }
            );
            // console.log(ids);
            let data1 = []
            for (var i = 0; i < data.length; i++) {
                data1.push({ ...data[i], id: ids[i] });
                // console.log(data[i],data1[i].dues)
                // console.log(data[i]);
            }
            data1 = data1.map((dat) => {
                return {
                    value: dat.id,
                    label: dat.name,
                    email: dat.email,
                    dues: dat.dues,
                    id: dat.id
                }
            })
            setAllTutors(data1);
            // console.log(allTutors);
        });

        db.collection('students').onSnapshot((snapshot) => {
            const data = [];
            const ids = [];
            snapshot.forEach((doc) => {
                data.push({ ...doc.data() })
                ids.push(doc.id)
                // console.log(doc.id);
            }
            );
            // console.log(ids);
            let data1 = []
            for (var i = 0; i < data.length; i++) {
                data1.push({ name: data[i].name, id: ids[i], collections: data[i].collections, time_zone: data[i].time_zone  });
                // console.log(data[i]);
            }
            data1 = data1.map((dat) => {
                return {
                    value: dat.id,
                    label: dat.name,
                    collections: dat.collections,
                    id: dat.id,
                    time_zone: dat.time_zone
                }
            })
            // console.log(data1);
            setAllStudents(data1);
        });
    }, []);




    return (
        <div style={{ backgroundColor: "#dee4e3" }}>
            <main className={classes.main}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Timed Assignment
       			</Typography>
                    <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                        <FormControl margin="normal" fullWidth>
                            <p>Student</p>
                            <Select
                                options={allStudents}
                                value={student}
                                onChange={changeStudentHandler}
                            />
                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <p>Tutor</p>
                            <Select
                                options={allTutors}
                                value={tutor}
                                onChange={changeTutorHandler}
                            />
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="name">Subject</InputLabel>
                            <Input id="name" name="name" autoComplete="off" autoFocus value={subject} onChange={e => setSubject(e.target.value)} />
                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="name">Price</InputLabel>
                            <Input id="name" name="name" autoComplete="off" autoFocus value={price} onChange={e => setPrice(e.target.value)} />
                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="name">Amount Paid</InputLabel>
                            <Input id="name" name="name" autoComplete="off" autoFocus value={amount_paid} onChange={e => setAmountPaid(e.target.value)} />
                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="name">Tutor Fee</InputLabel>
                            <Input id="name" name="name" autoComplete="off" autoFocus value={tutor_fee} onChange={e => setTutorFee(e.target.value)} />
                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="name">Comments</InputLabel>
                            <Input id="name" name="name" autoComplete="off" autoFocus value={comments} onChange={e => setComments(e.target.value)} />
                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <p>Start Date</p>
                            <DateTimePicker
                                onChange={setStartDate}
                                value={startDate}
                            />
                        </FormControl>
                        <FormControl>
                            <DurationPicker
                                onChange={(duration) => {

                                    // console.log(hours,minutes,seconds)

                                    setDuration(duration)
                                }
                                }
                                initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
                                maxHours={24}
                            />
                        </FormControl>
                        <FilePond
                            files={files}
                            allowMultiple={true}
                            maxFiles={15}
                            onupdatefiles={setFiles}
                        />
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                let x = student.label + tutor.label + assigned_date.toISOString()
                                let s = getDownloadLinks(x)
                            }}
                            // component={Link}
                            // to="/register"
                            className={classes.submit}>
                            Send email
          			</Button>
                    </form>
                </Paper>
            </main>
        </div>
    )

    async function upload(tempar, x) {
        console.log(tempar);
        let location = "files/" + x
        firebase.storage().ref(location).constructor.prototype.putFiles = function (tempar) {
            var ref = this;
            return Promise.all(tempar.map(function (file) {
                return ref.child(file.name).put(file)
            }));
        }

        // use it!
        let s = 'files/' + x.toString()
        console.log('huehue ' + s);
        firebase.storage().ref(s).putFiles(tempar).then((snapshot) => {
            // console.log(snapshot);
        });
    }

    async function onRegister() {



        const tempar = []
        for (let i = 0; i < files.length; i++) {
            tempar.push(files[i].file)
        }

        setFileAr(tempar)
        console.log(tempar);






        if (tutor == '' || student == '' || duration == '' || startDate == '') {
            alert("Please Fill All Required Field");
            return;
        }


        console.log(startDate)

        let offset = 5.5 - map[studentTimezone]
        offset *= 60
        let dt = startDate
        dt.setMinutes(dt.getMinutes() + offset)
        setStartDate(dt)

        console.log(startDate)

        setDueDate(dt)

        let x = student.label + tutor.label + assigned_date.toISOString()
        setAssId(x)

        upload(tempar, x);

        console.log(startDate)

        // console.log(student, tutor.label, subject, price, amount_paid, tutor_fee, comments);
        console.log(allTutors);
        for (var i = 0; i < allTutors.length; i++) {
            if (allTutors[i].label == tutor.label) {
                setTutorId(allTutors[i].value)
                console.log(tutorId);
                break
            }
        }

        // // console.log(name, email, country.label)
        try {


            const db = app.firestore()
            try {
                await db.collection('timed').add({
                    amount_paid: parseInt(amount_paid),
                    assigned_date: assigned_date,
                    comments: comments,
                    due_date: startDate,
                    start_date: startDate,
                    duration: duration,
                    payment_pending: payment_pending,
                    price: parseInt(price),
                    satus: satus,
                    student: student.label,
                    subject: subject,
                    tutor: tutor.label,
                    tutor_fee: parseInt(tutor_fee),
                    ass_id: x,
                    tutor_email: tutorEmail
                }).then((doc) => {
                    console.log(doc.id, due_date, price - amount_paid, student);
                    console.log(doc.id, due_date, "pending", tutor.label, tutor_fee, tutorId);
                    if (doc.id != '')
                        alert('Assignment added successfully')
                    setAssId(doc.id)
                })

            } catch (error) {
                alert(error.message)
            }
            if (checkValid(tutor_fee)) {
                console.log('huehuehue')
                updateDues()
                updateDuesCollection(x)
            }
            if (checkValid(amount_paid) && checkValid(price)) {
                updatePayment(x)
                updateStudentCollection()
            }
            // if (tempar != '')
            //     getDownloadLinks(x)
        } catch (error) {
            alert(error.message);
        }
        // if (due_date != '' && tutor_fee != '' && tempar != '')
        //     sendEmail()
        // // updateTutorDues()
    }
    // updateDues();
    // updateDuesCollection();
    // updatePayment();

    async function getDownloadLinks(x) {
        let location =
            "/files/" + x.toString();
        var temp = [];
        var storageRef = app.storage().ref(location);
        // console.log(storageRef)
        await storageRef
            .listAll()
            .then(function (result) {
                result.items.forEach(function (imageRef) {
                    // console.log(imageRef)
                    imageRef
                        .getDownloadURL()
                        .then(function (url) {
                            temp.push(url.toString());
                            console.log(temp)
                            // console.log(ar)
                        })
                        .catch(function (error) {
                            // Handle any errors
                        });
                });
            })
            .catch(function (error) {
                // Handle any errors
            });
        if (temp != [])
            setDownloadLinks(temp)
        let s = ""
        for (let [key, value] of Object.entries(downloadLinks)) {
            let url = value;
            console.log(url);
            s += url
            s += "\n"
        }

        if (s != "") {
            console.log(s)
            sendEmail()
        }

        return s
    }

    function checkValid(x) {
        if (isNaN(parseInt(x)) || parseInt(x) == 0)
            return false
        return true
    }


    function sendEmail() {

        let s = ""
        for (let [key, value] of Object.entries(downloadLinks)) {
            let url = value;
            console.log(url);
            s += url
            s += "                             "
        }

        console.log(s)


        console.log(tutor.email)
        let message = "You have been assigned a new lesson as a Tutor. Here are the additional details-" + "\n"
            + "Due Status:       " + due_date + "\n"
            + "Student Name:     " + student.label + "\n"
            + "Type:             " + "General" + "\n"
            + "Subject:          " + subject + "\n"
            + "Comments:         " + comments + "\n"
            + "The download links are:- " + "\n\n\n"
            + s

        console.log(message)

        let templateParams = {
            to_name: tutor.email,
            from_name: 'chitransh.326@gmail.com',
            subject: "New Assignment Assigned",
            message: message,
        }

        if (s != '') {
            emailjs.send(
                'service_5x2bgwj',
                'template_mdudrfo',
                templateParams,
                'user_2Mb02sYPwYBJT9hScfbBR'
            )
            alert('Email sent successfully')
        }
    }



    async function updateDues() {
        console.log(tutor.dues)
        try {
            if (tutorId != "") {
                console.log(tutor);
                let dues = tutor.dues + parseInt(tutor_fee)
                await app.firestore().collection("tutors").doc(tutor.id).update({
                    dues: dues,
                });
            }
        } catch (error) {
            alert(error.message);
        }
    }

    function updateDuesCollection(x) {
        try {
            console.log(dues);
            app.firestore().collection("dues").add({
                assg_id: x,
                due_date: startDate,
                status: "pending",
                tutor: tutor.label,
                tutor_fee: parseInt(tutor_fee),
                tutorId: tutorId,
                student: student.label,
                assigned_date: assigned_date,
                subject: subject
            }).then((doc) => {
                console.log(doc.id)
            })
        } catch (error) {
            alert(error.message);
        }
    }


    function updatePayment(x) {
        try {
            console.log(student);
            app.firestore().collection('payment_collection').add({
                assg_id: x,
                due_date: startDate,
                pending: price - amount_paid,
                status: "pending",
                student: student.label,
                studentId: student.id
            }).then((doc) => {
                console.log(doc.id)
            })
        }
        catch (error) {
            alert(error.message)
        }
    }

    async function updateStudentCollection() {
        try {
            // console.log(dues);
            await app.firestore().collection('students').doc(student.value).update({
                collections: parseInt(student.collections) + parseInt(price - amount_paid)
            })
        }
        catch (error) {
            alert(error.message)
        }
    }

}

export default withStyles(styles)(AddTimedAssignment);
