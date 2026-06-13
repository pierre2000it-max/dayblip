export default function MethodologyNote({ text }: { text: string }) {
  return (
    <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "12px" }}>
      Methodology: {text}
    </p>
  )
}
