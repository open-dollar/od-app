export default function TransactionSpinner({ color = '#FFFFFF', ...rest }) {
    return (
        <svg
            id="transaction-pending"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 112 112"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            height="14"
            width="14"
            {...rest}
        >
            <style>
                {`
        #transaction-pending-u-line_tr {animation: transaction-pending-u-line_tr__tr 1600ms linear infinite normal forwards}
        @keyframes transaction-pending-u-line_tr__tr { 0% {transform: translate(55.999999px,55.999998px) rotate(0deg)} 50% {transform: translate(55.999999px,55.999998px) rotate(0deg);animation-timing-function: cubic-bezier(0.77,0,0.175,1)} 100% {transform: translate(55.999999px,55.999998px) rotate(360deg)}}
        #transaction-pending-u-line {animation: transaction-pending-u-line_c_o 1600ms linear infinite normal forwards}
        @keyframes transaction-pending-u-line_c_o { 0% {opacity: 0} 6.25% {opacity: 0} 12.5% {opacity: 1} 62.5% {opacity: 1;animation-timing-function: cubic-bezier(0.455,0.03,0.515,0.955)} 100% {opacity: 0}}
        #transaction-pending-u-05 {animation: transaction-pending-u-05_s_do 1600ms linear infinite normal forwards}
        @keyframes transaction-pending-u-05_s_do { 0% {stroke-dashoffset: 16.966138} 25% {stroke-dashoffset: 16.966138;animation-timing-function: cubic-bezier(0.27,0.02,0.335,0.995)} 68.75% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 0}}
        #transaction-pending-u-04 {animation: transaction-pending-u-04_s_do 1600ms linear infinite normal forwards}
        @keyframes transaction-pending-u-04_s_do { 0% {stroke-dashoffset: 7.689743} 18.75% {stroke-dashoffset: 7.689743;animation-timing-function: cubic-bezier(0.455,0.03,0.515,0.955)} 37.5% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 0}}
        #transaction-pending-u-03 {animation: transaction-pending-u-03_s_do 1600ms linear infinite normal forwards}
        @keyframes transaction-pending-u-03_s_do { 0% {stroke-dashoffset: 3.839496} 12.5% {stroke-dashoffset: 3.839496;animation-timing-function: cubic-bezier(0.645,0.045,0.355,1)} 25% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 0}}
        #transaction-pending-u-02 {animation: transaction-pending-u-02_s_do 1600ms linear infinite normal forwards}
        @keyframes transaction-pending-u-02_s_do { 0% {stroke-dashoffset: 0.649135} 6.25% {stroke-dashoffset: 0.649135;animation-timing-function: cubic-bezier(0.645,0.045,0.355,1)} 18.75% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 0}}
        #transaction-pending-u-01 {animation-name: transaction-pending-u-01_c_o, transaction-pending-u-01_s_do;animation-duration: 1600ms;animation-fill-mode: forwards;animation-timing-function: linear;animation-direction: normal;animation-iteration-count: infinite;}
        @keyframes transaction-pending-u-01_c_o { 0% {opacity: 0;animation-timing-function: cubic-bezier(0.645,0.045,0.355,1)} 12.5% {opacity: 1} 100% {opacity: 1}}
        @keyframes transaction-pending-u-01_s_do { 0% {stroke-dashoffset: 0.054686} 12.5% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 0}}
      `}
            </style>
            <g id="transaction-pending-u-line_tr">
                <g
                    id="transaction-pending-u-line"
                    transform="scale(8.079886,8.079886) translate(-8.959797,-8.979206)"
                    opacity="0"
                >
                    <path
                        id="transaction-pending-u-05"
                        d="M3.94,13.05c-2.27-2.78-1.85-6.87,.93-9.13c1.85-1.51,4.29-1.83,6.38-1.05"
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDashoffset="16.966138"
                        strokeDasharray="16.966138"
                    />
                    <path
                        id="transaction-pending-u-04"
                        d="M13.05,14c-1.28,1.06-2.96,1.64-4.74,1.47-.89-.08-1.72-.34-2.47-.74"
                        opacity="0.8"
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDashoffset="7.689743"
                        strokeDasharray="7.689743"
                    />
                    <path
                        id="transaction-pending-u-03"
                        d="M15.43,8.5c.08,1.31-.24,2.59-.88,3.68"
                        opacity="0.7"
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDashoffset="3.839496"
                        strokeDasharray="3.839496"
                    />
                    <path
                        id="transaction-pending-u-02"
                        d="M14.63,5.93c.1.19.19.39.27.59"
                        opacity="0.6"
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDashoffset="0.649135"
                        strokeDasharray="0.649135"
                    />
                    <path
                        id="transaction-pending-u-01"
                        d="M13.2,4.09c0,0,.01,0,0-.02s0-.01-.02,0"
                        opacity="0"
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDashoffset="0.054686"
                        strokeDasharray="0.054686"
                    />
                </g>
            </g>
        </svg>
    )
}
