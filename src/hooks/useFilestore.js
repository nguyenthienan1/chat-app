import React, { useState } from 'react'
import { onSnapshot, collection, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebase/config';

export const useFilestore = (col, condition) => {
    const [documents, setDocuments] = useState([]);
    React.useEffect(() => {
        const collectionRef = collection(db, col);

        let orderedQuery = query(collectionRef, orderBy('createdAt'));

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                // reset documents data
                setDocuments([]);
                return;
            }

            orderedQuery = query(orderedQuery, where(
                condition.fieldName,
                condition.operator,
                condition.compareValue
            ));
        }

        const unsubcribed = onSnapshot(orderedQuery, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));


            setDocuments(docs);
        });

        return unsubcribed;
    }, [col, condition]);

    return documents;
};

export default useFilestore;
