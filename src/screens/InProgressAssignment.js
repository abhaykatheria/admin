import React from 'react'
import { useEffect } from "react";
import { useState } from "react";
import app from "firebase/app";
import "firebase/firebase-firestore";

function InProgressAssignment() {

    const [assignments, setAssignments] = useState('')

    useEffect(() => {
        const db = app.firestore();
        return db.collection("assignments").onSnapshot((snapshot) => {
            const data = [];
            snapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
            console.log(data);
            const data1 = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].satus === 'ongoing')
                    data1.push(data[i]);
            }
            
            setAssignments(data1);
            // setTutors(data);
        });
    }, []);

    if(assignments)
        console.log(assignments);

    return (
        <div>
           {assignments && <p>{assignments.length}</p>}
        </div>
    )
}

export default InProgressAssignment
