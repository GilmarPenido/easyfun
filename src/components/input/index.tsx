import { Input as NativeBaseInput, IInputProps } from 'native-base';

export function Input(props: IInputProps) {
  return (
    <NativeBaseInput 
        bg="gray.700"
        h={12}
        borderWidth={0}
        fontSize="md"
        fontFamily="body"
        color="white"
        placeholderTextColor="gray.400"
        selectionColor="white"
        _focus={{
          borderWidth: 1,
          borderColor: "green.800",
          bg: "gray.700"
        }}
        {...props}
    />
  );
}