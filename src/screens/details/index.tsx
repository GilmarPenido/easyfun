import { useRoute } from '@react-navigation/native';
import { VStack, Text } from 'native-base';

import { useRef } from 'react';
import { Share, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import { Header } from '../../components/header';

type RouteParams = {
    id: string;
}

export function Details() {
    const route = useRoute();
    const { id } = route.params as RouteParams;
    const viewShot = useRef(null);

    function onSave(){
        viewShot.current.capture().then(uri => {
        console.log(uri)
         //Here you can write your logic of sharing or saving it on the device, I have used Share module 
         Share.share({
           title: "QR Code",
           message: "Any message",
           url: uri,
           //subject: "Code" //  for email
         });
        });
       }

    return (


        <VStack
            flex={1}
            bg="gray.700"
        >
            <Header title="Convidado" />
            <TouchableOpacity onPress={onSave}>
                <ViewShot ref={viewShot} options={{ width: 100, height: 100, format: "jpg", quality: 1.0 }}>
                    <View style={{ padding: 10, backgroundColor: '#FFFFFF' }}>
                        <QRCode
                            value={id}
                        />
                    </View>
                </ViewShot>
            </TouchableOpacity>
        </VStack>
    );
}