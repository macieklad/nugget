import { Button, ButtonProps } from '@chakra-ui/react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

type LinkProps = NextLinkProps & ButtonProps

export const LinkButton: React.FC<LinkProps> = ({
  href,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  children,
  ...rest
}) => (
  <NextLink
    href={href}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    passHref={passHref}
    prefetch={prefetch}
    locale={locale}
  >
    <Button as="a" cursor="pointer" {...rest}>
      {children}
    </Button>
  </NextLink>
)
