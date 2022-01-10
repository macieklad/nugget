// Provider.js
import { createContext, Dispatch, Reducer, useContext, useReducer } from 'react'
import { ProcessModel } from '../lib/api/types'
import React, { useState, useCallback, useEffect } from 'react'
import useWebSocket, { ReadyState, SendMessage } from 'react-use-websocket'

export enum ModelAction {
  REFRESH,
  UPDATE_FILES,
  REMOVE_FILES,
  RENAME,
}

interface Action {
  type: ModelAction
  payload: any
}

const connectionStates = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
}

export const WebsocketContext = createContext({
  lastMessage: {} as MessageEvent<any> | null,
  sendMessage: (() => {}) as SendMessage,
  readyState: -1 as ReadyState,
  messageHistory: [],
  connectionStatus: connectionStates[ReadyState.UNINSTANTIATED],
  getWebSocket: (() => null) as ReturnType<typeof useWebSocket>['getWebSocket'],
  sessionID: '',
})

export const WebsocketContextProvider: React.ComponentType = (props) => {
  const [socketUrl] = useState('ws://localhost:5001')
  const [messageHistory, setMessageHistory] = useState([])
  const [sessionID, setSessionID] = useState('')

  const { sendMessage, lastMessage, readyState, getWebSocket } =
    useWebSocket(socketUrl)

  useEffect(() => {
    const socket = getWebSocket()

    if (socket) {
      /** @ts-ignore */
      socket?.onmessage((ev) => {
        if (ev?.data.startsWith('key:')) {
          setSessionID(ev.data.slice(4))
        }
      })
    }

    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage as any))
    }
  }, [lastMessage, setMessageHistory, getWebSocket])

  const connectionStatus = connectionStates[readyState]

  return (
    <WebsocketContext.Provider
      value={{
        sendMessage,
        lastMessage,
        readyState,
        messageHistory,
        connectionStatus,
        getWebSocket,
        sessionID,
      }}
    >
      {props.children}
    </WebsocketContext.Provider>
  )
}

export const useWebsocketContext = () => useContext(WebsocketContext)
