interface Props {
  text: string;
}

const GradientButton = (props: Props) => {
  const { text } = props;
  return (
  <button className="gradient-button">
    {text}
  </button>
  )
};

export default GradientButton;
