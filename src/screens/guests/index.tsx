import { useState } from 'react';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';

import { Filter } from '../../components/filter';
import { Card, CardProps } from '../../components/card';
import { Button } from '../../components/button';

import { useNavigation } from '@react-navigation/native';

import { GUESTS } from '../../constants/guests'

export default function Guests() {

    const [statusSelected, setStatusSelected] = useState<'waiting'|'arrived'>('waiting');
    const [guests, setGuests] = useState<CardProps[]>( GUESTS.filter(g => g?.presence && g.presence === 'yes'));


    const { colors } = useTheme();
    const navigation = useNavigation();
    
    function handleQrcode() {
        //navigation.navigate('qrcode');

       
    }

    function handleOpenDetails(id: string) {
        navigation.navigate('details', { id });
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
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w='full' mt={8} mb={4} justifyContent="space-between" alignItems='center'>
                    <Heading color='gray.100'>
                        Solicitações
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
                    renderItem={( { item }) => <Card data={item} onPress={() => handleOpenDetails(item.id)}/>}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 100}}
                    ListEmptyComponent={() => (
                        <Center>
                            <ChatTeardropText  color={colors.gray[300]} size={40}/>
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
                <Button title="QRCODE" mt="2" onPress={handleQrcode}/>
            </VStack>
        </VStack>
        );
}