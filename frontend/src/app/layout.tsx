import { authOptions } from "auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReduxProvider } from "./context/ReduxToolkitProvider";
import Provider from "./context/client-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Inov",
  description: "Inov Web 3.0 file transfering",
};
export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Provider session={session}>{children}</Provider>
        </ReduxProvider>
        <ToastContainer
          style={{
            // Custom styles
            width: "30rem",
          }}
        />
      </body>
    </html>
  );
}
