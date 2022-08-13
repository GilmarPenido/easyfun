import { Button as ButtonNativaBase, IButtonProps, Heading } from 'native-base';

type IButtonCustonProps = IButtonProps &{
  title: string
}

export function Button( { title, ...props }: IButtonCustonProps) {
  return (
    <ButtonNativaBase 
      bg="green.700"
      rounded="sm"
      fontSize="sm"
      h={12}
      _pressed={{
        bg: "green.600"
      }}
      { ...props }
    >
        <Heading color="white" fontSize="md">{title}</Heading>
    </ButtonNativaBase>
  );
}