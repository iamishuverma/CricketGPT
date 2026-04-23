import "./globals.css"

export const metadata = {
    title: "CricketGPT",
    description: "The place to go for all your Cricket questions!"
}

const RootLayout = ({children}) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout