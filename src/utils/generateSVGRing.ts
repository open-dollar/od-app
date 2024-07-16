import { ratioChecker } from '~/utils/helper'

interface Values {
    collateralizationRatio: string | number
    liqRatio: number
    safetyRatio: number
}

const calculateColor = (riskStatus: string): string => {
    switch (riskStatus) {
        case 'LIQUIDATION':
            return '#E45200'
        case 'HIGH':
            return '#E45200'
        case 'ELEVATED':
            return '#FCBF3B'
        case 'LOW':
            return '#459d00'
        case 'NO':
            return '#5DBA14'
        default:
            return '#459d00'
    }
}

const calculateRiskStatusText = (riskStatusNumeric: number): string => {
    switch (riskStatusNumeric) {
        case 0:
            return 'NO'
        case 1:
            return 'LOW'
        case 2:
            return 'ELEVATED'
        case 3:
            return 'HIGH'
        case 4:
            return 'LIQUIDATION'
        default:
            return 'LOW'
    }
}

export const generateSVGRing = (values: Values, width: number, height: number): string => {
    const { collateralizationRatio, liqRatio, safetyRatio } = values

    const riskStatusNumeric = ratioChecker(collateralizationRatio as number, liqRatio, safetyRatio)
    let riskStatus: string

    riskStatus = calculateRiskStatusText(riskStatusNumeric)

    const actualBackgroundGradientColor = calculateColor(riskStatus)

    let strokeDashArrayValue = parseFloat(collateralizationRatio.toString())

    if ((strokeDashArrayValue <= 100 && strokeDashArrayValue !== 0) || strokeDashArrayValue >= 200) {
        strokeDashArrayValue = 100
    } else if (strokeDashArrayValue === 0) {
        strokeDashArrayValue = 0
    } else {
        strokeDashArrayValue = strokeDashArrayValue - 100
    }

    const ringParts = [
        `
    <svg width="${width}" height="${height}" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <style>
            .graph-bg {
                fill: none;
                stroke: #000;
                stroke-width: 20;
                opacity: 80%;
            }

            .graph {
                fill: none;
                stroke-width: 20;
                stroke-linecap: round;
                animation: progress 1s ease-out forwards;
            }

            .chart {
                stroke: ${actualBackgroundGradientColor};
                opacity: 40%;
            }

            @keyframes progress {
                0% {
                    stroke-dasharray: 0 1005;
                }
            }

            @keyframes liquidation {
                0% {
                    opacity: 80%;
                }

                50% {
                    opacity: 20%;
                }

                100% {
                    opacity: 80%;
                }
            }
        </style>
        <g class="chart">
            <path class="graph-bg" d="M210 40a160 160 0 0 1 0 320 160 160 0 0 1 0-320"/>
            <path class="graph" stroke-dasharray="${strokeDashArrayValue}, 1005"
                  d="M210 40a160 160 0 0 1 0 320 160 160 0 0 1 0-320"/>
        </g>
    </svg>`,
    ]

    return ringParts.join('')
}
