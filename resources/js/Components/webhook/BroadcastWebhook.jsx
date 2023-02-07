import { useAtom } from 'jotai';
import Echo from 'laravel-echo';
import { useEffect } from 'react';
import socketio from "socket.io-client";
import { $logs, $randomUrl } from '../GlobalStates/GlobalStates';
export default function BroadcastWebhook() {
  const [, setLogs] = useAtom($logs)
  const [randomURL] = useAtom($randomUrl)
  const { VITE_WS_HOST, VITE_WS_PATH } = import.meta.env

  useEffect(() => {
    if (randomURL === '') {
      return
    }
    const echo = new Echo({
      host: VITE_WS_HOST,
      path: `${VITE_WS_PATH}/socket.io`,
      broadcaster: "socket.io",
      client: socketio,
      // encrypted: false,
      transports: ["websocket"],
    });


    echo.channel(`${randomURL}-webhook-log-event`)
      .listen('.webhookLogEvent', (e) => {
        const stored = JSON.parse(localStorage.getItem('bit_rID') || '{}')
        if (!Object.hasOwn(stored, e.id)) {
          stored[e.id] = 0
          localStorage.setItem('bit_rID', JSON.stringify(stored))
          setLogs([{ id: e.id, webhook_details: e.webhook_details, seen: 0 }, ...JSON.parse(localStorage.getItem('bit_webhook_logs') || '[]')])
        }
      })
    return () => {
      echo.disconnect()
    }
  }, [randomURL])
}