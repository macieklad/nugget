import { Heading, Box, BoxProps } from '@chakra-ui/react'

type CardProps = BoxProps & { title?: string }

export const Card: React.FC<CardProps> = ({ children, title, ...props }) => (
  <Box
    shadow="lg"
    borderRadius="md"
    px={10}
    py={12}
    minW={420}
    bgColor="white"
    {...props}
  >
    {title && <Heading size="lg">{title}</Heading>}
    {children}
  </Box>
)
