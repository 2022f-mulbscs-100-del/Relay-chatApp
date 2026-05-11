import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './context/SocketProvider.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import { MessageProvider } from './context/MessageProvider.tsx'
import { GroupProvider } from './context/GroupProvider.tsx'
import { UserProvider } from './context/UserProvider.tsx'
import { ThemeProvider } from './context/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <UserProvider>
            <GroupProvider>
                <MessageProvider>
                    <AuthProvider>
                        <SocketProvider>
                            <App />
                        </SocketProvider>
                    </AuthProvider>
                </MessageProvider>
            </GroupProvider>
        </UserProvider>
    </ThemeProvider>
)
