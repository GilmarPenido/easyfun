import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet } from 'react-native';
import { VStack } from 'native-base';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { BarCodeScanningResult, Camera, CameraType } from 'expo-camera';
import { Button } from "../../components/button";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { CardProps } from "../../components/card";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export function BarCode() {
    const navigation = useNavigation();
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    /* 
    useEffect(() => {
            const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions(); 
        
    }, []);
    */

    function handleBarCodeScanned({ type, data }: BarCodeScanningResult) {

        setScanned(true);
        
        const regex = /[\@\!\#\$\%\^\&\*\(\)\/\\\[\]\.\º\@\:\~]/g;

        if(regex.test(data)) {
            return Alert.alert("Detalhes", "QRCode inválido!");
        }

        firestore()
            .collection('guests')
            .doc(data)
            .get()
            .then((doc: FirebaseFirestoreTypes.DocumentSnapshot<CardProps>) => {


                if (doc.data() === undefined) {
                    return Alert.alert("Detalhes", "Dados incorretos!");
                }

                console.log(doc.data());

                const { status, name } = doc.data();


                if (status !== 'arrived' && status !== 'waiting') {
                    return Alert.alert("Detalhes", "Dados incorretos!");
                }

                if (status === 'arrived') {
                    return Alert.alert("Confirmação", "Convidado já confirmado!")
                }

                Alert.alert('Confirmar Pesença', `Deseja confirmar a presença de ${name}!`, [
                    {
                        text: "OK",
                        onPress: () => {

                            firestore()
                            .collection('guests')
                            .doc(data)
                            .update({
                                    status: 'arrived',
                                    confirmad_at: firestore.FieldValue.serverTimestamp(),
                                })
                                .then(() =>
                                    Alert.alert('Confirmação', 'Confirmação feita com sucesso.')
                                )
                                .catch(error => {
                                    return Alert.alert("Detalhes", "Houve um erro ao carregar dados do convidado!");
                                })

                        },
                        style: 'default'

                    },
                    {
                        text: "Cancelar",
                        'onPress': function () {
                            navigation
                        },
                        style: 'cancel',
                    }
                ],
                    {
                        cancelable: true,
                        onDismiss: () =>
                            navigation.goBack()
                    }
                );

            }
            ).catch(error => {
                console.log(error);
                Alert.alert('Confirmação', 'Houve um erro ao carregar dados do convidado!')
            })
            .finally(() => navigation.goBack());



    }

    return (
        <VStack flex={1}>
            <Camera
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
                }}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <Button title='Voltar' onPress={() => navigation.goBack()} color="error.500" h="16" />
        </VStack>
    );
}