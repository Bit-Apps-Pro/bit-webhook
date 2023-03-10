import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, GridItem, Icon, Table, TableContainer, Tbody, Td, Text, Tr, useClipboard, useToast,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { CopyIcon } from '@chakra-ui/icons';
import { $currentLog } from '../GlobalStates/GlobalStates';

export default function QueryParams() {
  const [currentLog] = useAtom($currentLog);
  const toast = useToast();
  const contentType = 'content-type'
  const defaultOpen = [0]


  const webHookDetails = currentLog ? JSON.parse(currentLog.webhook_details) : {};
  if (webHookDetails.query_params) {
    defaultOpen.push(1)
  }
  const onCopy = (e, copyValue) => {
    e.stopPropagation()
    const copy = navigator.clipboard.writeText(JSON.stringify(copyValue, null, 2))
    copy.then(() => {
      toast({
        title: 'Copied',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
        variant: '#000',
        containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' }
      });
    }
    )
  }
  const requestDetailsCopy = (e) => {
    e.stopPropagation()
    const requestDetails = {
      url: webHookDetails?.url,
      method: webHookDetails?.method,
      id: currentLog?.id,
      ip: webHookDetails?.ip,
      created_at: webHookDetails?.created_at,
    }
    const copy = navigator.clipboard.writeText(JSON.stringify(requestDetails, null, 2))
    copy.then(() => {
      toast({
        title: 'Copied',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
        variant: '#000',
        containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' }
      });
    }
    )
  }

  return (
    <GridItem p={4} shadow="md" borderWidth="1px" area={'param'}>
      <Accordion allowMultiple>
        <AccordionItem borderRadius={5} borderWidth={1} marginBottom={5}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="bold">Request Information</Text>
              </Box>
              <Box as="span" flex="1" textAlign="right">
                <Button className="mr-2" variant="outline" size="sm" onClick={requestDetailsCopy} border={0}><Icon as={CopyIcon} /></Button>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer whiteSpace="normal">
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td>URL</Td>
                    <Td>{webHookDetails?.url}</Td>
                  </Tr>
                  <Tr>
                    <Td>Method</Td>
                    <Td>{webHookDetails?.method}</Td>
                  </Tr>
                  <Tr>
                    <Td>ID</Td>
                    <Td>{currentLog?.id}</Td>
                  </Tr>
                  <Tr>
                    <Td>IP address</Td>
                    <Td>{webHookDetails?.ip}</Td>
                  </Tr>
                  <Tr>
                    <Td>Created Time</Td>
                    <Td>{webHookDetails?.created_at}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem borderRadius={5} borderWidth={1} marginBottom={5}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="bold">Query Params</Text>
              </Box>
              <Box as="span" flex="" textAlign="right">
                <Button className="mr-2" variant="outline" size="sm"
                  onClick={(e) => onCopy(e, webHookDetails.query_params)}
                  border={0}
                >
                  <Icon as={CopyIcon} />
                </Button>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer whiteSpace="normal">
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td>Key</Td>
                    <Td>Value</Td>
                  </Tr>
                  {webHookDetails?.query_params && Object.keys(webHookDetails?.query_params).map((key, index) => (
                    <Tr key={index}>
                      <Td>{key}</Td>
                      <Td>{webHookDetails?.query_params[key]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </GridItem>
  );
}
