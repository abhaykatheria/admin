import React from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import app from 'firebase/app'
import 'firebase/firebase-firestore'

export default function ViewTutor() {
    const [tutors, setTutors] = useState();

    useEffect(() => {
        const db = app.firestore();
        return db.collection('tutors').onSnapshot((snapshot) => {
            const data = [];
            snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
            console.log(data);  // <------
            setTutors(data);
        });
    }, []);

    console.log(tutors)

    return (
        <div>
            <p>aa</p>
        </div>
    )
}
