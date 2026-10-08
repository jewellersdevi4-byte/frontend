import "./globals.css";
export const metadata = {
  title: "Devi Jewellers · Scheme Manager",
  description: "Owner and staff scheme management, Kaup",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
