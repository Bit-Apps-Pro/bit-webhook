
import bitsFetch from '@/helper/bitsFetch'
const fetchNewUrl = async () => {
    let url = false
    await bitsFetch({}, 'create-url', 'GET')
        .then((res) => {
            if (res.success === true) {
                url = res?.uniqueId
            }
        })
    return url
}

export default fetchNewUrl