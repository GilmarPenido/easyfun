import { HStack, Icon, useTheme, IInputProps } from 'native-base';
import { Input } from '../input';
import { MagnifyingGlass  } from "phosphor-react-native";

export function Search({ ...rest }: IInputProps) {

  const { colors } = useTheme();
  return (
    <HStack marginX="4">

      <Input 
        h="10" 
        borderRadius={10} 
        width="full" 
        backgroundColor="gray.500"
        placeholder='Search for Name'
        InputRightElement={<Icon  as={<MagnifyingGlass color={colors.gray[400]}  />} mr="4"/>}

        {...rest }
      
      _focus={{
        borderColor: "gray.400",
      }}/>

    </HStack>
  );
}