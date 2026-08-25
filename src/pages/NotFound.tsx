import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "#0E0E0E" }}
    >
      <p
        className="font-mono font-bold text-[3rem] tracking-tight"
        style={{ color: "#BD9DFF" }}
      >
        404
      </p>
      <p className="text-sm" style={{ color: "#71717A" }}>
        This page doesn't exist.
      </p>
      <Link
        to="/"
        className="text-sm font-medium px-4 py-2 rounded-xl text-white mt-2"
        style={{ background: "linear-gradient(135deg, #BD9DFF, #8A4CFC)" }}
      >
        Back to home
      </Link>
    </div>
  );
}
