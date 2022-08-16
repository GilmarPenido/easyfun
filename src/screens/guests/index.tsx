import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, AlertButton } from 'react-native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';

import { Filter } from '../../components/filter';
import { Card, CardProps } from '../../components/card';
import { Button } from '../../components/button';

import { useNavigation } from '@react-navigation/native';

import { dateFormat } from '../../utils/firestoreDateFormat';

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { batchGuestsInFirestore } from '../../utils/batchGuestsInFirestore';
import { BarCodeScanner } from 'expo-barcode-scanner';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default function Guests() {
    const [scanning, setScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [statusSelected, setStatusSelected] = useState<'waiting' | 'arrived'>('waiting');
    const [guests, setGuests] = useState<CardProps[]>([]);
    const [guest, setGuest] = useState<CardProps>({} as CardProps);


    const { colors } = useTheme();
    const navigation = useNavigation();

    function handleBarCodeScanned({ type, data }) {

        setScanned(true);
        console.log(1, type, data)

        const regex = /[\@\!\#\$\%\^\&\*\(\)\/\\\[\]\.\º\@\:\~]/g;

        if(regex.test(data)) {
            return Alert.alert("Detalhes", "QRCode inválido!");
        }


        firestore()
            .collection('guests')
            .doc(data)
            .get()
            .then((doc: FirebaseFirestoreTypes.DocumentSnapshot<CardProps>) => {

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
                            setScanning(false)
                        },
                        style: 'cancel',
                    }
                ],
                    {
                        cancelable: true,
                        onDismiss: () =>
                            setScanning(false)
                    }
                );

            }
            ).catch(error => {
                console.log(error);
                Alert.alert('Confirmação', 'Houve um erro ao carregar dados do convidado!')
            })
            .finally(() => setScanning(false));



    }

    function handleGoBackScanner() {
        console.log('passou aqui');
        setScanning(false);
    }

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    useEffect(() => {

        const subscribe = firestore()
            .collection("guests")
            .where("status", "==", statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map((doc: any) => {
                    console.log(doc.data());

                    const { name, email, status, presence, phone } = doc.data();
                    return {
                        id: doc.id,
                        name,
                        email,
                        status,
                        presence,
                        phone
                    }
                })

                console.log(data);
                setGuests(data);
            });

        return subscribe;

    }, [statusSelected])

    function handleOpenDetails(id: string) {
        navigation.navigate('details', { id });
    }

    function handleSignOut() {
        auth()
            .signOut()
            .catch(error => {
                console.log(error);
                return Alert.alert("Sair", "Não foi possível sair.")
            });
    }

    if (scanning) {
        return (
            <VStack flex={1}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
                <Button title='Voltar' onPress={handleGoBackScanner} color="error.500" />
            </VStack>


        );
    }

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.700"
                pt={12}
                pb={5}
                px={6}
            >
                <Heading color="gray.100">EasyFun</Heading>
                <IconButton
                    onPress={handleSignOut}
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w='full' mt={8} mb={4} justifyContent="space-between" alignItems='center'>
                    <Heading color='gray.100'>
                        Convidados
                    </Heading>
                    <Text color="gray.200">
                        {guests.length}
                    </Text>
                </HStack>
                <HStack space={3} mb={8}>
                    <Filter
                        title='Aguardando'
                        type='waiting'
                        onPress={() => setStatusSelected('waiting')}
                        isActive={statusSelected === 'waiting'}
                    />
                    <Filter
                        title='Confirmado'
                        type='arrived'
                        onPress={() => setStatusSelected('arrived')}
                        isActive={statusSelected === 'arrived'}
                    />
                </HStack>
                <FlatList
                    data={guests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Card data={item} onPress={() => handleOpenDetails(item.id)} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <Center>
                            <ChatTeardropText color={colors.gray[300]} size={40} />
                            <Text
                                color="gray.300"
                                fontSize="xl"
                                mt={6}
                                textAlign="center">
                                Você ainda não possui {'\n'}
                                Convidados {statusSelected === 'waiting' ? 'aguardando' : 'confirmados'}

                            </Text>
                        </Center>
                    )}
                />
                <Button title="QRCODE" mt="2" onPress={() => setScanning(!scanning)} />
            </VStack>
        </VStack>
    );
}