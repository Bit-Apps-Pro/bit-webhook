import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import {ChakraProvider} from '@chakra-ui/react'
import Master from './Pages/Layouts/Master'

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page =resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'))
        page.layout=page.layout || Master
        return page
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
        <ChakraProvider>
            <App {...props} />
        </ChakraProvider>
        );
    },
});

InertiaProgress.init({ color: '#4B5563' });
