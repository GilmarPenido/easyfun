import { useState } from "react";
import { VStack, Heading, Icon, useTheme } from "native-base";
import { Envelope, Key } from 'phosphor-react-native';
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import auth from '@react-native-firebase/auth';
import { Alert } from "react-native";
    
export default function SignIn() {

    const [isLoading, setIsLoading] = useState(false);
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    function handleSignin() {
        if (!email || !password) {
            return Alert.alert("SignIn", "E-mail e senha requeridos!")
        }

        auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
            console.log(response)
        })
        .catch( (error) => {
            console.log(error);
            setIsLoading(false);

            if(error.code === 'auth/invalid-email'){
                return Alert.alert('Entrar', 'E-mail inválido!');
            }

            if(error.code === 'auth/wrong-password'){
                return Alert.alert('Entrar', 'E-mail ou senha inválida!');
            }

            if(error.code === 'auth/user-not-found'){
                return Alert.alert('Entrar', 'E-mail ou senha inválida!');
            }

            return Alert.alert('Entrar', 'Não foi possível acessar!');

        });
    };

    return (
        <VStack flex={1} alignItems="center" bg="gray.800" px={8} pt={24}>
            <Heading color="gray.100" fontSize="20" mb="6">EasyFun</Heading>
            <Heading color="gray.100" fontSize="xl" mt="20" mb="6">Entry your account</Heading>
            <Input
                onChangeText={setEmail}
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[400]} />} ml={4} />}
            />
            <Input
                onChangeText={setPassword}
                placeholder="Password"
                mb={10}
                secureTextEntry
                InputLeftElement={<Icon as={<Key color={colors.gray[400]} />} ml={4} />}
            />
            <Button
                title="Sign in"
                w="full"
                onPress={handleSignin}
                isLoading={isLoading}
            />
        </VStack>
    )

}