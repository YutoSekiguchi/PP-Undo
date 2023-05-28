export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  purple: 'rgb(153, 102, 255)',
  green: 'rgb(75, 192, 192)',
  yellow: 'rgb(255, 205, 86)',
  blue: 'rgb(54, 162, 235)',
  grey: 'rgb(201, 203, 207)',
  orange: 'rgb(255, 159, 64)',
};

const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.purple,
  CHART_COLORS.green,
  CHART_COLORS.yellow,
  CHART_COLORS.blue,
  CHART_COLORS.grey,
  CHART_COLORS.orange,
];


export const namedColor = (index: number) => {
  return NAMED_COLORS[index % NAMED_COLORS.length];
}