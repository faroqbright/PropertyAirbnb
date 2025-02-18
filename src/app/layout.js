// Do NOT add "use client"
import RootLayout from "../Components/RootLayout";  // Ensure the casing matches the file

export const metadata = {
  title: "CoLivers",
  description: "Generated by create next app",
};

export default function Layout({ children }) {
  return <RootLayout>{children}</RootLayout>;
}
