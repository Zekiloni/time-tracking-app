import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {useAuthStore} from "./core/user-store.ts";
import {auth} from "./core/firebase.ts";
import AppRouter from "./AppRouter.tsx";
import {PrimeReactProvider} from "primereact/api";

function App() {
    const setUser = useAuthStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, [setUser]);

    if (loading) return <p>Loading...</p>;

    return <PrimeReactProvider>
        <AppRouter/>
    </PrimeReactProvider>;
}

export default App;