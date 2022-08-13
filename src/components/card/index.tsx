import { HStack, Text, Box, useTheme, VStack, Circle, Pressable, IPressableProps} from 'native-base';
import { Envelope, Hourglass, CircleWavyCheck } from "phosphor-react-native";

export type CardProps = {
    id: string;
    name: string;
    email?: string|undefined;
    status: 'waiting' | 'arrived';
    presence?: 'yes'|'no' | undefined; 
    children?: string | undefined; 
    phone?: string | undefined;
}

type Props = IPressableProps & {
    data: CardProps;

}

export function Card({ data, ...rest }: Props) {

    
    const { colors} = useTheme();

    const statusColor = data.status === 'waiting' ? colors.orange[500] : colors.green[300];

    return (
        <Pressable {...rest}>
        <HStack
            bg="gray.600"
            mb={4}
            alignItems="center"
            justifyContent="space-between"
            rounded="sm"
            overflow="hidden"
        >
            <Box h="full" w={2} bg={statusColor} />
            <VStack flex={1} my={5} ml={5}>
                <Text color="white" fontSize="md">
                    {data.name}
                </Text>
                <HStack alignItems="center">
                    <Envelope size={15} color={colors.gray[300]} />
                    <Text color="gray.300" fontSize="xs" ml={1}>
                        {data.email}
                    </Text>
                </HStack>
            </VStack>
            <Circle bg="gray.500" h={12} w={12} mr={5}>
                {
                    data.status === 'arrived'
                        ? <CircleWavyCheck size={24} color={statusColor} />
                        : <Hourglass size={24} color={statusColor} />
                }
            </Circle>
        </HStack>
        </Pressable>
    );
}