import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {useAuthStore} from "./core/user-store.ts";
import {auth} from "./core/firebase.ts";
import AppRouter from "./AppRouter.tsx";
import {PrimeReactProvider} from "primereact/api";
import {ProgressSpinner} from "primereact/progressspinner";

function App() {
    const setUser = useAuthStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, [setUser]);

    if (loading) return <div className="flex align-items-center justify-content-center h-screen">
        <ProgressSpinner />
    </div>;

    return <PrimeReactProvider>
        <AppRouter/>
    </PrimeReactProvider>;
}

export default App;