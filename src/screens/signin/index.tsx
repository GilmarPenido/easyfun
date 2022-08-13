import { useState } from "react";
import { VStack, Heading, Icon, useTheme } from "native-base";
import { Envelope, Key } from 'phosphor-react-native';
import { Input } from "../../components/input";
import { Button } from "../../components/button";
//import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
//import { FirebaseApp, FirebaseError } from 'firebase/app';
//import app from '../../firebase';

export default function Signin() {

    const { colors } = useTheme();
    //const auth = getAuth(app);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    function handleSignin() {
        //setError('');
        /*
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                userCredential.user.getIdToken().then(idToken => {
                    //window.sessionStorage.setItem('idToken',idToken );
                    //navigate('/check-in-pendentes');
                })

            })
            .catch((error: FirebaseError) => {

                //console.log(error.message);
                //setError("Usuário ou senha inválidos");
            })
        */
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
            />
        </VStack>
    )

}