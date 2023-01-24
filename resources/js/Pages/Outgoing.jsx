import AlertMdl from '@/Components/AlertMdl';
import { $randomUrl, $proxied } from '@/Components/GlobalStates/GlobalStates';
import Logs from '@/Components/webhook/Logs';
import RequestBody from '@/Components/webhook/RequestBody';
import RequestHeader from '@/Components/webhook/RequestHeader';
import bitsFetch from '@/helper/bitsFetch';
import { CopyIcon, ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Button, Flex, GridItem, Icon, Input, SimpleGrid, useClipboard, useToast, InputGroup
  , InputRightElement,
  Link,
  FormControl,
  FormLabel,
  VStack,
  Switch,
  Tooltip
} from '@chakra-ui/react';
import { usePage } from '@inertiajs/inertia-react';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import QueryParams from '../Components/webhook/QueryParams';
import Master from './Layouts/Master';
import { default as fakeData } from '../static/fakeData.json'
import fetchNewUrl from '../helper/fetchNewUrl';

export default function Outgoing() {
  const [token, setToken] = useAtom($randomUrl);
  const [isProxying, setIsProxying] = useAtom($proxied);
  const toast = useToast();
  const { app } = usePage().props;
  const { onCopy, hasCopied } = useClipboard(`${app?.APP_URL}/api/v1/${token}`);
  console.log('fakeData', fakeData)
  const fakeFormData = fakeData[Math.floor(Math.random() * 100)]
  console.log('fakeFormData', fakeFormData)
  const [requestData, setRequestData] = useState({
    url: `${app?.APP_URL}/api/v1/${token}`,
    method: 'POST',
    headers: {},
    contentType: 'multipart/form-data',
    params: {},
    formData: fakeFormData,
    urlencoded: {},
    raw: '',
    bodyType: 'formData'
  })

  useEffect(() => {
    if (token === '') {
      fetchNewUrl().then(url => {
        if (url) {
          setToken(url)
          const tempData = { ...requestData }
          tempData.url = route('webhook', url);
          setRequestData(tempData)
        }
      })
    }
  }, [])

  const getRequestOptions = () => {
    let options = {}
    /* {
          headers: getRequestHeaders(),
          url: requestData.url,
          body: getRequestBody(),
          method: getRequestMethod(),
          params: getRequestParams()
        } */
    if (isProxying) {
      options = {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    } else {
      options = {
        headers: { ...getRequestHeaders(), ...getRequestContentType() },
        url: requestData.url,
        body: getRequestBody(),
        method: getRequestMethod()
      }
    }
    console.log('options', options)
    return options
  }

  const getRequestURL = () => {
    return isProxying ? route('proxy') : requestData.url
  }

  const getRequestHeaders = () => {
    return requestData?.headers || {}
  }

  const getRequestParams = () => {
    return requestData?.params || {}
  }

  const getRequestContentType = () => {
    return requestData.bodyType === 'formData' ? {} : (requestData?.contentType || {})
  }

  const getRequestMethod = () => {
    return requestData?.method || 'POST'
  }

  const getRequestBody = () => {
    if (requestData?.bodyType
      && requestData[requestData.bodyType]
    ) {
      return requestData.bodyType === 'formData' ? processFormData() : (
        typeof requestData[requestData.bodyType] === 'string' ? requestData[requestData.bodyType] : JSON.stringify(requestData[requestData.bodyType])
      )
    }
    return ''
  }

  const processFormData = () => {
    const formData = new FormData()
    Object.keys(requestData.formData).forEach(key => formData.set(key, requestData.formData[key]))
    return formData
  }
  const onChange = (event) => {
    const tempData = { ...requestData }
    if (!tempData?.formData) {
      tempData.formData = {}
    }
    tempData.formData[event.target.name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setRequestData(tempData)
  }

  const setRequestURL = (event) => {
    const tempData = { ...requestData }
    tempData.url = event.target.value;
    setRequestData(tempData)
  }
  const submit = (e) => {
    e.preventDefault();
    fetch(getRequestURL(), getRequestOptions())
      .then((res) => {
        const tempData = { ...requestData }
        tempData.formData = fakeFormData
        setRequestData(tempData)
        toast({ variant: '#000', description: 'Sended!', position: 'bottom-right', containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' } });
      })
    // post(`${app?.APP_URL}/api/v1/${token}`);
  };

  hasCopied && toast({ variant: '#000', description: 'Copied', position: 'bottom-right', containerStyle: { bg: '#000', color: 'white', borderRadius: '5px' } });
  console.log('isProxying', isProxying)
  return (
    <Master title="Test your outgoing webhook">
      <GridItem pl="2" area="main">
        <Flex w={600} mt={2} gap="2" alignItems={'baseline'}>
          <InputGroup>
            <Input value={requestData.url} onChange={setRequestURL} />
            <InputRightElement>
              <Button
                bg={'none'}
                onClick={onCopy}
              >
                <Icon as={CopyIcon} />
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button onClick={submit}>Send</Button>
          <Tooltip
            label='proxy request through webhook.is to bypass cors'
            placement='right-end'
            hasArrow
            rounded={'md'}
            shouldWrapChildren
          >
            <Switch id='proxy' onChange={() => setIsProxying(!isProxying)} isChecked={isProxying} />
          </Tooltip>
        </Flex>
        <VStack width={"100%"}>
          <form onSubmit={submit} style={{ width: '100%', 'padding': '25px' }}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name='name'
                autoComplete='off'
                value={requestData.formData?.name}
                placeholder="Name.."
                size="lg"
                onChange={onChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name='email'
                value={requestData.formData?.email}
                placeholder="test@test.com"
                size="lg"
                onChange={onChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Age</FormLabel>
              <Input
                type="text"
                placeholder="18"
                name='age'
                size="lg"
                onChange={onChange}
                value={requestData.formData?.age}
              />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name='password'
                autoComplete='off'
                value={requestData.formData?.password}
                placeholder="*******"
                size="lg"
                onChange={onChange}
              />
            </FormControl>
          </form>
        </VStack>
      </GridItem>
    </Master>
  );
}
