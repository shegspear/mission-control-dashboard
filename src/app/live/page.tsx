"use client";

import Layout from '@/components/Layout'
import DonutChart from '@/components/DonutChart/DonutChart'
import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket"

export default function Home() {
  const WS_URL = "wss://webfrontendassignment-isaraerospace.azurewebsites.net/api/SpectrumWS";
  const { sendJsonMessage, lastJsonMessage, readyState }:any = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )
  const [vel, setVel] = useState(0)
  const velAnti = 100
  const [alti, setAlti] = useState(0)
  const altiAnti = 60000
  const [temp, setTemp] = useState(0)
  const tempAnti = 100
  const [msg, setMsg] = useState('')
  const [isAs, setIsAs] = useState(false)
  const [isAction, setIsAction] = useState(false)
  const [loading, setIsLoading] = useState(false)


  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed")
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        data: {
          channel: "general-chatroom",
        },
      })
    }
  }, [readyState])

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    // console.log(`Got a new message: ${lastJsonMessage}`)
    let res = {...lastJsonMessage}
    // console.log(res)
    // const {
    //   Velocity,
    //   Altitude,
    //   IsActionRequired,
    //   IsAscending,
    //   StatusMessage,
    //   Temperature,
    // }:any = lastJsonMessage
    setVel(res.Velocity)
    setAlti(res.Altitude)
    setTemp(res.Temperature)
    setMsg(res.StatusMessage)
    setIsAs(res.IsAscending)
    setIsAction(res.IsActionRequired)
  }, [lastJsonMessage])

  return (
    <main className="max-w-8xl min-h-screen p-20">
      <Layout>
        {
          loading ? (
            <h4>
              Loading...
            </h4>
          ) : (
            <div
        >
          <h1
            className='font-normal text-lg w-full text-center mb-10'
          >
            Mission Control Dashboard
          </h1>

          <h1
            className='font-medium text-2xl w-full text-center mb-10'
          >
            Status update : {msg}
          </h1>

          <div
            className='flex lg:flex-row flex-col lg:justify-between justify-center mb-10'
          >
            <div>
              <h4 className='text-center'>{vel}</h4>
              <DonutChart
                // labels={labels}
                labels={['Vehicle velocity', 'ren']}
                sliceColors={['#246FFF', '#D3D3D3']}
                data={[
                  {label: 'Vehicle velocity', value: (vel < 0) ? Number(vel.toString().substring(1)) : vel},
                  {label: 'ren', value: (velAnti - vel)}
                ]}
                getTooltipLabel={() => {return(vel)}}
              />
            </div>

            <div>
              <h4 className='text-center'>{alti}</h4>
              <DonutChart
                // labels={labels}
                labels={['Altitude', 'ren']}
                sliceColors={['#FFBC65', '#D3D3D3']}
                data={[
                  {label: 'Altitude', value: Number(alti?.toString().substring(1))},
                  {label: 'ren', value: (altiAnti - alti)}
                ]}
                getTooltipLabel={() => {return(alti)}}
              />
            </div>


            <div>
              <h4 className='text-center'>{temp}</h4>
              <DonutChart
                // labels={labels}
                labels={['Temperature', 'ren']}
                sliceColors={['#7F00FF', '#D3D3D3']}
                data={[
                  {label: 'Temperature', value: temp < 0 ? Number(temp.toString().substring(1)) : temp},
                  {label: 'ren', value: (tempAnti - temp)}
                ]}
                getTooltipLabel={() => {return(temp)}}
              />
            </div>
          </div>

          <div
            className='flex flex-row justify-between items-center'
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input onChange={() => setIsAs(!isAs)} type="checkbox" value="" className="sr-only peer" checked={isAs} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Altitude elevation</span>
            </label>

            {/* <button
              onClick={getData} 
              className="border-2 border-blue-600 bg-transparent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Update dashboard
            </button> */}

            <label className="relative inline-flex items-center cursor-pointer">
              <input onChange={() => setIsAction(!isAction)} type="checkbox" value="" className="sr-only peer" checked={isAction} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Emergency control</span>
            </label>
          </div>

        </div>
          )
        }
      </Layout>
    </main>
  )
}
