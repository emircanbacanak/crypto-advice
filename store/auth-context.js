import { createContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
    token: '',
    isAuthenticated: false, //Giriş bilgileri doğrumu
    authenticate: (token) => { },
    logout: () => { },
})

function AuthContextProvider({ children }) {
    const [authToken, setAuthToken] = useState(null)

    useEffect(() => {

        async function fenchtoken() {
            const storedToken = await AsyncStorage.getItem('token')
            if (storedToken) {
                setAuthToken(storedToken);
            }
        }
        fenchtoken();
    }, [])//köşeli parantez bir kere çalışmasını sağlar

    function authenticate(token) {
        setAuthToken(token);
        AsyncStorage.setItem('token', token) //Giriş bilgileri kaydetme
    }

    function logout(token) { //çıkış yapınca geçerli olacak değerler
        setAuthToken(null);
        AsyncStorage.removeItem('token') //Çıkış yapınca bilgileri silme
    }

    const value = { //globalde geçerli olacak değerler
        token: authToken,
        isAuthenticated: !!authToken,//token değerleri varsa true yoksa false döner
        authenticate: authenticate,
        logout: logout,
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export default AuthContextProvider;