// useCookies.js
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useCookies = (cookieName) => {
    const [cookieValue, setCookieValue] = useState(Cookies.get(cookieName));

    useEffect(() => {
        setCookieValue(Cookies.get(cookieName));
    }, [cookieName]);

    const setCookie = (value, options = {}) => {
        Cookies.set(cookieName, value, options);
        setCookieValue(value);
    };

    const getCookie = () => {
        return Cookies.get(cookieName);
    };

    const removeCookie = () => {
        Cookies.remove(cookieName);
        setCookieValue(null);
    };

    return {
        cookieValue,
        setCookie,
        getCookie,
        removeCookie,
    };
};

export default useCookies;
