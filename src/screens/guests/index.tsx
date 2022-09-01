import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, AlertButton } from 'react-native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';

import { Filter } from '../../components/filter';
import { Card, CardProps } from '../../components/card';
import { Button } from '../../components/button';
import { Search } from '../../components/search';

import { useNavigation } from '@react-navigation/native';

import { dateFormat } from '../../utils/firestoreDateFormat';

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default function Guests() {
    
    const [statusSelected, setStatusSelected] = useState<'waiting' | 'arrived'>('waiting');
    const [guests, setGuests] = useState<CardProps[]>([]);
    const [searchName, setSearchName] = useState('');

    const { colors } = useTheme();
    const navigation = useNavigation();

    useEffect(() => {

        const subscribe = firestore()
            .collection("guests")
            .where("status", "==", statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map((doc: any) => {
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
                setGuests(ordenar(data));
            });

        return subscribe;

    }, [statusSelected]);


    function ordenar(data: CardProps[]) {

        return data.sort(
            (a,b) => {
                if ( a.name < b.name ) return -1;
                if ( a.name > b.name) return 1;
                return 0
            }
        )

    };

    function handleOpenDetails(id: string) {
        navigation.navigate('details', { id });
    }

    function handleBarCode() {
        navigation.navigate('barcode');
    }

    function handleSignOut() {
        auth()
            .signOut()
            .catch(error => {
                console.log(error);
                return Alert.alert("Sair", "Não foi possível sair.")
            });
    }

    return (
        <VStack flex={1} pb={4} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.700"
                pt={12}
                pb={4}
                px={6}
            >
                <Heading color="gray.100">EasyFun</Heading>
                <IconButton
                    onPress={handleSignOut}
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                />
            </HStack>

            <Search onChangeText={setSearchName} />

            <VStack flex={1} px={6}>
                <HStack w='full' mt={6} mb={4} justifyContent="space-between" alignItems='center'>
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
                    data={ guests.filter(g => g.name.includes(searchName)) }
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
                <Button title="QRCODE" mt="2" onPress={handleBarCode} />
            </VStack>
        </VStack>
    );
}