import { createContext, useState } from "react"

export const AuthContext = createContext({
    token:'',
    isAuthenticated:false, //Giriş bilgileri doğrumu
    authenticate:(token)=>{}, 
    logout:()=>{},

})

function AuthContextProvider({children}) {
    const [authToken, setAuthToken] = useState(null)

    function authenticate(token) {
        setAuthToken(token);
    }

    function logout(token) { //çıkış yapınca geçerli olacak değerler
        setAuthToken(null);
    }

    const value={ //globalde geçerli olacak değerler
        token: authToken,
        isAuthenticated:!!authToken,//token değerleri varsa true yoksa false döner
        authenticate:authenticate,
        logout:logout,
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export default AuthContextProvider;