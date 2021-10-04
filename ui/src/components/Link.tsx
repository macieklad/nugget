import {
  Link as StyledLink,
  LinkProps as StyledLinkProps,
} from '@chakra-ui/react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

type LinkProps = NextLinkProps & StyledLinkProps

export const Link: React.FC<LinkProps> = ({
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
    <StyledLink {...rest}>{children}</StyledLink>
  </NextLink>
)
