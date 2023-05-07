import { TPPUndoGraphDatasetsConfig } from "@/@types/note";
import { styled } from '@mui/material/styles';
import { Slider } from "@mui/material";

export const xLabels: number[] = [...Array(21)].map((_, i) => Math.round((i*0.05)*100)/100);

export const datasetsConfig: TPPUndoGraphDatasetsConfig = {
  label: "ストローク数",
  borderColor: "#00b3ff",
  backgroundColor: "#9e4c9833",
  pointBackgroundColor: "#f9fafa",
  fill: true,
  smooth: true,
  tension: 0.4,
}

export const options: {} = {
  maintainAspectRatio: false,
  plugins: {
    legend:{
      display:false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#f9fafa",
      },
      title: {
        color: "#f9fafa",
        display: true,
        text: "筆圧値",
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#f9fafa",
      },
      title: {
        color: "#f9fafa",
        display: true,
        text: "ストローク数",
      }
    }
  },
}

export const PrettoSlider = styled(Slider)({
  color: 'rgba(142, 84, 219, 1)',
  height: 12,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    color: '#cc66ff',
    opacity: 0.1,
  },
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#ddd',
    border: '4px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#ac46df',
    
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});