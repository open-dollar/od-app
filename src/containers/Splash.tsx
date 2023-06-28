import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import kite from '~/assets/splash/kite.png'

const options = ['OPTIMISM...', 'LIQUID ETH...', 'ETH...', 'WETH']

const Splash = () => {
    const history = useHistory()

    const [title, setTitle] = useState(options[0])

    useEffect(() => {
        const options = ['OPTIMISM', 'ETHEREUM', 'LSDs', 'UNISWAP', '???']
        let currentIndex = 0

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % options.length
            setTitle(options[currentIndex])
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-white">
            <div className="lg:grid lg:grid-cols-12 ">
                <div className="col-span-12 md:col-span-6  h-screen flex flex-col items-end">
                    <div className="lg:hidden bg-sky w-full flex flex-col items-center py-8">
                        <img
                            className="h-24 w-24 lg:h-48 lg:w-48"
                            src={require('../assets/splash/partly-cloudy.svg').default}
                            alt={''}
                        />
                    </div>
                    <div className="lg:max-w-split  w-full h-full flex flex-col items-center justify-center">
                        <div>
                            <h1 className="text-egg font-semibold font-poppins text-7xl">GET HAI ON</h1>
                            <h1 className="text-black font-normal mt-10 text-6xl">{title}</h1>
                            <button
                                type="button"
                                className="rounded-2xl mt-8 bg-egg px-14 py-2.5 text-lg font-normal text-white "
                                onClick={() => history.push('/safes')}
                            >
                                LAUNCH APP
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 bg-sky hidden lg:block">
                    <div className="lg:max-w-split  h-full flex flex-col items-center justify-center">
                        <img
                            className="h-24 w-24 lg:h-48 lg:w-48"
                            src={require('../assets/splash/partly-cloudy.svg').default}
                            alt={''}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-egg">
                <div className="max-w-7xl mx-auto flex flex-col items-center ">
                    <h1 className="text-white max-w-3xl py-36 font-normal text-center  text-3xl md:text-4xl lg:text-5xl">
                        HAI is a multi-collateral controlled-peg stable asset that puts decentralization first
                    </h1>
                </div>
            </div>
            <div className="lg:grid lg:grid-cols-12 max-w-7xl mx-auto mt-16">
                <div className="col-span-6  flex flex-col items-center justify-center">
                    <h1 className="text-black max-w-md md:max-w-xl mx-6 font-poppins  text-2xl md:text-3xl text-center">
                        Borrow HAI against ETH, Liquid Staked ETH, and OP
                    </h1>
                </div>
                <div className="col-span-6 flex flex-row items-center justify-center space-x-20 md:space-x-36 mt-16 lg:mt-0">
                    <div className="space-y-6 lg:py-0">
                        <div className="relative">
                            <img
                                className="h-16 w-16 md:h-20 md:w-20 relative z-10"
                                src={require('../assets/splash/optimism.svg').default}
                                alt={''}
                            />
                            <div
                                className="absolute w-40 md:w-48 border border-egg left-4 md:left-12"
                                style={{
                                    transform: 'rotate(30deg)',
                                }}
                            />
                        </div>
                        <div className="relative">
                            <img
                                className="h-16 w-16 md:h-20 md:w-20 z-10 relative"
                                src={require('../assets/splash/liquid-eth.svg').default}
                                alt={''}
                            />
                            <div
                                className="absolute w-40 md:w-48 border border-egg left-0 top-1/2"
                                style={{
                                    left: '65px',
                                }}
                            />
                        </div>
                        <div className="relative">
                            <img
                                className="h-16 w-16 md:h-20 md:w-20 z-10 relative"
                                src={require('../assets/splash/eth.svg').default}
                                alt={''}
                            />
                            <div
                                className="absolute md:left-14 bottom-14 md:bottom-20 w-48 md:w-48 border border-egg"
                                style={{
                                    transform: 'rotate(-30deg)',
                                }}
                            />
                        </div>
                    </div>
                    <div className="bg-sky h-24 w-24 lg:h-32 lg:w-32 rounded-full flex flex-col items-center justify-center z-10">
                        <img
                            className="h-14 w-14 lg:h-16 lg:w-16"
                            src={require('../assets/splash/partly-cloudy.svg').default}
                            alt={''}
                        />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-16">
                <div className="lg:grid lg:grid-cols-12 ">
                    <div className="col-span-12 lg:col-span-6  flex flex-col items-center justify-center ">
                        <h1 className="text-black max-w-md md:max-w-xl mx-6 font-poppins  text-2xl md:text-3xl text-center">
                            A community of KITE token holders govern what collateral can be used to mint HAI
                        </h1>
                    </div>
                    <div className="col-span-12 lg:col-span-6  flex flex-col items-center  order-first mt-16 lg:mt-0">
                        <div className="rounded-full bg-egg h-52 w-52 lg:h-80 lg:w-80 flex flex-col items-center justify-center">
                            <div className="rounded-full bg-white h-48 w-48 lg:h-72 lg:w-72 flex flex-col items-center justify-center">
                                <img className="h-40 lg:h-60 relative z-10" src={kite} alt={''} />
                            </div>
                        </div>
                    </div>{' '}
                </div>
            </div>
            <div className="max-w-7xl mx-auto">
                <div className=" flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-12 items-center mt-16 mx-8">
                    <div className="flex flex-col border border-sky rounded-2xl p-8 max-w-xl">
                        <div className="h-10 w-10 bg-egg rounded-full"></div>
                        <h3 className="text-black font-poppins font-medium text-xl mt-2">Pre-Agreed Upon Exit Rates</h3>
                        <p className="text-gray-500 font-poppins font-normal text-base mt-3">
                            The Anti Bank-Run stable. HAI was designed to withstand the worst of market conditions.
                        </p>
                    </div>
                    <div className="flex flex-col border border-sky rounded-2xl p-8 max-w-xl">
                        <div className="h-10 w-10 bg-egg rounded-full"></div>
                        <h3 className="text-black font-poppins font-medium text-xl mt-2">Controlled-Peg Stability</h3>
                        <p className="text-gray-500 font-poppins font-normal text-base mt-3">
                            Let’s face it. People suck. The interest rate for HAI loans is set automagically by a PID
                            controller.
                        </p>
                    </div>
                    <div className="flex flex-col border border-sky rounded-2xl p-8 max-w-xl">
                        <div className="h-10 w-10 bg-egg rounded-full"></div>
                        <h3 className="text-black font-poppins font-medium text-xl mt-2">Decentralization First</h3>
                        <p className="text-gray-500 font-poppins font-normal text-base mt-3">
                            HAI is DAO run from day 1. Governance will determine what collateral is added.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-ful flex flex-col items-center mt-8 py-16">
                <div className="flex flex-row space-x-4">
                    <a href="https://twitter.com/letsgethai" rel="noreferrer" target="_blank">
                        <div className="h-14 w-14 bg-egg rounded-full flex flex-col items-center justify-center">
                            <img className="h-8 w-8" src={require('../assets/splash/twitter.svg').default} alt={''} />
                        </div>
                    </a>
                    <a href="https://discord.gg/pX8m6zXNKu" rel="noreferrer" target="_blank">
                        <div className="h-14 w-14 bg-egg rounded-full flex flex-col items-center justify-center">
                            <img className="h-8 w-8" src={require('../assets/splash/discord.svg').default} alt={''} />
                        </div>
                    </a>
                </div>
            </div>
        </div>
        // </div>
    )
}

export default Splash
