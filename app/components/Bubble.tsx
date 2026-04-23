const Bubble = ({ message }) => {
  const { parts, role } = message;

  const text = parts
    ?.filter((part) => part.type === "text")
    ?.map((part) => part.text)
    ?.join("");

  return <div className={`${role} bubble`}>{text}</div>;
};

export default Bubble;
