import { useEffect, useRef, useState } from 'react';
import { Share, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { VStack, Text , Image, ScrollView, Heading} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from "react-native-view-shot";
import { Header } from '../../components/header';
import invite01 from '../../assets/invite_01.png';
import invite02 from '../../assets/invite_02.png';

type RouteParams = {
    id: string;
}

export function Details() {
    const route = useRoute();
    const { id } = route.params as RouteParams;
    const viewShot = useRef(null);
    const [name, setName] = useState('');
    const [screen, setSchreen] = useState<string>(undefined)

    function onSave(){
        viewShot.current.capture(viewShot).then(uri => {

        console.log(uri)
        //setSchreen(uri);
         //Here you can write your logic of sharing or saving it on the device, I have used Share module 
         Share.share({
           title: "QR Code",
           message: "Any message",
           url: uri
         });
        });
       }

    useEffect(() => {
        firestore()
        .collection('guests')
        .doc(id)
        .get()
        .then((doc) => {
            const {
                name, 
                status
            } = doc.data();
            setName(name);

        })
    }, []);


    if(screen) {
        return(
        <VStack
            flex={1}
            bg="gray.700"
        >
            <Image src={screen}     alt="teste"/>
        </VStack>
        )
    }

    return (

        <ScrollView>
        <VStack
            flex={1}
            bg="gray.700"
        >
            <Header title="Convidado" />
            <TouchableOpacity onPress={onSave}>

                <ViewShot ref={viewShot} options={{ format: "jpg", quality: 1.0 }}>
                    <View >
                        <Image source={invite01} w='full' h='xs' alt="Invite01"/>
                        <VStack alignItems='center' bg="white" pb="4" pt="4">
                            <QRCode
                                value={id}
                                size={140}
                            />
                            <Heading color="gray.700" fontSize={16} fontWeight='light' pt="2">{name}</Heading>
                        </VStack>
                        <Image source={invite02} w='full' style={{height: 120}} alt="Invite02" zIndex={2} top={-20}/>
                    </View>
                </ViewShot>

            </TouchableOpacity>
        </VStack>
        </ScrollView>
    );
}