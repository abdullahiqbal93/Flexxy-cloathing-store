import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/lib/store/index.js'
import { Toaster as Toast } from 'sonner';
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (import.meta.env.VITE_NODE_ENV === 'production') {
    disableReactDevTools()
}


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
            <Toast/>
        </BrowserRouter>
    </Provider>


)
