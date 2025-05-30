import "./globals.css";
import ProviderRedux from "./provider";

export const metadata = {
  title: "ReeOrg",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProviderRedux>{children}</ProviderRedux>
      </body>
    </html>
  );
}
