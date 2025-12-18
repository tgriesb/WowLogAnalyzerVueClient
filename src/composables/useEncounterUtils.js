
import { computed } from 'vue'
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from "echarts/components";

/**
 * Shared utility composable for Encounter views.
 */
export function useEncounterUtils() {

    /**
     * Registers required ECharts components.
     * Call this at the top of setup().
     */
    const registerChartComponents = () => {
        use([
            CanvasRenderer,
            LineChart,
            TitleComponent,
            TooltipComponent,
            LegendComponent,
            GridComponent
        ])
    }

    /**
     * Formats a number with commas and specified decimals.
     */
    const formatNumber = (number, decimals = 2) => {
        if (number === undefined || number === null) return '0';
        return number.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    /**
     * Calculates encounter duration in seconds.
     */
    const getEncounterDuration = (encounterDetails) => {
        if (encounterDetails && encounterDetails.value && encounterDetails.value['duration']) {
            const parts = encounterDetails.value['duration'].split(':')
            const minutes = parseInt(parts[0], 10)
            const seconds = parseInt(parts[1], 10)
            return (minutes * 60) + seconds
        }
        return 1 // Avoid division by zero
    }

    /**
     * Returns base chart options for encounter statistics.
     */

    const getBaseChartOptions = (statisticsPerInterval, yAxisName = 'Per Second') => {
        return {
            tooltip: { trigger: 'axis' },
            backgroundColor: '#202020',
            grid: {
                left: '2%',
                right: '2%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: statisticsPerInterval.value.map(p => p.secondsInterval),
                name: ''
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameLocation: 'middle',
                nameRotate: 90,
                position: 'left',
                nameGap: 80,
                boundaryGap: false,
                splitLine: {
                    lineStyle: {
                        color: '#333'
                    }
                }
            }
        }
    }

    return {
        registerChartComponents,
        formatNumber,
        getEncounterDuration,
        getBaseChartOptions
    }
}
