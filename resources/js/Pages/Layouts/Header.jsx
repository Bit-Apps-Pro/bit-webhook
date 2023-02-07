import { Flex, Heading, Button, Stack, IconButton, Link as ExternalLink } from '@chakra-ui/react';
import { Link } from '@inertiajs/inertia-react';
import GitHubIcon from '../../static/icons/GitHubIcon';

export default function Header() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={2}
      bg="white.100"
      color="black"
      boxShadow='base'
    // rounded='md'
    // {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"tighter"}>
          <Link href={route('home')}>
            Webhook
          </Link>
        </Heading>
      </Flex>

      <Stack
        direction={{ base: "column", md: "row" }}
        // display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        justifyContent={'flex-end'}
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
        <Button variant='ghost'>
          <Link href={route('outgoing.view')}>Outgoing</Link>
        </Button>
        <ExternalLink href='https://github.com/Bit-Apps-Pro/bit-webhook' isExternal>
          <IconButton icon={<GitHubIcon />} variant={'ghost'} color={'gray.400'} _hover={{ color: 'gray.800' }} />
        </ExternalLink>
      </Stack>
    </Flex>
  )
}