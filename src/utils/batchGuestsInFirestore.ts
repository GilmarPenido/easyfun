import firestore from "@react-native-firebase/firestore";
import { GUESTS } from "../constants/guests";

export function batchGuestsInFirestore(){
    GUESTS.map(g => {
        firestore()
        .collection("guests")
        .add({
            name: g.name,
            email: g.email ?? '',
            status: 'waiting',
            presence: 'yes', 
            phone: g.phone ?? ''

        }).catch(console.log)

    })    
}