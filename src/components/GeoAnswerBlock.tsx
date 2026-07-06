interface GeoAnswerBlockProps {
  answer: string;
}

export default function GeoAnswerBlock({ answer }: GeoAnswerBlockProps) {
  return (
    <div
      style={{
        background: "rgba(232, 68, 90, 0.05)",
        borderLeft: "3px solid #e8445a",
        borderRadius: "0 8px 8px 0",
        padding: "16px 20px",
        marginBottom: "24px",
        color: "#a8a8b3",
        fontSize: "15px",
        lineHeight: "1.7",
      }}
    >
      {answer}
    </div>
  );
}
