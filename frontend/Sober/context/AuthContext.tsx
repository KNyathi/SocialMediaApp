import { createContext, PropsWithChildren, useState, useContext, useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [authToken, setAuthToken]  = useState<string | null>(null);
  const segment = useSegments();
  const router = useRouter();
  
  console.log("AuthToken: ", authToken);
  
  useEffect( () => {
     const isAuthGroup = segments[0] ==='(auth)';
     
     if (!authToken && !isAuthGroup) {
       console.log("User is not yet authenticated and cannot see this page.");
       router.replace('/signIn');
     } 
     
     if (authToken && isAuthGroup) {
       router.replace('/');
     }
  }, [segments, authToken]);
  
  
  useEffect ( () => {
     const loadAuthToken = async () => {
       const res = await SecureStore.getItemAsync('authToken');
       if (res) {
          setAuthToken(res);
       }
       
     };
     loadAuthToken();
  }, []);
  
  
  const updateAuthToken = async (newToken: string) => {
    await SecureStore.setItemAsync('authToken', newToken);
    setAuthToken(newToken);
   
  };
  
  return (
      <AuthContext.Provider value={{ authToken, updateAuthToken }}>
        {children} 
      </AuthContext.Provider>;
  );
};

export default AuthContextProvider;

export const useAuth = () => useContext(AuthContext);
